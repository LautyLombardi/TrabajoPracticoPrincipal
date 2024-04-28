from flask import Flask, request, jsonify
from models.User import db, User
from models.PersonsImages import db, PersonsImages
from db.db import init_db
from utils.faceRecognition import check_face
from utils.images import image_to_bytes

app = Flask(__name__)

# Configurar la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/Pais Gamer/OneDrive/Escritorio/Trabajo Practico final/TrabajoPracticoPrincipal/Codigo/online/api/db/dataBase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
init_db(app)

# Método POST para agregar un usuario
@app.route('/user', methods=['POST'])
def add_user():
    data = request.json
    if 'name' not in data or 'lastname' not in data:
        return jsonify({'error': 'Faltan campos en la solicitud'}), 400
    
    new_user = User(name=data['name'], lastname=data['lastname'])
    db.session.add(new_user)
    db.session.commit()
    
    # Consultar el usuario recién creado
    user = User.query.filter_by(id=new_user.id).first()
    
    # Comprobar si se encontró el usuario
    if user:
        # Devolver los datos del usuario en la respuesta
        user_data = {
            'id': user.id,
            'name': user.name,
            'lastname': user.lastname
        }
        return jsonify({'message': 'Datos almacenados exitosamente', 'user': user_data}), 201
    else:
        return jsonify({'error': 'No se pudo encontrar el usuario recién creado'}), 500

# Metodo para reconocimiento facial
@app.route('/faceRacognition', methods=['POST'])
def faceRacognition():
    if 'image' not in request.files:
        return jsonify({'message': "Error al enviar imagen"}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'message': "No selected image"}), 400
    
    if(check_face(image_file)):
        return jsonify({'message': 'Usuario autorizado'}), 200
    
    return jsonify({'message': 'Usuario no autorizado'}), 400



@app.route('/insert_image', methods=['POST'])
def insert_image():
    try:
        # Verifica si el archivo está presente en la solicitud
        if 'imagen' not in request.files:
            return jsonify({'message': 'No se encontró ningún archivo en la solicitud.'}), 400

        # Obtengo  el archivo de la solicitud
        input_image = request.files['imagen']

        # Verifica si el archivo tiene un nombre
        if input_image.filename == '':
            return jsonify({'message': 'El archivo no tiene nombre.'}), 400

        # Verifica si el archivo es una imagen
        if not input_image.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            return jsonify({'message': 'El archivo no es una imagen válida.'}), 400

        image_bytes = input_image.read()

        # Insertar en db 
        image = PersonsImages(userId=1, photo=image_bytes)
        db.session.add(image)
        db.session.commit()

        return jsonify({'message': 'Imagen insertada correctamente en la base de datos.'}), 200
    except Exception as e:
        return jsonify({'message': 'Error al insertar la imagen en la base de datos.', 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
