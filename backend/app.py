import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai  # The Google GenAI SDK
from dotenv import load_dotenv

# 1. THE VAULT: Load variables from your .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. THE BRAIN: Initialize Gemini with your secret key
# It automatically looks for "GEMINI_API_KEY" in your .env
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/')
def home():
    return "DISHcovery AI Python Backend is LIVE and AI-Powered!"

# Keep your original desserts route so the frontend doesn't break
@app.route('/api/desserts', methods=['GET'])
def get_desserts():
    sample_desserts = [
        { "id": 1, "name": "Matcha Mille Crepe", "origin": "Japan" },
        { "id": 2, "name": "Tiramisu", "origin": "Italy" },
        { "id": 3, "name": "Leche Flan", "origin": "Philippines" }
    ]
    return jsonify(sample_desserts)

# 3. THE MAGIC: New route to generate recipes with Gemini
@app.route('/api/generate-recipe', methods=['POST'])
def generate_recipe():
    # Get the ingredients sent from the frontend/terminal
    data = request.json
    ingredients = data.get('ingredients', 'chocolate')

    try:
        # Prompt Gemini to be a world-class pastry chef
        prompt = f"You are a professional pastry chef. Create a unique dessert recipe using: {ingredients}. Provide a name, ingredients list, and 3-step instructions."
        
        response = client.models.generate_content(
           model="gemini-3-flash-preview",
            contents=prompt
        )
        
        return jsonify({
            "status": "success",
            "recipe": response.text
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5005, debug=True)