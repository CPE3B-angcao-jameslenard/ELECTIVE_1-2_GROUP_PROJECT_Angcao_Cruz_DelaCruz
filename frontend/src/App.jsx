import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [desserts, setDesserts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipeResult, setRecipeResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDesserts, setFilteredDesserts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5005/api/desserts')
      .then(response => response.json())
      .then(data => {
        setDesserts(data);
        setFilteredDesserts(data);
      })
      .catch(error => console.error("Kitchen connection error:", error));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDesserts(desserts);
    } else {
      const filtered = desserts.filter(dessert => {
        const name = dessert?.name || '';
        const description = dessert?.description || '';
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredDesserts(filtered);
    }
  }, [searchQuery, desserts]);

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setRecipeResult(null);

    try {
      const response = await fetch('http://localhost:5005/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          instructions:
            "ALWAYS return COMPLETE recipe with: recipeName, prepTime, difficulty, ingredients array, instructions array with 5-8 detailed steps. Format as JSON only."
        })
      });

      const data = await response.json();
      console.log("AI Kitchen Output:", data);

      const recipe = {
        recipeName: data.recipe?.recipeName || `${ingredients} Delight`,
        prepTime: data.recipe?.prepTime || "25-35 mins",
        difficulty: data.recipe?.difficulty || "⭐⭐⭐",
        ingredients: Array.isArray(data.recipe?.ingredients)
          ? data.recipe.ingredients
          : [ingredients],
        instructions: Array.isArray(data.recipe?.instructions)
          ? data.recipe.instructions
          : [
              "Combine all ingredients in a bowl",
              "Mix until smooth consistency",
              "Pour into prepared pan",
              "Bake at 180°C for 25 minutes",
              "Cool and serve chilled!"
            ]
      };

      setRecipeResult(recipe);
    } catch (error) {
      console.error("The kitchen is closed!", error);

      setRecipeResult({
        recipeName: `${ingredients} Special`,
        prepTime: "30 mins",
        difficulty: "⭐⭐",
        ingredients: ingredients.split(',').map(i => i.trim()),
        instructions: [
          `Prepare your ${ingredients} ingredients`,
          "Mix all ingredients thoroughly in a large bowl",
          "Shape or pour into desired form",
          "Chill or bake according to texture (20-30 mins)",
          "Garnish and serve with love! 💕"
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="main-site-header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="header-logo-text">DISHcovery</h1>
          </div>
          <div className="header-right">
            <div className="header-search-capsule">
              <input
                type="text"
                placeholder="Search mango graham..."
                className="header-search-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="header-search-submit">🔍</button>
            </div>
            <button className="header-login-btn">Login/Signup</button>
          </div>
        </div>
        <div className="header-scallop-divider"></div>
      </header>

      <main className="content-wrapper">
        <section className="hero-container glass-effect">
          <div className="hero-content">
            <h2 className="hero-title">Sweet Moments, <br />Global Flavors.</h2>
            <p className="hero-subtitle">Explore the world's finest patisseries from your screen.</p>

            {recipeResult && (
              <div
                className="recipe-bubble-container glass-effect"
                style={{
                  margin: '30px 0',
                  padding: '30px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 215, 0, 0.15)',
                    borderRadius: '50%',
                    zIndex: 0
                  }}
                ></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px'
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}
                    >
                      👩‍🍳
                    </div>
                    <h3 style={{ margin: 0, color: '#ffd700', fontSize: '1.5rem' }}>Chef's Special</h3>
                  </div>

                  {recipeResult.recipeName && (
                    <div
                      style={{
                        marginBottom: '20px',
                        padding: '15px',
                        background: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: '12px',
                        borderLeft: '4px solid #ffd700'
                      }}
                    >
                      <strong style={{ fontSize: '1.4rem', color: 'black' }}>🍰 {recipeResult.recipeName}</strong>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      fontSize: '0.95rem'
                    }}
                  >
                    {recipeResult.prepTime && (
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        ⏱️ {recipeResult.prepTime}
                      </div>
                    )}
                    {recipeResult.difficulty && (
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        ⭐ {recipeResult.difficulty}
                      </div>
                    )}
                  </div>

                  {recipeResult.ingredients && (
                    <div style={{ marginBottom: '20px' }}>
                      <div
                        style={{
                          color: '#ffd700',
                          fontWeight: 'bold',
                          marginBottom: '12px',
                          fontSize: '1.1rem'
                        }}
                      >
                        🥭 Ingredients
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '10px'
                        }}
                      >
                        {Array.isArray(recipeResult.ingredients) ? (
                          recipeResult.ingredients.map((ing, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                borderLeft: '3px solid #ffd700',
                                fontSize: '0.95rem'
                              }}
                            >
                              {ing}
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              background: 'rgba(255,255,255,0.1)',
                              padding: '12px 16px',
                              borderRadius: '10px',
                              borderLeft: '3px solid #ffd700'
                            }}
                          >
                            {recipeResult.ingredients}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {recipeResult.instructions && (
                    <div>
                      <div
                        style={{
                          color: '#ffd700',
                          fontWeight: 'bold',
                          marginBottom: '15px',
                          fontSize: '1.1rem'
                        }}
                      >
                        📋 Instructions
                      </div>
                    {Array.isArray(recipeResult.instructions) ? (
  <div
    style={{
      display: 'grid',
      gap: '14px'
    }}
  >
    {recipeResult.instructions.map((step, idx) => (
      <div
        key={idx}
        style={{
          padding: '18px 20px',
          background: 'rgba(255, 255, 255, 0.14)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: '#ffd700',
            marginBottom: '8px',
            fontSize: '1rem'
          }}
        >
          Step {idx + 1}
        </div>
        <div style={{ lineHeight: '1.6', color: 'black' }}>{step}</div>
      </div>
    ))}
  </div>
) : (
  <div
    style={{
      padding: '18px 20px',
      background: 'rgba(255, 255, 255, 0.14)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 215, 0, 0.35)',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(10px)'
    }}
  >
    {recipeResult.instructions}
  </div>

                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="hero-search-area">
              <div className="hero-search-bar">
                <input
                  type="text"
                  placeholder="Enter ingredients (e.g., mango and graham)"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
                <button onClick={generateRecipe} disabled={isLoading || !ingredients.trim()}>
                  {isLoading ? "Baking..." : "Generate Recipe"}
                </button>
              </div>

              <div className="suggestion-tags">
                <span className="tag">✨ Matcha Mille Crepe</span>
                <span className="tag">✨ Tiramisu</span>
                <span className="tag">✨ Chocolate Cake</span>
              </div>
            </div>
          </div>

          <div className="hero-image-side">
            <div className="food-circle-main"></div>
            <div className="accent-blob"></div>
          </div>
        </section>

        <section className="filter-bar glass-effect">
          <div className="recipe-count">🍨 {filteredDesserts.length || 0} Delights Found</div>
          <div className="filter-buttons">
            <button className="filter-btn active">ALL</button>
            <button className="filter-btn">CAKES</button>
            <button className="filter-btn">PASTRIES</button>
            <button className="filter-btn">FROZEN</button>
          </div>
        </section>

        <section className="dessert-bubble-container glass-effect">
          <div className="dessert-display-grid">
            {filteredDesserts.length > 0 ? (
              filteredDesserts.map((item, index) => (
                <div key={item?.id || index} className={`dessert-card ${index % 2 !== 0 ? 'card-mid-right' : 'card-top-left'}`}>
                  <div className="ornate-frame">
                    <div className="frame-inner">
                      <img
                        src={item?.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={item?.name || 'Dessert'}
                      />
                    </div>
                  </div>
                  <div className="dessert-info">
                    <h3>{item?.name || 'Unnamed Dessert'}</h3>
                    <p>{item?.description || 'No description available'}</p>
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div
                className="no-results-card"
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px',
                  color: 'white'
                }}
              >
                <h3>🥭 No recipes found for "{searchQuery}"</h3>
                <p>Try our AI recipe generator above with those ingredients!</p>
              </div>
            ) : (
              <>
                <div className="dessert-card card-top-left">
                  <div className="ornate-frame">
                    <div className="frame-inner">
                      <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" alt="Rose Cake" />
                    </div>
                  </div>
                  <div className="dessert-info">
                    <h3>Rose Petal Cake</h3>
                    <p>Infused with organic rosewater and topped with candied petals.</p>
                  </div>
                </div>

                <div className="dessert-card card-mid-right">
                  <div className="ornate-frame">
                    <div className="frame-inner">
                      <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500" alt="Berry Swirls" />
                    </div>
                  </div>
                  <div className="dessert-info">
                    <h3>Berry Swirls</h3>
                    <p>Gently folded layers of pastry with a signature berry glaze.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer-scallop">
        <div className="footer-content-inner">
          <div className="footer-social-row">
            <a href="#" className="social-icon-square">FB</a>
            <a href="#" className="social-icon-square">PN</a>
            <a href="#" className="social-icon-square">TW</a>
            <a href="#" className="social-icon-square">IG</a>
          </div>
          <nav className="footer-nav-row">
            <a href="/">Home</a> <span>/</span>
            <a href="/about">About Us</a> <span>/</span>
            <a href="/menu">Menu</a> <span>/</span>
            <a href="/blog">Blog</a> <span>/</span>
            <a href="/contact">Contact</a> <span>/</span>
            <a href="/policy">Return Policy</a>
          </nav>
          <div className="footer-copyright-row">Copyright © All Right Reserved</div>
          <p className="footer-tagline-text">Find your sweet discovery today!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
