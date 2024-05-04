from db.db import db

# Model para la tabla 'institute'
class Institute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
