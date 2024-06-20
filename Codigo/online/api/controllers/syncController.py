from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.categoryService import saveCategory
from services.enterpriceService import saveEnterprice
from services.exceptionService import saveException
from services.instituteService import saveInstitute
from services.placeService import savePlace
from services.roleService import saveRole
from services.userService import saveUser
from services.visitorService import saveVisitor

sync_bp = Blueprint("sync",__name__)
CORS(sync_bp)

@sync_bp.route('/category', methods=['POST'])
def create_category():
    datos = request.json
    errores = []

    for data in datos:
        if not data.get('name') or not data.get('description') or data.get('isExtern') is None or data.get('isActive') is None or not data.get('createDate'):
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        
        response = saveCategory(data)
        if response != True:
            errores.append({'data': data, 'error': response})

    if errores:
        return jsonify({'message': 'Algunas categorías no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas las categorías fueron registradas exitosamente'}), 201

@sync_bp.route('/categoryException',methods=['POST'])
def create_category_exception():
    pass

@sync_bp.route('/categoryInstitute',methods=['POST'])
def create_category_institute():
    pass

@sync_bp.route('/categoryPlace',methods=['POST'])
def create_category_place():
    pass

@sync_bp.route('/categoryVisitor',methods=['POST'])
def create_category_visitor():
    pass

@sync_bp.route('/enterprice',methods=['POST'])
def create_enterprice():
    datos = request.json
    errores = []

    for data in datos:
        if not data.get('name').strip() or data.get('cuit') is None or data.get('isActive') is None or not data.get('createDate').strip():
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        response = saveEnterprice(data)

        if response != True:
            errores.append({'data': data, 'error': response})
    
    if errores:
        return jsonify({'message': 'Algunas empresas no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas las empresas fueron registradas exitosamente'}), 201


@sync_bp.route('/exception',methods=['POST'])
def create_exception():
    datos = request.json
    errores = []

    for data in datos:
        if not data.get('name') or not data.get('description') or not data.get('duration') or not data.get('createDate'):
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        
        response=saveException(data)

        if response != True:
            errores.append({'data': data, 'error': response})

    if errores:
        return jsonify({'message': 'Algunas excepciones no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas las excepciones fueron registradas exitosamente'}), 201


@sync_bp.route('/institute',methods=['POST'])
def create_institute():
    datos = request.json
    errores = []

    for data in datos:
        if not data.get('name') or data.get('isActive') is None or not data.get('createDate'):
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue

        response=saveInstitute(data)

        if response != True:
            errores.append({'data': data, 'error': response})
    
    if errores:
        return jsonify({'message': 'Algunos institutos no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas los institutos fueron registradas exitosamente'}), 201


@sync_bp.route('/institutePlace',methods=['POST'])
def create_institute_place():
    pass

@sync_bp.route('/logs',methods=['POST'])
def create_logs():
    pass

@sync_bp.route('/place',methods=['POST'])
def create_place():
    datos = request.json
    errores = []

    for data in datos:
        if not data.get('name') or not data.get('abbreviation') or not data.get('description') or not data.get('openTime') or not data.get('closeTime') or data.get('isActive') is None or not data.get('createDate'):
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        response=savePlace(data)
        if response != True:
            errores.append({'data': data, 'error': response})
    
    if errores:
        return jsonify({'message': 'Algunos lugares no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas los lugares fueron registradas exitosamente'}), 201


@sync_bp.route('/placeException',methods=['POST'])
def create_place_exception():
    pass

@sync_bp.route('/role',methods=['POST'])
def create_role():
    datos = request.json
    errores = []

    for data in datos:
        if not data.get('name') or not data.get('description') or not data.get('createDate') or data.get('routingConnection') is None or data.get('onlineLogin') is None or data.get('offlineLogin') is None or data.get('dayStartEnd') is None or data.get('visitorAuthentication') is None or data.get('visitorAuthorization') is None or data.get('instituteConfiguration') is None or data.get('entityABMs') is None or data.get('systemReports') is None or data.get('systemLog') is None or data.get('exceptionLoading') is None:
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        response=saveRole(data)
        if response != True:
            errores.append({'data': data, 'error': response})

    if errores:
        return jsonify({'message': 'Algunos roles no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas los roles fueron registradas exitosamente'}), 201

@sync_bp.route('/user',methods=['POST'])
def create_user():
    datos = request.json
    errores = [] 

    for data in datos:
        if 'name' not in data or 'dni' not in data or 'lastname' not in data or 'role_id' not in data or 'password' not in data or 'isActive' not in data or 'motive' not in data or 'activeDate' not in data:
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        response=saveUser(data)
        if response != True:
            errores.append({'data': data, 'error': response})
    if errores:
        return jsonify({'message': 'Algunos usuarios no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas los usuarios fueron registradas exitosamente'}), 201

@sync_bp.route('/userHistory',methods=['POST'])
def create_user_history():
    pass

@sync_bp.route('/visitor',methods=['POST'])
def create_visitor():
    datos = request.json
    errores = [] 

    for data in datos:
        if data.get('dni') is None or data.get('enterprice_id') is None or not data.get('name') or not data.get('lastname') or not data.get('email') or not data.get('startDate') or not data.get('finishDate') or data.get('isActive') is None or not data.get('createDate'):
            errores.append({'data': data, 'error': 'Faltan campos en la solicitud'})
            continue
        response=saveVisitor(data)
        if response != True:
            errores.append({'data': data, 'error': response}) 
    if errores:
        return jsonify({'message': 'Algunos visitantes no pudieron ser registradas', 'errores': errores}), 400
    else:
        return jsonify({'message': 'Todas los visitantes fueron registradas exitosamente'}), 201


@sync_bp.route('/visitorHistory',methods=['POST'])
def create_visitor_history():
    pass
