<?php
// includes/NotificationHandler.php
class NotificationHandler {
    private $conn;
    private $userId;
    
    public function __construct($dbConnection, $userId) {
        $this->conn = $dbConnection;
        $this->userId = $userId;
    }
    
    // Create in-app notification
    public function createInAppNotification($taskId, $type, $title, $message) {
        $sql = "INSERT INTO notifications (user_id, task_id, type, title, message) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("iisss", $this->userId, $taskId, $type, $title, $message);
        return $stmt->execute();
    }
    
    // Send email if user has it enabled
    public function sendEmailIfEnabled($to, $subject, $body) {
        // Check if user wants email notifications
        $sql = "SELECT email_notifications FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $this->userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($user && $user['email_notifications']) {
            // Rate limit: don't send more than 5 emails per hour
            $sql = "SELECT COUNT(*) as count FROM notifications 
                    WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $this->userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $count = $result->fetch_assoc()['count'];
            
            if ($count < 5) {
                return sendTaskifyEmail($to, $subject, $body);
            }
        }
        return false;
    }
    
    // Send task reminder (1 day before due)
    public function sendTaskReminder($taskId, $taskTitle, $dueDate, $userEmail) {
        $message = "Your task '{$taskTitle}' is due tomorrow ({$dueDate}).";
        
        // In-app notification
        $this->createInAppNotification($taskId, 'reminder', 'Task Reminder', $message);
        
        // Email notification
        $emailBody = "
            <div style='font-family: Arial, sans-serif; max-width: 600px;'>
                <h2 style='color: #3b82f6;'>⏰ Task Reminder</h2>
                <p>Your task <strong>'{$taskTitle}'</strong> is due <strong>tomorrow ({$dueDate})</strong>.</p>
                <div style='background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;'>
                    <p style='margin: 0;'>Don't forget to complete it!</p>
                </div>
                <a href='http://localhost/taskify/index.html' style='background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    View in Taskify
                </a>
                <hr style='margin: 20px 0;'>
                <small>You're receiving this because you have email notifications enabled.</small>
            </div>
        ";
        
        $this->sendEmailIfEnabled($userEmail, "🔔 Task Reminder: {$taskTitle}", $emailBody);
        
        // Mark reminder as sent
        $sql = "UPDATE tasks SET reminder_sent = 1 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $taskId);
        $stmt->execute();
    }
    
    // Send overdue notification
    public function sendOverdueNotification($taskId, $taskTitle, $dueDate, $userEmail) {
        $message = "Your task '{$taskTitle}' was due on {$dueDate} and is now overdue!";
        
        // In-app notification
        $this->createInAppNotification($taskId, 'overdue', '⚠️ Task Overdue', $message);
        
        // Email notification
        $emailBody = "
            <div style='font-family: Arial, sans-serif; max-width: 600px;'>
                <h2 style='color: #ef4444;'>⚠️ Task Overdue</h2>
                <p>Your task <strong>'{$taskTitle}'</strong> was due on <strong>{$dueDate}</strong> and is now <strong style='color: #ef4444;'>OVERDUE</strong>.</p>
                <div style='background: #fee2e2; padding: 15px; border-radius: 8px; margin: 15px 0;'>
                    <p style='margin: 0;'>Please complete this task as soon as possible!</p>
                </div>
                <a href='http://localhost/taskify/index.html' style='background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                    View Task
                </a>
                <hr style='margin: 20px 0;'>
                <small>You're receiving this because you have email notifications enabled.</small>
            </div>
        ";
        
        $this->sendEmailIfEnabled($userEmail, "⚠️ Overdue: {$taskTitle}", $emailBody);
        
        // Mark as sent
        $sql = "UPDATE tasks SET overdue_notification_sent = 1 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $taskId);
        $stmt->execute();
    }
    
    // Send task completion confirmation
    public function sendTaskCompletedNotification($taskId, $taskTitle, $userEmail) {
        $message = "Great job! You completed '{$taskTitle}'.";
        
        // In-app notification
        $this->createInAppNotification($taskId, 'task_completed', '✅ Task Completed', $message);
        
        // Optional email (optional - might be spammy)
        // Uncomment if you want completion emails
        /*
        $emailBody = "
            <div style='font-family: Arial, sans-serif;'>
                <h2 style='color: #10b981;'>✅ Task Completed!</h2>
                <p>Great job completing <strong>'{$taskTitle}'</strong>!</p>
                <p>Keep up the productivity! 🎉</p>
            </div>
        ";
        $this->sendEmailIfEnabled($userEmail, "✅ Completed: {$taskTitle}", $emailBody);
        */
    }
    
    // Get unread notifications for user
    public function getUnreadNotifications() {
        $sql = "SELECT * FROM notifications 
                WHERE user_id = ? AND is_read = 0 
                ORDER BY created_at DESC LIMIT 20";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $this->userId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    // Mark notification as read
    public function markAsRead($notificationId) {
        $sql = "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $notificationId, $this->userId);
        return $stmt->execute();
    }
    
    // Mark all as read
    public function markAllAsRead() {
        $sql = "UPDATE notifications SET is_read = 1 WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $this->userId);
        return $stmt->execute();
    }
}
?>