import { initializeApp } from "firebase/app"
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where, runTransaction,
    orderBy, serverTimestamp,
    getDoc, updateDoc,setDoc
} from 'firebase/firestore'
import {
    getAuth, deleteUser,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'
import { getFunctions, httpsCallable} from 'firebase/functions'

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
const db = getFirestore();
const auth = getAuth();

const addAdminForm = document.getElementById('add-admin-form');
addAdminForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('admin-email').value;
    const location = document.getElementById('admin-location').value; 
    const branch = document.getElementById('admin-branch').value;
    const firstName = document.getElementById('admin-fname').value;
    const lastName = document.getElementById('admin-lname').value;
    const password = document.getElementById('admin-password').value;

    try {
        // 1. Create Firebase Authentication User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // 2. Create Gym Collection (if it doesn't exist)
        const gymCollection = collection(db, `GYM-${branch}`);

        // 3. Create Members Subcollection and add admin details
        const membersCollection = collection(gymCollection, 'Members');
        await setDoc(doc(membersCollection, userCredential.user.uid), {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Status: 'Active Admin'
        });
            
        // 4. Create Rewards Subcollection
        const rewardsCollection = collection(gymCollection, 'Rewards');
        await setDoc(doc(rewardsCollection), {});
        

        // 5. Add Gym details (Location, Name) to the Gym collection
        await setDoc(doc(gymCollection), {
            Location: location, 
            Name: branch  
        });

        alert('Admin added successfully!');

        // 6. Clear the form (optional)
        addAdminForm.reset();
        $('#addAdminModal').modal('hide');
    } catch (error) {
        console.error('Error adding admin:', error);
        alert('Failed to add admin. Please check the console for details.');
    }
});