// src/components/firestoreService.js
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

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
