from db.db import db
from models.Category import Category


def saveCategory(data):
    try:
        category = Category(name=data.get('name'),description=data.get('description'))
        db.session.add(category)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updateCategory(id, data):
    place = Category.query.get(id)
    
    if not place:
        return 404
    
    try:
        Category.name = data.get('name')
        Category.description = data.get('description')
        db.session.commit()

        return 200
    except Exception as e:
        return e        