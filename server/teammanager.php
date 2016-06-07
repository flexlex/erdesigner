<?php
session_start();
//GENERAL
function createBaseTables()
{
    try{
        $pdo = new PDO("sqlite:db/designer.sqlite");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->query("CREATE TABLE IF NOT EXISTS teamworks(id INTEGER PRIMARY KEY AUTOINCREMENT, twid TEXT unique, lastaction TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);");
        $pdo->query("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, lastaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)");
        $pdo=null;
    }catch(Exception $e){
        echo $e->getMessage();
    }
}
function cleanTables()
{
    try{
        $pdo = new PDO("sqlite:db/designer.sqlite");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->query("DELETE FROM teamworks WHERE (strftime('%s','now') - strftime('%s',lastaction)) > 300");
        $pdo->query("DELETE FROM users WHERE (strftime('%s','now') - strftime('%s',lastaction)) > 300");
        $pdo->query("VACUUM;");
        $pdo=null;
    }catch(Exception $e){
        echo $e->getMessage();
    }
}

function senderror($ms="Unknown error")
{
    echo json_encode(array("error"=>true,"message"=>$ms));
    exit;  
}

function genid()
{
    return sha1(time()).md5(uniqid(true));
}

//Activate

function activate()
{
    $res = array();
    if(!array_key_exists("json",$_POST))senderror("No body");
    $txt = $_POST["json"];
    @mkdir("db");
    @mkdir("teamworks");
    
    createBaseTables();
    cleanTables();
    
    try{
        $pdo = new PDO("sqlite:db/designer.sqlite");
        do{
            $twid = genid();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $s=$pdo->prepare("SELECT count(*) as c FROM teamworks WHERE twid=:twid");
            $s->execute(array("twid"=>$twid));
            $f = $s->fetchAll();
            $c = intval($f["c"]);
        }while($c > 0);
        
        $s = $pdo->prepare("INSERT INTO teamworks (twid) VALUES(:twid)");
        $s->execute(array("twid"=>$twid));
        
        $res["twid"]=$twid;
    }catch(Exception $e){
        echo $e->getMessage();
    }
    
    
   
    chdir("..");
    $root = $_SERVER["DOCUMENT_ROOT"];
    $wd = getcwd();
    $path = str_replace($root,"",$wd);
    $port = "";
    if(strval($_SERVER["SERVER_PORT"])!=="80")
    {
        $port = ":".$_SERVER["SERVER_PORT"];
    }
    $res["sharelink"]="http://".getHostByName(php_uname('n')).$port."{$path}?join=".$twid;
    
    chdir("server");
    file_put_contents("teamworks/".$twid.".json",$txt);
    chmod("teamworks/".$twid.".json",0777);
    $_SESSION["twid"]=$twid;
    
    $pdo = null;
    
    echo json_encode($res);
}

//Ping
function ping()
{
    
}

//SHUTDOWN
function shutdown()
{
    session_destroy();
    echo json_encode(array("success"=>true));
}

//COMMIT
function commit()
{
    if(empty($_POST["json"]))
    {
        senderror("No body");
    }
    if(empty($_SESSION["twid"]))
    {
        senderror("No session set");
    }
    $id = $_SESSION["twid"];
    $txt = $_POST["json"];
    
    $file="teamworks/{$id}.json";
    if(file_exists($file))
    {
        file_put_contents($file,$txt);
        echo json_encode(array("success"=>true));
    }
    else
    {
        senderror("File not found");
    }
}

//SHUTDOWN
function subscribe($id="")
{
    $id = $_GET["subscribe"];
    if(file_exists("teamworks/{$id}.json"))
    {
        $_SESSION["twid"]=$id;
        $res=array();
        
        chdir("..");
        $root = $_SERVER["DOCUMENT_ROOT"];
        $wd = getcwd();
        $path = str_replace($root,"",$wd);
        $port = "";
        if(strval($_SERVER["SERVER_PORT"])!=="80")
        {
            $port = ":".$_SERVER["SERVER_PORT"];
        }
        $res["sharelink"]="http://".getHostByName(php_uname('n')).$port."{$path}?join=".$id;
        $res["twid"]=$id;

        chdir("server");
        $pdo = null;

        $res["success"]=true;
        echo json_encode($res);
        exit;
    }
    else
    {
        senderror("File not found");
    }
}

//ANALIZER
$g = $_GET;
if(array_key_exists("activate",$g))activate();
if(array_key_exists("ping",$g))ping();
if(array_key_exists("subscribe",$g))subscribe();
if(array_key_exists("commit",$g))commit();
if(array_key_exists("shutdown",$g))shutdown();
?>