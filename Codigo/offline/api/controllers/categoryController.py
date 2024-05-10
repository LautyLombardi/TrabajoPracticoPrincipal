from flask import Blueprint, request, jsonify
from services.categoryService import saveCategory , updateCategory, getCategoryById

category_bp = Blueprint('category', __name__)

@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.json

    if not data.get('name').strip() or not data.get('description').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    is_extern = data.get('isExtern')
    if not isinstance(is_extern, int):
        return jsonify({'error': 'isExtern debe ser un entero'}), 422

    if is_extern != 0 and is_extern != 1:
        return jsonify({'error': 'isExtern debe ser 0 o 1'}), 422

    response = saveCategory(data)
        
    if response == True:
        return jsonify({'message': 'Categoria Registrada'}), 201
    else:
        return jsonify({'message': 'Error al crear categoria', 'error': str(response)}), 400

@category_bp.route('/<int:id>', methods=['PUT'])
def update_category(id):
    data = request.json

    if not data.get('name').strip() or not data.get('description').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422


    is_extern = data.get('isExtern')
    if not isinstance(is_extern, int):
        return jsonify({'error': 'isExtern debe ser un entero'}), 422

    if is_extern != 0 and is_extern != 1:
        return jsonify({'error': 'isExtern debe ser 0 o 1'}), 422

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