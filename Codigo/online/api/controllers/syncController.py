from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.syncService import *

sync_bp = Blueprint("sync", __name__)
CORS(sync_bp)

@sync_bp.route('/logs', methods=['POST'])
def sync_logs():
    logs = request.json
    return handle_sync_response(syncLogs, logs)

@sync_bp.route('/users', methods=['POST'])
def create_users():
    users = request.json
    return handle_sync_response(syncUser, users)
    
@sync_bp.route('/visitors', methods=['POST'])
def sync_visitors():
    visitors = request.json
    return handle_sync_response(syncVisitors, visitors)

@sync_bp.route('/places', methods=['POST'])
def sync_places():
    places = request.json
    return handle_sync_response(syncPlaces, places)

@sync_bp.route('/categories', methods=['POST'])
def sync_categories():
    categories = request.json
    return handle_sync_response(syncCategories, categories)

@sync_bp.route('/exceptions', methods=['POST'])
def sync_exceptions():
    exceptions = request.json
    return handle_sync_response(syncExceptions, exceptions)
    
@sync_bp.route('/enterprices', methods=['POST'])
def sync_enterprices():
    enterprices = request.json
    return handle_sync_response(syncEnterprices, enterprices)

@sync_bp.route('/institutes', methods=['POST'])
def sync_institutes():
    institutes = request.json
    return handle_sync_response(syncInstitutes, institutes)

@sync_bp.route('/user-histories', methods=['POST'])
def sync_user_histories():
    user_histories = request.json
    return handle_sync_response(syncUserHistories, user_histories)

@sync_bp.route('/visitor-histories', methods=['POST'])
def sync_visitor_histories():
    visitor_histories = request.json
    return handle_sync_response(syncVisitorHistories, visitor_histories)
    
def handle_sync_response(sync_function, data_list):
    errores = []

    for data in data_list:
        response = sync_function(data)
        if response is not True:
            errores.append({'data': data, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': f'Sync {sync_function.__name__} exitoso'}), 201