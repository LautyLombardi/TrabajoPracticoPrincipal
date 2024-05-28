from db.db import db
from models.Role import Role
from utils.date import createDate

def saveRole(data):
    try:
        role = Role(
            name=data.get('name'),
            description=data.get('description'),
            createDate=createDate()
        )
        db.session.add(role)
        db.session.commit()

        return True
    except Exception as e:
        return e

def updateRole(id,data):
    role=Role.query.get(id)
    
    if not role:
        return 404
    if role.isActive == 0:
        return 400
    
    try:
        role.name=data.get('name')
        role.description=data.get('description')
        db.session.commit()
        return 200

    except Exception as e:
        return e

def getRole(id):
    role=Role.query.get(id)
    if role:
        return{
            'id':role.id,
            'name':role.name,
            'description':role.description,
            'createDate':role.createDate
        }
    else:
        return None

def getRoleAll():
    roles = Role.query.all()
    return roleList(roles)   

def getRoleAllActive():
    roles = Role.query.filter_by(isActive=1).all()
    return roleList(roles)

def getRoleAllDesactive():
    roles = Role.query.filter_by(isActive=0).all()
    return roleList(roles)        

def setDesactive(id):
    role = Role.query.get(id)
    
    if not role:
        return 404
    if role.isActive == 0:
        return 400
    
    try:
        role.isActive = 0
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    role = Role.query.get(id)
    
    if not role:
        return 404
    if role.isActive == 1:
        return 400
    
    try:
        role.isActive = 1
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def roleList(roles):
    role_list = []
    for role in roles:
        role_dict = {
            'id':role.id,
            'name':role.name,
            'description':role.description,
            'isActive': role.isActive,
            'createDate':role.createDate
        }
        role_list.append(role_dict)
    return role_list 

def exist_rol(id):   
    role = Role.query.filter_by(id=id).first()

    if role:
        return True
    else:
        return False
