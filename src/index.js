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

async function displayActiveMembersPoints() {
    try {
        const membersCollection = collection(gymDocRef, 'Members');
        const activeMembersQuery = query(membersCollection, where("Status", "==", "Active User"));

        const activeMembersSnapshot = await getDocs(activeMembersQuery);

        // Prepare data for the modal, handling potential field name variations
        const membersPointsData = activeMembersSnapshot.docs.map(doc => {
            const userData = doc.data();
            return {
                memberId: doc.id,
                firstName: userData['First Name'] || userData.FirstName,  // Prioritize 'First Name', then fallback
                lastName: userData['Last Name'] || userData.LastName,    // Prioritize 'Last Name', then fallback
                points: userData.Points || 0
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
        const deactivatedUsersQuery = query(usersCollection, where("Status", "==", "Deactivated Account"));
        const deactivatedUsersSnapshot = await getDocs(deactivatedUsersQuery);
        // document.querySelector('.card:nth-child(3) .card-text').textContent = deactivatedUsersSnapshot.size;

        // Fetch and display reward count
        const rewardsCollection = collection(gymDocRef, 'Rewards');
        const rewardsSnapshot = await getDocs(rewardsCollection);
        document.querySelector('.card:nth-child(2) .card-text').textContent = rewardsSnapshot.size;

        // Set up real-time updates using onSnapshot (optional)
        onSnapshot(activeUsersQuery, (snapshot) => {
            document.querySelector('.card:nth-child(1) .card-text').textContent = snapshot.size;
        });
        // onSnapshot(deactivatedUsersQuery, (snapshot) => {
        //     document.querySelector('.card:nth-child(3) .card-text').textContent = snapshot.size;
        // });
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

                    // Handle variations in FirstName and LastName fields
                    const firstName = userData.FirstName || userData["First Name"];
                    const lastName = userData.LastName || userData["Last Name"];

                    const newRow = userList.insertRow();
                    newRow.id = rowId;
                    newRow.innerHTML = `
                        <td>${memberDoc.id}</td>
                        <td>${firstName}</td>
                        <td>${lastName}</td>
                        <td>${userData.Email}</td>
                        <td>${userData.Status}</td>
                        <td>
                            <button class="btn btn-secondary-custom del-button" data-bs-toggle="modal" data-bs-target="#deleteUserModal" data-member-id="${memberDoc.id}">
                                <i class="fas fa-power-off" ></i>
                            </button>
                            <button class="btn btn-secondary-custom view-claimed-rewards" data-member-id="${memberDoc.id}">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </td>
                    `;

                    const delButton = newRow.querySelector('.del-button');
                    delButton.addEventListener('click', () => {
                        // Set the user ID in the modal's hidden input
                        document.getElementById('deactivate-member-id').value = memberDoc.id;

                        // Show the modal
                        $('#deactivateUserModal').modal('show');
                    });

                    // Add event listener to the "View Claimed Rewards" button
                    const viewClaimedRewardsButton = newRow.querySelector('.view-claimed-rewards');
                    viewClaimedRewardsButton.addEventListener('click', () => {
                        showClaimedRewardsModal(memberDoc.id); // Call a function to fetch and display claimed rewards
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error fetching active members:", error);
        // Handle the error (e.g., display an error message)
    }
}

// Function to fetch and display claimed rewards in a modal
async function showClaimedRewardsModal(memberId) {
    try {
        // 1. Get reference to the modal body where you'll display the rewards
        const modalBody = document.getElementById('claimedRewardsModalBody'); 
        modalBody.innerHTML = ''; // Clear previous content

        // 2. Fetch the claimed rewards for this member
        const claimedRewardsRef = collection(doc(gymDocRef, 'Members', memberId), 'claimed_rewards');
        const claimedRewardsSnapshot = await getDocs(claimedRewardsRef);

        if (claimedRewardsSnapshot.empty) {
            modalBody.innerHTML = '<p>No claimed rewards yet.</p>';
        } else {
            let rewardsList = '<ul>';
            claimedRewardsSnapshot.forEach(doc => {
                const rewardData = doc.data();
                rewardsList += `<li>${rewardData.rewardName} - Claimed on ${rewardData.createdAt.toDate().toLocaleString()}</li>`;
            });
            rewardsList += '</ul>';
            modalBody.innerHTML = rewardsList;
        }

        // 3. Show the modal
        $('#claimedRewardsModal').modal('show'); 

    } catch (error) {
        console.error("Error fetching claimed rewards:", error);
        alert("An error occurred while fetching claimed rewards.");
    }
}

// Deactivate User Function
async function deactivateUser(memberId) {
    const userRef = doc(gymDocRef, 'Members', memberId);

    try {
        // 1. Update the user's status to 'Deactivated Account'
        await updateDoc(userRef, {
            Status: 'Deactivated Account',
            Points: null
        });

        // 2. Close the modal (if you're using one)
        $('#deactivateUserModal').modal('hide');

        // 3. Provide feedback to the user
        alert(`User ${memberId} has been deactivated.`);

        // 4. Refresh the user list (if necessary)
        displayActiveMembers(); // Or any other function to update your UI

    } catch (error) {
        console.error('Error deactivating user:', error);
        alert('Failed to deactivate user. Please try again.');
    }
}

// Function to fetch and display inactive users
async function displayInactiveUsers() {
    const inactiveUsersList = document.getElementById('inactiveUsersList');
    inactiveUsersList.innerHTML = ''; // Clear previous list

    try {
        const membersCollection = collection(gymDocRef, 'Members');
        const snapshot = await getDocs(query(membersCollection, where('Status', '==', 'Deactivated Account')));

        if (snapshot.empty) {
            // Handle no inactive users found (you can add a row to the table indicating this)
            const newRow = inactiveUsersList.insertRow();
            newRow.innerHTML = `
                <td colspan="3" class="text-center">No inactive users found.</td>
            `;
        } else {
            snapshot.forEach(doc => {
                const user = doc.data();
                const newRow = inactiveUsersList.insertRow();

                // Handle variations in FirstName and LastName fields
                const firstName = user.FirstName || user["First Name"];
                const lastName = user.LastName || user["Last Name"];

                newRow.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${firstName} ${lastName}</td>
                    <td>${user.Email}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary-custom reactivateBtn" data-user-id="${doc.id}">Reactivate</button>
                    </td>
                `;
            });
        }

        // Attach event listeners to reactivate buttons 
        const reactivateBtns = document.querySelectorAll('.reactivateBtn');
        reactivateBtns.forEach(btn => {
            btn.addEventListener('click', reactivateUser);
        });

    } catch (error) {
        console.error('Error fetching inactive users:', error);
        inactiveUsersList.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">Error fetching inactive users. Please try again later.</td>
            </tr>
        `;
    }
}

// Function to reactivate a user
async function reactivateUser(event) {
    const userId = event.target.dataset.userId;

    try {
        confirm('Do you want to reactivate this account?')
        const membersCollection = collection(gymDocRef, 'Members');
        await updateDoc(doc(membersCollection, userId), {
            Status: 'Active User'
        });

        console.log('User reactivated successfully!');

        // Refresh the inactive users list and potentially other parts of your UI
        displayInactiveUsers();
        displayActiveMembers(); // Or any other relevant function to update the active members list

    } catch (error) {
        console.error('Error reactivating user:', error);
        alert('Failed to reactivate user. Please try again.');
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
                        <td>${rewardData.quantity}</td> 
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
                    Points: points,
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
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Failed to add user. Please check the console for details.');
            }
        });

        // Attach event listener to the confirm deactivate button in the modal
        const confirmDeactivateBtn = document.getElementById("confirm-deactivate");
        confirmDeactivateBtn.addEventListener('click', () => {
            const memberId = document.getElementById('deactivate-member-id').value;
            deactivateUser(memberId);
        });

        // Attach click event to the new card
        const deactivatedAccountsCard = document.querySelector('.card:nth-child(3)'); // Assuming it's the 3rd card
        deactivatedAccountsCard.addEventListener('click', (event) => {
            event.preventDefault();
            displayInactiveUsers();
            const inactiveUsersModal = new bootstrap.Modal(document.getElementById('inactiveUsersModal'));
            if (inactiveUsersModal) {
                inactiveUsersModal.show();
                console.log('Modal should be shown'); // Debugging
            } else {
                console.error('Modal element not found');
            }
        });

        const addRewardForm = document.getElementById("add-reward-form")
        addRewardForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const rewardName = document.getElementById('rewardName').value;
            const rewardDescription = document.getElementById('rewardDescription').value;
            const requiredPoints = parseInt(document.getElementById('requiredPoints').value);
            const quantity = parseInt(document.getElementById('quantity').value);

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
                    quantity: quantity,
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
            const newQuantity = parseInt(document.getElementById("updateQuantity").value);

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
                    quantity: newQuantity,
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