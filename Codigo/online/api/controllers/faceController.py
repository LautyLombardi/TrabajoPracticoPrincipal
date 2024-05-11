from flask import Blueprint, request, jsonify
from services.faceService import saveface, updateface, getfaceById

face_bp = Blueprint('face', __name__)

@face_bp.route('/', methods=['POST'])
def create_face():
    data = request.json

    if not data.get('dni').strip() or not data.get('enterprice_id').strip() or not data.get('name').strip() or not data.get('lastname').strip() or not data.get('email').strip() or not data.get('startDate').strip() or not data.get('finishDate').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response =saveface(data)

    if response == True:
        return jsonify({'message': 'Visitante Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear visitante', 'error': str(response)}), 400
    
@face_bp.route('/user', methods=['PUT'])
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

@face_bp.route('/visitor', methods=['GET'])
def get_face_by_id(id):
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    face=getfaceById(id)

    if face:
        return jsonify(face), 200
    else:
        return jsonify({'error': 'Visitante no encontrado'}), 404
    
@app.route('/faceRacognition', methods=['POST'])
def faceRacognition():
    # Excepciones
    if 'image' not in request.files:
        return jsonify({'message': "Error al enviar imagen"}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'message': "No selected image"}), 400
    
    images = PersonsImages.query.all()
    
    if(check_face(image_file,images)):
        return jsonify({'message': 'Usuario autorizado'}), 200
    
    return jsonify({'message': 'Usuario no autorizado'}), 400
