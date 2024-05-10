from db.db import db
from models.Role import Role
from utils.date import createDate

def saveRole(data):
    try:
        role = Role(name=data.get('name'),description=data.get('description'),createDate=createDate())
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
      