from flask import Blueprint, request, jsonify
from services.userService import updateUser,saveUser, getUserById, getUserAll, getUserAllActive, getUserAllDesactive, setActive, setDesactive
from services.roleService import exist_rol
from utils.date import check_date_format
from utils.passHash import hashPassword
from services.logsService import recordAbmUsuario

user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    try:
        response=getUserAll()
        if response is None:
            return jsonify({'error': 'No hay usuarios guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener usuarios', 'error': str(e)}), 400    

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.json
    
    error = validate(data)
    if error  is not None:
        return error 

    response = saveUser(data)
    if response == True:
        recordAbmUsuario(data.get('adm_dni'),'alta',data.get('dni'))
        return jsonify({'message': 'User Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear usuario', 'error': str(response)}), 400

@user_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json

    error = validate(data)
    if error  is not None:
        return error
        
    response = updateUser(id, data)
    
    if response == 200:
        return jsonify({'message': 'usuario Guardado'}), 200
    elif response == 400:
        return jsonify({'error': 'el usuario no se encuentra activado'}), 400
    elif response == 401:
        return jsonify({'error': 'Administrador no autorizado para realizar el cambio'}), 401
    elif response == 404:
        return jsonify({'error': 'usuario no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar usuario', 'error': str(response)}), 400 

@user_bp.route('/<int:id>', methods=['GET'])
def get_user_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    user = getUserById(id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

@user_bp.route('/active', methods=['GET'])
def get_active_users():
    try:
        response=getUserAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay usuarios activos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener usuarios', 'error': str(e)}), 400    

@user_bp.route('/desactive', methods=['GET'])
def get_desactive_users():
    try:
        response=getUserAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay usuarios desactivos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener usuarios', 'error': str(e)}), 400    

@user_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_user(id):

    response=setActive(id)

    if response == 200:
        return jsonify({'message': 'usuario activado'}), 200
    elif response == 400:
        return jsonify({'error': 'el usuario ya se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'usuario no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar usuario', 'error': str(response)}), 400 

@user_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_user(id):
    data = request.json
    
    error = validateDesactive(data)
    if error  is not None:
        return error
    
    response=setDesactive(id, data)

    if response == 200:
        return jsonify({'message': 'usuario desactivada'}), 200
    elif response == 400:
        return jsonify({'error': 'el usuario ya se encuentra desactivado'}), 400
    elif response == 404:
        return jsonify({'error': 'usuario no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar usuario', 'error': str(response)}), 400 

@user_bp.route('/login', methods=['POST'])
def set_login_user():
    data = request.json
    if data.get('password')==None:
        return jsonify({'error':'no se ingreso password'}),404
    if data.get('dni')==None:
        return jsonify({'error':'no se ingreso dni'}),404
    password = hashPassword(data.get('password'))
    response = getUserAll()
    for user in response:
        
        
        if  str(user.get('dni'))==str(data.get('dni')) and user.get('password')==password:
            return jsonify({'message': 'usuario logeado'}), 200
    return jsonify({'error':'no se ingreso una password o dni correcto'}),404
    

def validate(data):
    required_fields = ['dni','name', 'lastname', 'role_id', 'password','adm_dni']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'error': f'No se pasó el campo {field}'}), 417

    for field in ['name', 'lastname', 'password']:
        if not isinstance(data.get(field), str) or not data.get(field).strip():
            return jsonify({'error': f'El campo {field} debe ser un string no vacío'}), 418    

    role_id = data.get('role_id')
    if not isinstance(role_id, int):
        return jsonify({'error': 'role_id debe ser un entero'}), 419

    adm_dni= data.get('adm_dni')
    if not isinstance(adm_dni, int):
        return jsonify({'error': 'adm_dni debe ser un entero'}), 420


    if not exist_rol(role_id):
        return jsonify({'error': 'el rol que se esta pasando no existe en la tabla Rol'}), 416

    return None

def validateDesactive(data):
    if data.get('motive') is None:
        return jsonify({'error': f'No se pasó el campo motive'}), 422

    for field in ['motive', 'activeDate']:
        if not isinstance(data.get(field), str) or not data.get(field).strip():
            return jsonify({'error': f'El campo {field} debe ser un string no vacío'}), 422     

    if not check_date_format(data.get('activeDate')):
        return jsonify({'error': 'activeDate debe tener un formato yyyyMMdd'}), 422

    return None
