from flask import Blueprint, request, jsonify
import requests
from flask_cors import CORS

ONLINE_URL = 'http://34.125.221.164/'

api_bp = Blueprint('api', __name__)
CORS(api_bp)

@api_bp.route('/image/user', methods=['POST'])
def imageUser():
    
     # Excepciones
    if 'image' not in request.files or 'user_dni' not in request.form:
        return jsonify({'message': 'faltan campos en la solicitud'}), 422
    
    image = request.files['image']
    files = {'image': (image.filename, image, image.content_type)}
    data = {'user_dni': request.form['user_dni']}

    try:
        response = requests.post(ONLINE_URL + 'image/user', files=files, data=data)
    except requests.RequestException as e:
        return jsonify({'message': 'Error al realizar la petición.', 'error': str(e)}), 500

    if response.status_code == 200:
        return jsonify({'message': 'Datos enviados correctamente', 'response': response.json()})
    else:
        return jsonify({'message': 'Error al enviar datos', 'response': response.text}), response.status_code

@api_bp.route('/image/visitor', methods=['POST'])
def imageVisitor():
    
     # Excepciones
    if 'image' not in request.files or 'visitor_dni' not in request.form:
        return jsonify({'message': 'faltan campos en la solicitud'}), 422
    
    image = request.files['image']
    files = {'image': (image.filename, image, image.content_type)}
    data = {'visitor_dni': request.form['visitor_dni']}

    try:
        response = requests.post(ONLINE_URL + 'image/visitor', files=files, data=data)
    except requests.RequestException as e:
        return jsonify({'message': 'Error al realizar la petición.', 'error': str(e)}), 500

    if response.status_code == 200:
        return jsonify({'message': 'Datos enviados correctamente', 'response': response.json()})
    else:
        return jsonify({'message': 'Error al enviar datos', 'response': response.text}), response.status_code

@api_bp.route('/faceRecognition/user', methods=['POST'])
def faceRecognitionUser():
    
     # Excepciones
    if 'image' not in request.files:
        return jsonify({'message': 'faltan campos en la solicitud'}), 422
    
    image = request.files['image']
    files = {'image': (image.filename, image, image.content_type)}

    try:
        response = requests.post(ONLINE_URL + 'faceRecognition/user', files=files)
    except requests.RequestException as e:
        return jsonify({'message': 'Error al realizar la petición.', 'error': str(e)}), 500

    if response.status_code == 200:
        return jsonify({'message': 'Datos enviados correctamente', 'response': response.json()})
    else:
        return jsonify({'message': 'Error al enviar datos', 'response': response.text}), response.status_code

@api_bp.route('/faceRecognition/visitor', methods=['POST'])
def faceRecognitionVisitor():
    
     # Excepciones
    if 'image' not in request.files:
        return jsonify({'message': 'faltan campos en la solicitud'}), 422
    
    image = request.files['image']
    files = {'image': (image.filename, image, image.content_type)}

    try:
        response = requests.post(ONLINE_URL + 'faceRecognition/visitor', files=files)
    except requests.RequestException as e:
        return jsonify({'message': 'Error al realizar la petición.', 'error': str(e)}), 500

    if response.status_code == 200:
        return jsonify({'message': 'Datos enviados correctamente', 'response': response.json()})
    else:
        return jsonify({'message': 'Error al enviar datos', 'response': response.text}), response.status_code
