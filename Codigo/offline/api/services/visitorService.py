from db.db import db
from models.Visitor import Visitor
from utils.date import createDate
from models.CategoryVisitor import CategoryVisitor
from models.CategoryInstitute import CategoryInstitute
from models.Institute import Institute
from services.categoryService import getCategoryById

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
            'createDate': visitor.createDate,
            'category': getCategoryForVisitor(visitor.dni)["name"],
            'institutes':getInstituteByNames(visitor.dni)
        }
        visitor_list.append(visitor_dict)
    return visitor_list 

def getInstituteByNames (id):
    institutos = getInstituteByVisitorId(id)
    institutosNames=""
    for insti in institutos:
        institutosNames=institutosNames+" "+insti["name"]
    return institutosNames

def getInstituteByVisitorId(id):
    try:
        category_visitors = CategoryVisitor.query.filter_by(visitor_id=id).all()
        institute_id_list = []
        institute_list = []

        for category_visitor in category_visitors:
            category_institutes = CategoryInstitute.query.filter_by(category_id=category_visitor.category_id).all()
            for category_institute in category_institutes:
                institute_id_list.append(category_institute.institute_id)

        # Eliminar duplicados usando un conjunto
        unique_institute_ids = list(set(institute_id_list))


        for institute_id in unique_institute_ids:
            
            institute = Institute.query.get(institute_id)

            if institute:
                institute_dict = {
                    'id': institute.id,
                    'name': institute.name
                }
                institute_list.append(institute_dict)
                
        return institute_list
    except Exception as e:
        print(e)
        return None

def getCategoryForVisitor(id):
    try:
        category_visitors = CategoryVisitor.query.filter_by(visitor_id=id).all()
        categorias=[]
        for category in category_visitors:
            categorias.append(getCategoryById(category.category_id))
        return {"name":categorias[0].get("name")}

    except Exception as e:
        print(e)
        return None     
    return visitor_list  