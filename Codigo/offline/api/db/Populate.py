from utils.date import createDate
from models.Place import Place
from models.InstitutePlace import InstitutePlace
from models.Institute import Institute
from models.Role import Role
from db.db import db

places = [
    ('Modulo 1', 'M1', 'Descripción del Módulo 1', '07:00', '22:00', 1, createDate()),
    ('Modulo 2a', 'M2a', 'Descripción del Módulo 2a', '07:00', '22:00', 1, createDate()),
    ('Modulo 2b', 'M2b', 'Descripción del Módulo 2b', '07:00', '22:00', 1, createDate()),
    ('Modulo 3', 'M3', 'Descripción del Módulo 3', '07:00', '22:00', 1, createDate()),
    ('Modulo 4', 'M4', 'Descripción del Módulo 4', '07:00', '22:00', 1, createDate()),
    ('Modulo 5', 'M5', 'Descripción del Módulo 5', '07:00', '22:00', 1, createDate()),
    ('Modulo 6', 'M6', 'Descripción del Módulo 6', '07:30', '22:00', 1, createDate()),
    ('Modulo 7', 'M7', 'Descripción del Módulo 7', '07:00', '22:00', 1, createDate()),
    ('Modulo 9', 'M9', 'Descripción del Módulo 9', '07:00', '22:00', 1, createDate()),
    ('Multiespacio Cultural', 'MC', 'Descripción del Multiespacio Cultural', '10:00', '22:00', 1, createDate()),
    ('Anfiteatro', 'AFT', 'Descripción del Anfiteatro', '08:00', '20:00', 1, createDate()),
    ('Biblioteca', 'BIB', 'Descripción de la Biblioteca', '09:00', '18:00', 1, createDate())
]
def populate_places():
    for place_data in places:
        place = Place(name=place_data[0],
            abbreviation=place_data[1],
            description=place_data[2],
            openTime=place_data[3],
            closeTime=place_data[4],
            isActive=place_data[5],
            createDate=place_data[6]
        )
        db.session.add(place)
        db.session.commit()

institutes = [
    ('ICO', 1, createDate()),
    ('ICI', 1, createDate()),
    ('IDH', 1, createDate()),
    ('IDEI', 1, createDate())
]

def populate_institutes():
    for institute_data in institutes:
        institute = Institute(
            name=institute_data[0],
            isActive=institute_data[1],
            createDate=institute_data[2]
        )
        db.session.add(institute)
    db.session.commit()

institute_places = [
    ('ICO', ['Modulo 6', 'Modulo 7']),
    ('ICI', ['Modulo 2b', 'Modulo 7']),
    ('IDEI', ['Modulo 4', 'Modulo 7']),
    ('IDH', ['Modulo 5', 'Modulo 7'])
]

def populate_institute_places():
    for institute_name, place_names in institute_places:
        institute = Institute.query.filter_by(name=institute_name).first()
        if institute:
            for place_name in place_names:
                place = Place.query.filter_by(name=place_name).first()
                if place:
                    institute_place = InstitutePlace(institute=institute, place=place)
                    db.session.add(institute_place)
    db.session.commit()


roles = [
    ('seguridad','controla la seguridad de la institucion',createDate(),0,1,1,1,1,0,0,0,1,1,0),
    ('Administrador tecnico','tecnico',createDate(),1,1,1,0,0,0,0,0,1,1,0),
    ('RRHH','recurso humanos',createDate(),0,1,1,1,0,1,1,1,1,1,1),
    ('Procesos automaticos','procesos que ocurren de manera automatica',createDate(),0,0,0,0,0,0,0,0,0,0,0),
    ('Personal jerarquico','personal con mas jerarquia',createDate(),0,0,0,0,0,0,0,0,1,0,0)
]    

def populate_roles():
    for role_data in roles:
        role = Role(
            name=role_data[0],
            description=role_data[1],
            createDate=role_data[2],
            routingConnection=role_data[3],
            onlineLogin=role_data[4],
            offlineLogin=role_data[5],
            dayStartEnd=role_data[6],
            visitorAuthentication=role_data[7],
            visitorAuthorization=role_data[8],
            instituteConfiguration=role_data[9],
            entityABMs=role_data[10],
            systemReports=role_data[11],
            systemLog=role_data[12],
            exceptionLoading=role_data[13]
        )
        db.session.add(role)
    db.session.commit()