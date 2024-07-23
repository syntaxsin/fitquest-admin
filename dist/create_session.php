<?php
session_start();

if (isset($_SESSION['loggedInAdminId'])) {
    $userId = $_POST['loggedInAdminId'];
    $_SESSION['loggedInAdminId'] = $userId;
    $_SESSION['branch'] = $_POST['branch'];
    header("Location: dashboard_index.php"); 
    exit(); 
} else if (isset($_SESSION['loggedInUserId'])) {
    $userId = $_POST['loggedInUserId'];
    $_SESSION['loggedInUserId'] = $userId;
    $_SESSION['branch'] = $_POST['branch'];
    header("Location: user_profile.php"); 
    exit();
} else if (isset($_POST['loggedInAdminId'])) {
    $_SESSION['loggedInAdminId'] = $_POST['loggedInAdminId'];
    $_SESSION['branch'] = $_POST['branch'];
    header("Location: dashboard_index.php"); 
    exit(); 
} else if (isset($_POST['loggedInUserId'])) {
    $_SESSION['loggedInUserId'] = $_POST['loggedInUserId'];
    $_SESSION['branch'] = $_POST['branch'];
    header("Location: user_profile.php"); 
    exit();
} else {
    http_response_code(400);
    echo "Error: User ID not received.";
}
?>
