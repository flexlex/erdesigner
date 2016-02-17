typemap={
    mysql:{
        "integer":"int",
        "date":"date",
        "time":"date",
        "varchar":"varchar(50)",
        "text":"text"
    },
    sqlite:{
        "integer":"integer",
        "date":"date",
        "time":"timestamp",
        "varchar":"text",
        "text":"text"
    }
}
runningonserver = false;
autocommit=true;

function isediting()
{
    var c = document.querySelectorAll(".db_entity > .front > .title input, .att_front input").length;
    if(MouseEventConnectHandler.isDragging())return true;
    return c > 0;
}

function genuniquekey()
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
}

function checkIfRunningOnServer()
{
    try{
        var verify = genuniquekey();
        var fd = new FormData();
        fd.append("text",verify);
        var xml = new XMLHttpRequest();
        xml.open("POST","server/echo.php");
        xml.onreadystatechange=function()
        {
            if(xml.readyState==4)
            {
                if(verify==xml.responseText)
                {
                    runningonserver=true;
                }
                else
                {
                    runningonserver=false;
                }
            }
        };
        xml.send(fd);
    }catch(e){
        runningonserver=false;
    }
}

function na(ms)
{
    helpdialog(ms);
    setTimeout(function(){
       helpdispose(); 
    },6000);
}

function helpdialog(ms)
{
    var hd = document.querySelector("#helpdialog");
    if(!hd)
    {
        hd=document.createElement("div");
        hd.setAttribute("id","helpdialog");
        document.body.appendChild(hd);
    }
    hd.style.display="none";
    hd.innerHTML=ms;
    hd.className="hide";
    setTimeout(function(){
        hd.style.display="block";
        setTimeout(function(){
            hd.className="show";
        },50);
    },50);
}
function helpdispose()
{
    var hd = document.querySelector("#helpdialog");
    if(!!hd)hd.className="hide";
}

function tooltip(ms)
{
    var tt = document.querySelector("#flying");
    tt.innerHTML=ms;
    tt.className="in";
    
}
function tooltipdispose()
{
    var tt = document.querySelector("#flying");
    tt.className="";
}

function range(i,v,x)
{
    return v < i ? i : v > x ? x : v;
}

function ATO(ele)
{
    var sum = 0;
    while(!!ele && "offsetTop" in ele)
    {
        sum+=ele.offsetTop;
        ele=ele.offsetParent;
    }
    return sum;
}
function ALO(ele)
{

    var sum = 0;
    while(!!ele && "offsetLeft" in ele)
    {
        sum+=ele.offsetLeft;
        ele=ele.offsetParent;
    }
    return sum;
}

function reminispace()
{
    Globals.svg.style.width=Globals.canvas.scrollWidth+"px";
    Globals.svg.style.height=Globals.canvas.scrollHeight+"px";
    Globals.connection.scrollLeft=Globals.canvas.scrollLeft;
    Globals.connection.scrollTop=Globals.canvas.scrollTop;
}

function respace()
{
    var max = [0,0];
    var d = DBClassesManager.getAllElement();
    var t = null;
    for(var i = d.length; --i>=0;)
    {
        t = d[i].ele;
        max[0]=Math.max(max[0],t.offsetLeft+t.offsetWidth);
        max[1]=Math.max(max[1],t.offsetTop+t.offsetHeight);
    }
    max[0]+=200;
    max[1]+=200;
    var s = document.querySelectorAll(".spacer");
    for(var i = s.length; --i>=0;)
    {
        s[i].style.left=max[0]+"px";
        s[i].style.top=max[1]+"px";
    }
    reminispace();
}

function entityByChild(ele)
{
    var d = DBClassesManager.getAllElement();
    for(var i = d.length; --i>=0;)
    {
        if(d[i].ele==ele || d[i].ele.contains(ele))
        {
            return d[i];
        }
    }
    return {"ele":ele};
}

function attributeByChild(ele)
{
    var entities = DBClassesManager.getAllElement(), matched_attribute, matched=false;
    for(var i = entities.length; --i>=0;)
    {
        var e = entities[i];
        var att = e.getAllAttributes();
        for(var j = att.length; --j>=0;)
        {
            if(att[j].ele.contains(ele) || att[j].ele==ele)
            {
                matched=true;
                matched_attribute=att[j];
                return matched_attribute;
                break;
            }
        }
        if(matched)break;
    }
    return null;
}

function isSameTable(ele1,ele2)
{
    var ent = DBClassesManager.getAllElement();
    for(var i = ent.length;--i>=0;)
    {
        if(ent[i].ele.contains(ele1) || ent[i].ele.contains(ele2) )
        {
            return ent[i].ele.contains(ele1) && ent[i].ele.contains(ele2);
        }
    }
    return false;
}

function replaceInArr(c1,c2)
{
    var a1 = attributeByChild(c1);
    var a2 = attributeByChild(c2);
    
    var m1 = {
        entity:null,
        index:0
    };
    var m2 = {
        entity:null,
        index:0
    };
    
    var etts = DBClassesManager.getAllElement(), atts, found=false;
    for(var i = etts.length; --i>=0;)
    {
        atts = etts[i].getAllAttributes();
        for(var j = atts.length; --j>=0;)
        {
            if(atts[j]==a1)
            {
                m1.entity=etts[i];
                m1.index=j;
                found=true;
                break;
            }
        }
        if(found)break;
    }
    
    found=false;
    for(var i = etts.length; --i>=0;)
    {
        atts = etts[i].getAllAttributes();
        for(var j = atts.length; --j>=0;)
        {
            if(atts[j]==a2)
            {
                m2.entity=etts[i];
                m2.index=j;
                found=true;
                break;
            }
        }
        if(found)break;
    }
    
    if(m1.entity!=null && m1.index!==null && m2.entity!=null && m2.index!==null)
    {
        m1.entity.getAllAttributes()[m1.index]=a2;
        m2.entity.getAllAttributes()[m2.index]=a1;
    }
}

function moveInArr(c1,c2,after)
{
    if(c1.parentNode!==c2.parentNode)
    {
        na("Can not move attributes from different tables");
        return;
    }
    var par = entityByChild(c1);
    var a1 = attributeByChild(c1);
    var a2 = attributeByChild(c2);
    var atts = par.getAllAttributes();
    var idx1 = atts.indexOf(a1);
    var idx2 = atts.indexOf(a2);
    
    var moveUp=function(from,to)
    {
        var t = null;
        for(var i = from; --i>=to;)
        {
            atts[i+1]=atts[i];
        }
        atts[to]=a1;
    };
    var moveDown=function(from,to)
    {
        var t = null;
        for(var i = from; i<to;i++)
        {
            atts[i]=atts[i+1];
        }
        atts[to]=a1;
    };
    
    if(idx1>idx2) //Move all down and 1 up
    {
        moveUp(idx1,idx2);
    }
    else //Move all up and 1 down
    {
        moveDown(idx1,idx2);
    }
}

//function replaceChild(c1,c2) OOOOOOOLLLLDDD
//{
//    var ph1 = document.createElement("div");
//    c1.parentNode.insertBefore(ph1,c1);
//
//    var ph2 = document.createElement("div");
//    c2.parentNode.insertBefore(ph2,c2);
//    
//    ph1.parentNode.insertBefore(c2,ph1);
//    ph2.parentNode.insertBefore(c1,ph2);
//    
//    ph1.parentNode.removeChild(ph1);
//    ph2.parentNode.removeChild(ph2);
//    
//    replaceInArr(c1,c2);
//    
//    changed();
//}

function insertAfter(toinsert,afterwhat)
{
    var ph = document.createElement("div");
    var par = afterwhat.parentNode;
    par.insertBefore(ph,afterwhat);
    par.insertBefore(afterwhat,ph);
    par.insertBefore(toinsert,ph);
    par.removeChild(ph);
    
}

