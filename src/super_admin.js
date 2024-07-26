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

            // Update UI (Assuming you have a table to display admins)
            const rowId = `${gymId}-${memberId}`;
            const row = document.getElementById(rowId);
            if (row) {
                const cells = row.querySelectorAll('td');
                cells[4].textContent = newBranchName;
                cells[5].textContent = newLocation;
            }
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
    // console.log("gymId:", gymId, "memberId:", memberId);

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

async function deactivateAdmin(gymId, memberId) {
    const gymDocRef = doc(db, 'Gym', gymId);
    const adminDocRef = doc(gymDocRef, 'Members', memberId);

    try {
        // 1. Transaction for Safe Data Transfer
        await runTransaction(db, async (transaction) => {
            const adminDoc = await transaction.get(adminDocRef);

            if (!adminDoc.exists()) {
                throw new Error("Admin not found");
            }
            
            const adminData = adminDoc.data();

            // 2. Create 'deactivated_admins' collection if needed
            const deactivatedAdminsCollection = collection(db, 'deactivated_admins');
            transaction.set(doc(deactivatedAdminsCollection, gymId), adminData);

            // 3. Remove from 'Gym' collection
            transaction.delete(adminDocRef);
            
            // 4. Update Status for display
            transaction.update(adminDocRef, { Status: 'Deactivated Admin'});
        });

        alert(`Admin ${memberId} from gym ${gymId} has been deactivated.`);

    } catch (error) {
        console.error('Error deactivating admin:', error);
        alert('Failed to deactivate admin. Please try again.');
    }
}

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
                            <button class="btn btn-secondary-custom del-button"><i class="fas fa-power-off" data-bs-toggle="modal" data-bs-target="#deleteAdminModal" data-gym-id="${gymDoc.id.replace('GYM', '')}" data-member-id="${memberDoc.id}"></i></button>
                            <button class="btn btn-secondary-custom" onclick="manageUsers('${gymDoc.id}', '${memberDoc.id}')"><i class="fas fa-users"></i></button>
                            <button class="btn btn-secondary-custom" onclick="manageRewards('${gymDoc.id}', '${memberDoc.id}')"><i class="fas fa-medal"></i></button>
                        </td>
                    `;
                    adminList.appendChild(newRow);

                    // Add an event listener to the edit button after it's added to the DOM
                    const editButton = newRow.querySelector('.edit-button');
                    editButton.addEventListener('click', () => openEditAdminModal(gymDoc.id.replace('GYM', ''), memberDoc.id));
                    const deleteButton = newRow.querySelector('.del-button');
                    deleteButton.addEventListener('click', () => deactivateAdmin(gymDoc.id.replace('GYM', ''), memberDoc.id));
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