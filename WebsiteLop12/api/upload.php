<?php
header('Content-Type: application/json');

// 1. Kết nối Database
$host = "localhost";
$user = "root";
$pass = "";
$db   = "websitelop12_db"; // Tên database theo ảnh của bạn

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Lỗi kết nối DB"]);
    exit;
}

// 2. Thư mục lưu file
$targetDir = "../uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$uploader = $_POST['uploader'] ?? 'Thành viên lớp';
$category = $_POST['category'] ?? 'khac';
$files = $_FILES['files'];

$successCount = 0;
$errors = [];

// 3. Xử lý vòng lặp tải lên từng file
foreach ($files['name'] as $key => $name) {
    if ($files['error'][$key] === 0) {
        // Tạo tên file duy nhất để không bị ghi đè (timestamp + tên gốc)
        $fileName = time() . "_" . basename($name);
        $targetPath = $targetDir . $fileName;
        
        // Lấy thông tin file
        $fileType = pathinfo($targetPath, PATHINFO_EXTENSION);
        $fileSize = round($files['size'][$key] / 1024, 1) . " KB";

        if (move_uploaded_file($files['tmp_name'][$key], $targetPath)) {
            // 4. Lưu vào bảng documents của bạn
            // Lưu ý: Đảm bảo các cột (title, category, file_path, file_type, file_size, uploader) tồn tại
            $sql = "INSERT INTO documents (title, category, file_path, file_type, file_size, uploader) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssss", $name, $category, $targetPath, $fileType, $fileSize, $uploader);
            
            if ($stmt->execute()) {
                $successCount++;
            } else {
                $errors[] = "Lỗi Database: " . $conn->error;
            }
        } else {
            $errors[] = "Không thể lưu file vật lý: $name";
        }
    }
}

// 5. Phản hồi kết quả
if ($successCount > 0) {
    echo json_encode([
        "status" => "success", 
        "message" => "Đã đẩy thành công $successCount tài liệu lên hệ thống!"
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Có lỗi xảy ra: " . implode(", ", $errors)
    ]);
}

$conn->close();
?>