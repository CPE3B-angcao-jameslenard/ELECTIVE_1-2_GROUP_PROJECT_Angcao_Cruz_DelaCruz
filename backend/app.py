from flask import Flask, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS so your React app (on port 5173) can talk to this server (on port 5000)
CORS(app)

@app.route('/')
def home():
    return "DISHcovery AI Python Backend is LIVE!"

# This is the endpoint your React frontend will call
@app.route('/api/desserts', methods=['GET'])
def get_desserts():
    sample_desserts = [
        { "id": 1, "name": "Matcha Mille Crepe", "origin": "Japan" },
        { "id": 2, "name": "Tiramisu", "origin": "Italy" },
        { "id": 3, "name": "Leche Flan", "origin": "Philippines" }
    ]
    return jsonify(sample_desserts)

if __name__ == '__main__':
    # We use debug=True so the server restarts automatically when you save changes
    app.run(port=5000, debug=True)