function replaceChild(c1,c2)
{
    var parent = c1.parentNode;
    if(parent!=c2.parentNode)
    {
        na("The two attributes are not in the same table");
        return;
    }
    var idx1 = -1;
    var idx2 = -1;
    for(var i = parent.children.length; --i>=0;)
    {
        if(parent.children[i]==c1)idx1=i;
        if(parent.children[i]==c2)idx2=i;
        if(idx1!==-1 && idx2!==-1)break;
    }
    if(idx1==-1 || idx2==-1){
        na("Missing chld!");
        return;
    }
    var after = idx2>idx1;
    var ph2 = document.createElement("div");


    var aniFrom = function(from,to)
    {
        var tz = function(e)
        {
            e.style.zIndex=3;
            setTimeout(function(){
               e.style.zIndex=""; 
                reconnect();
            },400);
        }
        
        var par = c1.parentNode;
        var atth = c1.offsetHeight;
        var dif = to-from;
        if(to>from)
        {
            for(var i = to; --i>=from;)
            {
                par.children[i+1].style.top=atth+"px";
                par.children[i+1].setAttribute("data-noani","true");
            }
            c1.style.top=(-atth*dif)+"px";
            c1.setAttribute("data-noani","true");
        }
        else
        {
            for(var i = from; --i>=to;)
            {
                par.children[i].style.top=-atth+"px";
                par.children[i].setAttribute("data-noani","true");
            }
            c1.style.top=(-atth*dif)+"px";
            c1.setAttribute("data-noani","true");
        }
        
        setTimeout(function()
                  {
            for(var i = par.children.length; --i>=0;)
            {
                par.children[i].setAttribute("data-noani","false");
                par.children[i].style.top="0px";
            }
            reconnect();
            tz(c1);
        },50);
    };
        
    aniFrom(idx1,idx2);
    
    if(after)
    {
        insertAfter(ph2,c2);
        insertAfter(c1,ph2);
    }
    else
    {
        c2.parentNode.insertBefore(ph2,c2);
        ph2.parentNode.insertBefore(c1,ph2);
    }
    ph2.parentNode.removeChild(ph2);
    
    //moveInArr(c1,c2,after);
    
    changed();
}

function MouseEventGeatureHandler()
{
    var dragging = false;
    var moved = false;
    var lp = false;
    var tm = null;
    var data = {
        startmouse:{
            x:0,
            y:0
        },
        startelement:{
            x:0,
            y:0
        },
        dragele:null,
        margin:0
    };

    document.addEventListener("mouseup",function(){
        lp = false;
        if(tm!==null)
        {
            clearTimeout(tm);
            tm = null;
        }
        if(dragging && data.dragele!==null)
        {
            var tt = data.dragele;
            if("style" in tt)
            {
                if("top" in tt.style)
                {
                    var t = parseInt(tt.style.top);
                    if(t < 0)
                    {
                        tt.style.top="0px";
                    }
                }
                if("left" in tt.style)
                {
                    var l = parseInt(tt.style.left);
                    if(l < 0)
                    {
                        tt.style.left="0px";
                    }
                }
            }
            changed();
        }
        moved=false;
        dragging = false;

    });
    document.addEventListener("mousemove",function(event){
        moved = true;
        if(dragging && data.dragele!==null)
        {
            var de = data.dragele;
            de.style.left = data.startelement.x-data.margin+(event.clientX-data.startmouse.x)+"px";
            de.style.top = data.startelement.y-data.margin+(event.clientY-data.startmouse.y)+"px";
            respace();
            reconnect();
        }
        var t = Globals.tooltip;
        if(!t)return;
        var o = 15;
        if(event.clientY+t.offsetHeight+o > innerHeight)
            t.style.top=event.clientY-t.offsetHeight-o+"px";
        else
            t.style.top=event.clientY+o+"px";
        
        if(event.clientX+t.offsetWidth+o > innerWidth)
            t.style.left=event.clientX-t.offsetWidth-o+"px";
        else
            t.style.left=event.clientX+o+"px";
        
    });

    var longpress = function(event)
    {
        if(!moved && lp)
        {
            var e = DBClassesManager.add();
            e = e.ele;
            
            e.style.top=(event.clientY-15+Globals.canvas.scrollTop)+"px";
            e.style.left=(event.clientX-(e.offsetWidth/2)+Globals.canvas.scrollLeft)+"px";
            respace();
            changed();
        }
    }
    
    document.addEventListener("mousedown",function(event){
        var t = entityByChild(event.target);
        moved=false;
        var hp = document.querySelector("#helppopup");
        if(t instanceof DBEntity || t==hp || hp.contains(event.target))
        {
            moved=true;
        }
        lp = true;
        tm=setTimeout(function(){longpress(event)},500);
    })    
    
    var bd = function(event){
        
        lp=false;
        setTimeout(function(){
            lp=false;
        },50);
        moved = false;
        var t = entityByChild(event.target);
        t = t.ele;

        data.dragele=t;
        data.margin = parseInt(getComputedStyle(t).margin);
        data.startelement.x = t.offsetLeft;
        data.startelement.y = t.offsetTop;
        data.startmouse.x =event.clientX;
        data.startmouse.y = event.clientY;
        dragging = true;
    }
    this.beginDragging=bd;
};
MouseEventGeatureHandler = new MouseEventGeatureHandler();

function MouseEventConnectHandler()
{
    this.isDragging=function(){return dragging;}
    var dragging = false;
    var destroyed = false;
    var moved = false;
    var connection = null;
    var data = {
        startmouse:{
            x:0,
            y:0
        },
        startele:null,
        endele:null,
        margin:0
    };

    document.addEventListener("mouseup",function(){
        var fakedragging = (document.body.hasAttribute("data-current") && document.body.getAttribute("data-current")=="connecting");
        dragging = dragging || fakedragging;
        if(dragging && moved)
        {
            if(fakedragging)
            {
                document.body.setAttribute("data-current","none");
                helpdispose();
            }
            if(!!data.startele)
            {
                destroyed=true;
                data.startele.setAttribute("data-connection","null");
            }
            if(!!data.endele)
            {
                destroyed=true;
                data.endele.setAttribute("data-connection","null");
            }
            if(destroyed && !fakedragging && (!data.startele || !data.endele))
            {
                data.startele=null;
                data.endele=null;
            }
            if(connection!==null)
            {
                connection.parentNode.removeChild(connection);
                connection=null;
            }
            if(!!data.startele && !!data.endele)
            {
                if(isSameTable(data.startele,data.endele))
                {
                    if(data.startele==data.endele)
                    {
                        na("Can not connect two attributes from the same table.");
                    }
                    replaceChild(data.startele,data.endele);
                    dragging=false;
                    reconnect();
                    return;
                }
                DBClassesManager.connect(data.startele,data.endele);
                data.startele=null;
                data.endele=null;
                changed();
            }
        }
       dragging=false; 
    });
    document.addEventListener("mousemove",function(event){
        if(!dragging)return;
        if(connection==null)
        {
            xmlns = "http://www.w3.org/2000/svg";
            connection=document.createElementNS(xmlns, "path");
            connection.setAttributeNS(null,"stroke","black");
            Globals.svg.appendChild(connection);
        }
        if(!!connection && !!data.startele)
        {
            var x = ALO(data.startele)+data.startele.offsetWidth/2;
            var y = ATO(data.startele)+data.startele.offsetHeight/2;
            connection.setAttribute("d","M "+x+" "+y+" L "+(event.clientX+Globals.canvas.scrollLeft)+" "+(event.clientY+Globals.canvas.scrollTop));
        }
        moved=true;
        if(moved)
        {
            data.startele.setAttribute("data-connection","hover");
        }
        var dh = attributeByChild(event.target);
        dh = !!dh ? dh.ele : null;
//        console.log(dh);
        if(data.endele!==dh && dh!==null)
        {
            if(data.endele!==null)
            {
                data.endele.setAttribute("data-connection","null");
            }
            data.endele = dh;
            dh.setAttribute("data-connection","hover");
        }
        else if(dh==null)
        {
            if(data.endele!==null)
            {
                data.endele.setAttribute("data-connection","null");
                data.endele=null;
            }
        }
        
        if(!!data.startele && !!data.endele && (data.startele==data.endele))
        {
            data.endele.setAttribute("data-connection","invalid");
            data.startele.setAttribute("data-connection","invalid");
        }
        else if(!!data.startele && !!data.endele && isSameTable(data.startele,data.endele))
        {
            data.endele.setAttribute("data-connection","moveTo");
            data.startele.setAttribute("data-connection","move");
        }
    });

    var bd = function(event){
        if((document.body.hasAttribute("data-current") && document.body.getAttribute("data-current")=="connecting"))return;
        var t = attributeByChild(event.target);
        t = t.ele;
        if(t.hasAttribute("data-status") && t.getAttribute("data-status")=="open")return;
        data.startele=t;
        data.startmouse.x =event.clientX;
        data.startmouse.y = event.clientY;
        dragging = true;
        moved=false;
    }
    var clickConnect=function(ele)
    {
        data.startele=ele;
        dragging=true;
        destroyed=false;
    }
    this.beginConnecting=bd;
    this.clickConnect=clickConnect;
};
MouseEventConnectHandler = new MouseEventConnectHandler();

