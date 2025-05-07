import os, numpy as np, face_recognition
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
def allowed_file(filename): return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS
def save_file(file_storage):
    if file_storage and allowed_file(file_storage.filename):
        fn = secure_filename(file_storage.filename)
        path = os.path.join(UPLOAD_FOLDER, fn)
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
