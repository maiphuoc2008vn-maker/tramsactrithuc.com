<?php
// File: api/get_leaderboard.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Kết nối CSDL (Sử dụng chung file kết nối với login)
require_once 'db_connect.php'; 
// Nếu bạn chưa có file db_connect.php riêng, hãy copy đoạn kết nối $conn vào đây.

// 2. Truy vấn lấy Top 10 người điểm cao nhất
// Giả sử bảng tên là 'users', cột điểm là 'score' (hoặc 'points'), cột avatar là 'avatar_url'
$sql = "SELECT username, score, avatar_url FROM users ORDER BY score DESC LIMIT 10";

$result = $conn->query($sql);

$leaderboard = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Xử lý ảnh đại diện mặc định nếu null
        if (empty($row['avatar_url'])) {
            $row['avatar_url'] = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }
        $leaderboard[] = $row;
    }
}

// 3. Trả về JSON
echo json_encode($leaderboard);

$conn->close();
?>