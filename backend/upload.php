<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['error'=>'Please log in before uploading']);
    exit;
}

if (!isset($_FILES['paper']) || $_FILES['paper']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error'=>'Choose a PDF']);
    exit;
}

$f=$_FILES['paper'];
if (strtolower(pathinfo($f['name'],PATHINFO_EXTENSION)) !== 'pdf' || $f['size'] > 20*1024*1024) {
    echo json_encode(['error'=>'PDF must be under 20 MB']);
    exit;
}

$title=trim($_POST['title']??'');
$abstract=trim($_POST['abstract']??'');
$topic=trim($_POST['topic']??'');
$year=(int)($_POST['year']??0);

if ($title==='' || $abstract==='' || $topic==='' || !$year) {
    echo json_encode(['error'=>'Please fill all paper details']);
    exit;
}

if (!is_dir(__DIR__.'/uploads')) mkdir(__DIR__.'/uploads',0777,true);
$file=uniqid('',true).'.pdf';
$path=__DIR__.'/uploads/'.$file;

if (!move_uploaded_file($f['tmp_name'],$path)) {
    echo json_encode(['error'=>'Could not save the PDF']);
    exit;
}

$stmt=$conn->prepare('INSERT INTO papers(title,abstract,topic,year,author_id,file_name,file_path) VALUES(?,?,?,?,?,?,?)');
$stmt->bind_param('sssiiss',$title,$abstract,$topic,$year,$_SESSION['user']['id'],$f['name'],$file);

if (!$stmt->execute()) {
    @unlink($path);
    echo json_encode(['error'=>'Could not save paper information']);
    exit;
}

echo json_encode(['message'=>'Paper uploaded successfully']);
?>