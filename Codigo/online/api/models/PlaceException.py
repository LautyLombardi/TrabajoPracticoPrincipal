from db.db import db

# Modelo para la tabla intermedia 'PlaceException'
class PlaceException(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'))
    exception_id = db.Column(db.Integer, db.ForeignKey('exception.id'))

    # Relaciones con las tablas Place y Exception
    place = db.relationship('Place', backref=db.backref('place_exceptions', cascade='all, delete-orphan'))
    exception = db.relationship('Exception', backref=db.backref('place_exceptions', cascade='all, delete-orphan'))