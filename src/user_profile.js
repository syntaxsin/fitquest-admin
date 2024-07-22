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
const colRef = collection(db, 'rewards')
const userRef = collection(db, 'users')

const q = query(colRef, orderBy('createdAt'))
const userQuery = query(userRef, orderBy('createdAt'))


// onSnapshot(q, (snapshot) => {
//     let rewards = []
//     snapshot.docs.forEach((doc) => {
//         rewards.push({ ...doc.data(), id: doc.id})
//     })
//     console.log(rewards)
// })

// onSnapshot(userQuery, (snapshot) => {
//     let users = []
//     snapshot.docs.forEach((doc) => {
//         users.push({ ...doc.data(), id: doc.id})
//     })
//     console.log(users)
// })

const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const userPointsElement = document.getElementById('userPoints');

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;

        // 1. Get Specific User Document
        const docRef = doc(userRef, userId);
        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    userNameElement.textContent = userData.firstName;
                    userEmailElement.textContent = userData.email;
                    userPointsElement.textContent = userData.points || 0; // Default to 0 if not set
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User is not logged in.");
    }
});

const logOut = document.getElementById('logout-button')
logOut.addEventListener('click', () => {
    fetch('destroy_session.php') // Send a request to destroy the session
        .then(() => {
            localStorage.clear();
            sessionStorage.clear();
            signOut(auth)
                .then(() => {
                    window.location.href = '../index.php';
                })
                .catch(err => console.error('Error signing out:', err));
        })
        .catch(error => {
            console.error('Error destroying PHP session:', error);
        });
})