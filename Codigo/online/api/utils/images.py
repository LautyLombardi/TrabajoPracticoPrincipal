import io
from PIL import Image

def image_to_bytes(image_path):

    with open(image_path, 'rb') as file:
        image_bytes = file.read()
    return image_bytes

def bytes_to_image(image_bytes):
    image_bytes_io = io.BytesIO(image_bytes)
    image = Image.open(image_bytes_io)
    return image
