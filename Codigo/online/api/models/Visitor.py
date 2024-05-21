from models import User, Image, Visitor, Place
from db.db import db

# Modelo para la tabla 'visitor'
class Visitor(db.Model):
    dni = db.Column(db.Integer, primary_key=True)
    enterprice_id = db.Column(db.Integer, db.ForeignKey('enterprice.id'))
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)
    email = db.Column(db.Text)
    startDate = db.Column(db.Text)
    finishDate = db.Column(db.Text)
    createDate = db.Column(db.Text)
    
    # Relación con tabla Enterprice
    enterprice = db.relationship('Enterprice', backref=db.backref('visitors', lazy=True))