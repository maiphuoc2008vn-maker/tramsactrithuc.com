<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "websitelop12_db"; // Tên database của bạn

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
// Để hiển thị tiếng Việt không lỗi
$conn->set_charset("utf8");
?>