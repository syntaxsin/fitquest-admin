import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  getAuth,
  deleteUser,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxEwY413QHRNSRv6_38Odi9wfWWJg249I",
  authDomain: "fitquest-3ea1c.firebaseapp.com",
  databaseURL:
    "https://fitquest-3ea1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fitquest-3ea1c",
  storageBucket: "fitquest-3ea1c.appspot.com",
  messagingSenderId: "32473756709",
  appId: "1:32473756709:web:1560a93615481f894afbcc",
  measurementId: "G-3RE9G8K9YG",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const SUPER_ADMIN_EMAIL = "superadmin_fitquest@atmr.dev";

onAuthStateChanged(auth, (user) => {
  if (user && localStorage.getItem("userType") === "super_admin") {
    const addAdminForm = document.getElementById("add-admin-form");
    addAdminForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const email = document.getElementById("admin-email").value;
      const location = document.getElementById("admin-location").value;
      const branch = document.getElementById("admin-branch").value;
      const firstName = document.getElementById("admin-fname").value;
      const lastName = document.getElementById("admin-lname").value;
      const password = document.getElementById("admin-password").value;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User Created:", userCredential);

        const gymQuery = query(collection(db, "Gym"));
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
        const newGymCollectionName = `GYM${String(newGymNumber).padStart(
          3,
          "0"
        )}`;

        const gymDocRef = doc(db, "Gym", newGymCollectionName);
        console.log("Gym Doc Ref:", gymDocRef.path);
        await setDoc(gymDocRef, {
          Location: location,
          Name: branch,
          Status: "Active",
        });

        const membersCollection = collection(gymDocRef, "Members");
        const membersSnapshot = await getDocs(membersCollection);
        const existingMemberIds = membersSnapshot.docs.map((doc) => doc.id);

        function generateNextId(existingIds) {
          const prefix = "A";
          const maxId = existingIds
            .filter((id) => id.startsWith(prefix))
            .map((id) => parseInt(id.replace(prefix, ""), 10))
            .reduce((max, current) => Math.max(max, current), 0);
          return `${prefix}${String(maxId + 1).padStart(3, "0")}`;
        }

        const newAdminId = generateNextId(existingMemberIds);

        await setDoc(doc(membersCollection, newAdminId), {
          Email: email,
          FirstName: firstName,
          LastName: lastName,
          Status: "Active Admin",
          createdAt: serverTimestamp(),
        });

        const rewardsCollection = collection(gymDocRef, "Rewards");
        console.log("Rewards Collection Ref:", rewardsCollection.path);

        const defaultRewards = [
          {
            rewardName: "1 Personal Traning Session",
            rewardDescription: "Voucher",
            requiredPoints: 100,
            status: "Claimable",
          },
        ];

        // Function to generate the next RWD ID
        async function generateNextRewardId() {
          const rewardQuery = query(
            rewardsCollection,
            orderBy("rewardId", "desc")
          );
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
          return `RWD${String(newRewardNumber).padStart(3, "0")}`;
        }

        const addRewardPromises = defaultRewards.map(async (reward) => {
          const rewardId = await generateNextRewardId();
          return setDoc(doc(rewardsCollection, rewardId), { ...reward });
        });

        await Promise.all(addRewardPromises);

        alert(
          `Admin added successfully to ${newGymCollectionName} with ID ${newAdminId}!`
        );
        addAdminForm.reset();
      } catch (error) {
        console.error("Error adding admin:", error);
        alert("Failed to add admin. Please check the console for details.");
      }
    });

    // Update Admin Form Submission
    const updateAdminForm = document.getElementById("edit-admin-form");
    updateAdminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const gymId = document.getElementById("edit-gym-id").value;
      const newBranchName = document.getElementById("edit-branch-name").value;
      const newLocation = document.getElementById("edit-location").value;

      const gymCollectionName = `GYM${gymId}`;

      // Reference the GYM00# collection directly
      const gymDocRef = doc(db, "Gym", gymCollectionName);

      try {
        // No need for a transaction if you're only updating one document
        await updateDoc(gymDocRef, {
          Name: newBranchName,
          Location: newLocation,
        });

        console.log("Gym information updated successfully.");
        alert("Gym information updated successfully.");
      } catch (error) {
        console.error("Error updating gym:", error);
        alert("Failed to update gym information. Please try again.");
      } finally {
        setTimeout(() => {
          window.location.reload();
        }, 500);
        $("#editAdminModal").modal("hide");
      }
    });

    function openEditAdminModal(gymId, memberId) {
      document.getElementById("edit-gym-id").value = gymId;
      document.getElementById("edit-member-id").value = memberId;

      // Fetch the gym document to populate the input fields
      const gymRef = doc(db, "Gym", `GYM${gymId}`);

      getDoc(gymRef)
        .then((doc) => {
          if (doc.exists()) {
            const gymData = doc.data();
            document.getElementById("edit-branch-name").value = gymData.Name;
            document.getElementById("edit-location").value = gymData.Location;

            $("#editAdminModal").modal("show");
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }

    // Fetch and display admin data
    function displayAdmins() {
      const adminList = document.querySelector("#admin-list tbody");
      adminList.innerHTML = ""; // Clear existing data

      // Filter active gyms directly
      const gymQuery = query(collection(db, "Gym"));
      onSnapshot(gymQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added" || change.type === "modified") {
            const gymDoc = change.doc;
            const gymData = gymDoc.data();
            const membersCollection = collection(gymDoc.ref, "Members");

            const activeAdminsQuery = query(
              membersCollection,
              where("Status", "==", "Active Admin")
            );
            const activeAdminsSnapshot = await getDocs(activeAdminsQuery);
            // const adminCount = activeAdminsSnapshot.size;

            const rowId = `${gymDoc.id}`;
            const existingRow = document.getElementById(rowId);
            if (existingRow) {
              existingRow.remove();
            }

            const newRow = document.createElement("tr");
            newRow.id = rowId;

            // Disable buttons if the gym is inactive
            const isGymInactive = gymData.Status === "Inactive";
            const buttonDisabledAttribute = isGymInactive ? "disabled" : "";

            // Dynamically set the class for the "fa-power-off" button
            const powerOffButtonClass = isGymInactive
              ? "reactivate-gym-button"
              : "deactivate-gym-button";

            newRow.innerHTML = `
                            <td>${gymDoc.id}</td> 
                            <td>${gymData.Name}</td>
                            <td>${gymData.Location}</td>
                            <td>${gymData.Status}</td>
                            <td>
                                <button class="btn btn-secondary-custom add-admin-button" data-gym-id="${gymDoc.id}" ${buttonDisabledAttribute}>
                                    <i class="fas fa-user-plus" ></i>
                                </button>
                                <button class="btn btn-secondary-custom edit-button" data-bs-toggle="modal" data-bs-target="#editAdminModal" data-gym-id="${gymDoc.id}" ${buttonDisabledAttribute}>
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-secondary-custom view-admins-button" data-bs-toggle="modal" data-bs-target="#deactivateGymModal" data-gym-id="${gymDoc.id}" ${buttonDisabledAttribute}>
                                    <i class="fas fa-building" ></i>
                                </button>
                                <button class="btn btn-secondary-custom ${powerOffButtonClass}" data-gym-id="${gymDoc.id}"> 
                                    <i class="fas fa-power-off"></i>
                                </button>
                            </td>
                        `;
            adminList.appendChild(newRow);

            // Add event listener to the "fa-user-plus" button
            const addAnotherAdminButton =
              newRow.querySelector(".add-admin-button");
            addAnotherAdminButton.addEventListener("click", () => {
              // Populate the gym ID in the modal
              document.getElementById("gym-id").value = gymDoc.id;
              createAdminAccount(gymDoc.id);
              // Show the modal
              $("#addAnotherAdminModal").modal("show");
            });

            const editButton = newRow.querySelector(".edit-button");
            editButton.addEventListener("click", () => {
              openEditAdminModal(gymDoc.id.replace("GYM", ""));
            });

            // Add event listener to the "View Admins" button
            const viewAdminsButton = newRow.querySelector(
              ".view-admins-button"
            );
            viewAdminsButton.addEventListener("click", () => {
              displayDetailedAdminList(gymDoc);
            });

            // Event listeners for deactivate/reactivate gym button
            const powerOffButton = newRow.querySelector(
              `.${powerOffButtonClass}`
            );
            powerOffButton.addEventListener("click", () => {
              if (isGymInactive) {
                reactivateGym(gymDoc.id);
              } else {
                // Get the gym ID from the button's data attribute
                const gymId = powerOffButton.dataset.gymId;
                deactivateGym(gymId);
              }
            });
          } else if (change.type === "removed") {
            const gymDoc = change.doc;
            const membersCollection = collection(gymDoc.ref, "Members");
            const membersQuery = query(
              membersCollection,
              where("Status", "==", "Active Admin")
            );

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

    // Function to deactivate a gym
    async function deactivateGym(gymId) {
      const gymDocRef = doc(db, "Gym", gymId);
      confirm(`Are you sure you want to deactivate ${gymId}.`);

      try {
        // Update the gym's status to 'Inactive'
        await updateDoc(gymDocRef, { Status: "Inactive" });
        alert(`Gym ${gymId} has been deactivated.`);
        displayAdmins(); // Refresh the admin list
      } catch (error) {
        console.error("Error deactivating gym:", error);
        alert("Failed to deactivate gym. Please try again.");
      }
    }

    // Function to reactivate a gym
    async function reactivateGym(gymId) {
      const gymDocRef = doc(db, "Gym", gymId);
      confirm(`Are you sure you want to reactivate ${gymId}.`);

      try {
        // 1. Update the gym's status to 'Active'
        await updateDoc(gymDocRef, { Status: "Active" });

        // 2. (Optional) Reactivate all admins within the gym
        const membersCollection = collection(gymDocRef, "Members");
        const deactivatedAdminsQuery = query(
          membersCollection,
          where("Status", "==", "Deactivated")
        );
        const deactivatedAdminsSnapshot = await getDocs(deactivatedAdminsQuery);

        const reactivateAdminPromises = deactivatedAdminsSnapshot.docs.map(
          async (memberDoc) => {
            await updateDoc(memberDoc.ref, { Status: "Active Admin" });
          }
        );
        await Promise.all(reactivateAdminPromises);

        alert(`Gym ${gymId} has been reactivated.`);
        displayAdmins(); // Refresh the admin list
      } catch (error) {
        console.error("Error reactivating gym:", error);
        alert("Failed to reactivate gym. Please try again.");
      }
    }

    // Function to create a new admin account
    async function createAdminAccount(gymId) {
      const addAnotherAdminForm = document.getElementById(
        "add-another-admin-form"
      );

      addAnotherAdminForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("add-email").value;
        const firstName = document.getElementById("add-fname").value;
        const lastName = document.getElementById("add-lname").value;
        const password = document.getElementById("add-password").value;

        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("User Created:", userCredential);

          const gymDocRef = doc(db, "Gym", gymId);
          const membersCollection = collection(gymDocRef, "Members");

          const membersSnapshot = await getDocs(membersCollection);
          const existingMemberIds = membersSnapshot.docs.map((doc) => doc.id);

          const newAdminId = generateNextId(existingMemberIds);

          await setDoc(doc(membersCollection, newAdminId), {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Status: "Active Admin",
            createdAt: serverTimestamp(),
          });

          alert(`Admin added successfully to ${gymId} with ID ${newAdminId}!`);
          addAnotherAdminForm.reset();
          $("#addAnotherAdminModal").modal("hide");
          displayAdmins();
        } catch (error) {
          console.error("Error adding admin:", error);
          alert("Failed to add admin. Please check the console for details.");
        }
      });
    }

    // Helper function to generate the next ID
    function generateNextId(existingIds) {
      const prefix = "A";
      const maxId = existingIds
        .filter((id) => id.startsWith(prefix))
        .map((id) => parseInt(id.replace(prefix, ""), 10))
        .reduce((max, current) => Math.max(max, current), 0);
      return `${prefix}${String(maxId + 1).padStart(3, "0")}`;
    }

    // Function to display detailed admin list with deactivate/reactivate options
    async function displayDetailedAdminList(gymDoc) {
      const gymId = gymDoc.id;
      const gymData = gymDoc.data();
      const membersCollection = collection(gymDoc.ref, "Members");

      // Fetch all admins (active and deactivated)
      const allAdminsQuery = query(
        membersCollection,
        where("Status", "in", ["Active Admin", "Deactivated"])
      );
      const allAdminsSnapshot = await getDocs(allAdminsQuery);

      const adminDetailsTable = document.createElement("table");
      adminDetailsTable.classList.add("table", "table-striped");
      adminDetailsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;

      allAdminsSnapshot.forEach((memberDoc) => {
        const adminData = memberDoc.data();
        const memberId = memberDoc.id;
        const status = adminData.Status;

        const newRow = adminDetailsTable.querySelector("tbody").insertRow();
        newRow.innerHTML = `
                    <td>${memberId}</td>
                    <td>${adminData.FirstName}</td>
                    <td>${adminData.LastName}</td>
                    <td>${adminData.Email}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn btn-secondary-custom deactivate-reactivate-button" 
                                data-gym-id="${gymId}" 
                                data-member-id="${memberId}"
                                data-current-status="${status}">
                            ${
                              status === "Active Admin"
                                ? '<i class="fas fa-power-off"></i>'
                                : '<i class="fas fa-power-off"></i>'
                            }
                        </button>
                    </td>
                `;

        const deactivateReactivateButton = newRow.querySelector(
          ".deactivate-reactivate-button"
        );
        deactivateReactivateButton.addEventListener("click", () => {
          const newStatus =
            status === "Active Admin" ? "Deactivated" : "Active Admin";
          handleDeactivateReactivateAdmin(gymId, memberId, newStatus);
        });
      });

      showModalWithAdminDetails(gymId, gymData.Name, adminDetailsTable);
    }

    // Function to handle deactivating or reactivating an admin
    async function handleDeactivateReactivateAdmin(gymId, memberId) {
      const gymCollectionName = gymId;
      const adminDocRef = doc(db, "Gym", gymCollectionName, "Members", memberId);

      try {
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
          const currentStatus = adminDoc.data().Status;
          const newStatus = currentStatus === "Active Admin" ? "Deactivated" : "Active Admin";

          await updateDoc(adminDocRef, { Status: newStatus });

          // Assuming displayAdmins and displayDetailedAdminList
          // are functions that refresh your admin lists
          displayAdmins();

          // If you need to refresh a detailed list, you'll need to fetch
          // the updated gymDoc first. Make sure to use the correct path:
          const gymDocRef = doc(db, "Gym", gymId);
          const gymDoc = await getDoc(gymDocRef);
          displayDetailedAdminList(gymDoc);

          alert(`Admin ${memberId} from gym ${gymId} has been ${newStatus}.`);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.error("Admin not found.");
          alert("Failed to update admin status. Admin not found.");
        }
      } catch (error) {
        console.error("Error updating admin status:", error);
        alert("Failed to update admin status. Please try again.");
      }
    }

    function showModalWithAdminDetails(gymId, gymName, adminDetailsTable) {
      // Example implementation using Bootstrap modal
      const modal = new bootstrap.Modal(
        document.getElementById("adminDetailsModal")
      ); // Assuming you have a modal with this ID

      // Set the modal title and content
      document.getElementById(
        "adminDetailsModalLabel"
      ).textContent = `Admins for ${gymName} (${gymId})`;
      document.getElementById("adminDetailsModalBody").innerHTML = ""; // Clear previous content
      document
        .getElementById("adminDetailsModalBody")
        .appendChild(adminDetailsTable);

      modal.show();
    }

    const logoutButton = document.querySelector(".logout");
    logoutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("User signed out successfully");
        // Optionally, clear any stored user data
        localStorage.removeItem("userType");

        window.location.href = "../index.php"; // Replace with your actual login page URL
      } catch (error) {
        console.error("Error signing out:", error);
      }
    });
  } else {
    // User is signed out
    window.location.href = "login.php";
  }
});
