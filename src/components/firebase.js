// src/components/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLI7ihO4D5727QiaHLMfANI3JqBsbNohk",
  authDomain: "prepa-d7e15.firebaseapp.com",
  projectId: "prepa-d7e15",
  storageBucket: "prepa-d7e15.appspot.com",
  messagingSenderId: "390909925247",
  appId: "1:390909925247:web:f36a98cfafeaf872e1ac4a",
  measurementId: "G-S0C80GRKNB"
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
