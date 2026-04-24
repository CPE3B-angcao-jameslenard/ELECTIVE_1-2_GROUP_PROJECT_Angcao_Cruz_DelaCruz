# DISHcovery AI
**AI-Powered Recipe Finder**

A collaborative project for Elective 1 & 2 - Bulacan State University


4. Documentation
​4.1 System Architecture Diagram
​This diagram shows how the user's browser interacts with our cloud infrastructure and external intelligence services.

graph TD
    User((User Browser)) -->|React/Vercel| Frontend[Frontend UI]
    Frontend -->|REST API| Backend[Flask/Render Backend]
    Backend -->|SQL| DB[(Supabase Database)]
    Backend -->|GenAI SDK| Gemini[Google Gemini AI]
    Backend -->|Request| Edamam[Edamam Nutrition API]
    Backend -->|Request| Spoon[Spoonacular API]



4.2 API Documentation
​Our backend serves as a centralized hub for data orchestration and security.

Endpoint Method Description
/api/signup POST Registers a new user and hashes passwords.
/api/login POST Authenticates user and returns session data.
/api/search-recipes POST Fetches recipes & nutrition data from Edamam.
/api/generate-meal-plan POST Connects to Gemini Pro for AI meal generation.
/api/favorites POST Saves a recipe to the Supabase database.



4.3 Database Schema
​We utilize a PostgreSQL schema hosted on Supabase to manage user persistence.
​Table: users
​id (Primary Key, UUID)
​email (Unique String)
​password_hash (Encrypted String)
​Table: favorites
​id (Primary Key, INT)
​user_id (Foreign Key -> users.id)
​recipe_title (String)
​image_url (String)
​source_url (String)



4.4 Deployment Diagram
​The application is architected for high availability using a multi-cloud deployment strategy.

graph LR
    subgraph "Public Internet"
        Domain[dishcovery-ai.com]
    end

    subgraph "Vercel Platform"
        FE[Production Frontend - React]
    end

    subgraph "Render Platform"
        BE[Production Backend - Python/Flask]
    end

    subgraph "Supabase Cloud"
        DB[(PostgreSQL Database)]
    end

    Domain --> FE
    FE --> BE
    BE --> DB




 



