<?php
@mkdir("monitors");
$p = "./monitors/";
$e = "example";
if(!empty($_GET["test"]))
{
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    $i = 0;
    if(!file_exists("./monitors/example"))
    {
        file_put_contents("./monitors/example","");
    }
    $lid = 0;
    while(true)
    {
        
        $cid = filemtime("./monitors/example");
        if($cid!==$lid)
        {
            $lid = $cid;
            echo "id: ".$lid."\n";
            echo "data: ".file_get_contents("./monitors/example")."\n\n";
            ob_flush();
            flush();
        }
        clearstatcache();
        
        sleep(1);
        if($i++ > 120){break;}
    }
    echo "data:reconnect\r\n";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FIFO Test</title>
    <script>
        o={
            set "o1"(value){document.querySelector("#output1").innerHTML=value;},
            get "o1"(){return document.querySelector("#output1").innerHTML;},
                set "o2"(value){document.querySelector("#output2").innerHTML=value;},
                    get "o2"(){return document.querySelector("#output2").innerHTML;},
                        set "o3"(value){document.querySelector("#output2").innerHTML=value;},
                            get "o3"(){return document.querySelector("#output2").innerHTML;}
        }
        function request(url,fx){
            var xml = new XMLHttpRequest();
            xml.open("GET",url);
            xml.send(null);
            xml.onload=function()
            {
                fx(xml.responseText);
            }
        }
        function read(){
            request("./fifo_php.php?test=2",function(r){
                o.o2=r;
            });
        }
        function fifo(form,event,sinc)
        {
            event.stopPropagation();
            event.preventDefault();
            var t = form.querySelector("input").value;
            if(sinc)
            {
//                request("./fifo_php.php?test=1&t="+encodeURIComponent(t),function(r){
//                    o.o1=r;
//                });
                
                
                
                
                var sse = new EventSource("fifo_php.php?test=3");
                sse.onmessage=function(d){
                    console.log(d);
                }
                
                
                
                
//                request("./fifo_php.php?test=2&t="+encodeURIComponent(t),function(r){
//                    o.o2=r;
//                });
//                request("./fifo_php.php?test=2&t="+encodeURIComponent(t),function(r){
//                    o.o3=r;
//                });
            }
        }
    </script>
</head>
    <body>
        <form action="#" onsubmit="fifo(this,event,true);return false;">
            <fieldset>
                <legend>Simul</legend>
                <input type="text" value="Ciao">
                <input type="submit" value="test">
                <button onclick="read();" type="button"></button>
            </fieldset>
        </form>
        <form action="#" onsubmit="fifo(this,event,false);return false;">
            <fieldset>
                <legend>Not Simul</legend>
                <input type="text" value="Ciao">
                <input type="submit" value="test">
            </fieldset>
        </form>
        
        <h3>Output 1</h3>
        <div id="output1"></div>
        <h3>Output 2</h3>
        <div id="output2"></div>
        <h3>Output 3</h3>
        <div id="output3"></div>
</body>
</html>