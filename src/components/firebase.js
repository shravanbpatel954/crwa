// src/components/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9WZIXLE0rVPkN8mxhuF7yNh-ud4sOC5g",
    authDomain: "a-i-o-f7e68.firebaseapp.com",
    projectId: "a-i-o-f7e68",
    storageBucket: "a-i-o-f7e68.firebasestorage.app",
    messagingSenderId: "636301331438",
    appId: "1:636301331438:web:48469b376d783cc79a1cff",
    measurementId: "G-D9Z673GZNP"
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
