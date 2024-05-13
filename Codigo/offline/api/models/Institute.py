from db.db import db

# Modelo para la tabla 'Institute'
class Institute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    isActive = db.Column(db.Integer)
    createDate = db.Column(db.Text)