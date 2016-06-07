<?php
session_start();
session_write_close();
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
$root = "teamworks/";
$twid = "";
if(!empty($_GET["twid"]))
{
    $twid = $_GET["twid"];
}
else if(!empty($_SESSION["twid"]))
{
    $twid = $_SESSION["twid"];
}
if(!file_exists($root.$twid.".json"))
{
    $twid = $_SESSION["twid"];
}
if(!file_exists($root.$twid.".json"))
{
    echo "data:".json_encode(array("error"=>true,"message"=>"file not found"))."\n\n";
    exit;
}
$file = $root.$twid.".json";

$i = 120;
$lid = 0;
while(true)
{
    $i-=1;
    $cid = filemtime($file);
    if($cid!==$lid)
    {
        $lid = $cid;
        echo "id: ".$lid."\n";
        echo "data:".file_get_contents($file)."\n\n";
        ob_flush();
        flush();
    }
    clearstatcache();
    sleep(1);
    if($i < 0)
    {
        exit;
    }
    
}

?>