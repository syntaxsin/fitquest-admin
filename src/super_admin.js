import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where, runTransaction,
    orderBy, serverTimestamp,
    getDoc, updateDoc, setDoc
} from 'firebase/firestore';
import {
    getAuth, deleteUser,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
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

const SUPER_ADMIN_EMAIL = 'superadmin_fitquest@atmr.dev';

const logoutButton = document.querySelector('.logout'); 
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
        // Optionally, clear any stored user data
        localStorage.removeItem('superAdmin');
        sessionStorage.removeItem('superAdmin');

        window.location.href = '../index.php'; // Replace with your actual login page URL
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User Created:', userCredential);

        const gymQuery = query(collection(db, 'Gym'));
        const gymsSnapshot = await getDocs(gymQuery);

        let maxGymNumber = 0;
        gymsSnapshot.forEach((doc) => {
            const gymNumberMatch = doc.id.match(/GYM(\d+)/); // Match GYM followed by numbers
            if (gymNumberMatch) {
                const gymNumber = parseInt(gymNumberMatch[1]); 
                maxGymNumber = Math.max(maxGymNumber, gymNumber);
            }
        });

        const newGymNumber = maxGymNumber + 1;
        const newGymCollectionName = `GYM${String(newGymNumber).padStart(3, '0')}`;

        const gymDocRef = doc(db, 'Gym', newGymCollectionName);
        console.log('Gym Doc Ref:', gymDocRef.path);
        await setDoc(gymDocRef, {
            Location: location,
            Name: branch
        });

        const membersCollection = collection(gymDocRef, 'Members');
        const membersSnapshot = await getDocs(membersCollection);
        const existingMemberIds = membersSnapshot.docs.map(doc => doc.id);

        function generateNextId(existingIds) {
            const prefix = "A";
            const maxId = existingIds
                .filter(id => id.startsWith(prefix))
                .map(id => parseInt(id.replace(prefix, ''), 10))
                .reduce((max, current) => Math.max(max, current), 0);
            return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
        }

        const newAdminId = generateNextId(existingMemberIds);

        await setDoc(doc(membersCollection, newAdminId), {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Status: 'Active Admin',
            createdAt: serverTimestamp(),
        });

        const rewardsCollection = collection(gymDocRef, 'Rewards');
        console.log('Rewards Collection Ref:', rewardsCollection.path);

        const defaultRewards = [{ 
            rewardName: "1 Personal Traning Session", 
            rewardDescription: "Voucher", 
            requiredPoints: 100, 
            status: "Claimable" 
        }];
    
        // Function to generate the next RWD ID
        async function generateNextRewardId() {
            const rewardQuery = query(rewardsCollection, orderBy("rewardId", "desc"));
            const rewardsSnapshot = await getDocs(rewardQuery);
            let maxRewardNumber = 0;

            rewardsSnapshot.forEach((doc) => {
                const rewardNumberMatch = doc.data().rewardId.match(/RWD(\d+)/); // Match RWD followed by numbers
                if (rewardNumberMatch) {
                    const rewardNumber = parseInt(rewardNumberMatch[1]);
                    maxRewardNumber = Math.max(maxRewardNumber, rewardNumber);
                }
            });

            const newRewardNumber = maxRewardNumber + 1;
            return `RWD${String(newRewardNumber).padStart(3, '0')}`; 
        }

        const addRewardPromises = defaultRewards.map(async (reward) => {
            const rewardId = await generateNextRewardId(); 
            return setDoc(doc(rewardsCollection, rewardId), { ...reward, rewardId });
        });

        await Promise.all(addRewardPromises)

        alert(`Admin added successfully to ${newGymCollectionName} with ID ${newAdminId}!`);
        addAdminForm.reset();
    } catch (error) {
        console.error('Error adding admin:', error);
        alert('Failed to add admin. Please check the console for details.');
    }
});

// Update Admin Form Submission
const updateAdminForm = document.getElementById('edit-admin-form');
updateAdminForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const gymId = document.getElementById('edit-gym-id').value;
    const memberId = document.getElementById('edit-member-id').value;
    const newBranchName = document.getElementById('edit-branch-name').value;
    const newLocation = document.getElementById('edit-location').value;

    const gymCollectionName = `GYM${gymId}`; // Construct gym collection name

    const gymDocRef = doc(db, 'Gym', gymCollectionName);
    const adminDocRef = doc(gymDocRef, 'Members', memberId);

    try {
        await runTransaction(db, async (transaction) => {
            const gymDoc = await transaction.get(gymDocRef);
            const adminDoc = await transaction.get(adminDocRef);

            if (!gymDoc.exists() || !adminDoc.exists()) {
                throw new Error("Gym or admin data not found.");
            }

            const updatedGymData = { ...gymDoc.data(), Name: newBranchName, Location: newLocation };
            transaction.update(gymDocRef, updatedGymData);

            transaction.update(adminDocRef, { GymName: newBranchName });
        });

        console.log("Gym information updated successfully.");
        alert("Gym information updated successfully.");
    } catch (error) {
        console.error('Error updating admin:', error);
        alert('Failed to update admin information. Please try again.');
    } finally {
        updateAdminForm.reset();
        $('#editAdminModal').modal('hide');
    }
});


