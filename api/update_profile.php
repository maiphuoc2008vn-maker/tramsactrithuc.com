<?php
// api/upload_avatar.php
header("Content-Type: application/json");
include 'db_connect.php';

// Kiểm tra xem có file và username được gửi lên không
if(isset($_FILES['avatar']) && isset($_POST['username'])) {
    $username = $_POST['username'];
    $file = $_FILES['avatar'];
    
    // 1. Kiểm tra lỗi file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["status" => "error", "message" => "Lỗi tải file."]);
        exit;
    }

    // 2. Tạo tên file mới (để tránh trùng tên)
    // Lấy đuôi file (jpg, png...)
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    // Tên file = username + thời gian . đuôi file
    $new_filename = $username . '_' . time() . '.' . $extension;
    
    // Đường dẫn lưu file trên Server
    $target_dir = "../uploads/";
    $target_file = $target_dir . $new_filename;
    
    // 3. Di chuyển file từ bộ nhớ tạm vào thư mục uploads
    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        
        // Đường dẫn để lưu vào CSDL (Frontend sẽ dùng đường dẫn này)
        // Vì file html nằm trong thư mục con (game/profile), nên đường dẫn ảnh phải là ../uploads/...
        $db_url = "../uploads/" . $new_filename;

        // 4. Cập nhật SQL
        $sql = "UPDATE users SET avatar_url='$db_url' WHERE username='$username'";
        
        if ($conn->query($sql) === TRUE) {
            // Lấy lại thông tin user mới nhất
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
        echo json_encode(["status" => "error", "message" => "Không thể lưu file vào thư mục uploads."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu gửi lên."]);
}
$conn->close();
?>