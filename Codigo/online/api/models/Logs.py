from db.db import db

# Modelo para la tabla intermedia 'logs'
class Logs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admDni= db.Column(db.Integer)
    userId = db.Column(db.Integer)
    exceptionId = db.Column(db.Integer)
    visitorId = db.Column(db.Integer)
    hasAccess = db.Column(db.Integer)
    isFaceRecognition = db.Column(db.Integer)
    abm = db.Column(db.Text)
    abmType = db.Column(db.Text)
    description = db.Column(db.Text)
    aperturaCierre = db.Column(db.Text)
    createDate = db.Column(db.Text)
    isEnter = db.Column(db.Integer) 
    isAutomatic = db.Column(db.Integer)
    isError = db.Column(db.Integer)
