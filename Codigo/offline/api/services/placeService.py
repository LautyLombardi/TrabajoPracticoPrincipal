from db.db import db
from models.Place import Place
from utils.date import createDate

def savePlace(data):
    try:
        place = Place(name=data.get('name'), abbreviation=data.get('abbreviation'), description=data.get('description'), openTime=data.get('openTime'), closeTime=data.get('closeTime'), createDate=createDate())
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
        place.abbreviation = data.get('abbreviation')
        place.description = data.get('description')
        place.openTime=data.get('openTime') 
        place.closeTime=data.get('closeTime')
        db.session.commit()

        return 200
    except Exception as e:
        return e

def getPlaceById(id):
    place = Place.query.get(id)
    if place:
        return {
            'id': place.id,
            'name': place.name,
            'abbreviation': place.abbreviation,
            'description': place.description,
            'openTime': place.openTime,
            'closeTime': place.closeTime,
            'createDate': place.createDate
        }
    else:
        return None