function openEditAdminModal(gymId, memberId) {
    document.getElementById('edit-gym-id').value = gymId;
    document.getElementById('edit-member-id').value = memberId;

    // Fetch the gym document to populate the input fields
    const gymRef = doc(db, "Gym", `GYM${gymId}`); 

    getDoc(gymRef)
        .then((doc) => {
            if (doc.exists()) {
                const gymData = doc.data();
                document.getElementById('edit-branch-name').value = gymData.Name;
                document.getElementById('edit-location').value = gymData.Location;

                $('#editAdminModal').modal('show');
            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
}

// Deactivate Admin Function
// const deactivateAdminForm = document.getElementById("deleteAdminModal");
const confirmDeactivateButton = document.getElementById("confirm-delete");
confirmDeactivateButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const gymId = document.getElementById('delete-gym-id').value;
    const memberId = document.getElementById('delete-member-id').value;

    const gymCollectionName = `GYM${gymId}`;
    const gymDocRef = doc(db, 'Gym', gymCollectionName);
    const adminDocRef = doc(gymDocRef, 'Members', memberId);

    try {
        // 1. Get the Gym document data
        const gymDoc = await getDoc(gymDocRef);
        const gymData = gymDoc.data();

        // 2. Create 'deactivated_admins' collection if it doesn't exist
        const deactivatedAdminsCollection = collection(db, 'deactivated_admins');
        const deactivatedGymDocRef = doc(deactivatedAdminsCollection, gymCollectionName);

        await runTransaction(db, async (transaction) => {
        // 3. Copy the Gym document data to 'deactivated_admins'
        transaction.set(deactivatedGymDocRef, gymData);

        // 4. Copy the 'Members' subcollection documents 
        const membersCollection = collection(gymDocRef, 'Members');
        const membersSnapshot = await getDocs(membersCollection);
        const deactivatedMembersCollection = collection(deactivatedGymDocRef, 'Members');
        membersSnapshot.forEach(memberDoc => {
            // Update the admin's status to 'Deactivated' if it matches the memberId
            const memberData = memberDoc.data();
            if (memberDoc.id === memberId) {
            memberData.Status = 'Deactivated';
            }
            transaction.set(doc(deactivatedMembersCollection, memberDoc.id), memberData);
        });

        // 5. Copy the 'Rewards' subcollection documents
        const rewardsCollection = collection(gymDocRef, 'Rewards');
        const rewardsSnapshot = await getDocs(rewardsCollection);
        const deactivatedRewardsCollection = collection(deactivatedGymDocRef, 'Rewards');
        rewardsSnapshot.forEach(rewardDoc => {
            transaction.set(doc(deactivatedRewardsCollection, rewardDoc.id), rewardDoc.data());
        });

        // 6. Delete the Gym document and its subcollections
        transaction.delete(gymDocRef);
        });

        $('#deleteAdminModal').modal('hide');

        alert(`Admin ${memberId} from gym ${gymId} has been deactivated.`);
        displayAdmins();

    } catch (error) {
        console.error('Error deactivating admin:', error);
        alert('Failed to deactivate admin. Please try again.');
    }
});

// Fetch and display admin data
function displayAdmins() {
    const adminList = document.querySelector("#admin-list tbody");
    adminList.innerHTML = ''; // Clear existing data

    const gymQuery = query(collection(db, 'Gym'));
    onSnapshot(gymQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added' || change.type === 'modified') {
                const gymDoc = change.doc;
                const gymData = gymDoc.data();
                const membersCollection = collection(gymDoc.ref, 'Members');
                const membersQuery = query(membersCollection, where("Status", "==", "Active Admin"));

                const membersSnapshot = await getDocs(membersQuery);
                membersSnapshot.forEach((memberDoc) => {
                    const adminData = memberDoc.data();
                    const status = adminData.Status;

                    const rowId = `${gymDoc.id}-${memberDoc.id}`;
                    const existingRow = document.getElementById(rowId); // Check if row already exists
                    if(existingRow) {
                        existingRow.remove(); // Remove the row if it exists (to avoid duplicates)
                    }

                    const newRow = document.createElement('tr');
                    newRow.id = rowId;
                    newRow.innerHTML = `
                        <td>${gymDoc.id}</td>
                        <td>${adminData.FirstName}</td>
                        <td>${adminData.LastName}</td>
                        <td>${adminData.Email}</td>
                        <td>${gymData.Name}</td>
                        <td>${gymData.Location}</td>
                        <td>${status}</td>
                        <td>
                            <button class="btn btn-secondary-custom edit-button" data-bs-toggle="modal" data-bs-target="#editAdminModal" data-gym-id="${gymDoc.id}" data-member-id="${memberDoc.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-secondary-custom del-button" data-bs-toggle="modal" data-bs-target="#deleteAdminModal" data-gym-id="${gymDoc.id.replace('GYM', '')}" data-member-id="${memberDoc.id}">
                                <i class="fas fa-power-off" ></i>
                            </button>
                        </td>
                    `;
                    adminList.appendChild(newRow);

                    // Add an event listener to the edit button after it's added to the DOM
                    const editButton = newRow.querySelector('.edit-button');
                    editButton.addEventListener('click', () => openEditAdminModal(gymDoc.id.replace('GYM', ''), memberDoc.id));

                    // Attach event listener to the del-button *after* it's added to the DOM
                    const delButton = newRow.querySelector('.del-button');
                    delButton.addEventListener('click', () => {
                        // Set hidden input values
                        document.getElementById('delete-gym-id').value = gymDoc.id.replace('GYM', '');
                        document.getElementById('delete-member-id').value = memberDoc.id;

                        // Show the modal (using Bootstrap's JavaScript API)
                        $('#deleteAdminModal').modal('show');
                    });
                });

            } else if (change.type === 'removed') {
                const gymDoc = change.doc;
                const membersCollection = collection(gymDoc.ref, 'Members');
                const membersQuery = query(membersCollection, where("Status", "==", "Active Admin"));
                
                const membersSnapshot = await getDocs(membersQuery);
                membersSnapshot.forEach((memberDoc) => {
                    const rowId = `${gymDoc.id}-${memberDoc.id}`;
                    const row = document.getElementById(rowId);
                    if (row) {
                        row.remove();
                    }
                });
            }
        });
    });
}
displayAdmins();

