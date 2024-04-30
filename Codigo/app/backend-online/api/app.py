import os
from flask import Flask, request, jsonify
from models.User import db, User
from models.PersonsImages import db, PersonsImages
from db.db import init_db
from utils.faceRecognition import check_face
from utils.images import image_to_bytes

from flask_cors import CORS
from utils.images import bytes_to_image
import base64

app = Flask(__name__)
CORS(app)

# Configurar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
init_db(app)

# Metodo de testo de conexion
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"connection": "conexion establecida"}), 200

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

# Metodo para reconocimiento facial
@app.route('/faceRecognition', methods=['POST'])
def faceRecognition():
    try:
        if 'image' not in request.files:
            return jsonify({'message': "Error al enviar imagen"}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'message': "No selected image"}), 400
        
        images = PersonsImages.query.all()
        
        if check_face(image_file, images):
            return jsonify({'message': 'Usuario autorizado'}), 200
        
        return jsonify({'message': 'Usuario no autorizado'}), 200
    except Exception as error:
        print("Error:", error)
        return jsonify({'message': 'Error en el servidor'}), 500


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
        image = PersonsImages(userId=1, photo=image_bytes)
        db.session.add(image)
        db.session.commit()


        return jsonify({'message': 'Imagen insertada correctamente en la base de datos.'}), 200
    except Exception as e:
        return jsonify({'message': 'Error al insertar la imagen en la base de datos.', 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
