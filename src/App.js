import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';
import Navbar from './components/Navbar';
import BodySection from './components/BodySection';
import AuthPage from './components/AuthPage';
import Home from './components/Home';
import MyAio from './components/myaio';
import MyAioDetails from './components/MyAioDetails';
import Academic from './models/academic';
import Career from './models/carrer';
import Financial from './models/financial';
import HealthAdvisor from './models/HealthAdvisor';
import Legal from './models/legal';
import TechAdvisor from './models/TechAdvisor';
import Travel from './models/travel';
import Entertainment from './models/entertainment';
import { auth } from './components/firebase'; // Import your auth module

const App = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [showAuthPage, setShowAuthPage] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const toggleAuthType = () => {
        setIsSignUp(!isSignUp);
    };

    const openAuthModal = (type) => {
        setIsSignUp(type === 'signup');
        setShowAuthPage(true);
    };

    const closeAuthModal = () => {
        setShowAuthPage(false);
    };

    const handleAuthSuccess = () => {
        setShowAuthPage(false);
    };

    return (
        <>
            <Routes>
                {/* Landing Page */}
                <Route
                    path="/"
                    element={
                        <>
                            {!showAuthPage && (
                                <>
                                    <Navbar openAuthModal={openAuthModal} />
                                    <BodySection openAuthModal={openAuthModal} />
                                </>
                            )}
                            {showAuthPage && (
                                <AuthPage
                                    isSignUp={isSignUp}
                                    onAuthChange={toggleAuthType}
                                    onClose={closeAuthModal}
                                    onAuthSuccess={handleAuthSuccess}
                                />
                            )}
                        </>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/home"
                    element={user ? <Layout><Home /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/myaio"
                    element={user ? <Layout><MyAio /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/myaio/:id"
                    element={user ? <Layout><MyAioDetails /></Layout> : <Navigate to="/" replace />}
                />

                {/* Model Routes */}
                <Route
                    path="/models/academic"
                    element={user ? <Layout><Academic /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/career"
                    element={user ? <Layout><Career /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/financial"
                    element={user ? <Layout><Financial /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/health"
                    element={user ? <Layout><HealthAdvisor /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/legal"
                    element={user ? <Layout><Legal /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/tech"
                    element={user ? <Layout><TechAdvisor /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/travel"
                    element={user ? <Layout><Travel /></Layout> : <Navigate to="/" replace />}
                />
                <Route
                    path="/models/entertainment"
                    element={user ? <Layout><Entertainment /></Layout> : <Navigate to="/" replace />}
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

// AppWrapper adds Router context to the application
const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
