from db.db import db
from models.Place import Place

def savePlace(data):
    try:
        place=Place(
            name=data.get('name'),
            abbreviation=data.get('abbreviation'),
            description=data.get('description'),
            openTime=data.get('openTime'),
            closeTime=data.get('closeTime'),
            isActive=data.get('isActive'),
            createDate=data.get('createDate')
        )
        db.session.add(place)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar el lugar: {str(e)}")
        return str(e)