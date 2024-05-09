from db.db import db
from models.Visitor import Visitor
from utils.date import createDate

def saveVisitor(data):
    try:
        visitor = Visitor(dni=data.get('dni'), enterprice_id=data.get('enterprice_id'), name=data.get('name'), lastname=data.get('lastname'), email=data.get('email'), startDate=data.get('startDate'), finishDate=data.get('finishDate'), createDate=createDate())
        db.session.add(visitor)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updateVisitor(id, data):
    visitor = visitor.query.get(id)
    
    if not visitor:
        return 404
    
    try:
        visitor.dni = data.get('dni')
        visitor.enterprice_id = data.get('enterprice_id')
        visitor.name = data.get('name')
        visitor.lastname=data.get('lastname') 
        visitor.email=data.get('email')
        visitor.startDate=data.get('startDate')
        visitor.finishDate=data.get('finishDate')
        db.session.commit()

        return 200
    except Exception as e:
        return e

def getVisitorById(id):
    visitor = Visitor.query.get(id)
    if visitor:
        return {
            'dni': visitor.dni,
            'enterprice_id': visitor.enterprice_id,
            'name': visitor.name,
            'lastname': visitor.lastnae,
            'email': visitor.email,
            'startDate': visitor.startDate,
            'finishDate': visitor.finishDate
        }
    else:
        return None
