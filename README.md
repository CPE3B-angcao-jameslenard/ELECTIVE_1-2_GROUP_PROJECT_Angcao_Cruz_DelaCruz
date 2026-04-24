# DISHcovery AI
**AI-Powered Recipe Finder**

A collaborative project for Elective 1 & 2 - Bulacan State University


**4. Documentation**

​**4.1 System Architecture Diagram**

​This diagram shows how the user's browser interacts with our cloud infrastructure and external intelligence services.

<img width="1284" height="928" alt="Image" src="https://github.com/user-attachments/assets/a34410a4-613a-4f81-bf0b-8b4a80808d37" />


**4.2 API Documentation**

​Our backend serves as a centralized hub for data orchestration and security.

| Endpoint               | Method   | Description                                   |
| ---------------------- | -------- | --------------------------------------------- |
|/api/signup             | POST     |Registers a new user and hashes passwords.     |
|/api/login              | POST     |Authenticates user and returns session data.   |
|/api/search-recipes     | POST     |Fetches recipes & nutrition data from Edamam.  |
|/api/generate-meal-plan | POST     |Connects to Gemini Pro for AI meal generation. |
|/api/favorites          | POST     |Saves a recipe to the Supabase database.       |



**4.3 Database Schema**

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



**4.4 Deployment Diagram**

​The application is architected for high availability using a multi-cloud deployment strategy.

<img width="2000" height="245" alt="Image" src="https://github.com/user-attachments/assets/9c52ca3d-dbc6-4d7a-816f-e19ac551026e" />

 
---

Developed By:
**Dishcovery AI** was built for Elective 1 & 2 by:

* **Ashley Mae D. Cruz** | *Frontend Designer*
  * Focused on creating clean, responsive, and user-friendly interfaces for every device.
* **James Lenard M. Angcao** | *Backend Developer*
  * Responsible for API logic, data handling, and smooth integration with the recipe services.
* **Josephine B. Dela Cruz** | *Full-stack Contributor*
  * Helped shape the app structure, menu flow, and overall recipe experience.

---


