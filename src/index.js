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

// Reference to the Gym document
const gymDocRef = doc(db, 'Gym', gymId);

async function displayDashboardCounts() {
    try {
        // Get gym data from localStorage
        const gymId = localStorage.getItem('gymId');

        if (!gymId) {
            console.error("Gym ID not found in localStorage");
            return;
        }

        const gymDocRef = doc(db, 'Gym', gymId);

        // Fetch and display user count
        const usersCollection = collection(gymDocRef, 'Members');
        const activeUsersQuery = query(usersCollection, where("Status", "==", "Active User"));
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        document.querySelector('.card:nth-child(1) .card-text').textContent = activeUsersSnapshot.size;

        // Fetch and display deactivated users count
        const deactivatedUsersQuery = query(usersCollection, where("Status", "==", "Deactivated"));
        const deactivatedUsersSnapshot = await getDocs(deactivatedUsersQuery);
        document.querySelector('.card:nth-child(3) .card-text').textContent = deactivatedUsersSnapshot.size;

        // Fetch and display reward count
        const rewardsCollection = collection(gymDocRef, 'Rewards');
        const rewardsSnapshot = await getDocs(rewardsCollection);
        document.querySelector('.card:nth-child(2) .card-text').textContent = rewardsSnapshot.size;

        // Set up real-time updates using onSnapshot (optional)
        onSnapshot(activeUsersQuery, (snapshot) => {
            document.querySelector('.card:nth-child(1) .card-text').textContent = snapshot.size;
        });
        onSnapshot(deactivatedUsersQuery, (snapshot) => {
            document.querySelector('.card:nth-child(3) .card-text').textContent = snapshot.size;
        });
        onSnapshot(rewardsCollection, (snapshot) => {
            document.querySelector('.card:nth-child(2) .card-text').textContent = snapshot.size;
        });

    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        // Handle error (e.g., show error message)
    }
}

