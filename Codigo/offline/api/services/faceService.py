from db.db import db
from models.Image import Image
from utils.date import createDate
from utils.faceRecognition import check_face

def validUser(image):
    try:
        return check_face(image, 'userStorage')
    except Exception as e:
        print("Error en la validación del visitante:", e)
        return None


def validVisitor(image):
    try:
        return check_face(image, 'visitorStorage')
    except Exception as e:
        print("Error en la validación del visitante:", e)
        return None