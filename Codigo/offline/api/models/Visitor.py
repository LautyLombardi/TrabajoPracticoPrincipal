from models import User, Image, Visitor, Place
from db.db import db

# Modelo para la tabla 'visitor'
class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)
    
