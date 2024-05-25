import os, json
from flask import Flask, jsonify, request
from db.db import init_db
from controllers import *
from flask_cors import CORS
from db.Populate import populate_places, populate_institutes, populate_institute_places
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configurar e inicializar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_db(app)
with app.app_context():
    populate_places()
    populate_institutes()
    populate_institute_places()

apertura_de_dia = True

@app.route('/abrir_dia', methods=['POST'])
def abrir_dia():
    global apertura_de_dia
    apertura_de_dia = True
    return jsonify({'message': 'Día abierto'}), 200


@app.route('/cerrar_dia', methods=['POST'])
def cerrar_dia():
    global apertura_de_dia
    apertura_de_dia = False
    return jsonify({'message': 'Día cerrado'}), 200


@app.route('/estado_dia', methods=['GET'])
def estado_dia():
    global apertura_de_dia
    return jsonify({'apertura_de_dia': apertura_de_dia}), 200

# Interceptor
@app.before_request
def check_time():
    global apertura_de_dia
    current_time = datetime.now().time()
    start_time = datetime.strptime("07:00", "%H:%M").time()
    end_time = datetime.strptime("22:00", "%H:%M").time()


    if request.path in ['/abrir_dia', '/cerrar_dia', '/estado_dia']:
        return

    if not (start_time <= current_time <= end_time) or not apertura_de_dia:
        return jsonify({"error": "El servicio no está disponible. Por favor, intente entre las 7:00 y las 22:00, o verifique si el día está abierto."}), 403

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'listening...'}), 200

#--------------------------------------------------------------------------------------------
# Controllers blueprints
#--------------------------------------------------------------------------------------------
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(role_bp, url_prefix='/role')
app.register_blueprint(place_bp, url_prefix='/place')
app.register_blueprint(visitor_bp, url_prefix='/visitor')
app.register_blueprint(category_bp, url_prefix='/category')
app.register_blueprint(institute_bp, url_prefix='/institute')
app.register_blueprint(enterprice_bp, url_prefix='/enterprice')
app.register_blueprint(api_bp, url_prefix='/api')

def load_config(env):
    with open(os.path.join(current_directory, './config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development') # Carga los valores de 'development'
    app.run(host='0.0.0.0', port=config.get('port'), debug=True)
