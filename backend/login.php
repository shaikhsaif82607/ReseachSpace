<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

$data=json_decode(file_get_contents('php://input'),true);
$email=strtolower(trim($data['email']??''));
$pass=$data['password']??'';

if(!filter_var($email,FILTER_VALIDATE_EMAIL) || $pass===''){
    echo json_encode(['error'=>'Please enter your email and password']);
    exit;
}

$stmt=$conn->prepare('SELECT id,name,email,password FROM users WHERE email=?');
$stmt->bind_param('s',$email);
$stmt->execute();
$user=$stmt->get_result()->fetch_assoc();

if(!$user || !password_verify($pass,$user['password'])){
    echo json_encode(['error'=>'Invalid email or password']);
    exit;
}

unset($user['password']);
$_SESSION['user']=$user;
echo json_encode(['message'=>'Login successful','user'=>$user]);

$stmt->close();
$conn->close();
?>
