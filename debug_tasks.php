<?php
// debug_tasks.php - Check what tasks exist

require __DIR__ . '/config/db.php';

echo "<h2>Task Debug</h2>";

// Show all tasks
$sql = "SELECT id, title, due_date, completed, reminder_sent FROM tasks";
$result = $conn->query($sql);

echo "<h3>All Tasks:</h3>";
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>ID</th><th>Title</th><th>Due Date</th><th>Completed</th><th>Reminder Sent</th></tr>";

if ($result->num_rows == 0) {
    echo "<tr><td colspan='5'>No tasks found</td></tr>";
} else {
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td>{$row['title']}</td>";
        echo "<td>{$row['due_date']}</td>";
        echo "<td>{$row['completed']}</td>";
        echo "<td>{$row['reminder_sent']}</td>";
        echo "</tr>";
    }
}
echo "</table>";

// Show tomorrow's date
$tomorrow = date('Y-m-d', strtotime('+1 day'));
echo "<p><strong>Tomorrow's date: $tomorrow</strong></p>";

// Check specifically for tomorrow's tasks
$sql = "SELECT * FROM tasks WHERE due_date = '$tomorrow'";
$result = $conn->query($sql);
echo "<p>Tasks due tomorrow: " . $result->num_rows . "</p>";

// Show date format example
echo "<p><strong>Note:</strong> Your due_date format should be YYYY-MM-DD (like $tomorrow)</p>";
?>