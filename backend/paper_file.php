<?php
require 'db.php';
header('Content-Type: application/json');

$id=(int)($_GET['id']??0);
if($id<=0){http_response_code(400);echo json_encode(['error'=>'Invalid paper ID']);exit;}

$stmt=$conn->prepare('SELECT file_name,file_path FROM papers WHERE id=?');
$stmt->bind_param('i',$id);$stmt->execute();
$paper=$stmt->get_result()->fetch_assoc();
if(!$paper){http_response_code(404);echo json_encode(['error'=>'Paper not found']);exit;}

$path=trim((string)$paper['file_path']);
$names=array_unique([
    basename(str_replace('\\','/',$path)),
    basename(str_replace('\\','/',(string)$paper['file_name']))
]);
$files=[];
if($path!=='')$files[]=$path;
foreach($names as $name)if($name!==''){
    $files[]=__DIR__.'/uploads/'.$name;
    $files[]=dirname(__DIR__).'/uploads/'.$name;
}

$file='';
foreach($files as $candidate){
    $candidate=str_replace(['\\','/'],DIRECTORY_SEPARATOR,$candidate);
    if(is_file($candidate) && filesize($candidate)>0){$file=$candidate;break;}
}

if($file===''){
    http_response_code(404);
    echo json_encode(['error'=>'PDF file not found. Re-upload this paper.']);
    exit;
}

$data=file_get_contents($file);
if($data===false || strlen($data)===0){
    http_response_code(500);
    echo json_encode(['error'=>'PDF file is empty or cannot be read']);
    exit;
}

// Confirm this is actually a PDF before sending it to the browser.
if(substr($data,0,4)!=='%PDF'){
    http_response_code(500);
    echo json_encode(['error'=>'The stored file is not a valid PDF']);
    exit;
}

$mode=($_GET['mode']??'view')==='download'?'download':'view';
if($mode==='view')$conn->query("UPDATE papers SET views=views+1 WHERE id=$id");
else $conn->query("UPDATE papers SET downloads=downloads+1 WHERE id=$id");

echo json_encode([
    'ok'=>true,
    'name'=>basename((string)$paper['file_name']),
    'type'=>'application/pdf',
    'data'=>base64_encode($data)
]);
?>