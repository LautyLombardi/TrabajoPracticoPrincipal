from db.db import db
from models import User, Visitor, Place, Category, Enterprice, Institute, Logs, User_history, Visitor_history

def syncLogs(log):
    try:
        logSync=Logs(
            admDni = log.get('admDni'),
            userId = log.get('userId'),
            exceptionId = log.get('exceptionId'),
            visitorId = log.get('visitorId'),
            hasAccess = log.get('hasAccess'),
            isFaceRecognition = log.get('isFaceRecognition'),
            abm = log.get('abm'),
            abmType = log.get('abmType'),
            description = log.get('description'),
            aperturaCierre = log.get('aperturaCierre'),
            createDate = log.get('createDate'),
            isEnter = log.get('isEnter'),
            isAutomatic = log.get('isAutomatic'),
            isError = log.get('isError')
        )
        db.session.add(logSync)
        db.session.commit()     
        return True
    except Exception as e:
        return str(e)
    
def syncUser(user):
    try:
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
        return e

def syncVisitors(visitor):
    try:
        visitorSync = Visitor(
            dni=visitor.get('dni'),
            enterprice_id=visitor.get('enterprice_id'),
            name=visitor.get('name'),
            lastname=visitor.get('lastname'),
            email=visitor.get('email'),
            startDate=visitor.get('startDate'),
            finishDate=visitor.get('finishDate'),
            isActive=visitor.get('isActive'),
            createDate=visitor.get('createDate')
        )
        db.session.add(visitorSync)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)
    
def syncPlaces(place):
    try:
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
        return str(e)

def syncCategories(category):
    try:
        categorySync = Category(
            name=category.get('name'),
            description=category.get('description'),
            isExtern=category.get('isExtern'),
            isActive=category.get('isActive'),
            createDate=category.get('createDate')
        )
        db.session.add(categorySync)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)
    
def syncExceptions(exception):
    try:
        exceptionSync = Exception(
            name=exception.get('name'),
            description=exception.get('description'),
            duration=exception.get('duration'),
            createDate=exception.get('createDate')
        )
        db.session.add(exceptionSync)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)

def syncEnterprices(enterprice):
    try:
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
        return str(e)

def syncInstitutes(institute):
    try:
        instituteSync = Institute(
            name=institute.get('name'),
            isActive=institute.get('isActive'),
            createDate=institute.get('createDate')
        )
        db.session.add(instituteSync)
        db.session.commit()
        return True
    except Exception as e:
        return str(e)
    
def syncUserHistories(user_history):
    try:
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