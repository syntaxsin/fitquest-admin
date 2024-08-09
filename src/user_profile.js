import { initializeApp } from "firebase/app";
import {
    getFirestore, 
    collection, 
    doc,
    getDocs, 
    query, 
    where, 
    limit, 
    orderBy 
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Firebase configuration (replace placeholders with your actual values)
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

// Get references to HTML elements
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const userPointsElement = document.getElementById('userPoints');
const userStatusElement = document.getElementById('userStatus');
const firstWeightEntryElement = document.getElementById('firstWeightEntry');
const lastWeightEntryElement = document.getElementById('lastWeightEntry');
const pendingRewardsList = document.getElementById('pendingRewardsList'); 

// Function to display user data (including weight entries and pending rewards)
function displayUserData(user) {
    if (user) {
        const gymId = localStorage.getItem('gymId');

        if (gymId) {
            const gymDocRef = doc(db, 'Gym', gymId);
            const membersCollection = collection(gymDocRef, 'Members');
            const userQuery = query(membersCollection, where('Email', '==', user.email));

            getDocs(userQuery).then((userSnapshot) => {
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    userNameElement.textContent = userData.FirstName;
                    userEmailElement.textContent = userData.Email;
                    userPointsElement.textContent = userData.Points || 0;
                    userStatusElement.textContent = userData.Status || "Unknown";

                    const userId = userSnapshot.docs[0].id;
                    const weightEntriesRef = collection(db, 'Gym', gymId, 'Members', userId, 'weight_entries');

                    // Query for the first weight entry
                    const firstEntryQuery = query(weightEntriesRef, orderBy('date'), limit(1));
                    getDocs(firstEntryQuery).then((firstEntrySnapshot) => {
                        if (!firstEntrySnapshot.empty) {
                            const firstEntryData = firstEntrySnapshot.docs[0].data();
                            const firstEntryDate = firstEntryData.date.toDate();
                            firstWeightEntryElement.textContent = `${firstEntryData.weight} kg on ${firstEntryDate.toLocaleDateString()}`; 
                        } else {
                            firstWeightEntryElement.textContent = "No weight entries yet";
                        }
                    });

                    // Query for the last weight entry
                    const lastEntryQuery = query(weightEntriesRef, orderBy('date', 'desc'), limit(1));
                    getDocs(lastEntryQuery).then((lastEntrySnapshot) => {
                        if (!lastEntrySnapshot.empty) {
                            const lastEntryData = lastEntrySnapshot.docs[0].data();
                            const lastEntryDate = lastEntryData.date.toDate();
                            lastWeightEntryElement.textContent = `${lastEntryData.weight} kg on ${lastEntryDate.toLocaleDateString()}`; 
                        } else {
                            lastWeightEntryElement.textContent = "No weight entries yet";
                        }
                    });


                    // Fetch and display pending rewards
                    const pendingRewardsRef = collection(db, 'Gym', gymId, 'Members', userId, 'pending_rewards');
                    getDocs(pendingRewardsRef).then((pendingRewardsSnapshot) => {
                        pendingRewardsList.innerHTML = ''; 

                        for (const doc of pendingRewardsSnapshot.docs) {
                            const rewardName = doc.id; // Reward name is the document ID
                            const rewardData = doc.data();

                            const listItem = document.createElement('li');
                            listItem.textContent = `${rewardName} (Status: ${rewardData.status})`;  
                            pendingRewardsList.appendChild(listItem);
                        }

                        if (pendingRewardsSnapshot.empty) {
                            const listItem = document.createElement('li');
                            listItem.textContent = "No pending rewards";
                            pendingRewardsList.appendChild(listItem);
                        }
                    }).catch((error) => {
                        console.error("Error fetching pending rewards:", error);
                    }); 
                } else {
                    console.log("User not found in this gym.");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            console.log("Gym ID not found in localStorage");
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


const logOut = document.getElementById('logout-button');
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
});
