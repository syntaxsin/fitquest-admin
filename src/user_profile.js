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
const announcementsContent = document.getElementById('announcementsContent');
const blogsContent = document.getElementById('blogsContent');

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
                    }).catch((error) => {
                        console.error("Error fetching first weight entry:", error);
                        firstWeightEntryElement.textContent = "Error fetching weight entry";
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
                    }).catch((error) => {
                        console.error("Error fetching last weight entry:", error);
                        lastWeightEntryElement.textContent = "Error fetching weight entry";
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
                        pendingRewardsList.innerHTML = ''; // Clear the list in case of an error
                        const listItem = document.createElement('li');
                        listItem.textContent = "Error fetching pending rewards";
                        pendingRewardsList.appendChild(listItem);
                    });

                    // Fetch and display announcements
                    fetchAndDisplayAnnouncements(gymId);

                    // Fetch and display blogs
                    fetchAndDisplayBlogs(gymId);

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

// Function to fetch and display announcements
function fetchAndDisplayAnnouncements(gymId) {
    // Assuming you have an 'Announcements' collection under the 'Gym' document
    const announcementsRef = collection(db, 'Gym', gymId, 'Announcements');

    getDocs(announcementsRef)
        .then((announcementsSnapshot) => {
            announcementsContent.innerHTML = '';

            if (!announcementsSnapshot.empty) {
                for (const doc of announcementsSnapshot.docs) {
                    const announcementData = doc.data();

                    // Create HTML elements to display the announcement
                    const announcementElement = document.createElement('div');
                    announcementElement.innerHTML = `
                        <h3>${announcementData.title}</h3> 
                        <p>${announcementData.content}</p>
                        <p>Posted on: ${announcementData.createdAt.toDate().toLocaleDateString()}</p> 
                    `;
                    announcementsContent.appendChild(announcementElement);
                }
            } else {
                announcementsContent.innerHTML = "<p>No announcements yet.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching announcements:", error);
            announcementsContent.innerHTML = "<p>Error fetching announcements.</p>";
        });
}

// Function to fetch and display blogs
function fetchAndDisplayBlogs(gymId) {
    // Assuming you have a 'BlogPosts' collection under the 'Gym' document
    const blogsRef = collection(db, 'Gym', gymId, 'BlogPosts');

    getDocs(blogsRef)
        .then((blogsSnapshot) => {
            blogsContent.innerHTML = '';

            if (!blogsSnapshot.empty) {
                for (const doc of blogsSnapshot.docs) {
                    const blogData = doc.data();

                    const blogElement = document.createElement('div');
                    blogElement.innerHTML = `
              <h3>${blogData.title}</h3> 
              <p>By: ${blogData.author}</p>
              <p>${blogData.content}</p>
              <p>Posted on: ${blogData.createdAt.toDate().toLocaleDateString()}</p> 
            `;
                    blogsContent.appendChild(blogElement);
                }
            } else {
                blogsContent.innerHTML = "<p>No blogs yet.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching blogs:", error);
            blogsContent.innerHTML = "<p>Error fetching blogs.</p>";
        });
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
