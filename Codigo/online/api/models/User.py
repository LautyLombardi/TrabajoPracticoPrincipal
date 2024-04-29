from db.db import db

# Model para la tabla 'user'
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    lastname = db.Column(db.Text)