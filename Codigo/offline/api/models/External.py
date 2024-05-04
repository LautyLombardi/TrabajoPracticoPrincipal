from db.db import db

# Model para la tabla 'external'
class External(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.Text)
    admission_date = db.Column(db.Text)
    departure_date = db.Column(db.Text)