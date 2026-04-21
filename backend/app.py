import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

# 1. THE VAULT
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. THE BRAIN & THE EYES
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
spoon_api_key = os.getenv("SPOONACULAR_API_KEY")

@app.route('/')
def home():
    return "DISHcovery AI Python Backend is LIVE!"

# --- ROUTE 1: THE FINDER (Forgiving Search) ---
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

# --- ROUTE 2: THE ADVANCED AI FEATURE ---
@app.route('/api/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    data = request.json
    ingredients = data.get('ingredients', '')
    food_type = data.get('foodType', 'dish') 
    
    prompt = f"""
    Act as a professional Chef. Based on these ingredients: {ingredients}, 
    create a '3-Day {food_type.title()} Plan'. 
    Suggest one {food_type} per day. 
    
    FORMATTING RULES:
    1. NEVER use markdown symbols (*, #, _, etc).
    2. You MUST use double line breaks (press enter twice) between each day.
    3. Make it readable like a blog post.
    4. Use emojis.
    """
    
    try:
        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        return jsonify({"status": "success", "plan": response.text})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5005, debug=True)