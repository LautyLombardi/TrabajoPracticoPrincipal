from flask import Blueprint, request, jsonify
from services.placeService import savePlace, updatePlace, getPlaceById, getPlaceAll, setDesactive, getPlaceAllActive, getPlaceAllDesactive, setActive, getInstituteByPlaceId
from utils.date import check_schedule_format

place_bp = Blueprint('place', __name__)

@place_bp.route('/', methods=['POST'])
def create_place():
    data = request.json
    
    error = validate(data)
    if error  is not None:
        return error 

    response = savePlace(data)
    if response == True:
        return jsonify({'message': 'Lugar Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear lugar', 'error': str(response)}), 400

@place_bp.route('/<int:id>', methods=['PUT'])
def update_place(id):     
    data = request.json

    error = validate(data)
    if error  is not None:
        return error 

    response = updatePlace(id, data)
    
    if response == 200:
        return jsonify({'message': 'Lugar Guardado'}), 200
    elif response == 400:
        return jsonify({'error': 'el Lugar no se encuentra activado'}), 400
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

@place_bp.route('/', methods=['GET'])
def get_places():
    try:
        response=getPlaceAll()
   
        if response is None:
            return jsonify({'error': 'No hay lugares guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener lugares', 'error': str(e)}), 400            

@place_bp.route('/active', methods=['GET'])
def get_active_places():
    try:
        response=getPlaceAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay lugares activos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener lugares', 'error': str(e)}), 400    

@place_bp.route('/desactive', methods=['GET'])
def get_desactive_places():
    try:
        response=getPlaceAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay lugares desactivados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener lugares', 'error': str(e)}), 400    

@place_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_place(id):

    response=setActive(id)

    if response == 200:
        return jsonify({'message': 'lugar activado'}), 200
    elif response == 400:
        return jsonify({'error': 'el lugar ya se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'lugar no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar lugar', 'error': str(response)}), 400 

@place_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_place(id):
    data = request.json

    response=setDesactive(id)

    if response == 200:
        return jsonify({'message': 'lugar desactivado'}), 200
    elif response == 400:
        return jsonify({'error': 'el lugar ya se encuentra desactivado'}), 400
    elif response == 404:
        return jsonify({'error': 'lugar no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar lugar', 'error': str(response)}), 400 

@place_bp.route('/<int:id>/institute', methods=['GET'])
def get_institute_for_place(id):
        
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    response = getInstituteByPlaceId(id)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'no existe relacion'}), 404  


def validate(data):
    required_fields = ['name', 'description', 'abbreviation', 'openTime', 'closeTime']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'error': f'No se pasó el campo {field}'}), 422

    for field in ['name', 'description', 'abbreviation', 'openTime', 'closeTime']:
        if not isinstance(data.get(field), str) or not data.get(field).strip():
            return jsonify({'error': f'El campo {field} debe ser un string no vacío'}), 422


    for field in ['openTime', 'closeTime']:
        if not check_schedule_format(data.get(field)):
            return jsonify({'error': f'El campo {field} no tiene el formato de horario válido '}, 422)

    return None
