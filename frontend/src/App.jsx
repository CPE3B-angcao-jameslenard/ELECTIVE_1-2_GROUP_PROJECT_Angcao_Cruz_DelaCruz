import { useState, useEffect } from 'react' // We import the 'brain' tools here
import './App.css'

function App() {
  // 1. The Memory: This holds the data from the backend
  const [desserts, setDesserts] = useState([]);

  // 2. The Bridge: This fetches the data when the website opens
  useEffect(() => {
    fetch('http://localhost:5000/api/desserts')
      .then(response => response.json()) 
      .then(data => setDesserts(data))   
      .catch(error => console.error("Could not reach the kitchen!", error));
  }, []); 

  return (
    <div className="app-wrapper">
      
      <header className="floating-container header-container">
        <div className="logo-area">
          <h1 className="logo-text">DISHcovery AI <span className="logo-sub">| Global Desserts</span></h1>
        </div>
        <div className="header-buttons">
          <button className="btn-outline">SIGN UP</button>
          <button className="btn-solid-primary">LOGIN</button>
        </div>
      </header>

      <section className="floating-container hero-container">
        <div className="hero-content">
          <h2 className="hero-title">✨ Satisfy your sweet tooth</h2>
          <p className="hero-subtitle">Discover authentic dessert recipes from patisseries and kitchens around the world.</p>
          
          <div className="search-bar-row">
            <input type="text" className="main-search-input" placeholder="matcha, dark chocolate, strawberries..." />
            <button className="btn-search">🍰 Find Desserts</button>
          </div>

          <div className="suggestion-tags">
            {/* 3. The Display: We loop through the backend data and print it here */}
            {desserts.length > 0 ? (
              desserts.map(dessert => (
                <span key={dessert.id} className="tag">
                  📍 {dessert.name} ({dessert.origin})
                </span>
              ))
            ) : (
              <span className="tag">Loading kitchen data...</span>
            )}
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="food-circle-placeholder"></div>
        </div>
      </section>

      <section className="floating-container filter-container">
        {/* 4. The Counter: This automatically counts how many items are in the database */}
        <div className="recipe-count">🍨 You have {desserts.length} desserts to explore</div>
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