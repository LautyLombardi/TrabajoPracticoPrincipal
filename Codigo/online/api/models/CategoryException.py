from db.db import db

# Modelo para la tabla intermedia 'CategoryException'
class CategoryException(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    exception_id = db.Column(db.Integer, db.ForeignKey('exception.id'))

    # Definir las relaciones con las tablas Category y Exception
    category = db.relationship('Category', backref=db.backref('category_exceptions', cascade='all, delete-orphan'))
    exception = db.relationship('Exception', backref=db.backref('category_exceptions', cascade='all, delete-orphan'))