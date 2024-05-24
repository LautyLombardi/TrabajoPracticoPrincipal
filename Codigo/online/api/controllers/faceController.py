from flask import Blueprint, request, jsonify
from services.faceService import validUser, validVisitor
from flask_cors import CORS

faceRecognition_bp = Blueprint('faceRecognition', __name__)
CORS(faceRecognition_bp)

@faceRecognition_bp.route('/user', methods=['POST'])
def faceRecognitionUser():
    
    # Excepciones
    if 'image' not in request.files:
        return jsonify({'message': "Error al enviar imagen"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'message': "No selected image"}), 400
    
    dni = validUser(image)
    
    print(dni)
    if dni:
        return jsonify({'message': 'Usuario autorizado', 'dni': dni}), 200
    else:
        return jsonify({'message': 'Usuario no autorizado'}), 400
    
    
@faceRecognition_bp.route('/visitor', methods=['POST'])
def faceRecognitionVisitor():
    # Excepciones
    if 'image' not in request.files:
        return jsonify({'message': "Error al enviar imagen"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'message': "No selected image"}), 400
    
    response = validVisitor(image)
    
    if response:
        return jsonify({'message': 'Visitante autorizado', 'dni': response}), 200
    else:
        return jsonify({'message': 'Visitante no autorizado'}), 400

