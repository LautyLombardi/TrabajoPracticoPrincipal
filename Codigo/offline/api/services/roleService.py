from db.db import db
from models.Role import Role
from utils.date import createDate

def saveRole(data):
    try:
        role = Role(
            name=data.get('name'),
            description=data.get('description'),
            isActive=1,
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
            'isActive': role.isActive,
            'createDate':role.createDate
        }

    else:
        return None
   
   
def exist_rol(id):   
    role = Role.query.filter_by(id=id).first()

    if role:
        return True
    else:
        return False


def getRoleAll():
    roles = Role.query.all()
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

def setDesactive(id):
    role = Role.query.get(id)
    if not role:
        return 404

    try:
        if role.isActive==0:
            role.isActive=1
        else:
            role.isActive=0
        db.session.commit()

        return 200
    except Exception as e:
        return e