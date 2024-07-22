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
import { getFunctions, httpsCallable} from 'firebase/functions'

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

// queries
const q = query(colRef, orderBy('createdAt'))
const userQuery = query(userRef, orderBy('createdAt'))

// real-time collection data from the firestore database
onSnapshot(q, (snapshot) => {
    let rewards = []
    snapshot.docs.forEach((doc) => {
        rewards.push({ ...doc.data(), id: doc.id})
    })
    console.log(rewards)
})

onSnapshot(userQuery, (snapshot) => {
    let users = []
    snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id})
    })
    console.log(users)
})


//real-time display 
async function getDocumentCount(collectionName) {
    try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.size;
    } catch (error) {
        console.error(`Error getting document count for ${collectionName}:`, error);
        return 0;
    }
}

async function updateDocumentCountDisplays() {
    const userCount = await getDocumentCount('users');
    const rewardCount = await getDocumentCount('rewards');

    const userCountElement = document.querySelector('.card:nth-child(1) .box h1');
    const rewardCountElement = document.querySelector('.card:nth-child(2) .box h1');

    if (userCountElement) userCountElement.textContent = userCount;
    if (rewardCountElement) rewardCountElement.textContent = rewardCount;
}

// Real-time updates for users
const usersCollection = collection(db, 'users');
onSnapshot(usersCollection, async (snapshot) => {
    const userCount = snapshot.size;
    const userCountElement = document.querySelector('.card:nth-child(1) .box h1');
    if (userCountElement) userCountElement.textContent = userCount;
});

// Real-time updates for rewards
const rewardsCollection = collection(db, 'rewards');
onSnapshot(rewardsCollection, async (snapshot) => {
    const rewardCount = snapshot.size;
    const rewardCountElement = document.querySelector('.card:nth-child(2) .box h1');
    if (rewardCountElement) rewardCountElement.textContent = rewardCount;
});

updateDocumentCountDisplays();

// log-out
const logOut = document.getElementById('logout')
logOut.addEventListener('click', () => {
    fetch('destroy_session.php') // Send a request to destroy the session
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
        })
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
})

//add user
const addUser = document.querySelector('.addUserForm');
addUser.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fname = document.getElementById('add-fname').value;
    const lname = document.getElementById('add-lname').value;
    const email = document.getElementById('add-email').value;
    const password = document.getElementById('add-password').value;

    try {
        let userCredential;

        // 3. Create User in Authentication 
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // 4. Store User Data in Firestore (using the custom ID)
        const user_data = {
            firstName: fname,
            lastName: lname,
            email: email,
            points: null,
            createdAt: serverTimestamp(),
            status: 'active',

        };
        
        // determine the collection based on the email, and use the new ID
        const collectionName = email.includes('admin@atmr.dev') ? 'admin' : 'users';
        const userUID = userCredential.user.uid; 
        const docRef = doc(db, collectionName, userUID); 

        await setDoc(docRef, user_data);
        alert('Account created successfully!');
        
    } catch (err) {
        const errCode = err.code;
        if (errCode === 'auth/email-already-in-use') {
            alert('E-mail Address Already Exists.');
        } else {
            alert('Unable to add User');
            console.error('Error:', err); // Log the error for debugging
        }
    }
});

