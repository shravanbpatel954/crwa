import React, { useState } from 'react';
import './BodySection.css';


import { FaInstagram, FaWhatsapp, FaLinkedin, FaGithub } from 'react-icons/fa';

import { signInWithGoogle } from './firebase';
import img1 from './assets/img1.gif'; 

import { useNavigate } from 'react-router-dom'; 
import heroGif from "./assets/hero.gif";

const BodySection = ({ openAuthModal }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const navigate = useNavigate(); 
  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = '+918104479942'; 
    const message = `Name: ${contactForm.name}\nEmail: ${contactForm.email}\nMessage: ${contactForm.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
    setContactForm({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <section
      className="hero-section"
      style={{
        background: `url(${heroGif}) center/cover no-repeat`,
        color: "white",
        padding: "80px 20px",
        textAlign: "center",
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Overlay for better text visibility */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
      ></div>

      <div
        className="container"
        style={{
          maxWidth: "1200px",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div
          className="hero-content"
          style={{
            marginBottom: "40px",
          }}
        >
          <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            color: "#ff4444",
            marginBottom: "20px",
            textShadow: "2px 2px 10px rgba(255, 0, 0, 0.5)",
          }}


          >
            Transform Waste into Wonders ✨
          </h1>
          <p
          style={{
            fontSize: "1.3rem",
            color: "#f8f8f8",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}


          >
            Discover innovative recycling solutions with "AI-powered ideas".  
            Turn old materials into "creative masterpieces"!
          </p>
          <button
            onClick={() => openAuthModal("signin")}
          style={{
            padding: "14px 28px",
            fontSize: "1.2rem",
            color: "black",
            backgroundColor: "#ff4444",
            border: "2px solid #ff4444",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s, transform 0.2s",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(255, 68, 68, 0.5)",
          }}


            onMouseOver={(e) => {
              e.target.style.backgroundColor = "black";
              e.target.style.color = "#ff4444";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ff4444";
              e.target.style.color = "black";
              e.target.style.transform = "scale(1)";
            }}
          >
            Get Started 🚀
          </button>
        </div>

        {/* Carousel / Showcase */}
        <div
          className="hero-carousel"
          style={{
            height: "220px",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            border: "2px solid #ff4444",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30px",
            boxShadow: "0 4px 10px rgba(255, 0, 0, 0.3)",
          }}


        >
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '10px'
          }}>
            <img 
              src={img1} 
              alt="Upcycled Creations" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}



            />
            <p style={{ 
              position: 'absolute',
              color: "white", 
              fontSize: "1.3rem", 
              fontWeight: "500",
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '8px 16px',
              borderRadius: '8px'
            }}>

              🌱 Showcasing Upcycled Creations...
            </p>
          </div>


        </div>
      </div>
    </section>



      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">


            <div className="feature-item">
              <h3>AI-Powered Analysis</h3>
              <p>Leverage AI to analyze raw materials and generate innovative ideas for new products.</p>
            </div>
            <div className="feature-item">
              <h3>Step-by-Step Guidance</h3>
              <p>Get detailed steps to transform waste into useful, creative items.</p>
            </div>
            <div className="feature-item">
              <h3>Visual Inspiration</h3>
              <p>See a preview of the final product to inspire your creativity.</p>
            </div>
            <div className="feature-item">
              <h3>Eco-Friendly Solutions</h3>
              <p>Contribute to sustainability by reducing waste and reusing materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">


            <div className="step-item">
              <h3>Step 1: Provide Raw Data</h3>
              <p>Upload details or an image of your raw material.</p>
            </div>
            <div className="step-item">
              <h3>Step 2: AI Analysis</h3>
              <p>Our AI processes the data and researches possible products.</p>
            </div>
            <div className="step-item">
              <h3>Step 3: Get Suggestions</h3>
              <p>Receive a list of product ideas with detailed steps and visuals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="solutions-section">
        <div className="container">
          <h2>Material-Specific Solutions</h2>
          <div className="solutions-grid">


            <div className="solution-item">
              <h3>Electronics</h3>
              <p>Turn old gadgets into useful DIY projects or art pieces.</p>
            </div>
            <div className="solution-item">
              <h3>Fabric</h3>
              <p>Create stylish clothing or home decor items from old textiles.</p>
            </div>
            <div className="solution-item">
              <h3>Plastic</h3>
              <p>Transform plastic waste into durable and creative products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Recycling Journey Today</h2>
          <p>Join us in creating a sustainable future, one product at a time.</p>


          <button onClick={handleGoogleAuth} className="nav-button filled">Get Started</button>
        </div>
      </section>
      {/* Social Media Section */}
      <section className="social-media-section" style={{
        padding: '40px 20px',
        backgroundColor: '#1a1a1a',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '30px'
        }}>
          <a 
            href="https://www.instagram.com/shravan___1809/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            <FaInstagram size={32} />
          </a>
          <a 
            href="https://www.linkedin.com/in/shravan-kumar-patel/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            <FaLinkedin size={32} />
          </a>
          <a 
            href="https://github.com/shravanbpatel954" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            <FaGithub size={32} />
          </a>
        </div>
      </section>

    </main>
  );
};

export default BodySection;
