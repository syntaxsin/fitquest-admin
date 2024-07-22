import { initializeApp } from "firebase/app"
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc, setDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBxEwY413QHRNSRv6_38Odi9wfWWJg249I",
    authDomain: "fitquest-3ea1c.firebaseapp.com",
    databaseURL: "https://fitquest-3ea1c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fitquest-3ea1c",
    storageBucket: "fitquest-3ea1c.appspot.com",
    messagingSenderId: "32473756709",
    appId: "1:32473756709:web:1560a93615481f894afbcc",
    measurementId: "G-3RE9G8K9YG"
};

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()

// Log-in
const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // 1. Sign in the user (don't check for admin yet)
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);


        // Determine user role by fetching data from Firestore (using UID)
        const userDocRef = doc(db, 'users', user.uid);
        const adminDocRef = doc(db, 'admin', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const adminDocSnap = await getDoc(adminDocRef);

        // Log document snapshots for debugging
        console.log('User Document Snapshot:', userDocSnap.exists());
        console.log('Admin Document Snapshot:', adminDocSnap.exists());

        if (adminDocSnap.exists()) {
            localStorage.setItem('loggedInAdminId', user.uid);
            sessionStorage.setItem('loggedInAdminId', user.uid);

            const usersCollectionRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);
            usersSnapshot.forEach((doc) => {
                console.log('User document:', doc.id, doc.data());
                localStorage.setItem(doc.id, JSON.stringify(doc.data())); // Store as key-value pair
            });

            startPHPSession(user.uid, 'dashboard_index.php');
        } else if (userDocSnap.exists()) {
            localStorage.setItem('loggedInUserId', user.uid);
            sessionStorage.setItem('loggedInUserId', user.uid);

            startPHPSession(user.uid, 'user_profile.php');
        } else {
            alert("User does not exist.");
        }
    } catch (err) {
        if (err.code === 'auth/wrong-password') {
            alert('Incorrect password');
        } else if (err.code === 'auth/user-not-found') {
            alert('User not found. Please check your email.');
        } else {
            console.error('Error logging in:', err);
            alert('An error occurred during login. Please try again.');
        }
    }
    loginForm.reset();
});

function startPHPSession(userId, redirectUrl) {
    fetch('create_session.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `loggedInAdminId=${userId}`, 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.text();
    })
    .then(data => {
        console.log(data); 
        window.location.href = redirectUrl;
    })
    .catch(error => {
        console.error('Error starting PHP session:', error);
        // Handle the error appropriately, e.g., display an error message to the user
    });
}