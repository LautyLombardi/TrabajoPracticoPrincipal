from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Asocia la instancia de SQLAlchemy con Flask
def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

from models import User, Visitor, Image, Place, Category, Exception, Type, UserType, External, Institute, PlaceException, PlaceExternal, CategoryPlace, CategoryInstitute, CategoryException, CategoryVisitor