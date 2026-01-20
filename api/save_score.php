<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->user_id) && isset($data->score)) {
    $user_id = $data->user_id;
    $score   = $data->score;

    // Chỉ lưu nếu điểm > 0
    if($score > 0) {
        $stmt = $conn->prepare("INSERT INTO scores (user_id, score) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $score); // "ii" là 2 số nguyên
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Lưu điểm thành công!"]);
        } else {
            echo json_encode(["error" => "Lỗi lưu điểm: " . $conn->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "Điểm bằng 0, không cần lưu."]);
    }
}
$conn->close();
?>