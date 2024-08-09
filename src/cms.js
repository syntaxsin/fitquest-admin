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

// For Verifying Rewards
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

//---------------------Content Management Functions---------------------//

// Function to add an announcement
async function addAnnouncement(event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    const priority = document.getElementById('announcementPriority').value;

    try {
        const announcementsCollection = collection(gymDocRef, 'Announcements');
        await addDoc(announcementsCollection, {
            title,
            content,
            priority,
            createdAt: serverTimestamp()
        });

        alert('Announcement added successfully!');
        // Clear the form or update the UI as needed
        document.getElementById('add-announcement-form').reset();
        displayAnnouncements(); // Refresh the announcements table
    } catch (error) {
        console.error('Error adding announcement:', error);
        alert('Failed to add announcement. Please try again.');
    }
}

document.getElementById('add-announcement-form').addEventListener('submit', addAnnouncement);
document.getElementById('edit-announcement-form').addEventListener('submit', updateAnnouncement);

// Function to display announcements in the table
async function displayAnnouncements() {
    const announcementsTableBody = document.getElementById('announcements-table-body');
    announcementsTableBody.innerHTML = ''; // Clear existing data

    try {
        const announcementsCollection = collection(gymDocRef, 'Announcements');
        const announcementsSnapshot = await getDocs(announcementsCollection);

        announcementsSnapshot.forEach(doc => {
            const announcementData = doc.data();
            const newRow = announcementsTableBody.insertRow();

            const displayDate = announcementData.updatedAt
                ? announcementData.updatedAt.toDate().toLocaleString()
                : announcementData.createdAt.toDate().toLocaleString();

            newRow.innerHTML = `
                <td>${announcementData.title}</td>
                <td>${displayDate}</td> 
                <td>${announcementData.priority}</td>
                <td>
                    <button class="btn btn-secondary-custom view-announcement-btn" data-announcement-id="${doc.id}">
                    <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary-custom edit-announcement-btn" data-announcement-id="${doc.id}">
                    <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary-custom delete-announcement-btn" data-announcement-id="${doc.id}">
                    <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            // Attach event listener to the view button
            const viewButton = newRow.querySelector('.view-announcement-btn');
            viewButton.addEventListener('click', () => {
                viewAnnouncement(doc.id);
            });

            // Attach event listener to the edit button
            const editButton = newRow.querySelector('.edit-announcement-btn');
            editButton.addEventListener('click', () => {
                populateEditAnnouncementModal(doc.id);
            });

            // Attach event listener to the delete button
            const deleteButton = newRow.querySelector('.delete-announcement-btn');
            deleteButton.addEventListener('click', () => {
                deleteAnnouncement(doc.id);
            });
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        // Handle the error (e.g., display an error message)
    }
}

// Function to view an announcement in a modal
async function viewAnnouncement(announcementId) {
    try {
        const announcementDocRef = doc(gymDocRef, 'Announcements', announcementId);
        const announcementDoc = await getDoc(announcementDocRef);

        if (announcementDoc.exists()) {
            const announcementData = announcementDoc.data();

            // Populate the modal with announcement data
            document.getElementById('modalAnnouncementTitle').textContent = announcementData.title;
            document.getElementById('modalAnnouncementContent').textContent = announcementData.content;
            document.getElementById('modalAnnouncementPriority').textContent = announcementData.priority;
            
            // Handle the date display
            const displayDate = announcementData.updatedAt 
                ? announcementData.updatedAt.toDate().toLocaleString() 
                : announcementData.createdAt.toDate().toLocaleString();
            document.getElementById('modalAnnouncementDate').textContent = displayDate;

            // Show the modal
            $('#viewAnnouncementModal').modal('show');
        } else {
            console.log("Announcement not found");
            // Handle the case where the announcement document is not found
        }
    } catch (error) {
        console.error("Error fetching announcement data:", error);
        // Handle the error appropriately
    }
}

// Function to populate the edit announcement modal
async function populateEditAnnouncementModal(announcementId) {
    try {
        const announcementDocRef = doc(gymDocRef, 'Announcements', announcementId);
        const announcementDoc = await getDoc(announcementDocRef);

        if (announcementDoc.exists()) {
            const announcementData = announcementDoc.data();

            // Populate the modal fields
            document.getElementById('editAnnouncementId').value = announcementId;
            document.getElementById('editAnnouncementTitle').value = announcementData.title;
            document.getElementById('editAnnouncementContent').value = announcementData.content;
            document.getElementById('editAnnouncementPriority').value = announcementData.priority;

            // Show the modal
            $('#editAnnouncementModal').modal('show');
        } else {
            console.log("Announcement not found");
            // Handle the case where the announcement document is not found
        }
    } catch (error) {
        console.error("Error fetching announcement data:", error);
        // Handle the error appropriately
    }
}

// Function to update an announcement
async function updateAnnouncement(event) {
    event.preventDefault();

    const announcementId = document.getElementById('editAnnouncementId').value;
    const title = document.getElementById('editAnnouncementTitle').value;
    const content = document.getElementById('editAnnouncementContent').value;
    const priority = document.getElementById('editAnnouncementPriority').value;

    try {
        const announcementDocRef = doc(gymDocRef, 'Announcements', announcementId);
        await updateDoc(announcementDocRef, {
            title,
            content,
            priority,
            updatedAt: serverTimestamp()
        });

        alert('Announcement updated successfully!');
        $('#editAnnouncementModal').modal('hide');
        displayAnnouncements(); // Refresh the announcements table
    } catch (error) {
        console.error('Error updating announcement:', error);
        alert('Failed to update announcement. Please try again.');
    }
}

// Function to delete an announcement
async function deleteAnnouncement(announcementId) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        try {
            const announcementDocRef = doc(gymDocRef, 'Announcements', announcementId);
            await deleteDoc(announcementDocRef);

            alert('Announcement deleted successfully!');
            displayAnnouncements(); // Refresh the announcements table
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement. Please try again.');
        }
    }
}

displayAnnouncements();

//-----------------> For Blog Posts / Articles

async function addBlogPost(event) {
    event.preventDefault();

    const title = document.getElementById('blogPostTitle').value;
    const author = document.getElementById('blogPostAuthor').value;
    const content = document.getElementById('blogPostContent').value;

    try {
        const blogPostsCollection = collection(gymDocRef, 'BlogPosts');
        await addDoc(blogPostsCollection, {
            title,
            author,
            content,
            createdAt: serverTimestamp()
        });

        alert('Blog post added successfully!');
        document.getElementById('add-blog-post-form').reset();
        displayBlogPosts();
    } catch (error) {
        console.error('Error adding blog post:', error);
        alert('Failed to add blog post. Please try again.');
    }
}

// Function to display blog posts in the table
async function displayBlogPosts() {
    const blogPostsTableBody = document.getElementById('blog-posts-table-body');
    blogPostsTableBody.innerHTML = '';

    try {
        const blogPostsCollection = collection(gymDocRef, 'BlogPosts');
        const blogPostsSnapshot = await getDocs(blogPostsCollection);

        blogPostsSnapshot.forEach(doc => {
            const blogPostData = doc.data();
            const newRow = blogPostsTableBody.insertRow();
            const displayDate = blogPostData.updatedAt
                ? blogPostData.updatedAt.toDate().toLocaleString()
                : blogPostData.createdAt.toDate().toLocaleString();

            newRow.innerHTML = `
                <td>${blogPostData.title}</td>
                <td>${blogPostData.author}</td>
                <td>${displayDate}</td>
                <td>
                    <button class="btn btn-secondary-custom view-blog-post-btn" data-blog-post-id="${doc.id}">
                    <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary-custom edit-blog-post-btn" data-blog-post-id="${doc.id}">
                    <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary-custom delete-blog-post-btn" data-blog-post-id="${doc.id}">
                    <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            // Add event listeners to view, edit and delete buttons
            const viewButton = newRow.querySelector('.view-blog-post-btn');
            viewButton.addEventListener('click', () => {
                viewBlogPost(doc.id);
            });

            const editButton = newRow.querySelector('.edit-blog-post-btn');
            editButton.addEventListener('click', () => {
                populateEditBlogPostModal(doc.id);
            });

            const deleteButton = newRow.querySelector('.delete-blog-post-btn');
            deleteButton.addEventListener('click', () => {
                deleteBlogPost(doc.id);
            });
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Handle the error (e.g., display an error message)
    }
}

// Function to view a blog post in a modal (similar to viewAnnouncement)
async function viewBlogPost(blogPostId) {
    try {
        const blogPostDocRef = doc(gymDocRef, 'BlogPosts', blogPostId);
        const blogPostDoc = await getDoc(blogPostDocRef);

        if (blogPostDoc.exists()) {
            const blogPostData = blogPostDoc.data();

            // Populate the modal with blog post data (assuming you have a modal with appropriate IDs)
            document.getElementById('modalBlogPostTitle').textContent = blogPostData.title;
            document.getElementById('modalBlogPostAuthor').textContent = blogPostData.author;
            document.getElementById('modalBlogPostContent').textContent = blogPostData.content;
            // Handle the date display
            const displayDate = blogPostData.updatedAt 
                ? blogPostData.updatedAt.toDate().toLocaleString()
                : blogPostData.createdAt.toDate().toLocaleString();
            document.getElementById('modalBlogPostDate').textContent = displayDate;

            // Show the modal
            $('#viewBlogPostModal').modal('show'); // Make sure you have this modal in your HTML
        } else {
            console.log("Blog post not found");
            // Handle the case where the blog post document is not found
        }
    } catch (error) {
        console.error("Error fetching blog post data:", error);
        // Handle the error appropriately
    }
}

// Function to populate the edit blog post modal
async function populateEditBlogPostModal(blogPostId) {
    try {
        const blogPostDocRef = doc(gymDocRef, 'BlogPosts', blogPostId);
        const blogPostDoc = await getDoc(blogPostDocRef);

        if (blogPostDoc.exists()) {
            const blogPostData = blogPostDoc.data();

            // Populate the modal fields
            document.getElementById('editBlogPostId').value = blogPostId;
            document.getElementById('editBlogPostTitle').value = blogPostData.title;
            document.getElementById('editBlogPostAuthor').value = blogPostData.author;
            document.getElementById('editBlogPostContent').value = blogPostData.content;

            // Show the modal
            $('#editBlogPostModal').modal('show');
        } else {
            console.log("Blog post not found");
            // Handle the case where the blog post document is not found
        }
    } catch (error) {
        console.error("Error fetching blog post data:", error);
        // Handle the error appropriately
    }
}

// Function to update a blog post
async function updateBlogPost(event) {
    event.preventDefault();

    const blogPostId = document.getElementById('editBlogPostId').value;
    const title = document.getElementById('editBlogPostTitle').value;
    const author = document.getElementById('editBlogPostAuthor').value;
    const content = document.getElementById('editBlogPostContent').value;

    try {
        const blogPostDocRef = doc(gymDocRef, 'BlogPosts', blogPostId);
        await updateDoc(blogPostDocRef, {
            title,
            author,
            content,
            updatedAt: serverTimestamp()
        });

        alert('Blog post updated successfully!');
        $('#editBlogPostModal').modal('hide');
        displayBlogPosts();
    } catch (error) {
        console.error('Error updating blog post:', error);
        alert('Failed to update blog post. Please try again.');
    }
}

// Function to delete a blog post (similar to deleteAnnouncement)
async function deleteBlogPost(blogPostId) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        try {
            const blogPostDocRef = doc(gymDocRef, 'BlogPosts', blogPostId);
            await deleteDoc(blogPostDocRef);

            alert('Blog post deleted successfully!');
            displayBlogPosts();
        } catch (error) {
            console.error('Error deleting blog post:', error);
            alert('Failed to delete blog post. Please try again.');
        }
    }
}

// Attach event listeners
document.getElementById('add-blog-post-form').addEventListener('submit', addBlogPost);
document.getElementById('edit-blog-post-form').addEventListener('submit', updateBlogPost);

displayBlogPosts()