function DBAttribute()
{
    var self = this;
    var locked = false;
    var ce = function()
    {
        var d = document.createElement("div");
        d.className="db_attribute";
        d.setAttribute("onmousedown","MouseEventConnectHandler.beginConnecting(event)");
        d.innerHTML="<div class=\"att_backface\"><select class=\"selecttype\" data-action=\"type\"><option>Int</option><option>Date</option><option>Time</option><option>Varchar</option><option>Text</option></select><button data-action=\"unique\" data-tooltip=\"toggle unique\">1</button><button data-action=\"remove\" data-tooltip=\"remove attribute\"><i class=\"fa fa-ban\"></i></button><button data-action=\"rename\" data-tooltip=\"rename attribute\"><i class=\"fa fa-pencil-square-o\"></i></button><button data-action=\"connect\" data-tooltip=\"add foreign key (drag or click to connect)\"><i class=\"fa fa-link\"></i></button><button data-action=\"primary\" data-tooltip=\"toggle primry key\"><i class=\"fa fa-key\"></i></button><span class=\"fixspace\"></span></div><div class=\"att_front\">"+self.name+"</div><div class=\"openopt\"><i class=\"fa fa-angle-left\"></i></div>";
        var al = d.querySelector(".openopt");
        d.querySelector(".att_front").addEventListener("dblclick",en);
        var addToolTip=function(ele,ms)
        {
            ele.addEventListener("mouseover",function(){
                tooltip(ms);
            });
            ele.addEventListener("mouseout",function(){
                tooltipdispose();
            });
        }
        al.addEventListener("click",function(){
            if(d.hasAttribute("data-status") && d.getAttribute("data-status")=="open")
            {
                d.setAttribute("data-status","close");
            }
            else
            {
                d.setAttribute("data-status","open");
            }
        });
        var t = d.querySelector("[data-action=\"rename\"]");
        addToolTip(t,"Rename attribute");
        t.addEventListener("click",function(){
            en();
            d.setAttribute("data-status","close");
        });
        t = d.querySelector("[data-action=\"primary\"]");
        addToolTip(t,"Toggle Primary Key");
        t.addEventListener("click",function(){
            if(self.special.indexOf("primary")!==-1)
            {
                var ns = [];
                for(var i = self.special.length;--i>=0;)
                {
                    if(self.special[i]=="primary")continue;
                    ns.push(self.special[i]);
                }
                self.special=ns;
                refresh();
            }
            else
            {
                self.special.push("primary");
                refresh();
            }
            setTimeout(function(){
                locked=false;
            },50);
            d.setAttribute("data-status","close");
            Globals.lastModifiedAttribute=self;
            changed();
        });
        t = d.querySelector("[data-action=\"remove\"]");
        addToolTip(t,"Remove attribute");
        t.addEventListener("click",function(){
            removeme();
        });
        t = d.querySelector("[data-action=\"connect\"]");
        addToolTip(t,"Add a connection (foreign key)");

        t.addEventListener("click",function(){
            d.setAttribute("data-status","close");
            if(!self.hasForeign())
            {
                helpdialog("Click the attribute to connect");
                document.body.setAttribute("data-current","connecting");
                MouseEventConnectHandler.clickConnect(d);
            }
            else
            {
                self.removeConnectoins();
            }
        });
        t = d.querySelector("[data-action=\"unique\"]");
        addToolTip(t,"Toggle Unique");

        t.addEventListener("click",function(){

            d.setAttribute("data-status","close");
            if(self.special.indexOf("unique")!==-1)
            {
                var ns = [];
                for(var i = self.special.length;--i>=0;)
                {
                    if(self.special[i]=="unique")continue;
                    ns.push(self.special[i]);
                }
                self.special=ns;
                changed();
                refresh();
            }
            else
            {
                self.special.push("unique");
                changed();
                refresh();
            }

        });
        t = d.querySelector("[data-action=\"type\"]");
        addToolTip(t,"Choose Datatype");
        t.addEventListener("change",function(event){
            self.type=event.target.value.toLowerCase();
            changed();
        });
        self.ele = d;
        self.globalid=genuniquekey();
    };
    var en = function()
    {
        var e = self.ele.querySelector(".att_front");
        e.innerHTML="<form onsubmit=\"stp(event)\"><input type=\"text\" class=\"inp_mod\" placeholder=\"Attribute name\" pattern=\"^[A-Za-z0-9_-]+$\"><input type=\"submit\" class=\"hidden\"></form>";
        var inp = e.querySelector("input");
        inp.value=self.name;
        inp.focus();
        inp.select();
        var form = e.querySelector("form");
        form.addEventListener("submit",function(event){
            var v = inp.value;
            var regex = /^[A-Za-z0-9_-]+$/;
            if(regex.test(v))
            {
                self.name=v;
            }
            else
            {
                na("Invalid Name");
            }
            refresh();
            changed();
        });
        Globals.lastModifiedAttribute=self;
        changed();
    };
    
    var hf = function(detailed)
    {
        var r = DBClassesManager.getRelations();
        for(var i = r.length; --i>=0;)
        {
            if(r[i][0]==self.ele || r[i][1]==self.ele)return true;
        }
        return false;
    }
    
    var removeConnectoins = function()
    {
        var nre=[];
        var re = DBClassesManager.getRelations();
        for(var i = re.length; --i>=0;)
        {
            if(re[i][0]==self.ele || re[i][1]==self.ele)continue;
            nre.push(re[i]);
        }
        DBClassesManager.setNewRelation(nre);
        reconnect();
        refresh();
        changed();
    };
    
    var removeme = function()
    {
        var entities = DBClassesManager.getAllElement(), matched_entity, matched=false;
        for(var i = entities.length; --i>=0;)
        {
            var e = entities[i];
            var att = e.getAllAttributes();
            for(var j = att.length; --j>=0;)
            {
                if(att[j]==self)
                {
                    matched=true;
                    matched_entity=entities[i];
                    break;
                }
            }
            if(matched)break;
            Globals.lastModifiedAttribute=null;
        }
        matched_entity.removeAttribute(self);
        self.ele.outerHTML="";
    }
    
    this.type = "INTEGER";
    this.name = "";
    this.special = [];
    this.ele = null;
    this.hasForeign=hf;
    this.globalid = "";
    
    this.createElement=ce;
    this.editName=en;
    this.removeConnectoins=removeConnectoins;
    this.removeMe=removeme;
    this.serialize=function(tb_nr,id_nr)
    {
        var r = {};
        r.name=self.name;
        r.type=self.type;
        r.special=self.special;
        r.uid="t"+tb_nr+"_a"+id_nr;
        r.gid = self.globalid;
        self.ele.setAttribute("data-serialize",r.uid);
        self.ele.setAttribute("data-gs",r.gid);
        
        return r;
    };
    this.setGlobalId=function(gid)
    {
        self.globalid=gid;
    }
}

HTMLOptionsCollection.prototype.indexOf=function(nm)
{
    var o = this;
    for(var i = o.length; --i>=0;)
    {
        if(o[i].value.toLowerCase()==nm.toLowerCase())return i;
    }
    return -1;
}

