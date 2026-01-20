<?php
header('Content-Type: application/json');
require_once 'db.php';

$sql = "SELECT * FROM documents ORDER BY id DESC";
$result = $conn->query($sql);

$docs = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $docs[] = $row;
    }
}

echo json_encode($docs);
$conn->close();
?>