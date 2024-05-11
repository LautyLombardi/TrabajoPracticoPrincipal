from flask import Blueprint, request, jsonify
from services.faceService import validUser, validVisitor

faceRecognition_bp = Blueprint('faceRecognition', __name__)

@faceRecognition_bp.route('/user', methods=['POST'])
def faceRacognition():
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
    
@faceRecognition_bp.route('/visitor', methods=['PUT'])
def update_face(id):
    data = request.json

    if not data.get('enterprice_id').strip() or not data.get('name').strip() or not data.get('lastname').strip() or not data.get('email').strip() or not data.get('startDate').strip() or not data.get('finishDate').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = updateface(id,data)

    if response == 200:
        return jsonify({'message': 'Visitante Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Visitante no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el visitante', 'error': str(response)}), 400

