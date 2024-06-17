from db.db import db

# Model para la tabla 'place'
class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    abbreviation = db.Column(db.Text)
    description = db.Column(db.Text)
    openTime = db.Column(db.Text)
    closeTime = db.Column(db.Text)
    isActive = db.Column(db.Integer)
    createDate = db.Column(db.Text)