import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [desserts, setDesserts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/desserts')
      .then(response => response.json())
      .then(data => setDesserts(data))
      .catch(error => console.error("Kitchen connection error:", error));
  }, []);

  return (
    <div className="app-wrapper">

      <header className="main-site-header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="header-logo-text">DISHcovery</h1>
          </div>
          <div className="header-right">
            <div className="header-search-capsule">
              <input type="text" placeholder="Search" className="header-search-field" />
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
            <div className="hero-search-area">
              <div className="hero-search-bar">
                <input type="text" placeholder="Search macarons..." />
                <button>Search</button>
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
          <div className="recipe-count">🍨 {desserts.length || 3} Delights Found</div>
          <div className="filter-buttons">
            <button className="filter-btn active">ALL</button>
            <button className="filter-btn">CAKES</button>
            <button className="filter-btn">PASTRIES</button>
            <button className="filter-btn">FROZEN</button>
          </div>
        </section>

        <section className="dessert-bubble-container glass-effect">
          <div className="dessert-display-grid">
            {desserts.length > 0 ? (
              desserts.map((item, index) => (
                <div key={index} className={`dessert-card ${index % 2 !== 0 ? 'card-mid-right' : 'card-top-left'}`}>
                  <div className="ornate-frame"><div className="frame-inner"><img src={item.image} alt={item.name} /></div></div>
                  <div className="dessert-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="dessert-card card-top-left">
                  <div className="ornate-frame"><div className="frame-inner"><img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" alt="Rose Cake" /></div></div>
                  <div className="dessert-info">
                    <h3>Rose Petal Cake</h3>
                    <p>Infused with organic rosewater and topped with candied petals.</p>
                  </div>
                </div>
                <div className="dessert-card card-mid-right">
                  <div className="ornate-frame"><div className="frame-inner"><img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500" alt="Berry Swirls" /></div></div>
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
