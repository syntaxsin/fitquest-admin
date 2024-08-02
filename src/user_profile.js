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

// Function to display user data (modified)
function displayUserData(user) { 
    if (user) {
        const gymId = localStorage.getItem('gymId');

        if (gymId) {
            const gymDocRef = doc(db, 'Gym', gymId);
            const membersCollection = collection(gymDocRef, 'Members');
            const userQuery = query(membersCollection, where('Email', '==', user.email), where('Status', '==', 'Active User'));

            getDocs(userQuery) // Use getDocs here instead of onSnapshot
                .then((userSnapshot) => {
                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        userNameElement.textContent = userData.FirstName;
                        userEmailElement.textContent = userData.Email;
                        userPointsElement.textContent = userData.Points || 0;
                    } else {
                        console.log("User not found in this gym or is not an 'Active User'");
                        // Handle the case where the user is not found or not active
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        } else {
            console.log("Gym ID not found in localStorage");
            // Handle the case where gymId is missing
        }
    } else {
        console.log("User not authenticated. Redirecting to login...");
        window.location.href = 'login.php';
    }
}

// Use onAuthStateChanged to ensure the user is authenticated before fetching data
onAuthStateChanged(auth, (user) => {
    displayUserData(user);
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