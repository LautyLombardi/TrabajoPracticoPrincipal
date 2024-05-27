from db.db import db

# Modelo para la tabla 'visitor'
class VisitorHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dni = db.Column(db.Integer)
    enterprice_id = db.Column(db.Integer)
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)
    email = db.Column(db.Text)
    startDate = db.Column(db.Text)
    finishDate = db.Column(db.Text)
    isActive = db.Column(db.Integer)
    createDate = db.Column(db.Text)
    isEnter = db.Column(db.Integer)
    password = db.Column(db.Text)
    