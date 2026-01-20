<?php
// File: api/upload_avatar.php
header("Content-Type: application/json");
include 'db_connect.php';

if(isset($_FILES['avatar']) && isset($_POST['username'])) {
    $username = $_POST['username'];
    $file = $_FILES['avatar'];
    
    // 1. Check lỗi file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["status" => "error", "message" => "Lỗi tải file."]);
        exit;
    }

    // 2. Tạo tên file duy nhất
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $new_filename = $username . '_' . time() . '.' . $extension;
    
    // 3. Đường dẫn (Lưu vào folder uploads)
    // Đảm bảo bạn đã tạo thư mục "uploads" ở ngoài cùng (ngang hàng folder api)
    $target_dir = "../uploads/";
    if (!file_exists($target_dir)) { mkdir($target_dir, 0777, true); }

    $target_file = $target_dir . $new_filename;
    
    // 4. Di chuyển file
    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        // Đường dẫn lưu vào DB (Dùng ../uploads/...)
        $db_url = "../uploads/" . $new_filename;
        
        $sql = "UPDATE users SET avatar_url='$db_url' WHERE username='$username'";
        
        if ($conn->query($sql) === TRUE) {
            // Lấy lại thông tin user để trả về
            $result = $conn->query("SELECT * FROM users WHERE username='$username'");
            $user = $result->fetch_assoc();
            
            echo json_encode([
                "status" => "success", 
                "message" => "Đổi ảnh thành công!",
                "avatar_url" => $db_url,
                "user" => $user
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Lỗi SQL."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Không thể lưu file."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu."]);
}
$conn->close();
?>