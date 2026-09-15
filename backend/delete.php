<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['error'=>'Please log in first']);
    exit;
}

$id=(int)($_POST['id']??0);
if ($id<=0) { echo json_encode(['error'=>'Invalid paper ID']); exit; }

$stmt=$conn->prepare('SELECT file_path FROM papers WHERE id=? AND author_id=?');
$authorId=(int)$_SESSION['user']['id'];
$stmt->bind_param('ii',$id,$authorId); $stmt->execute();
$paper=$stmt->get_result()->fetch_assoc();

if (!$paper) {
    echo json_encode(['error'=>'You can delete only your own paper']);
    exit;
}

$file=__DIR__.'/uploads/'.basename($paper['file_path']);
$stmt=$conn->prepare('DELETE FROM papers WHERE id=? AND author_id=?');
$stmt->bind_param('ii',$id,$authorId);

if (!$stmt->execute() || $stmt->affected_rows!==1) {
    echo json_encode(['error'=>'Could not delete paper']);
    exit;
}

if (is_file($file)) @unlink($file);
echo json_encode(['message'=>'Research paper deleted successfully']);
?>
