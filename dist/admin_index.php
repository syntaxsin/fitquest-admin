<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitQuest | Admin</title>
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
            font-size: 18px;
            padding: 5px 8px;
        }

        .main-content {
            width: auto;
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
            background: #B6BBC4;
            color: #161A30;
        }

        .table th {
            background-color: #161A30;
            color: white;
        }

        .div-cards {
            display: flex;
        }

        .card {
            background: #B6BBC4;
        }

        .card:hover {
            cursor: pointer;
        }

        .add-reward-btn,
        .add-user-btn {
            padding: 45px 160px;
        }
    </style>
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark px-5">
        <a class="navbar-brand" href="#" style="font-size: 28px;">Fit<span style="color: #315abb;">Quest</span> <span style="color: #9999; font-size: 20px;">| Administrator</span></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto mr-5">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="admin_verification.php">Verify Rewards</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="admin_cms.php">Content Management</a>
                </li>
            </ul>
        </div>
        <button class="btn btn-secondary-custom" id="logout" type="submit" style="font-size: 18px;">Logout</button>
    </nav>

    <div class="container-fluid main-content">
        <div class="main-content row row-cols-2">
            <!-- Real-time snapshot of quantity of the users and rewards -->
            <div class="div-cards col">
                <div class="card m-1" style="width: 18rem;">
                    <div class="card-body">
                        <p class="card-text">quantity</p>
                        <h4 class="card-title">Users</h4>
                    </div>
                </div>
                <div class="card m-1" style="width: 18rem;">
                    <div class="card-body">
                        <p class="card-text">quantity</p>
                        <h4 class="card-title">Rewards</h4>
                    </div>
                </div>
                <div class="card m-1" style="width: 18rem;">
                    <div class="card-body" style="display: flex; align-items:center;">
                        <h4 class="card-title">Deactivated Accounts</h4>
                    </div>
                </div>
            </div>
            <!-- User Table -->
            <div class="add-btn col">
                <button type="button" class="add-btn1 btn btn-secondary-custom btn-lg add-reward-btn" data-toggle="modal" data-target="#addRewardModal">Add Reward</button>
                <button type="button" class="add-btn2 btn btn-secondary-custom btn-lg add-user-btn" data-toggle="modal" data-target="#addUserModal">Add New User</button>
            </div>
            <div id="user-list" class="col">
                <table class="table table-striped table-hover table-responsive-xl">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Account Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div id="rewards-list" class="col">
                <table class="table table-striped table-hover table-responsive-xl">
                    <thead>
                        <tr>
                            <th>Reward ID</th>
                            <th>Reward Name</th>
                            <th>Description</th>
                            <th>Required Points</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Manage Points Modal -->
    <div class="modal fade" id="managePointsModal" tabindex="-1" aria-labelledby="managePointsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="managePointsModalLabel" style="color: #F0ECE5;">Manage Points</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Member ID</th>
                                <th>Name</th>
                                <th>Points</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="points-table-body">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add User Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1" role="dialog" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="addAdminModalLabel" style="color: #F0ECE5;">New User</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="add-user-form">
                        <div class="form-group">
                            <label for="new-email">E-mail Address</label>
                            <input type="email" class="form-control" id="new-email" required>
                        </div>
                        <div class="form-group">
                            <label for="new-fname">First Name</label>
                            <input type="text" class="form-control" id="new-fname" required>
                        </div>
                        <div class="form-group">
                            <label for="new-lname">Last Name</label>
                            <input type="text" class="form-control" id="new-lname" required>
                        </div>
                        <div class="form-group">
                            <label for="new-password">Password</label>
                            <input type="password" class="form-control" id="new-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary-custom">Add New User</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deactivateUserModal" tabindex="-1" role="dialog" aria-labelledby="deactivateUserModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="deactivateUserModalLabel" style="color: #F0ECE5;">Confirm Deactivation</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to deactivate this user account?</p>
                    <input type="hidden" id="deactivate-member-id">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirm-deactivate">Deactivate</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="inactiveUsersModal" tabindex="-1" aria-labelledby="inactiveUsersModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="inactiveUsersModalLabel" style="color: #F0ECE5;">Inactive Users</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="inactiveUsersList"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Reward Modal -->
    <div class="modal fade" id="addRewardModal" tabindex="-1" role="dialog" aria-labelledby="addRewardModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="addAdminModalLabel" style="color: #F0ECE5;">Reward</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="add-reward-form">
                        <div class="form-group">
                            <label for="rewardName">Reward Name:</label>
                            <input type="text" class="form-control" id="rewardName" required>
                        </div>
                        <div class="form-group">
                            <label for="rewardDescription">Description</label>
                            <input type="text" class="form-control" id="rewardDescription" required>
                        </div>
                        <div class="form-group">
                            <label for="requiredPoints">Required Points</label>
                            <input type="text" class="form-control" id="requiredPoints" required>
                        </div>
                        <button type="submit" class="btn btn-primary-custom">Add Reward</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Reward Modal -->
    <div class="modal fade" id="editRewardModal" tabindex="-1" role="dialog" aria-labelledby="editRewardModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="editRewardModalLabel" style="color: #F0ECE5;">Edit Reward</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="updateReward">
                        <div class="form-group">
                            <input type="hidden" id="reward_id"> <label for="updateRewardName">Reward Name:</label>
                            <input type="text" class="form-control" id="updateRewardName" required>
                        </div>
                        <div class="form-group">
                            <label for="updateRewardDescription">Description</label>
                            <input type="text" class="form-control" id="updateRewardDescription" required>
                        </div>

                        <div class="form-group">
                            <label for="updateRequiredPoints">Required Points</label>
                            <input type="text" class="form-control" id="updateRequiredPoints" required>
                        </div>
                        <button type="submit" class="btn btn-primary-custom">Update Reward</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Reward Modal -->
    <div class="modal fade" id="deleteRewardModal" tabindex="-1" role="dialog" aria-labelledby="deleteRewardModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">  

                    <h5 class="modal-title" id="deleteRewardModalLabel" style="color: #F0ECE5;">Delete Reward</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this reward?</p>
                    <input type="hidden" id="delete-reward-id"> <button type="button" class="btn btn-secondary-custom" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirm-delete-reward">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
    <script type="module" src="bundle/index.bundle.js"></script>
</body>

</html>