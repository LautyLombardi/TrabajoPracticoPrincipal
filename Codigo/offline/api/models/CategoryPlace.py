from db.db import db

# Modelo para la tabla intermedia 'CategoryPlace'
class CategoryPlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'))

    # Definir las relaciones con las tablas Category y Place
    category = db.relationship('Category', backref=db.backref('category_places', cascade='all, delete-orphan'))
    place = db.relationship('Place', backref=db.backref('category_places', cascade='all, delete-orphan'))