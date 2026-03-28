import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      
      {/* Container 1: The Top Header */}
      <header className="floating-container header-container">
        <div className="logo-area">
          {/* <span className="logo-icon">🧁</span> */}
          <h1 className="logo-text">DISHcovery AI <span className="logo-sub">| Global Desserts</span></h1>
        </div>
        <div className="header-buttons">
          <button className="btn-outline">SIGN UP</button>
          <button className="btn-solid-primary">LOGIN</button>
        </div>
      </header>

      {/* Container 2: The Main Search Hero */}
      <section className="floating-container hero-container">
        <div className="hero-content">
          <h2 className="hero-title">✨ Satisfy your sweet tooth</h2>
          <p className="hero-subtitle">Discover authentic dessert recipes from patisseries and kitchens around the world.</p>
          
          <div className="search-bar-row">
            <input type="text" className="main-search-input" placeholder="matcha, dark chocolate, strawberries..." />
            <button className="btn-search">🍰 Find Desserts</button>
          </div>

          <div className="suggestion-tags">
            <span className="tag">🍫 Belgian Chocolate</span>
            <span className="tag">🍵 Japanese Mochi</span>
            <span className="tag">🍓 French Tarts</span>
            <span className="tag">🍮 Mexican Flan</span>
          </div>
        </div>

        <div className="hero-image-wrapper">
          {/* Global Dessert Showcase Image */}
          <div className="food-circle-placeholder"></div>
        </div>
      </section>

      {/* Container 3: The Filter Ribbon */}
      <section className="floating-container filter-container">
        <div className="recipe-count">🍨 You have 0 desserts to explore</div>
        <div className="filter-buttons">
          <button className="filter-btn active">ALL</button>
          <button className="filter-btn">CAKES</button>
          <button className="filter-btn">PASTRIES</button>
          <button className="filter-btn">FROZEN</button>
          <button className="filter-btn">TRADITIONAL</button>
          <button className="filter-btn">COOKIES</button>
        </div>
      </section>

    </div>
  )
}

export default App