import { useState } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import './Signup.css';

function App() {
  const [ingredients, setIngredients] = useState("");
  const [foodType, setFoodType] = useState(""); 
  const [recipes, setRecipes] = useState([]); 
  const [aiDessertPlan, setAiDessertPlan] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favoriteList, setFavoriteList] = useState([]); 
  const [showFavoritesView, setShowFavoritesView] = useState(false);

  const searchSpoonacular = async () => {
    if (!ingredients.trim()) return;
    setIsLoading(true);
    setErrorMessage("");
    
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

  // 1. SAVE FAVORITE FUNCTION
  const handleSaveFavorite = async (recipe) => {
    if (!currentUser) {
      alert("Please Login first to save favorites! ✨");
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          recipe_id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          source_url: recipe.sourceUrl
        })
      });

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Error saving favorite:", err);
    }
  };

  // 2. VIEW FAVORITES FUNCTION (Moved OUTSIDE handleSaveFavorite)
  const viewFavorites = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5005/api/favorites/${currentUser.id}`);
      const data = await response.json();
      if (data.status === "success") {
        setFavoriteList(data.favorites);
        setShowFavoritesView(true); // Switch to Favorites view!
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeroImage = () => {
    if (recipes.length > 0 && recipes.image) return recipes.image;
    const type = (foodType || "").toLowerCase();

    if (type.includes('main') || type.includes('course') || type.includes('ulam')) {
      return "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800";
    }
    if (type.includes('dessert')) {
      return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800";
    }
    if (type.includes('snack')) {
      return "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800";
    }
    if (type.includes('breakfast')) {
      return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800";
    }
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";
  };

  return (
    <div className="app-wrapper">
      <header className="main-site-header">
        <div className="header-inner">
          <h1 className="header-logo-text">DISHcovery</h1>
          
        {currentUser ? (
          <div className="user-profile" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#a3333d' }}>
              👨‍🍳 Welcome, {currentUser.username}!
            </span>
            <button className="login-btn" onClick={() => setShowFavoritesView(false)}>Home</button>
            <button className="signup-btn" onClick={viewFavorites}>My Favorites ❤️</button>
            <button className="login-btn" onClick={() => { setCurrentUser(null); setShowFavoritesView(false); }}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
            <button className="signup-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
          </div>
        )}
        </div>
        
        <div className="header-scallop-divider"></div>
      </header>

      <main className="content-wrapper">
        
        {/* VIEW 1: MY FAVORITES GALLERY */}
        {showFavoritesView ? (
          <div className="results-section">
            <h2 className="section-title">My Cookbook ❤️</h2>
            {favoriteList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>You haven't saved any recipes yet! Go back Home to search.</p>
            ) : (
              <div className="dessert-display-grid">
                {favoriteList.map((recipe) => (
                  <div key={recipe.id} className="dessert-card" style={{ position: 'relative' }}>
                    <div className="ornate-frame">
                      <img src={recipe.image} alt={recipe.title} />
                    </div>
                    <div className="dessert-info">
                      <h3>{recipe.title}</h3>
                      <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="view-link">
                        Full Recipe
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: THE NORMAL HOME PAGE (Notice the Ghost Tags wrapping everything!) */
          <>
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

                {aiDessertPlan && (
                  <div className="recipe-bubble-container glass-effect" style={{ marginTop: '20px', padding: '25px', borderRadius: '20px', background: 'rgba(255,255,255,0.8)' }}>
                    <h3 style={{ color: '#d81b60', marginBottom: '15px' }}>🪄 AI Custom 3-Day Plan</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#444' }}>
                      {aiDessertPlan}
                    </div>
                  </div>
                )}
              </div>

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

            {recipes.length > 0 && (
              <div className="results-section">
                <h2 className="section-title">Verified Results</h2>
                <div className="dessert-display-grid">
                  
                  {recipes.map((recipe) => (
                    
                    <div key={recipe.id} className="dessert-card" style={{ position: 'relative' }}>
                      <button 
                        className="heart-btn" 
                        onClick={() => handleSaveFavorite(recipe)}
                        title="Save to Favorites"
                      >
                        ❤️
                      </button>

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
          </>
        )}
      </main>

      {/* Modals for Signup and Login */}
      {showSignup && (
        <Signup 
          onClose={() => setShowSignup(false)} 
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={(userData) => setCurrentUser(userData)} 
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}
    </div>
  );
}

export default App;