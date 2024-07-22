<?php
    session_start();
    // Check for the existence of the 'loggedInAdminId' session variable FIRST
    if (isset($_SESSION['loggedInAdminId'])) {
        // Redirect if already logged in as admin
        $userId = $_POST['loggedInAdminId'];
        $_SESSION['loggedInAdminId'] = $userId;
        header("Location: dashboard_index.php"); 
        exit(); 
    } else if (isset($_SESSION['loggedInUserId'])) {
        // Redirect if already logged in as regular user
        $userId = $_POST['loggedInUserId'];
        $_SESSION['loggedInUserId'] = $userId;
        header("Location: user_profile.php"); 
        exit();
    } else {
        header("../index.php");
        exit();
    }
    
    if (isset($_POST['loggedInAdminId'])) {
        $_SESSION['loggedInAdminId'] = $_POST['loggedInAdminId'];
        // echo "Session started successfully.";
    } else if (isset($_POST['loggedInUserId'])){
        $_SESSION['loggedInUserId'] = $_POST['loggedInUserId'];
    }else {
        http_response_code(400);
        echo "Error: User ID not received."; 
    }
?>