function refresh()
{
    document.body.setAttribute("data-current","nothing");
    var et = DBClassesManager.getAllElement(), s, selidx;
    for(var i = et.length; --i>=0;)
    {
        var t_et = et[i];
        var t_title = t_et.ele.querySelector(".title");
        var t_att_container = t_et.ele.querySelector(".attributes");
        var t_att = t_et.getAllAttributes();
        t_title.innerHTML=t_et.name;
        for(var k = t_att.length; --k>=0;)
        {
            var t_satt = t_att[k];
            if(!t_att_container.contains(t_satt.ele))
            {
                t_att_container.appendChild(t_satt.ele);
            }
            t_satt.ele.querySelector(".att_front").innerHTML=t_satt.name;
            t_satt.ele.setAttribute("data-primary",(t_satt.special.indexOf("primary")!==-1));
            var uni = (t_satt.special.indexOf("unique")!==-1);
            if(uni)
            {
                t_satt.ele.querySelector("[data-action=\"unique\"]").innerHTML="n";
                t_satt.ele.setAttribute("data-unique","true");
            }
            else
            {

                t_satt.ele.querySelector("[data-action=\"unique\"]").innerHTML="1";
                t_satt.ele.setAttribute("data-unique","false");
            }
            var con = t_satt.ele.querySelector("[data-action=\"connect\"]");
            if(t_satt.hasForeign())
            {
                t_satt.ele.setAttribute("data-foreign","true");
                con.innerHTML="<i class=\"fa fa-chain-broken\"></i>";
            }
            else
            {
                t_satt.ele.setAttribute("data-foreign","false");
                con.innerHTML="<i class=\"fa fa-link\"></i>";
            }
            s = t_satt.ele.querySelector("select[data-action]");
            selidx = s.options.indexOf(t_satt.type);
            if(selidx!==-1)
            {
                s.selectedIndex=selidx;
            }
        }
    }
}

function reconnect()
{
    var xmlns = "http://www.w3.org/2000/svg";
    var fgns = DBClassesManager.getRelations();
    var lines, todraw = [], t, e1, e2, e1d, e2d, data;
    for(var i = fgns.length; --i>=0;)
    {
        e1 = fgns[i][0];
        e2 = fgns[i][1];
        e1d = {
            t:ATO(e1),
            l:ALO(e1),
            w:e1.offsetWidth,
            h:e1.offsetHeight
        };
        e2d = {
            t:ATO(e2),
            l:ALO(e2),
            w:e2.offsetWidth,
            h:e2.offsetHeight
        };
        t = {
            from:{x:0,y:0},
            to:{x:0,y:0},
            position:0, //0 -> right, 1 -> bottom, 2 -> left, 3-> top
            dis:0
        };
        
        if(e1d.l+e1d.w+10<e2d.l)
        {
            t.position=0;
        }else if(e1d.l > e2d.l+e2d.w+10)
        {
            t.position=2;
        }else if(e2d.t+e2d.h > e1d.t)
        {
            t.position=1;
        }else{
            t.position=3;
        }
        
        switch(t.position)
        {
            case 0:
                t.from.x = e1d.l+e1d.w;
                t.from.y = e1d.t+e1d.h/2;
                t.to.x = e2d.l;
                t.to.y = e2d.t+e2d.h/2;
                break;
            case 2:
                t.from.x = e1d.l;
                t.from.y = e1d.t+e1d.h/2;
                t.to.x = e2d.l+e2d.w;
                t.to.y = e2d.t+e2d.h/2;
                break;
            default:
                t.from.x = e1d.l;
                t.from.y = e1d.t+e1d.h/2;
                t.to.x = e2d.l;
                t.to.y = e2d.t+e2d.h/2;
                break;
        }
        t.dis = Math.max(t.from.x,t.to.x)-Math.min(t.from.x,t.to.x);
        
        todraw.push([t,e1d,e2d]);
    };
    Globals.svg.innerHTML="";
    for(var i = todraw.length; --i>=0;)
    {
        d = todraw[i][0];
        e1d = todraw[i][1];
        e2d = todraw[i][2];
        var o = Math.max(Math.floor(d.dis/3),60);
        var o2 = o;
        var o3 = -5;
        var arr = 5;
        if(d.position!==0)o*=-1;
        if(d.position===2){
            o3*=-1;
            o2*=-1;
            arr*=-1;
        }
        t = document.createElementNS(xmlns,"path");
        t.setAttributeNS(null,"stroke","black");
        t.setAttributeNS(null,"fill","transparent");
        t.setAttributeNS(null,"d","M "+d.from.x+" "+d.from.y+" C "+(d.from.x+o)+","+d.from.y+" "+(d.to.x-o2)+","+d.to.y+" "+(d.to.x+o3)+","+d.to.y+" M"+(d.to.x+o3)+" "+d.to.y+" l "+(-arr)+" "+(-arr)+" M"+(d.to.x+o3)+" "+d.to.y+" l "+(-arr)+" "+(arr));
        Globals.svg.appendChild(t);
    }
}

function stp(event)
{
    try
    {
        event.cancelBubble=true;
    }catch(e){}
    try
    {
        event.preventDefault();
    }catch(e){}
    try
    {
        event.stopPropagation();
    }catch(e){}
}

function DBEntity()
{
    var self = this;
    var attributes = [];
    
    var ce = function()
    {
        var t = document.createElement("div");
        t.className="db_entity";
        t.draggable = true;
        t.setAttribute("data-status","close");
        t.setAttribute("ondrag","stp(event)");
        t.setAttribute("ondragstart","stp(event)");
        t.setAttribute("ondragdrop","stp(event)");
        t.innerHTML="<div class=\"backface\"><div class=\"optrow\"><button data-action=\"close\">Close</button><button data-action=\"drop\">Drop</button><!--<button data-action=\"relation\">Rela.</button>--><button data-action=\"rename\"><i class=\"fa fa-pencil-square-o\"></i></button></div></div><div class=\"front\"><div class=\"title\">"+self.name+"</div><div class=\"add\"><i class=\"fa fa-plus\"></i></div><div class=\"options\"><i class=\"fa fa-cog\"></i></div><div class=\"attributes\"></div></div>";
        var tt = t.querySelector(".title")
        tt.addEventListener("dblclick",editT);
        tt.addEventListener("mousedown",MouseEventGeatureHandler.beginDragging);
        var opt = t.querySelector(".front .options");
        var cs = t.querySelector(".backface .optrow [data-action=\"close\"]");
        var toggle = function(){
            if(t.hasAttribute("data-opts") && t.getAttribute("data-opts")=="open")
            {
                t.setAttribute("data-opts","close");
            }
            else
            {
                t.setAttribute("data-opts","open");
            }
            setTimeout(reconnect,200);
        };
        opt.addEventListener("click",toggle);
        cs.addEventListener("click",toggle);
        var drop = t.querySelector(".backface .optrow [data-action=\"drop\"]");
        drop.addEventListener("click",function(event){
            DBClassesManager.drop(event.target);
        });
        var rename = t.querySelector(".backface .optrow [data-action=\"rename\"]");
        rename.addEventListener("click",function(event){
            editT();
        });
        var addatt = t.querySelector(".front .add");
        addatt.addEventListener("click",function(){
            ana();
        });
        
        var removeAttribute = function(att)
        {
            var nat = [], nre=[];
            for(var i = attributes.length; --i>=0;)
            {
                if(attributes[i]==att){
                    continue;
                }
                nat.push(attributes[i]);
            }
            
            var re = DBClassesManager.getRelations();
            for(var i = re.length; --i>=0;)
            {
                if(re[i][0]==att.ele || re[i][1]==att.ele)continue;
                nre.push(re[i]);
            }
            attributes=nat;
            DBClassesManager.setNewRelation(nre);
            reconnect();
            changed();
        }
        this.removeAttribute=removeAttribute;
        self.ele = t;
        setTimeout(function(){
            t.setAttribute("data-status","open");
        },100);
    };
    var ge = function()
    {
        return self.ele;
    };
    var ana = function(){
        var na = new DBAttribute();
        na.name="new_attribute";
        na.createElement();
        self.addAttribute(na);
        na.editName();
        Globals.lastModifiedAttribute=na;
        changed();
        return na;
    }
    var editT = function()
    {
        var title = ge().querySelector(".title");
        title.innerHTML="<form onsubmit=\"stp(event);\"><input type=\"text\" pattern=\"^[A-Za-z0-9_-]+$\" class=\"mod_inp\" value=\""+self.name+"\" onblur=\"setTimeout(refresh,50);\"><input type=\"submit\" class=\"hidden\"></form>";
        var inp = title.querySelector("input");
        inp.focus();
        inp.select();
        var ti = title.querySelector("form");
        ti.addEventListener("submit",function(event){
            var v = inp.value;
            v=v.replace(/( )+/g," ").replace(/ /g,"_");
            if((/^([A-Za-z0-9_-]+)$/).test(v))
            {
                self.name=v;
            }
            else
            {
                na("Invalid name");
            }
            refresh();
            changed();
        });
        changed();
    };
    
    var clear = function()
    {
        for(var i = attributes.length; --i>=0;)
        {
            attributes[i].removeMe();
        }
    }
    
    this.name = "new_table";
    this.type = 1; //1 -> table, 2 -> relation
    this.ele = null;
    this.globalid = genuniquekey();
    this.addAttribute = function(att)
    {
        attributes.push(att);
        refresh();
        Globals.lastModified=self;
        changed();
    };
    this.serialize=function(nr)
    {
        var r = {};
        r.uid = "t"+nr;
        r.gid = self.globalid;
        self.ele.setAttribute("data-serialization",r.uid);
        r.name=self.name;
        r.type=self.type;
        r.position={
            x:ALO(self.ele)+"",
            y:ATO(self.ele)+""
        };
        r.x=ALO(self.ele)+"px";
        r.y=ATO(self.ele)+"px";
        var a = [], att = attributes;
        for(var i = att.length; --i>=0;)
        {
            a.push(att[i].serialize(nr,i));
        }
        r.attributes=a;
        return r;
    }
    this.addNewAttribute=ana;
    this.createElement=ce;
    this.getElement=ge;
    this.editTitle=editT;
    this.getAllAttributes=function()
    {
        return attributes;
    };
    this.clear=clear;
    this.drop=function(){
        DBClassesManager.drop(self.ele);
    };
}

