from db.db import db

# Model para la tabla 'category'
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    isExtern = db.Column(db.Integer)
    isActive = db.Column(db.Integer)
    createDate = db.Column(db.Text)