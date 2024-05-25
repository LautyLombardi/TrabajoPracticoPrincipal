from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Asocia la instancia de SQLAlchemy con Flask
def init_db(app):
    db.init_app(app)
    with app.app_context():
        #db.drop_all()
        db.create_all()

from models import *