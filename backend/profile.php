<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['error'=>'Login required']);
    exit;
}

$id=(int)($_GET['id']??0);
if (!$id || $id !== (int)$_SESSION['user']['id']) {
    echo json_encode(['error'=>'Profile not allowed']);
    exit;
}

$stmt=$conn->prepare('SELECT id,name,email FROM users WHERE id=?');
$stmt->bind_param('i',$id); $stmt->execute();
$user=$stmt->get_result()->fetch_assoc();
if (!$user) { echo json_encode(['error'=>'User not found']); exit; }

$stmt=$conn->prepare('SELECT id,title,abstract,topic,year,views,downloads FROM papers WHERE author_id=? ORDER BY created_at DESC');
$stmt->bind_param('i',$id); $stmt->execute(); $r=$stmt->get_result();
$papers=[]; $views=0; $downloads=0;
while($row=$r->fetch_assoc()) { $views+=(int)$row['views']; $downloads+=(int)$row['downloads']; $papers[]=$row; }
$count=count($papers);
$score=min(100,($count*10)+min(40,$views/50)+min(30,$downloads/20));

echo json_encode(['user'=>$user,'papers'=>$papers,'stats'=>['papers'=>$count,'views'=>$views,'downloads'=>$downloads,'citations'=>0,'score'=>round($score)]]);
?>