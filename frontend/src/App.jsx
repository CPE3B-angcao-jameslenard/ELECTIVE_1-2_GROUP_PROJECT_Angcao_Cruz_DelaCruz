import { useState } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import './Signup.css';
import dev1 from './assets/dev1.png';
import dev2 from './assets/dev2.jpg';
import dev3 from './assets/dev3.jpg';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");

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

  const viewFavorites = async () => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5005/api/favorites/${currentUser.id}`);
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
      setIsLoading(false);
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
                <button className="header-link-btn" onClick={() => { setCurrentUser(null); setShowFavoritesView(false); }}>Logout</button>
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

            {favoriteList.length === 0 ? (
              <p className="empty-state">You haven't saved any recipes yet. Go back home to search.</p>
            ) : (
              <div className="recipe-grid favorites-grid">
                {favoriteList.map((recipe) => (
                  <article key={recipe.id} className="recipe-card">
                    <div className="recipe-image-wrap">
                      <img src={recipe.image} alt={recipe.title} />
                    </div>
                    <div className="recipe-body">
                      <h3>{recipe.title}</h3>
                      <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="view-link">Full Recipe</a>
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
                    <button onClick={searchSpoonacular} disabled={isLoading} className="search-btn">
                      {isLoading ? "Searching..." : "Find Recipes"}
                    </button>
                    <button onClick={generateAiPlan} disabled={isLoading} className="ai-btn">
                      {isLoading ? "Thinking..." : "AI Chef Plan"}
                    </button>
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
                  {recipes.map((recipe) => (
                    <article key={recipe.id} className="recipe-card">
                      <button className="heart-btn" onClick={() => handleSaveFavorite(recipe)} title="Save to Favorites">
                        ❤️
                      </button>
                      <div className="recipe-image-wrap">
                        <img src={recipe.image} alt={recipe.title} />
                      </div>
                      <div className="recipe-body">
                        <p className="recipe-meta">⏱️ {recipe.readyInMinutes} mins</p>
                        <h3>{recipe.title}</h3>
                        <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="view-link">Full Recipe</a>
                      </div>
                    </article>
                  ))}
                </div>
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

        <div className="footer-bottom">
          <p>© 2026 DISHcovery. All rights reserved.</p>
        </div>
      </footer>

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
