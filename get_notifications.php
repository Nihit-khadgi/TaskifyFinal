<?php
// get_notifications.php
session_start();
require __DIR__ . '/config/db.php';
require __DIR__ . '/includes/NotificationHandler.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$handler = new NotificationHandler($conn, $_SESSION['user_id']);
$notifications = $handler->getUnreadNotifications();

// Also get read notifications from last 7 days
$sql = "SELECT * FROM notifications 
        WHERE user_id = ? AND is_read = 1 
        AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY created_at DESC LIMIT 10";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$readNotifications = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$allNotifications = array_merge($notifications, $readNotifications);

// Count unread
$sql = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$unreadCount = $stmt->get_result()->fetch_assoc()['count'];

echo json_encode([
    'success' => true,
    'notifications' => $allNotifications,
    'unread_count' => (int)$unreadCount
]);
?>