function Globals()
{
    var self = this;
    this.toolbar = document.querySelector(".toolbar");
    this.canvas = document.querySelector(".canvas");
    this.svg = document.querySelector("svg#SVG");
    this.tooltip=document.querySelector("#flying");
    this.connection = document.querySelector(".connections");
    this.lastModified=null;
    this.lastModifiedAttribute=null;
    
    self.canvas.addEventListener("scroll",reminispace);
}

function DBClassesManager()
{
    //PRIVATE
    var data = [];
    var foreigners = [];
    
    var getdatabyele = function(ele)
    {
        for(var i = data.length; --i>=0;)
        {
            if(data[i].ele == ele)
            {
                return data[i];
            }
        }
        return null;
    };
    
    var add = function(event)
    {
        var t = new DBEntity();
        t.createElement();
        Globals.canvas.appendChild(t.ele);
        data.push(t);
        
        var att = new DBAttribute();
        att.createElement();
        att.special.push("primary");
        att.name="id";
        t.addAttribute(att);
        
        t.editTitle();
        
        Globals.lastModified=t;
        Globals.lastModifiedAttribute=att;
        changed();
        
        return t;
    };
    
    var drop = function(ele)
    {
        var t = entityByChild(ele);
        var na = [];
        for(var i = data.length; --i>=0;)
        {
            if(data[i]!==t)
            {
                na.push(data[i]);
            }
        }
        
        var re = DBClassesManager.getRelations();
        var att = entityByChild(ele).getAllAttributes();
        var nre = [];
        var found = false;
        for(var i = re.length; --i>=0;)
        {
            found = false;
            for(var j = att.length; --j>=0;)
            {
                if(re[i][0]==att[j].ele || re[i][1]==att[j].ele)
                {
                    found=true;
                    break;
                }
            }
            if(!found)
                nre.push(re[i]);
        }
        DBClassesManager.setNewRelation(nre);
        
        t.ele.setAttribute("data-status","close");
        setTimeout(function(){
            t.ele.outerHTML = "";
        },400);
        data = na;
        reconnect();
        changed();
    }
    
    var connect = function(from,to)
    {

        var alreadyexists=function(from,to)
        {
            for(var i = foreigners.length; --i>=0;)
            {
                if(foreigners[i][0]==from && foreigners[i][1]==to)
                {
                    return true;
                }
            }
            return false;
        };
        if(!isSameTable(from,to) && !alreadyexists(from,to))
        {
            foreigners.push([from,to]);
            reconnect();
        }
        refresh();
    };
    
    var clear = function()
    {
        for(var i = data.length; --i>=0;)
        {
            drop(data[i].ele);
        }
    };
    
    //PUBLIC
    this.add=add;
    this.drop=drop;
    this.getAllElement=function(){return data;};
    this.connect=connect;
    this.getRelations=function(){return foreigners;}
    this.setNewRelation=function(nre){foreigners=nre};
    this.clear=clear;
}

DBClassesManager = new DBClassesManager();

function addAccelerators()
{
    var kd = function(event)
    {
//        console.log(event.keyCode);
        if(event.altKey)
        {
            switch(event.keyCode)
            {
                case 78://N
                    DBClassesManager.add(event);
                    stp(event);
                    break;
                case 48://0
                    showHelp();
                    helpTab(1);
                    stp(event);
                    break;
                case 13://Enter
                    if(Globals.lastModified!==null)
                    {
                        Globals.lastModified.addNewAttribute();
                    }
                    stp(event);
                    break;
                case 82://R
                    if(Globals.lastModifiedAttribute!==null)
                    {
                        Globals.lastModifiedAttribute.editName();
                    }
                    stp(event);
                    break;
                case 83://S
                    saveFile();
                    stp(event);
                    break;
                case 84://T
                    showHelp();
                    helpTab(3);
                    stp(event);
                    break;
            }
        }
        else
        {
            switch(event.keyCode){
                case 112:
                    showHelp();
                    helpTab(0);
                    stp(event);
                    break;
                case 27:
                    hideHelp();
                    stp(event);
                    break;
            }
        }
    }
    document.body.addEventListener("keydown",kd);
}

function addMainActions()
{
    var bts = document.querySelectorAll(".toolbar [data-action]");
    for(var i = bts.length; --i>=0;)
    {
        switch(bts[i].getAttribute("data-action"))
        {
            case "add":
                bts[i].addEventListener("click",DBClassesManager.add);
                break;
            case "upload":
                bts[i].addEventListener("click",function(){
                    showHelp();
                    helpTab(2);
                    stp(event);
                });
                break;
            case "download":
                bts[i].addEventListener("click",saveFile);
                break;
            case "er":

                break;
            case "team":
                bts[i].addEventListener("click",function(){
                    showHelp();
                    helpTab(3);
                });
                break;
            case "question":
                bts[i].addEventListener("click",showHelp);
                break;
            default:
                break;
        }
    }
}

function showHelp()
{
    var helppopup=document.querySelector("#helppopup");
    helppopup.setAttribute("data-status","open");
    helpTab(0);
}
function hideHelp()
{
    var helppopup=document.querySelector("#helppopup");
    helppopup.setAttribute("data-status","close2");
    setTimeout(function(){
        helppopup.setAttribute("data-status","close");
    },800);
}

function helpTab(nr)
{
    if(nr===false)nr=0;
    var helppopup=document.querySelector("#helppopup");
    var ss = helppopup.querySelector("#slideslider");
    var tohighlight = helppopup.querySelectorAll(".tabbar .tab");
    var he = helppopup.querySelector(".hovereffect");
    ss.style.left=(-nr*100)+"%";
    for(var i = tohighlight.length; --i>=0;)
    {
        tohighlight[i].className="tab";
    }
    tohighlight=tohighlight[nr];
    tohighlight.className="tab active";
    he.style.left=Math.floor(tohighlight.offsetLeft)+"px";
    he.style.top=Math.floor(tohighlight.offsetTop)+"px";
    he.style.width=Math.floor(tohighlight.offsetWidth)+"px";
}
function adjustTab()
{
    var tabbartabs = helppopup.querySelectorAll(".tabbar .tab"), idx=-1;
    for(var i = tabbartabs.length; --i>=0;)
    {
        if(tabbartabs[i].className.indexOf("active")!==-1)
        {
            idx = i;
            break;
        }
    }
    if(idx!==-1)
    {
        helpTab(idx);
    }
}

