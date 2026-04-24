import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# IMPORT YOUR NEW DATABASE!
from models import db, User, Favorite 

load_dotenv()

#ADD THESE TWO LINES FOR DEBUGGING
print(f"🔎 Is .env file found? {os.path.exists('.env')}")
print(f"🔑 DATABASE_URL value: {os.getenv('DATABASE_URL')}")
# -----------------------------------------

app = Flask(__name__)
CORS(app)

#ATABASE CONFIGURATION
# We look for a DATABASE_URL in your .env file. 
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///local_test.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Plug the database into the app
db.init_app(app)

# This magically creates the tables if they don't exist yet
with app.app_context():
    db.create_all()

# ... (Keep the rest of your API keys and routes exactly the same below this!)
# 2. THE BRAIN & THE EYES
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
spoon_api_key = os.getenv("SPOONACULAR_API_KEY")

@app.route('/')
def home():
    return "DISHcovery AI Python Backend is LIVE!"

# --- ROUTE: USER LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required!"}), 400

    # 1. Find the user in the database
    user = User.query.filter_by(username=username).first()

    # 2. Check if user exists AND if the password matches the hash
    if user and check_password_hash(user.password_hash, password):
        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": user.id, 
                "username": user.username
            }
        }), 200
    
    # 3. If login fails
    return jsonify({"error": "Invalid username or password"}), 401

# --- ROUTE: USER SIGNUP ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # 1. Check if they left it blank
    if not username or not password:
        return jsonify({"error": "Username and password are required!"}), 400

    # 2. Check if the username is already taken
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists! Choose another."}), 409

    # 3. Scramble the password for safety
    hashed_password = generate_password_hash(password)

    # 4. Create the new user and save them to Supabase
    new_user = User(username=username, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!", "user_id": new_user.id}), 201

#ROUTE: SAVE A FAVORITE
@app.route('/api/favorites', methods=['POST'])
def add_favorite():
    data = request.json
    user_id = data.get('user_id')
    recipe_id = data.get('recipe_id')
    title = data.get('title')
    image = data.get('image')
    source_url = data.get('source_url') # Get the link from React

    if not user_id:
        return jsonify({"error": "You must be logged in to save favorites!"}), 401

    existing = Favorite.query.filter_by(user_id=user_id, recipe_id=str(recipe_id)).first()
    if existing:
        return jsonify({"message": "Already in favorites!"}), 200

    new_fav = Favorite(
        user_id=user_id,
        recipe_id=str(recipe_id),
        recipe_title=data.get('title'),
        image_url=data.get('image'),
        source_url=data.get('sourceUrl'),
        ready_in_minutes=data.get('readyInMinutes'),
        calories=data.get('calories'),
        protein=data.get('protein'),
        fat=data.get('fat'),
        carbs=data.get('carbs')
    )
    db.session.add(new_fav)
    db.session.commit()

    return jsonify({"message": "Added to favorites! ❤️"}), 201


#ROUTE: GET USER FAVORITES
@app.route('/api/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    user_favorites = Favorite.query.filter_by(user_id=user_id).all()
    
    favorites_list = []
    for fav in user_favorites:
        favorites_list.append({
            "id": fav.id,
            "recipe_id": fav.recipe_id,
            "title": fav.recipe_title,
            "image": fav.image_url,
            "sourceUrl": fav.source_url,
            "readyInMinutes": fav.ready_in_minutes,
            "calories": fav.calories,
            "protein": fav.protein,
            "fat": fav.fat,
            "carbs": fav.carbs
        })
        
    return jsonify({"status": "success", "favorites": favorites_list}), 200

@app.route('/api/favorites/<int:fav_id>', methods=['DELETE'])
def delete_favorite(fav_id):
    fav = Favorite.query.get(fav_id)
    if fav:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"message": "Recipe removed! 🗑️"}), 200
    return jsonify({"error": "Recipe not found"}), 404

#ROUTE 1: THE FINDER (Forgiving Search)
@app.route('/api/search-recipes', methods=['POST'])
def search_recipes():
    data = request.json
    ingredients = data.get('ingredients', '')
    food_type = data.get('foodType', '') 
    
    #'query' was used instead of 'includeIngredients' to be more flexible
    search_query = ingredients.replace(" ", "+")
    
    url = f"https://api.spoonacular.com/recipes/complexSearch?query={search_query}&addRecipeInformation=true&number=4&apiKey={spoon_api_key}"
    
    if food_type:
        url += f"&type={food_type}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            results = response.json().get('results', [])
            return jsonify({"status": "success", "recipes": results})
        return jsonify({"status": "error", "message": "Spoonacular Error"}), 500
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/favorites/clear/<int:user_id>', methods=['DELETE'])
def clear_cookbook(user_id):
    #Wipes every favorite for that specific user
    Favorite.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Cookbook cleared! 🧹"}), 200

#ROUTE 2: THE ADVANCED AI FEATURE
@app.route('/api/ai-chef', methods=['POST', 'OPTIONS'])
def generate_meal_plan():
    try:
        data = request.json
        ingredients = data.get('ingredients', '')
        food_type = data.get('foodType', 'dish')
        
        prompt = f"Act as a professional Chef. Based on these ingredients: {ingredients}, create a 3-Day {food_type.title()} Plan."

        # Grab the API key manually just to be safe
        import os
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return jsonify({"status": "success", "plan": "⚠️ SERVER ERROR: API Key is missing inside Render Environment."})

        # Generate the AI response
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # Check if Google blocked it for safety reasons
        ai_text = response.text if response.text else "⚠️ AI ERROR: Google blocked the response (Safety Filters)."
        
        return jsonify({"status": "success", "plan": ai_text})

    except Exception as e:
        # If ANYTHING fails, it sends this cleanly to the frontend instead of crashing CORS
        print(f"CRASH DETAILS: {str(e)}") 
        return jsonify({"status": "success", "plan": f"⚠️ PYTHON ERROR: {str(e)}"})

if __name__ == '__main__':
    app.run(port=5005, debug=True)
