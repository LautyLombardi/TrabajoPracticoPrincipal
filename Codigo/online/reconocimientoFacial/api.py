from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS

import base64
import numpy as np
import os

import cv2
from deepface import DeepFace

db="fotos"

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

TEMP_DIR = 'temp_images'

def check_face(frame):
    global face_match
    try:
        dff=DeepFace.find(frame,db)
        faceDB=dff[0].get("identity")
        reference_img=cv2.imread(str(faceDB[0])) 
        if DeepFace.verify(frame, reference_img)['verified']:
            return True
        else:
            return False
    except ValueError:
        return False

@socketio.on('stream')
def handle_stream(image):
    # Decode base64 image to numpy array
    image_bytes = base64.b64decode(image.split(',')[1])
    nparr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Save the frame as a temporary image file
    temp_file_path = os.path.join(TEMP_DIR, 'temp_frame.jpg')
    cv2.imwrite(temp_file_path, frame)

    # Read the saved frame using cv2.imread
    saved_frame = cv2.imread(temp_file_path)

    flag=check_face(saved_frame)
    #socketio.emit('flag',flag)
    print(flag)

    # Encode the processed frame back to base64
    _, encoded_frame = cv2.imencode('.jpg', saved_frame)
    encoded_image = base64.b64encode(encoded_frame).decode('utf-8')

    # Emit the processed frame back to the client
    socketio.emit('processed_frame', encoded_image)

if __name__ == '__main__':
    socketio.run(app, debug=True)