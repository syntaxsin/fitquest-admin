import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs, doc, getDoc
} from 'firebase/firestore';
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
    const branch = document.getElementById('branch').value;

    if (branch === "") {
        alert('Please select a branch');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const adminDocRef = doc(db, 'admin', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
            localStorage.setItem('loggedInAdminId', user.uid);
            sessionStorage.setItem('loggedInAdminId', user.uid);
            startPHPSession(user.uid, branch, 'dashboard_index.php', 'admin');
        } else if (userDocSnap.exists()) {
            localStorage.setItem('loggedInUserId', user.uid);
            sessionStorage.setItem('loggedInUserId', user.uid);
            startPHPSession(user.uid, branch, 'user_profile.php', 'user');
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

function startPHPSession(userId, branch, redirectUrl, role) {
    const body = role === 'admin' ? `loggedInAdminId=${userId}&branch=${branch}` : `loggedInUserId=${userId}&branch=${branch}`;

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

loadBranches();