async function displayActiveMembers() {
    const userList = document.querySelector("#user-list tbody");
    userList.innerHTML = ''; // Clear existing data

    try {
        const gymSnapshot = await getDoc(gymDocRef);
        if (!gymSnapshot.exists()) {
            console.error("Gym not found:", gymId);
            return; // Exit if gym doesn't exist
        }

        const membersCollection = collection(gymDocRef, 'Members');
        const activeMembersQuery = query(membersCollection, where("Status", "==", "Active User"));

        onSnapshot(activeMembersQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added" || change.type === "modified") {
                    const memberDoc = change.doc;
                    const userData = memberDoc.data();

                    // Create unique row ID
                    const rowId = `user-${memberDoc.id}`;
                    const existingRow = document.getElementById(rowId);
                    if (existingRow) {
                        existingRow.remove(); // Remove existing row to avoid duplicates
                    }

                    const newRow = userList.insertRow();
                    newRow.id = rowId;
                    newRow.innerHTML = `
                        <td>${memberDoc.id}</td>
                        <td>${userData.FirstName}</td>
                        <td>${userData.LastName}</td>
                        <td>${userData.Email}</td>
                        <td>${userData.Status}</td>
                        <td>
                            <button class="btn btn-secondary-custom edit-button" data-bs-toggle="modal" data-bs-target="#editUserModal" data-member-id="${memberDoc.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-secondary-custom del-button" data-bs-toggle="modal" data-bs-target="#deleteUserModal" data-member-id="${memberDoc.id}">
                                <i class="fas fa-power-off" ></i>
                            </button>
                        </td>
                    `;

                    // Add event listeners to buttons (implementation needed)
                    const editButton = newRow.querySelector('.edit-button');
                    editButton.addEventListener('click', () => {
                        // Implement your edit user logic here
                        console.log("Edit button clicked for user:", memberDoc.id);
                    });

                    const delButton = newRow.querySelector('.del-button');
                    delButton.addEventListener('click', () => {
                        // Implement your deactivate user logic here
                        console.log("Deactivate button clicked for user:", memberDoc.id);
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error fetching active members:", error);
        // Handle the error (e.g., display an error message)
    }
}

// Function to fetch and display claimable rewards
async function displayClaimableRewards() {
    const rewardsList = document.querySelector("#rewards-list tbody");
    rewardsList.innerHTML = ''; // Clear existing data

    try {
        const gymSnapshot = await getDoc(gymDocRef);
        if (!gymSnapshot.exists()) {
            console.error("Gym not found:", gymId);
            return; // Exit if gym doesn't exist
        }

        const rewardsCollection = collection(gymDocRef, 'Rewards');
        const claimableRewardsQuery = query(rewardsCollection, where("status", "==", "Claimable")); // Use lowercase 'status'

        onSnapshot(claimableRewardsQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added" || change.type === "modified") {
                    const rewardDoc = change.doc;
                    const rewardData = rewardDoc.data();

                    // Create unique row ID
                    const rowId = `reward-${rewardDoc.id}`;
                    const existingRow = document.getElementById(rowId);
                    if (existingRow) {
                        existingRow.remove();
                    }

                    const newRow = rewardsList.insertRow();
                    newRow.id = rowId;
                    newRow.innerHTML = `
                        <td>${rewardDoc.id}</td> 
                        <td>${rewardData.rewardName}</td>
                        <td>${rewardData.rewardDescription}</td>
                        <td>${rewardData.requiredPoints}</td>
                        <td>${rewardData.status}</td> 
                        <td>
                            <button class="btn btn-secondary-custom edit-button" data-bs-toggle="modal" data-bs-target="#editRewardModal" data-reward-id="${rewardDoc.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-secondary-custom del-button" data-bs-toggle="modal" data-bs-target="#deleteRewardModal" data-reward-id="${rewardDoc.id}">
                                <i class="fas fa-trash" ></i>
                            </button>
                        </td>
                    `;

                    // Add event listeners to buttons (implementation needed)
                    const editButton = newRow.querySelector('.edit-button');
                    editButton.addEventListener('click', async () => {
                        try {
                            // 1. Fetch the reward document
                            const rewardDocRef = doc(rewardsCollection, rewardDoc.id);
                            const rewardSnapshot = await getDoc(rewardDocRef);

                            if (rewardSnapshot.exists()) {
                                const existingRewardData = rewardSnapshot.data();

                                // 2. Populate modal fields
                                document.getElementById("reward_id").value = rewardDoc.id;
                                document.getElementById("updateRewardName").value = existingRewardData.rewardName;
                                document.getElementById("updateRewardDescription").value = existingRewardData.rewardDescription;
                                document.getElementById("updateRequiredPoints").value = existingRewardData.requiredPoints;

                                // 3. Show the modal
                                $('#editRewardModal').modal('show');
                            } else {
                                console.log("Reward not found");
                                // Handle the case where the reward document is not found
                            }
                        } catch (error) {
                            console.error("Error fetching reward data:", error);
                            // Handle the error appropriately
                        }
                    });

                    const delButton = newRow.querySelector('.del-button');
                    delButton.addEventListener('click', () => {
                        // Set the hidden input value with the reward ID
                        document.getElementById('delete-reward-id').value = rewardDoc.id;

                        // Show the delete confirmation modal
                        $('#deleteRewardModal').modal('show');
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error fetching claimable rewards:", error);
        // Handle the error (e.g., display an error message)
    }
}

//delete reward function
async function deleteReward(rewardId) {
    try {
        // 1. Get the gymId from localStorage
        const gymId = localStorage.getItem('gymId');
        if (!gymId) {
            throw new Error("Gym ID not found in localStorage");
        }

        // 2. Construct the gym and reward document references
        const gymDocRef = doc(db, 'Gym', gymId);
        const rewardDocRef = doc(gymDocRef, 'Rewards', rewardId);

        // 3. Delete the reward document
        await deleteDoc(rewardDocRef);

        // 4. Close the modal and show success message 
        $('#deleteRewardModal').modal('hide');
        alert('Reward deleted successfully');

        // 5. Refresh the rewards list
        displayClaimableRewards();
    } catch (error) {
        console.error('Error deleting reward:', error);
        alert('Failed to delete reward. Please check the console for details.');
    }
}

onAuthStateChanged(auth, (user) => {
    if (user && localStorage.getItem('userType') === 'admin') {
        // User is signed in and is an admin

        const gymId = localStorage.getItem('gymId');
        const gymDocRef = doc(db, 'Gym', gymId);

        displayDashboardCounts();

        // Add User Form Submission (moved inside onAuthStateChanged)
        const addUserForm = document.getElementById('add-user-form');
        addUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('new-email').value;
            const firstName = document.getElementById('new-fname').value;
            const lastName = document.getElementById('new-lname').value;
            const password = document.getElementById('new-password').value;
            const status = 'Active User';
            const points = 0;

            try {
                // 1. Create User in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('User Created in Firebase Auth:', userCredential);

                // 2. Get the 'Members' subcollection
                const membersCollection = collection(gymDocRef, 'Members');

                // 3. Get existing user IDs to generate the next ID
                const membersSnapshot = await getDocs(membersCollection);
                const existingMemberIds = membersSnapshot.docs.map(doc => doc.id);

                // 4. Generate the next available user ID (U00# format)
                function generateNextId(existingIds) {
                    const prefix = "U";
                    const maxId = existingIds
                        .filter(id => id.startsWith(prefix))
                        .map(id => parseInt(id.replace(prefix, ''), 10))
                        .reduce((max, current) => Math.max(max, current), 0);
                    return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
                }
                const newUserId = generateNextId(existingMemberIds);

                // 5. Create the new user document with subcollections
                const newUserDocRef = doc(membersCollection, newUserId);
                await setDoc(newUserDocRef, {
                    Email: email,
                    FirstName: firstName,
                    LastName: lastName,
                    Status: status,
                    points: points,
                    createdAt: serverTimestamp()
                });

                // Create empty 'claimed_rewards', 'pending_rewards' and 'weight_entries' subcollections
                await setDoc(doc(newUserDocRef, 'pending_rewards', 'initial_doc'), {});
                await setDoc(doc(newUserDocRef, 'weight_entries', 'initial_doc'), {});
                await setDoc(doc(newUserDocRef, 'workout_logs', 'initial_doc'), {});

                // 6. Success message and form reset
                alert(`User added successfully with ID ${newUserId}!`);
                addUserForm.reset();

                // 7. Refresh the active members list 
                displayActiveMembers();
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Failed to add user. Please check the console for details.');
            }
        });

        const addRewardForm = document.getElementById("add-reward-form")
        addRewardForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const rewardName = document.getElementById('rewardName').value;
            const rewardDescription = document.getElementById('rewardDescription').value;
            const requiredPoints = parseInt(document.getElementById('requiredPoints').value);

            try {
                // 1. Get the gymId from localStorage
                const gymId = localStorage.getItem('gymId');
                if (!gymId) {
                    throw new Error("Gym ID not found in localStorage");
                }

                // 2. Construct the gym document reference
                const gymDocRef = doc(db, 'Gym', gymId);

                // 3. Get the 'Rewards' subcollection within the gym document
                const rewardsCollection = collection(gymDocRef, 'Rewards');

                // 4. Get existing reward IDs to generate the next ID
                const rewardsSnapshot = await getDocs(rewardsCollection);
                const existingRewardIds = rewardsSnapshot.docs.map(doc => doc.id);

                // 5. Generate the next available reward ID (RWD00# format)
                function generateNextRewardId(existingIds) {
                    const prefix = "RWD";
                    const maxId = existingIds
                        .filter(id => id.startsWith(prefix))
                        .map(id => parseInt(id.replace(prefix, ''), 10))
                        .reduce((max, current) => Math.max(max, current), 0);
                    return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
                }
                const newRewardId = generateNextRewardId(existingRewardIds);

                // 6. Create the new reward document within the 'Rewards' subcollection
                await setDoc(doc(rewardsCollection, newRewardId), {
                    rewardId: newRewardId,
                    rewardName: rewardName,
                    rewardDescription: rewardDescription,
                    requiredPoints: requiredPoints,
                    status: 'Claimable',
                    createdAt: serverTimestamp()
                });

                // 7. Success message and form reset
                alert(`Reward added successfully with ID ${newRewardId}!`);
                addRewardForm.reset();

                // 8. Refresh the rewards list
                displayClaimableRewards();
            } catch (error) {
                console.error('Error adding reward:', error);
                alert('Failed to add reward. Please check the console for details.');
            }
        })

        // Update Reward Form Submission
        const updateRewardForm = document.querySelector('.updateReward');
        updateRewardForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const rewardId = document.getElementById("reward_id").value;
            const newRewardName = document.getElementById("updateRewardName").value;
            const newRewardDescription = document.getElementById("updateRewardDescription").value;
            const newRequiredPoints = parseInt(document.getElementById("updateRequiredPoints").value);

            try {
                // 1. Get the gymId from localStorage
                const gymId = localStorage.getItem('gymId');
                if (!gymId) {
                    throw new Error("Gym ID not found in localStorage");
                }

                // 2. Construct the gym document reference
                const gymDocRef = doc(db, 'Gym', gymId);

                // 3. Get the 'Rewards' subcollection within the gym document
                const rewardsCollection = collection(gymDocRef, 'Rewards');

                // 4. Construct the reward document reference
                const rewardDocRef = doc(rewardsCollection, rewardId);

                // 5. Update the reward document
                await updateDoc(rewardDocRef, {
                    rewardName: newRewardName,
                    rewardDescription: newRewardDescription,
                    requiredPoints: newRequiredPoints,
                    // quantity: updateQuantity, // Uncomment if you have quantity in your modal
                });

                // 6. Close the modal and show success message
                $('#editRewardModal').modal('hide');
                alert('Reward updated successfully');

                // 7. Refresh the rewards list (optional)
                displayClaimableRewards();
            } catch (err) {
                alert(`Error updating reward: ${err.message}`);
                console.error(err);
            }
        });

        const confirmDeleteRewardButton = document.getElementById("confirm-delete-reward");
        confirmDeleteRewardButton.addEventListener('click', () => {
            const rewardIdToDelete = document.getElementById('delete-reward-id').value;
            deleteReward(rewardIdToDelete);
        });

        // Call the functions to fetch and display data
        displayActiveMembers();
        displayClaimableRewards();
    } else {
        // User is signed out
        console.log("User not authenticated. Redirecting to login...");
        window.location.href = 'login.php';
    }
});


