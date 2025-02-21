import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from './assets/logo.png';
import profileIcon from './assets/practice.jpeg'; // Default icon
import { auth, signOutUser } from './firebase'; // Import signOutUser and auth

const Layout = ({ children }) => {
    const [user, setUser] = useState(null); // Store the user information
    const [showLogout, setShowLogout] = useState(false); // Toggle logout button visibility
    const navigate = useNavigate();
    const profileContainerRef = useRef(null); // Reference for profile container

    // Fetch authenticated user info
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Handle clicks outside the profile container to close logout button
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileContainerRef.current && !profileContainerRef.current.contains(e.target)) {
                setShowLogout(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                navigate('/'); // Redirect to the BodySection.js page
            })
            .catch((error) => {
                console.error('Sign out error:', error);
            });
    };

    const navbarStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg,rgb(0, 0, 0),rgb(252, 10, 10))',
        color: '#fff',
        padding: '10px 20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    };


    const logoStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const navLinkStyles = {
        color: '#fff', // White link color
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '500',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    };

    const navLinkHoverStyles = {
        backgroundColor: '#000', // Black background on hover
    };

    const profileContainerStyles = {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    };

    const signOutButtonStyles = {
        position: 'fixed',
        top: '70px',
        right: '20px',
        backgroundColor: '#ff4444',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        padding: '12px 24px',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
        fontSize: '16px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: showLogout ? 1 : 0,
        pointerEvents: showLogout ? 'auto' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        minWidth: '120px',
        justifyContent: 'center',
    };



    const handleProfileClick = () => {
        setShowLogout((prevState) => !prevState); // Toggle logout button visibility
    };

    return (
        <div className="layout" style={{ paddingTop: '70px' }}>

            <header style={navbarStyles}>
                <div style={logoStyles}>
                    <img src={logoImage} alt="Prepa Logo" style={{ height: '40px' }} />
                    <nav>
                        <Link
                            to="/home"
                            style={navLinkStyles}
                            onMouseOver={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                            onMouseOut={(e) => Object.assign(e.target.style, navLinkStyles)}
                        >
                            🏠 Home
                        </Link>
                        <Link
                            to="/myaio"
                            style={navLinkStyles}
                            onMouseOver={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                            onMouseOut={(e) => Object.assign(e.target.style, navLinkStyles)}
                        >
                            📜 History
                        </Link>
                    </nav>
                </div>
                <div style={profileContainerStyles} ref={profileContainerRef}>
                    {user ? (
                        <div onClick={handleProfileClick}>
                            <img
                                src={user.photoURL || profileIcon}
                                alt="Profile"
                                style={{ height: '40px', borderRadius: '50%' }}
                            />
                            {showLogout && (
                                <button
                                    onClick={handleSignOut}
                                    style={signOutButtonStyles}
                                >
                                    🚪 Logout
                                </button>
                            )}
                        </div>
                    ) : (
                        <img
                            src={profileIcon}
                            alt="Profile"
                            style={{ height: '40px', borderRadius: '50%' }}
                        />
                    )}
                </div>
            </header>
            <main>
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { user });
                    }
                    return child;
                })}
            </main>
        </div>
    );
};

export default Layout;
