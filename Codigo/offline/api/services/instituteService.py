from db.db import db
from models.Institute import Institute
from utils.date import createDate

def saveInstitute(data):
    try:
        institute = Institute(name=data.get('name'),place_id=data.get('place_id'),createDate=createDate())
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
        institute.place_id=data.get('place_id')
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
            'place_id':institute.place_id,
            'createDate':institute.createDate
        }

    else:
        return None