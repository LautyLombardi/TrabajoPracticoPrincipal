from flask import Blueprint, request, jsonify
from services.visitorService import saveVisitor, updateVisitor, getVisitorById, getVisitorAll

visitor_bp = Blueprint('visitor', __name__)

@visitor_bp.route('/', methods=['POST'])
def create_visitor():
    data = request.json

    if not data.get('dni').strip() or not data.get('enterprice_id').strip() or not data.get('name').strip() or not data.get('lastname').strip() or not data.get('email').strip() or not data.get('startDate').strip() or not data.get('finishDate').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
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
    
    response = updateVisitor(id,data)

    if response == 200:
        return jsonify({'message': 'Visitante Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Visitante no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el visitante', 'error': str(response)}), 400

@visitor_bp.route('/<int:id>', methods=['GET'])
def get_visitor_by_id(id):
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    visitor=getVisitorById(id)

    if visitor:
        return jsonify(visitor), 200
    else:
        return jsonify({'error': 'Visitante no encontrado'}), 404

@visitor_bp.route('/', methods=['GET'])
def get_visitors():
    try:
        response=getVisitorAll()
   
        if response is None:
            return jsonify({'error': 'No hay visitantes guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener visitantes', 'error': str(e)}), 400    
