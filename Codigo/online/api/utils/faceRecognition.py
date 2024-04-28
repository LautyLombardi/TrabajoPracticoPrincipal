import cv2
from deepface import DeepFace

#change base de datos por utilsimage
def check_face(frame):
    try:
        dff = DeepFace.find(frame, db) 
        faceDB = dff[0].get("identity")
        reference_img = cv2.imread(str(faceDB[0])) 
        if DeepFace.verify(frame, reference_img)['verified']:
            print('pablo')
            return True
        
        else:
            print("pablon't")
            return False
    except ValueError:
        return False
