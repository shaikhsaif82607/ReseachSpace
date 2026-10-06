<?php
$conn = new mysqli('database', 'root', 'root123', 'reseachspace');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$conn->set_charset('utf8mb4');
?>