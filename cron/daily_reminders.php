<?php
// cron/daily_reminders.php
// Visit this URL to manually trigger reminders

require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/mail_config.php';

echo "<h2>📧 Task Reminder Check</h2>";

$tomorrow = date('Y-m-d', strtotime('+1 day'));
echo "<p>Checking for tasks due on: <strong>$tomorrow</strong></p>";

$sql = "SELECT t.id, t.title, t.due_date, u.id as user_id, u.email, u.name 
        FROM tasks t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.due_date = ? AND t.completed = 0 AND t.reminder_sent = 0";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tomorrow);
$stmt->execute();
$result = $stmt->get_result();

$count = 0;
while ($task = $result->fetch_assoc()) {
    echo "<p>📧 Sending reminder to: {$task['email']} for task: {$task['title']}</p>";
    
    $sent = sendTaskReminderEmail($task['email'], $task['title'], $task['due_date']);
    
    if ($sent) {
        // Mark reminder as sent
        $update = $conn->prepare("UPDATE tasks SET reminder_sent = 1 WHERE id = ?");
        $update->bind_param("i", $task['id']);
        $update->execute();
        echo "<p style='color: green;'>✅ Sent!</p>";
        $count++;
    } else {
        echo "<p style='color: red;'>❌ Failed!</p>";
    }
}

echo "<hr>";
echo "<p><strong>Total reminders sent: $count</strong></p>";

if ($count == 0) {
    echo "<p>No tasks due tomorrow. Create a task with due date = $tomorrow and run this again.</p>";
}
?>