from db.db import db
from models import User, Visitor, Place, Category, Enterprice, Institute, Logs, User_history, Visitor_history, CategoryVisitor, InstitutePlace, CategoryPlace, CategoryInstitute, CategoryException, PlaceException, Exceptions

def syncLogs(log):
    try:
        existing_log =  db.session.query(Logs).filter_by(
            admDni=log.get('admDni'),
            userId=log.get('userId'),
            exceptionId=log.get('exceptionId'),
            visitorId=log.get('visitorId'),
            hasAccess=log.get('hasAccess'),
            isFaceRecognition=log.get('isFaceRecognition'),
            abm=log.get('abm'),
            abmType=log.get('abmType'),
            description=log.get('description'),
            aperturaCierre=log.get('aperturaCierre'),
            createDate=log.get('createDate'),
            isEnter=log.get('isEnter'),
            isAutomatic=log.get('isAutomatic'),
            isError=log.get('isError')
        ).first()

        if existing_log:
            db.session.delete(existing_log)
            db.session.commit()

        logSync = Logs(
            admDni=log.get('admDni'),
            userId=log.get('userId'),
            exceptionId=log.get('exceptionId'),
            visitorId=log.get('visitorId'),
            hasAccess=log.get('hasAccess'),
            isFaceRecognition=log.get('isFaceRecognition'),
            abm=log.get('abm'),
            abmType=log.get('abmType'),
            description=log.get('description'),
            aperturaCierre=log.get('aperturaCierre'),
            createDate=log.get('createDate'),
            isEnter=log.get('isEnter'),
            isAutomatic=log.get('isAutomatic'),
            isError=log.get('isError')
        )
        db.session.add(logSync)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)

def syncUser(user):
    try:
        existing_user = db.session.query(User).filter_by(dni=user.get('dni')).first()
        if existing_user:
            db.session.delete(existing_user)
            db.session.commit()

        userSync = User(
            dni = user.get('dni'),
            role_id = user.get('role_id'),
            name = user.get('name'),
            lastname = user.get('lastname'),
            password = user.get('password'),
            isActive = user.get('isActive'),
            activeDate = user.get('activeDate'),
            createDate = user.get('createDate')
        )
        db.session.add(userSync)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)

def syncVisitors(visitor):
    try:
        existing_visitor = db.session.query(Visitor).filter_by(dni=visitor.get('dni')).first()
        if existing_visitor:
            db.session.delete(existing_visitor)
            db.session.commit()

        category_name = visitor.get('category')
        category = db.session.query(Category).filter_by(name=category_name).first()
        if not category:
            return f"Category {category_name} does not exist."

        if category.isExtern == 1:
            enterprice_ciut = visitor.get('enterprice_cuit')
            enterprice = db.session.query(Enterprice).filter_by(cuit=enterprice_ciut).first()
            if not enterprice :
                return f"Enterprice {enterprice_ciut} does not exist."

            visitorSync = Visitor(
                dni=visitor.get('dni'),
                enterprice_id=visitor.get('enterprice_id'),
                name=visitor.get('name'),
                lastname=visitor.get('lastname'),
                email=visitor.get('email'),
                startDate=visitor.get('startDate'),
                finishDate=visitor.get('finishDate'),
                isActive=visitor.get('isActive'),
                createDate=visitor.get('createDate'),
            )
        else:
            visitorSync = Visitor(
                dni=visitor.get('dni'),
                name=visitor.get('name'),
                lastname=visitor.get('lastname'),
                email=visitor.get('email'),
                startDate=visitor.get('startDate'),
                finishDate=visitor.get('finishDate'),
                isActive=visitor.get('isActive'),
                createDate=visitor.get('createDate'),
            )

        db.session.add(visitorSync)
        db.session.commit()

        category_visitor = CategoryVisitor(
            category_id=category.id,
            visitor_id=visitorSync.dni
        )
        db.session.add(category_visitor)
        db.session.commit()

        return True
    except Exception as e:
        db.session.rollback()
        return str(e)
    
# TODO quedé aca: nota para fran del futuro, que pasa si cambian algun dato
def syncPlaces(place):
    try:
        existing_place = db.session.query(Place).filter_by(
            createDate=place.get('createDate')
        ).first()
        if existing_place:
            db.session.delete(existing_place)
            db.session.commit()

        placeSync = Place(
            name=place.get('name'),
            abbreviation=place.get('abbreviation'),
            description=place.get('description'),
            openTime=place.get('openTime'),
            closeTime=place.get('closeTime'),
            isActive=place.get('isActive'),
            createDate=place.get('createDate')
        )
        db.session.add(placeSync)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)
