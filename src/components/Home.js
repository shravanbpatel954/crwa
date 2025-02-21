import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        navigate('/auth');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="home dark-theme">
      {/* Decorative Divider */}
      <div className="nav-hero-divider"></div>

      {/* Hero Section */}
      <section className="hero-section">

        <div className="container">
          <div className="hero-content">
            <h1>Welcome, {username}</h1>
            <p>Your AI-powered Recycler system for innovative and sustainable solutions.</p>
            <button 
              className="dynamic-recycle-button"
              onClick={() => navigate('/models/RecyclerApp')}
            >
              Let's Recycle!
              <span className="button-icon">♻️</span>
            </button>
          </div>
        </div>
      </section>


      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <h2>What We Offer</h2>
          <p>At RecyclerApp, we believe in transforming waste into wonders. Our platform empowers you to recycle effectively, upcycle creatively, and learn sustainable practices that contribute to a cleaner planet.</p>
        </div>
      </section>

      {/* Recycling Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Recycle?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>🌍 Environmental Protection</h3>
              <p>Recycling reduces pollution, conserves natural resources, and decreases greenhouse gas emissions.</p>
            </div>
            <div className="benefit-card">
              <h3>💼 Economic Benefits</h3>
              <p>Recycling creates jobs, reduces waste management costs, and conserves energy in manufacturing.</p>
            </div>
            <div className="benefit-card">
              <h3>🏭 Resource Conservation</h3>
              <p>Recycling helps preserve raw materials and reduces the need for extracting new resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recycling Process Section */}
      <section className="process-section">
        <div className="container">
          <h2>How Recycling Works</h2>
          <div className="process-steps">
            <div className="step">
              <h3>1. Collection</h3>
              <p>Recyclable materials are collected from homes and businesses.</p>
            </div>
            <div className="step">
              <h3>2. Sorting</h3>
              <p>Materials are sorted by type at recycling facilities.</p>
            </div>
            <div className="step">
              <h3>3. Processing</h3>
              <p>Materials are cleaned and processed into raw materials.</p>
            </div>
            <div className="step">
              <h3>4. Manufacturing</h3>
              <p>Recycled materials are used to create new products.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CRWA. All rights reserved. Together, we recycle for a better tomorrow.</p>
      </footer>
    </div>
  );
};

export default Home;
