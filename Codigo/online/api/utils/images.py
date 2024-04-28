
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