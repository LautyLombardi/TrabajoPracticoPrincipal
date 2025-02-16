from db.db import db

# Modelo para la tabla intermedia 'logs'
class Logs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admDni= db.Column(db.Integer) 
    userId = db.Column(db.Integer, db.ForeignKey('user.dni'))
    exceptionId = db.Column(db.Integer, db.ForeignKey('exception.id'))
    visitorId = db.Column(db.Integer, db.ForeignKey('visitor.dni'))
    hasAccess = db.Column(db.Integer)  
    isFaceRecognition = db.Column(db.Integer)  
    abm = db.Column(db.Text)
    abmType = db.Column(db.Text)
    description = db.Column(db.Text)
    aperturaCierre = db.Column(db.Text)
    createDate = db.Column(db.Text)
    isEnter = db.Column(db.Integer)  
    isAutomatic = db.Column(db.Integer)

    # Relaciónes
    user = db.relationship('User', backref=db.backref('logs', lazy=True))
    exception = db.relationship('Exception', backref=db.backref('logs', lazy=True))
    visitor = db.relationship('Visitor', backref=db.backref('logs', lazy=True))
    