<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'websitelop12_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Lỗi kết nối DB: " . $conn->connect_error]));
}
$conn->set_charset("utf8mb4");
date_default_timezone_set('Asia/Ho_Chi_Minh');
?>