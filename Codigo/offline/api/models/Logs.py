from db.db import db

# Modelo para la tabla intermedia 'logs'
class Logs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    categoryPlaceId = db.Column(db.Integer, db.ForeignKey('categoryplace.id'))
    visitorId = db.Column(db.Integer, db.ForeignKey('visitor.id'))
    hasAccess = db.Column(db.Integer)
    isFaceRecognition = db.Column(db.Integer)
    type = db.Column(db.Text)

    # Relaciónes
    user = db.relationship('User', backref=db.backref('logs', lazy=True))
    categoryplace = db.relationship('CategoryPlace', backref=db.backref('logs', lazy=True))
    visitor = db.relationship('Visitor', backref=db.backref('logs', lazy=True))
    