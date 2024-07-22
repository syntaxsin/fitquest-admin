<?php
    session_start();

    if (isset($_SESSION['loggedInAdminId'])) {
        header("Location: dist/dashboard_index.php");
        exit();
    } else if (isset($_SESSION['loggedInUserId'])) {
        header("Location: dist/user_profile.php");
        exit();
    }
?>
<!DOCTYPE html>
<html class="no-js" lang="en">

<head>
    <!--- basic page needs
    CLARK
   ================================================== -->
    <meta charset="utf-8">
    <title>FitQuest</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- mobile specific metas
   ================================================== -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
   
    <!-- CSS
   ================================================== -->
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/vendor.css">
    <link rel="stylesheet" href="css/main.css">
    <style>
    #bmi-calculator {
        padding: 60px 0;
        background: #f9f9f9;
    }
    .bmi-content .section-title {
        text-align: center;
        margin-bottom: 40px;
    }
    .bmi-calc-form, .bmi-chart {
        margin-bottom: 40px;
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .form-block, .chart-block {
        text-align: center;
    }
    .form-field {
        margin-bottom: 15px;
    }
    .form-field label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .form-field input {
        width: calc(100% - 22px);
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    .bmi-chart table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    .bmi-chart table th, .bmi-chart table td {
        border: 1px solid #ddd;
        padding: 10px;
    }
    .bmi-chart table th {
        background: #f4f4f4;
    }
</style>
    </style>

    <!-- script
   ================================================ == -->
    <script src="js/modernizr.js"></script>
    <script src="js/pace.min.js"></script>


</head>

<body id="top">

    <!-- header 
   ================================================== -->
   <header id="header" class="row">   

   		<div class="header-logo">
	        <a href="index.html">FitQuest</a>
	    </div>

	   	<nav id="header-nav-wrap">
			<ul class="header-main-nav">
				<li class="current"><a class="smoothscroll"  href="#home" title="home">Home</a></li>
                <li><a class="smoothscroll"  href="#about" title="about">About</a></li>
				<li><a class="smoothscroll"  href="#our-team" title="our-team">Team</a></li>
				<li><a class="smoothscroll"  href="#bmi-calculator" title="bmi-calculator">BMI Calculator</a></li>
				<li><a class="smoothscroll"  href="#download" title="download">Download</a></li>	
			</ul>

            <a href="dist/login.php" title="sign-up" class="button button-primary cta">Log In</a>
		</nav>

		<a class="header-menu-toggle" href="#"><span>Menu</span></a>    	
   	
   </header> <!-- /header -->


   <!-- home
   ================================================== -->
   <section id="home" data-parallax="scroll" data-image-src="images/hero-banner.jpg" data-natural-width=3000 data-natural-height=2000>

        <div class="overlay"></div>
        <div class="home-content">        

            <div class="row contents">                     
                <div class="home-content-left">

                    <h3 data-aos="fade-up">Welcome to FitQuest</h3>

                    <h1 data-aos="fade-up">
                        Gamified Fitness Appplication Supported<br>
                        with Motion Tracking<br>
                        and Reward System
                    </h1>

                    <div class="buttons" data-aos="fade-up">
                        <a href="#download" class="smoothscroll button stroke">
                            <span class="icon-circle-down" aria-hidden="true"></span>
                            Download App
                        </a>
                        <a href="https://youtu.be/Oi3rvJLUPk0" data-lity class="button stroke">
                            <span class="icon-play" aria-hidden="true"></span>
                            Watch Video
                        </a>
                    </div>                                         

                </div>

                <div class="home-image-right">
                    <img src="images/app-img.png" 
                        srcset="images/app-img.png 1x, images/app-img.png 2x"  
                        data-aos="fade-up">
                </div>
            </div>

        </div> <!-- end home-content -->

        <ul class="home-social-list">
            <li>
                <a href="#"><i class="fa fa-facebook-square"></i></a>
            </li>
            <li>
                <a href="#"><i class="fa fa-twitter"></i></a>
            </li>
            <li>
                <a href="#"><i class="fa fa-instagram"></i></a>
            </li>
            <li>
                <a href="#"><i class="fa fa-youtube-play"></i></a>
            </li>
        </ul>
        <!-- end home-social-list -->

        <div class="home-scrolldown">
            <a href="#about" class="scroll-icon smoothscroll">
                <span>Scroll Down</span>
                <i class="icon-arrow-right" aria-hidden="true"></i>
            </a>
        </div>

    </section> <!-- end home -->  


    <!-- about
    ================================================== -->
    <section id="about">

        <div class="row about-intro">

            <div class="col-four">
                <h1 class="intro-header" data-aos="fade-up">About Our App</h1>
            </div>
            <div class="col-eight">
                <p class="lead" data-aos="fade-up">
                    The FitQuest app is gamified fitness application that is tailored for the gym environment and for those who wants to level-up their fitness journey. FitQuest uses a motion-tracking system that will make the movement of the users into a points that can be used to redeem rewards.
                </p>
            </div>                       
            
        </div>

        <div class="row about-features">

            <div class="features-list block-1-3 block-m-1-2 block-mob-full group">

                <div class="bgrid feature" data-aos="fade-up">	

                    <span class="icon"><i class="icon-book"></i></span>            

                    <div class="service-content">	

                        <h3>Extensive Libraries</h3>

                        <p>Our team is committed to ensuring that our users have access to the latest and most comprehensive workout libraries, keeping the content current and relevant.
                        </p>
                        
                    </div> 	         	 

                    </div> <!-- /bgrid -->

                    <div class="bgrid feature" data-aos="fade-up">	

                        <span class="icon"><i class="icon-glasses"></i></span>                          

                    <div class="service-content">	
                        <h3>Science-based Approach</h3>  

                        <p>This project is meticulously crafted with a science-based approach to fitness. The team firmly believes that harnessing a wealth of research and studies is the cornerstone of our methodology.
                        </p>

                        
                    </div>	                          

                </div> <!-- /bgrid -->

                <div class="bgrid feature" data-aos="fade-up">

                    <span class="icon"><i class="icon-headset"></i></span>		            

                    <div class="service-content">
                        <h3>Fitness Gamification</h3>

                        <p>The primary objective of this project is to infuse the concept of fitness with gamification. The team is confident that this innovative approach can serve as the primary catalyst for our users' motivation.
                        </p> 
                            
                    </div> 	            	               

                </div> <!-- /bgrid -->

            </div> <!-- end features-list -->

        </div> <!-- end about-features -->

        <div class="row about-how">
          
            <h1 class="intro-header" data-aos="fade-up">How The App Works?</h1>           

            <div class="about-how-content" data-aos="fade-up">
                <div class="about-how-steps block-1-2 block-tab-full group">

                    <div class="bgrid step" data-item="1">
                        <h3>Sign-Up</h3>
                        <p>Users can sign-up an account for the membership for them to be eligible to use the application and redeem rewards that is available inside the application. 
                        </p> 
                    </div>

                    <div class="bgrid step" data-item="2">
                        <h3>Calibrate Workout</h3>
                        <p>The user need to setup the desired workout and calibrate their motion so the points that they will gain is based on their movement percentage.
                        </p> 
                    </div>               
               
                    <div class="bgrid step" data-item="3">
                        <h3>Start your Workout</h3>
                        <p>Before users start workingout, users can search for specific workouts by category. Each workouts have a detailed description with clear instructions.
                        </p> 
                    </div>

                    <div class="bgrid step" data-item="4">
                        <h3>Redeem Rewards</h3>
                        <p>Users can claim rewards after completing the specific workout like discount vouchers.
                        </p> 
                    </div>  

                </div>           
           </div> <!-- end about-how-content -->

        </div> <!-- end about-how --> 


        <div class="row about-bottom-image">

           <img src="images/app-screens-2800.png">

        </div>  <!-- end about-bottom-image -->       
        
    </section> <!-- end about -->  
   

    <section id="our-team">
    <div class="row team-content">

        <div class="col-four team-intro">
            <h1 class="intro-header" data-aos="fade-up">Meet Our Team</h1>
            <p data-aos="fade-up">Get to know the dedicated professionals behind our company. Each member of our team brings a unique set of skills and expertise, contributing to our mission of delivering excellence.</p>
            <h1 class="intro-header" data-aos="fade-up">About Us</h1>
            <p data-aos="fade-up"> We are a group of 5 aspiring IT developers currently studying at the FEU Institute of Technology. We're passionate about technology and dedicated to honing our skills to become the best in our field. Our diverse backgrounds and shared ambition drive us to create innovative solutions and make a positive impact in the tech world.</p>
        </div>

        <div class="col-eight team-table">
            <div class="row">

                <div class="col-four team-wrap">
                    <div class="team-block" data-aos="fade-up">
                        <div class="team-top-part">
                            <img src="images/2.jpg" alt="Team Member 1" class="team-photo">
                            <h3 class="team-block-name">Clark Aquino</h3>
                            <p class="team-block-title">Lead Designer, Developer <br><br><br></p>
                        </div>
                    </div>
                </div> <!-- end team-wrap -->

                <div class="col-four team-wrap">
                    <div class="team-block" data-aos="fade-up">
                        <div class="team-top-part">
                            <img src="images/1.jpg" alt="Team Member 2" class="team-photo">
                            <h3 class="team-block-name">Lex Gustillo</h3>
                            <p class="team-block-title">Lead Developer, Mobile Developer<br><br><br><br><br></p>
                        </div>
                    </div>
                </div> <!-- end team-wrap -->

                <div class="col-four team-wrap">
                    <div class="team-block" data-aos="fade-up">
                        <div class="team-top-part">
                            <img src="images/3.jpg" alt="Team Member 3" class="team-photo">
                            <h3 class="team-block-name">Inigo Guittap</h3>
                            <p class="team-block-title">Lead Developer, Mobile Developer</p>
                        </div>
                    </div>
                </div> <!-- end team-wrap -->

                <div class="col-four team-wrap">
                    <div class="team-block" data-aos="fade-up">
                        <div class="team-top-part">
                            <img src="images/4.png" alt="Team Member 4" class="team-photo">
                            <h3 class="team-block-name">Jerome Ecubin</h3>
                            <p class="team-block-title">Lead Designer, Developer</p>
                        </div>
                    </div>
                </div> <!-- end team-wrap -->

                <div class="col-four team-wrap">
                    <div class="team-block" data-aos="fade-up">
                        <div class="team-top-part">
                            <img src="images/5.png" alt="Team Member 5" class="team-photo">
                            <h3 class="team-block-name">Ja Ragusta</h3>
                            <p class="team-block-title">Developer<br><br><br></p>
                        </div>
                    </div>
                </div> <!-- end team-wrap -->

            </div>
        </div> <!-- end team-table -->
    </div> <!-- end team-content -->
</section>

<style>
    
    #our-team {
        padding: 60px 0;
        background: #ebebeb;
    }
    .team-content .intro-header {
        text-align: left;
        margin-bottom: 20px;
    }
    .team-intro p {
        text-align: left;
    }
    .team-table {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .team-wrap {
        margin-bottom: 30px;
        text-align: center;
    }
    .team-block {
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .team-top-part {
        margin-bottom: 10px;
    }
    .team-photo {
        width: 100%;
        height: auto;
        border-radius: 50%;
        margin-bottom: 15px;
    }
    .team-block-name {
        font-size: 1.2em;
        font-weight: bold;
    }
    .team-block-title {
        font-size: 1em;
        color: #777;
    }
</style>
    <!-- BMI Calculator Section Begin -->
    <section id="bmi-calculator">
        <div class="row bmi-content">
            <div class="col-twelve">
    
                <div class="section-title">
                    <h1>BMI Calculator</h1>
                </div>
    
                <div class="bmi-calc-form">
                    <div class="form-block">
                        <h3>Calculate Your BMI</h3>
                        <form id="bmiForm">
                            <div class="form-field">
                                <label for="height">Height (cm)</label>
                                <input type="number" id="height" placeholder="Enter your height" required>
                            </div>
                            <div class="form-field">
                                <label for="weight">Weight (kg)</label>
                                <input type="number" id="weight" placeholder="Enter your weight" required>
                            </div>
                            <button type="button" onclick="calculateBMI()">Calculate</button>
                        </form>
                        <div id="result"></div>
                    </div> <!-- end form-block -->
                </div> <!-- end bmi-calc-form -->
    
                <div class="bmi-chart">
                    <div class="chart-block">
                        <h3>BMI Chart</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>BMI</th>
                                    <th>Weight Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Below 18.5</td>
                                    <td>Underweight</td>
                                </tr>
                                <tr>
                                    <td>18.5 - 24.9</td>
                                    <td>Normal weight</td>
                                </tr>
                                <tr>
                                    <td>25.0 - 29.9</td>
                                    <td>Overweight</td>
                                </tr>
                                <tr>
                                    <td>30.0 and Above</td>
                                    <td>Obesity</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> <!-- end chart-block -->
                </div> <!-- end bmi-chart -->
    
            </div> <!-- end col-twelve -->
        </div> <!-- end row bmi-content -->
    </section>
    
    

<!-- External Scripts -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<!-- BMI Calculation Script -->
<script>
    function calculateBMI() {
        // Get user input
        var height = parseFloat(document.getElementById('height').value);
        var weight = parseFloat(document.getElementById('weight').value);

        // Check if the inputs are valid
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert("Please enter valid height and weight.");
            return;
        }

        // Calculate BMI
        var bmi = weight / Math.pow(height / 100, 2);

        // Determine weight status
        var status;
        if (bmi < 18.5) {
            status = "Underweight";
        } else if (bmi < 25) {
            status = "Healthy";
        } else if (bmi < 30) {
            status = "Overweight";
        } else {
            status = "Obese";
        }

        // Display BMI result
        var resultElement = document.getElementById('result');
        resultElement.innerHTML = "Your BMI is: " + bmi.toFixed(2) + "<br>Weight Status: " + status;

        // Set the color to match the style
        resultElement.style.color = "white";
        resultElement.style.backgroundColor = "navy";
        resultElement.style.padding = "10px";
        resultElement.style.borderRadius = "5px";
        resultElement.style.marginTop = "20px";
    }
</script>
    <!-- Testimonials Section
    ================================================== -->
    <!-- <section id="testimonials">

        <div class="row">
            <div class="col-twelve">
                <h1 class="intro-header" data-aos="fade-up">What They Say About Our App.</h1>
            </div>   		
        </div>   	

        <div class="row owl-wrap">

            <div id="testimonial-slider"  data-aos="fade-up">

                <div class="slides owl-carousel">

                    <div>
                        <p>
                            I've tried countless fitness apps, but FitQuest is the only one I've stuck with. The variety of workouts keeps me engaged and motivated, and the community challenges add a fun social aspect. 
                            I've seen significant improvements in my strength, endurance, and overall well-being since using this app.
                        </p> 

                        <div class="testimonial-author">
                                <img src="images/avatars/user-02.jpg" alt="Author image">
                                <div class="author-info">
                                    John Smith
                                    <span class="position">Fitness Enthusiast and Marathon Runner.</span>
                                </div>
                        </div>                 
                    </div> 

                    <div>
                        <p>
                            As a certified personal trainer, I'm always looking for innovative tools to help my clients reach their goals. FitQuest is a game-changer. The personalized workout plans, nutritional guidance, and progress tracking features make it the ultimate fitness companion. 
                            I highly recommend it to anyone serious about getting in shape.    
                        </p>

                        <div class="testimonial-author">
                                <img src="images/avatars/user-03.jpg" alt="Author image">
                                <div class="author-info">
                                    John Doe
                                    <span>CPT, NASM Certified Personal Trainer</span>
                                </div>
                        </div>                                         
                    </div> 

                </div> end slides -->

            </div> <!-- end testimonial-slider -->          
            
        </div> <!-- end flex-container -->

    </section> <!-- end testimonials -->
    

    <!-- download
    ================================================== -->
    <section id="download">

        <div class="row">
            <div class="col-full">
                <h1 class="intro-header"  data-aos="fade-up">Download Our App Today!</h1>

                <p class="lead" data-aos="fade-up">
                    Ready to level up your workouts? Download FitQuest now and start your journey to a healthier, stronger you.
                </p>

                <ul class="download-badges">
                    
                    <li><a href="#" title="" class="badge-googleplay" data-aos="fade-up">Play Store</a></li>
                </ul>

            </div>
        </div>

    </section> <!-- end download -->    


    <!-- footer
    ================================================== -->
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
    <script src="js/jquery-2.1.3.min.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/main.js"></script>
    <script type="module" src="../dist/auth.bundle.js"></script>
</body>
</html>