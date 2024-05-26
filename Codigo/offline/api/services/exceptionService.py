from db.db import db
from models.Exception import Exception
from models.PlaceException import PlaceException
from models.CategoryException import CategoryException
from models.User import User
from models.Place import Place
from models.Category import Category
from utils.date import createDate



def saveException(data):
    try:
        
        user = User.query.filter_by(dni=data.get('user_dni')).first()
        if not user:
            return '404c'

        place = Place.query.filter_by(id=data.get('place_id')).first()
        if not place:
            return '404a'


        category = Category.query.filter_by(id=data.get('category_id')).first()
        if not category:
            return '404b'

        existing_exception = Exception.query.filter_by(
            user_id=user.dni,
            name=data.get('name'),
            description=data.get('description'),
            duration=data.get('duration')
        ).first()

        if existing_exception:
            return '409'    
        
        new_exception = Exception(
            user_id=data.get('user_dni'),
            name = data.get('name'),
            description = data.get('description'),
            duration = data.get('duration'),
            createDate=createDate() 
        )
        db.session.add(new_exception)
        db.session.flush()

        new_exception_place = PlaceException( 
            place_id = data.get('place_id'),
            exception_id=new_exception.id
        )
        db.session.add(new_exception_place)
    
        new_exception_category = CategoryException( 
            category_id = data.get('category_id'),
            exception_id=new_exception.id
        )
        db.session.add(new_exception_category)
 
        db.session.commit()
        
        return 201
    except Exception as e:
        return e

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
                'user_id': exception.user_id,
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
