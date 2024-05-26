from flask import Blueprint, request, jsonify
from services.logsService import *
from utils.date import check_date_format

logs_bp = Blueprint('logs', __name__)

# Rutas para logs de reconocimiento facial de usuarios
@logs_bp.route('/facerecognition/user', methods=['GET'])
def get_face_recognition_user_logs():
    try:
        response=getLogFaceRecognition(1)

        if response is None:
            return jsonify({'error': 'No hay usuarios guardados, en la base de datos, que se hayan registrado por reconocimiento facial'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Lista de logs de reconocimiento facial de usuarios'}), 200
    
@logs_bp.route('/manualrecognition/user', methods=['GET'])
def get_manual_recognition_user_logs():
    try:
        response=getLogFaceRecognition(0)
   
        if response is None:
            return jsonify({'error': 'No hay usuarios guardados, en la base de datos, que '}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Lista de logs de reconocimiento facial de usuarios'}), 200

# Rutas para logs de reconocimiento facial de visitantes
@logs_bp.route('/facerecognition/visitor', methods=['GET'])
def get_face_recognition_visitor_logs():
    

    return jsonify({'message': 'Lista de logs de reconocimiento facial de visitantes'}), 200

@logs_bp.route('/manualrecognition/visitor', methods=['GET'])
def get_face_recognition_visitor_logs():
    
    return jsonify({'message': 'Lista de logs de reconocimiento manual de visitantes'}), 200

# Rutas para logs de imágenes de usuarios
@logs_bp.route('/image/user', methods=['GET'])
def get_image_user_logs():
    
    return jsonify({'message': 'Lista de logs de imágenes de usuarios'}), 200

# Rutas para logs de imágenes de visitantes
@logs_bp.route('/image/visitor', methods=['GET'])
def get_image_visitor_logs():
    
    return jsonify({'message': 'Lista de logs de imágenes de visitantes'}), 200

# Ruta general para logs
@logs_bp.route('/', methods=['GET'])
def get_logs():
    
    return jsonify({'message': 'Lista de todos los logs disponibles'}), 200

#/logs/facerecognicion/user
#/logs/facerecognicion/visitor

#/logs