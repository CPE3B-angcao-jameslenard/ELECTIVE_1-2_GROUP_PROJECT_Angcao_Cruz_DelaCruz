# DISHcovery AI
**AI-Powered Recipe Finder**

A collaborative project for Elective 1 & 2 - Bulacan State University


4. Documentation

​4.1 System Architecture Diagram
​This diagram shows how the user's browser interacts with our cloud infrastructure and external intelligence services.

​```mermaid

graph TD
    %% Nodes
    User((User Browser))
    FE[Project Frontend <br/><i>React/Vercel</i>]
    BE[Project Backend <br/><i>Flask/Render</i>]
    DB[(Supabase Database <br/><i>PostgreSQL</i>)]
    Gemini{Google Gemini AI <br/><i>GenAI SDK</i>}
    Edamam[Edamam Nutrition API]
    Spoon[Spoonacular API]

    %% Connections
    User -->|Access| FE
    FE -->|API Requests| BE
    BE -->|SQL Queries| DB
    BE -->|AI Processing| Gemini
    BE -->|Nutrition Info| Edamam
    BE -->|Recipe Data| Spoon

    %% Styling
    style FE fill:#239120,stroke:#333,stroke-width:2px,color:#fff
    style BE fill:#005c99,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#3ecf8e,stroke:#333,stroke-width:2px,color:#fff
    style Gemini fill:#f4b400,stroke:#333,stroke-width:2px

```




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


​```mermaid

graph LR
    subgraph "Public Internet"
        Domain[dishcovery-ai.com]
    end

    subgraph "Vercel Platform"
        FE[Production Frontend <br/><i>React</i>]
    end

    subgraph "Render Platform"
        BE[Production Backend <br/><i>Python/Flask</i>]
    end

    subgraph "Supabase Cloud"
        DB[(PostgreSQL Database)]
    end

    %% Flow
    Domain -->|HTTPS| FE
    FE -->|API Calls| BE
    BE -->|Database Connection| DB

    %% Styling
    style Domain fill:#f9f9f9,stroke:#333
    style FE fill:#000,stroke:#fff,color:#fff
    style BE fill:#46a394,stroke:#333,color:#fff
    style DB fill:#3ecf8e,stroke:#333,color:#fff

```





 
---

##Developed By:
**Dishcovery AI** was built for Elective 1 & 2 by:

* **Ashley Mae D. Cruz** | *Frontend Designer*
  * Focused on creating clean, responsive, and user-friendly interfaces for every device.
* **James Lenard M. Angcao** | *Backend Developer*
  * Responsible for API logic, data handling, and smooth integration with the recipe services.
* **Josephine B. Dela Cruz** | *Full-stack Contributor*
  * Helped shape the app structure, menu flow, and overall recipe experience.

---


