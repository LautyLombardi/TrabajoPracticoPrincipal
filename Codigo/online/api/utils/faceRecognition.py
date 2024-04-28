import cv2
from deepface import DeepFace
import sqlite3
from PIL import Image
from io import BytesIO

# Conexión a la base de datos
conn = sqlite3.connect('dataBase.db')
cursor = conn.cursor()

# Método para extraer todas las imágenes de la tabla PersonsImages
def extract_images_from_db():
    images = []
    try:
        cursor.execute("SELECT photo FROM PersonsImages")
        rows = cursor.fetchall()
        for row in rows:
            # Convertir los bytes de la imagen a un objeto de imagen
            image_bytes = row[0]
            image = Image.open(BytesIO(image_bytes))
            images.append(image)
    except sqlite3.Error as e:
        print("Error al extraer imágenes de la base de datos:", e)
    return images

# Integrar las imágenes en la variable db
db = extract_images_from_db()

# Cerrar la conexión a la base de datos
conn.close()

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




