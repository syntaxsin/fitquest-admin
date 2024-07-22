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

    <style>
        #user-profile {
            padding: 60px 0;
            background: #f9f9f9;
        }

        .profile-content {
            text-align: center;
        }

        .profile-box {
            background: white;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-bottom: 20px;
            object-fit: cover; /* To make sure the image fits within the circle */
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
            background: #252525; /* Dark background like the existing buttons */
        }

        .classes-section {
  background: #f9f9f9; /* FitQuest light gray background */
  padding-bottom: 80px;
}

.classes-section .section-title {
  margin-bottom: 35px;
}

.class-item {
  overflow: hidden;
  margin-bottom: 30px;
  border-radius: 10px; /* Increased border radius */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Pronounced shadow */
}

.class-item .ci-pic img {
  min-width: 100%;
}

.class-item .ci-text {
  background: #ffffff;   /* White background for the text area */
  position: relative;
  padding: 10px 30px 26px 30px;
  z-index: 1;
}

/* Remove the angled shape */
.class-item .ci-text:after { 
  display: none;
}

.class-item .ci-text span {
  color: #252525; /* FitQuest dark accent color */
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 700;
}

.class-item .ci-text h5,
.class-item .ci-text h4 {
  color: #252525; /* FitQuest dark accent color */
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
  background: #252525; /* FitQuest dark accent background */
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
  background-color: #f36100; /* Optional: Hover effect */
}


