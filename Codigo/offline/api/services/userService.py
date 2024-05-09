from db.db import db
from models.User import User
from utils.date import createDate

def saveUser(data):
    try:
        user = User(name=data.get('name'), lastname=data.get('lastname'), password=data.get('password'), role_id=data.get('role_id'),dni=data.get('dni'),isActive=data.get('isActive'),motive=data.get('motive'),activeDate=data.get('activeDate'),createDate=createDate())
        db.session.add(user)
        db.session.commit()

        return True
    except Exception as e:
        return e

def updateUser(id,data):
    user = User.query.get(id)
    
    if not user:
        return 404
    
    try:
        user.name = data.get('name')
        user.lastname = data.get('lastname')
        user.password = data.get('password')
        user.rol = data.get('rol_id')
        
        user.isActive = data.get('isActive')
        user.motive = data.get('motive')
        user.activeDate = data.get('activeDate')
        
        db.session.commit()
        return 200
    except Exception as e:
        return e

def getUser(id):
    pass