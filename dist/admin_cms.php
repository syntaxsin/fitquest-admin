<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management</title>
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
            margin-top: 20px;
            width: 50vw;
            height: 100%;
            padding: 1rem;
            background: white;
            border-radius: 10px;
        }

        .main-content2 {
            margin-top: 20px;
            width: 50vw;
            height: 100%;
            padding: 1rem;
            background: white;
            border-radius: 10px;
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

        /* .modal-backdrop {
            background-color: rgba(0, 0, 0, 0.3);
        } */
        .table th {
            background-color: #161A30;
            color: white;
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
                    <a class="nav-link" href="admin_index.php">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="admin_verification.php">Verify Rewards</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="admin_cms.php">Content Management</a>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link" href="#" style="font-size: 18px;" data-toggle="modal" data-target="#">Manage Points</a>
                </li> -->
            </ul>
        </div>
        <button class="btn btn-secondary-custom" id="logout" type="submit" style="font-size: 20px;">Logout</button>
    </nav>

    <div class="container-fluid main-content">
        <ul class="nav nav-tabs" id="contentTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="announcements-tab" data-bs-toggle="tab" data-bs-target="#announcements" type="button" role="tab" aria-controls="announcements" aria-selected="true">
                    Announcements
                </button>
            </li>
        </ul>
        <!-- Add Announcement -->
        <div class="tab-content" id="contentTabContent">
            <div class="tab-pane fade show active" id="announcements" role="tabpanel" aria-labelledby="announcements-tab">
                <br>
                <h3>Add Announcement</h3>
                <form id="add-announcement-form">
                    <div class="form-group">
                        <label for="announcementTitle">Title:</label>
                        <input type="text" class="form-control" id="announcementTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="announcementContent">Content:</label>
                        <textarea class="form-control" id="announcementContent" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="announcementPriority">Priority:</label>
                        <select class="form-control" id="announcementPriority">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary-custom">Add Announcement</button>
                </form>
                <br>
                <h3>Existing Announcements</h3>
                <table class="table table-striped table-hover table-responsive-xl">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="announcements-table-body">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="container-fluid main-content2">
        <ul class="nav nav-tabs" id="contentTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="blog-posts-tab" data-bs-toggle="tab" data-bs-target="#blog-posts" type="button" role="tab" aria-controls="blog-posts" aria-selected="false">
                    Blog Posts / Articles
                </button>
            </li>
        </ul>
        <!-- Blog Posts/Articles -->
        <div class="tab-pane fade active show" id="blog-posts" role="tabpanel" aria-labelledby="blog-posts-tab">
            <br>
            <h3>Add Blog Post</h3>
            <form id="add-blog-post-form">
                <div class="form-group">
                    <label for="blogPostTitle">Title:</label>
                    <input type="text" class="form-control" id="blogPostTitle" required>
                </div>
                <div class="form-group">
                    <label for="blogPostAuthor">Author:</label>
                    <input type="text" class="form-control" id="blogPostAuthor" required>
                </div>
                <div class="form-group">
                    <label for="blogPostContent">Content:</label>
                    <textarea class="form-control" id="blogPostContent" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary-custom">Add Blog Post</button>
            </form>
            <br>
            <h3>Existing Blog Posts</h3>
            <table class="table table-striped table-hover table-responsive-xl">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="blog-posts-table-body">
                </tbody>
            </table>
        </div>
    </div>


    <div class="modal fade" id="viewAnnouncementModal" tabindex="-1" role="dialog" aria-labelledby="viewAnnouncementModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="viewAnnouncementModalLabel" style="color: #F0ECE5;">Announcement Details</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h4 id="modalAnnouncementTitle" style="font-weight: 600;"></h4>
                    <p id="modalAnnouncementContent" style="text-align: justify;"></p>
                    <p><strong>Created/Updated At:</strong> <span id="modalAnnouncementDate"></span></p>
                    <p><strong>Priority:</strong> <span id="modalAnnouncementPriority"></span></p>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editAnnouncementModal" tabindex="-1" role="dialog" aria-labelledby="editAnnouncementModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="editAnnouncementModalLabel" style="color: #F0ECE5;">Edit Announcement</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-announcement-form">
                        <input type="hidden" id="editAnnouncementId">
                        <div class="form-group">
                            <label for="editAnnouncementTitle">Title:</label>
                            <input type="text" class="form-control" id="editAnnouncementTitle" required>
                        </div>
                        <div class="form-group">
                            <label for="editAnnouncementContent">Content:</label>
                            <textarea class="form-control" id="editAnnouncementContent" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="editAnnouncementPriority">Priority:</label>
                            <select class="form-control" id="editAnnouncementPriority">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary-custom">Update Announcement</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="viewBlogPostModal" tabindex="-1" role="dialog" aria-labelledby="viewBlogPostModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="viewBlogPostModalLabel" style="color: #F0ECE5;">Blog Post Details</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #F0ECE5;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h3 id="modalBlogPostTitle"></h3>
                    <p><strong>Author:</strong> <span id="modalBlogPostAuthor"></span></p>
                    <p><strong>Created/Updated At:</strong> <span id="modalBlogPostDate"></span></p>
                    <div id="modalBlogPostContent" style="text-align: justify;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editBlogPostModal" tabindex="-1" role="dialog" aria-labelledby="editBlogPostModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background: #161A30;">
                    <h5 class="modal-title" id="editBlogPostModalLabel" style="color: #F0ECE5;">Edit Blog Post</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-blog-post-form">
                        <input type="hidden" id="editBlogPostId">
                        <div class="form-group">
                            <label for="editBlogPostTitle">Title:</label>
                            <input type="text" class="form-control" id="editBlogPostTitle" required>
                        </div>
                        <div class="form-group">
                            <label for="editBlogPostAuthor">Author:</label>
                            <input type="text" class="form-control" id="editBlogPostAuthor" required>
                        </div>
                        <div class="form-group">
                            <label for="editBlogPostContent">Content:</label>
                            <textarea class="form-control" id="editBlogPostContent" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary-custom">Update Blog Post</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
    <script type="module" src="bundle/admin_cms.bundle.js"></script>
</body>

</html>