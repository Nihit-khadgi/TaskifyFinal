<?php
$host = 'localhost';
$user = 'root';      // XAMPP default
$pass = '';          // XAMPP default is empty
$db   = 'taskify_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die('Database connection failed: ' . $conn->connect_error);
}
?>