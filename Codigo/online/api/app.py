import os
import json
import base64
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from db.db import init_db
from controllers import *
from apscheduler.schedulers.background import BackgroundScheduler
from mailjet_rest import Client
from services.logService import obtener_logs, exportar_a_excel

app = Flask(__name__)

# Configurar CORS
CORS(app, resourses={r"/*": {"origins": "*"}})

# Configurar e inicializar la base de datos
current_directory = os.path.dirname(os.path.realpath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(current_directory, "db", "dataBase.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_db(app)

MAILJET_API_KEY = 'bfa74c164b8e20a2badb24a231aaf15e'
MAILJET_API_SECRET = 'ccc1ff1f0c967eb2618f220b01dfd38e'
MAIL = ''
DAY = ''
HOUR = ''
MINUTE=''

def send_email_via_mailjet(file_path):
    mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')

    # Adjuntar el archivo Excel
    with open(file_path, 'rb') as f:
        file_content = f.read()

    data = {
        'Messages': [
            {
                "From": {
                    "Email": "mss.sixsoftware@gmail.com",
                    "Name": "MSS"
                },
                "To": [
                    {
                        "Email": MAIL,
                        "Name": "Al que corresponda"
                    }
                ],
                "Subject": "Informe de Logs",
                "TextPart": "Adjunto encontrarás el informe de logs.",
                "Attachments": [
                    {
                        "ContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Filename": "logs_data.xlsx",
                        "Base64Content": base64.b64encode(file_content).decode('utf-8')
                    }
                ]
            }
        ]
    }

    result = mailjet.send.create(data=data)
    print(result.status_code)
    print(result.json())

scheduler = BackgroundScheduler()

def update_scheduler(day, hour, minute):
    with app.app_context():
        scheduler.remove_all_jobs()
        scheduler.add_job(send_logs_email_task, 'cron', day_of_week=day, hour=hour, minute=minute)
        if not scheduler.running:
            scheduler.start()

def send_logs_email_task():
    with app.app_context():
        logs_data = obtener_logs()
        if logs_data:
            file_path = os.path.join(current_directory, 'logs_data.xlsx')
            exportar_a_excel(logs_data, file_path)
            send_email_via_mailjet(file_path)
        else:
            print('No se pudieron obtener los logs.')

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message':'listening online...'}),200

@app.route('/email', methods=['POST'])
def set_email_schedule():
    global MAIL, DAY, HOUR, MINUTE
    data = request.get_json()

    if not all(k in data for k in ("mail", "day", "hour")):
        return jsonify({'message': 'Faltan parámetros en la solicitud.'}), 400

    MAIL = data['mail']
    DAY = data['day']
    if ':' in data['hour']:
        hour, minute = data['hour'].split(':')
        HOUR = int(hour)
        MINUTE = int(minute)
    else:
        return jsonify({'message': 'El formato de hora y minutos debe ser HH:MM.'}), 400

    update_scheduler(DAY, HOUR, MINUTE)

    return jsonify({'message': 'Parámetros establecidos correctamente.', 'mail': MAIL, 'day': DAY, 'hour': HOUR, 'minute': MINUTE}), 200

@app.route('/download_db', methods=['GET'])
def download_db():
    try:
        return send_file(os.path.join(current_directory, 'db', 'dataBase.db'), as_attachment=True)
    except Exception as e:
        return str(e), 500

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
    config = load_config('production')  # Carga los valores de 'development' 
    app.run(host=config.get('host'), port=config.get('port'), debug=True)
