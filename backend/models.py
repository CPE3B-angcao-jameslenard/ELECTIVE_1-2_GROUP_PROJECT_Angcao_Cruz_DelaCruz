from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

#Initialize the database translator
db = SQLAlchemy()

#TABLE 1: USERS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    #Stores the passwords safely as hashes later
    password_hash = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #Creates a relationship so we can easily find a user's favorites
    favorites = db.relationship('Favorite', backref='user', lazy=True)

#TABLE 2: FAVORITE RECIPES
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # CHANGED: Uses db.Text instead of db.String so massive Edamam URLs fit
    recipe_id = db.Column(db.Text, nullable=False) 
    recipe_title = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.Text)
    source_url = db.Column(db.Text)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)