<?php

if(!empty($_GET["set"]) && !empty($_POST["text"]))
{
    if(!is_dir("files"))
    {
        @mkdir("files",0777);
    }
    $id = uniqid("file");
    $p = "files/{$id}.json";
    file_put_contents($p,$_POST["text"]);
    if(file_exists($p))
    {
        echo $id;
    }
    else
    {
        echo "error";
    }
}
else if(!empty($_GET["get"]) && !empty($_GET["id"]))
{
    $id = $_GET["id"];
    $p = "files/{$id}.json";
    if(!empty($id) && ctype_alnum($id) && strpos($id,"..")===false && file_exists($p))
    {
        if(!empty($_GET["special"]))
            header("content-type: application/octet-stream;");
        else
            header("content-type: application/json;");
        $name = "designer_databse.json";
        if(!empty($_GET["name"]))
        {
            $name=$_GET["name"];
        }
        header("Content-Disposition: attachment; filename={$name};");
        echo file_get_contents($p);
    }
}

?>