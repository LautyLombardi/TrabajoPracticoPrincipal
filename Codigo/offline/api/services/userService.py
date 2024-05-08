from db.db import db
from models.User import User

def saveUser(data):
    try:
        user = User(name=data.get('name'), lastname=data.get('lastname'), password=data.get('password'), rol=data.get('rol'),DNI=data.get('DNI'))
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
        user.rol = data.get('rol')
        user.DNI = data.get('DNI')
        db.session.commit()

        return 200
    except Exception as e:
        return e