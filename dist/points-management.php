<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Points | FitQuest</title>
    <link rel="stylesheet" href="../ad_style.css">
    <style>
        .main-content{
            color: #F0ECE5; 
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .main-content #users-list{
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
            height: 30vh;
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
        <a href="dashboard_index.php">
            <div class="brand-name">
                <h1>Fit<span style="color: #1679AB;">Quest</span></h1>
            </div>
        </a>
        <ul>
            <a href="points-management.php"><li><img src="../dashboard-img/manage_user.png" alt="manage_user">&nbsp;Manage User Points</li></a>
            <a href="inactive_users.php"><li><img src="../dashboard-img/rewards.png" alt="rewards">&nbsp;Inactive Users</li></a>
            <a href="rewards_archives.php"><li><img src="../dashboard-img/rewards.png" alt="rewards">&nbsp;Rewards Archive</li></a>
            <div class="sign-out">
                <button type="submit" class="logout-btn" id="logout">Logout</button>
            </div>
        </ul>
    </div>
    <div class="container">
        <div class="dashboard-content" id="main">
            <div class="main-content">
                <div id="updatePointsModal" class="popUp-tab" style="display: none;">
                    <div class="group-tab">
                        <div class="label-tab">
                            <h2>Update Points</h2>
                            <button type="button" onclick="closeUpdatePointsModal()">Close</button>
                        </div>
                        <form id="updatePointsForm" style="text-align: center;">
                            <input type="hidden" id="documentId" name="documentId"> 
                            <label for="pointsChange">Points to Add/Remove:</label>
                            <input type="text" id="pointsChange" name="pointsChange" required>
                            <button type="button" id="addPointsBtn" style="margin: 15px 0; font-size: 20px;">Add</button>
                            <button type="button" id="removePointsBtn" style="margin: 15px 0; font-size: 20px;">Remove</button>
                        </form>
                    </div>
                </div>
                <div class="user-tab">
                    <div class="user-overview">
                        <h2>Users</h2>
                    </div>
                    <div id="users-list"></div>
                </div>
            </div>
        </div>
    </div>
    <script type="module" src="points.bundle.js"></script>
    <script>
        function closeUpdatePointsModal() {
            document.getElementById("updatePointsModal").style.display = "none";
            document.getElementById("updatePointsForm").reset();
          }
    </script>
</body>
</html>