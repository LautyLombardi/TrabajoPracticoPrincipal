from db.db import db

# Model para la tabla 'user'
class User(db.Model):
    dni = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)
    password = db.Column(db.Text)
    isActive = db.Column(db.Integer)
    motive = db.Column(db.Text)
    activeDate = db.Column(db.Text)
    createDate = db.Column(db.Text)

    
    # Relación con tabla Role
    role = db.relationship('Role', backref=db.backref('users', lazy=True))