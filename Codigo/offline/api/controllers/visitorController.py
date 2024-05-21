from flask import Blueprint, request, jsonify
import services.visitorService as SV

visitor_bp = Blueprint('visitor', __name__)

@visitor_bp.route('/', methods=['POST'])
def create_visitor():
    data = request.json

    required_fields = ['dni', 'enterprice_id', 'name', 'lastname', 'email', 'startDate', 'finishDate']
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        print(missing_fields)
        return jsonify({'error': 'Faltan campos en la solicitud', 'missing_fields': missing_fields}), 422

    response =saveVisitor(data)

    if response == True:
        return jsonify({'message': 'Visitante Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear visitante', 'error': str(response)}), 400
    
@visitor_bp.route('/<int:id>', methods=['PUT'])
def update_visitor(id):
    data = request.json

    if not data.get('enterprice_id').strip() or not data.get('name').strip() or not data.get('lastname').strip() or not data.get('email').strip() or not data.get('startDate').strip() or not data.get('finishDate').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = SV.updateVisitor(id,data)

    if response == 200:
        return jsonify({'message': 'Visitante Guardado'}), 200
    elif response == 400:
        return jsonify({'error': 'el Visitante no se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'Visitante no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el visitante', 'error': str(response)}), 400

@visitor_bp.route('/<int:id>', methods=['GET'])
def get_visitor_by_id(id):
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    visitor=SV.getVisitorById(id)

    if visitor:
        return jsonify(visitor), 200
    else:
        return jsonify({'error': 'Visitante no encontrado'}), 404

@visitor_bp.route('/', methods=['GET'])
def get_visitors():
    try:
        response=SV.getVisitorAll()
   
        if response is None:
            return jsonify({'error': 'No hay visitantes guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener visitantes', 'error': str(e)}), 400    

@visitor_bp.route('/active', methods=['GET'])
def get_active_visitors():
    try:
        response=SV.getVisitorAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay visitantes activos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener visitantes', 'error': str(e)}), 400    

@visitor_bp.route('/desactive', methods=['GET'])
def get_desactive_visitors():
    try:
        response=SV.getVisitorAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay visitantes desactivados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener visitantes', 'error': str(e)}), 400    

@visitor_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_visitor(id):

    response=SV.setActive(id)

    if response == 200:
        return jsonify({'message': 'visitante activado'}), 200
    elif response == 400:
        return jsonify({'error': 'el visitante ya se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'visitante no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar visitante', 'error': str(response)}), 400 

@visitor_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_visitor(id):
    data = request.json

    response=SV.setDesactive(id)

    if response == 200:
        return jsonify({'message': 'visitante desactivado'}), 200
    elif response == 400:
        return jsonify({'error': 'el visitante ya se encuentra desactivado'}), 400
    elif response == 404:
        return jsonify({'error': 'visitante no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar visitante', 'error': str(response)}), 400 

@visitor_bp.route('/<int:id>/institute', methods=['GET'])
def get_institute_for_visitor(id):    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    response = SV.getInstituteByVisitorId(id)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'no existe relacion'}), 404 

@visitor_bp.route('/<int:id>/category',methods=['GET'])
def get_category_for_visitor(id):
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    response = SV.getCategoryForVisitor(id)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'no existe relacion'}), 404