function serializeStatus()
{
    var res = {};
    var db = [];
    var ent = DBClassesManager.getAllElement();
    var ent_id=0;
    for(var i = ent.length; --i>=0;)
    {
        db.push(ent[i].serialize(i));
    }
    res.db=db;
    var rel = [], grel=[];
    var relations = DBClassesManager.getRelations();
    for(var i = relations.length; --i>=0;)
    {
        if(relations[i][0].hasAttribute("data-serialize") && relations[i][1].hasAttribute("data-serialize"))
        {
            rel.push([relations[i][0].getAttribute("data-serialize"),relations[i][1].getAttribute("data-serialize")]);
        }
        if(relations[i][0].hasAttribute("data-gs") && relations[i][1].hasAttribute("data-gs"))
        {
            grel.push([relations[i][0].getAttribute("data-gs"),relations[i][1].getAttribute("data-gs")]);
        }
    }
    res.rel=rel;
    res.grel=grel;
    var dbname = document.querySelector("#dbname");
    dbname = (!!dbname && dbname.value.length > 0 ? dbname.value : "designer_db");
    res.name=dbname;
    return res;
}

function restoreStatus(st)
{
    DBClassesManager.clear();
    try{
        json = JSON.parse(st);
    } catch(e){console.log(e.message);return;}
    var db = json.db;
    var rel = json.rel;
    if("name" in json)
        var name = json.name;
    else
        var name = "designer_db";
    
    var dbname = document.querySelector("#dbname");
    dbname.value=name;
    
    var pos = {};
    for(var i = db.length; --i>=0;)
    {
        pos[db[i].uid]=db[i].position;
    }
    var rel_mod = {};
    
    
    for(var i = db.length; --i>=0;)
    {
        var t = db[i];
        var tt = DBClassesManager.add();
        tt.ele.style.top=pos[t.uid].y+"px";
        tt.ele.style.left=pos[t.uid].x+"px";
        tt.name=t.name;
        tt.type=t.type;
        if("gid" in t)
        {
            tt.globalid=t.gid;
        }
        tt.clear();
        
        
        var alist = t.attributes;
        for(var j = alist.length;--j>=0;)
        {
            var tat = tt.addNewAttribute();
            tat.name=alist[j].name;
            tat.type=alist[j].type;
            tat.special=alist[j].special;
            if("gid" in alist[j])
            {
                tat.globalid=alist[j].gid;
            }
            rel_mod[alist[j].uid]=tat;
        }
    }
    
    refresh();
    respace();
    
    for(var i = rel.length; --i>=0;)
    {
        DBClassesManager.connect(rel_mod[rel[i][0]].ele,rel_mod[rel[i][1]].ele);
    }
    
    localStorage.savestate=JSON.stringify(serializeStatus());
    
    if("te" in window)
    {
        if(te.connected)
        {
            setTimeout(changed);
        }
    }
}



function mergeState(data)
{
    if(isediting())return;
    autocommit=false;
    var usedgid=[];

    var getallgids = function(info)
    {
        var res = [];
        for(var i = info.length; --i>=0;)
        {
            res.push(info[i].gid);
            var a = info[i].attributes;
            for(var j = a.length; --j>=0;)
            {
                res.push(a[j].gid);
            }
        }
        return res;
    };
    var getTableByGID=function(gid)
    {
        var t = DBClassesManager.getAllElement();
        for(var i = t.length; --i>=0;)
        {
            if(t[i].globalid==gid)return t[i];
        }
        return false;
    };
    var getAttributeByGID=function(gid)
    {
        var t = DBClassesManager.getAllElement();
        for(var i = t.length; --i>=0;)
        {
            var tt = t[i].getAllAttributes();
            for(var j = tt.length; --j>=0;)
            {
                if(tt[j].globalid==gid)
                {
                    return {
                        table:t[i],
                        att:tt[j]
                    }
                }
            }
        }
        return false;
    }
    
    var createThisTable=function(t)
    {
        var tt = DBClassesManager.add();
        
        tt.ele.style.top=t.y;
        tt.ele.style.left=t.x;
        tt.name=t.name;
        tt.type=t.type;
        if("gid" in t)
        {
            tt.globalid=t.gid;
            usedgid.push(t.gid);
        }
        tt.clear();


        var alist = t.attributes;
        for(var j = alist.length;--j>=0;)
        {
            var tat = tt.addNewAttribute();
            tat.name=alist[j].name;
            tat.type=alist[j].type;
            tat.special=alist[j].special;
            try{
                tat.globalid=alist[j].gid;
                usedgid.push(tat.gid);
            }catch(e){console.log("e");}
        }
    };
    
    var addAttributeTo=function(tb,a)
    {
        var tat = tb.addNewAttribute();
        tat.name=a.name;
        tat.type=a.type;
        tat.special=a.special;
        if("gid" in a)
        {
            tat.globalid=a.gid;
            usedgid.push(a.gid);
        }
    };
    
    var syncAttribute = function(att,info)
    {
        att.name=info.name;
        att.type=info.type;
        att.special=info.special;
        att.setGlobalId(info.gid);
        usedgid.push(info.gid);
    }
    
    var resetAni=function(e)
    {
        setTimeout(function(){
            reconnect();
            e.setAttribute("data-aniall","false");
            respace();
        },400);
    };
    
    var mergeThisTable=function(tb,ntb)
    {
        tt.name=ntb.name;
        tt.type=ntb.type;
        tt.globalid=ntb.gid;
        tt.ele.setAttribute("data-aniall","true");
        tt.ele.style.top=ntb.y;
        tt.ele.style.left=ntb.x;
        usedgid.push(ntb.gid);
        resetAni(tt.ele);
        
        var attributes = ntb.attributes, att;
        for(var i = attributes.length; --i>=0;)
        {
            att = getAttributeByGID(attributes[i].gid);
            if(!att){
                addAttributeTo(tb,attributes[i]);
            }
            else if(tb==att.table)
            {
                syncAttribute(att.att,attributes[i]);
            }
        }
    };
    
    var tables = data.db;
    var tt;
    
    for(var i = tables.length;--i>=0;)
    {
        tt = getTableByGID(tables[i].gid);
        if(!tt)createThisTable(tables[i]);
        else mergeThisTable(tt,tables[i]);
    }
    refresh();
    
    //RELATIONS
    DBClassesManager.setNewRelation([]);
    var grel = data.grel;
    for(var i = grel.length; --i>=0;)
    {
        var a1 = getAttributeByGID(grel[i][0]);
        var a2 = getAttributeByGID(grel[i][1]);
        if(!!a1 && !!a2)
        {
            DBClassesManager.connect(a1.att.ele,a2.att.ele);
        }
    }
    
    
    //DELETE
    var used = (getallgids(tables));
    var oncanvas = (getallgids(serializeStatus().db));
    var notused = [];
    for(var i = oncanvas.length; --i>=0;)
    {
        if(used.indexOf(oncanvas[i])==-1)notused.push(oncanvas[i]);
    }
    for(var i = notused.length; --i>=0;)
    {
        var t = getTableByGID(notused[i]);
        if(!t)
        {
            t = getAttributeByGID(notused[i]);
            if(!!t)
            {
                t.att.removeMe();
            }
        }
        else
        {
            t.drop();
        }
    }
    
    autocommit=true;
    reconnect();
    refresh();
    changed(true);
    
}

function checkIfLoadLS()
{
    if(localStorage.savestate!=="undefined")
    {
        restoreStatus(localStorage.savestate);
    }
}

