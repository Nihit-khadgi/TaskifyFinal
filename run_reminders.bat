@echo off
E:\xampp\php\php.exe -f E:\xampp\htdocs\Taskify\cron\daily_reminders.php
echo Reminders sent at %date% %time% >> reminder_log.txt