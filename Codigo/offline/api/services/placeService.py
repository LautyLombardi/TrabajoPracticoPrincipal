from db.db import db
from models.Place import Place

def savePlace(data):
    try:
        place = Place(name=data.get('name'), abreviation=data.get('abreviation'), description=data.get('description'), time=data.get('time'))
        db.session.add(place)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updatePlace(id, data):
    place = Place.query.get(id)
    
    if not place:
        return 404
    
    try:
        place.name = data.get('name')
        place.abreviation = data.get('abreviation')
        place.description = data.get('description')
        place.time = data.get('time')
        db.session.commit()

        return 200
    except Exception as e:
        return e