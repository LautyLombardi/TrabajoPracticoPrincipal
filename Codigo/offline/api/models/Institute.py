from db.db import db

# Modelo para la tabla 'Institute'
class Institute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'))
    name = db.Column(db.Text)
    createDate = db.Column(db.Text)
    
    # Relación con tabla Place     
    place = db.relationship('Place', backref='institute', uselist=False) 