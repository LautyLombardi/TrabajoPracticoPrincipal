from db.db import db

# Model para la tabla 'place'
class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    abbreviation = db.Column(db.Text)
    description = db.Column(db.Text)
    time = db.Column(db.Text)