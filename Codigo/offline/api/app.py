import os, json
from flask import Flask, jsonify
from db.db import init_db, populate_institute_places, populate_institutes, populate_places
from controllers import *

app = Flask(__name__)

# Configurar e inicializar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_db(app)





@app.route('/', methods=['GET'])
def index():
    return jsonify({'message':'listening...'}), 200


#--------------------------------------------------------------------------------------------
# Controllers blueprints
#--------------------------------------------------------------------------------------------
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(role_bp, url_prefix='/role')
app.register_blueprint(place_bp, url_prefix='/place')
app.register_blueprint(visitor_bp, url_prefix='/visitor')
app.register_blueprint(category_bp, url_prefix='/category')
app.register_blueprint(institute_bp, url_prefix='/institute')

def load_config(env):
    with open(os.path.join(current_directory,'./config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development') # Carga los valores de 'development' 
    app.run(host=config.get('host'), port=config.get('port'), debug=True)
