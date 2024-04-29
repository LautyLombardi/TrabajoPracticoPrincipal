from db.db import db

# Model para la tabla 'persons_images'
class PersonsImages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    photo = db.Column(db.BLOB)
    user = db.relationship('User', backref=db.backref('images', lazy=True))
