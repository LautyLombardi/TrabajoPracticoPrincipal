from db.db import db
from models.Visitor import Visitor
from utils.date import createDate

def saveVisitor(data):
    try:
        visitor = Visitor(
            dni=data.get('dni'), 
            enterprice_id=data.get('enterprice_id'), 
            name=data.get('name'), 
            lastname=data.get('lastname'), email=data.get('email'), 
            startDate=data.get('startDate'), 
            finishDate=data.get('finishDate'),
            isActive=1,
            createDate=createDate()
        )
        db.session.add(visitor)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updateVisitor(id, data):
    visitor = Visitor.query.get(id) 
       
    if not visitor:
        return 404
    if visitor.isActive == 0:
        return 400
    
    try:
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
            'lastname': visitor.lastname,
            'email': visitor.email,
            'startDate': visitor.startDate,
            'finishDate': visitor.finishDate,
            'isActive': visitor.isActive,
            'createDate': visitor.createDate
        }
    else:
        return None

def getVisitorAll():
    visitors = Visitor.query.all()
    return visitorList(visitors)
   
def getVisitorAllActive():
    visitors = Visitor.query.filter_by(isActive=1).all()
    return visitorList(visitors)

def getVisitorAllDesactive():
    visitors = Visitor.query.filter_by(isActive=0).all()
    return visitorList(visitors)     

def setDesactive(id):
    visitor = Visitor.query.get(id)
    
    if not visitor:
        return 404
    if visitor.isActive == 0:
        return 400
    
    try:
        visitor.isActive = 0
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    visitor = Visitor.query.get(id)
    
    if not visitor:
        return 404
    if visitor.isActive == 1:
        return 400
    
    try:
        visitor.isActive = 1
        db.session.commit()
        
        return 200
    except Exception as e:
        return e
    
def visitorList(visitors):
    visitor_list = []
    for visitor in visitors:
        visitor_dict = {
            'dni': visitor.dni,
            'enterprice_id': visitor.enterprice_id,
            'name': visitor.name,
            'lastname': visitor.lastname,
            'email': visitor.email,
            'startDate': visitor.startDate,
            'finishDate': visitor.finishDate,
            'isActive': visitor.isActive,
            'createDate': visitor.createDate
        }
        visitor_list.append(visitor_dict)
    return visitor_list  