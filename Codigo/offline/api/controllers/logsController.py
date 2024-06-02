from flask import Blueprint, request, jsonify
from services.logsService import *
from utils.date import check_date_format

logs_bp = Blueprint('logs', __name__)
    
@logs_bp.route('/manualregistration', methods=['POST'])
def get_manual_registration_logs():
        
    data= request.json
    response=recordLoginManual(data.get('client_dni'),data.get('table_client'))

    if response == True:
        return jsonify({'message': 'Log Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear log', 'error': str(response)}), 400

@logs_bp.route('/manualregistrationFail', methods=['POST'])
def get_manual_registration_logs_fail():
        
    data= request.json
    response=recordLoginManualFail(data.get('client_dni'),data.get('table_client'))

    if response == True:
        return jsonify({'message': 'Log Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear log', 'error': str(response)}), 400

@logs_bp.route('/loginfacerecognition/user', methods=['POST'])
def save_login_face_recognition_user_logs():
    
    data= request.json
    response=recordUserLoginAutomatic(data)

    if response == True:
         return jsonify({'message': 'Log Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear log', 'error': str(response)}), 400


@logs_bp.route('/loginfacerecognition/visitor', methods=['POST'])
def save_login_face_recognition_visitor_logs():
    
    data= request.json
    response=recordVisitorLoginAutomatic(data)

    if response == True:
         return jsonify({'message': 'Log Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear log', 'error': str(response)}), 400



# Rutas para logs de imágenes de usuarios
@logs_bp.route('/image/user', methods=['POST'])
def save_log_image_user():
    
    data= request.json
    response=recordImageUser(data.get('user_dni'),data.get('abm_dni'))

    if response == True:
         return jsonify({'message': 'Log Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear log', 'error': str(response)}), 400


@logs_bp.route('/image/visitor', methods=['POST'])
def save_log_image_visitor():
    
    data= request.json
    response=recordImageVisitor(data.get('visitor_dni'),data.get('abm_dni'))

    if response == True:
         return jsonify({'message': 'Log Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear log', 'error': str(response)}), 400

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
        return jsonify({'message': 'Error al obtener logs', 'error': str(e)}), 400


#/logs