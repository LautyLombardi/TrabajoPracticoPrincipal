from db.db import db

# Modelo para la tabla 'visitor'
class Visitor_history(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dniO = db.Column(db.Integer)
    dniN = db.Column(db.Integer)
    enterprice_idO = db.Column(db.Integer)
    enterprice_idN = db.Column(db.Integer)
    nameO = db.Column(db.Text)
    nameN = db.Column(db.Text)
    lastnameO = db.Column(db.Text)
    lastnameN = db.Column(db.Text)
    emailO = db.Column(db.Text)
    emailN = db.Column(db.Text)
    startDateO = db.Column(db.Text)
    startDateN = db.Column(db.Text)
    finishDateO = db.Column(db.Text)
    finishDateN = db.Column(db.Text)
    isActiveO = db.Column(db.Integer)
    isActiveN = db.Column(db.Integer)
    createDateO = db.Column(db.Text)
    createDateN = db.Column(db.Text)