import os
from dotenv import load_dotenv
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://host.docker.internal:27017/the-menufy")
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "TheMenufy@ERP")
PORT = int(os.getenv("PORT", 5000))