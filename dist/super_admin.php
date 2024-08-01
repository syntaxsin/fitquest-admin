<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin | FitQuest</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" 
    integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
    integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F0ECE5;
            color: #333333;
        }
        .navbar {
            background-color: #161A30;
        }
        .navbar-brand, .navbar-nav .nav-link {
            color: white;
            font-size: 20px;
        }
        .overview-label{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .main-content {
            width: 95vw;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
        .card-custom {
            display: flex;
            justify-content: center;
            background: white;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
        }
        .table th {
            background-color: #161A30;
            color: white;
        }
    </style>
</head>
<body>
    <!-- <nav class="navbar navbar-expand-lg navbar-dark px-5">
        <a class="navbar-brand" href="#">Fit<span style="color: #315abb;">Quest</span> | Super Admin</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">Users</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Admin</a>
                </li>
                <li class="nav-item">
                    <button class="btn btn-secondary-custom ml-2" id="logout">Logout</button>
                </li>
            </ul>
        </div>
    </nav> -->
    <nav class="navbar navbar-expand-lg navbar-dark px-5">
        <a class="navbar-brand" href="#" style="font-size: 30px;">Fit<span style="color: #315abb;">Quest</span></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto mr-5">
                <li class="nav-item">
                    <a class="nav-link" href="#" style="font-size: 20px;" data-toggle="modal" data-target="#deactAdminModal">Deactivated Admins</a>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link" href="#" style="font-size: 20px;">Users</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="font-size: 20px;">Rewards</a>
                </li> -->
            </ul>
        </div>
        <button class="btn btn-secondary-custom logout" type="submit" style="font-size: 20px;">Logout</button>
    </nav>
    <div class="main-content">
        <h1>Welcome, Super Admin!</h1>
        <div class="card card-custom">
            <div class="overview-label">
                <h3>Admin Accounts Overview</h3>
                <button class="btn btn-primary-custom mb-3 float-right" data-toggle="modal" data-target="#addAdminModal">Open New Branch Account</button>
            </div>
            <div id="admin-list">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Branch Name</th>
                            <th>Location</th>
                            <th>Account Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add Admin Modal -->
    <div class="modal fade" id="addAdminModal" tabindex="-1" role="dialog" aria-labelledby="addAdminModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="addAdminModalLabel" style="color: #F0ECE5;">New Admin</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="add-admin-form">
                        <div class="form-group">
                            <label for="admin-email">E-mail Address</label>
                            <input type="email" class="form-control" id="admin-email" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-location">Location</label>
                            <input type="text" class="form-control" id="admin-location" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-branch">Branch Name</label>
                            <input type="text" class="form-control" id="admin-branch" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-fname">First Name</label>
                            <input type="text" class="form-control" id="admin-fname" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-lname">Last Name</label>
                            <input type="text" class="form-control" id="admin-lname" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-password">Password</label>
                            <input type="password" class="form-control" id="admin-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary-custom">Add New Admin</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Admin Modal -->
    <div class="modal fade" id="editAdminModal" tabindex="-1" role="dialog" aria-labelledby="editAdminModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="editAdminModalLabel" style="color: #F0ECE5;">Edit Admin</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-admin-form">
                        <input type="hidden" id="edit-gym-id">
                        <input type="hidden" id="edit-member-id">
                        <div class="form-group">
                            <label for="edit-branch-name">Branch Name</label>
                            <input type="text" class="form-control" id="edit-branch-name" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-location">Location</label>
                            <input type="text" class="form-control" id="edit-location" required>
                        </div>
                        <button type="submit" class="btn btn-primary-custom" id="update-admin">Update Admin</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Deactivate Admin Modal -->
    <div class="modal fade" id="deleteAdminModal" tabindex="-1" role="dialog" aria-labelledby="deleteAdminModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="deleteAdminModalLabel" style="color: #F0ECE5;">Confirm Deactivation</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to deactivate this admin account?</p>
                    <input type="hidden" id="delete-gym-id">
                    <input type="hidden" id="delete-member-id">
                    <button type="button" class="btn btn-secondary-custom" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-danger" id="confirm-delete">Deactivate</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Deactivate Admins Modal -->
    <div class="modal fade" id="deactAdminModal" tabindex="-1" role="dialog" aria-labelledby="deactAdminModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="editAdminModalLabel" style="color: #F0ECE5;">Deactivated Admins</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="deact-list">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Branch Name</th>
                                    <th>Location</th>
                                    <th>Account Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
    <script type="module" src="super_admin.bundle.js"></script>
    <!-- <script>

        function manageUsers(gymId, memberId) {
            // Manage users logic here
            alert(`Manage users for admin ${memberId} from gym ${gymId}`);
        }

        function manageRewards(gymId, memberId) {
            // Manage rewards logic here
            alert(`Manage rewards for admin ${memberId} from gym ${gymId}`);
        }
    </script> -->
</body>
</html>
