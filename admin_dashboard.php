<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin Dashboard - Taskify</title>
</head>
<body>
  <h1>Welcome, <?php echo htmlspecialchars($_SESSION['name']); ?> (Admin)</h1>
  <p>Here you can manage users, projects, and tasks (later).</p>
  <p><a href="logout.php">Logout</a></p>
</body>
</html>
