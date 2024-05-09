import os, json
from flask import Flask, request, jsonify
from db.db import init_db, db, Image, User
from services.placeService import savePlace, updatePlace, getPlaceById
from services.visitorService import saveVisitor, updateVisitor, getVisitorById
from services.categoryService import saveCategory , updateCategory, getCategoryById
from services.userService import updateUser,saveUser, getUserById
from services.roleService import saveRole,updateRole,getRole
from services.instituteService import saveInstitute,updateInstitute,getInstituteById

app = Flask(__name__)

# Configurar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
init_db(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message':'listening...'}),200

#--------------------------------------------------------------------------------------------
# User
#--------------------------------------------------------------------------------------------
@app.route('/user', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_dict = {
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname,
            'password':user.password,            
            'rol':user.rol,
            'DNI':user.DNI
        }
        user_list.append(user_dict)
    return jsonify(user_list)

@app.route('/user', methods=['DELETE'])
def delete_all_users():
    try:
        # Elimina todos los usuarios
        num_deleted = db.session.query(User).delete()
        db.session.commit()
        
        return jsonify({'message': f'{num_deleted} usuarios eliminados exitosamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar usuarios', 'details': str(e)}), 500

@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    if 'name' not in data or 'lastname' not in data or 'role_id' not in data or 'password' not in data or 'dni' not in data or 'isActive' not in data or 'motive' not in data or 'activeDate' not in data:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 400
    
    response = saveUser(data)
    if response == True:
        return jsonify({'message': 'User Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear usuario', 'error': str(response)}), 400

@app.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    if 'name' not in data or 'lastname' not in data or 'role_id' not in data or 'password' not in data or 'isActive' not in data or 'motive' not in data or 'activeDate' not in data:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 400
    
    response = updateUser(id, data)
    
    if response == 200:
        return jsonify({'message': 'usuario Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'usuario no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar usuario', 'error': str(response)}), 400 

@app.route('/user/<int:id>', methods=['GET'])
def get_user_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    user = getUserById(id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

#--------------------------------------------------------------------------------------------
# Image
#--------------------------------------------------------------------------------------------
@app.route('/insert_image', methods=['POST'])
def insert_image():
    try:
        if 'image' not in request.files:
            return jsonify({'message': 'No se encontró ningún archivo en la solicitud.'}), 400

        input_image = request.files['image']
        if input_image.filename == '':
            return jsonify({'message': 'El archivo no tiene nombre.'}), 400
        
        if not input_image.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            return jsonify({'message': 'El archivo no es una imagen válida.'}), 400
        
        # Insertar en db 
        image_bytes = input_image.read()
        image = Image(userId=1, visitorId=None, photo=image_bytes)
        db.session.add(image)
        db.session.commit()


        return jsonify({'message': 'Imagen insertada correctamente en la base de datos.'}), 200
    except Exception as e:
        return jsonify({'message': 'Error al insertar la imagen en la base de datos.', 'error': str(e)}), 400

#--------------------------------------------------------------------------------------------
# Place
#--------------------------------------------------------------------------------------------
@app.route('/place', methods=['POST'])
def create_place():
    data = request.json
    
    if not data.get('name').strip() or not data.get('abbreviation').strip() or not data.get('description').strip() or not data.get('openTime').strip() or not data.get('closeTime').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    response = savePlace(data)
    if response == True:
        return jsonify({'message': 'Lugar Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear lugar', 'error': str(response)}), 400

@app.route('/place/<int:id>', methods=['PUT'])
def update_place(id):     
    data = request.json

    if not data.get('name').strip() or not data.get('abbreviation').strip() or not data.get('description').strip() or not data.get('openTime').strip() or not data.get('closeTime').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    response = updatePlace(id, data)
    
    if response == 200:
        return jsonify({'message': 'Lugar Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Lugar no encontrada'}), 404
    else:
        return jsonify({'message': 'Error al modificar lugar', 'error': str(response)}), 400

@app.route('/place/<int:id>', methods=['GET'])
def get_place_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    place = getPlaceById(id)
    if place:
        return jsonify(place), 200
    else:
        return jsonify({'error': 'Lugar no encontrado'}), 404               

#--------------------------------------------------------------------------------------------
# Visitor
#--------------------------------------------------------------------------------------------
@app.route('/visitor', methods=['POST'])
def create_visitor():
    data = request.json

    if not data.get('dni').strip() or not data.get('enterprice_id').strip() or not data.get('name').strip() or not data.get('lastname').strip() or not data.get('email').strip() or not data.get('startDate').strip() or not data.get('finishDate').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response =saveVisitor(data)

    if response == True:
        return jsonify({'message': 'Visitante Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear visitante', 'error': str(response)}), 400
    
@app.route('/visitor/<int:id>', methods=['PUT'])
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

@app.route('/visitor/<int:id>', methods=['GET'])
def get_visitor_by_id(id):
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    visitor=getVisitorById(id)

    if visitor:
        return jsonify(visitor), 200
    else:
        return jsonify({'error': 'Visitante no encontrado'}), 404

#--------------------------------------------------------------------------------------------
# Category
#--------------------------------------------------------------------------------------------
@app.route('/category', methods=['POST'])
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

@app.route('/category/<int:id>', methods=['PUT'])
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

@app.route('/category/<int:id>', methods=['GET'])
def get_category_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    category = getCategoryById(id)
    if category:
        return jsonify(category), 200
    else:
        return jsonify({'error': 'categoria no encontrado'}), 404                  
       
#--------------------------------------------------------------------------------------------
# Role
#--------------------------------------------------------------------------------------------
@app.route('/role', methods=['POST'])
def create_role():
    data = request.json
    if not data.get('name').strip() or not data.get('description').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = saveRole(data)

    if response == True:
        return jsonify({'message': 'Role Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear Role', 'error': str(response)}), 400

@app.route('/role/<int:id>', methods=['PUT'])
def update_role(id):
    data = request.json
    if not data.get('name').strip() or not data.get('description').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = updateRole(id,data)

    if response == 200:
        return jsonify({'message': 'Role Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Role no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el role', 'error': str(response)}), 400

@app.route('/role/<int:id>', methods=['GET'])
def get_role_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    role = getRole(id)
    if role:
        return jsonify(role), 200
    else:
        return jsonify({'error': 'Role no encontrado'}), 404

#--------------------------------------------------------------------------------------------
# Institute
#--------------------------------------------------------------------------------------------
@app.route('/institute', methods=['POST'])
def create_institute():
    data = request.json
    if not data.get('name').strip() or int(data.get('place_id')) <= 0:        
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = saveInstitute(data)

    if response == True:
        return jsonify({'message': 'Institute Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear Institute', 'error': str(response)}), 400

@app.route('/institute/<int:id>', methods=['PUT'])
def update_institute(id):
    data = request.json
    if not data.get('name').strip() or int(data.get('place_id')) <= 0: 
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422
    
    response = updateInstitute(id,data)

    if response == 200:
        return jsonify({'message': 'Institute Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Institute no encontrado'}), 404
    else:
        return jsonify({'message': 'Error al modificar el Institute', 'error': str(response)}), 400

@app.route('/institute/<int:id>', methods=['GET'])
def get_institute_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    institute = getInstituteById(id)
    if institute:
        return jsonify(institute), 200
    else:
        return jsonify({'error': 'Role no encontrado'}), 404

def load_config(env):
    with open(os.path.join(current_directory,'./config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development') # Carga los valores de 'development' 
    app.run(host=config.get('host'), port=config.get('port'), debug=True)
