import os
import cv2
import numpy as np
from deepface import DeepFace
from utils.images import bytes_to_image_array

current_directory = os.path.dirname(os.path.realpath(__file__))
save_folder = os.path.join(current_directory, "storage")

def check_face(frame, db):
    # Guardar imágenes en la carpeta
    for image in db:
        photo = bytes_to_image_array(image.photo)
        filepath = os.path.join(save_folder, f"photo_{image.id}.jpg")
        cv2.imwrite(filepath, photo)

    
    try:
        if hasattr(frame, 'read'):
            frame_data = frame.read()  # Leer los datos del archivo
            nparr = np.fromstring(frame_data, np.uint8)  # Convertir los datos en una matriz numpy
            frame_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Decodificar la imagen
            frame = frame_np
        else:
            # Si frame no es un objeto FileStorage, asumimos que es una ruta de archivo
            frame = cv2.imread(frame)
        
        dff = DeepFace.find(frame, save_folder)  # Pasar la lista de rutas de archivo
        faceDB = dff[0].get("identity")
        reference_img = cv2.imread(str(faceDB[0])) 
        if DeepFace.verify(frame, reference_img)['verified']:
            print('pablo')
            return True
        
    except Exception as error:
        print("pablon't exception ", error)
        print()
        return False
    print("pablon't")
    return False
