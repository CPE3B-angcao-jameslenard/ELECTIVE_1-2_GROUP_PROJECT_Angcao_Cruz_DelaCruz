import os
import json  # Added this to read the AI's JSON output perfectly
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
    return "DISHcovery AI Python Backend is LIVE and AI-Powered!"

@app.route('/api/desserts', methods=['GET'])
def get_desserts():
    sample_desserts = [
        { "id": 1, "name": "Matcha Mille Crepe", "origin": "Japan" },
        { "id": 2, "name": "Tiramisu", "origin": "Italy" },
        { "id": 3, "name": "Leche Flan", "origin": "Philippines" }
    ]
    return jsonify(sample_desserts)

# 3. THE MAGIC
@app.route('/api/generate-recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get('ingredients', 'chocolate')

    try:
        # THE MASTER PROMPT
        prompt = f"""You are the backend AI for "DISHcovery AI", a professional recipe application. Your job is to take a list of user-provided ingredients and generate a creative, delicious recipe. 
        
        CRITICAL RULE: You must NEVER respond with conversational text. You must ONLY respond with a raw, valid JSON object. Do not use markdown formatting like ```json.
        
        Your JSON must follow this exact structure:
        {{
          "recipeName": "A catchy name for the dish",
          "prepTime": "Estimated time in minutes",
          "difficulty": "Easy, Medium, or Hard",
          "ingredients": [
            "Ingredient 1 with exact measurements",
            "Ingredient 2 with exact measurements"
          ],
          "instructions": [
            "Step 1: Do this.",
            "Step 2: Do that."
          ]
        }}
        
        The user's ingredients are: {ingredients}
        """
        
        # Ask Gemini
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        
        # Clean the response and turn it into a real Python dictionary
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        recipe_data = json.loads(clean_text)
        
        # Send perfect JSON back to the React frontend!
        return jsonify({
            "status": "success",
            "recipe": recipe_data
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5005, debug=True)