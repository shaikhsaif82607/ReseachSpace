<?php
session_start(); header('Content-Type: application/json');
if(!isset($_SESSION['user'])) die(json_encode(['user'=>null]));
echo json_encode(['user'=>$_SESSION['user']]);
?>
