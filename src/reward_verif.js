import { initializeApp } from "firebase/app"
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where, runTransaction,
    orderBy, serverTimestamp,
    getDoc, updateDoc, setDoc
} from 'firebase/firestore'
import {
    getAuth, deleteUser,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'

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

// Get the gym ID
const gymId = localStorage.getItem('gymId');

const gymDocRef = doc(db, 'Gym', gymId);

async function fetchPendingRewards() {
    try {
        const gymId = localStorage.getItem('gymId');

        // Fetch active users under this gym 
        const userQuery = query(
            collection(db, 'Gym', gymId, 'Members'),
            where("Status", "==", "Active User")
        );
        const userSnapshots = await getDocs(userQuery);

        const pendingRewardsData = [];
        for (const userDoc of userSnapshots.docs) {
            const userId = userDoc.id;
            const userRef = userDoc.ref; // Reference to the user document

            // Query for pending rewards within the user's subcollection
            const rewardsQuery = query(
                collection(userRef, 'pending_rewards'),
                where('status', '==', 'pending') // Filter for pending rewards
            );
            const rewardSnapshots = await getDocs(rewardsQuery);

            const userPendingRewards = [];
            for (const rewardDoc of rewardSnapshots.docs) {
                userPendingRewards.push({
                    rewardId: rewardDoc.id, // Include the reward document ID
                    ...rewardDoc.data()      // Spread the rest of the reward data
                });
            }

            pendingRewardsData.push({
                userId,
                pendingRewards: userPendingRewards
            });
        }

        return pendingRewardsData;

    } catch (error) {
        console.error("Error fetching pending rewards:", error);
        throw error;
    }
}

// Usage example:
fetchPendingRewards()
    .then(rewardsData => {
        console.log("Fetched pending rewards:", rewardsData);
        // ... do something with the rewards data
    })
    .catch(error => {
        // ... handle the error appropriately in your application
    });