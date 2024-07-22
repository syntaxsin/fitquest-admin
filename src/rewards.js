import { initializeApp } from "firebase/app"
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc,setDoc
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
const colRef = collection(db, 'rewards')
const userRef = collection(db, 'users')
const auth = getAuth()

async function generateUniqueID(collectionName, prefix) {
    let newId, formattedId, docSnap;

    do {
        newId = Math.floor(1000 + Math.random() * 9000); // 1000-9999
        formattedId = `${prefix}${newId.toString().padStart(4, '0')}`;

        // Directly check for existence without creating a document reference
        docSnap = await getDocs(query(collection(db, collectionName), where("__name__", "==", formattedId))); 

    } while (!docSnap.empty); // Loop until a unique ID is found
    return formattedId;
}


// add reward
const addRewardForm = document.querySelector('.addRewardForm')
addRewardForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formattedRewardId = await generateUniqueID('rewards', 'RWD');

    // Use formattedRewardId as the document ID
    const rewardDocRef = doc(colRef, formattedRewardId); // No need to specify the document ID here

    await setDoc(rewardDocRef, {
        rewardName: addRewardForm.rewardName.value,
        rewardDescription: addRewardForm.rewardDescription.value,
        requiredPoints: parseInt(addRewardForm.requiredPoints.value),
        createdAt: serverTimestamp()
    })
    .then(() => {
        addRewardForm.reset()
        alert('Reward added successfully')
    })
    .catch((err) => {
        console.error('Error adding reward:', err); // Add error handling here
        alert('Failed to add reward'); // Or display a more user-friendly message
    });
});


// Update Reward
const updateRewardForm = document.querySelector('.updateReward');
updateRewardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rewardIdToUpdate = updateRewardForm.reward_id.value; 
    const newRewardName = updateRewardForm.rewardName.value;
    const newRewardDescription = updateRewardForm.rewardDescription.value;
    const newRequiredPoints = parseInt(updateRewardForm.requiredPoints.value);

    try {
        // 1. Query for the reward document using rewardId
        const rewardsCollection = collection(db, 'rewards');
        const q = query(rewardsCollection, where("rewardId", "==", rewardIdToUpdate));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 1) { // Check if exactly one reward is found
            const rewardDoc = querySnapshot.docs[0];
            const rewardRef = rewardDoc.ref; // Get the DocumentReference

            // 2. Update the reward document
            await updateDoc(rewardRef, {
                rewardName: newRewardName,
                rewardDescription: newRewardDescription,
                requiredPoints: newRequiredPoints
            });

            updateRewardForm.reset();
            alert('Reward updated successfully');
        } else {
            alert(`Reward with ID ${rewardIdToUpdate} not found.`);
        }
    } catch (err) {
        alert(`Error updating reward: ${err.message}`);
        console.error(err);
    }
});

// Delete Reward
const deleteRewardForm = document.querySelector('.deleteReward');
deleteRewardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rewardIdToDelete = deleteRewardForm.reward_id.value; 

    try {
        // 1. Query for the reward document using rewardId
        const rewardsCollection = collection(db, 'rewards');
        const q = query(rewardsCollection, where("rewardId", "==", rewardIdToDelete));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 1) { // Check if exactly one reward is found
            const rewardDoc = querySnapshot.docs[0];

            // 2. Delete the reward document
            await deleteDoc(rewardDoc.ref); 

            deleteRewardForm.reset();
            alert('Reward deleted successfully');
        } else {
            alert(`Reward with ID ${rewardIdToDelete} not found.`);
        }
    } catch (err) {
        alert(`Error deleting reward: ${err.message}`); 
        console.error(err);
    }
});