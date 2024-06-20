from db.db import db
from models.Role import Role

def saveRole(data):
    try:
        role=Role(
            name = data.get('name'),
            description = data.get('description'),
            createDate= data.get('createDate'),
            routingConnection = data.get('routingConnection'),
            onlineLogin=data.get('onlineLogin'),  
            offlineLogin=data.get('offlineLogin'),  
            dayStartEnd=data.get('dayStartEnd'),  
            visitorAuthentication=data.get('visitorAuthentication'),  
            visitorAuthorization=data.get('visitorAuthorization'),  
            instituteConfiguration=data.get('instituteConfiguration'),  
            entityABMs=data.get('entityABMs'),  
            systemReports=data.get('systemReports'),  
            systemLog=data.get('systemLog'),  
            exceptionLoading=data.get('exceptionLoading')
        )
        db.session.add(role)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar el lugar: {str(e)}")
        return str(e)