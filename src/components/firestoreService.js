import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB9ZIXLE0rVPkN8mxhuF7yNh-ud4sOC5g",
    authDomain: "a-i-o-f7e68.firebaseapp.com",
    projectId: "a-i-o-f7e68",
    storageBucket: "a-i-o-f7e68.appspot.com",
    messagingSenderId: "636301331438",
    appId: "1:636301331438:web:48469b376d783cc79a1cff",
    measurementId: "G-D9Z673GZNP",
};

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
    initializeApp(firebaseConfig);
} else {
    getApp(); // Use the existing Firebase app if it is already initialized
}

const db = getFirestore();
const auth = getAuth();

// Function to fetch user data
export const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const userCollection = collection(db, "users", user.uid, "academic_advice");
    const snapshot = await getDocs(userCollection);

    const data = {};
    snapshot.forEach((doc) => {
        data[doc.id] = doc.data();
    });

    return data;
};

// Function to delete user data
export const deleteUserData = async (id) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const docRef = doc(db, "users", user.uid, "academic_advice", id);
    await deleteDoc(docRef);
};
