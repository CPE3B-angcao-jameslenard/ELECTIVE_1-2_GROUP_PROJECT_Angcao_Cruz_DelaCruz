# DISHcovery AI
**AI-Powered Recipe Finder**

A collaborative project for Elective 1 & 2 - Bulacan State University

**SYSTEM AECHITECTURE DIAGRAM**
1. Presentation Layer (Frontend)
Environment: Web Browser
Framework: React Client (App.jsx)
Key Components:

User Input: Handles ingredients and food preferences.
State Management: Uses useState to track recipes, meal plans, and the current user.
Authentication: Views for Login and Signup.
Favorites: A dedicated view for saved recipes.

2. Logic Layer (Backend)

Framework: Flask Server (app.py)
Hosting: Render
Key Responsibilities:
Security: Manages API keys and database URLs via a secure .env file.
Endpoints:

/api/signup & /api/login: Handles user auth using werkzeug.
/api/search-recipes: Connects to the Spoonacular client.
/api/generate-meal-plan: Interfaces with the Gemini AI client.
/api/favorites: Manages database interactions via SQLAlchemy.

3. Data & Services Layer (External APIs & Database)
This layer handles the "heavy lifting" for data and intelligence:

Google Gemini API: The "Brain" that processes AI prompts and returns structured recipe plans (JSON).
Spoonacular Food API: Used to query specific recipe details and fetch high-quality food images.
Supabase (PostgreSQL): The primary database that stores:
User Table: IDs, usernames, and hashed passwords.
Favorite Table: Linked recipe IDs, titles, and image URLs.

How the Data Flows
Request: The user enters ingredients in the React Frontend, which sends an HTTPS Request to the Flask Backend.
Processing: The Backend asks Gemini for a plan and Spoonacular for specific recipe data.
Storage: If the user "favorites" a dish, the Backend performs a CRUD operation to save it in Supabase.
Response: The Backend bundles all this info and sends a Combined Response back to the user's screen.




**API DOCUMENTATION**
Overview of System Connectivity
The DISHcovery AI application operates through a series of structured API endpoints. This "Application Programming Interface" acts as the bridge between the React.js Frontend (the user interface) and the Python Flask Backend (the logic center). The system is designed to handle secure user data, fetch real-time culinary information from Spoonacular, and generate creative content using Google Gemini AI.

User Authentication & Security
These endpoints ensure that every "Chef" using the app has a private and secure experience.
User Registration (POST /api/signup)
Purpose: To onboard new users into the DISHcovery ecosystem.
Logic: When a user submits their desired credentials, the backend uses the werkzeug.security library to "scramble" (hash) the password. This ensures that even if the database is accessed, the actual passwords remain invisible.
Outcome: A new record is created in the Supabase PostgreSQL database.
User Login (POST /api/login)
Purpose: To verify the identity of returning users.
Logic: The system retrieves the stored hashed password and compares it with the one entered. If they match, a success message and the User ID are sent back to the frontend to start the session.

Recipe Discovery & AI Intelligence
This section covers the core "magic" of the app where data is pulled from external global services.
Ingredient-Based Search (POST /api/search-recipes)
Purpose: To find existing recipes that match the user's available ingredients.
Technical Flow: The app takes the user's text input (e.g., "shrimp, lemon") and the food category (e.g., "Main Course"). It then sends a request to the Spoonacular API.
Data Returned: The backend filters the results and sends back a "Recipe Card" package containing the title, a high-quality image URL, and a link to the full instructions.
AI Chef Meal Planner (POST /api/generate-meal-plan)
Purpose: To provide a creative, personalized 3-day eating plan.
Technical Flow: This endpoint uses the Gemini 2.5 Flash model. It sends a specialized "prompt" to the AI, asking it to act as a professional chef.
Data Returned: The AI responds with a structured text plan, complete with meal suggestions for Day 1, Day 2, and Day 3, formatted with emojis for a friendly user experience.

Personal Cookbook Management
These routes manage the "Favorites" feature, allowing users to build a persistent collection of recipes.
Adding a Favorite (POST /api/favorites)
Action: Triggered when a user clicks the ❤️ icon on a recipe card.
Logic: The backend receives the User ID along with the recipe's title and image URL. It checks if the recipe is already saved to prevent duplicates and then commits the new entry to the Favorite table in the database.
Retrieving the Cookbook (GET /api/favorites/<user_id>)
Action: Triggered when the user clicks "My Favorites" in the navigation bar.
Logic: The system performs a database query to find all entries linked to that specific user_id. It then sends a list of saved recipes back to the React frontend to be displayed in a stylish "Cookbook" view.




**DATABASE SCHEMA**
The DISHcovery application utilizes a relational database structure hosted on Supabase (PostgreSQL). This architecture ensures that user accounts remain secure and that personalized recipe collections are persistent across sessions.


Table: 
This table functions as the primary directory for application access and security.

Field Name - Data Type - Constraints - Description
id - Integer - Primary Key - A unique identifier generated for every new account.
username - String - Unique - The user's chosen login name; duplicates are prevented.
password_hash - text - Not null - A salted and hashed version of the password for security.

Table:
This table stores the specific recipe metadata that users choose to save to their personal collection.

Field Name - Data Type - Constraints - Description
id - Integer,Primary Key - A unique identifier for every saved recipe entry.
user_id - Integer - Foreign Key - Connects the entry to a specific user in the User table.
recipe_title - String - Not null - The display name of the dish.
image_url - text - The hosted URL for the recipe's thumbnail image.
Source_url - text - The direct link to the full cooking instructions.

Data Relationship Model
The Logic: One User can have many Favorite recipes, but each record in the favorites table belongs to exactly one user.
The Connection: This is maintained by the user_id field, which "points" back to the User's unique ID.



**DEPLOYMENT DIAGRAM**

Node / Location - Component - Role & Technology
Client Node (User Device) - Browser - Runs the React Frontend where users interact with the app.
Application Server (Render Cloud) - Flask Web App - The core backend logic (app.py) running on Gunicorn (WSGI Server).
                                 - Spoonacular Client - Handles outgoing requests to fetch recipe data.
Database Node (Supabase Cloud) - PostgreSQL Instance - Stores the User and Favorite tables via a secure SQL/TCP connection.
External Services - Spoonacular API - Third-party service providing recipe information.
                - Google Gemini AI - The AI engine used for generating meal plans.


The DISHcovery application follows a distributed cloud architecture to ensure security and performance. The diagram below illustrates how the frontend, backend, and database interact across different hosting environments.

Technical Node Descriptions
Client Node: A web browser running the React frontend. It sends user requests to the server via secure HTTPS.
Application Server (Render): Hosts the Flask backend. It uses Gunicorn as a production-grade WSGI server to manage traffic and process the application logic.
Database Node (Supabase): A cloud-hosted PostgreSQL instance that stores user accounts and saved recipes.
External APIs: Outbound connections to Spoonacular (for recipes) and Google Gemini (for AI meal planning) to fetch dynamic content.
This setup ensures that sensitive data is stored separately from the user interface, utilizing industry-standard encryption for all connections.