/* Banner Section (Adjusted for FitQuest) */
.banner-section {
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('img/hero-banner.jpg'); /* Assuming this is your FitQuest hero image */
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
  color: #ffffff; /* White text for better contrast on image */
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 45px;
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
                <li><a class="smoothscroll" href="index.html#our-team" title="our-team">Team</a></li>
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
                    <h2>Welcome Back,</h2><h2 id="userName"></h2>
                    <p id="userEmail"></p>
                    <p>Current Points: <span id="userPoints"></span></p>
                    <button id="logout-button" class="button button-primary">Logout</button>
                </div>
            </div>
        </div>
    </section>
    
    <section class="classes-section spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="section-title">
                        <h2>GUIDES TO START YOUR FITNESS JOURNEY</h2>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-6">
                    <a href="https://www.healthline.com/nutrition/20-nutrition-tips-for-exercise" target="_blank" rel="noopener"> <div class="class-item">
                        <div class="ci-pic">
                            <img src="https://www.usatoday.com/gcdn/presto/2023/01/03/USAT/dba26ab9-095c-4e83-8962-150ae33e479c-GettyImages-1390699821.jpg?width=1200&disable=upscale&format=pjpg&auto=webp"alt="Nutrition" style="width: 70px; height: 150px;" >
                        </div>
                        <div class="ci-text">
                            <span>FOOD</span>
                            <h5>Fueling Your Body</h5>
                            <p>Learn about balanced nutrition for optimal performance and recovery.</p>
                        </div>
                    </div></a>
                </div>
                <div class="col-lg-4 col-md-6">
                    <a href="https://www.nerdfitness.com/blog/beginner-body-weight-workout-burn-fat-build-muscle/" target="_blank" rel="noopener"> <div class="class-item">
                        <div class="ci-pic">
                            <img src="https://www.verywellfit.com/thmb/uujlEWPXdI1M3c55IwaF1oy9hNg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1264135982-fff92b3493274db4b4a220000287d39f.jpg" alt="Beginner Workout" style="width: 100px; height: 100px;">
                        </div>
                        <div class="ci-text">
                            <span>BEGINNER</span>
                            <h5>Starting Your Journey</h5>
                            <p>Find beginner-friendly workouts and tips to build a foundation.</p>
                        </div>
                    </div></a>
                </div>
                <div class="col-lg-4 col-md-6">
                    <a href="https://www.healthline.com/health/fitness-exercise/strength-training-at-home" target="_blank" rel="noopener"><div class="class-item">
                        <div class="ci-pic">
                            <img src="images/strength-training.jpg" alt="Strength Training">
                        </div>
                        <div class="ci-text">
                            <span>STRENGTH</span>
                            <h5>Building Strength</h5>
                            <p>Discover strength training routines to build muscle and power.</p>
                        </div>
                    </div></a>
                </div>
                <div class="col-lg-6 col-md-6">
                    <a href="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/aerobic-exercise/art-20045541" target="_blank" rel="noopener"><div class="class-item">
                        <div class="ci-pic">
                            <img src="images/cardio.jpg" alt="Cardio">
                        </div>
                        <div class="ci-text">
                            <span>CARDIO</span>
                            <h5>Improving Endurance</h5>
                            <p>Explore cardio exercises for heart health and stamina.</p>
                        </div>
                    </div></a>
                </div>
                <div class="col-lg-6">
                    <a href="https://www.helpguide.org/articles/stress/relaxation-techniques-for-stress-relief.htm" target="_blank" rel="noopener"><div class="class-item">
                        <div class="ci-pic">
                            <img src="images/mindfulness.jpg" alt="Mindfulness">
                        </div>
                        <div class="ci-text">
                            <span>WELLNESS</span>
                            <h5>Mind-Body Connection</h5>
                            <p>Learn about mindfulness and stress reduction techniques.</p>
                        </div>
                    </div></a>
                </div>
            </div>
        </div>
    </section>
    
    
    <!-- ChoseUs Section End -->

    <!-- <section class="choseus-section spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="section-title">

                        <h2>BOOST YOUR FITNESS JOURNEY</h2> </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3 col-sm-6">
                    <div class="cs-item">
                        <span class="flaticon-034-stationary-bike"></span> 
                        <h4>Personalized Workouts</h4> 
                        <p>Tailored to your fitness goals and level.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                    <div class="cs-item">
                        <span class="flaticon-033-juice"></span> 
                        <h4>Track Your Progress</h4> 
                        <p>Monitor your workouts and achievements.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                    <div class="cs-item">
                        <span class="flaticon-002-dumbell"></span> 
                        <h4>Rewarding Challenges</h4>
                        <p>Earn points and unlock rewards for staying active.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                    <div class="cs-item">
                        <span class="flaticon-014-heart-beat"></span> 
                        <h4>Community Support</h4>
                        <p>Connect with fellow fitness enthusiasts.</p>
                    </div>
                </div>
            </div>
        </div>
    </section> -->
    
    <footer>

        <div class="footer-main">
            <div class="row">  

                <div class="col-three md-1-3 tab-full footer-info">            

                    <div class="footer-logo"></div>

                    <p>
                        The gamified workout application that tracks your progress, adapts to your fitness level, and motivates you to reach new heights. Conquer challenges and become your best self.
                    </p>

                    <ul class="footer-social-list">
                        <li>
                            <a href="#"><i class="fa fa-facebook-square"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-twitter"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-behance"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-dribbble"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-instagram"></i></a>
                        </li>
                    </ul>
                    
                    
                </div> <!-- end footer-info -->

                <div class="col-three md-1-3 tab-1-2 mob-full footer-contact">

                    <h4>Contact</h4>

                    <p>
                    Padre Paredes St, Sampaloc,<br>
                    Metro Manila<br>
                    1015 PH<br>		        
                    </p>

                    <p>
                    fitquestATMR@gmail.com <br>
                    Phone: (+63) 916 235 7282 <br> 
                    </p>                    

                </div> <!-- end footer-contact -->  

                <div class="col-two md-1-3 tab-1-2 mob-full footer-site-links">

                    <!-- <h4>Site Links</h4>

                    <ul class="list-links">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Terms</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>	      		 -->
                            
                </div> <!-- end footer-site-links --> 

                <div class="col-four md-1-2 tab-full footer-subscribe">

                    <h4>Our Newsletter</h4>

                    <p>Sign up for our newsletter to receive the latest updates, news, and exclusive offers from our team. We'll keep you in the loop about new products, industry insights, and upcoming events. Don't miss out – join our community today!</p>

                    <div class="subscribe-form">
                
                        <form id="mc-form" class="group" novalidate="true">

                            <input type="email" value="" name="EMAIL" class="email" id="mc-email" placeholder="Email Address" required=""> 
                
                            <input type="submit" name="subscribe" value="Send">
                
                            <label for="mc-email" class="subscribe-message"></label>
                
                        </form>

                    </div>	      		
                            
                </div> <!-- end footer-subscribe -->         

            </div> <!-- /row -->
        </div> <!-- end footer-main -->

      <div class="footer-bottom">

      	<div class="row">

      		<div class="col-twelve">
	      		<div class="copyright">
		         	<span>© Copyright ATMR 2024. </span> 
		         	<!-- <span>Design by <a href="http://www.styleshout.com/">styleshout</a></span>		         	 -->
		         </div>

		         <div id="go-top">
		            <a class="smoothscroll" title="Back to Top" href="#top"><i class="icon-arrow-up"></i></a>
		         </div>         
	      	</div>

      	</div> <!-- end footer-bottom -->     	

      </div>

    </footer>

    <div id="preloader"> 
    	<div id="loader"></div>
    </div>  

    <!-- Java Script
    ================================================== -->
    <script src="../js/jquery-2.1.3.min.js"></script>
    <script src="../js/plugins.js"></script>
    <script src="../js/main.js"></script>

    <script type="module" src="user_profile.bundle.js"></script> 
</body>

</html>
