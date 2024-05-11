from flask import Blueprint, request, jsonify
from services.userService import updateUser,saveUser, getUserById
from db.db import db, User, Role
from services.roleService import exist_rol
from utils.date import check_date_format



user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_dict = {
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname,
            'password':user.password,            
            'rol':user.rol,
            'DNI':user.DNI
        }
        user_list.user_bpend(user_dict)
    return jsonify(user_list)

@user_bp.route('/', methods=['DELETE'])
def delete_all_users():
    try:
        # Elimina todos los usuarios
        num_deleted = db.session.query(User).delete()
        db.session.commit()
        
        return jsonify({'message': f'{num_deleted} usuarios eliminados exitosamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar usuarios', 'details': str(e)}), 500

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.json
    
    error = validate(data)
    if error  is not None:
        return error 
    
    response = saveUser(data)
    if response == True:
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


def validate(data):
    required_fields = ['name', 'lastname', 'role_id', 'password' , 'motive', 'activeDate']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'error': f'No se pasó el campo {field}'}), 422

    for field in ['name', 'lastname', 'password', 'motive', 'activeDate']:
        if not isinstance(data.get(field), str) or not data.get(field).strip():
            return jsonify({'error': f'El campo {field} debe ser un string no vacío'}), 422


    if data.get('isActive') is None:
        data['isActive'] = 1
    else:
        is_active = data.get('isActive')
        if not isinstance(is_active, int):
            return jsonify({'error': 'isActive debe ser un entero'}), 422
        if is_active != 0 and is_active != 1:
            return jsonify({'error': 'isActive debe ser 0 o 1'}), 422       


    role_id = data.get('role_id')
    if not isinstance(role_id, int):
        return jsonify({'error': 'role_id debe ser un entero'}), 422


    if not exist_rol(role_id):
        return jsonify({'error': 'el rol que se esta pasando no existe en la tabla Rol'}), 422

    if not check_date_format(data.get('activeDate')):
        return jsonify({'error': f'El campo activeDate no tiene el formato de fecha válido '}, 422)




    return None
