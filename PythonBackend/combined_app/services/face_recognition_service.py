from flask import request, jsonify
import os
import numpy as np
import datetime
import jwt
import face_recognition
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId

# Global variables
face_app = None
face_db = None
users = None
upload_folder = None
allowed_extensions = None
jwt_secret_key = None

def setup_face_recognition(app, db):
    global face_app, face_db, users, upload_folder, allowed_extensions, jwt_secret_key
    face_app = app
    face_db = db
    users = db['users']
    upload_folder = app.config['UPLOAD_FOLDER']
    allowed_extensions = app.config['ALLOWED_EXTENSIONS']
    jwt_secret_key = app.config['JWT_SECRET_KEY']
    
    # Create uploads directory if it doesn't exist
    os.makedirs(upload_folder, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_file(file_storage):
    if file_storage and allowed_file(file_storage.filename):
        fn = secure_filename(file_storage.filename)
        path = os.path.join(upload_folder, fn)
        file_storage.save(path)
        return path
    return None

def get_face_encoding(path):
    img = face_recognition.load_image_file(path)
    encs = face_recognition.face_encodings(img)
    return encs[0] if encs else None

def match_face(unk, known_list, tol=0.6):
    dists = face_recognition.face_distance(known_list, unk)
    idx = np.argmin(dists)
    return idx if dists[idx] <= tol else None

def cleanup_file(path):
    """Remove a file after processing to save disk space"""
    if path and os.path.exists(path):
        try:
            os.remove(path)
            return True
        except Exception as e:
            print(f"Error removing file {path}: {e}")
    return False

def register_routes(app):
    @app.route('/face/register', methods=['POST'])
    def register():
        uid = request.form.get('user_id')
        f = request.files.get('image')
        if not uid or not f: 
            return jsonify({'error':'user_id and image required'}), 400
        
        p = save_file(f)
        if not p: 
            return jsonify({'error':'Invalid file type'}), 400
        
        enc = get_face_encoding(p)
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

    @app.route('/face/recognize', methods=['POST'])
    def recognize():
        f = request.files.get('image')
        device_id = request.form.get('deviceId')
        
        if not f: 
            return jsonify({'error':'image required'}), 400
        if not device_id:
            return jsonify({'error':'deviceId required'}), 400
            
        p = save_file(f)
        if not p: 
            return jsonify({'error':'Invalid file type'}), 400
        
        unk = get_face_encoding(p)
        if unk is None: 
            return jsonify({'error':'No face found'}), 400
        
        # Query the main users collection
        docs = list(users.find({"faceEncoding": {"$exists": True}}))
        
        if not docs:
            cleanup_file(p)  # Clean up the file
            return jsonify({'status':'unknown', 'reason': 'No registered faces found'})
        
        known = [np.array(d['faceEncoding']) for d in docs]
        ids = [str(d['_id']) for d in docs]
        
        i = match_face(unk, known)
        cleanup_file(p)  # Clean up the file
        
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
            
            token = jwt.encode(token_payload, jwt_secret_key, algorithm='HS256')
            
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