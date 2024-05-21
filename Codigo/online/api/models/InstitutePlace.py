from db.db import db

# Modelo para la tabla intermedia 'InstitutePlace'
class InstitutePlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    institute_id = db.Column(db.Integer, db.ForeignKey('institute.id'))
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'))

    # Relaciones con las tablas Institute y Place
    institute = db.relationship('Institute', backref=db.backref('institute_place', cascade='all, delete-orphan'))
    place = db.relationship('Place', backref=db.backref('institute_place', cascade='all, delete-orphan'))