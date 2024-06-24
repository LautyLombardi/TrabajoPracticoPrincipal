from db.db import db
from models.Logs import Logs
from openpyxl import Workbook
from flask import current_app

def obtener_logs():
    with current_app.app_context():
        try:
            logs_data = Logs.query.filter(Logs.abm.in_(["Modificacion de visitante", "Modificacion de usuario"])).all()
            return logs_data
        except Exception as e:
            print(f'Error al obtener los logs específicos: {str(e)}')
            return None

def exportar_a_excel(data, file_path):
    wb = Workbook()
    ws = wb.active
    ws.append(['ID', 'ADM DNI', 'DNI', 'ABM', 'ABM Type', 'Description', 'Create Date', 'Is Error'])

    for log in data:
        dni=log.userId or log.visitorId
        if log.isError == 1:
            isError = 'Si'
        else:
            isError = 'No'
        ws.append([
            log.id,
            log.admDni,
            dni,
            log.abm,
            log.abmType,
            log.description,
            log.createDate,
            isError
        ])

    wb.save(file_path)
    print('Archivo Excel generado correctamente.')