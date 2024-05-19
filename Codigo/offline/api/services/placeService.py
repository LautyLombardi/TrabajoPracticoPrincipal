from db.db import db
from models.Place import Place
from models.Institute import Institute
from models.InstitutePlace import InstitutePlace
from utils.date import createDate

def savePlace(data):
    try:
        place = Place(
            name=data.get('name'), 
            abbreviation=data.get('abbreviation'), 
            description=data.get('description'), 
            openTime=data.get('openTime'), 
            closeTime=data.get('closeTime'), 
            isActive=1,
            createDate=createDate())
        db.session.add(place)
        db.session.commit()
        
        return True
    except Exception as e:
        return e

def updatePlace(id, data):
    place = Place.query.get(id)
        
    if not place:
        return 404
    if place.isActive == 0:
        return 400
    
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
            'isActive': place.isActive,
            'createDate': place.createDate
        }
    else:
        return None

def getPlaceAll():
    places = Place.query.all()
    return placeList(places)     

def getPlaceAllActive():
    places = Place.query.filter_by(isActive=1).all()
    return placeList(places)

def getPlaceAllDesactive():
    places = Place.query.filter_by(isActive=0).all()
    return placeList(places)   

def setDesactive(id):
    places = Place.query.get(id)
    
    if not places:
        return 404
    if places.isActive == 0:
        return 400
    
    try:
        places.isActive = 0
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    places = Place.query.get(id)
    
    if not places:
        return 404
    if places.isActive == 1:
        return 400
    
    try:
        places.isActive = 1
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def getInstituteByPlaceId(id):
    try:
        institutesPlaces = InstitutePlace.query.filter_by(place_id=id).all()
        institute_list = []
        
        for institutePlace in institutesPlaces:
            
            institute_id = institutePlace.institute_id
            institute = Institute.query.get(institute_id)
            
            if institute:
                institute_dict = {
                    'id':institute.id,
                    'name':institute.name,
                    'isActive': institute.isActive,
                    'createDate':institute.createDate
                }
                institute_list.append(institute_dict)
        
        return institute_list
    except Exception as e:
        print(e)
        return None
    
    
def placeList(places):
    place_list = []
    for place in places:
        place_dict = {
            'id': place.id,
            'name': place.name,
            'abbreviation': place.abbreviation,
            'description': place.description,
            'openTime': place.openTime,
            'closeTime': place.closeTime,
            'isActive': place.isActive,
            'createDate': place.createDate
        }
        place_list.append(place_dict)
    return place_list    