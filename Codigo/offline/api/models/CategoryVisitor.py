from db.db import db

# Modelo para la tabla intermedia 'CategoryVisitor'
class CategoryVisitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    visitor_id = db.Column(db.Integer, db.ForeignKey('visitor.dni'))

    # Relaciones con las tablas Category y Visitor
    category = db.relationship('Category', backref=db.backref('category_visitors', cascade='all, delete-orphan'))
    visitor = db.relationship('Visitor', backref=db.backref('category_visitors', cascade='all, delete-orphan'))