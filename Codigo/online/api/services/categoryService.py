from db.db import db
from models.Category import Category

def saveCategory(data):
    try:
        category = Category(
            name=data.get('name'),
            description=data.get('description'),
            isExtern=data.get('isExtern'),
            isActive=data.get('isActive'),
            createDate=data.get('createDate')
        )
        db.session.add(category)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar la categoría: {str(e)}")
        return str(e)
