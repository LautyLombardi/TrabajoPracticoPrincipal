from flask import Blueprint, request, jsonify
from services.instituteService import saveInstitute, updateInstitute, getInstituteById, saveInstitutePlace, getInstituteAll, setDesactive, getInstituteAllActive, getInstituteAllDesactive, setActive, getPlaceByInstituteId

institute_bp = Blueprint('institute', __name__)

@institute_bp.route('/', methods=['POST'])
def create_institute():
    data = request.json
    if not data.get('name').strip():        
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    try:
        response = saveInstitute(data)

        return jsonify(response), 201
    except Exception as e:
        return jsonify({'message': 'Error al crear Institute', 'error': str(response)}), 400

@institute_bp.route('/<int:id>', methods=['PUT'])
def update_institute(id):
    data = request.json
    if not data.get('name').strip(): 
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = updateInstitute(id,data)

    if response == 200:
        return jsonify({'message': 'Institute Guardado'}), 200
    elif response == 400:
        return jsonify({'error': 'el instituto no se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'Institute no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el Institute', 'error': str(response)}), 400

@institute_bp.route('/<int:id>', methods=['GET'])
def get_institute_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    institute = getInstituteById(id)
    if institute:
        return jsonify(institute), 200
    else:
        return jsonify({'error': 'Role no encontrado'}), 404
    
@institute_bp.route('/place', methods=['POST'])
def create_institutePlace():
    data = request.json
    institute_id = data.get('institute_id')
    place_id = data.get('place_id')
    
    if not isinstance(institute_id, int) or not isinstance(place_id, int) or institute_id <= 0 or place_id <= 0:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422 
    
    response = saveInstitutePlace(institute_id, place_id)

    if response == 201:
        return jsonify({'message': 'Asignacion Institute Place creada'}), 201
    elif response == '404a':
        return jsonify({'error': 'el Place no existe'}), 404
    elif response == '404b':
        return jsonify({'error': 'el Institute no existe'}), 404
    elif response == '409':
        return jsonify({'error': 'La asignacion Institute Place ya existe'}), 409
    else:
        return jsonify({'message': 'Error al crear asignacion', 'error': str(response)}), 400

@institute_bp.route('/<int:id>/place', methods=['GET'])
def get_place_for_institute(id):
        
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    response = getPlaceByInstituteId(id)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'no existe relacion'}), 404  

@institute_bp.route('/', methods=['GET'])
def get_institutes():
    try:
        response=getInstituteAll()
   
        if response is None:
            return jsonify({'error': 'No hay institutos guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener institutos', 'error': str(e)}), 400         

@institute_bp.route('/active', methods=['GET'])
def get_active_institutes():
    try:
        response=getInstituteAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay institutos activos en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener institutos', 'error': str(e)}), 400    

@institute_bp.route('/desactive', methods=['GET'])
def get_desactive_institutes():
    try:
        response=getInstituteAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay institutos desactivados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener institutos', 'error': str(e)}), 400    

@institute_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_institute(id):

    response=setActive(id)

    if response == 200:
        return jsonify({'message': 'instituto activado'}), 200
    elif response == 400:
        return jsonify({'error': 'el instituto ya se encuentra activado'}), 400
    elif response == 404:
        return jsonify({'error': 'instituto no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar instituto', 'error': str(response)}), 400 

@institute_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_institute(id):
    data = request.json

    response=setDesactive(id)

    if response == 200:
        return jsonify({'message': 'instituto desactivado'}), 200
    elif response == 400:
        return jsonify({'error': 'el instituto ya se encuentra desactivado'}), 400
    elif response == 404:
        return jsonify({'error': 'instituto no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar instituto', 'error': str(response)}), 400 
