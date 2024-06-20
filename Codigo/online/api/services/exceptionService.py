from db.db import db
from models.Exception import Exception

def saveException(data):
    try:
        exception=Exception(
            name=data.get('name'),
            description=data.get('description'),
            duration=data.get('duration'),
            createDate=data.get('createDate')
        )
        db.session.add(exception)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar el servicio: {str(e)}")
        return str(e)