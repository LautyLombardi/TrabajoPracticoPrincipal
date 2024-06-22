from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.syncService import *

sync_bp = Blueprint("sync",__name__)
CORS(sync_bp)

@sync_bp.route('/logs', methods=['POST'])
def sync_logs():
    logs = request.json
    errores = []

    for log in logs:
        response = syncLogs(log)
        if response is not True:
            errores.append({'data': log, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync logs exitoso'}), 201

@sync_bp.route('/users',methods=['POST'])
def create_users():
    users = request.json
    errores = [] 

    for user in users:
        response = syncUser(user)
        if response is not True:
            errores.append({'data': user, 'error': response})
    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync users exitoso'}), 201
    
@sync_bp.route('/visitors', methods=['POST'])
def sync_visitors():
    visitors = request.json
    errores = []

    for visitor in visitors:
        response = syncVisitors(visitor)
        if response is not True:
            errores.append({'data': visitor, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync visitors exitoso'}), 201

@sync_bp.route('/places', methods=['POST'])
def sync_places():
    places = request.json
    errores = []

    for place in places:
        response = syncPlaces(place)
        if response is not True:
            errores.append({'data': place, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync places exitoso'}), 201

@sync_bp.route('/categories', methods=['POST'])
def sync_categories():
    categories = request.json
    errores = []

    for category in categories:
        response = syncCategories(category)
        if response is not True:
            errores.append({'data': category, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync categories exitoso'}), 201
    
@sync_bp.route('/exceptions', methods=['POST'])
def sync_exceptions():
    exceptions = request.json
    errores = []

    for exception in exceptions:
        response = syncExceptions(exception)
        if response is not True:
            errores.append({'data': exception, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync exceptions exitoso'}), 201
    
@sync_bp.route('/enterprices', methods=['POST'])
def sync_enterprices():
    enterprices = request.json
    errores = []

    for enterprice in enterprices:
        response = syncEnterprices(enterprice)
        if response is not True:
            errores.append({'data': enterprice, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync enterprices exitoso'}), 201

@sync_bp.route('/institutes', methods=['POST'])
def sync_institutes():
    institutes = request.json
    errores = []

    for institute in institutes:
        response = syncInstitutes(institute)
        if response is not True:
            errores.append({'data': institute, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync institutes exitoso'}), 201

@sync_bp.route('/user-histories', methods=['POST'])
def sync_user_histories():
    user_histories = request.json
    errores = []

    for user_history in user_histories:
        response = syncUserHistories(user_history)
        if response is not True:
            errores.append({'data': user_history, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync user histories exitoso'}), 201

@sync_bp.route('/visitor-histories', methods=['POST'])
def sync_visitor_histories():
    visitor_histories = request.json
    errores = []

    for visitor_history in visitor_histories:
        response = syncVisitorHistories(visitor_history)
        if response is not True:
            errores.append({'data': visitor_history, 'error': response})

    if errores:
        return jsonify({'errores': errores}), 400
    else:
        return jsonify({'message': 'Sync visitor histories exitoso'}), 201