import io
import numpy as np
from PIL import Image
import os
import cv2

current_directory = os.path.dirname(os.path.realpath(__file__))

def image_to_bytes(image_path):

    with open(image_path, 'rb') as file:
        image_bytes = file.read()
    return image_bytes

def bytes_to_image(image_bytes):
    image_bytes_io = io.BytesIO(image_bytes)
    image = Image.open(image_bytes_io)
    return image

def bytes_to_image_array(image_bytes):

  image_bytes_io = io.BytesIO(image_bytes)
  with Image.open(image_bytes_io) as image:    
    if image.mode not in ('RGB', 'RGBA'):
      image = image.convert('RGB')

    image_array = np.asarray(image)

  return image_array

def saveUserInStorage(image_bytes,dni):  
  save_folder = os.path.join(current_directory, "userStorage")
  photo = bytes_to_image_array(image_bytes)
  filepath = os.path.join(save_folder, f"photo_{dni}.jpg")
  cv2.imwrite(filepath, photo)


