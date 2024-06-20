from db.db import db
from models.Enterprice import Enterprice

def saveEnterprice(data):
    try:
        enterprice = Enterprice(
            name=data.get('name'),
            cuit=data.get('cuit'),
            isActive=data.get('isActive'),
            createDate=data.get('createDate')
        )
        db.session.add(enterprice)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar la empresa: {str(e)}")
        return str(e)