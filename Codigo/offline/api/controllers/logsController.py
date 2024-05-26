from flask import Blueprint, request, jsonify
from services.logsService import *
from utils.date import check_date_format

logs_bp = Blueprint('logs', __name__)
    
@logs_bp.route('/manualregistration/user', methods=['GET'])
def get_manual_registration_user_logs():
    try:
        response=getLogRegistrationUsuario()
   
        if response is None:
            return jsonify({'error': 'No hay usuarios guardados, en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Lista de logs de reconocimiento facial de usuarios'}), 200

@logs_bp.route('/manualregistration/visitor', methods=['GET'])
def get_manual_registration_visitor_logs():
    try:
        response=getlogsRegistrationVisitante()

        if response is None:
            return jsonify({'error': 'No hay visitantes guardados, en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Lista de logs de reconocimiento manual de visitantes'}), 400

@logs_bp.route('/loginfacerecognition/user', methods=['GET'])
def get_login_face_recognition_user_logs():
    try:
        response=getlogsIsFaceRecognitionUsuario()

        if response is None:
            return jsonify({'error': 'No hay datos guardados sobre usuarios que hicieron el login por reconocimineto facial'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e:
        return jsonify({'message': 'Lista de logs del usuario que hicieron el login por reconocimineto facial'}), 200


@logs_bp.route('/loginfacerecognition/visitor', methods=['GET'])
def get_login_face_recognition_visitor_logs():
    try:
        response=getlogsIsFaceRecognitionVisitante()

        if response is None:
            return jsonify({'error': 'No hay datos guardados sobre usuarios que hicieron el login por reconocimineto facial'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e:
        return jsonify({'message': 'Lista de logs del usuario que hicieron el login por reconocimineto facial'}), 200


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
    try:
        response=getLogAll()
   
        if response is None:
            return jsonify({'error': 'No hay logs'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Lista de todos los logs disponibles'}), 200

#/logs/facerecognicion/user
#/logs/facerecognicion/visitor

#/logs