<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['error'=>'Please log in first']); exit;
}

$id=(int)($_POST['id']??0);
$title=trim($_POST['title']??'');
$abstract=trim($_POST['abstract']??'');
$topic=trim($_POST['topic']??'');
$year=(int)($_POST['year']??0);
$authorId=(int)$_SESSION['user']['id'];

if($id<=0 || $title==='' || $abstract==='' || $topic==='' || !$year){
    echo json_encode(['error'=>'Please fill all paper details']); exit;
}

$stmt=$conn->prepare('UPDATE papers SET title=?, abstract=?, topic=?, year=? WHERE id=? AND author_id=?');
$stmt->bind_param('sssiii',$title,$abstract,$topic,$year,$id,$authorId);

if($stmt->execute() && $stmt->affected_rows>=0){
    echo json_encode(['message'=>'Research paper updated successfully']);
}else{
    echo json_encode(['error'=>'Could not update research paper']);
}
?>
