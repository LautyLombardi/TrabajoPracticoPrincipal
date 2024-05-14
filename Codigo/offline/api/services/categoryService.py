from db.db import db
from models.Category import Category
from models.Institute import Institute
from models.CategoryInstitute import CategoryInstitute
from utils.date import createDate

def saveCategory(data):
    try:
        category = Category(
            name=data.get('name'),
            description=data.get('description'),
            isExtern=int(data.get('isExtern')),
            isActive=1,
            createDate= createDate()
        )
        db.session.add(category)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updateCategory(id, data):
    category = Category.query.get(id)
    
    if not category:
        return 404
    if category.isActive == 0:
        return 400
    
    try:
        category.name = data.get('name')
        category.description = data.get('description')
        category.isExtern= data.get('isExtern')
        db.session.commit()

        return 200
    except Exception as e:
        return e        

def getCategoryById(id):
    category = Category.query.get(id)
    if category:
        return {
            'name': category.name,
            'description': category.description,
            'isExtern': category.isExtern,
            'isActive': category.isActive,
            'createDate': category.createDate
        }
    else:
        return None    

def getCategoryAll():
    categories = Category.query.all()
    return categoryList(categories)

def getCategoryAllActive():
    categories = Category.query.filter_by(isActive=1).all()
    return categoryList(categories) 

def getCategoryAllDesactive():
    categories = Category.query.filter_by(isActive=0).all()
    return categoryList(categories)

def setDesactive(id):
    category = Category.query.get(id)
    
    if not category:
        return 404
    if category.isActive == 0:
        return 400
    
    try:
        category.isActive = 0
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    category = Category.query.get(id)
    
    if not category:
        return 404
    if category.isActive == 1:
        return 400
    
    try:
        category.isActive = 1
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

# Falta el isActive de c/u
def saveInstituteCategory(institute_id, category_id):
    if not Category.query.get(category_id):
        return '404a'
    
    if not Institute.query.get(institute_id):
        return '404b'
    
    # Verifica si la relación ya exist    
    if CategoryInstitute.query.filter_by(institute_id=institute_id, category_id=category_id).first():
        return '409'
    
    try:
        instituteCategory = CategoryInstitute(institute_id=institute_id, category_id=category_id)
        db.session.add(instituteCategory)
        db.session.commit()

        return 201
    except Exception as e:
        return e
    
def categoryList(categories):
    category_list = []
    for category in categories:
        category_dict = {
            'name': category.name,
            'description': category.description,
            'isExtern': category.isExtern,
            'isActive': category.isActive,
            'createDate': category.createDate
        }
        category_list.append(category_dict)
    return category_list

