from db.db import db
from models.Image import Image
from utils.date import createDate
from utils.faceRecognition import check_face

def validUser(image):
    try:
        if check_face(image,'userStorage'):
            return True
        else:
            return False
    except Exception as e:
        return e

def validVisitor(image):
    try:
        if check_face(image,'visitorStorage'):
            return True
        else:
            return False
        
    except Exception as e:
        return e
