from db.db import db

# Model para la tabla 'type'
class Type(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)