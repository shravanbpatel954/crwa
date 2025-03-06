// src/components/firestoreService.js
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

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

// Initialize Firebase if it hasn't been initialized yet
if (!getApps().length) {
    initializeApp(firebaseConfig);
} else {
    getApp(); 
}

const db = getFirestore();
const auth = getAuth();

// Function to fetch user data from Firestore
export const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    // Fetch from both collections
    const recyclerCollection = collection(db, "users", user.uid, "recycler_data");
    const recyclerSnapshot = await getDocs(recyclerCollection);

    const data = {};
    recyclerSnapshot.forEach((doc) => {
        data[doc.id] = {
            ...doc.data(),
            type: 'recycler' // Add type identifier
        };
    });

    return data;

};

// Function to delete user data
export const deleteUserData = async (id) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const docRef = doc(db, "users", user.uid, "recycler_data", id);

    await deleteDoc(docRef);
};

// Function to save recyclable item data
export const saveRecyclableItem = async (itemData) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const itemCollection = collection(db, "users", user.uid, "recyclable_items");

    try {
        const docRef = await addDoc(itemCollection, {
            ...itemData,
            userId: user.uid,
            timestamp: new Date().toISOString()
        });
        console.log("Recyclable item saved with ID: ", docRef.id);
    } catch (error) {
        console.error("Error saving recyclable item: ", error);
    }
};

// Function to save reuse suggestions
export const saveReuseSuggestions = async (suggestions) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const suggestionsCollection = collection(db, "users", user.uid, "reuse_suggestions");

    try {
        const docRef = await addDoc(suggestionsCollection, {
            ...suggestions,
            userId: user.uid,
            timestamp: new Date().toISOString()
        });
        console.log("Suggestions saved with ID: ", docRef.id);
    } catch (error) {
        console.error("Error saving reuse suggestions: ", error);
    }
};

// Function to save reuse instructions
export const saveReuseInstructions = async (instructions) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const instructionsCollection = collection(db, "users", user.uid, "reuse_instructions");

    try {
        const docRef = await addDoc(instructionsCollection, {
            ...instructions,
            userId: user.uid,
            timestamp: new Date().toISOString()
        });
        console.log("Instructions saved with ID: ", docRef.id);
    } catch (error) {
        console.error("Error saving reuse instructions: ", error);
    }
};

// Function to save recycler data
export const saveRecyclerData = async (recyclerData) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const recyclerCollection = collection(db, "users", user.uid, "recycler_data");

    try {
        const docRef = await addDoc(recyclerCollection, {
            ...recyclerData,
            userId: user.uid,
            timestamp: new Date().toISOString()
        });
        console.log("Recycler data saved with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving recycler data: ", error);
        throw error;
    }
};
