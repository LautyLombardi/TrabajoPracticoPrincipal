from flask import Blueprint, request, jsonify
from services.userService import updateUser,saveUser, getUserById
from flask_cors import CORS
from db.db import db, User

user_bp = Blueprint('user', __name__)
CORS(user_bp)

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
    if 'name' not in data or 'lastname' not in data or 'role_id' not in data or 'password' not in data or 'dni' not in data or 'isActive' not in data or 'motive' not in data or 'activeDate' not in data:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 400
    
    response = saveUser(data)
    if response == True:
        return jsonify({'message': 'User Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear usuario', 'error': str(response)}), 400

@user_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    if 'name' not in data or 'lastname' not in data or 'role_id' not in data or 'password' not in data or 'isActive' not in data or 'motive' not in data or 'activeDate' not in data:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 400
    
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