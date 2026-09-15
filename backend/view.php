<?php
require 'db.php';
$id=(int)($_GET['id']??0);
if($id<=0){http_response_code(400);exit('Invalid paper ID');}
$stmt=$conn->prepare('SELECT file_name,file_path FROM papers WHERE id=?');
$stmt->bind_param('i',$id);$stmt->execute();
$paper=$stmt->get_result()->fetch_assoc();
if(!$paper){http_response_code(404);exit('Paper not found');}
$path=trim((string)$paper['file_path']);
$names=array_unique([basename(str_replace('\\','/',$path)),basename(str_replace('\\','/',(string)$paper['file_name']))]);
$candidates=[];
if($path!=='')$candidates[]=$path;
foreach($names as $name)if($name!==''){$candidates[]=__DIR__.'/uploads/'.$name;$candidates[]=dirname(__DIR__).'/uploads/'.$name;}
$file='';
foreach($candidates as $candidate){$candidate=str_replace(['\\','/'],DIRECTORY_SEPARATOR,$candidate);if(is_file($candidate)&&filesize($candidate)>0){$file=$candidate;break;}}
if($file==='') {http_response_code(404);exit('PDF file not found. Please re-upload this paper.');}
$data=file_get_contents($file);
if($data===false||strlen($data)===0||substr($data,0,4)!=='%PDF'){http_response_code(500);exit('Stored file is not a valid PDF.');}
$conn->query("UPDATE papers SET views=views+1 WHERE id=$id");
while(ob_get_level())ob_end_clean();
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="'.str_replace('"','',basename((string)$paper['file_name'])).'"');
header('Content-Length: '.strlen($data));
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate');
echo $data;exit;
?>