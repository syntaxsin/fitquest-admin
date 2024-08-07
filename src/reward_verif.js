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

let currentUserIdForModal; //To hold the userId for the modal to avoid concurrency issues
function createRewardListItems(pendingRewards) {
    return pendingRewards.map(reward => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${reward.rewardId} - ${reward.requiredPoints} points
            <button class="btn btn-sm btn-success verify-claim-btn" data-reward-id="${reward.rewardId}">Verify Claim</button>
        </li>
    `).join('');
}

async function displayPendingRewards() {
    try {
        const rewardsData = await fetchPendingRewards();
        const cardContainer = document.querySelector('.row');
        cardContainer.innerHTML = ''; // Clear any existing cards

        let currentRow = null;
        let cardCountInRow = 0;
        rewardsData.forEach(userData => {
            const { userId, pendingRewards } = userData;

            // Skip users without pending rewards
            if (pendingRewards.length === 0) {
                return;
            }

            getDoc(doc(db, 'Gym', gymId, 'Members', userId)).then(userDoc => {
                const data = userDoc.data();
                const FirstName = data['First Name'];
                const LastName = data['Last Name'];

                // Create the card element (modified)
                const card = `
                    <div class="col-md-auto mx-2 mb-3" style="display: flex; align-items: center;"> 
                        <div class="card" style="width: 25rem;">
                            <div class="card-body">
                                <h5 class="card-title">User ID: ${userId}</h5>
                                <p class="card-text">Name: ${FirstName} ${LastName}</p>
                                <p class="card-text">Rewards to Claim: ${pendingRewards.length}</p>
                                <button class="btn btn-secondary-custom" data-bs-toggle="modal" data-bs-target="#verifyRewardModal" data-userid="${userId}">
                                Verify
                                </button> 
                            </div>
                        </div>
                    </div>
                `;

                cardContainer.innerHTML += card;
                cardContainer.style.justifyContent = 'center';

                // Event delegation for "Verify" buttons (outside any function)
                document.addEventListener('click', function (event) {
                    if (event.target.classList.contains('btn-secondary-custom') && event.target.dataset.bsTarget === '#verifyRewardModal') {
                        currentUserIdForModal = event.target.dataset.userid; // Set global variable
                        verifyReward(); // Call the function to populate and show the modal
                    }
                });

            });
        });
    } catch (error) {
        console.error("Error displaying pending rewards:", error);
    }
}

// Call the function when your page loads or whenever you need to update the cards
displayPendingRewards();

$('#verifyRewardModal').on('click', '.verify-claim-btn', async function () {
    const rewardId = $(this).data('reward-id');
    const userDocRef = doc(db, 'Gym', gymId, 'Members', currentUserIdForModal);

    if (confirm(`Are you sure you want to verify and claim reward ${rewardId} for this user?`)) {
        try {
            const rewardDocRef = doc(userDocRef, 'pending_rewards', rewardId);
            const rewardDoc = await getDoc(rewardDocRef);
            const rewardData = rewardDoc.data();

            await updateDoc(rewardDocRef, {
                status: 'claimed'
            });
            $(this).closest('li').remove();
            alert(`Reward ${rewardId} for user ${currentUserIdForModal} marked as claimed.`);

            // Update the corresponding Claimable Rewards subcollection
            const rewardsCollection = collection(gymDocRef, 'Rewards');
            const rewardDocRefRewards = doc(rewardsCollection, rewardId);
            const rewardSnapshot = await getDoc(rewardDocRefRewards);
            const rewardDataRewards = rewardSnapshot.data();

            if (rewardSnapshot.exists()) {
                const claimableRewardsSubCollection = collection(userDocRef, 'Claimable Rewards');

                const rewardInClaimableRewards = await getDocs(query(claimableRewardsSubCollection, where('rewardId', '==', rewardId)));
                if (rewardInClaimableRewards.empty) {
                    await addDoc(claimableRewardsSubCollection, {
                        rewardId: rewardId,
                        rewardName: rewardData.rewardName,
                        rewardDescription: rewardData.rewardDescription,
                        requiredPoints: rewardData.requiredPoints,
                        status: "claimed"
                    });
                } else {
                    rewardInClaimableRewards.forEach(async (doc) => {
                        await updateDoc(doc.ref, { status: "claimed" });
                    });
                }
            }
            displayPendingRewards();
        } catch (error) {
            console.error("Error updating reward status:", error);
            // Handle the error appropriately
        }
    }
});

async function verifyReward() {
    try {
        const pendingRewardsData = await fetchPendingRewards();
        const userRewards = pendingRewardsData.find(data => data.userId === currentUserIdForModal);

        if (!userRewards) {
            console.error("User rewards not found:", userId);
            return;
        }

        const rewardListContainer = document.getElementById('modalRewardList');
        rewardListContainer.innerHTML = `<ul class="list-group">${createRewardListItems(userRewards.pendingRewards)}</ul>`;

        // Show the modal (use Bootstrap's method directly)
        const verifyRewardModal = new bootstrap.Modal(document.getElementById('verifyRewardModal'));
        verifyRewardModal.show();
    } catch (error) {
        console.error("Error verifying rewards:", error);
        // Handle the error appropriately
    }
}