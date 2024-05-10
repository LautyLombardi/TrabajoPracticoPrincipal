from flask import Blueprint, request, jsonify
from services.instituteService import saveInstitute,updateInstitute,getInstituteById

institute_bp = Blueprint('institute', __name__)

@institute_bp.route('/', methods=['POST'])
def create_institute():
    data = request.json
    if not data.get('name').strip():        
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = saveInstitute(data)

    if response == True:
        return jsonify({'message': 'Institute Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear Institute', 'error': str(response)}), 400

@institute_bp.route('/<int:id>', methods=['PUT'])
def update_institute(id):
    data = request.json
    if not data.get('name').strip(): 
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = updateInstitute(id,data)

    if response == 200:
        return jsonify({'message': 'Institute Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Institute no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el Institute', 'error': str(response)}), 400

@institute_bp.route('/<int:id>', methods=['GET'])
def get_institute_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    institute = getInstituteById(id)
    if institute:
        return jsonify(institute), 200
    else:
        return jsonify({'error': 'Role no encontrado'}), 404