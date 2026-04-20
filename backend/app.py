import os
import json
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

# 1. THE VAULT
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. THE BRAIN
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/')
def home():
    return "DISHcovery AI Python Backend is LIVE!"

# 3. THE MAGIC
@app.route('/api/generate-recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get('ingredients', 'chocolate')

    try:
        # Step A: Ask Gemini for the recipe
        prompt = f"Generate a recipe using: {ingredients}. Respond ONLY in raw JSON."
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        recipe_data = json.loads(clean_text)
        
        # Step B: Ask Spoonacular for a photo
        dish_name = recipe_data.get("recipeName", "food")
        spoon_key = os.getenv("SPOONACULAR_API_KEY")
        image_url = "https://via.placeholder.com/500?text=No+Image+Found" 
        
        photo_resp = requests.get(
            f"https://api.spoonacular.com/recipes/complexSearch?query={dish_name}&number=1&apiKey={spoon_key}"
        )

        
        if photo_resp.status_code == 200:
            results = photo_resp.json().get("results", [])
            if results:
                image_url = results[0].get("image")

        # --- THIS IS THE ADDITIONAL CODE FROM YOUR SCREENSHOT ---
        # It lives here because it needs 'image_url' to be ready first!
        recipe_data["image"] = image_url 

        # Step C: Send the final package back
        return jsonify({
            "status": "success",
            "recipe": recipe_data
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5005, debug=True)
