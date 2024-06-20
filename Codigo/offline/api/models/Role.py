from db.db import db

# Model para la tabla 'role'
class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    createDate = db.Column(db.Text)
    routingConnection = db.Column(db.Integer)
    onlineLogin = db.Column(db.Integer)
    offlineLogin = db.Column(db.Integer)
    dayStartEnd = db.Column(db.Integer)
    visitorAuthentication = db.Column(db.Integer)
    visitorAuthorization = db.Column(db.Integer)
    instituteConfiguration = db.Column(db.Integer)
    entityABMs = db.Column(db.Integer)
    systemReports = db.Column(db.Integer)
    systemLog = db.Column(db.Integer)
    exceptionLoading = db.Column(db.Integer)