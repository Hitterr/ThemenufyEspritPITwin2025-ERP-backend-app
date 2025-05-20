import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # MongoDB configuration
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/the-menufy')
    
    # Upload folder for face recognition
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    
    # Allowed file extensions for uploads
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    
    # JWT Secret Key
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
    
    # API Ports (for reference)
    FACE_RECOGNITION_PORT = 5000
    STOCK_PRICE_PORT = 5002
    INVOICE_PORT = 5003
    PREDICTION_PORT = 5001
    
    # Combined app port
    PORT = int(os.getenv("PORT", 5000))