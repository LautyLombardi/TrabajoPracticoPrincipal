from db.db import db

# Modelo para la tabla 'exception'
class Exception(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.Text)
    description = db.Column(db.Text)  
    duration = db.Column(db.Text)
    date = db.Column(db.Text)
    
    # Relación con tabla User
    user = db.relationship('User', backref=db.backref('exceptions', lazy=True))