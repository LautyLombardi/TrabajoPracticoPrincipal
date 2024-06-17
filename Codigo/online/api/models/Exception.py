from db.db import db

# Modelo para la tabla 'exception'
class Exception(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)  
    duration = db.Column(db.Text)
    createDate = db.Column(db.Text)
    
    # Relación con tabla User
    user = db.relationship('User', backref=db.backref('exceptions', lazy=True))