from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
import pandas as pd
import numpy as np
import datetime
import jwt

# Import modules from each service
from services.face_recognition_service import setup_face_recognition, register_routes as register_face_routes
from services.stock_price_service import setup_stock_price, register_routes as register_stock_routes
from services.invoice_service import setup_invoice, register_routes as register_invoice_routes
from services.prediction_service import setup_prediction, register_routes as register_prediction_routes

app = Flask(__name__)
CORS(app)

# Load configuration
from config import Config
app.config.from_object(Config)

# After loading the config
print(f"Using MongoDB URI: {app.config['MONGO_URI']}")
# Setup MongoDB connection
client = MongoClient(app.config['MONGO_URI'])
db = client.get_default_database()

# Setup services
setup_face_recognition(app, db)
setup_stock_price(app, db)
setup_invoice(app, db)
setup_prediction(app, db)

# Register routes for each service
register_face_routes(app)
register_stock_routes(app)
register_invoice_routes(app)
register_prediction_routes(app)

@app.route('/')
def index():
    return jsonify({
        'status': 'online',
        'services': [
            'Face Recognition API',
            'Stock Price Prediction API',
            'Invoice Smart API',
            'Consumption Prediction API'
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)