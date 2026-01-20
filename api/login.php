<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->password)) {
    $u = $data->username; $p = $data->password;

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $u, $p);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows > 0) {
        $user = $res->fetch_assoc();
        unset($user['password']); // Bảo mật: Xóa pass trước khi trả về
        echo json_encode(["message" => "Login OK", "user" => $user]);
    } else {
        echo json_encode(["error" => "Sai tài khoản hoặc mật khẩu!"]);
    }
} else { echo json_encode(["error" => "Thiếu thông tin!"]); }
?>