from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize the database translator
db = SQLAlchemy()

# --- TABLE 1: USERS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # We will store passwords safely as hashes later!
    password_hash = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # This creates a relationship so we can easily find a user's favorites
    favorites = db.relationship('Favorite', backref='user', lazy=True)

# --- TABLE 2: FAVORITE RECIPES ---
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # We save the Spoonacular data so we don't have to fetch it again!
    recipe_id = db.Column(db.String(50), nullable=False) 
    recipe_title = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(300))
    source_url = db.Column(db.String(500))
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)