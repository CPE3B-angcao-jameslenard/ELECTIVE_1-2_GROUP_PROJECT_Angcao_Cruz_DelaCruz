import React, { useState, useEffect } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import './Signup.css';
import dev1 from './assets/dev1.png';
import dev2 from './assets/dev2.jpg';
import dev3 from './assets/dev3.jpg';
import Swal from 'sweetalert2';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;
  const [ingredients, setIngredients] = useState("");
  const [foodType, setFoodType] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [aiDessertPlan, setAiDessertPlan] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [favoriteList, setFavoriteList] = useState([]);
  const [showFavoritesView, setShowFavoritesView] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID; 
  const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

  const [currentUser, setCurrentUser] = useState(() => {
  //Checks the "Save File" every time the page loads
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
});

  //PERSISTENCE LOGIC START
  //Load data from LocalStorage when the app first opens
  useEffect(() => {
    const savedSearch = localStorage.getItem('lastSearch');
    const savedAI = localStorage.getItem('lastAI');
    
    if (savedSearch) {
      const parsed = JSON.parse(savedSearch);
      if (parsed.length > 0) setRecipes(parsed);
    }
    // Updated to match this variable name: aiDessertPlan
    if (savedAI) setAiDessertPlan(savedAI);
  }, []);

  //Save data to LocalStorage whenever recipes or aiDessertPlan change
  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('lastSearch', JSON.stringify(recipes));
    }
    if (aiDessertPlan) {
      localStorage.setItem('lastAI', aiDessertPlan);
    }
  }, [recipes, aiDessertPlan]);
  //PERSISTENCE LOGIC END

  const goHome = () => {
    setActivePage("home");
    setShowFavoritesView(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goAboutUs = () => {
    setActivePage("about");
    setShowFavoritesView(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goAcknowledgement = () => {
    setActivePage("acknowledgement");
    setShowFavoritesView(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFooter = () => {
    setMenuOpen(false);
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const searchAllRecipes = async () => {
    if (!ingredients.trim()) return;
    setIsSearching(true);
    setErrorMessage("");
    setCurrentPage(1); //Resets to page 1 on new search

    try {
      //Fetch from the Render Backend (Spoonacular)
      const spoonPromise = fetch('https://elective-1-2-group-project-angcao-cruz.onrender.com/api/search-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, foodType })
      }).then(res => res.json());

      //Fetch from Edamam (V2 Endpoint)
      const edamamPromise = fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${ingredients}&app_id=${APP_ID}&app_key=${APP_KEY}`
      ).then(res => res.json());

      //Run both
      const [spoonData, edamamData] = await Promise.all([spoonPromise, edamamPromise]);

      //Format Edamam results to match the card style
      const formattedEdamam = edamamData.hits?.map(hit => ({
        id: hit.recipe.uri,
        title: hit.recipe.label,
        image: hit.recipe.image,
        sourceUrl: hit.recipe.url,
        readyInMinutes: hit.recipe.totalTime > 0 ? hit.recipe.totalTime : "30",
        calories: Math.round(hit.recipe.calories),
        protein: Math.round(hit.recipe.totalNutrients?.PROCNT?.quantity || 0),
        fat: Math.round(hit.recipe.totalNutrients?.FAT?.quantity || 0),
        carbs: Math.round(hit.recipe.totalNutrients?.CHOCDF?.quantity || 0)
      })) || [];

      //Combine them (Spoonacular first, then Edamam)
      const combined = [...(spoonData.recipes || []), ...formattedEdamam];
      
      if (combined.length === 0) {
        setErrorMessage("No recipes found in either database.");
      } else {
        setRecipes(combined);
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Error connecting to recipe sources.");
    } finally {
      setIsSearching(false);
    }
  };

  const generateAiPlan = async () => {
    if (!ingredients.trim()) return;
    setIsThinking(true);
    setErrorMessage("");

    try {
      const response = await fetch('https://elective-1-2-group-project-angcao-cruz.onrender.com/api/generate-meal-plan', {
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
      setIsThinking(false);
    }
  };

  const handleSaveFavorite = async (recipe) => {
    if (!currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login first to save favorites! ✨',
        icon: 'warning',
        confirmButtonColor: '#4A5D23' 
      });
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch('https://elective-1-2-group-project-angcao-cruz.onrender.com/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id, 
          recipe_id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          sourceUrl: recipe.sourceUrl,
          readyInMinutes: recipe.readyInMinutes,
          calories: recipe.calories,
          protein: recipe.protein,
          fat: recipe.fat,
          carbs: recipe.carbs
        })
      });

      const data = await response.json();  
      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonColor: '#4A5D23'
      });
    } catch (err) {
      console.error("Error saving favorite:", err);
    }
  };

const handleRemoveFavorite = async (favId) => {
    try {
      const response = await fetch(`https://elective-1-2-group-project-angcao-cruz.onrender.com/api/favorites/${favId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavoriteList(favoriteList.filter(recipe => recipe.id !== favId));
        Swal.fire({
          title: 'Removed!',
          text: 'Recipe has been deleted from your cookbook.',
          icon: 'success',
          confirmButtonColor: '#4A5D23'
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

const handleClearCookbook = async () => {
  const result = await Swal.fire({
    title: 'Empty your Cookbook?',
    text: "This will delete ALL saved recipes forever!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    confirmButtonText: 'Yes, clear it all!'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`https://elective-1-2-group-project-angcao-cruz.onrender.com/api/favorites/clear/${currentUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavoriteList([]); // Clears the screen instantly
        Swal.fire('Cleared!', 'Your cookbook is empty.', 'success');
      }
    } catch (err) {
      console.error("Clear error:", err);
    }
  }
};

const viewFavorites = async () => {
    if (!currentUser) return;
    setIsFavoritesLoading(true); //START the favorites loader

    try {
      const response = await fetch(`https://elective-1-2-group-project-angcao-cruz.onrender.com/api/favorites/${currentUser.id}`);
      const data = await response.json();
      if (data.status === "success") {
        setFavoriteList(data.favorites);
        setShowFavoritesView(true);
        setActivePage("home");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    } finally {
      setIsFavoritesLoading(false); //halts the favorites loader
    }
  };

  const getHeroImage = () => {
    if (recipes.length > 0 && recipes[0]?.image) return recipes[0].image;
    const type = (foodType || "").toLowerCase();

    if (type.includes('main') || type.includes('course') || type.includes('ulam')) {
      return "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200";
    }
    if (type.includes('dessert')) {
      return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200";
    }
    if (type.includes('snack')) {
      return "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=1200";
    }
    if (type.includes('breakfast')) {
      return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200";
    }
    return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200";
  };

  const AboutUsPage = () => (
    <section className="page-card glass-card">
      <div className="section-heading">
        <p className="eyebrow">About Us</p>
        <h2 className="section-title">Meet the Developers</h2>
      </div>

      <div className="bubble-grid">
        <article className="bubble-card">
          <div className="bubble-avatar">
            <img src={dev1} alt="Developer 1" />
          </div>
          <h3>Ashley Mae D. Cruz</h3>
          <p>Frontend designer focused on creating clean, responsive, and user-friendly interfaces for every device.</p>
        </article>

        <article className="bubble-card">
          <div className="bubble-avatar">
            <img src={dev2} alt="Developer 2" />
          </div>
          <h3>James Lenard M. Angcao</h3>
          <p>Backend developer responsible for API logic, data handling, and smooth integration with the recipe services.</p>
        </article>

        <article className="bubble-card">
          <div className="bubble-avatar">
            <img src={dev3} alt="Developer 3" />
          </div>
          <h3>Josephine B. Dela Cruz</h3>
          <p>Full-stack contributor who helped shape the app structure, menu flow, and overall recipe experience.</p>
        </article>
      </div>
    </section>
  );

  const AcknowledgementPage = () => (
    <section className="page-card glass-card">
      <div className="section-heading">
        <p className="eyebrow">Acknowledgement</p>
        <h2 className="section-title">For the Person Checking This Project</h2>
      </div>

      <div className="ack-box">
        <p>Thank you for taking the time to check this project. Your feedback, guidance, and support are appreciated.</p>
        <p>This project was created with care to provide a pleasant recipe-searching experience with responsive design, simple navigation, and a modern layout.</p>
        <p className="ack-signature">Respectfully submitted by the DISHcovery development team.</p>
      </div>
    </section>
  );

  //Pagination Math
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  return (
    <div className="app-wrapper">
      <header className="main-site-header">
        <div className="top-bar">
          <div className="brand-block">
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="side-menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <button className="brand-title-btn" onClick={goHome} aria-label="Go to home">
              <h1 className="header-logo-text">DISHcovery</h1>
            </button>
          </div>

          <div className={`side-menu ${menuOpen ? 'open' : ''}`} id="side-menu">
            <button onClick={goHome} className="side-menu-link">Home</button>
            <button onClick={scrollToFooter} className="side-menu-link">Footer</button>
          </div>

          <div className="header-actions">
            {currentUser ? (
              <>
                <span className="welcome-text">👨‍🍳 Welcome, {currentUser.username}!</span>
                <button className="header-link-btn" onClick={goHome}>Home</button>
                <button className="header-primary-btn" onClick={viewFavorites}>My Favorites ❤️</button>
                
                <button className="header-link-btn" onClick={() => { 
                  setCurrentUser(null); 
                  setShowFavoritesView(false); 
                  //Deletes the "Save File" so the next user isn't logged in as you
                  localStorage.removeItem('user'); 
                }}>Logout</button>
              </>
            ) : (
              <>
                <button className="header-link-btn" onClick={() => setShowLogin(true)}>Login</button>
                <button className="header-primary-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="content-wrapper" id="home">
        {activePage === "about" ? (
          <AboutUsPage />
        ) : activePage === "acknowledgement" ? (
          <AcknowledgementPage />
        ) : showFavoritesView ? (
          <section className="favorites-panel glass-card">
            <div className="section-heading">
              <p className="eyebrow">Saved Collection</p>
              <h2 className="section-title">My Cookbook</h2>
            </div>

            {favoriteList.length > 0 && (
              <button 
                onClick={handleClearCookbook}
                style={{ 
                  marginBottom: '20px', 
                  backgroundColor: '#f8d7da', 
                  color: '#721c24', 
                  border: '1px solid #f5c6cb', 
                  padding: '10px 15px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%' 
                }}
              >
                🧹 Clear Entire Cookbook
              </button>
            )}

            {favoriteList.length === 0 ? (
              <p className="empty-state">You haven't saved any recipes yet. Go back home to search.</p>
            ) : (
              <div className="recipe-grid favorites-grid">
                {favoriteList.map((recipe) => (
                  <article key={recipe.id} className="recipe-card">
                    <div className="recipe-image-wrap">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://placehold.co/600x400?text=View+Recipe+for+Details'; 
                        }} 
                      />
                    </div>
                      <div className="recipe-body">
                        <p className="recipe-meta">
                          {/* Only show time if it exists, otherwise default to 30 */}
                          ⏱️ {recipe.readyInMinutes || "30"} mins 
                          {/* ONLY show the calorie icon if there is a number */}
                          {recipe.calories > 0 && ` | 🔥 ${recipe.calories} kcal`}
                        </p>

                        <h3>{recipe.title}</h3>

                        <div className="nutrition-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {/* Only show these if the data is NOT null */}
                          {recipe.protein > 0 && <span className="nutrition-tag">{recipe.protein}g Protein</span>}
                          {recipe.fat > 0 && <span className="nutrition-tag">{recipe.fat}g Fat</span>}
                          {recipe.carbs > 0 && <span className="nutrition-tag">{recipe.carbs}g Carbs</span>}
                        </div>

                        <button 
                          onClick={() => handleRemoveFavorite(recipe.id)} 
                          style={{ 
                            marginTop: '15px', 
                            color: '#d9534f', 
                            background: 'none', 
                            border: '1px solid #d9534f', 
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'block',
                            width: '100%'
                          }}
                        >
                          🗑️ Remove from Cookbook
                        </button>
                        
                        <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="view-link" style={{ fontWeight: 'bold', display: 'block' }}>
                          Full Recipe
                        </a>
                      </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="hero-section glass-card">
              <div className="hero-copy">
                <p className="hero-badge">Engineered for taste. Designed for discovery.</p>
                <h2 className="hero-title">Discover flavor in every dish.</h2>
                <p className="hero-subtitle">
                  Search recipes, discover new dishes, and save your favorites in a stylish recipe experience.
                </p>

                <div className="search-panel" id="search">
                  <input
                    type="text"
                    placeholder="e.g., mango, beef, chocolate..."
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />

                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="type-select"
                  >
                    <option value="">Any Type</option>
                    <option value="dessert">Desserts</option>
                    <option value="main course">Main Course (Ulam)</option>
                    <option value="snack">Snack</option>
                    <option value="breakfast">Breakfast</option>
                  </select>

                  <div className="action-row">
                    <button 
                      onClick={searchAllRecipes} 
                      disabled={isSearching || isThinking} 
                      className="search-btn"
                    >
                      {isSearching ? "Searching..." : "Find Recipes"}
                    </button>
                    
                    <button 
                      onClick={generateAiPlan} 
                      disabled={isSearching || isThinking} 
                      className="ai-btn"
                    >
                      {isThinking ? "Thinking..." : "AI Chef Plan"}
                    </button>

                    {/* Show the spinner if EITHER of them are loading */}
                    {(isSearching || isThinking || isFavoritesLoading) && <div className="loader-small"></div>}
                  </div>
                </div>

                
                {errorMessage && <div className="error-msg">⚠️ {errorMessage}</div>}

                {aiDessertPlan && (
                  <div className="ai-box">
                    <h3>🪄 AI Custom 3-Day Plan</h3>
                    <div className="ai-text">{aiDessertPlan}</div>
                  </div>
                )}
              </div>

              <div className="hero-visual">
                <div className="hero-photo-frame">
                  <img src={getHeroImage()} alt="" />
                </div>
              </div>
            </section>

            {recipes.length > 0 && (
              <section className="results-section glass-card" id="recipes">
                <div className="section-heading">
                  <p className="eyebrow">Fresh picks</p>
                  <h2 className="section-title">Delicious Dishes</h2>
                </div>

                <div className="recipe-grid">
                  {/*Use currentRecipes instead of recipes*/}
                  {currentRecipes.map((recipe) => (
                    <article key={recipe.id} className="recipe-card">
                      <button className="heart-btn" onClick={() => handleSaveFavorite(recipe)} title="Save to Favorites">
                        ❤️
                      </button>
                      <div className="recipe-image-wrap">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Recipe+Image'; }}
                        />
                      </div>
                      <div className="recipe-body">
                        <p className="recipe-meta">
                          ⏱️ {recipe.readyInMinutes} mins | 🔥 {recipe.calories} kcal
                        </p>
                        
                        <h3>{recipe.title}</h3>

                        <div className="nutrition-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {recipe.protein > 0 && <span className="nutrition-tag">{recipe.protein}g Protein</span>}
                          {recipe.fat > 0 && <span className="nutrition-tag">{recipe.fat}g Fat</span>}
                          {recipe.carbs > 0 && <span className="nutrition-tag">{recipe.carbs}g Carbs</span>}
                        </div>
                        
                        <div style={{ marginTop: 'auto' }}>
                          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="view-link" style={{ fontWeight: 'bold', display: 'block' }}>
                            Full Recipe
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/*Add the Pagination Buttons below the grid*/}
                {recipes.length > recipesPerPage && (
                  <div className="pagination-bar">
                    {/* PREV BUTTON */}
                    <button 
                      disabled={currentPage === 1} 
                      onClick={() => {
                        setCurrentPage(prev => prev - 1); 
                        // The setTimeout forces the browser to wait a tiny fraction of a second
                        setTimeout(() => {
                          document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="page-btn"
                    >
                      Prev
                    </button>

                    <span className="page-info">Page {currentPage} of {totalPages}</span>

                    {/* NEXT BUTTON */}
                    <button 
                      disabled={currentPage === totalPages} 
                      onClick={() => {
                        setCurrentPage(prev => prev + 1); 
                        setTimeout(() => {
                          document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="page-btn"
                    >
                      Next
                    </button>
                  </div>
                )}

              </section>
            )}
          </>
        )}
      </main>

      <footer className="site-footer" id="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>DISHcovery</h3>
            <p>Find recipes, save favorites, and discover meals that fit your taste, all in one cozy recipe experience.</p>
          </div>

          <div className="footer-links">
            <h4>Navigate</h4>
            <button onClick={goAboutUs}>About Us</button>
            <button onClick={goAcknowledgement}>Acknowledgement</button>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📍 Malolos City, Bulacan, Central Luzon, PH</p>
            <p>✉️ support@dishcovery.app</p>
            <p>☎️ +63 992 368 9747</p>
          </div>
        </div>

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
          onLoginSuccess={(userData) => {
            setCurrentUser(userData);
            //Creates the "Save File" in the browser
            localStorage.setItem('user', JSON.stringify(userData));
          }}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

       <div className="footer-bottom">
          <div className="academic-credits">
            <p>Developed by BS Computer Engineering Students</p>
            <p><strong>Bulacan State University</strong></p>
          </div>
          <p>© 2026 DISHcovery. All rights reserved.</p>
        </div>
      </footer>
    </div> 
  );
}

export default App;
