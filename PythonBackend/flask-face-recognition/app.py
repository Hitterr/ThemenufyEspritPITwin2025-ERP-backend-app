from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import numpy as np, os, jwt, datetime
import recognition, config

app = Flask(__name__)
CORS(app)  # allow cross-origin from React/Express
os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)
try:
    client = MongoClient(config.MONGO_URI)
    db = client.get_default_database()
    users = db['users']
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    # You could implement a fallback or exit gracefully

@app.route('/register', methods=['POST'])
def register():
    uid = request.form.get('user_id')
    f = request.files.get('image')
    if not uid or not f: 
        return jsonify({'error':'user_id and image required'}), 400
    
    p = recognition.save_file(f)
    if not p: 
        return jsonify({'error':'Invalid file type'}), 400
    
    enc = recognition.get_face_encoding(p)
    if enc is None: 
        return jsonify({'error':'No face found'}), 400
    
    # Convert string ID to ObjectId for MongoDB
    try:
        object_id = ObjectId(uid)
        # Update the existing user document
        result = users.update_one(
            {'_id': object_id}, 
            {'$set': {'faceEncoding': enc.tolist()}}, 
            upsert=False  # Don't create a new document if not found
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'User ID not found'}), 404
            
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({'error': 'Invalid user ID format or database error'}), 400
    
    return jsonify({'status':'registered','user_id':uid})
@app.route('/recognize', methods=['POST'])
def recognize():
    f = request.files.get('image')
    device_id = request.form.get('deviceId')
    
    if not f: 
        return jsonify({'error':'image required'}), 400
    if not device_id:
        return jsonify({'error':'deviceId required'}), 400
        
    p = recognition.save_file(f)
    if not p: 
        return jsonify({'error':'Invalid file type'}), 400
    
    unk = recognition.get_face_encoding(p)
    if unk is None: 
        return jsonify({'error':'No face found'}), 400
    
    # Query the main users collection
    docs = list(users.find({"faceEncoding": {"$exists": True}}))
    
    if not docs:
        recognition.cleanup_file(p)  # Clean up the file
        return jsonify({'status':'unknown', 'reason': 'No registered faces found'})
    
    known = [np.array(d['faceEncoding']) for d in docs]
    ids = [str(d['_id']) for d in docs]
    
    i = recognition.match_face(unk, known)
    recognition.cleanup_file(p)  # Clean up the file
    
    if i is not None:
        # Return more user information
        matched_user = docs[i]
        
        # Get user information
        user_id = ids[i]
        first_name = matched_user.get('firstName', matched_user.get('first_name', matched_user.get('firstname', '')))
        last_name = matched_user.get('lastName', matched_user.get('last_name', matched_user.get('lastname', '')))
        email = matched_user.get('email', '')
        
        # Generate JWT token with expiration from config
        token_payload = {
            'userId': user_id,
            'email': email,
            'deviceId': device_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Token expires in 1 day
        }
        
        token = jwt.encode(token_payload, config.JWT_SECRET_KEY, algorithm='HS256')
        
        # Update user's verified devices if the device is not already verified
        # $addToSet ensures the deviceId is only added if it doesn't already exist
        update_result = users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'verifiedDevices': device_id}}
        )
        
        # Log the device verification status
        if update_result.modified_count > 0:
            print(f"Added new device {device_id} to user {user_id}'s verified devices")
        else:
            print(f"Device {device_id} was already verified for user {user_id}")
        
        return jsonify({
            'status': 'recognized',
            'user_id': user_id,
            'firstName': first_name,
            'lastName': last_name,
            'token': token
        })
    else:
        return jsonify({'status':'unknown'})

if __name__=='__main__': 
    app.run(host='0.0.0.0', port=config.PORT)