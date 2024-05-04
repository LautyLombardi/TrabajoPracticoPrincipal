from db.db import db

# Modelo para la tabla 'image'
class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    visitorId = db.Column(db.Integer, db.ForeignKey('visitor.id'))
    image = db.Column(db.BLOB)

    # Relaciónes
    visitor = db.relationship('Visitor', backref=db.backref('images', lazy=True))
    user = db.relationship('User', backref=db.backref('images', lazy=True))