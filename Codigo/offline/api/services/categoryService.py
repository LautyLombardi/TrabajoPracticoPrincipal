from db.db import db
from models.Category import Category
from utils.date import createDate



def saveCategory(data):
    try:
        category = Category(name=data.get('name'),description=data.get('description'),isExtern=int (data.get('isExtern')), createDate= createDate())
        db.session.add(category)
        db.session.commit()

        
        return True
    except Exception as e:
        return e

def updateCategory(id, data):
    category = Category.query.get(id)
    if not category:
        return 404
    
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
        }
    else:
        return None    

def getCategoryAll():

    categories = Category.query.all()
    category_list = []

    for category in categories:
        category_dict = {
            'name': category.name,
            'description': category.description,
            'isExtern': category.isExtern,
        }
        category_list.append(category_dict)
    return category_list         