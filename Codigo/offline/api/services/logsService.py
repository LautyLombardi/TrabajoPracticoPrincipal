from db.db import db
from models.Logs import Logs
from utils.date import createDate

def registrarApertura():
    # Crear un nuevo registro de log para la apertura del día
    nuevo_log = Logs(
        aperturaCierre='Apertura',  # Indica que es una apertura
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

    # Guardar el nuevo registro en la base de datos
    try:
        db.session.add(nuevo_log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return 400

#Usuario registrado
def recordUserRegistration(data):
    try:
        nuevo_log = Logs(
            userId=data.get('dni'),
            abm='ABM USUARIO',
            abmType ='ALTA',
            description='Alta de usuaruio por registro facial',
            createDate= createDate(),
            isAutomatic=0
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e

#Armado de lista de los logs de usuarios registrados
def getlogsListRegistrationUsuario(logs):
    log_list = []
    for log in logs:
        if log.get('visitorId') == None:
            log_dict = {
                'id': log.id,
                'userId': log.name,
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

#Devuelvo la lista de logs
def getLogRegistrationUsuario():
    users = Logs.query.all()
    responce=getlogsListRegistrationUsuario(users)
    return responce

def recordUserFaceRecognitionLogin(data):
    try:
        nuevo_log = Logs(
            userId=data.get('dni'),
            hasAccess = data.get('hasAccess'),
            isFaceRecognition =1,
            description='Ingreso de usuaruio por registro facial',
            createDate= createDate(),
            isAutomatic=1
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e








    
def recordVisitorRegistration(data):
    try:
        nuevo_log = Logs(
            userId=data.get('userDni'),
            visitorId= data.get('dni'),
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



def getlogsListRegistrationVisitante(logs):
    log_list = []
    for log in logs:
        if log.get('visitorId') is not None:
            log_dict = {
                'id': log.id,
                'userId': log.name,
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

    
def logsList(logs):
    log_list = []
    for log in logs:
        log_dict = {
            'id': log.id,
            'userId': log.name,
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

def getLogAll():
    users = Logs.query.all()
    return logsList(users)