from db.db import db
from models.Institute import Institute

def saveInstitute(data):
    try:
        institute=Institute(
            name=data.get('name'),
            isActive=data.get('isActive'),
            createDate=data.get('createDate')
        )
        db.session.add(institute)
        db.session.commit()
        return True
    
    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar el instituto: {str(e)}")
        return str(e)