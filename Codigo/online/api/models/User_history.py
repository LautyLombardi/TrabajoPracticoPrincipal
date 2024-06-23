from db.db import db

# Model para la tabla 'user'
class User_history(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dniO = db.Column(db.Integer)
    dniN = db.Column(db.Integer)
    role_idO = db.Column(db.Integer)
    role_idN = db.Column(db.Integer)
    nameO = db.Column(db.Text)
    nameN = db.Column(db.Text)
    lastnameO = db.Column(db.Text)
    lastnameN = db.Column(db.Text)
    passwordO = db.Column(db.Text)
    passwordN = db.Column(db.Text)
    isActiveO = db.Column(db.Integer)
    isActiveN = db.Column(db.Integer)
    motiveO = db.Column(db.Text)
    motiveN = db.Column(db.Text)
    activeDateO = db.Column(db.Text)
    activeDateN = db.Column(db.Text)
    createDateO = db.Column(db.Text)
    createDateN = db.Column(db.Text)