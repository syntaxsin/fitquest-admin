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
const colRef = collection(db, 'rewards')

const q = query(colRef, orderBy('createdAt'))

onSnapshot(q, (snapshot) => {
    let rewards = []
    snapshot.docs.forEach((doc) => {
        rewards.push({ ...doc.data(), id: doc.id})
    })
    console.log(rewards)
})

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
    
            headerNames.push("Update Points");
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
                updatePointsButton.textContent = 'Add / Remove';
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
                            'users', 'users-list', 
                            ['email', 'firstName', 'lastName', 'points'], 
                            ['User ID', 'E-mail Address', 'First Name', 'Last Name', 'Points'] 
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
    const userRef = doc(db, "users", documentId);
    const docSnap = await getDoc(userRef);
  
    if (docSnap.exists()) {
        document.getElementById("documentId").value = documentId;
        document.getElementById("updatePointsModal").style.display = "flex";
    
        // Update event listeners
        document.getElementById("addPointsBtn").onclick = () => {
            const pointsChange = parseInt(document.getElementById("pointsChange").value);
            updatePoints(documentId, pointsChange, "add"); // Pass 'add' as the operation
        };
    
        document.getElementById("removePointsBtn").onclick = () => {
            const pointsChange = parseInt(document.getElementById("pointsChange").value);
            updatePoints(documentId, pointsChange, "remove"); // Pass 'remove' as the operation
        };
    } else {
        console.log("No such document!");
    }
}
  
async function updatePoints(documentId, pointsChange, operation) {
    if (pointsChange <= 0) {
      alert("Please enter a positive number.");
      return;
    }
  
    try {
      const userRef = doc(db, "users", documentId);

      await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) {
                throw new Error("Document does not exist!");
            }
  
            let newPoints = userDoc.data().points || 0; // Default to 0 if points don't exist
  
            if (operation === "add") {
              newPoints += pointsChange;
            } else if (operation === "remove") {
                newPoints = Math.max(0, newPoints - pointsChange); // Ensure points don't go below 0
            }
  
            transaction.update(userRef, { points: newPoints });
        });
        closeUpdatePointsModal();
        alert('Points updated successfully');
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Failed to update points. Please try again.");
    }
}