from db.db import db
from models.Logs import Logs
from utils.date import createDate
from datetime import datetime

def registrarApertura():
    nuevo_log = Logs(
        aperturaCierre='Apertura',
        createDate=createDate(),
        description='Registro de apertura del día'
    )
    # Guardar el nuevo registro en la base de datos
    try:
        db.session.add(nuevo_log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return 400

def registrarCierre():
    # Crear un nuevo registro de log para el cierre del día
    nuevo_log = Logs(
        aperturaCierre='Cierre',  # Indica que es una Cierre
        createDate=createDate(),
        description='Registro del cierre del día'
    )
    try:
        db.session.add(nuevo_log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return 400

#Usuario registrado y carga del log
def recordUserRegistrationManual(data):
    try:
        nuevo_log = Logs(
            userId=data.get('dni'),
            abm='ABM USUARIO',
            abmType ='ALTA',
            description='Alta de usuario por registro facial',
            createDate= createDate(),
            isAutomatic=0
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e

def recordImageUser(user_dni):
    try:
        nuevo_log = Logs(
            userId=user_dni,
            abm='ABM Imagen',
            abmType ='ALTA',
            description='Se asocia una imagen a un usuario',
            createDate= createDate(),
            isAutomatic=0
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e

def recordImageVisitor(visitor_dni):
    try:
        nuevo_log = Logs(
            visitorId=visitor_dni,
            abm='ABM Imagen',
            abmType ='ALTA',
            description='Se asocia una imagen a un visitante',
            createDate= createDate(),
            isAutomatic=0
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e


#Registro del visitante y guardado del log
def recordVisitorRegistrationManual(data):
    try:
        nuevo_log = Logs(
            visitorId= data.get('visitor_dni'),
            abm='ABM VISITANTE',
            abmType = 'ALTA',
            description='Alta de visitante por registro manual',
            createDate= createDate(),
            isAutomatic=0
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e
    
#Login del visitante por reconocimiento facial y guardado del log
def recordVisitorLoginAutomatic(data):
    try:
        nuevo_log = Logs(
            visitorId= data.get('visitor_dni'),
            hasAccess = data.get('hasAccess'),
            isFaceRecognition =1,
            description='Login del visitante por registro reconociminto facial',
            createDate= createDate(),
            isAutomatic=1
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e

#Lista de todos los logs
def logsList(logs):
    log_list = []
    for log in logs:
        log_dict = {
            'id': log.id,
            'userId': log.userId,
            'exceptionId': log.exceptionId,
            'visitorId':log.visitorId,            
            'hasAccess':log.hasAccess,
            'isFaceRecognition' :log.isFaceRecognition,
            'abm': log.abm,
            'abmType' :log.abmType,
            'description': log.description,
            'aperturaCierre':log.aperturaCierre,
            'createDate':log.createDate,
            'isEnter':log.isEnter,
            'isAutomatic':log.isAutomatic
        }
        log_list.append(log_dict)
    return log_list 

#Devuelve todos los logs
def getLogAll():
    users = Logs.query.all()
    sorted_users = sorted(users, key=lambda x: datetime.strptime(x.fecha_y_hora, '%Y-%m-%d %H:%M'), reverse=True)
    return logsList(sorted_users)