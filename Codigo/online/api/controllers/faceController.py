from flask import Blueprint, request, jsonify
from services.faceService import validUser, validVisitor

faceRecognition_bp = Blueprint('faceRecognition', __name__)

@faceRecognition_bp.route('/user', methods=['POST'])
def faceRecognitionUser():
    # Excepciones
    if 'image' not in request.files:
        return jsonify({'message': "Error al enviar imagen"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'message': "No selected image"}), 400
    
    response = validUser(image)
    
    if response:
        return jsonify({'message': 'Usuario autorizado'}), 200
    
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
        return jsonify({'message': 'Visitante autorizado'}), 200
    
    return jsonify({'message': 'Visitante no autorizado'}), 400
