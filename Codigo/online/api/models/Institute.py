from db.db import db

# Modelo para la tabla 'Institute'
class Institute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    createDate = db.Column(db.Text)