def syncCategories(category):
    try:
        existing_category = db.session.query(Category).filter_by(
            isExtern=category.get('isExtern'),
            createDate=category.get('createDate')
        ).first()        
        if existing_category:
            db.session.delete(existing_category)
            db.session.commit()

        categorySync = Category(
            name=category.get('name'),
            description=category.get('description'),
            isExtern=category.get('isExtern'),
            isActive=category.get('isActive'),
            createDate=category.get('createDate')
        )
        db.session.add(categorySync)
        db.session.commit()

        places = category.get('places')
        for plc in places:
            place = db.session.query(Place).filter_by(name=plc).first()
            if place:
                existing_place_relation = db.session.query(CategoryPlace).filter_by(
                    category_id=categorySync.id,
                    place_id=place.id
                ).first()
                
                if not existing_place_relation:
                    place_category = CategoryPlace(
                        category_id=categorySync.id,
                        place_id=place.id
                    )
                    db.session.add(place_category)

        institutes = category.get('institutes')
        for inst in institutes:
            institute = db.session.query(Institute).filter_by(name=inst).first()
            if institute:
                existing_institute_relation = db.session.query(CategoryInstitute).filter_by(
                    category_id=categorySync.id,
                    institute_id=institute.id
                ).first()
                
                if not existing_institute_relation:
                    category_institute = CategoryInstitute(
                        category_id=categorySync.id,
                        institute_id=institute.id
                    )
                    db.session.add(category_institute)

        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)

def syncExceptions(exception):
    try:
        existing_exception = db.session.query(Exceptions).filter_by(
            name=exception.get('name'),
            description=exception.get('description'),
            duration=exception.get('duration'),
            createDate=exception.get('createDate')
        ).first()
        
        if existing_exception:
            db.session.delete(existing_exception)
            db.session.commit()

        exceptionSync = Exceptions(
            name=exception.get('name'),
            description=exception.get('description'),
            duration=exception.get('duration'),
            createDate=exception.get('createDate')
        )
        db.session.add(exceptionSync)
        db.session.commit()

        place_names = exception.get('place_names')
        for plc_name in place_names:
            place = db.session.query(Place).filter_by(name=plc_name).first()
            if place:
                existing_place_relation = db.session.query(PlaceException).filter_by(
                    place_id=place.id,
                    exception_id=exceptionSync.id
                ).first()
                
                if not existing_place_relation:
                    place_exception = PlaceException(
                        place_id=place.id,
                        exception_id=exceptionSync.id
                    )
                    db.session.add(place_exception)

        category_name = exception.get('category_name')
        if category_name:
            category = db.session.query(Category).filter_by(name=category_name).first()
            if category:
                existing_category_relation = db.session.query(CategoryException).filter_by(
                    category_id=category.id,
                    exception_id=exceptionSync.id
                ).first()
                
                if not existing_category_relation:
                    category_exception = CategoryException(
                        category_id=category.id,
                        exception_id=exceptionSync.id
                    )
                    db.session.add(category_exception)

        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)

def syncEnterprices(enterprice):
    try:
        existing_enterprice = db.session.query(Enterprice).filter_by(cuit=enterprice.get('cuit')).first()
        if existing_enterprice:
            db.session.delete(existing_enterprice)
            db.session.commit()

        enterpriceSync = Enterprice(
            name=enterprice.get('name'),
            cuit=enterprice.get('cuit'),
            isActive=enterprice.get('isActive'),
            createDate=enterprice.get('createDate')
        )
        db.session.add(enterpriceSync)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)

def syncInstitutes(institute):
    try:
        existing_institute = db.session.query(Institute).filter_by( createDate=institute.get('createDate')).first()
        if existing_institute:
            db.session.delete(existing_institute)
            db.session.commit()
        
        instituteSync = Institute(
            name=institute.get('name'),
            isActive=institute.get('isActive'),
            createDate=institute.get('createDate')
        )
        db.session.add(instituteSync)
        db.session.commit()

        places = institute.get('places', [])

        if isinstance(places, list):
            for plc in places:
                place = db.session.query(Place).filter_by(name=plc).first()
                if place:
                    place_institute = InstitutePlace(
                        institute_id=instituteSync.id,
                        place_id=place.id
                    )
                    db.session.add(place_institute)

        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return str(e)

