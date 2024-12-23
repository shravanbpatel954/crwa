// src/pages/Home.js
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
        // Extracting the user's display name or email
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        // If no user is logged in, redirect to the login page
        navigate('/auth');
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const advisorModels = [
    {
      id: 'legal',
      name: 'Legal Advisor',
      description: 'Get legal insights and support.',
      path: '/models/legal',
    },
    {
      id: 'financial',
      name: 'Financial Advisor',
      description: 'Manage your finances with expert advice.',
      path: '/models/financial',
    },
    {
      id: 'tech',
      name: 'Tech Advisor',
      description: 'Solve tech-related issues with ease.',
      path: '/models/tech',
    },
    {
      id: 'travel',
      name: 'Travel Advisor',
      description: 'Plan your trips with expert travel advice.',
      path: '/models/travel',
    },
    {
      id: 'health',
      name: 'Health Advisor',
      description: 'Stay healthy with personalized recommendations.',
      path: '/models/health',
    },
    {
      id: 'academic',
      name: 'Academic Advisor',
      description: 'Get guidance on academic goals and educational plans.',
      path: '/models/academic',
    },
    {
      id: 'career',
      name: 'Career Advisor',
      description: 'Plan your career and explore opportunities.',
      path: '/models/career',
    },
    {
      id: 'entertainment',
      name: 'Entertainment Advisor',
      description: 'Plan your entertainment activities and explore options.',
      path: '/models/entertainment',
    }    
  ];

  return (
    <div className="home dark-theme">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome, {username}</h1>
            <p>Your AI-powered advisor system for personalized recommendations and solutions.</p>
          </div>
        </div>
      </section>

      <section className="advisor-models">
        <div className="container">
          <h2>Select an Advisor Model</h2>
          <div className="models-grid">
            {advisorModels.map((model) => (
              <div key={model.id} className="advisor-card">
                <button
                  className="advisor-button"
                  onClick={() => navigate(model.path)}
                >
                  {model.name}
                </button>
                <p className="model-description">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 AIO. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
