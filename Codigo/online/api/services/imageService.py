import os
import cv2
from db.db import db
from models.Image import Image
from utils.images import saveUserInStorage, saveVisitorInStorage
from utils.date import createDate

def saveUserImage(image, dni):
    try:
         # Insertar en db 
        image_bytes = image.read()
        image = Image(userId=dni, image=image_bytes)
        db.session.add(image)
        db.session.commit()
        
        saveUserInStorage(image_bytes,dni)

        return True
    except Exception as e:
        return e
    
def saveVisitorImage(image, dni):
    try:
         # Insertar en db 
        image_bytes = image.read()
        image = Image(visitorId=dni, image=image_bytes)
        db.session.add(image)
        db.session.commit()
        
        saveVisitorInStorage(image_bytes,dni)
        
        return True
    except Exception as e:
        return e
    
    