import os, json
from flask import Flask, jsonify
from db.db import init_db
from controllers import *

app = Flask(__name__)

# Configurar e inicializar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_db(app)


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message':'listening online...'}),200

# Metodo para reconocimiento facial

# Metodo para guardar usuario en db
""" @app.route('/insert_image', methods=['POST'])
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
        return jsonify({'message': 'Error al insertar la imagen en la base de datos.', 'error': str(e)}), 400 """

#--------------------------------------------------------------------------------------------
# Controllers blueprints
#--------------------------------------------------------------------------------------------
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(visitor_bp, url_prefix='/visitor')

def load_config(env):
    with open(os.path.join(current_directory,'./config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development') # Carga los valores de 'development' 
    app.run(host=config.get('host'), port=config.get('port'), debug=True)
