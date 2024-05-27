from db.db import db

# Modelo para la tabla 'UserHistory'
class UserHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dni = db.Column(db.Integer)
    role_id = db.Column(db.Integer)
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)
    password = db.Column(db.Text)
    isActive = db.Column(db.Integer)
    motive = db.Column(db.Text)
    activeDate = db.Column(db.Text)
    createDate = db.Column(db.Text)
    barcode = db.Column(db.Text)
   