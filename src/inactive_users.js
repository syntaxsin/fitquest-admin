import { initializeApp } from "firebase/app"
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDocs,
    query, where, limit,
    orderBy, serverTimestamp,
    getDoc, updateDoc, setDoc, runTransaction
} from 'firebase/firestore'
import {
    getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword,
    createUserWithEmailAndPassword, deleteUser, updateProfile,
    EmailAuthProvider, reauthenticateWithCredential
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
const auth = getAuth()

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
                const updatePointsButton = document.createElement('button');
                updatePointsButton.textContent = 'Activate';
                updatePointsButton.addEventListener('click', () => handleUpdate(doc.id));
        
                actionCell.appendChild(updatePointsButton);
            });
        });
    } catch (error) {
      console.error("Error fetching and displaying documents:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) { // Check if user is logged in
        const docRef = doc(db, "admin", user.uid);  // Use user's UID directly
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.email.endsWith('@atmr.dev')) {
                        fetchAndDisplayDocuments(
                            'inactive_users', 'users-list', 
                            ['email', 'firstName', 'lastName', 'points', 'status'], 
                            ['User ID', 'E-mail Address', 'First Name', 'Last Name', 'Points', 'Status'] 
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

async function handleUpdate(documentId) {
    const userRef = doc(db, "inactive_users", documentId); 
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        document.getElementById("user_id_to_delete").value = documentId;
        document.getElementById("activateUserModal").style.display = "flex";
    } else {
        console.log("No such document!");
    }
}

// Event listener for the "Activate" confirmation form
const activateUserForm = document.getElementById('deleteUserForm'); // Re-use the existing form
activateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const userId = document.getElementById("user_id_to_delete").value;

    try {
        await runTransaction(db, async (transaction) => {
            const inactiveUserRef = doc(db, "inactive_users", userId);
            const activeUserRef = doc(db, "users", userId);

            const userData = await transaction.get(inactiveUserRef);

            if (!userData.exists()) {
                throw new Error("User data not found in inactive_users.");
            }

            // Update the status to "active"
            const updatedUserData = {
                ...userData.data(),
                status: "active"
            };

            // Set the data in the "users" collection (activate)
            transaction.set(activeUserRef, updatedUserData);

            // Delete the document from the "inactive_users" collection
            transaction.delete(inactiveUserRef);
        });

        console.log("User activated successfully.");
        alert("User activated successfully.");
    } catch (error) {
        alert(`Error activating user: ${error.message}`);
        console.error(error);
    } finally {
        activateUserForm.reset();
        document.getElementById("activateUserModal").style.display = "none"; 
    }
});

function closeUserModal() {
    document.getElementById("activateUserModal").style.display = "none";
}