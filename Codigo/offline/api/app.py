import os, json
from flask import Flask, jsonify, request
from db.db import init_db
from controllers import *
from flask_cors import CORS
from db.Populate import populate_places, populate_institutes, populate_institute_places, populate_roles
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from services.logsService import registrarApertura, registrarCierre, registrarAperturaManual, registrarCierreManual


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
    populate_roles()

apertura_de_dia = True

def apertura():
        with app.app_context():
            global apertura_de_dia
            registrarApertura()
            apertura_de_dia = True

def cierre():
    with app.app_context():
        global apertura_de_dia
        registrarCierre()
        apertura_de_dia = False

scheduler = BackgroundScheduler()
scheduler.add_job(apertura, 'cron', hour=10)  # Configura la hora y minuto deseado
scheduler.add_job(cierre, 'cron', hour=7)  # Configura la hora y minuto deseado
scheduler.start()


@app.route('/open_day', methods=['POST'])
def open_day():
    global apertura_de_dia
    if apertura_de_dia == False:
        apertura_de_dia = True
        data = request.json
        adm_dni = data.get('adm_dni')
        registrarAperturaManual(adm_dni)
        return jsonify({'message': 'Día abierto'}), 200
    return jsonify({'message': 'El día ya se encuentra abierto'}), 204

@app.route('/close_day', methods=['POST'])
def close_day():
    global apertura_de_dia
    if apertura_de_dia == True:
        data = request.json
        adm_dni = data.get('adm_dni')
        registrarCierreManual(adm_dni)
        apertura_de_dia = False
        return jsonify({'message': 'Día cerrado'}), 200
    return jsonify({'message': 'El día ya se encuentra cerrado'}), 204

@app.route('/status_dia', methods=['GET'])
def check_status_dia():
    global apertura_de_dia
    if apertura_de_dia:
        return jsonify({'message': 'Día abierto'}), 200
    else:
        return jsonify({'message': 'Día cerrado'}), 403
    
# Interceptor
@app.before_request
def check_time():
    global apertura_de_dia
    current_time = datetime.now().time()
    start_time = datetime.strptime("07:00", "%H:%M").time()
    end_time = datetime.strptime("23:00", "%H:%M").time()


    if request.path in ['/open_day', '/close_day', '/check_status_dia']:
        return

    if not (start_time <= current_time <= end_time) or not apertura_de_dia:
        return jsonify({"error": "el dia esta cerrado"}), 403

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
app.register_blueprint(logs_bp, url_prefix='/logs')
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(exception_bp, url_prefix='/exception')

def load_config(env):
    with open(os.path.join(current_directory, './config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development') # Carga los valores de 'development'
    app.run(host='0.0.0.0', port=5000, debug=True)
