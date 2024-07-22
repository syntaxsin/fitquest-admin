<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | FitQuest</title>
    <link rel="stylesheet" href="../ad_style.css">
    <style>
        .main-content #users-list{
            width: 70vw;
            color: #F0ECE5; 
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .main-content #rewards-list{
            width: 70vw;
            color: #F0ECE5;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .main-content button{
            margin: 0 10px;
        }
        .main-content table{
            margin: 20px 15px;
        }
        .main-content table, th, td{
            font-size: 15px;
            text-align: center;
            padding: 10px 30px;
            border-collapse:collapse;
        }
        .main-content th, td{
            border: 1px solid #F0ECE5;
        }
        .main-content th{
            background: #B6BBC4;
            color: black;
        }

        .popUp-tab{
            background: #161A30;
            border: 1px black solid;
            border-radius: 10px;
            width: 30vw;
            height: 60vh;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: fixed; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); 
            z-index: 100; 
            display: none;
            transition: 0.2s ease-in-out;
        }
        .popUp-tab form{
            padding: 20px 0;
            width: 30vw;
        }
        .label-tab{
            display: flex;
            justify-content: space-around;
            width: auto;
            margin: auto;
            padding: 0 25px;
        }
        .label-tab h2{
            flex: 6;
            display: flex;
            align-items: center; 
            font-size: 30px; 
            color: #B6BBC4;
            border-bottom: 1px #B6BBC4;
            padding: 0 10px;
        }
        #addRewardModal{
            background: #161A30;
            border-radius: 10px;
            width: 30vw;
            height: 55vh;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: fixed; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); 
            z-index: 100; 
            display: none;
            transition: 0.2s ease-in-out;
        }

        label, input{
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 10px 0;
            margin: auto;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="side-menu">
        <a href="#">
            <div class="brand-name" href="#">
                <h1>Fit<span style="color: #1679AB;">Quest</span></h1>
            </div>
        </a>
        <ul>
            <a href="points-management.php"><li><img src="../dashboard-img/manage_user.png" alt="manage_user">&nbsp;Manage User Points</li></a>
            <a href="inactive_users.php"><li><img src="../dashboard-img/manage_user.png" alt="rewards">&nbsp;Inactive Users</li></a>
            <a href="rewards_archives.php"><li><img src="../dashboard-img/rewards.png" alt="rewards">&nbsp;Rewards Archive</li></a>
            <div class="sign-out">
                <button type="submit" class="logout-btn" id="logout">Logout</button>
            </div>
        </ul>
    </div>
    <div class="header-section">
        <div class="header">
            <div class="nav">
                <div class="dashboard">
                    <h1>Admin Dashboard</h1>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="dashboard-content" id="main">
            <div class="cards">
                <div class="card">
                        <div class="box">
                            <h1></h1>
                            <h3>Users</h3>
                        </div>
                        <div class="card-img1">
                            <img src="../dashboard-img/card-users.png" alt="">
                        </div>
                    </a>
                </div>
                <div class="card">
                        <div class="box">
                            <h1></h1>
                            <h3>Rewards</h3>
                        </div> 
                        <div class="card-img1">
                            <img src="../dashboard-img/card-rewards.png" alt="">
                        </div>
                    </a>
                </div>
            </div>
            <div class="main-content">
                <!-- pop-up form for adding new users -->
                <div id="addUserModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <div class="label-tab">
                            <h2>Add New User</h2>
                            <button type="button" onclick="closeModal()" style="font-size: 20px; border-radius: 50px; flex: 1;">Close</button>
                        </div>
                        <form action="" class="addUserForm" style="text-align: center;">
                            <label for="add-email">E-mail Address:</label>
                            <input type="email" id="add-email" required>
                            <label for="add-fname">First Name:</label>
                            <input type="text" id="add-fname" required>
                            <label for="add-lname">Last Name:</label>
                            <input type="text" id="add-lname" required>
                            <label for="add-password">Password:</label>
                            <input type="password" id="add-password" required>
                            <button id="add-btn" style="margin: 15px 0; font-size: 20px;">Add User</button>
                        </form>
                    </div>
                </div>
                <!-- pop-up form for adding new rewards -->
                <div id="addRewardModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <div class="label-tab">
                            <h2>Add New Reward</h2>
                            <button type="button" onclick="closeRewardModal()" style="font-size: 20px; border-radius: 50px; flex: 1;">Close</button>
                        </div>
                        <form action="" class="addRewardForm" style="text-align: center;">
                            <label for="rewardName">Reward Name:</label>
                            <input type="text" id="rewardName" required>
                            <label for="requiredPoints">Points:</label>
                            <input type="text" id="requiredPoints" required>
                            <label for="rewardDescription">Description:</label>
                            <input type="text" id="rewardDescription" required>
                            <label for="rewardQuantity">Quantity:</label>
                            <input type="number" id="rewardQuantity" required>
                            <button id="reward-btn" style="margin: 15px 0; font-size: 20px;">Add Reward</button>
                        </form>
                    </div>
                </div>
                <!-- update reward -->
                <div id="updateRewardModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <div class="label-tab">
                            <h2>Update Reward</h2>
                            <button type="button" onclick="closeUpdateRewardModal()">Close</button>
                        </div>
                        <form class="updateReward" style="text-align: center;">
                            <input type="hidden" id="reward_id" name="reward_id" readonly>
                            <label for="rewardName">Reward Name:</label>
                            <input type="text" id="updateRewardName" name="rewardName" required>
                            <label for="rewardDescription">Description:</label>
                            <input type="text" id="updateRewardDescription" name="rewardDescription" required>
                            <label for="requiredPoints">Points:</label>
                            <input type="number" id="updateRequiredPoints" name="requiredPoints" required>
                            <label for="updateQuantity">Quantity:</label>
                            <input type="text" id="updateQuantity" name="updateQuantity" required>
                            <button type="submit" style="margin: 15px 0; font-size: 20px;">Update Reward</button>
                        </form>
                    </div>
                </div>
                <!-- delete reward -->
                <div id="deleteRewardModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <h2>Delete Reward</h2>
                        <p id="deleteRewardConfirmationMessage" style="font-size: 20px; color: #F0ECE5;"></p>
                        <form class="deleteReward" style="display: contents;">
                            <input type="hidden" id="reward_id_to_delete" name="reward_id">
                            <button type="submit" id="confirmDeleteRewardButton" style="margin: 15px 0; font-size: 20px;">Delete</button>
                        </form>
                        <button type="button" onclick="closeDeleteRewardModal()">Cancel</button>
                    </div>
                </div>
                <!-- update user -->
                <div id="updateUserModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <div class="label-tab">
                            <h2>Update User</h2>
                            <button type="button" onclick="closeUpdateUserModal()">Close</button>
                        </div>
                        <form id="updateUserForm" style="text-align: center;">
                            <label for="user_id">Document Number:</label>
                            <input type="text" id="user_id" name="user_id" readonly>
                            <label for="updateEmail">Email:</label>
                            <input type="email" id="updateEmail" name="updateEmail" required>
                            <label for="updateFirstName">First Name:</label>
                            <input type="text" id="updateFirstName" name="updateFirstName" required>
                            <label for="updateLastName">Last Name:</label>
                            <input type="text" id="updateLastName" name="updateLastName" required>
                            <button type="submit" style="margin: 15px 0; font-size: 20px;">Update User</button>
                        </form>
                    </div>
                </div>
                <!-- delete user -->
                <div id="deleteUserModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <h2>Delete User</h2>
                        <p id="deleteUserConfirmationMessage" style="font-size: 20px; color: #F0ECE5;"></p>
                        <form id="deleteUserForm" style="display: contents;">
                            <input type="hidden" id="user_id_to_delete" name="user_id">
                            <button type="submit" id="confirmDeleteUserButton" style="margin: 15px 0; font-size: 20px;">Delete</button>
                        </form>
                        <button type="button" onclick="closeDeleteUserModal()">Cancel</button>
                    </div>
                </div>

                <div class="user-tab">
                    <div class="user-overview">
                        <h2>Active Users</h2>
                        <button id="add-user" onclick="openModal()">Add User</button>
                    </div>
                    <div id="users-list"></div>
                </div>
                <div class="rewards-overview">
                    <div class="rewards-tab">
                        <h2>Rewards Overview</h2>
                        <button id="add-reward" onclick="openRewardModal()">Add Reward</button>
                    </div>
                    <div id="rewards-list"></div>
                </div>
            </div>
        </div>
    </div>
    <script type="module" src="index.bundle.js"></script>
    <!-- pop-up form -->
     <script>
        //add user
        function openModal() {
            document.getElementById("addUserModal").style.display = "flex";
        }
        function closeModal() {
            document.getElementById("addUserModal").style.display = "none";
        }
        function closeDeleteUserModal() {
            document.getElementById('deleteUserModal').style.display = 'none';
            document.getElementById('deleteUserConfirmationMessage').textContent = '';
        }

        /*--------------------------------------*/
        //add reward
        function openRewardModal() {
            document.getElementById("addRewardModal").style.display = "flex";
        }
        function closeRewardModal() {
            document.getElementById("addRewardModal").style.display = "none";
        }
        //update reward
        function closeUpdateRewardModal() {
            document.getElementById("updateRewardModal").style.display = "none";
        }
        //delete reward
        function closeDeleteRewardModal() {
            document.getElementById('deleteRewardModal').style.display = 'none';
            document.getElementById('deleteRewardConfirmationMessage').textContent = '';
        }
     </script>
</body>
</html>