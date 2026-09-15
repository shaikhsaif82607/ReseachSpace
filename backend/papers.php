<?php
require 'db.php'; header('Content-Type: application/json');
$q='%'.trim($_GET['q']??'').'%';
$sql='SELECT p.id,p.title,p.abstract,p.topic,p.year,p.file_name,p.views,p.downloads,u.name author FROM papers p JOIN users u ON p.author_id=u.id WHERE p.title LIKE ? OR p.abstract LIKE ? OR p.topic LIKE ? OR u.name LIKE ? ORDER BY p.created_at DESC';
$stmt=$conn->prepare($sql); $stmt->bind_param('ssss',$q,$q,$q,$q); $stmt->execute(); $r=$stmt->get_result(); $papers=[];
while($row=$r->fetch_assoc()) $papers[]=$row; echo json_encode(['papers'=>$papers]);
?>
