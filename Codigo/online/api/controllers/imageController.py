from flask import Blueprint, request, jsonify
from services.imageService import saveUserImage, saveVisitorImage

image_bp = Blueprint('image', __name__)

@image_bp.route('/user', methods=['POST'])
def insert_image():

    # Excepciones
    if 'image' not in request.files :
        return jsonify({'message': 'No se encontró archivo en la solicitud.'}), 400

    if 'user_dni' not in request.files :
        return jsonify({'message': 'No se encontró dni del usuario en la solicitud.'}), 400
    
    image = request.files['image']
    user_dni = request.files['user_dni']
    
    if image.filename == '':
        return jsonify({'message': 'El archivo no tiene nombre.'}), 400
    
    if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        return jsonify({'message': 'El archivo no es una imagen válida.'}), 400
    
    if not isinstance(user_dni, int) or user_dni <= 0:
        return jsonify({'error': 'El dni debe ser una entero'}), 422

    response = saveUserImage(image, user_dni)

    if response:
        return jsonify({'message': 'Imagen insertada correctamente en la base de datos.'}), 200
    else:
        return jsonify({'message': 'Error al insertar la imagen en la base de datos.', 'error': str(response)}), 400

@image_bp.route('/visitor', methods=['POST'])
def insert_image():

    # Excepciones
    if 'image' not in request.files :
        return jsonify({'message': 'No se encontró archivo en la solicitud.'}), 400

    if 'visitor_dni' not in request.files :
        return jsonify({'message': 'No se encontró dni del visitante en la solicitud.'}), 400
    
    image = request.files['image']
    visitor_dni = request.files['visitor_dni']
    
    if image.filename == '':
        return jsonify({'message': 'El archivo no tiene nombre.'}), 400
    
    if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        return jsonify({'message': 'El archivo no es una imagen válida.'}), 400
    
    if not isinstance(visitor_dni, int) or visitor_dni <= 0:
        return jsonify({'error': 'El dni debe ser una entero'}), 422

    response = saveVisitorImage(image, visitor_dni)

    if response:
        return jsonify({'message': 'Imagen insertada correctamente en la base de datos.'}), 200
    else:
        return jsonify({'message': 'Error al insertar la imagen en la base de datos.', 'error': str(response)}), 400