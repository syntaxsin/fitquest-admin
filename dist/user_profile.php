<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>FitQuest - User Profile</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../css/base.css">  

    <link rel="stylesheet" href="../css/vendor.css">
    <link rel="stylesheet" href="../css/main.css">
    <script>
        // Check user type and gym information
        const userType = localStorage.getItem('userType');
        const gymId = localStorage.getItem('gymId');

        if (userType !== 'user' || !gymId) {
            // Redirect to login if not a user or gym information is missing
            window.location.href = 'login.php';
        }
    </script>
    <style>
        #user-profile {
            padding: 60px 0;
            background: #f9f9f9;
        }

        .profile-content {
            text-align: center;
            display: flex;
            /* Enable flexbox for alignment */
            justify-content: space-around;
            /* Distribute boxes evenly */
        }

        .profile-box {
            background: white;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            flex: 1;
            /* Allow boxes to grow and take available space */
            margin: 0 15px;
            /* Add some margin between boxes */
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-bottom: 20px;
            object-fit: cover;
            /* To make sure the image fits within the circle */
        }

        .profile-info h2 {
            font-size: 1.8em;
            margin-bottom: 10px;
        }

        .profile-info p {
            font-size: 1.2em;
            color: #777;
            margin-bottom: 20px;
        }

        .button.button-primary {
            background: #252525;
            /* Dark background like the existing buttons */
        }

        /* Style for pending rewards list */
        #pendingRewardsList {

            list-style: none;
            padding: 0;
            margin: 0;
            text-align: center;
        }

        .classes-section {
            background: #f9f9f9;
            /* FitQuest light gray background */
            padding-bottom: 80px;
        }

        .classes-section .section-title {
            margin-bottom: 35px;
        }

        .class-item {
            overflow: hidden;
            margin-bottom: 30px;
            border-radius: 10px;
            /* Increased border radius */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            /* Pronounced shadow */
        }

        .class-item .ci-pic img {
            min-width: 100%;
        }

        .class-item .ci-text {
            background: #ffffff;
            position: relative;
            padding: 10px 30px 26px 30px;
            z-index: 1;
        }

        /* Remove the angled shape */
        .class-item .ci-text:after {
            display: none;
        }

        .class-item .ci-text span {
            color: #252525;
            /* FitQuest dark accent color */
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 700;
        }

        .class-item .ci-text h5,
        .class-item .ci-text h4 {
            color: #252525;
            /* FitQuest dark accent color */
            font-weight: 600;
            text-transform: uppercase;
        }

        .class-item .ci-text h5 {
            font-size: 20px;
            margin-top: 4px;
        }

        .class-item .ci-text h4 {
            font-size: 26px;
            margin-top: 4px;
        }

        .class-item .ci-text a {
            display: inline-block;
            width: 46px;
            height: 46px;
            background: #252525;
            /* FitQuest dark accent background */
            line-height: 46px;
            text-align: center;
            font-size: 24px;
            color: #ffffff;
            position: absolute;
            right: 30px;
            bottom: 26px;
            border-radius: 50%;
            transition: all 0.3s;
        }

        .class-item .ci-text a:hover {
            background-color: #f36100;
            /* Optional: Hover effect */
        }


        /* Banner Section (Adjusted for FitQuest) */
        .banner-section {
            height: 550px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url('img/hero-banner.jpg');
            /* Assuming this is your FitQuest hero image */
            background-size: cover;
            background-position: center;
        }

        .bs-text h2 {
            font-size: 48px;
            color: #ffffff;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 25px;
        }

        .bs-text .bt-tips {
            font-size: 20px;
            color:
                #ffffff;
            /* White text for better contrast on image */
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 45px;
        }

        /* Styles for Announcements and Blogs sections */
        .announcements-section,
        .blogs-section {
            padding: 60px 0;
            background: #f9f9f9;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 30px;
            width: 100%;
            /* Take up full width */
            max-width: 800px;
            /* Optional: Limit maximum width */
            margin-left: auto;
            margin-right: auto;
        }

        .announcements-section h2,
        .blogs-section h2 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 30px;
        }
    </style>
</head>

<body>

    <header id="header" class="row">
        <div class="header-logo">
            <a href="user_profile.php">FitQuest</a>
        </div>
        <nav id="header-nav-wrap">
            <ul class="header-main-nav">
                <li><a class="smoothscroll" href="index.html#home" title="home">Home</a></li>
                <li><a class="smoothscroll" href="index.html#about" title="about">About</a></li>
                <li><a class="smoothscroll" href="index.html#our-team"  
                        title="our-team">Team</a></li>
                <li><a class="smoothscroll" href="index.html#bmi-calculator" title="bmi-calculator">BMI Calculator</a></li>
                <li><a class="smoothscroll" href="index.html#download" title="download">Download</a></li>
            </ul>
        </nav>
        <a class="header-menu-toggle" href="#"><span>Menu</span></a>
    </header>

    <section id="user-profile">
        <div class="row profile-content">
            <div class="col-six tab-full profile-box">
                <div class="profile-info">
                    <br>
                    <h2>Welcome Back,</h2>
                    <h2 id="userName"></h2>
                    <p id="userEmail"></p>
                    <p>Current Points: <span id="userPoints"></span></p>
                    <p>Status: <span id="userStatus"></span></p>
                    <div>
                        <h3>Weight Entries:</h3>
                        <p>First Entry: <span id="firstWeightEntry"></span></p>
                        <p>Last Entry: <span id="lastWeightEntry"></span></p>
                    </div>
                    <button id="logout-button" class="button button-primary">Logout</button>
                </div>
            </div>

            <div class="col-six tab-full profile-box">
                <div class="profile-info">
                    <br>
                    <h2>Pending Rewards:</h2>
                    <ul id="pendingRewardsList"></ul>
                </div>
            </div>
        </div>
    </section>
    <footer></footer>


    <section class="announcements-section">
        <h2>Announcements</h2>
        <div id="announcementsContent">
            <p id="announcementPlaceholder" style="text-align: justify;">Loading announcements...</p>
        </div>
    </section>

    <section class="blogs-section">
        <h2>Blogs</h2>
        <div id="blogsContent">
            <p id="blogPlaceholder" style="text-align: justify;">Loading blogs...</p>
        </div>
    </section>



    <footer>
        <div class="footer-bottom">
            <div class="row">
                <div class="col-twelve">
                    <div class="copyright">
                        <span>© Copyright ATMR 2024. </span>
                    </div>
                    <div id="go-top">
                        <a class="smoothscroll" title="Back to Top" href="#top"><i class="icon-arrow-up"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <div id="preloader">
        <div id="loader"></div>
    </div>
    <script src="../js/jquery-2.1.3.min.js"></script>
    <script src="../js/plugins.js"></script>
    <script src="../js/main.js"></script>

    <script type="module" src="bundle/user_profile.bundle.js"></script>
</body>

</html>