function saveFile()
{
    if(runningonserver)
    {
        var fd = new FormData();
        fd.append("text",JSON.stringify(serializeStatus()));
        var xml = new XMLHttpRequest();
        xml.open("POST","server/download.php?set=1");
        xml.send(fd);
        xml.onload=function()
        {
            if(xml.responseText=="errore")
            {
                helpdialog("An error occured while prepairing the file.");
            }
            else
            {
                var id = xml.responseText;
                var dbname = document.querySelector("#dbname");
                dbname = (!!dbname && dbname.value.length > 0 ? dbname.value : "designer_db");

                location.href="server/download.php?get=1&id="+id+"&name="+encodeURIComponent(dbname+".json");
            }
        }
    }
    else
    {
        na("Can not save when not connected to a server");
    }
}

function createTooltip()
{
    var actions = Globals.toolbar.querySelectorAll("[data-action]");
    var tooltip = document.createElement("div");
    tooltip.className="tooltip";
    var t, mw = 0, tips=[];
    
    var merger = document.createElement("img");
    merger.src="img/merge.svg";
    merger.className="merger";
    tooltip.appendChild(merger);
    
    Globals.toolbar.querySelector("span.hovercollection").appendChild(tooltip);
    
    var addHoverFX=function(hele,tele)
    {
        hele.addEventListener("mouseover",function(event){
            for(var i = tips.length; --i>=0;)
            {
                if(tips[i]==tele)
                {
                    tele.setAttribute("data-status","in");
                }
                else
                {
                    tips[i].setAttribute("data-status","out");
                }
            }
            tooltip.style.top=(ATO(hele)+(hele.offsetHeight/2)-(tooltip.offsetHeight/2))+"px";
        });
    }
    
    
    for(var i = 0; i<actions.length;i++)
    {
        actions[i].setAttribute("data-toolid",i);
        t = document.createElement("div");
        t.className="tool_tab";
        t.innerHTML=actions[i].getAttribute("data-tooltip");
        tips.push(t);
        if(i!==0)t.setAttribute("data-status","out");
        tooltip.appendChild(t);
        addHoverFX(actions[i],t,i);
        mw = Math.max(t.offsetWidth,mw);
    }
    tooltip.style.width=mw+20+"px";
}

function changed(local)
{
    if(autocommit)
    {
        localStorage.savestate=JSON.stringify(serializeStatus());
        if(!!local || isediting())return;
        try
        {
            if(te.connected)
            {
                var fd = new FormData();
                fd.append("json",JSON.stringify(serializeStatus()));
                
                var xml = new XMLHttpRequest();
                xml.open("POST","server/teammanager.php?commit");
                xml.send(fd);
                xml.onload=function(){
//                    console.log("Commited",xml.responseText);
                }
                
            }
        }catch(e){/*console.log(e.message);*/}
    }
}

function loadfile(files)
{
    hideHelp();
    if("length" in files)files=files[0];
    var fr = new FileReader();
    fr.onload=function()
    {
        if(te.connected)
        {
            na("While connected you can not load Files.");
            return;
        }
        restoreStatus(fr.result);
    };
    fr.readAsText(files);
}

function selectFileFromForm(frm)
{
    loadfile(frm.querySelector("input[type=\"file\"]").files);
}

function selectFileFromInput(inp)
{
    loadfile(inp.files);
}

function drop(event)
{
    event.preventDefault();
    stp(event);
    loadfile(event.dataTransfer.files);
}

function addDropListener()
{
    document.ondragdrop=function(evt){evt.preventDefault()};
    document.ondragover=function(evt){evt.preventDefault()};
    document.ondragleave=function(evt){evt.preventDefault()};
    document.ondragend=function(evt){evt.preventDefault()};
    document.ondrag=function(evt){evt.preventDefault()};
    document.ondrop=drop;
}

function exportInMySQL()
{
    var db = serializeStatus();
    var nle="\r\n";
    var nl=";"+nle;
    var output="";
    var p=function(s){output+=s;}

    p("CREATE DATABASE "+db.name+nl);
    p("USE "+db.name+nl)
    p("SET sql_notes = 0"+nl);
    var t = db.db, a, s, q=[];
    for(var i = t.length; --i>=0;)
    {
        p(nle+"CREATE TABLE "+t[i].name+" IF NOT EXISTS("+nle);
        q=[];
        for(var j = t[i].attributes.length; --j>=0;)
        {
            a = t[i].attributes[j];
            s = "  "+a.name+" "+typemap.mysql[a.type.toLowerCase()];
            console.log(typemap.mysql,a.type.toLowerCase());
            if(a.special.indexOf("primary")!==-1)
            {
                s+=" PRIMARY KEY";
            }
            if(a.special.indexOf("unique")!==-1)
            {
                s+=" UNIQUE";
            }
            q.push(s);
        }
        p(q.join(","+nle));
        p(nle+")engine=innodb;"+nle);
    }
    var tbname = function(id)
    {
        var t = db.db, a;
        for(var i = t.length;--i>=0;)
        {
            a = t[i].attributes;
            for(var j = a.length; --j>=0;)
            {
                if(a[j].uid==id)
                {
                    return{table:t[i].name,att:a[j].name}
                }
            }
        }
    }
    p(nle);
    p("SET sql_notes = 1"+nl);
    p(nle);

    var rel = db.rel, i1, i2;
    for(var i = rel.length; --i>=0;)
    {
        i1 = tbname(rel[i][0]);
        i2 = tbname(rel[i][1]);
        p("ALTER TABLE "+i1.table+" ADD FOREIGN KEY ("+i1.att+") REFERENCES "+i2.table+"("+i2.att+")"+nl);
    }

    return output;
}

function insertBr(s)
{
    s = s.replace(/(\r\n|\n)/g,"<br>").replace(/ /g,"&nbsp;");
    return s;
}

function showOutput(title,txt)
{
    var op = document.querySelector("#output");
    op.querySelector("h4").innerHTML=title;
    op.querySelector(".outcontent").innerHTML=txt;
    op.style.display="block";
    setTimeout(function(){
        op.style.opacity=1;
        op.scrollIntoView();
    },50);
}

function saveMySqlFile()
{
    if(runningonserver)
    {
        var fd = new FormData();
        fd.append("text",exportInMySQL());
        var xml = new XMLHttpRequest();
        xml.open("POST","server/download.php?set=1");
        xml.send(fd);
        xml.onload=function()
        {
            if(xml.responseText=="errore")
            {
                helpdialog("An error occured while prepairing the file.");
            }
            else
            {
                var id = xml.responseText;
                var dbname = document.querySelector("#dbname");
                dbname = (!!dbname && dbname.value.length > 0 ? dbname.value : "designer_db");

                location.href="server/download.php?get=1&special=1&id="+id+"&name="+encodeURIComponent(dbname+".sql");
            }
        }
    }else
    {
        showOutput("My SQL Export",insertBr(exportInMySQL()));
    }
}

function exportInSqlite()
{
    var db = serializeStatus();
    var nle="\r\n";
    var nl=";"+nle;
    var output="";
    var p=function(s){output+=s;}

    p("CREATE DATABASE "+db.name+nl);
    p("USE "+db.name+nl)
    var t = db.db, a, s, q=[];
    for(var i = t.length; --i>=0;)
    {
        p(nle+"CREATE TABLE "+t[i].name+" IF NOT EXISTS("+nle);
        q=[];
        for(var j = t[i].attributes.length; --j>=0;)
        {
            a = t[i].attributes[j];
            s = a.name+" "+typemap.sqlite[a.type];
            if(a.special.indexOf("primary")!==-1)
            {
                s+=" PRIMARY KEY";
            }
            if(a.special.indexOf("unique")!==-1)
            {
                s+=" UNIQUE";
            }
            q.push(s);
        }
        p(q.join(","+nle));
        p(nle+")engine=innodb;"+nle);
    }
    var tbname = function(id)
    {
        var t = db.db, a;
        for(var i = t.length;--i>=0;)
        {
            a = t[i].attributes;
            for(var j = a.length; --j>=0;)
            {
                if(a[j].uid==id)
                {
                    return{table:t[i].name,att:a[j].name}
                }
            }
        }
    }
    p(nle);

    var rel = db.rel, i1, i2;
    for(var i = rel.length; --i>=0;)
    {
        i1 = tbname(rel[i][0]);
        i2 = tbname(rel[i][1]);
        p("ALTER TABLE "+i1.table+" ADD FOREIGN KEY ("+i1.att+") REFERENCES "+i2.table+"("+i2.att+")"+nl);
    }

    return output;
}
function saveSqliteFile()
{
    if(runningonserver)
    {
        var fd = new FormData();
        fd.append("text",exportInSqlite());
        var xml = new XMLHttpRequest();
        xml.open("POST","server/download.php?set=1");
        xml.send(fd);
        xml.onload=function()
        {
            if(xml.responseText=="errore")
            {
                helpdialog("An error occured while prepairing the file.");
            }
            else
            {
                var id = xml.responseText;
                var dbname = document.querySelector("#dbname");
                dbname = (!!dbname && dbname.value.length > 0 ? dbname.value : "designer_db");

                location.href="server/download.php?get=1&special=1&id="+id+"&name="+encodeURIComponent(dbname+".sql");
            }
        }
    }else{
        showOutput("Sqlite Export",insertBr(exportInSqlite()));
    }
}

