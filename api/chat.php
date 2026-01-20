<?php
// api/chat.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->message) || empty($data->message)) {
    echo json_encode(["reply" => "Im lặng là vàng, nhưng nhập gì đó đi chứ?"]);
    exit;
}

$userMessage = $data->message;
// Lấy ngữ cảnh (mặc định là 'home' nếu không gửi lên)
$context = isset($data->context) ? $data->context : 'home';

// --- CẤU HÌNH TÍNH CÁCH AI ---
if ($context === 'game') {
    // NHÂN CÁCH: TRONG GAME (Cà khịa, chửi yêu)
    $systemInstruction = "Bạn là một trợ lý Game cực kỳ đanh đá, xéo xắt và hay mỉa mai (toxic vui vẻ). " .
                         "Người chơi đang chơi game 'Đuổi hình bắt chữ' về Tin học. " .
                         "Nếu họ hỏi đáp án, hãy chê họ là 'gà', 'non', hoặc 'lười suy nghĩ' trước khi đưa ra một gợi ý mập mờ. " .
                         "Tuyệt đối không đưa đáp án trực tiếp. Hãy dùng ngôn ngữ teen, hài hước và hơi phũ phàng.";
} else {
    // NHÂN CÁCH: TRANG CHỦ (Thân thiện, nghiêm túc)
    $systemInstruction = "Bạn là trợ lý ảo thông minh của lớp 12A4 trường THPT Đam Ri. " .
                         "Bạn rất thân thiện, lễ phép, hiểu biết sâu rộng về lập trình và công nghệ. " .
                         "Hãy trả lời ngắn gọn, súc tích và hỗ trợ mọi người nhiệt tình.";
}

// --- THAY API KEY CỦA BẠN VÀO ĐÂY ---
$apiKey = "DÁN_API_KEY_CỦA_BẠN_VÀO_ĐÂY"; 
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $systemInstruction . "\nNgười dùng nói: " . $userMessage]
            ]
        ]
    ]
];

// Gửi cURL (Giữ nguyên như cũ)
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $json = json_decode($response, true);
    if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
        $aiReply = $json['candidates'][0]['content']['parts'][0]['text'];
        // Xử lý format text
        $aiReply = str_replace("**", "", $aiReply);
        echo json_encode(["reply" => $aiReply]);
    } else {
        // AI bị lỗi hoặc bị chặn nội dung
        $fallback = ($context === 'game') ? "Thôi đừng hỏi nữa, tự nghĩ đi (Lỗi AI rồi)." : "Hệ thống đang bận, thử lại sau nhé.";
        echo json_encode(["reply" => $fallback]);
    }
} else {
    echo json_encode(["reply" => "Mất mạng rồi!"]);
}
?>