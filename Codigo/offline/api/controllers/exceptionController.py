from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.exceptionService import saveException , getAllExceptions


exception_bp = Blueprint('exception', __name__)
CORS(exception_bp)


@exception_bp.route('/', methods=['POST'])
def create_exception():
    data = request.json

    error = validate(data)
    if error  is not None:
        return error 

    response = saveException(data)
        
    if response == 201:
        return jsonify({'message': 'Exception Registrada'}), 201
    elif response == '404a':
        return jsonify({'error': 'el Place no existe'}), 404
    elif response == '404b':
        return jsonify({'error': 'la Categoria no existe'}), 402
    elif response == '404c':
        return jsonify({'error': 'el Usuario no existe'}), 403        
    elif response == '409':
        return jsonify({'error': 'La exception ya existe'}), 409
    else:
        # Si la respuesta es un diccionario con un error, devuélvelo con un estado 500
        return jsonify({'message': 'Error al crear la excepción', 'error': str(response['error'])}), 500

@exception_bp.route('/', methods=['GET'])
def get_exceptions():
    response = getAllExceptions()
    if response is not None:
        return jsonify(response), 200   
    else:
        return jsonify({'message': 'Error al obtener las excepciones', 'error': str(response)}), 400  


def validate(data):
  
    if data.get('user_dni') is None or data.get('category_id') is None or data.get('place_id') is None or data.get('name') is None or data.get('description') is None or data.get('duration') is None  or data.get('adm_dni') is None:
        return jsonify({'error': 'No se pasaron todos los campos requeridos'}), 422


    if not isinstance(data.get('name'), str) or not isinstance(data.get('description'), str) or not isinstance(data.get('duration'), str):
        return jsonify({'error': 'Los campos name , description y duration deben ser strings'}), 422

    if not data.get('name').strip() or not data.get('description').strip()  or not data.get('description').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    user_dni = data.get('user_dni')
    category_id = data.get('category_id')
    place_id = data.get('place_id')
    adm_dni= data.get('adm_dni')

    if  not isinstance(user_dni, int) or not isinstance(category_id, int) or not isinstance(place_id, int) or not isinstance(adm_dni, int) :
        return jsonify({'error': ' user_dni, category_id , place_id y adm_dni  deben ser un entero'}), 422

    return None     





