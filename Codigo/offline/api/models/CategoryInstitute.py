from db.db import db

# Tabla intermedia para la relación muchos a muchos entre Category e Institute
class CategoryInstitute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    institute_id = db.Column(db.Integer, db.ForeignKey('institute.id'))

    # Relaciones con las tablas Category e Institute
    category = db.relationship('Category', backref=db.backref('category_institute', cascade='all, delete-orphan'))
    institute = db.relationship('Institute', backref=db.backref('category_institute', cascade='all, delete-orphan'))
