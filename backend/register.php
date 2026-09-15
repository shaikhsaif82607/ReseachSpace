<?php
require 'db.php';
header('Content-Type: application/json');

$data=json_decode(file_get_contents('php://input'),true);
if(!is_array($data)){
    echo json_encode(['error'=>'Invalid request']);
    exit;
}

$name=trim($data['name']??'');
$email=strtolower(trim($data['email']??''));
$pass=$data['password']??'';

if($name==='' || !filter_var($email,FILTER_VALIDATE_EMAIL)){
    echo json_encode(['error'=>'Please enter a valid name and email']);
    exit;
}

if(strlen($pass)<6){
    echo json_encode(['error'=>'Password must be at least 6 characters']);
    exit;
}

$hash=password_hash($pass,PASSWORD_DEFAULT);
$stmt=$conn->prepare('INSERT INTO users(name,email,password) VALUES(?,?,?)');
$stmt->bind_param('sss',$name,$email,$hash);

if($stmt->execute()){
    echo json_encode(['message'=>'Account created successfully']);
}else{
    echo json_encode(['error'=>$stmt->errno===1062?'Email already exists':'Could not create account']);
}

$stmt->close();
$conn->close();
?>
