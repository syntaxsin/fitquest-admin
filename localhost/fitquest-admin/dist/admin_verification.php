<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Rewards</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script>
        // Check user type and gym information
        const userType = localStorage.getItem('userType');
        const gymId = localStorage.getItem('gymId');

        if (userType !== 'admin' || !gymId) {
            // Redirect to login if not an admin or gym information is missing
            window.location.href = 'login.php';
        }
    </script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F0ECE5;
            color: #333333;
        }

        .navbar {
            background-color: #161A30;
        }

        .navbar-brand,
        .navbar-nav .nav-link {
            color: white;
            font-size: 20px;
        }

        .main-content {
            width: 80vw;
            height: 90vh;
            padding: 1rem;
        }

        .btn-primary-custom {
            background: #161A30;
            color: white;
            width: 250px;
        }

        .btn-primary-custom:hover {
            background: #B6BBC4;
            color: #161A30;
        }

        .btn-secondary-custom {
            background: #161A30;
            color: white;
        }

        .btn-secondary-custom:hover {
            background: #31304D;
            color: #F0ECE5;
        }

        .table th {
            background-color: #161A30;
            color: white;
        }

        .card {
            background: #B6BBC4;
        }
    </style>
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark px-5">
        <a class="navbar-brand" href="#" style="font-size: 30px;">Fit<span style="color: #315abb;">Quest</span> <span style="color: #9999; font-size: 20px;">| Administrator</span></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto mr-5">
                <li class="nav-item">
                    <a class="nav-link" href="admin_index.php" style="font-size: 20px;">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="font-size: 20px;" data-toggle="modal" data-target="#">Manage Points</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="font-size: 20px;">Inactive Users</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="admin_verification.php" style="font-size: 20px;">Verify Rewards</a>
                </li>
            </ul>
        </div>
        <button class="btn btn-secondary-custom" id="logout" type="submit" style="font-size: 20px;">Logout</button>
    </nav>

    <!-- Pending Rewards for the Users of the Gym -->
    <div class="container-fluid main-content">
        <div class="row" style="display: flex; align-items: center; margin: auto;"></div>
    </div>

    <!-- Reward Verification Modal -->
    <div class="modal fade" id="verifyRewardModal" tabindex="-1" role="dialog" aria-labelledby="verifyRewardModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="verifyRewardModalLabel" style="color: #F0ECE5;">Verify Reward</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to verify the selected rewards for this user?</p>
                    <ul id="modalRewardList" class="list-group"></ul>
                </div>
            </div>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
    <script type="module" src="bundle/reward_verif.bundle.js"></script>
</body>

</html>