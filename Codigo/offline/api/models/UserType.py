from db.db import db

# Modelo para la tabla intermedia 'UserType'
class UserType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    type_id = db.Column(db.Integer, db.ForeignKey('type.id'))

    # Relaciones con las tablas User y Type
    user = db.relationship('User', backref=db.backref('user_types', cascade='all, delete-orphan'))
    type = db.relationship('Type', backref=db.backref('user_types', cascade='all, delete-orphan'))
