from flask import Blueprint, request, jsonify
from services.categoryService import saveCategory , updateCategory, getCategoryById, getCategoryAll
from utils.date import check_schedule_format


category_bp = Blueprint('category', __name__)

@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.json

    error = validate(data)
    if error  is not None:
        return error 

    response = saveCategory(data)
        
    if response == True:
        return jsonify({'message': 'Categoria Registrada'}), 201
    else:
        return jsonify({'message': 'Error al crear categoria', 'error': str(response)}), 400

@category_bp.route('/<int:id>', methods=['PUT'])
def update_category(id):
    data = request.json


    error = validate(data)
    if error  is not None:
        return error 

    response= updateCategory(id,data)

    if response == 200:
        return jsonify({'message': 'Categoria Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    else:
        return jsonify({'message': 'Error al modificar categoría', 'error': str(response)}), 400

@category_bp.route('/<int:id>', methods=['GET'])
def get_category_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    category = getCategoryById(id)
    if category:
        return jsonify(category), 200
    else:
        return jsonify({'error': 'categoria no encontrado'}), 404    


@category_bp.route('/', methods=['GET'])
def get_categories():
    try:
        response=getCategoryAll()
   
        if response is None:
            return jsonify({'error': 'No hay categorias guardados en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener categorias', 'error': str(e)}), 400   

def validate(data):
  
    if data.get('name') is None or data.get('description') is None or data.get('isExtern') is None:
        return jsonify({'error': 'No se pasaron todos los campos requeridos'}), 422


    if not isinstance(data.get('name'), str) or not isinstance(data.get('description'), str):
        return jsonify({'error': 'Los campos name y description deben ser strings'}), 422

    if not data.get('name').strip() or not data.get('description').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422


    is_extern = data.get('isExtern')
    if not isinstance(is_extern, int):
        return jsonify({'error': 'isExtern debe ser un entero'}), 422

    if is_extern != 0 and is_extern != 1:
        return jsonify({'error': 'isExtern debe ser 0 o 1'}), 422

      