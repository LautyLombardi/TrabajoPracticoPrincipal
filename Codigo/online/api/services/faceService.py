from db.db import db
from models.Image import Image
from utils.date import createDate
from utils.faceRecognition import check_face

def validUser(image):
    images = Image.query.all()
    try:
        check_face(image,images)
        
        return True
    except Exception as e:
        return e

