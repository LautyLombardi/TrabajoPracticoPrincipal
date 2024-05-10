from flask import Blueprint, request, jsonify
from services.placeService import savePlace, updatePlace, getPlaceById

place_bp = Blueprint('place', __name__)

@place_bp.route('', methods=['POST'])
def create_place():
    data = request.json
    
    if not data.get('name').strip() or not data.get('abbreviation').strip() or not data.get('description').strip() or not data.get('openTime').strip() or not data.get('closeTime').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    response = savePlace(data)
    if response == True:
        return jsonify({'message': 'Lugar Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear lugar', 'error': str(response)}), 400

@place_bp.route('/<int:id>', methods=['PUT'])
def update_place(id):     
    data = request.json

    if not data.get('name').strip() or not data.get('abbreviation').strip() or not data.get('description').strip() or not data.get('openTime').strip() or not data.get('closeTime').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    response = updatePlace(id, data)
    
    if response == 200:
        return jsonify({'message': 'Lugar Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Lugar no encontrada'}), 404
    else:
        return jsonify({'message': 'Error al modificar lugar', 'error': str(response)}), 400

@place_bp.route('/<int:id>', methods=['GET'])
def get_place_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    place = getPlaceById(id)
    if place:
        return jsonify(place), 200
    else:
        return jsonify({'error': 'Lugar no encontrado'}), 404    