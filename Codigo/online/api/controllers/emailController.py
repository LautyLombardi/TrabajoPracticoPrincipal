import os
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

data_bp = Blueprint('data', __name__)
CORS(data_bp)

DATA_FILE = 'data.json'  # Cambia esta ruta según sea necesario

data_bp = Blueprint('data', __name__)
CORS(data_bp)

DATA_FILE = 'data.json'  # Cambia esta ruta según sea necesario

def save_data(email, date):
    data = {
        'email': email,
        'date': date.strftime('%Y-%m-%d %H:%M:%S')
    }
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r+') as file:
            file_data = json.load(file)
            file_data.append(data)
            file.seek(0)
            json.dump(file_data, file, indent=4)
    else:
        with open(DATA_FILE, 'w') as file:
            json.dump([data], file, indent=4)

def load_data():
    try:
        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
            if not data:
                return None, None
            return data[-1]['email'], datetime.strptime(data[-1]['date'], '%Y-%m-%d %H:%M:%S')
    except FileNotFoundError:
        return None, None
    except Exception as e:
        print(f'Error loading data from {DATA_FILE}: {str(e)}')
        return None, None

@data_bp.route('/email', methods=['POST'])
def insert_data():
    if 'email' not in request.form or 'date' not in request.form:
        return jsonify({'message': 'Correo electrónico o fecha no encontrados en la solicitud.'}), 400

    email = request.form['email']
    date_str = request.form['date']

    if '@' not in email or '.' not in email:
        return jsonify({'message': 'El correo electrónico no es válido.'}), 400

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({'message': 'La fecha no tiene un formato válido. Use YYYY-MM-DD HH:MM:SS.'}), 400

    save_data(email, date)

    return jsonify({'message': 'Datos guardados correctamente.', 'email': email}), 200

