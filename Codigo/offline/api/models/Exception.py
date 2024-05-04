from db.db import db

# Model para la tabla 'exception'
class Exception(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.Text)
    depscription = db.Column(db.Text)    
    duration = db.Column(db.Text)
    date = db.Column(db.Text)
    
    # Relacion con tabla User
    user = db.relationship('User', backref=db.backref('images', lazy=True))