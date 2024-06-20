from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.roleService import saveRole,updateRole, getRole, getRoleAll, setDesactive, getRoleAllActive, getRoleAllDesactive, setDesactive, setActive
from services.logsService import  recordADM

role_bp = Blueprint('role', __name__)
CORS(role_bp)

@role_bp.route('/', methods=['POST'])
def create_role():
    data = request.json
 
    error = validate(data)
    if error  is not None:
        return error 

    response = saveRole(data)

    if response == True:
        recordADM(data.get('adm_dni'),'alta','rol')
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
    elif response == 400:
        return jsonify({'error': 'el Role no se encuentra activado'}), 400
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

@role_bp.route('/', methods=['GET'])
def get_roles():
    try:
        response=getRoleAll()
   
        if response is None:
            return jsonify({'error': 'No hay roles guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener roles', 'error': str(e)}), 400    

@role_bp.route('/active', methods=['GET'])
def get_active_roles():
    try:
        response=getRoleAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay roles activos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener roles', 'error': str(e)}), 400    

@role_bp.route('/desactive', methods=['GET'])
def get_desactive_roles():
    try:
        response=getRoleAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay roles desactivados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener roles', 'error': str(e)}), 400    

@role_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_role(id):

    response=setActive(id)

    if response == 200:
        return jsonify({'message': 'rol activado'}), 200
    elif response == 400:
        return jsonify({'error': 'el rol ya se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'rol no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar rol', 'error': str(response)}), 400 

@role_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_role(id):
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
    required_fields = ['name', 'description','adm_dni']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'error': f'No se pasó el campo {field}'}), 422

    for field in ['name', 'description']:
        if not isinstance(data.get(field), str) or not data.get(field).strip():
            return jsonify({'error': f'El campo {field} debe ser un string no vacío'}), 422

    adm_dni= data.get('adm_dni')
    if not isinstance(adm_dni, int):
        return jsonify({'error': 'adm_dni debe ser un entero'}), 422        

    return None
