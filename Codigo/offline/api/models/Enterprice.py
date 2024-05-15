from db.db import db

# Modelo para la tabla 'enterprice'
class Enterprice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text) 
    cuit = db.Column(db.Integer)
    isActive = db.Column(db.Integer)
    createDate = db.Column(db.Text)