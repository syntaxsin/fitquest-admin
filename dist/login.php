<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | FitQuest</title>
    <link rel="stylesheet" href="../ad_style.css">
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url('../dashboard-img/login-banner.png');
            background-repeat: no-repeat;
            background-size: cover;
        }
        h1 {
            font-size: 50px;
            margin: 20px;
        }
        button {
            font-size: 18px;
            color: #F0ECE5;
            padding: 15px 30px;
            background: #161A30;
            border: none;
            border-radius: 7px;
            transition: 0.3s ease;
        }
        button:hover {
            color: #161A30;
            background: #B6BBC4;
            cursor: pointer;
        }
        .login-container {
            margin-top: -100px;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .login-container label, input, select, button {
            font-size: 16px;
            margin: 10px;
            display: flex;
            align-items: center;
        }
        .login-container input, select, button {
            padding: 10px 15px;
            border-radius: 5px;
        }
        .login {
            min-height: 40vh;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #31304D;
            border-radius: 10px;
            box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Fit<span style="color: #1679AB;">Quest</span></h1>
        <div class="login">
            <form class="loginForm" id="loginForm">
                <div class="loginMessage" class="msgDiv" style="display:none;"></div>
                <label for="email">E-mail Address:</label>
                <input type="email" name="email" id="email">
                <label for="password">Password:</label>
                <input type="password" name="password" id="password">
                <button id="login-btn">Login</button>
            </form>
        </div>
    </div>
    <script type="module" src="bundle/auth.bundle.js"></script>
</body>
</html>
