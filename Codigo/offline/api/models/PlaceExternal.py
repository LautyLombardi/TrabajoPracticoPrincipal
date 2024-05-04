from db.db import db

# Modelo para la tabla intermedia 'PlaceExternal'
class PlaceExternal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'))
    external_id = db.Column(db.Integer, db.ForeignKey('external.id'))

    # Relaciones con las tablas Place y External
    place = db.relationship('Place', backref=db.backref('place_external', cascade='all, delete-orphan'))
    external = db.relationship('External', backref=db.backref('place_external', cascade='all, delete-orphan'))
