from db.db import db

# Modelo para la tabla 'visitor'
class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)
    
    # Relación uno a muchos con la tabla Image
    images = db.relationship('Image', backref='visitor', lazy=True)
