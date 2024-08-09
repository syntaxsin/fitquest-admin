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

async function displayActiveMembersPoints() {
    try {
        const membersCollection = collection(gymDocRef, 'Members');
        const activeMembersQuery = query(membersCollection, where("Status", "==", "Active User"));

        const activeMembersSnapshot = await getDocs(activeMembersQuery);

        // Prepare data for the modal
        const membersPointsData = activeMembersSnapshot.docs.map(doc => {
            const userData = doc.data();
            return {
                memberId: doc.id,
                firstName: userData['First Name'],
                lastName: userData['Last Name'],
                points: userData.Points || 0 // Handle case where points might be undefined
            };
        });

        // Populate the modal table
        const pointsTableBody = document.getElementById("points-table-body");
        pointsTableBody.innerHTML = '';

        membersPointsData.forEach(member => {
            const newRow = pointsTableBody.insertRow();
            newRow.innerHTML = `
                <td>${member.memberId}</td>
                <td>${member.firstName} ${member.lastName}</td>
                <td>${member.points}</td>
                <td>
                <input type="number" class="form-control points-input" value="0">
                <button class="btn btn-primary-custom add-points-btn" data-member-id="${member.memberId}">Add</button>
                <button class="btn btn-primary-custom delete-points-btn" data-member-id="${member.memberId}">Delete</button>
                </td>
            `;

            // Attach event listeners to the buttons
            const addButton = newRow.querySelector('.add-points-btn');
            const deleteButton = newRow.querySelector('.delete-points-btn');
            const pointsInput = newRow.querySelector('.points-input');

            addButton.addEventListener('click', () => {
                const pointsToAdd = parseInt(pointsInput.value) || 0;
                updateMemberPoints(member.memberId, member.points + pointsToAdd);
                pointsInput.reset()
            });

            deleteButton.addEventListener('click', () => {
                const pointsToDelete = parseInt(pointsInput.value) || 0;
                updateMemberPoints(member.memberId, member.points - pointsToDelete);
                pointsInput.reset()
            });
        });

        // Show the modal
        $('#managePointsModal').modal('show');

    } catch (error) {
        // ... (error handling)
    }
}

// Function to update member's points in Firestore
async function updateMemberPoints(memberId, newPoints) {
    try {
        const memberDocRef = doc(gymDocRef, 'Members', memberId);
        await updateDoc(memberDocRef, { Points: newPoints });
        // You might want to update the points display in the modal here or refresh the whole modal
        alert(`Updated points for member ${memberId} to ${newPoints}`);
    } catch (error) {
        console.error("Error updating member points:", error);
        // Handle the error (e.g., display an error message)
    }
}

// Add "Manage Points" link to navbar and attach click event
const managePointsLink = document.createElement('a');
managePointsLink.classList.add('nav-link');
managePointsLink.href = '#'; // You might want to change this to a relevant page or keep it as '#'
managePointsLink.textContent = 'Manage Points';
managePointsLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    displayActiveMembersPoints();
});

const newNavItem = document.createElement('li');
newNavItem.classList.add('nav-item');
newNavItem.appendChild(managePointsLink);

const navbarNav = document.querySelector('.navbar-nav');
navbarNav.appendChild(newNavItem);

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

            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                const userData = userDoc.data();

                const newPoints = userData.Points - rewardData.requiredPoints;
                if (newPoints < 0) {
                    throw new Error("User does not have enough points to claim this reward.");
                }
                transaction.update(userDocRef, { Points: newPoints });

                const claimedRewardsCollection = collection(userDocRef, 'claimed_rewards');
                // Generate the timestamp in the desired format
                const now = new Date();
                const options = {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    timeZone: 'Asia/Manila', // Set timezone to UTC+8
                    timeZoneName: 'short'
                };
                const formattedTimestamp = now.toLocaleString('en-US', options);
                // Create a new document with the formatted timestamp as the ID
                const newRewardRef = doc(claimedRewardsCollection, formattedTimestamp); // Use formattedTimestamp as the document ID

                transaction.set(newRewardRef, {
                    ...rewardData,
                    status: 'claimed',
                    createdAt: serverTimestamp()
                });

                transaction.delete(rewardDocRef);
            });

            $(this).closest('li').remove();
            alert(`Reward ${rewardId} for user ${currentUserIdForModal} marked as claimed.`);
            displayPendingRewards();
        } catch (error) {
            console.error("Error updating reward status:", error);
            alert(error.message);
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