async function generateRewardID(collectionName, prefix) {
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

    const formattedRewardId = await generateRewardID('rewards', 'RWD');

    // Use formattedRewardId as the document ID
    const rewardDocRef = doc(colRef, formattedRewardId); // No need to specify the document ID here

    await setDoc(rewardDocRef, {
        rewardName: addRewardForm.rewardName.value,
        rewardDescription: addRewardForm.rewardDescription.value,
        requiredPoints: parseInt(addRewardForm.requiredPoints.value),
        quantity: parseInt(addRewardForm.rewardQuantity.value),
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

const updateRewardForm = document.querySelector('.updateReward');
updateRewardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const documentNumberToUpdate = document.getElementById("reward_id").value; 
    const newRewardName = document.getElementById("updateRewardName").value; 
    const newRewardDescription = document.getElementById("updateRewardDescription").value;
    const newRequiredPoints = parseInt(document.getElementById("updateRequiredPoints").value);
    const updateQuantity = parseInt(document.getElementById("updateQuantity").value);

    try {
        const rewardDocRef = doc(db, 'rewards', documentNumberToUpdate);

        await updateDoc(rewardDocRef, {
            rewardName: newRewardName,
            rewardDescription: newRewardDescription,
            requiredPoints: newRequiredPoints,
            quantity: updateQuantity,
        });

        updateRewardForm.reset();
        closeUpdateRewardModal();
        alert('Reward updated successfully');
    } catch (err) {
        alert(`Error updating reward: ${err.message}`);
        console.error(err);
    }
});

// Modify handleUpdate and handleDelete for documentNumber
async function handleUpdate(documentNumber) {
    const docRef = doc(db, "rewards", documentNumber);
    const docSnap = await getDoc(docRef);
    const rewardData = docSnap.data();
    if (docSnap.exists()) {
        document.getElementById("reward_id").value = documentNumber;
        document.getElementById("updateRewardName").value = rewardData.rewardName;
        document.getElementById("updateRewardDescription").value = rewardData.rewardDescription;
        document.getElementById("updateRequiredPoints").value = rewardData.requiredPoints;
        document.getElementById("updateQuantity").value = rewardData.quantity;
        document.getElementById("updateRewardModal").style.display = "flex";
    } else {
        console.log("No such document!");
    }
}

let itemToDeleteId;
let itemToDeleteType;

// Modify handleDelete to work with separate forms
async function handleDelete(itemId, itemType) {
    itemToDeleteId = itemId;
    itemToDeleteType = itemType;

    if (itemType === 'users') {
        document.getElementById('deleteUserConfirmationMessage').textContent = `Are you sure you want to delete User ID: ${itemId}?`;
        document.getElementById('deleteUserModal').style.display = 'block';
    } else if (itemType === 'rewards') {
        document.getElementById('deleteRewardConfirmationMessage').textContent = `Are you sure you want to delete Reward ID: ${itemId}?`;
        document.getElementById('reward_id_to_delete').value = itemId;
        document.getElementById('deleteRewardModal').style.display = 'flex';
    }
}

// Modify the event listeners to target specific forms
const deleteUserForm = document.getElementById('deleteUserForm');
deleteUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const userId = itemToDeleteId;

    try {
        // Transaction to ensure atomicity (all or nothing)
        await runTransaction(db, async (transaction) => {
            // Get the user document reference from the correct collection
            const userRef = doc(db, itemToDeleteType, userId); // Use itemToDeleteType to get the collection

            // Get user data within the transaction
            const userData = await transaction.get(userRef);

            if (!userData.exists()) {
                throw new Error("User data not found.");
            }

            // Create updated user data with 'inactive' status
            const updatedUserData = {
                ...userData.data(),
                status: "inactive"
            };

            // Set the data in inactive_users collection
            transaction.set(doc(db, "inactive_users", userId), updatedUserData);

            // Delete the document from the original collection
            transaction.delete(userRef);
        });

        console.log("User moved to inactive_users collection successfully.");
        alert("User Account Deactivated");
    } catch (error) {
        alert(`Error moving user: ${error.message}`);
        console.error(error);
    } finally {
        // Always reset the form, regardless of success or failure
        deleteUserForm.reset();
        document.getElementById('deleteUserModal').style.display = 'none'; // Close the modal
    }
});

const deleteRewardForm = document.querySelector('.deleteReward');
deleteRewardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        await deleteDoc(doc(db, "rewards", itemToDeleteId));
        console.log("Reward deleted successfully.");
    } catch (err) {
        alert(`Error deleting reward: ${err.message}`);
        console.error(err);
    }

    deleteRewardForm.reset();
    alert('Reward deleted successfully'); 
});

//real-time table display of users and rewards
async function fetchAndDisplayDocuments(collectionName, containerId, fieldOrder, headerNames) {
    try {
        const collectionRef = collection(db, collectionName); // Reference to the collection
        const container = document.getElementById(containerId);
        let table, tbody;
  
        onSnapshot(collectionRef, (snapshot) => { // Listen on the collection reference
            if (!table) {
            container.innerHTML = ''; 
            table = document.createElement('table');
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
    
            headerNames.push("Action");
            headerNames.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
    
            tbody = table.createTBody();
            container.appendChild(table);
            } else {
            tbody.innerHTML = ''; 
            }
    
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const row = tbody.insertRow();
        
                // Displaying Document ID in the first column
                const idCell = row.insertCell();
                idCell.textContent = doc.id; // This will display the custom ID
        
                fieldOrder.forEach(key => {
                    const cell = row.insertCell();
                    cell.textContent = data[key] || ""; 
                });
                
        
                const actionCell = row.insertCell();
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.addEventListener('click', () => handleUpdate(doc.id));
        
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => handleDelete(doc.id, collectionName));
        
                actionCell.appendChild(updateButton);
                actionCell.appendChild(deleteButton);
            });
        });
    } catch (error) {
      console.error("Error fetching and displaying documents:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) { // Check if user is logged in
        const docRef = doc(db, "admin", user.uid); // Use user's UID directly
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.email.endsWith('@atmr.dev')) {
                        fetchAndDisplayDocuments(
                            'rewards', 'rewards-list', 
                            ['rewardName', 'rewardDescription', 'requiredPoints', 'quantity'], 
                            ['Reward ID', 'Reward Name', 'Description', 'Required Points', 'Quantity']
                        );
                        fetchAndDisplayDocuments(
                            'users', 'users-list', 
                            ['email', 'firstName', 'lastName', 'status'], 
                            ['User ID', 'E-mail Address', 'First Name', 'Last Name', 'Status'] 
                        );
                    } else {
                        console.log('Non-admin account. Denied.');
                        // Potentially redirect to a non-admin page
                    }
                } else {
                    console.log("No admin document found for this user.");
                    // Potentially redirect to login or another appropriate page
                }
            })
            .catch((err) => {
                console.error("Error fetching document:", err);
            });
    } else {
        console.log("User is not logged in."); 
        // Consider redirecting to login
    }
});