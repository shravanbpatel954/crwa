// Navbar.js
import React, { useState } from 'react';
import './Navbar.css';
import logo from './assets/logo.png';

const Navbar = ({ openAuthModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('no-scroll', !isOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo" onClick={() => scrollToSection('home')}>
            <img src={logo} alt="Logo" className="logo-image" />
          </a>
          <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => scrollToSection('home')} className="nav-link">Home</a>
            <a href="#about" onClick={() => scrollToSection('about')} className="nav-link">About</a>
            <a href="#features" onClick={() => scrollToSection('features-section')} className="nav-link"></a>
            <button onClick={() => openAuthModal('signin')} className="nav-button outline">Sign In</button>
          </div>
          <div className="nav-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;