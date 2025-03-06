// src/components/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDU1JcZfwA-9DwqqGQkX92OTZpU93WXNic",
    authDomain: "recycle-33094.firebaseapp.com",
    projectId: "recycle-33094",
    storageBucket: "recycle-33094.firebasestorage.app",
    messagingSenderId: "138313615848",
    appId: "1:138313615848:web:a688f4b6324a397bd77c5d",
    measurementId: "G-T6C07GD09E"
  };


// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Sign-in with Google
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Error during sign-in:', error);
        throw error;
    }
};

// Sign-out user
const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error during sign-out:', error);
        throw error;
    }
};

// Save recycling data to Firestore
const saveRecyclingData = async (dataToSave) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const userId = user.uid;
    const docRef = doc(db, 'users', userId, 'recycling_data', new Date().toISOString());
    await setDoc(docRef, {
        ...dataToSave,
        userId,
    });
};

// Export Firebase utilities
export { auth, db, signInWithGoogle, signOutUser, saveRecyclingData };
