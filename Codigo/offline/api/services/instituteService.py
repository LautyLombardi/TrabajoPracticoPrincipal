from db.db import db
from models.Institute import Institute
from models.Place import Place
from models.InstitutePlace import InstitutePlace
from utils.date import createDate

def saveInstitute(data):
    try:
        institute = Institute(
            name=data.get('name'),
            isActive=1,
            createDate= createDate()
        )
        db.session.add(institute)
        db.session.commit()

        return {
            'id':institute.id,
            'name':institute.name,
            'isActive': institute.isActive,
            'createDate':institute.createDate
        }
    except Exception as e:
        return e

def updateInstitute(id,data):
    institute=Institute.query.get(id)
    
    if not institute:
        return 404
    if institute.isActive == 0:
        return 400
    
    try:
        institute.name=data.get('name')
        db.session.commit()
        return 200

    except Exception as e:
        return e

def getInstituteById(id):
    institute=Institute.query.get(id)

    if institute:
        return{
            'id':institute.id,
            'name':institute.name,
            'isActive': institute.isActive,
            'createDate':institute.createDate
        }
    else:
        return None

# Falta el isActive de c/u
def saveInstitutePlace(institute_id, place_id):
        
    if not Place.query.get(place_id):
        return '404a'
    
    if not Institute.query.get(institute_id):
        return '404b'
    
    # Verifica si la relación ya exist    
    if InstitutePlace.query.filter_by(institute_id=institute_id, place_id=place_id).first():
        return '409'
    
    try:
        institutePlace = InstitutePlace(institute_id=institute_id, place_id=place_id)
        db.session.add(institutePlace)
        db.session.commit()

        return 201
    except Exception as e:
        return e

def getPlaceByInstituteId(id):
    try:
        institutesPlaces = InstitutePlace.query.filter_by(institute_id=id).all()
        place_list = []
        
        for institutePlace in institutesPlaces:
            
            place_id = institutePlace.place_id
            place = Place.query.get(place_id)
            
            if place:
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
    except Exception as e:
        print(e)
        return None
    
def getInstituteAll():
    institutes = Institute.query.all()
    return instituteList(institutes)

def getInstituteAllActive():
    institutes = Institute.query.filter_by(isActive=1).all()
    return instituteList(institutes)

def getInstituteAllDesactive():
    institutes = Institute.query.filter_by(isActive=0).all()
    return instituteList(institutes)        

def setDesactive(id):
    institute = Institute.query.get(id)
    
    if not institute:
        return 404
    if institute.isActive == 0:
        return 400
    
    try:
        institute.isActive = 0
        db.session.commit()
        
        return 200
    except Exception as e:
        return e

def setActive(id):
    institute = Institute.query.get(id)
    
    if not institute:
        return 404
    if institute.isActive == 1:
        return 400
    
    try:
        institute.isActive = 1
        db.session.commit()
        
        return 200
    except Exception as e:
        return e
        
def instituteList(institutes):
    institute_list = []
    for institute in institutes:
        institute_dict = {
            'id':institute.id,
            'name':institute.name,
            'isActive': institute.isActive,
            'createDate':institute.createDate
        }
        institute_list.append(institute_dict)
    return institute_list    