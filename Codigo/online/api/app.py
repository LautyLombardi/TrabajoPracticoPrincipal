import os, json
from flask import Flask,request, jsonify
from flask_cors import CORS
from db.db import init_db
from controllers import *
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from db.Populate import populate_places, populate_institutes,populate_institute_places
from mailjet_rest import Client

app = Flask(__name__)

# Configurar CORS
CORS(app)

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

def send_email_via_mailjet():
    mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')
    data = {
        'Messages': [
            {
                "From": {
                    "Email": "mss.sixsoftware@gmail.com",
                    "Name": "Patricio"
                },
                "To": [
                    {
                        "Email": MAIL,
                        "Name": "MESSI"
                    }
                ],
                "Subject": "Informe de duplicación",
                "TextPart": "Prueba",
                "CustomID": "AppGettingStartedTest"
            }
        ]
    }

    result = mailjet.send.create(data=data)
    print(result.status_code)
    print(result.json())

scheduler = BackgroundScheduler()

def update_scheduler(day, hour, minute):
    scheduler.remove_all_jobs()
    scheduler.add_job(send_email_via_mailjet, 'cron', day_of_week=day, hour=hour, minute=minute)
    scheduler.start()



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



#--------------------------------------------------------------------------------------------
# Controllers blueprints
#--------------------------------------------------------------------------------------------
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(visitor_bp, url_prefix='/visitor')
app.register_blueprint(faceRecognition_bp, url_prefix='/faceRecognition')
app.register_blueprint(image_bp, url_prefix='/image')

def load_config(env):
    with open(os.path.join(current_directory,'./config.json')) as f:
        config = json.load(f)
        return config.get(env, {})

if __name__ == '__main__':
    config = load_config('development')  # Carga los valores de 'development' 
    app.run(host="0.0.0.0", port=5001, debug=True)


