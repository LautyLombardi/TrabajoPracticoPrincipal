from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.categoryService import saveCategory, updateCategory, getCategoryById, getCategoryAll, setDesactive, getCategoryAllActive, getCategoryAllDesactive, setActive, setDesactive, saveInstituteCategory,getInstituteByCategoryId, saveCategoryVisitor, getVisitorByCategoryId

category_bp = Blueprint('category', __name__)
CORS(category_bp)

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
    elif response == 400:
        return jsonify({'error': 'la categoria no se encuentra activada'}), 400
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

@category_bp.route('/active', methods=['GET'])
def get_active_categorias():
    try:
        response=getCategoryAllActive()
   
        if response is None:
            return jsonify({'error': 'No hay categorias activas en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener categorias', 'error': str(e)}), 400    

@category_bp.route('/desactive', methods=['GET'])
def get_desactive_categories():
    try:
        response=getCategoryAllDesactive()
   
        if response is None:
            return jsonify({'error': 'No hay categorias desactivadas en la base de datos'}), 404     
        else:
            return jsonify(response), 200

    except Exception as e: 
        return jsonify({'message': 'Error al obtener categorias', 'error': str(e)}), 400    

@category_bp.route('/active/<int:id>', methods=['PUT'])
def set_active_category(id):

    response=setActive(id)

    if response == 200:
        return jsonify({'message': 'categoria activada'}), 200
    elif response == 400:
        return jsonify({'error': 'la categoria ya se encuentra activada'}), 400
    elif response == 404:
        return jsonify({'error': 'categoria no encontrada'}), 404
    else:
        return jsonify({'message': 'Error al modificar categoria', 'error': str(response)}), 400 

@category_bp.route('/desactive/<int:id>', methods=['PUT'])
def set_desactive_category(id):
    data = request.json

    response=setDesactive(id)

    if response == 200:
        return jsonify({'message': 'categoria desactivada'}), 200
    elif response == 400:
        return jsonify({'error': 'la categoria ya se encuentra desactivada'}), 400
    elif response == 404:
        return jsonify({'error': 'categoria no encontrada'}), 404
    else:
        return jsonify({'message': 'Error al modificar categoria', 'error': str(response)}), 400 

@category_bp.route('/institute', methods=['POST'])
def create_categoryInstitute():
    data = request.json
    institute_id = data.get('institute_id')
    category_id = data.get('category_id')
    
    if not isinstance(institute_id, int) or not isinstance(category_id, int) or institute_id <= 0 or category_id <= 0:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422 
    
    response = saveInstituteCategory(institute_id, category_id)

    if response == 201:
        return jsonify({'message': 'Asignacion Institute Category creada'}), 201
    elif response == '404a':
        return jsonify({'error': 'la Category no existe'}), 404
    elif response == '404b':
        return jsonify({'error': 'el Institute no existe'}), 404
    elif response == '409':
        return jsonify({'error': 'La asignacion Institute Category ya existe'}), 409
    else:
        return jsonify({'message': 'Error al crear asignacion', 'error': str(response)}), 400

@category_bp.route('/<int:id>/institute', methods=['GET'])
def get_institute_for_category(id):
        
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    response = getInstituteByCategoryId(id)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'no existe relacion'}), 404    

@category_bp.route('/visitor', methods=['POST'])
def create_categoryVisitor():
    data = request.json
    visitor_dni = data.get('visitor_dni')
    category_id = data.get('category_id')
    
    if not isinstance(visitor_dni, int) or not isinstance(category_id, int) or visitor_dni <= 0 or category_id <= 0:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422 
    
    response = saveCategoryVisitor(visitor_dni, category_id)

    if response == 201:
        return jsonify({'message': 'Asignacion Visitor Category creada'}), 201
    elif response == '404a':
        return jsonify({'error': 'la Category no existe'}), 404
    elif response == '404b':
        return jsonify({'error': 'el Visitor no existe'}), 404
    elif response == '409':
        return jsonify({'error': 'La asignacion Visitor Category ya existe'}), 409
    else:
        return jsonify({'message': 'Error al crear asignacion', 'error': str(response)}), 400

@category_bp.route('/<int:id>/visitor', methods=['GET'])
def get_visitor_for_category(id):
        
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
        
    response = getVisitorByCategoryId(id)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'no existe relacion'}), 404 
    
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