async function displayDeactivatedAdmins() {
    const deactAdminList = document.querySelector("#deact-list tbody"); 
    deactAdminList.innerHTML = ""; 

    const deactivatedAdminsCollection = collection(db, 'deactivated_admins');
    const deactivatedGymDocRef = doc(deactivatedAdminsCollection, gymCollectionName);
  
    try {
        // 1. Fetch all deactivated gyms from 'deactivated_admins'
        const deactivatedAdminsCollection = collection(db, 'deactivated_admins');
        const deactivatedGymsSnapshot = await getDocs(deactivatedAdminsCollection);
    
        deactivatedGymsSnapshot.forEach(async (deactivatedGymDoc) => {
            const deactivatedGymData = deactivatedGymDoc.data();
            
            // 2. Get 'Members' subcollection within the deactivated gym
            const deactivatedMembersCollection = collection(deactivatedGymDocRef, 'Members');
            const deactivatedMembersSnapshot = await getDocs(deactivatedMembersCollection);
    
            // 3. Find the deactivated admin within the 'Members' subcollection
            const deactivatedAdminDoc = deactivatedMembersSnapshot.docs.find(
            doc => doc.data().Status === 'Deactivated'
            );
    
            if (deactivatedAdminDoc) {
            const deactivatedAdminData = deactivatedAdminDoc.data();
    
            // 4. Create a new row for the deactivated admin
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${deactivatedAdminData.id}</td> 
                <td>${deactivatedGymData.Name}</td>
                <td>${deactivatedGymData.Location}</td>
                <td>${deactivatedAdminData.Status}</td>
                <td>
                <button class="btn btn-secondary-custom reactivate-button" 
                        data-gym-id="${deactivatedGymDoc.id}" 
                        data-member-id="${deactivatedAdminData.id}">
                    <i class="fas fa-power-off"></i> 
                </button>
                </td>
            `;
            deactAdminList.appendChild(newRow);
    
            // 5. Attach event listener to the reactivate button (implementation needed)
            const reactivateButton = newRow.querySelector('.reactivate-button');
            reactivateButton.addEventListener('click', () => {
                // You'll need to implement the reactivation logic here
                console.log("Reactivate button clicked for:", deactivatedGymDoc.id, deactivatedAdminData.id);
            });
            }
        });
    } catch (error) {
      console.error("Error displaying deactivated admins:", error);
      // Handle the error appropriately
    }
  }