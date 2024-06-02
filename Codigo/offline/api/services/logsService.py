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

def registrarAperturaManual(adm_dni):
    nuevo_log = Logs(
        admDni=adm_dni,
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

def registrarCierreManual(adm_dni):
    # Crear un nuevo registro de log para el cierre del día
    nuevo_log = Logs(
        admDni=adm_dni,
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


def recordImageUser(user_dni,abm_dni):
    try:
        nuevo_log = Logs(
            userId=user_dni,
            admDni = abm_dni,
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

def recordImageVisitor(visitor_dni,abm_dni):
    try:
        nuevo_log = Logs(
            visitorId=visitor_dni,
            admDni= abm_dni,
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

    
#Login del visitante por reconocimiento facial y guardado del log
def recordVisitorLoginAutomatic(data):
    try:
        nuevo_log = Logs(
            visitorId= data.get('visitor_dni'),
            hasAccess = data.get('hasAccess'),
            isFaceRecognition =1,
            description='Login del visitante por registro reconocimiento facial',
            createDate= createDate(),
            isAutomatic=1
        )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e

def recordUserLoginAutomatic(data):
    try:
        nuevo_log = Logs(
            userId= data.get('user_dni'),
            hasAccess = data.get('hasAccess'),
            isFaceRecognition =1,
            description='Login del usuario por registro reconocimiento facial',
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
            'admDni':log.admDni,
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
    logs = Logs.query.all()
    sorted_logs = sorted(logs, key=lambda x: datetime.strptime(x.createDate, '%Y-%m-%d %H:%M'), reverse=True)
    return logsList(sorted_logs)




def recordADM(adm_dni, type_adm, table_adm):
    try:
        if type_adm.lower() == 'desactivacion':
            nuevo_log = Logs(
                admDni= adm_dni,
                abm= type_adm + ' de ' + table_adm ,
                abmType=type_adm ,
                description='Se desactiva ' + table_adm,
                createDate= createDate(),
                isAutomatic=0
            )
        else:
            nuevo_log = Logs(
                admDni= adm_dni,
                abm= type_adm + ' de ' + table_adm ,
                abmType=type_adm ,
                description='Se da de ' + type_adm + ' a ' +table_adm,
                createDate= createDate(),
                isAutomatic=0
            )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e 

def recordAbmUsuario(adm_dni,type_adm,dni):         
    try:
        if type_adm.lower() == 'desactivacion':
                nuevo_log = Logs(
                admDni= adm_dni,
                userId= dni,
                abm= type_adm + ' de usuario' ,
                abmType=type_adm ,
                description='se desactiva a un usuario',
                createDate= createDate(),
                isAutomatic=0
            )
        else:    
            nuevo_log = Logs(
                admDni= adm_dni,
                userId= dni,
                abm= type_adm + ' de usuario',
                abmType=type_adm ,
                description='Se da de ' + type_adm + ' a un usuario',
                createDate= createDate(),
                isAutomatic=0
            )

        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e 

def recordAbmVisitante(adm_dni,type_adm,dni):         
    try:
        if type_adm.lower() == 'desactivacion':
                nuevo_log = Logs(
                admDni= adm_dni,
                visitorId= dni,
                abm= type_adm + ' de visitante' ,
                abmType=type_adm ,
                description='se desactiva a un visitante',
                createDate= createDate(),
                isAutomatic=0
            )
        else:    
            nuevo_log = Logs(
                admDni= adm_dni,
                visitorId= dni,
                abm= type_adm + ' de visitante',
                abmType=type_adm ,
                description='Se da de ' + type_adm + ' a un visitante',
                createDate= createDate(),
                isAutomatic=0
            )

        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e      



def recordLoginManual(dniClient,table_login):
    try:
        if table_login.lower() == 'visitante':
            nuevo_log = Logs(
                visitorId=dniClient,
                description='Se logueo manualmente un ' + table_login,
                createDate= createDate(),
                isAutomatic=0,
                isEnter=1
            )
        else:
            nuevo_log = Logs(
                userId=dniClient,
                description='Se logueo manualmente un ' + table_login,
                createDate= createDate(),
                isAutomatic=0,
                isEnter=1
            )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e 

    
def recordLoginManualFail(dniClient,table_login):
    try:
        if table_login.lower() == 'visitante':
            nuevo_log = Logs(
                visitorId=dniClient,
                description='Fallo al ingresar manualmente a un  ' + table_login,
                createDate= createDate(),
                isAutomatic=1,
                isEnter=0
            )
        else:
            nuevo_log = Logs(
                userId=dniClient,
                description='Fallo al ingresar manualmente a un  ' + table_login,
                createDate= createDate(),
                isAutomatic=1,
                isEnter=0
            )
        db.session.add(nuevo_log)
        db.session.commit()
        return True
    except Exception as e:
        return e