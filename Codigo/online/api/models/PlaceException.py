from db.db import db
class PlaceException(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'))
    exception_id = db.Column(db.Integer, db.ForeignKey('exceptions.id'))

    # Relaciones con las tablas Place y Exceptions
    place = db.relationship('Place', backref=db.backref('place_exceptions', cascade='all, delete-orphan'))
    exceptions = db.relationship('Exceptions', backref=db.backref('place_exceptions', cascade='all, delete-orphan'))
