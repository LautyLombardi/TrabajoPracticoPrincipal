from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.enterpriceService import *

enterprice_bp = Blueprint('enterprice',__name__)
CORS(enterprice_bp)

@enterprice_bp.route('/', methods=['POST'])
def create_enterprice():
    data = request.json
 
    error = validate(data)
    if error  is not None:
        return error 

    response = saveEnterprice(data)

    if response == True:
        return jsonify({'message': 'Enterprice Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear Enterprice', 'error': str(response)}), 400

@enterprice_bp.route('/<int:id>', methods=['PUT'])
def update_enterprice(id):
    data = request.json

    error = validate(data)
    if error  is not None:
        return error 

    response = updateEnterprice(id,data)

    if response == 200:
        return jsonify({'message': 'Enterprice Guardado'}), 200
    elif response == 400:
        return jsonify({'error': 'el Enterprice no se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'Enterprice no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el enterprice', 'error': str(response)}), 400

@enterprice_bp.route('/<int:id>', methods=['GET'])
def get_enterprice_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    enterprice = getEnterpriceById(id)
    if enterprice:
        return jsonify(enterprice), 200
    else:
        return jsonify({'error': 'Enterprice no encontrado'}), 404

@enterprice_bp.route('/', methods=['GET'])
def get_enterprices():
    try:
        response=getEnterpriceAll()
   
        if response is None:
            return jsonify({'error': 'No hay enterprices guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener enterprices', 'error': str(e)}), 400    

@enterprice_bp.route('/active', methods=['GET'])
def get_active_enterprices():
    try:
        response=getEnterpriceAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay enterprices activos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener enterprices', 'error': str(e)}), 400    

@enterprice_bp.route('/desactive', methods=['GET'])
def get_desactive_enterprices():
    try:
        response=getEnterpriceAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay enterprices desactivados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener enterprices', 'error': str(e)}), 400    

@enterprice_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_enterprice(id):

    response=setActive(id)

    if response == 200:
        return jsonify({'message': 'rol activado'}), 200
    elif response == 400:
        return jsonify({'error': 'el rol ya se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'rol no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar rol', 'error': str(response)}), 400 

@enterprice_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_enterprice(id):
    data = request.json

    response=setDesactive(id)

    if response == 200:
        return jsonify({'message': 'rol desactivado'}), 200
    elif response == 400:
        return jsonify({'error': 'el rol ya se encuentra desactivado'}), 400
    elif response == 404:
        return jsonify({'error': 'rol no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar rol', 'error': str(response)}), 400 

def validate(data):
    required_fields = ['name', 'cuit']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'error': f'No se pasó el campo {field}'}), 422

    if not isinstance(data.get('name'), str) or not data.get('name').strip():
        return jsonify({'error': 'El campo name debe ser un string no vacío'}), 422

    if not isinstance(data.get('cuit'), int) or data.get('cuit') <= 0:
            return jsonify({'error': 'El campo cuit debe ser un integer mayor a 0'}), 422
    
    return None