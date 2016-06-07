function Switch(ele,tn,tf)
{
    var bg = ele.querySelector(".background");
    var knob = ele.querySelector(".knob");
    var overflow = ele.querySelector(".overflow");
    
    var val = ele.getAttribute("data-switch")=="true";
    var turnon = function()
    {
        ele.setAttribute("data-svalue","true");
    };
    var turnoff = function()
    {
        ele.setAttribute("data-svalue","false");
    };
    (val ? turnon : turnoff)();

    var disabled = false;
    //FX
    var ani = function(rp)
    {
        rp = rp < 0 ? 0 : rp > 1 ? 1 : rp;
        var arp = 1-rp;
        var p = rp*100;
        var t = "translate("+(-p)+"%)";
        knob.style.webkitTransform=t;
        knob.style.mozTransform=t;
        knob.style.oTransform=t;
        knob.style.msTransform=t;
        knob.style.transform=t;
        knob.style.left=p+"%";
        bg.style.right=-p+"%";
        overflow.style.background="rgb("+Math.floor(arp*255)+","+Math.floor(127+128*arp)+",255)";
    }
    
    var stp = function(ee)
    {
        try{
            ee.preventDefault();
        }catch(e){}
        try{
            ee.stopPropagation();
        }catch(e){}
        try{
            ee.cancelBubble=true;
        }catch(e){}
    }
    var rani = function()
    {
        knob.style.webkitTransform="";
        knob.style.mozTransform="";
        knob.style.oTransform="";
        knob.style.msTransform="";
        knob.style.transform="";
        knob.style.left="";
        bg.style.right="";
        overflow.style.background="";
    };
    
    var getStatus = function()
    {
        return ele.getAttribute("data-svalue")=="true";
    };
    
    var chka=function()
    {
        if(active!==getStatus())
        {
            if(!!tn && getStatus())
            {
                tn();
            }
            else if(!!tf && !getStatus())
            {
                tf();
            }
        };
    };
    
    //Motion
    var moved = false, dragging = false, active=val, rp = 0;
    var sx = 0;
    var m = ele.offsetWidth;
    var md = function(event)
    {
        active = getStatus();
        moved=false;
        dragging=true;
        m = ele.offsetWidth-knob.offsetWidth;
        sx = event.clientX;
    };
    var mm = function(event)
    {
        moved=true;
        if(dragging)
        {
            ele.setAttribute("data-noani","true");
            rp = (event.clientX-sx)/(m);
            if(active)
                ani(rp+1);
            else
                ani(rp);
        }
    };
    var mu = function(event)
    {
        if(dragging && !moved)
        {
            (getStatus() ? turnoff : turnon)();
            chka();
        }
        ele.setAttribute("data-noani","false");
        if(moved && dragging)
        {
            if(rp > 0.7)
            {
                turnon();
            }
            else if(rp < 0.3)
            {
                turnoff();
            }
            rani();
            chka();
        }
        dragging=false;
    };
    
    ele.ondrag=stp;
    ele.ondragstart=stp;
    ele.addEventListener("mousedown",md);
    document.addEventListener("mousemove",mm);
    document.addEventListener("mouseup",mu);
    
    this.disabled=function()
    {
        if(!disabled)
        {
            turnoff();
            ele.removeEventListener("mousedown",md);
            document.removeEventListener("mousemove",mm);
            document.removeEventListener("mouseup",mu);
            ele.setAttribute("data-sdisabled","true");
            disabled=true;
        }
    }
    this.enable=function()
    {
        if(disabled)
        {
            turnoff();
            ele.addEventListener("mousedown",md);
            document.addEventListener("mousemove",mm);
            document.addEventListener("mouseup",mu);
            ele.setAttribute("data-sdisabled","false");
            disabled=false;
        }
    }
    
    this.setState=function(bl)
    {
        (!!bl ? turnon : turnoff)();
    }
}

