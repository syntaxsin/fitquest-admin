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

// Super Admin Email - REPLACE WITH YOUR ACTUAL SUPER ADMIN EMAIL
const SUPER_ADMIN_EMAIL = 'superadmin_fitquest@atmr.dev';

// Login Form
const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Super Admin Check
        if (email === SUPER_ADMIN_EMAIL) {
            localStorage.setItem('userType', 'super_admin'); 
            window.location.href = 'super_admin.php'; 
        } else {
            // Regular User/Admin Check
            const gymCollection = collection(db, 'Gym');
            const gymSnapshot = await getDocs(gymCollection);
            let foundUser = false;

            for (const gymDoc of gymSnapshot.docs) {
                const membersCollection = collection(gymDoc.ref, 'Members');
                const memberQuery = query(membersCollection, where('Email', '==', email));
                const memberSnapshot = await getDocs(memberQuery);

                if (!memberSnapshot.empty) {
                    const memberDoc = memberSnapshot.docs[0];
                    foundUser = true;

                    const role = memberDoc.data().Status === 'Active Admin' ? 'admin' : 'user';

                    // Store user type and gym information
                    localStorage.setItem('userType', role);
                    localStorage.setItem('gymId', gymDoc.id);
                    
                    // Redirect based on role (no need for startPHPSession)
                    window.location.href = role === 'admin' ? 'dashboard_index.php' : 'user_profile.php';

                    break; // Stop searching once user is found
                }
            }
            if (!foundUser) {
                alert("User not found or inactive.");
            }
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

// Start PHP Session Function
// function startPHPSession(userId, gymDocId, redirectUrl, role) {
    
//     const body = new URLSearchParams({
//         loggedInUserId: userId,
//         branch: gymDocId || '' 
//     });

//     if (role === 'super_admin') {
//         body.append('role', 'super_admin');  
//     } else if (role === 'admin') {
//         body.append('loggedInAdminId', userId); 
//     } // No else block needed for regular users
    
//     fetch('create_session.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: body.toString(),  
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok.');
//         }
//         return response.text();
//     })
//     .then(data => {
//         // Logging for debugging (optional)
//         console.log("PHP Session Response:", data); 

//         // Determine redirection based on role
//         switch (role) {
//             case 'super_admin':
//                 window.location.href = 'super_admin.php'; 
//                 break;
//             case 'admin':
//                 window.location.href = 'dashboard_index.php';
//                 break;
//             default: // Regular user
//                 window.location.href = 'user_profile.php'; 
//         }
//     })
//     .catch(error => {
//         console.error('Error starting PHP session:', error);
//     });
// }