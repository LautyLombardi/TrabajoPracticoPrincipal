from flask import Blueprint, request, jsonify
from services.roleService import saveRole,updateRole,getRole

role_bp = Blueprint('role', __name__)

@role_bp.route('/', methods=['POST'])
def create_role():
    data = request.json
 
    error = validate(data)
    if error  is not None:
        return error 

    response = saveRole(data)

    if response == True:
        return jsonify({'message': 'Role Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear Role', 'error': str(response)}), 400

@role_bp.route('/<int:id>', methods=['PUT'])
def update_role(id):
    data = request.json

    error = validate(data)
    if error  is not None:
        return error 

    response = updateRole(id,data)

    if response == 200:
        return jsonify({'message': 'Role Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Role no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el role', 'error': str(response)}), 400

@role_bp.route('/<int:id>', methods=['GET'])
def get_role_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    role = getRole(id)
    if role:
        return jsonify(role), 200
    else:
        return jsonify({'error': 'Role no encontrado'}), 404


def validate(data):
    required_fields = ['name', 'description']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'error': f'No se pasó el campo {field}'}), 422

    for field in ['name', 'description']:
        if not isinstance(data.get(field), str) or not data.get(field).strip():
            return jsonify({'error': f'El campo {field} debe ser un string no vacío'}), 422

    return None
