import { useState, useEffect } from 'react' // 1. Added these hooks
import axios from 'axios' // 2. Added Axios
import './App.css'

function App() {
  // 3. Create a state (memory) to hold our desserts
  const [desserts, setDesserts] = useState([]);

  // 4. The "Handshake": This runs as soon as the website opens
  useEffect(() => {
    axios.get('http://localhost:5000/api/desserts')
      .then(response => {
        setDesserts(response.data); // Store the desserts in our state
        console.log("Success! Data received:", response.data);
      })
      .catch(error => {
        console.error("The Python kitchen is closed!", error);
      });
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
        {/* 5. DYNAMIC DATA: This now counts your actual desserts! */}
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

      {/* 6. ELEC 2 Requirement: The Official Footer */}
      <footer className="project-footer">
        <p>Developed by BS Computer Engineering Students</p>
        <p>Bulacan State University</p>
        <p>2026</p>
      </footer>

    </div>
  )
}

export default App