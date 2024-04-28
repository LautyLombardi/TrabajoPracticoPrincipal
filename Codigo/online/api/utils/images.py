
import io
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

def image_to_bytes(image_path):

    with open(image_path, 'rb') as file:
        image_bytes = file.read()
    print(image_bytes)
    return image_bytes

def bytes_to_image(image_bytes):
    image_bytes_io = io.BytesIO(image_bytes)
    image = Image.open(image_bytes_io)
    print(image)
    return image

# Ejemplo de uso
image_path = 'img1.jpg'  # Ruta de la imagen
image_bytes = image_to_bytes(image_path)
print ('pabl en bytes: ', image_bytes)
image = bytes_to_image(image_bytes)
plt.imshow(image)
plt.axis('off')
plt.show()