//ContextMenus

function createMatchSelector()
{
    var d = document.createElement("div");
    var found = false;
    if("matches" in d)
    {
        Element.prototype.ms=function(sel){
            return this.matches(sel);
        }
        return true;
    }
    var vendors = ["webkit","moz","o","ms"];
    for(var i = vendors.length; --i>=0;)
    {
        if(vendors[i]+"matches" in d)
        {
            Element.prototype.ms=function(sel){
                return this[vendors[i]+"Matches"]+(sel);
            }
            return true;
        }
    }
    if("matchesSelector" in d)
    {
        Element.prototype.ms=function(sel){
            return this.matchesSelector(sel);
        }
        return true;
    }
    for(var i = vendors.length; --i>=0;)
    {
        if(vendors[i]+"MatchesSelector" in d)
        {
            Element.prototype.ms=function(sel){
                return this[vendors[i]+"MatchesSelector"]+(sel);
            }
            return true;
        }
    }
     return false;                       
}

function addCustomContextMenu()
{
    if(!createMatchSelector())
    {
        console.warn("Matches not supported");
        return;
    }
    
    function isCMOpen()
    {
        return cmenu.className.indexOf("out")==-1;
    }
    
    function showContextMenu()
    {
        cmenu.className="open";
        gpane.className="in";
    }
    
    function showContextMenuAt(x,y)
    {
        var m = 20;
        if(x < m) x = m;
        else if(x > innerWidth-m-cmenu.offsetWidth)x=x-cmenu.offsetWidth;
        if(y < m) y = m;
        else if(y > innerHeight-m-cmenu.offsetHeight)y=y-cmenu.offsetHeight;
        cmenu.style.left=x+"px";
        cmenu.style.top=y+"px";
        showContextMenu();
    }
    
    function closeContextMenu()
    {
        cmenu.className="out";
        gpane.className="out";
    }
    
    cmenu = document.querySelector("#contextmenu");
    cmenu.addEventListener("click",closeContextMenu);
    gpane = document.querySelector("#glasspane");
    
    gpane.addEventListener("click",function(){
       closeContextMenu(); 
    });
    
    function MenuItem(name,action)
    {
        this.name=name;
        this.action=action;
    };
    
    function MenuBuilder(condition,builder,bubble)
    {
        //Construct
        this.condition="*";
        if(!!condition)this.condition=condition;
        this.builder=function(element,event){return [];}
        if(!!builder)this.builder=builder;
        this.bubble=true;
        if(typeof bubble!=="undefined")this.bubble=bubble;
        
        this.called=false;
    }
    
    function MenuSeparator(st){this.title=st;}
    
    var menus = [];
    var bubbled = false;
    
    var conditions=[
        
//        new MenuBuilder("*",function(element,event){
//            return [new MenuSeparator("About"),new MenuItem("About Erdesigner",function(){
//                showHelp();
//                helpTab(4);
//            })];
//        },true),
        
        new MenuBuilder("div.db_entity div.title",function(element,event){
            var ent = entityByChild(element);
            return [new MenuSeparator("Table"),new MenuItem("Rename Table",function(){
                ent.editTitle();
            }),new MenuItem("Drop Table",function(){
                ent.drop();
            })]
        }),
        
        
        new MenuBuilder("div.db_entity",function(element,event){
            var ent = entityByChild(element);
            return [new MenuSeparator("Table"),new MenuItem("Add Attribute",function(){
                ent.addNewAttribute();
            })]
        }),

        new MenuBuilder(".db_attribute",function(element,event){
            var att = attributeByChild(element);
            return [
                new MenuSeparator("Attribute"),
                new MenuItem("Rename Attribute",function(){
                    att.editName();
                }),
                new MenuItem("Delete Attribute",function(){
                    att.removeMe();
                })
            ]
        }),

        new MenuBuilder(".canvas",function(element,event){
            if(menus.length==0)
            {
                return [
                    new MenuSeparator("Canvas"),
                    new MenuItem("Add New Table",function(event){
                        var e = DBClassesManager.add();
                        e = e.ele;

                        e.style.top=(event.clientY-15+Globals.canvas.scrollTop)+"px";
                        e.style.left=(event.clientX-(e.offsetWidth/2)+Globals.canvas.scrollLeft)+"px";
                        respace();
                        changed();
                    })
                ];
            }
            else
            {
                return [];
            }
        })
        
    ];
    
    var clearMenu=function()
    {
        var titles_found=[];
        var t = cmenu.querySelectorAll("li.sep");
        for(var i = 0; i<t.length;i++)
        {
            if(titles_found.indexOf(t[i].innerHTML)!==-1)
            {
                t[i].style.display="none";
                continue;
            }
            titles_found.push(t[i].innerHTML);
        }
        if(titles_found.length==1)
        {
            for(var i = t.length; --i>=0;)
            {
                cmenu.removeChild(t[i]);
            }
        }
        cmenu.setAttribute("data-sep",titles_found.length);
    };

    var buildMenu=function()
    {
        cmenu.innerHTML="";
        var t = null, li = null;
        for(var lol in menus)
        {
            t = menus[lol];
            li = document.createElement("li");
            if(t instanceof MenuItem)
            {
                li.innerHTML=t.name;
                li.addEventListener("click",t.action);
            }
            else if(t instanceof MenuSeparator)
            {
                li.className="sep";
                if(t.title.length>2)
                {
                    li.innerHTML=t.title;
                }
            }
            cmenu.appendChild(li);
        }
        clearMenu();
    };

    var showMenu=function(event)
    {
        if(menus.length==0)return;
        showContextMenuAt(event.clientX,event.clientY);
    };
    
    var chele = function(ele,event)
    {
        for(var i = conditions.length; --i>=0;)
        {
            if(!conditions[i].called && ele.ms(conditions[i].condition))
            {
                menus=menus.concat(conditions[i].builder(ele,event));
                conditions[i].called=true;
                if(conditions[i].bubble==false)
                {
                    return true;
                }
            }
        }
        return false;
    }
    
    var customContextMenuHandler = function(event)
    {
        bubbled=false;
        menus=[];
        
        for(var i = conditions.length; --i>=0;)
        {
            conditions[i].called=false;
        }
        
        var ele = event.target;
        while(ele!=null)
        {
            bubbled=chele(ele,event);
            if(ele==document.body || bubbled)break;
            ele=ele.parentNode;
        }

        buildMenu();
        showMenu(event);
        
    };
    
    document.addEventListener("contextmenu",function(event){
        stp(event);
        if(isCMOpen())
        {
            closeContextMenu();
            return;
        }
        customContextMenuHandler(event);
    });
}

function ld(){
    Globals = new Globals();
    checkIfRunningOnServer();
    addAccelerators();
    addMainActions();
    createTooltip();
    checkIfLoadLS();
    addDropListener();
    setTimeout(function(){
        Globals.svg.style.opacity=1;
    },200);
    addEventListener("resize",adjustTab);
    try
    {
        te = new TeamManagerScript();
    }catch(e){}
    addCustomContextMenu();
}

document.addEventListener("DOMContentLoaded",ld);
addEventListener("onbeforeunload",changed);