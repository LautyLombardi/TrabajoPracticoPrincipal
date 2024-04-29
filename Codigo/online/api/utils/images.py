import io
import numpy as np
from PIL import Image


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