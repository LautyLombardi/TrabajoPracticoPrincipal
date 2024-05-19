from db.db import db
from models.User import User
from utils.date import createDate

def saveUser(data):
    try:
        user = User(
            name=data.get('name'), 
            lastname=data.get('lastname'), 
            password=data.get('password'), 
            role_id=data.get('role_id'),
            dni=data.get('dni'),
            isActive=1,
            createDate=createDate()
        )
        db.session.add(user)
        db.session.commit()

        return True
    except Exception as e:
        return e

def updateUser(id,data):
    user = User.query.get(id)
    
    if not user:
        return 404
    if user.isActive == 0:
        return 400
    
    try:
        user.name = data.get('name')
        user.lastname = data.get('lastname')
        user.password = data.get('password')
        user.role_id = data.get('role_id')
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def getUserById(id):
    user = User.query.get(id)
    if user:
        return {
            'dni': user.dni,
            'name': user.name,
            'lastname': user.lastname,
            'role_id': user.role_id,
            'isActive': user.isActive,
            'motive': user.motive,
            'activeDate':user.activeDate,
            'createDate':user.createDate
        }
    else:
        return None

def getUserAll():
    users = User.query.all()
    return userList(users)

def getUserAllActive():
    users = User.query.filter_by(isActive=1).all()
    return userList(users) 

def getUserAllDesactive():
    users = User.query.filter_by(isActive=0).all()
    return userList(users)

def setDesactive(id,data):
    user = User.query.get(id)
    
    if not user:
        return 404
    if user.isActive == 0:
        return 400
    
    try:
        user.isActive = 0
        user.motive = data.get('motive')
        user.activeDate = data.get('activeDate')
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    user = User.query.get(id)
    
    if not user:
        return 404
    if user.isActive == 1:
        return 400
    
    try:
        user.isActive = 1
        user.motive = None
        user.activeDate = None
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def userList(users):
    user_list = []
    for user in users:
        user_dict = {
            'dni': user.dni,
            'name': user.name,
            'lastname': user.lastname,
            'password':user.password,            
            'rol':user.role_id,
            'isActive' :user.isActive,
            'motive': user.motive,
            'activeDate' :user.activeDate,
            'createDate': user.createDate
        }
        user_list.append(user_dict)
    return user_list   