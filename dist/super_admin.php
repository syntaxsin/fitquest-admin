<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Dashboard | FitQuest</title>
    <!-- Bootstrap CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
        }
        .navbar {
            background-color: #315abb;
        }
        .navbar-brand, .navbar-nav .nav-link {
            color: white;
        }
        .sidebar {
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            background-color: #6a7dfe;
            padding-top: 1rem;
        }
        .sidebar a {
            padding: 15px;
            text-decoration: none;
            font-size: 18px;
            color: white;
            display: block;
        }
        .sidebar a:hover {
            background-color: #315abb;
        }
        .main-content {
            margin-left: 250px;
            padding: 2rem;
        }
        .btn-primary-custom {
            background: linear-gradient(to right, #315abb, #6a7dfe);
            color: white;
        }
        .btn-secondary-custom {
            background: white;
            color: #315abb;
            border: 2px solid #315abb;
        }
        .card-custom {
            background: white;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
        }
        .table th {
            background-color: #315abb;
            color: white;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Super Admin</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">Admin</a>
                </li>
                <li class="nav-item">
                    <button class="btn btn-secondary-custom ml-2" id="logout">Logout</button>
                </li>
            </ul>
        </div>
    </nav>
    <div class="sidebar">
        <a href="points-management.php">Manage User Points</a>
        <a href="inactive_users.php">Inactive Users</a>
        <a href="rewards_archives.php">Rewards Archive</a>
    </div>
    <div class="main-content">
        <h1>Super Admin Dashboard</h1>
        <div class="card card-custom">
            <h2>Admins</h2>
            <button class="btn btn-primary-custom mb-3" data-toggle="modal" data-target="#addAdminModal">Add Admin</button>
            <div id="admin-list"></div>
        </div>
        <div class="card card-custom">
            <h2>Reports</h2>
            <p>Reports and statistics will be shown here...</p>
        </div>
    </div>

    <!-- Add Admin Modal -->
    <div class="modal fade" id="addAdminModal" tabindex="-1" role="dialog" aria-labelledby="addAdminModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addAdminModalLabel">Add New Admin</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                        <button type="submit" class="btn btn-primary-custom">Add Admin</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        document.getElementById('logout').addEventListener('click', function() {
            // Handle logout logic here
            alert('Logout');
        });

        document.getElementById('add-admin-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle add admin logic here
            alert('Admin added');
        });

        // Load admin list dynamically
        function loadAdmins() {
            const adminList = document.getElementById('admin-list');
            adminList.innerHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>john@example.com</td>
                            <td>
                                <button class="btn btn-secondary-custom">Delete</button>
                            </td>
                        </tr>
                        <!-- More rows as needed -->
                    </tbody>
                </table>
            `;
        }

        loadAdmins();
    </script>
</body>
</html>
