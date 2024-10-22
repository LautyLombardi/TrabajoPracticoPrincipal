import os
import cv2
import numpy as np
from deepface import DeepFace
from utils.images import bytes_to_image_array

current_directory = os.path.dirname(os.path.realpath(__file__))

def check_face(frame,storage):
    imageStorage = os.path.join(current_directory, storage)
    print(imageStorage)
    try:

        # Decodificar la imagenes
        if hasattr(frame, 'read'):
            frame_data = frame.read() 
            nparr = np.fromstring(frame_data, np.uint8)  
            frame_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  
            frame = frame_np
        else:
            # Si frame no es un objeto FileStorage, asumimos que es una ruta de archivo
            frame = cv2.imread(frame)

        dff = DeepFace.find(frame, imageStorage) 
        faceDB = dff[0].get("identity")
        reference_img = cv2.imread(str(faceDB[0])) 
        if DeepFace.verify(frame, reference_img)['verified']:
            return extractDni(str(faceDB[0]))
        
    except Exception as error:
        print("Error en la verificación facial:", error)
        return None
    
    return False

def extractDni(imageName):
    try:
        # Dividir el nombre del archivo en partes separadas por '_'
        parts = imageName.split('_')
        # El último elemento después de dividir será el número de documento (DNI)
        dni = parts[-1].split('.')[0]  # Quita la extensión '.jpg' del DNI
        
        return dni
    except Exception as e:
        print("Error al extraer el DNI:", e)
        return None
