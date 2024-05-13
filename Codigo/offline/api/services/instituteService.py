from db.db import db
from models.Institute import Institute
from models.Place import Place
from models.InstitutePlace import InstitutePlace
from utils.date import createDate

def saveInstitute(data):
    try:
        institute = Institute(name=data.get('name'),createDate=createDate())
        db.session.add(institute)
        db.session.commit()

        return True
    except Exception as e:
        return e

def updateInstitute(id,data):
    institute=Institute.query.get(id)

    if not institute:
        return 404
    
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
            'createDate':institute.createDate
        }

    else:
        return None

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

def getInstituteAll():

    institutes = Institute.query.all()
    institute_list = []

    for institute in institutes:
        institute_dict = {
            'id':institute.id,
            'name':institute.name,
            'createDate':institute.createDate
        }
        institute_list.append(institute_dict)
    return institute_list         