// //real-time display 
// async function getDocumentCount(collectionName) {
//     try {
//         const collectionRef = collection(db, collectionName);
//         const snapshot = await getDocs(collectionRef);
//         return snapshot.size;
//     } catch (error) {
//         console.error(`Error getting document count for ${collectionName}:`, error);
//         return 0;
//     }
// }

// async function updateDocumentCountDisplays() {
//     const userCount = await getDocumentCount('users');
//     const rewardCount = await getDocumentCount('rewards');

//     const userCountElement = document.querySelector('.card:nth-child(1) .box h1');
//     const rewardCountElement = document.querySelector('.card:nth-child(2) .box h1');

//     if (userCountElement) userCountElement.textContent = userCount;
//     if (rewardCountElement) rewardCountElement.textContent = rewardCount;
// }

// // Real-time updates for users
// const usersCollection = collection(db, 'users');
// onSnapshot(usersCollection, async (snapshot) => {
//     const userCount = snapshot.size;
//     const userCountElement = document.querySelector('.card:nth-child(1) .box h1');
//     if (userCountElement) userCountElement.textContent = userCount;
// });

// // Real-time updates for rewards
// const rewardsCollection = collection(db, 'rewards');
// onSnapshot(rewardsCollection, async (snapshot) => {
//     const rewardCount = snapshot.size;
//     const rewardCountElement = document.querySelector('.card:nth-child(2) .box h1');
//     if (rewardCountElement) rewardCountElement.textContent = rewardCount;
// });

// updateDocumentCountDisplays();

// log-out
const logOut = document.getElementById('logout')
logOut.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
        // Optionally, clear any stored user data
        localStorage.removeItem('gymId');
        localStorage.removeItem('userType');
        window.location.href = '../index.php'; // Replace with your actual login page URL
    } catch (error) {
        console.error('Error signing out:', error);
    }
})