def syncUserHistories(user_history):
    try:
        existing_user_history = db.session.query(User_history).filter_by(
            dniO=user_history.get('dniO'),
            dniN=user_history.get('dniN'),
            role_idO=user_history.get('role_idO'),
            role_idN=user_history.get('role_idN'),
            nameO=user_history.get('nameO'),
            nameN=user_history.get('nameN'),
            lastnameO=user_history.get('lastnameO'),
            lastnameN=user_history.get('lastnameN'),
            passwordO=user_history.get('passwordO'),
            passwordN=user_history.get('passwordN'),
            isActiveO=user_history.get('isActiveO'),
            isActiveN=user_history.get('isActiveN'),
            motiveO=user_history.get('motiveO'),
            motiveN=user_history.get('motiveN'),
            activeDateO=user_history.get('activeDateO'),
            activeDateN=user_history.get('activeDateN'),
            createDateO=user_history.get('createDateO'),
            createDateN=user_history.get('createDateN')
        ).first()

        if existing_user_history:
            db.session.delete(existing_user_history)
            db.session.commit()

        userHistorySync = User_history(
            dniO=user_history.get('dniO'),
            dniN=user_history.get('dniN'),
            role_idO=user_history.get('role_idO'),
            role_idN=user_history.get('role_idN'),
            nameO=user_history.get('nameO'),
            nameN=user_history.get('nameN'),
            lastnameO=user_history.get('lastnameO'),
            lastnameN=user_history.get('lastnameN'),
            passwordO=user_history.get('passwordO'),
            passwordN=user_history.get('passwordN'),
            isActiveO=user_history.get('isActiveO'),
            isActiveN=user_history.get('isActiveN'),
            motiveO=user_history.get('motiveO'),
            motiveN=user_history.get('motiveN'),
            activeDateO=user_history.get('activeDateO'),
            activeDateN=user_history.get('activeDateN'),
            createDateO=user_history.get('createDateO'),
            createDateN=user_history.get('createDateN')
        )
        db.session.add(userHistorySync)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)
    
def syncVisitorHistories(visitor_history):
    try:
        existing_visitor_history = db.session.query(Visitor_history).filter_by(
            dniO=visitor_history.get('dniO'),
            dniN=visitor_history.get('dniN'),
            enterprice_idO=visitor_history.get('enterprice_idO'),
            enterprice_idN=visitor_history.get('enterprice_idN'),
            nameO=visitor_history.get('nameO'),
            nameN=visitor_history.get('nameN'),
            lastnameO=visitor_history.get('lastnameO'),
            lastnameN=visitor_history.get('lastnameN'),
            emailO=visitor_history.get('emailO'),
            emailN=visitor_history.get('emailN'),
            startDateO=visitor_history.get('startDateO'),
            startDateN=visitor_history.get('startDateN'),
            finishDateO=visitor_history.get('finishDateO'),
            finishDateN=visitor_history.get('finishDateN'),
            isActiveO=visitor_history.get('isActiveO'),
            isActiveN=visitor_history.get('isActiveN'),
            createDateO=visitor_history.get('createDateO'),
            createDateN=visitor_history.get('createDateN')
        ).first()

        if existing_visitor_history:
            db.session.delete(existing_visitor_history)
            db.session.commit()
            
        visitorHistorySync = Visitor_history(
            dniO=visitor_history.get('dniO'),
            dniN=visitor_history.get('dniN'),
            enterprice_idO=visitor_history.get('enterprice_idO'),
            enterprice_idN=visitor_history.get('enterprice_idN'),
            nameO=visitor_history.get('nameO'),
            nameN=visitor_history.get('nameN'),
            lastnameO=visitor_history.get('lastnameO'),
            lastnameN=visitor_history.get('lastnameN'),
            emailO=visitor_history.get('emailO'),
            emailN=visitor_history.get('emailN'),
            startDateO=visitor_history.get('startDateO'),
            startDateN=visitor_history.get('startDateN'),
            finishDateO=visitor_history.get('finishDateO'),
            finishDateN=visitor_history.get('finishDateN'),
            isActiveO=visitor_history.get('isActiveO'),
            isActiveN=visitor_history.get('isActiveN'),
            createDateO=visitor_history.get('createDateO'),
            createDateN=visitor_history.get('createDateN')
        )
        db.session.add(visitorHistorySync)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)