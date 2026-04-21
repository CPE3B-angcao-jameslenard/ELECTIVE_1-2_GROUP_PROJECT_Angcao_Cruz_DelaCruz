import { useState } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState("");
  const [foodType, setFoodType] = useState(""); 
  const [recipes, setRecipes] = useState([]); 
  const [aiDessertPlan, setAiDessertPlan] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchSpoonacular = async () => {
    if (!ingredients.trim()) return;
    setIsLoading(true);
    setErrorMessage("");
    // NOTICE: setAiDessertPlan("") was removed so the AI plan stays on the screen
    
    try {
      const response = await fetch('http://localhost:5005/api/search-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, foodType })
      });
      const data = await response.json();
      
      if (data.status === "success" && data.recipes.length > 0) {
        setRecipes(data.recipes);
      } else {
        setErrorMessage("Spoonacular couldn't find a match, but try the AI Chef!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Connection error. Is Flask running?");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAiPlan = async () => {
    if (!ingredients.trim()) return;
    setIsLoading(true);
    setErrorMessage("");
    // NOTICE: setRecipes([]) was removed so the database recipes stay on the screen

    try {
      const response = await fetch('http://localhost:5005/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, foodType })
      });
      const data = await response.json();
      if (data.status === "success") setAiDessertPlan(data.plan);
    } catch (error) {
      console.error("AI error:", error);
      setErrorMessage("AI Chef connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW IMAGE FUNCTION ---
const getHeroImage = () => {
  // 1. If we have search results, show the first recipe's photo
  if (recipes.length > 0 && recipes.image) return recipes.image;

  // 2. Otherwise, match the dropdown (case-insensitive)
  const type = (foodType || "").toLowerCase();

  if (type.includes('main') || type.includes('course') || type.includes('ulam')) {
    return "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800"; // Juicy Steak
  }
  if (type.includes('dessert')) {
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"; // The Original Cake
  }
  if (type.includes('snack')) {
    return "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800"; // Snack Platter
  }
  if (type.includes('breakfast')) {
    return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800"; // Pancakes
  }

  // 3. Default image 
  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";
};

  return (
    <div className="app-wrapper">
      <header className="main-site-header">
        <div className="header-inner">
          <h1 className="header-logo-text">DISHcovery</h1>
        </div>
        <div className="header-scallop-divider"></div>
      </header>

<main className="content-wrapper">
        <section className="hero-container glass-effect">
          <div className="hero-content">
            <h2 className="hero-title">Delicious Moments, <br />Global Flavors.</h2>
            
            {errorMessage && <div className="error-msg" style={{ color: 'red', marginBottom: '10px' }}>⚠️ {errorMessage}</div>}

            <div className="hero-search-area">
              <div className="hero-search-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', border: 'none', background: 'transparent', padding: '0' }}>
                <input
                  type="text"
                  placeholder="e.g., mango, beef, chocolate..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '50px', border: '1px solid #ddd' }}
                />

                <select 
                  value={foodType} 
                  onChange={(e) => setFoodType(e.target.value)} 
                  className="type-select" 
                  style={{ padding: '10px', borderRadius: '50px', border: '1px solid #ddd' }}
                >
                  <option value="">Any Type 🎲</option>
                  <option value="dessert">Desserts 🍰</option>
                  <option value="main course">Main Course (Ulam) 🥘</option>
                  <option value="snack">Snack 🥨</option>
                  <option value="breakfast">Breakfast 🍳</option>
                </select>
                
                <button onClick={searchSpoonacular} disabled={isLoading} className="search-btn" style={{ padding: '10px 20px', borderRadius: '50px', background: '#ffd700', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isLoading ? "Searching..." : "🔍 Find Recipes"}
                </button>
                <button onClick={generateAiPlan} disabled={isLoading} className="ai-btn" style={{ padding: '10px 20px', borderRadius: '50px', background: '#ff69b4', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isLoading ? "Thinking..." : "✨ AI Chef Plan"}
                </button>
              </div>
            </div>

            {/* AI MEAL PLAN DISPLAY */}
            {aiDessertPlan && (
              <div className="recipe-bubble-container glass-effect" style={{ marginTop: '20px', padding: '25px', borderRadius: '20px', background: 'rgba(255,255,255,0.8)' }}>
                <h3 style={{ color: '#d81b60', marginBottom: '15px' }}>🪄 AI Custom 3-Day Plan</h3>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#444' }}>
                  {aiDessertPlan}
                </div>
              </div>
            )}
          </div>

          {/* THE HERO IMAGE */}
          <div className="hero-image-side">
            <div className="food-circle-main">
              <img 
                src={getHeroImage()} 
                alt="" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '50%',
                  display: 'block' 
                }} 
              />
            </div>
          </div>
        </section>

        {/* REAL RECIPES GRID FROM SPOONACULAR */}
        {recipes.length > 0 && (
          <div className="results-section">
            <h2 className="section-title">Verified Results</h2>
            <div className="dessert-display-grid">
              
              {/* Removed 'index' to make your linter happy! */}
              {recipes.map((recipe) => (
                
                <div key={recipe.id} className="dessert-card">
                  <div className="ornate-frame">
                    <img src={recipe.image} alt={recipe.title} />
                  </div>
                  
                  <div className="dessert-info">
                    <h3>{recipe.title}</h3>
                    <p>⏱️ {recipe.readyInMinutes} mins</p>
                    <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="view-link">
                      Full Recipe
                    </a>
                  </div>
                </div>
                
              ))}
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;