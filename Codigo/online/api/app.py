from flask import Flask, request, jsonify
from models.User import db, User
from db.db import init_db
from utils.faceRecognition import check_face

app = Flask(__name__)

# Configurar la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/franc/OneDrive/Escritorio/TrabajoPracticoPrincipal/Codigo/online/api/db/dataBase.db'
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
        return "Error al enviar imagen", 400

    image_file = request.files['image']
    if image_file.filename == '':
        return "No selected image", 400
    
    if(check_face(image_file)):
        return "Usuario autorizado", 200

    return "Usuario no autorizado", 401

if __name__ == '__main__':
    app.run(debug=True)
