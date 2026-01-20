<?php
header('Content-Type: application/json');
require_once 'db.php'; // Sử dụng file kết nối DB có sẵn của bạn

// Thư mục lưu trữ (tự động tạo nếu chưa có)
$targetDir = "../uploads/";
if (!file_exists($targetDir)) { mkdir($targetDir, 0777, true); }

$uploader = $_POST['uploader'] ?? 'Ẩn danh';
$category = $_POST['category'] ?? 'khac';
$files = $_FILES['files'];

$successCount = 0;
$errors = [];

// Xử lý mảng file
foreach ($files['name'] as $key => $name) {
    if ($files['error'][$key] === 0) {
        $fileName = time() . "_" . basename($name);
        $targetPath = $targetDir . $fileName;
        $fileType = pathinfo($targetPath, PATHINFO_EXTENSION);
        $fileSize = round($files['size'][$key] / 1024, 1) . " KB";

        if (move_uploaded_file($files['tmp_name'][$key], $targetPath)) {
            // Chèn vào database (Sửa tên cột nếu bảng của bạn khác)
            $sql = "INSERT INTO documents (title, category, file_path, file_type, file_size, uploader) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssss", $name, $category, $targetPath, $fileType, $fileSize, $uploader);
            
            if ($stmt->execute()) { $successCount++; }
            else { $errors[] = "Lỗi DB: " . $name; }
        } else {
            $errors[] = "Lỗi lưu file: " . $name;
        }
    }
}

echo json_encode([
    "status" => ($successCount > 0) ? "success" : "error",
    "message" => ($successCount > 0) ? "Đã đẩy thành công $successCount file!" : "Thất bại: " . implode(", ", $errors)
]);
$conn->close();
?>