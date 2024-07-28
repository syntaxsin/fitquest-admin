import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where, runTransaction,
    orderBy, serverTimestamp,
    getDoc, updateDoc,setDoc
} from 'firebase/firestore'
import {
    getAuth, signInWithEmailAndPassword
} from 'firebase/auth';

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

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Query all Gym collections
        const gymCollection = collection(db, 'Gym');
        const gymSnapshot = await getDocs(gymCollection);
        
        let foundUser = false;
        let redirectUrl = '';
        let role = '';
        let gymDocId = '';

        for (const gymDoc of gymSnapshot.docs) {
            const membersCollection = collection(gymDoc.ref, 'Members');
            const memberQuery = query(membersCollection, where('Email', '==', email));
            const memberSnapshot = await getDocs(memberQuery);

            if (!memberSnapshot.empty) {
                const memberDoc = memberSnapshot.docs[0]; // Assuming unique email per Gym
                foundUser = true;
                gymDocId = gymDoc.id;

                if (memberDoc.data().Status === 'Active Admin') {
                    redirectUrl = 'dashboard_index.php';
                    role = 'admin';
                    localStorage.setItem('loggedInAdminId', user.uid);
                    sessionStorage.setItem('loggedInAdminId', user.uid);
                } else if (memberDoc.data().Status === 'Active User') {
                    redirectUrl = 'user_profile.php';
                    role = 'user';
                    localStorage.setItem('loggedInUserId', user.uid);
                    sessionStorage.setItem('loggedInUserId', user.uid);
                }

                break; // Stop searching once user is found in a Gym
            }
        }

        if (foundUser) {
            startPHPSession(user.uid, gymDocId, redirectUrl, role); // Pass gymDoc.id as branch
        } else {
            alert("User not found or inactive.");
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

function startPHPSession(userId, gymDocId, redirectUrl, role) {
    const body = role === 'admin' ? `loggedInAdminId=${userId}&branch=${gymDocId}` : `loggedInUserId=${userId}&branch=${gymDocId}`;

    fetch('create_session.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
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
    });
}

async function loadBranches() {
    const gymCollection = collection(db, 'Gym');
    const gymSnapshot = await getDocs(gymCollection);
    const branchSelect = document.getElementById('branch');

    gymSnapshot.forEach(doc => {
        const branchOption = document.createElement('option');
        branchOption.value = doc.id;
        branchOption.textContent = doc.data().Name;
        branchSelect.appendChild(branchOption);
    });
}

// loadBranches();