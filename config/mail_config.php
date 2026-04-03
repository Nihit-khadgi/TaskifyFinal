<?php
// config/mail_config.php - Manual PHPMailer version (NO COMPOSER)
// Add this at the very top of mail_config.php
header('Content-Type: text/html; charset=UTF-8');
// Load PHPMailer manually
require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer/src/SMTP.php';
require __DIR__ . '/../PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load .env file
function loadEnv() {
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) {
        error_log(".env file not found at: " . $envFile);
        return;
    }
    
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
            $_ENV[trim($key)] = trim($value);
        }
    }
}

loadEnv();

/**
 * Send email using SMTP (Gmail App Password)
 */
function sendTaskifyEmail($to, $subject, $body, $isHTML = true) {
    $username = getenv('SMTP_USERNAME') ?: $_ENV['SMTP_USERNAME'] ?? null;
    $password = getenv('SMTP_PASSWORD') ?: $_ENV['SMTP_PASSWORD'] ?? null;
    
    if (!$username || !$password) {
        error_log("Email not configured. Missing SMTP credentials.");
        return false;
    }
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $username;
        $mail->Password   = $password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = getenv('SMTP_PORT') ?: 587;
        
        // Recipients
        $mail->setFrom($username, 'Taskify');
        $mail->addAddress($to);
        
        // Content
        $mail->isHTML($isHTML);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = strip_tags($body);
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Email failed: {$mail->ErrorInfo}");
        return false;
    }
}

/**
 * Send a task reminder email
 */
function sendTaskReminderEmail($to, $taskTitle, $dueDate) {
    $subject = "🔔 Task Reminder: {$taskTitle}";
    
    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-title { font-size: 20px; font-weight: bold; color: #3b82f6; }
            .due-date { background: #fef3c7; padding: 10px; border-radius: 5px; margin: 15px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📋 Taskify Reminder</h2>
            </div>
            <div class='content'>
                <p>Hello,</p>
                <p>Your task <span class='task-title'>'{$taskTitle}'</span> is due on:</p>
                <div class='due-date'>
                    <strong>📅 Due Date: {$dueDate}</strong>
                </div>
                <p>Don't forget to complete it!</p>
                <a href='" . (getenv('APP_URL') ?: 'http://localhost/Taskify') . "/index.html' class='button'>View in Taskify</a>
                <div class='footer'>
                    <p>You're receiving this because you have email notifications enabled.</p>
                    <p>Taskify - Stay Productive!</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendTaskifyEmail($to, $subject, $body);
}

/**
 * Send overdue task email
 */
function sendOverdueEmail($to, $taskTitle, $dueDate) {
    $subject = "⚠️ OVERDUE: {$taskTitle}";
    
    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning { background: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ef4444; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>⚠️ Task Overdue</h2>
            </div>
            <div class='content'>
                <p>Hello,</p>
                <div class='warning'>
                    <strong>Your task '{$taskTitle}' was due on {$dueDate}</strong><br>
                    This task is now OVERDUE!
                </div>
                <p>Please complete this task as soon as possible.</p>
                <a href='" . (getenv('APP_URL') ?: 'http://localhost/Taskify') . "/index.html' class='button'>Complete Task Now</a>
                <div class='footer'>
                    <p>Taskify - Stay Productive!</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendTaskifyEmail($to, $subject, $body);
}
?>