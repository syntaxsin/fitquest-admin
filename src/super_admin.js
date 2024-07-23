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
        console.log('User Created:', userCredential);
        // 2. Determine next available GYM number
        const gymQuery = query(collection(db, 'Gym'));
        const gymsSnapshot = await getDocs(gymQuery);

        let maxGymNumber = 0;
        gymsSnapshot.forEach((doc) => {
            const gymNumber = parseInt(doc.id.replace('GYM-', '')); 
            maxGymNumber = Math.max(maxGymNumber, gymNumber);
        });

        const newGymNumber = maxGymNumber + 1; // Increment to get the new GYM number
        const newGymCollectionName = `GYM-${newGymNumber}`; 

        // 3. Create new gym document in the 'Gym' collection
        const gymDocRef = doc(db, 'Gym', newGymCollectionName);
        console.log('Gym Doc Ref:', gymDocRef.path); // Log the gym doc reference
        await setDoc(gymDocRef, {
            Location: location, 
            Name: branch  
        });

        // 4. Create nested Members collection
        const membersCollection = collection(gymDocRef, 'Members'); // Reference as subcollection
        console.log('Members Collection Ref:', membersCollection.path); // Log the members collection reference
        await setDoc(doc(membersCollection, userCredential.user.uid), {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Status: 'Active Admin'
        });
            
        // 5. Create nested Rewards collection
        const rewardsCollection = collection(gymDocRef, 'Rewards');  // Reference as subcollection
        console.log('Rewards Collection Ref:', rewardsCollection.path); // Log the rewards collection reference
        await setDoc(doc(rewardsCollection), {}); // Create empty rewards collection
        
        // 6. Inform the user of successful admin creation
        alert(`Admin added successfully to ${newGymCollectionName}!`);
        addAdminForm.reset();
        // $('#addAdminModal').modal('hide');
    } 
    catch (error) {
        console.error('Error adding admin:', error);
        alert('Failed to add admin. Please check the console for details.');
    }
});