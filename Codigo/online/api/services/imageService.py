import os
import cv2
from db.db import db
from models.Image import Image
from utils.images import bytes_to_image_array
from utils.date import createDate

save_folder = '../utils'

def saveUserImage(image, dni):
    try:
         # Insertar en db 
        image_bytes = image.read()
        image = Image(userId=dni, image=image_bytes)
        db.session.add(image)
        db.session.commit()
        
        photo = bytes_to_image_array(image_bytes)
        filepath = os.path.join(save_folder + '/userStorage', f"photo_{dni}.jpg")
        cv2.imwrite(filepath, photo)
        
        return True
    except Exception as e:
        return e
    
def saveVisitorImage(image, dni):
    try:
         # Insertar en db 
        image_bytes = image.read()
        image = Image(userId=dni, image=image_bytes)
        db.session.add(image)
        db.session.commit()
        
        photo = bytes_to_image_array(image_bytes)
        filepath = os.path.join(save_folder + '/userStorage', f"photo_{dni}.jpg")
        cv2.imwrite(filepath, photo)
        
        return True
    except Exception as e:
        return e
    
    