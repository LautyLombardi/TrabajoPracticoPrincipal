from db.db import db
from models.Exception import Exception
from models.PlaceException import PlaceException
from models.CategoryException import CategoryException
from models.User import User
from models.Place import Place
from models.Category import Category
from models.Logs import Logs
from utils.date import createDate


def saveException(data):
    try: 
        place = Place.query.filter_by(id=data.get('place_id')).first()
        if not place:
            return '404a'

        category = Category.query.filter_by(id=data.get('category_id')).first()
        if not category:
            return '404b'

        existing_exception = Exception.query.filter_by(
            name=data.get('name'),
            description=data.get('description'),
            duration=data.get('duration')
        ).first()

        if existing_exception:
            return '409'    
        
        new_exception = Exception(
            name = data.get('name'),
            description = data.get('description'),
            duration = data.get('duration'),
            createDate=createDate() 
        )
        db.session.add(new_exception)
        db.session.flush()

        id_exception =new_exception.id

        new_exception_place = PlaceException( 
            place_id = data.get('place_id'),
            exception_id=id_exception
        )
        db.session.add(new_exception_place)
    
        new_exception_category = CategoryException( 
            category_id = data.get('category_id'),
            exception_id=id_exception
        )
        db.session.add(new_exception_category)

        nuevo_log = Logs(
            admDni= int(data.get('adm_dni')),
            exceptionId=id_exception,
            hasAccess = 1,
            abm = 'ALTA',
            abmType = 'ALTA de excepcion',
            description='Se dio alta a una excepcion',
            createDate= createDate(),
            isAutomatic=1
        )
        db.session.add(nuevo_log)

        db.session.commit()

        return 201
    except Exception as e:
        return {"error": str(e), "message": "Error al guardar la excepción"}

def getAllExceptions():
    try:
        exceptions = Exception.query.all()
        result = []

        for exception in exceptions:
            place_name = db.session.query(Place.name).join(PlaceException).filter(PlaceException.exception_id == exception.id).first()
            place_name = place_name[0] if place_name else None

            category_name = db.session.query(Category.name).join(CategoryException).filter(CategoryException.exception_id == exception.id).first()
            category_name = category_name[0] if category_name else None

            result.append({
                'id': exception.id,
                'name': exception.name,
                'description': exception.description,
                'duration': exception.duration,
                'createDate': exception.createDate,
                'place_name': place_name,
                'category_name': category_name
            })

        return result
    except Exception as e:
        print(e)
        return None
