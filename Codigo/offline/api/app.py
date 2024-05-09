import os, json
from flask import Flask, request, jsonify
from db.db import init_db, db, Image, User
from services.placeService import savePlace, updatePlace, getPlaceById

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

@app.route('/user', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_dict = {
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname
        }
        user_list.append(user_dict)
    return jsonify(user_list)

# Método DELETE para eliminar todos los usuarios solo para desarrolladores
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


# Método POST para agregar un usuario
@app.route('/user', methods=['POST'])
def add_user():
    data = request.json
    if 'name' not in data or 'lastname' not in data:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 400
    
    new_user = User(name=data['name'], lastname=data['lastname'])
    db.session.add(new_user)
    db.session.commit()
    
    # Consultar el usuario recién creado, comprobarlo y devolverlo
    user = User.query.filter_by(id=new_user.id).first()
    if user:
        user_data = {
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname
        }
        return jsonify({'message': 'Datos almacenados exitosamente', 'user': user_data}), 201
    else:
        return jsonify({'error': 'No se pudo encontrar el usuario recién creado'}), 500

# Metodo para guardar usuario en db
@app.route('/insert_image', methods=['POST'])
def insert_image():
    try:
        # Excepciones
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


@app.route('/place', methods=['POST'])
def create_category():
    data = request.json
    
    if not data.get('name').strip() or not data.get('abbreviation').strip() or not data.get('description').strip() or not data.get('openTime').strip() or not data.get('closeTime').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    response = savePlace(data)
    if response == True:
        return jsonify({'message': 'Lugar Registrado'}), 201
    else:
        return jsonify({'message': 'Error al crear lugar', 'error': str(response)}), 400



@app.route('/place/<int:id>', methods=['PUT'])
def update_category(id):     
    data = request.json

    if not data.get('name').strip() or not data.get('abbreviation').strip() or not data.get('description').strip() or not data.get('openTime').strip() or not data.get('closeTime').strip():
        return jsonify({'error': 'Faltan campos en la solicitud'}), 422

    response = updatePlace(id, data)
    
    if response == 200:
        return jsonify({'message': 'Lugar Guardado'}), 200
    elif response == 404:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    else:
        return jsonify({'message': 'Error al modificar categoría', 'error': str(response)}), 400        

@app.route('/place/<int:id>', methods=['GET'])
def get_place_by_id(id):
    
    if id <= 0:
        return jsonify({'error': 'ID inválido'}), 422
    
    place = getPlaceById(id)
    if place:
        return jsonify(place), 200
    else:
        return jsonify({'error': 'Lugar no encontrado'}), 404

def load_config(env):
    with open(os.path.join(current_directory,'./config.json')) as f:
        config = json.load(f)
        return config.get(env, {})
    
if __name__ == '__main__':
    config = load_config('development') # Carga los valores de 'development' 
    app.run(host=config.get('host'), port=config.get('port'), debug=True)
