import os, json
from flask import Flask, jsonify
from flask_cors import CORS
from db.db import init_db
from controllers import *
from flask_cors import CORS
from db.Populate import populate_places, populate_institutes,populate_institute_places

app = Flask(__name__)

# Configurar CORS
CORS(app)

# Configurar e inicializar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_db(app)


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message':'listening online...'}),200

#--------------------------------------------------------------------------------------------
# Controllers blueprints
#--------------------------------------------------------------------------------------------
app.register_blueprint(sync_bp,url_prefix='/sync')
app.register_blueprint(faceRecognition_bp, url_prefix='/faceRecognition')
app.register_blueprint(image_bp, url_prefix='/image')

def load_config(env):
    with open(os.path.join(current_directory,'./config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development')  # Carga los valores de 'development' 
    app.run(host="0.0.0.0", port=5001, debug=True)


