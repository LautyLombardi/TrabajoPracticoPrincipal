from db.db import db
from models.Enterprice import Enterprice
from utils.date import createDate

def saveEnterprice(data):
    try:
        enterprice = Enterprice(
            name=data.get('name'),
            cuit=data.get('cuit'),
            isActive="1",
            createDate= createDate()
        )
        db.session.add(enterprice)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updateEnterprice(id, data):
    enterprice = Enterprice.query.get(id)
    
    if not enterprice:
        return 404
    if enterprice.isActive == 0:
        return 400
    
    try:
        enterprice.name = data.get('name')
        enterprice.cuit = data.get('cuit')
        enterprice.isActive= data.get('isActive')
        db.session.commit()

        return 200
    except Exception as e:
        return e        

def getEnterpriceById(id):
    enterprice = Enterprice.query.get(id)
    if enterprice:
        return {
            'id':enterprice.id,
            'name': enterprice.name,
            'cuit': enterprice.cuit,
            'isActive': enterprice.isActive,
            'createDate': enterprice.createDate
        }
    else:
        return None    

def getEnterpriceAll():
    enterprices = Enterprice.query.all()
    return enterpriceList(enterprices)

def getEnterpriceAllActive():
    enterprices = Enterprice.query.filter_by(isActive=1).all()
    return enterpriceList(enterprices) 

def getEnterpriceAllDesactive():
    enterprices = Enterprice.query.filter_by(isActive=0).all()
    return enterpriceList(enterprices)

def setDesactive(id):
    enterprice = Enterprice.query.get(id)
    
    if not enterprice:
        return 404
    if enterprice.isActive == 0:
        return 400
    
    try:
        enterprice.isActive = 0
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    enterprice = Enterprice.query.get(id)
    
    if not enterprice:
        return 404
    if enterprice.isActive == 1:
        return 400
    
    try:
        enterprice.isActive = 1
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def enterpriceList(enterprices):
    enterprice_list = []
    for enterprice in enterprices:
        enterprice_dict = {
            'id':enterprice.id,
            'name': enterprice.name,
            'cuit': enterprice.cuit,
            'isActive': enterprice.isActive,
            'createDate': enterprice.createDate
        }
        enterprice_list.append(enterprice_dict)
    return enterprice_list