function TeamManagerScript()
{
    var myid = "";
    var projectid = "";
    var sse = null;
    var self = this;
    
    this.connected=false;
    
    var gotmessage=function(event)
    {
        try
        {
            mergeState(JSON.parse(event.data));
        }catch(e){
            console.log(e.message);
        }
    };
    
    var subscribe = function(id)
    {
        sse = new EventSource("server/sse.php?twid="+id);
        sse.onopen=function()
        {
            setstate("Running"," ");
            self.connected=true;
            document.body.setAttribute("data-team",self.connected);
        }
        sse.onerror=function(e){}
        sse.onmessage=gotmessage;
        swi.setState(true);
    };
    var subscribeto=function(id)
    {
        helpdialog("Connecting");
        request("server/teammanager.php?subscribe="+id,function(json,error){
            if(error)
            {
                na("Error while connecting");
                return;
            }
            if(checkIfError(json))
            {
                return;
            }
            if(json.success)
            {
                subscribe(id);
                na("Connected!!!");
                addKeyBox("twid","TW-ID",json.twid);
                addKeyBox("link","ShareLink","<a href=\""+json.sharelink+"\">"+json.sharelink+"</a>");
            }
        },true)
    }
    
    var turnon = function()
    {
        setstate("Starting","Getting project key");
        postrequest("server/teammanager.php?activate",
                    {json:JSON.stringify(serializeStatus())},
                   function(json,error){
            if(error)
            {
                setstate("Error",json);
                return;
            }
            if(checkIfError(json))return;
            
            addKeyBox("twid","TW-ID",json.twid);
            addKeyBox("link","ShareLink","<a href=\""+json.sharelink+"\">"+json.sharelink+"</a>");
            try
            {
                history.pushState(null,null,"./?join="+json.twid);
            }catch(e){console.log(e.message);}
            setTimeout(function(){
                setstate("Subscribing","Connecting to SSE");
                subscribe(json.twid);
            },200);
        },true);
    };
    var turnoff = function()
    {
        setstate("Turning Off","Revoking permissions");
        sse.close();
        removeKeyBox();
        request("server/teammanager.php?shutdown",function(json,error){
            if(error || (checkIfError(json)))
            {
                location.href=location.href.replace(location.search,"");
                return;
            }
            if(json.success)
            {
                setstate("Stopped","Ready");
                self.connected=false;
                document.body.setAttribute("data-team",self.connected);
            }
        },true);
    };
    
    var swi = new Switch(document.querySelector("[data-switch]"),turnon,turnoff);
    
    var addKeyBox = function(id,label,value)
    {
        var to = document.querySelector(".teamoutput");
        var k = to.querySelector("[data-teamid=\""+id+"\"]");
        if(!k)
        {
            k = document.createElement("div");
            k.className="keybox out";
            k.setAttribute("data-teamid",id);
            to.appendChild(k);
            setTimeout(function(){
                k.className="keybox";
            },50);
        }
        k.innerHTML="<span class=\"label\">"+label+"</span><span class=\"value\">"+value+"</span>";
    }
    var removeKeyBox=function()
    {
        var to = document.querySelector(".teamoutput");
        var k = to.querySelectorAll("[data-teamid]");
        for(var i = k.length; --i>=0;)
        {
            k[i].className="keybox out";
        }
        setTimeout(function(){
            for(var i = k.length; --i>=0;)
            {
                k[i].parentNode.removeChild(k[i]);
            }
        },600);
    }
    
    var genuniquekey = function()
    {
        var rr = function(){
            return Math.floor(Math.random()*38).toString(36);
        }
        var dt =  new Date();
        var k = "";
        k+=dt.getTime().toString(36);
        for(var i = 10; --i>=0;)
        {
            k+=rr();
        }
        return k;
    };
    
    var checkIfError = function(json)
    {
        if("error" in json)
        {
            if(!!json.error)
            {
                if("message" in json)
                    setstate("Server Error",json.message);
                else
                    setstate("Server Error","");
            }
        }
    };
    
    var setstate=function(label,detail)
    {
        var sw = document.querySelector(".statusswitch");
        if(!!label)
        {
            sw.querySelector(".label").innerHTML=label;
        }
        if(!!detail)
        {
            sw.querySelector(".detail").innerHTML=detail;
        }
    };
    
    var postrequest=function(url,data,fx,asjson)
    {
        var fd = new FormData(), lol;
        for(lol in data)
        {
            fd.append(lol,data[lol]);
        }

        var xml = new XMLHttpRequest();
        xml.open("POST",url);
        xml.send(fd);
        xml.onreadystatechange=function(){
            if(xml.readyState==4)
            {
                if(asjson)
                {
                    try
                    {
                        fx(JSON.parse(xml.responseText));
                    }catch(e){
                        fx(e.message,true);
                    }
                }
                else
                {
                    fx(xml.responseText);
                }
            }
        };
        xml.onerror=function(){
            fx("ajax error",true);
        }
    }
    
    var request=function(url,fx,asjson)
    {
        var xml = new XMLHttpRequest();
        xml.open("GET",url);
        xml.send();
        xml.onreadystatechange=function(){
            if(xml.readyState==4)
            {
                if(asjson)
                {
                    try
                    {
                        fx(JSON.parse(xml.responseText));
                    }catch(e){
                        fx(e.message,true);
                    }
                }
                else
                {
                    fx(xml.responseText);
                }
            }
        };
        xml.onerror=function(){
            fx("ajax error",true);
        }
    }
    
    var checkURL=function()
    {
        var params = location.search.replace("?","").split("&");
        var res = {};
        for(var i = params.length; --i>=0;)
        {
            var t = params[i].split("=");
            res[t[0]]=t[1];
        }
        if("join" in res)
        {
            subscribeto(res.join);
        }
    };
    
    var init = function()
    {
        if(!("FormData" in window)){
            setstate("Not avaible","Your browser do not support this feature");
            swi.disabled();
            return;
        }

        if(!(runningonserver)){
            var si = setInterval(function()
                       {
                if(runningonserver)
                {
                    clearInterval(si);
                    setstate("Stopped","Seems Ready");
                    swi.enable();
                    checkURL();
                }
            },100);
            setTimeout(function(){
                clearInterval(si);
            },60000)
            setstate("Not avaible","You need to run the designer on a server with PHP.");
            swi.disabled();
            return;
        }
        checkURL();
        
    };
    init();
    
}