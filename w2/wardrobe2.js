/* Игра «Гардероб 2»: по погоде и по случаю — движок. Собран из исходника превью (build_prod.py). */
(function(){
"use strict";
var NS="http://www.w3.org/2000/svg",SVG=document.getElementById("sg-sc");
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function f1(v){return (Math.round(v*10)/10).toString()}
function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,a,b){return v<a?a:v>b?b:v}
var seed=11;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
function rr(a,b){return a+(b-a)*rnd()}
function eio(u){return u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2}
function eout(u){return 1-Math.pow(1-u,3)}
function back(u){var c=1.6;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2)}
function rad(d){return d*Math.PI/180}

/* ───────── ассеты ───────── */
var REPO="https://cdn.jsdelivr.net/gh/pandora28546-lab/wardrobe@main/",W2=REPO+"w2/";
var G2URL="https://cdn.jsdelivr.net/gh/pandora28546-lab/sofia-game2@main/";
var DBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/Otvlekashki@main/";
var PBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/sofia-game-image@main/";
var NEXT_GAME_URL=(window.SG_CFG&&window.SG_CFG.next)||"https://sofiatmn.ru/";
/* звуки игры — папка w2 репо wardrobe; общие звуки — из репо других игр */
var A={star:G2URL+"Starsystems.png",snd:{}};
["splash","splash1","rain","umbrella","click","bell","steps","dress","bubbles","snowball","leaves","chop","clank","blow","kick","pop"].forEach(function(k){A.snd[k]=W2+k+".m4a"});
A.snd.dr2=W2+"kalimba.m4a";
/* свистки — новый файл, ссылка по коммиту (по @main кэш jsDelivr мог отдавать 404) */
A.snd.ambF="https://cdn.jsdelivr.net/gh/pandora28546-lab/wardrobe@d12e445e2b70992d3447dcfbe8c03fbc567e2430/w2/amb-whistle.m4a";
[["ambS","amb-summer"],["ambR","amb-rain"],["ambA","amb-autumn"],["ambW","amb-winter"],["ambG","amb-gym"],["ambPA","amb-party"],["ambP","amb-pool"],["ambN","amb-night"],["ambK","amb-kitchen"]].forEach(function(q){A.snd[q[0]]=W2+q[1]+".m4a"});
A.snd.star=DBASE+encodeURIComponent("stage complete.wav");A.snd.fanfare=DBASE+"fanfare.wav";A.snd.correct=DBASE+"correct.wav";A.snd.music=G2URL+"Music.m4a";
var PRAISE=[3,4,5,6,7,8,9].map(function(n){return PBASE+"Rock"+n+".m4a"});
var objUrls={};function srcFor(u){return objUrls[u]||u}
var GAME=document.getElementById("sofia-game");
GAME.style.setProperty("--sg-star-mask",'url("'+A.star+'")');
document.getElementById("sg-bigstar-img").src=A.star;
[].forEach.call(document.querySelectorAll(".sg-starsym"),function(i){i.src=A.star});

var DEFS=el("defs",{},SVG);
(function(){var c=document.createElement("canvas");c.width=c.height=180;var g=c.getContext("2d"),d=g.createImageData(180,180);
  for(var i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=0;d.data[i+3]=Math.round(Math.random()*11.5)}
  g.putImageData(d,0,0);var p=el("pattern",{id:"grain",width:180,height:180,patternUnits:"userSpaceOnUse"},DEFS);el("image",{href:c.toDataURL(),width:180,height:180},p)})();
var GID=0;
function lgrad(stops){var id="lg"+(GID++),g=el("linearGradient",{id:id,x1:0,y1:0,x2:0,y2:1},DEFS);stops.forEach(function(s,i){el("stop",{offset:i/(stops.length-1),"stop-color":s},g)});return "url(#"+id+")"}
function ground(p,d,fill){el("path",{d:d,fill:fill},p);el("path",{d:d,fill:"url(#grain)","pointer-events":"none"},p)}
function cloud(p,x,y,s,col){var g=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},p);
  [[0,0,46],[-52,14,34],[52,14,36],[-22,-24,36],[26,-20,32]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:col||"#FFFFFF"},g)});
  el("rect",{x:-86,y:10,width:172,height:40,rx:20,fill:col||"#FFFFFF"},g);return g}
function tree(p,x,y,s){var g=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},p);
  el("path",{d:"M-14 0 L-10 -150 H10 L14 0 Z",fill:"#985037"},g);
  [[0,-200,78,"#248C43"],[-58,-160,58,"#248C43"],[58,-158,60,"#248C43"],[-20,-232,46,"#4D9E10"],[30,-182,40,"#4D9E10"]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:c[3]},g)});
  el("circle",{cx:-26,cy:-228,r:18,fill:"#71CB0D",opacity:.7},g);return g}
function flowers(p,list){list.forEach(function(f,i){var c=["#FE88A8","#FFD326","#FFFFFF","#BC91E6"][i%4];
  el("path",{d:"M"+f[0]+" "+(f[1]+30)+" q-3 -16 0 -30",stroke:"#4D9E10","stroke-width":5,"stroke-linecap":"round",fill:"none"},p);
  var h=el("g",{transform:"translate("+f[0]+" "+f[1]+")"},p);[0,72,144,216,288].forEach(function(a){var r=rad(a);el("circle",{cx:Math.cos(r)*9,cy:Math.sin(r)*9,r:7,fill:c},h)});el("circle",{cx:0,cy:0,r:5,fill:"#FF8725"},h)})}
function blades(p,W,y){var bl="";for(var x=30;x<W;x+=rr(90,170)){bl+="M"+f1(x)+" "+y+" q4 -18 -2 -34 M"+f1(x+12)+" "+y+" q2 -14 8 -26 "}el("path",{d:bl,stroke:"#6E9A30","stroke-width":5,"stroke-linecap":"round",fill:"none",opacity:.64},p)}

/* улица шириной W: солнечная или дождливая; дорога входит и выходит за края */
/* ───────── улица: солнце, облака, цветы — как в «Повелительном наклонении» ───────── */
(function(){[["gDay",[["0","#ADC7FE"],[".6","#D3E2FF"],["1","#EAF1FF"]],560],["gGloom",[["0","#908B90"],[".55","#ACB3C6"],["1","#C6D2E4"]],620],
  ["hillFar",[["0","#CCF0A0"],["1","#ACD48C"]],[390,900]],["hillMid",[["0","#ACD48C"],["1","#88A848"]],[495,900]],["meadow",[["0","#9CC05C"],["1","#88A848"]],[560,900]],
  ["hillFarR",[["0","#B6D58C"],["1","#85A74D"]],[390,900]],["meadowR",[["0","#85A74D"],["1","#6E9A30"]],[560,900]]].forEach(function(a){
  var y=a[2],g=el("linearGradient",{id:a[0],gradientUnits:"userSpaceOnUse",x1:0,y1:Array.isArray(y)?y[0]:0,x2:0,y2:Array.isArray(y)?y[1]:y},DEFS);a[1].forEach(function(s){el("stop",{offset:s[0],"stop-color":s[1]},g)})});
  var r=el("radialGradient",{id:"gMoon"},DEFS);el("stop",{offset:0,"stop-color":"#FFF8A8","stop-opacity":.9},r);el("stop",{offset:1,"stop-color":"#FFF8A8","stop-opacity":0},r)})();
function sun(p,x,y){var s=el("g",{transform:"translate("+x+" "+y+")","data-ns":1},p);el("circle",{r:110,fill:"url(#gMoon)"},s);var rays=el("g",{},s);
  for(var i=0;i<12;i++){var a=i/12*Math.PI*2;el("path",{d:"M"+f1(Math.cos(a)*70)+" "+f1(Math.sin(a)*70)+" L"+f1(Math.cos(a)*94)+" "+f1(Math.sin(a)*94),stroke:"#FFD400","stroke-width":9,"stroke-linecap":"round",opacity:.75},rays)}
  el("circle",{r:52,fill:"#FFD400"},s);el("circle",{cx:-14,cy:-16,r:16,fill:"#FFF8A8",opacity:.75},s);return rays}
function cloud2(p,x,y,s,col){var cl=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},p),wh=!col||col==="#FFFFFF";[[0,0,46],[42,-16,38],[84,4,36],[-40,10,30],[38,16,42]].forEach(function(b){el("circle",{cx:b[0],cy:b[1],r:b[2],fill:col||"#FFFFFF","data-ns":1},cl);if(BGSH)lune(cl,b[0],b[1],b[2],b[2]*.22,wh?"#D3E2FF":DK,wh?1:.12)});return {g:cl,x:x,y:y,s:s,v:rr(8,16)}}
function flower2(p,x,y,s,kind,list){var g=el("g",{transform:"translate("+f1(x)+" "+f1(y)+")"},p),inner=el("g",{},g);
  el("path",{d:"M0 0 q-3 "+(-22*s)+" 0 "+(-44*s),stroke:"#4AA010","stroke-width":4*s,fill:"none","stroke-linecap":"round"},inner);
  el("ellipse",{cx:-8*s,cy:-14*s,rx:9*s,ry:4*s,fill:"#4AA010",transform:"rotate(-30 "+(-8*s)+" "+(-14*s)+")"},inner);
  var hy=-46*s;
  if(kind===0){for(var i=0;i<8;i++)el("ellipse",{cx:0,cy:hy-11*s,rx:5*s,ry:11*s,fill:"#FFFFFF",transform:"rotate("+(i*45)+" 0 "+hy+")"},inner);el("circle",{cx:0,cy:hy,r:7*s,fill:"#FFD400"},inner)}
  else if(kind===1){el("path",{d:"M"+(-12*s)+" "+hy+" q0 "+(-22*s)+" "+(6*s)+" "+(-24*s)+" q-2 "+(10*s)+" "+(6*s)+" "+(10*s)+" q"+(10*s)+" "+(-2*s)+" "+(-6*s)+" "+(14*s)+" Z",fill:"#FC88A8"},inner);el("path",{d:"M"+(-12*s)+" "+hy+" q"+(12*s)+" "+(14*s)+" "+(24*s)+" 0 q-4 "+(-18*s)+" "+(-12*s)+" "+(-20*s)+" q-8 "+(2*s)+" "+(-12*s)+" "+(20*s)+"Z",fill:"#FCD0DC"},inner)}
  else if(kind===2){[[-7,0],[7,0],[0,-8],[0,7]].forEach(function(o){el("circle",{cx:o[0]*s,cy:hy+o[1]*s,r:7*s,fill:"#B890E0"},inner)});el("circle",{cx:0,cy:hy,r:5*s,fill:"#FFD400"},inner)}
  else{for(var j=0;j<5;j++)el("circle",{cx:0,cy:hy-8*s,r:6*s,fill:"#FF8A20",transform:"rotate("+(j*72)+" 0 "+hy+")"},inner);el("circle",{cx:0,cy:hy,r:5*s,fill:"#FFF8A8"},inner)}
  if(list)list.push({g:inner,ph:rr(0,6)});return g}
function bush(p,x,y,s,dark){var g=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},p);
  if(BGSH)groundOval(g,10,44,150);[[-50,0,50],[0,-24,60],[56,0,48]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:dark?"#248C43":"#289440"},g)});el("circle",{cx:-10,cy:-46,r:20,fill:"#4AA010",opacity:.5},g);return g}
function tree2(p,x,y,s){var g=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},p);
  if(BGSH)groundOval(g,10,0,110);el("path",{d:"M-16 0 Q-10 -80 -12 -160 H12 Q10 -80 16 0 Z",fill:"#985037"},g);el("path",{d:"M-4 -40 Q-2 -90 -6 -130",stroke:"#7A3E2C","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.6},g);
  el("path",{d:"M6 -110 Q30 -130 44 -150",stroke:"#985037","stroke-width":10,fill:"none","stroke-linecap":"round"},g);
  [[0,-220,84,"#289440"],[-62,-176,62,"#289440"],[64,-174,64,"#289440"],[-30,-250,52,"#2E9E46"],[36,-236,56,"#2E9E46"],[0,-170,58,"#2E9E46"]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:c[3]},g)});
  [[-34,-250,20],[30,-222,16],[-60,-180,14]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:"#70CC10",opacity:.55},g)});return g}
function grassBlades(p,W,y0,y1){var lv=[[.41,""],[.52,""],[.64,""]];for(var x=20;x<W;x+=rr(26,60)){var y=rr(y0,y1),k=(y-y0)/(y1-y0+1),L=10+k*18,i=k<.33?0:k<.66?1:2;
  lv[i][1]+="M"+f1(x)+" "+f1(y)+" q"+f1(rr(-4,4))+" "+f1(-L*.6)+" "+f1(rr(-6,6))+" "+f1(-L)+" "}
  lv.forEach(function(l){el("path",{d:l[1],stroke:"#6E9A30","stroke-width":4,"stroke-linecap":"round",fill:"none",opacity:l[0]},p)})}
function houses(p,W){var cols=[["#FEC981","#C77A62"],["#D6E7FC","#6B91D5"],["#FBC8BE","#985037"],["#CBF0A4","#A17269"],["#FDE8C7","#C3200E"]];
  for(var x=-40,i=0;x<W+200;x+=rr(260,340),i++){var w=rr(200,250),h=rr(240,330),c=cols[i%cols.length],y=700,g=el("g",{transform:"translate("+f1(x)+" 0)"},p);
    el("rect",{x:0,y:y-h,width:w,height:h,fill:c[0]},g);el("path",{d:"M-18 "+(y-h+6)+" L"+(w/2)+" "+(y-h-100)+" L"+(w+18)+" "+(y-h+6)+" Z",fill:c[1],stroke:c[1],"stroke-width":10,"stroke-linejoin":"round"},g);
    for(var r=0;r<2;r++)for(var k=0;k<2;k++){var wx=w*.18+k*w*.42,wy=y-h+40+r*(h*.42);el("rect",{x:f1(wx),y:f1(wy),width:f1(w*.24),height:70,rx:8,fill:"#EAF1FF"},g);el("rect",{x:f1(wx+6),y:f1(wy+6),width:f1(w*.24-12),height:58,rx:5,fill:"#ADC6FD"},g);el("path",{d:"M"+f1(wx+w*.12)+" "+f1(wy+6)+" V"+f1(wy+64),stroke:"#EAF1FF","stroke-width":5},g)}
    el("rect",{x:f1(w*.4),y:y-96,width:f1(w*.22),height:96,rx:8,fill:c[1]},g);el("circle",{cx:f1(w*.4+w*.18),cy:y-48,r:5,fill:"#FFD326"},g)}}
function fence2(p,W,y){var g=el("g",{},p);for(var x=-40;x<W+60;x+=70){el("path",{d:"M"+x+" "+y+" V"+(y-130)+" l24 -22 l24 22 V"+y+"Z",fill:"#F8B888"},g)}
  el("rect",{x:-60,y:y-104,width:W+120,height:18,rx:6,fill:"#C77A62"},g);el("rect",{x:-60,y:y-44,width:W+120,height:18,rx:6,fill:"#C77A62"},g);return g}
function playground(p){var g=el("g",{},p),o={};
  /* качели: рама и сиденье покачивается */
  var sw=el("g",{transform:"translate(330 0)"},g);el("path",{d:"M-120 760 L-80 470 L-40 760 M120 760 L80 470 L40 760",stroke:"#C3200E","stroke-width":16,"stroke-linecap":"round",fill:"none"},sw);
  el("path",{d:"M-96 470 H96",stroke:"#C3200E","stroke-width":16,"stroke-linecap":"round"},sw);o.seat=el("g",{transform:"translate(0 470)"},sw);
  el("path",{d:"M-36 0 V190 M36 0 V190",stroke:"#908B90","stroke-width":5},o.seat);el("rect",{x:-48,y:186,width:96,height:16,rx:6,fill:"#FFD326"},o.seat);
  /* горка */
  var sl=el("g",{transform:"translate(1250 0)"},g);el("path",{d:"M40 770 V470 M110 770 V470",stroke:"#6B91D5","stroke-width":12,"stroke-linecap":"round"},sl);
  [520,570,620,670,720].forEach(function(y){el("path",{d:"M40 "+y+" H110",stroke:"#6B91D5","stroke-width":8,"stroke-linecap":"round"},sl)});
  el("rect",{x:20,y:450,width:110,height:22,rx:8,fill:"#0044D3"},sl);el("path",{d:"M24 462 Q-60 470 -110 640 Q-140 740 -210 770",stroke:"#FFD326","stroke-width":34,fill:"none","stroke-linecap":"round"},sl);
  el("path",{d:"M24 450 Q-60 458 -110 628 Q-140 728 -210 758",stroke:"#FEC981","stroke-width":6,fill:"none","stroke-linecap":"round",opacity:.8},sl);
  /* песочница с ведёрком */
  var sb=el("g",{transform:"translate(1080 860)"},g);el("rect",{x:-130,y:-24,width:260,height:56,rx:12,fill:"#C77A62"},sb);ground(sb,"M-112 -16 H112 V20 H-112 Z","#FDE6C4");
  el("path",{d:"M40 -40 L44 -6 H74 L78 -40 Z",fill:"#FC3529",stroke:"#FC3529","stroke-width":6,"stroke-linejoin":"round"},sb);el("path",{d:"M40 -40 Q59 -66 78 -40",stroke:"#FC3529","stroke-width":4,fill:"none"},sb);
  el("path",{d:"M-60 -10 L-30 -40",stroke:"#0044D3","stroke-width":8,"stroke-linecap":"round"},sb);el("ellipse",{cx:-26,cy:-44,rx:12,ry:8,fill:"#0044D3"},sb);
  o.tick=function(t){o.seat.setAttribute("transform","translate(0 470) rotate("+f1(Math.sin(t*1.4)*6)+")")};return o}
function lamp(p,x){var g=el("g",{transform:"translate("+x+" 0)"},p);el("rect",{x:-8,y:560,width:16,height:300,rx:6,fill:"#575757"},g);el("path",{d:"M0 570 Q0 530 40 530",stroke:"#575757","stroke-width":10,fill:"none"},g);
  el("path",{d:"M24 528 H62 L54 552 H32 Z",fill:"#2D2E2C"},g);el("circle",{cx:43,cy:556,r:9,fill:"#FFF8A8"},g)}
function bench(p,x,y){var g=el("g",{transform:"translate("+x+" "+y+")"},p);el("rect",{x:-110,y:-70,width:220,height:16,rx:6,fill:"#C77A62"},g);el("rect",{x:-110,y:-40,width:220,height:18,rx:6,fill:"#C77A62"},g);
  [-90,90].forEach(function(dx){el("rect",{x:dx-8,y:-40,width:16,height:48,rx:5,fill:"#575757"},g)})}

/* ───────── тени на предметах фона (как в превью «Беги»): деревья, кусты, ёлки, дома, забор, облака ─────────
   Небо, холмы, земля, дорога и трава — без теней. Свет сверху слева. Круги — «луна» без маски (дешево для iPad). */
var BGSH=true,DK="#2C3A5C";
function lune(p,cx,cy,r,k,col,op){var dx=-k,dy=-k*.9,d=Math.hypot(dx,dy);if(d>=2*r)return;var mx=cx+dx/2,my=cy+dy/2,h=Math.sqrt(r*r-d*d/4),px=-dy/d,py=dx/d;
  var x1=mx+h*px,y1=my+h*py,x2=mx-h*px,y2=my-h*py;if((x1-cx)*(-dy)-(y1-cy)*(-dx)<0){var tx=x1,ty=y1;x1=x2;y1=y2;x2=tx;y2=ty}
  return el("path",{d:"M"+f1(x1)+" "+f1(y1)+" A"+r+" "+r+" 0 1 1 "+f1(x2)+" "+f1(y2)+" A"+r+" "+r+" 0 0 0 "+f1(x1)+" "+f1(y1)+"Z",fill:col,opacity:op},p)}
var BGID=0;
/* форма со скруглённой обводкой обрезается маской (она учитывает обводку), остальные — clip-path */
function shadeEl(src,k,col,op){var par=src.parentNode,id="bgc"+(BGID++),st=src.getAttribute("stroke"),c=src.cloneNode(false),g;c.removeAttribute("opacity");c.removeAttribute("id");
  if(st){var m=el("mask",{id:id,maskUnits:"userSpaceOnUse",x:-3000,y:-3000,width:6000,height:6000},DEFS);c.setAttribute("fill","#FFFFFF");c.setAttribute("stroke","#FFFFFF");m.appendChild(c);g=el("g",{mask:"url(#"+id+")"})}
  else{var cp=el("clipPath",{id:id},DEFS);cp.appendChild(c);g=el("g",{"clip-path":"url(#"+id+")"})}
  par.insertBefore(g,src.nextSibling);
  var s1=src.cloneNode(false);s1.removeAttribute("id");s1.setAttribute("fill",col);s1.setAttribute("opacity",op);if(st)s1.setAttribute("stroke",col);g.appendChild(s1);
  var w=el("g",{transform:"translate("+(-k)+" "+f1(-k*.9)+")"},g),s2=src.cloneNode(false);s2.removeAttribute("id");s2.removeAttribute("opacity");w.appendChild(s2);return g}
function groundOval(g,cx,cy,rx){g.insertBefore(el("ellipse",{cx:cx,cy:cy,rx:rx,ry:f1(rx/9),fill:DK,opacity:.13}),g.firstChild)}
/* общий проход по фону: каждой цветной форме — тень одним тоном (свет сверху слева).
   Пропускаем: небо, холмы, землю и пол (с зерном или градиентом), большие стены, плоские овалы (лужи, коврики, тени),
   полупрозрачные блики, линии без заливки, мелочь меньше 14 и то, что помечено data-ns. */
var MEAS=null;
function bboxOf(e){var t=e.tagName;if(t==="circle"){var r=+e.getAttribute("r");return {w:2*r,h:2*r}}
  if(t==="ellipse")return {w:2*e.getAttribute("rx"),h:2*e.getAttribute("ry")};
  if(t==="rect")return {w:+e.getAttribute("width"),h:+e.getAttribute("height")};
  if(!MEAS){MEAS=document.createElementNS(NS,"svg");MEAS.setAttribute("style","position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden");document.body.appendChild(MEAS)}
  var c=el("path",{d:e.getAttribute("d")},MEAS),b;try{b=c.getBBox()}catch(x){b={width:0,height:0}}c.remove();return {w:b.width,h:b.height}}
function shadeAll(x){if(!BGSH)return x;var root=x.g||x,list=[].slice.call(root.querySelectorAll("circle,ellipse,rect,path"));
  list.forEach(function(e){
    if(e.closest("defs,clipPath,mask,pattern,[data-ns]"))return;
    var f=e.getAttribute("fill");if(!f||f==="none"||f.indexOf("url")===0||f===DK)return;
    if(e.getAttribute("opacity")!=null||e.getAttribute("fill-opacity")!=null)return;
    var p=e.parentNode;for(var q=p;q&&q!==root;q=q.parentNode)if(q.getAttribute&&q.getAttribute("opacity")!=null&&+q.getAttribute("opacity")<1)return;
    var nx=e.nextSibling;if(nx&&nx.getAttribute&&(nx.getAttribute("fill")||"").indexOf("url(#grain")===0)return;
    var b=bboxOf(e);if(b.w<14||b.h<14||b.w>1100||b.h>800)return;
    var t=e.tagName;if(t==="ellipse"&&b.h<b.w*.35)return;
    if(t==="circle"){var r=+e.getAttribute("r");var L=lune(p,+e.getAttribute("cx")||0,+e.getAttribute("cy")||0,r,clamp(r*.28,2,24),DK,.2);if(L){L.setAttribute("data-ns",1);p.insertBefore(L,e.nextSibling)}return}
    var k=clamp(Math.min(b.w,b.h)*.14,2,14),g=shadeEl(e,k,DK,.2);g.setAttribute("data-ns",1)});
  return x}

/* kind: park — солнечный парк; rain — дождь за городом; playground — детская площадка летом; yard — двор с домами в дождь */
function makeStreet(W,kind,puds){var g=el("g",{},null),o={g:g,W:W},wet=kind==="rain"||kind==="yard";o.fl=[];
  el("rect",{x:-10,y:-10,width:W+20,height:1044,fill:wet?"url(#gGloom)":"url(#gDay)"},g);
  if(!wet)o.rays=sun(g,W-330,230);
  o.cl=[];for(var x=200;x<W+200;x+=rr(420,560))o.cl.push(cloud2(g,x,rr(150,230),wet?rr(1.1,1.5):rr(.6,1),wet?(rnd()<.5?"#BEBFBF":"#E3E2E3"):"#FFFFFF"));
  if(wet)for(var x=0;x<W+200;x+=rr(300,420))o.cl.push(cloud2(g,x,rr(60,120),rr(1.4,1.8),"#ACB3C6"));
  var hp="M-20 700";for(var x=0;x<=W+300;x+=300)hp+=" Q"+(x+150)+" "+f1(rr(560,620))+" "+(x+300)+" "+f1(rr(600,640));hp+=" V1044 H-20 Z";ground(g,hp,wet?"url(#hillFarR)":"url(#hillFar)");
  if(kind==="yard"){houses(g,W);fence2(g,W,770)}
  else{for(var x=140;x<W;x+=rr(380,560))tree2(g,x,f1(rr(735,760)),rr(.8,1.02));for(var x=40;x<W;x+=rr(300,460))bush(g,x,f1(rr(760,775)),rr(.55,.75),wet)}
  var mp="M-20 770";for(var x=0;x<=W+300;x+=400)mp+=" Q"+(x+200)+" "+f1(rr(745,770))+" "+(x+400)+" "+f1(rr(755,775));mp+=" V1044 H-20 Z";ground(g,mp,wet?"url(#meadowR)":"url(#meadow)");
  if(kind==="playground")o.pg=playground(g);
  if(kind==="yard"){lamp(g,180);lamp(g,1300);bench(g,1120,840)}
  if(!wet){for(var x=60;x<W;x+=rr(110,200))flower2(g,x,rr(800,830),rr(.8,1.05),Math.floor(rr(0,4)),o.fl)}
  var rp="M-20 862 Q"+(W*.3)+" 846 "+(W*.55)+" 858 Q"+(W*.8)+" 870 "+(W+20)+" 852";
  var road=kind==="yard"?"#BEBFBF":kind==="rain"?"#D3A598":"#FDE8C7",edge=kind==="yard"?"#908B90":kind==="rain"?"#A17269":"#FAB78E";
  ground(g,rp+" V1044 H-20 Z",road);el("path",{d:rp,fill:"none",stroke:edge,"stroke-width":10},g);
  for(var i=0;i<Math.round(W/90);i++)el("ellipse",{cx:f1(rr(0,W)),cy:f1(rr(880,1000)),rx:f1(rr(5,10)),ry:f1(rr(3,5)),fill:edge,opacity:.6},g);
  o.puds=[];(puds||[]).forEach(function(q){el("ellipse",{cx:q[0],cy:q[1],rx:q[2],ry:q[2]*.17,fill:"#9DBBFF"},g);el("ellipse",{cx:q[0]-q[2]*.2,cy:q[1]-q[2]*.04,rx:q[2]*.5,ry:q[2]*.06,fill:"#D6E7FC",opacity:.8},g);o.puds.push(q)});
  o.rip=el("g",{},g);o.ripples=[];
  el("path",{d:"M-20 1004 Q"+(W*.3)+" 990 "+(W*.6)+" 1000 Q"+(W*.8)+" 1008 "+(W+20)+" 996 V1044 H-20 Z",fill:wet?"#6E9A30":"#85A74D"},g);
  grassBlades(g,W,1004,1030);
  o.dark=el("rect",{x:-10,y:-10,width:W+20,height:1044,fill:"#2C3A5C",opacity:wet?.12:0},g);
  o.rain=el("path",{d:"",stroke:"#EAF1FF","stroke-width":3.5,"stroke-linecap":"round",fill:"none",opacity:0},g);o.rainOn=wet?1:0;
  o.drops=[];for(var i=0;i<Math.round(W/14);i++)o.drops.push({x:rr(-100,W+100),y:rr(-50,1050),v:rr(800,1000)});o.nextRip=0;
  o.tick=function(t,dt){if(o.rays)o.rays.setAttribute("transform","rotate("+(t*6%360).toFixed(2)+")");
    o.cl.forEach(function(c){c.x+=c.v*dt*.5;if(c.x>W+200)c.x=-200;c.g.setAttribute("transform","translate("+f1(c.x)+" "+c.y+") scale("+c.s+")")});
    o.fl.forEach(function(f){f.g.setAttribute("transform","rotate("+(Math.sin(t*1.6+f.ph)*3).toFixed(2)+")")});
    if(o.pg)o.pg.tick(t);
    if(o.rainOn<=0){o.rain.setAttribute("opacity",0);return}
    var d="";o.drops.forEach(function(r){r.y+=r.v*dt;r.x-=r.v*dt*.16;if(r.y>1040){r.y=rr(-80,-10);r.x=rr(-50,W+150)}d+="M"+f1(r.x)+" "+f1(r.y)+" l-6 38 "});o.rain.setAttribute("d",d);o.rain.setAttribute("opacity",(.75*o.rainOn).toFixed(2));
    if(o.puds.length&&t>o.nextRip){o.nextRip=t+rr(.2,.5)/Math.max(.2,o.rainOn);var q=o.puds[Math.floor(rr(0,o.puds.length))];
      o.ripples.push({e:el("ellipse",{cx:f1(q[0]+rr(-q[2],q[2])*.7),cy:f1(q[1]+rr(-5,5)),rx:4,ry:1,fill:"none",stroke:"#EAF1FF","stroke-width":3},o.rip),t:t})}
    o.ripples=o.ripples.filter(function(r){var u=(t-r.t)/.9;if(u>1){r.e.remove();return false}r.e.setAttribute("rx",f1(6+u*34));r.e.setAttribute("ry",f1(1.5+u*6));r.e.setAttribute("opacity",(1-u).toFixed(2));return true})};
  return o}

/* спальня ночью: вид на кровать с изножья */
function bedroom(){var g=el("g",{},null),o={g:g};
  el("rect",{x:-10,y:-10,width:1556,height:880,fill:"#20477C"},g);var wp="";for(var y=40;y<840;y+=80)for(var x=(y/80%2)*60;x<1546;x+=120)wp+="M"+x+" "+y+" m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 ";el("path",{d:wp,fill:"#2C3A5C",opacity:.35},g);
  el("rect",{x:150,y:200,width:360,height:400,rx:30,fill:"#EAF1FF"},g);el("rect",{x:168,y:218,width:324,height:364,rx:20,fill:"#2C3A5C"},g);
  el("circle",{cx:400,cy:320,r:54,fill:"#FEFCAE"},g);el("circle",{cx:426,cy:300,r:48,fill:"#2C3A5C"},g);
  el("path",{d:"M330 218 V582 M168 400 H492",stroke:"#EAF1FF","stroke-width":12},g);
  el("path",{d:"M120 190 Q150 420 150 640 L100 640 Q90 400 70 190 Z",fill:"#BC91E6"},g);el("path",{d:"M540 190 Q510 420 510 640 L560 640 Q570 400 590 190 Z",fill:"#BC91E6"},g);
  el("rect",{x:56,y:176,width:548,height:22,rx:11,fill:"#86278D"},g);
  /* полка с игрушками и картинка над кроватью */el("rect",{x:600,y:300,width:220,height:14,rx:6,fill:"#C77A62"},g);el("circle",{cx:640,cy:276,r:24,fill:"#FF8725"},g);el("rect",{x:680,y:250,width:44,height:50,rx:6,fill:"#6B91D5"},g);P(g,"M740 300 L770 250 L800 300 Z","#FFD326");
  el("rect",{x:1000,y:230,width:240,height:150,rx:10,fill:"#C77A62"},g);el("rect",{x:1014,y:244,width:212,height:122,rx:6,fill:"#D6E7FC"},g);P(g,"M1030 350 L1090 290 L1130 330 L1170 300 L1210 350 Z","#4D9E10");el("circle",{cx:1180,cy:280,r:14,fill:"#FFD326"},g);
  planks(g,860,1044,"#C77A62","#A17269");
  /* ночник на тумбочке слева от кровати — видно, как он гаснет */
  var ns=el("g",{transform:"translate(-688 0)"},g);
  o.glow=el("circle",{cx:1470,cy:560,r:130,fill:"#FEFCAE",opacity:.25},ns);
  el("rect",{x:1400,y:640,width:140,height:220,rx:16,fill:"#C77A62"},ns);el("rect",{x:1418,y:700,width:104,height:12,rx:6,fill:"#985037"},ns);el("rect",{x:1418,y:770,width:104,height:12,rx:6,fill:"#985037"},ns);
  el("rect",{x:1464,y:572,width:12,height:72,fill:"#ACB3C6"},ns);o.shade=el("path",{d:"M1430 580 L1446 518 H1494 L1510 580 Z",fill:"#FFD326",stroke:"#FFD326","stroke-width":8,"stroke-linejoin":"round"},ns);
  el("rect",{x:1452,y:614,width:36,height:30,rx:6,fill:"#FE88A8"},ns);
  /* справа — корзина с игрушками */
  el("rect",{x:1400,y:740,width:130,height:120,rx:18,fill:"#86278D"},g);Ln(g,"M1410 770 H1520 M1410 800 H1520 M1410 830 H1520","#BC91E6",4,.6);
  el("circle",{cx:1440,cy:730,r:26,fill:"#FF8725"},g);el("rect",{x:1470,y:700,width:40,height:46,rx:8,fill:"#6B91D5"},g);el("circle",{cx:1490,cy:690,r:14,fill:"#FFD326"},g);
  /* кровать: изголовье, подушка — за ребёнком */
  o.bedBack=el("g",{},g);
  el("rect",{x:860,y:400,width:520,height:300,rx:40,fill:"#985037"},o.bedBack);el("rect",{x:890,y:430,width:460,height:240,rx:28,fill:"#C77A62"},o.bedBack);
  el("rect",{x:900,y:600,width:440,height:120,rx:24,fill:"#FFFFFF"},o.bedBack);
  el("rect",{x:990,y:560,width:260,height:90,rx:40,fill:"#FFFFFF"},o.bedBack);el("path",{d:"M1030 600 Q1120 618 1210 600",stroke:"#E3E2E3","stroke-width":6,fill:"none","stroke-linecap":"round"},o.bedBack);
  o.kidL=el("g",{},g);
  /* одеяло и изножье — перед ребёнком */
  o.blanket=el("g",{},g);
  el("path",{d:"M880 700 Q1120 680 1360 700 L1370 880 H870 Z",fill:"#9DBBFF"},o.blanket);
  el("path",{d:"M880 700 Q1120 680 1360 700 L1362 736 Q1120 716 878 736 Z",fill:"#D6E7FC"},o.blanket);
  [[960,790],[1070,820],[1200,780],[1290,840],[1010,860]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:12,fill:"#ADC6FD"},o.blanket)});
  o.foot=el("g",{},g);el("rect",{x:850,y:820,width:540,height:60,rx:20,fill:"#985037"},o.foot);[870,1370].forEach(function(x){el("rect",{x:x-16,y:830,width:32,height:60,rx:10,fill:"#7A3E2C"},o.foot)});
  el("ellipse",{cx:480,cy:950,rx:280,ry:46,fill:"#CCB4E6"},g);el("ellipse",{cx:480,cy:950,rx:230,ry:32,fill:"#D8CCE6"},g);
  o.night=el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"#2C3A5C",opacity:0},g);
  if(!document.getElementById("bedclip")){var cp=el("clipPath",{id:"bedclip"},DEFS);el("rect",{x:-10,y:-10,width:1556,height:888},cp)}
  o.tick=function(t){};return o}

/* комната со шкафом: вид из-за спины */
function wardrobeRoom(){var g=el("g",{},null),o={g:g};
  el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"#D3E2FF"},g);
  ground(g,"M-10 880 H1546 V1044 H-10 Z","#FDE6C4");
  [930,985].forEach(function(y){el("path",{d:"M-10 "+y+" H1546",stroke:"#F8B888","stroke-width":3,opacity:.55},g)});
  el("rect",{x:-10,y:850,width:1556,height:32,fill:"#ADC6FD"},g);
  el("ellipse",{cx:768,cy:892,rx:420,ry:22,fill:"#2C3A5C",opacity:.13},g);
  /* открытые дверцы */
  el("path",{d:"M420 150 L270 120 V920 L420 878 Z",fill:"#D3A598"},g);el("path",{d:"M1116 150 L1266 120 V920 L1116 878 Z",fill:"#D3A598"},g);
  el("rect",{x:290,y:480,width:12,height:90,rx:6,fill:"#985037"},g);el("rect",{x:1234,y:480,width:12,height:90,rx:6,fill:"#985037"},g);
  el("rect",{x:400,y:130,width:736,height:760,rx:22,fill:"#C77A62"},g);
  el("rect",{x:430,y:160,width:676,height:700,rx:12,fill:"#D3A598"},g);
  el("rect",{x:430,y:160,width:676,height:700,rx:12,fill:"url(#grain)"},g);
  el("rect",{x:430,y:300,width:676,height:18,fill:"#A17269"},g);
  var cp1=el("g",{transform:"translate(560 300) scale(.62)"},g);ITEMS.cap.head(cp1);castShadow(cp1,g,4,4,.22,3);
  var hp1=el("g",{transform:"translate(760 306) scale(.6)"},g);ITEMS.hat0.head(hp1);castShadow(hp1,g,4,4,.22,3);
  [[960,"#BC91E6"],[1030,"#FEC981"]].forEach(function(b){var bx=el("g",{},g);el("rect",{x:b[0]-40,y:236,width:80,height:64,rx:10,fill:b[1]},bx);el("rect",{x:b[0]-40,y:236,width:80,height:14,rx:7,fill:"#2C3A5C",opacity:.12},bx);castShadow(bx,g,4,4,.22,3)});
  el("path",{d:"M450 372 H1086",stroke:"#908B90","stroke-width":10,"stroke-linecap":"round"},g);
  o.hang=[];
  [["tshirt",520],["pajama",660],["puffer",790],["raincoat",920],["shorts",1030]].forEach(function(h,i){var hg=el("g",{transform:"translate("+h[1]+" 372)"},g),sw=el("g",{},hg);
    el("path",{d:"M0 0 q0 -14 10 -14 q10 0 10 10",stroke:"#908B90","stroke-width":5,fill:"none","stroke-linecap":"round",transform:"translate(-10 -6)"},sw);
    el("path",{d:"M0 4 L-52 40 H52 Z",fill:"none",stroke:"#A17269","stroke-width":6,"stroke-linejoin":"round"},sw);
    var sc=h[0]==="shorts"?.5:.58,top=h[0]==="shorts"?-200:-326,c=el("g",{transform:"translate(0 "+f1(-top*sc+14)+") scale("+sc+")"},sw);drawItem(ITEMS[h[0]],null,c);castShadow(c,sw,5,6,.22,3);o.hang.push({g:sw,a:0,v:0})});
  el("rect",{x:430,y:700,width:676,height:18,fill:"#A17269"},g);
  [[500,"#FE88A8"],[610,"#6B91D5"],[1000,"#4D9E10"]].forEach(function(f,i){var st=el("g",{},g);for(var k=0;k<3;k++){el("rect",{x:f[0]-46,y:676-k*24,width:92,height:22,rx:8,fill:f[1]},st);el("rect",{x:f[0]-40,y:690-k*24,width:80,height:5,rx:2.5,fill:"#2C3A5C",opacity:.15},st)}castShadow(st,g,4,4,.22,3)});
  var sh=el("g",{transform:"translate(620 852) scale(.62)"},g);ITEMS.rainboots.icon(sh);castShadow(sh,g,5,4,.22,3);
  var sh2=el("g",{transform:"translate(900 852) scale(.62)"},g);ITEMS.sandals.icon(sh2);castShadow(sh2,g,5,4,.22,3);
  o.tick=function(t,dt){o.hang.forEach(function(h){h.v+=(-h.a*30-h.v*3)*dt;h.a+=h.v*dt;h.g.setAttribute("transform","rotate("+f1(h.a)+" 0 -10)")})};
  return o}

/* ───────── мягкая тень, как в «Половинках» ─────────
   В «Половинках» у деталей drop-shadow(0 6px 8px rgba(0,0,0,.35)): ровное размытие со всех сторон, чуть вниз.
   Здесь то же самое фильтром SVG: для людей (окно 1536 по ширине, на экране ≈ 820 px) — сдвиг 11 и размытие 15, для вещей — 6 и 8. */
(function(){[["dsP",11,15,.28],["dsI",6,8,.4]].forEach(function(f){var fl=el("filter",f[0]==="dsP"?{id:f[0],filterUnits:"userSpaceOnUse",x:-420,y:-720,width:840,height:820,"color-interpolation-filters":"sRGB"}:{id:f[0],x:"-40%",y:"-30%",width:"180%",height:"170%","color-interpolation-filters":"sRGB"},DEFS);
  el("feDropShadow",{dx:0,dy:f[1],stdDeviation:f[2],"flood-color":"#2C3A5C","flood-opacity":f[3]},fl)})})();
function castShadow(src,parent,dx,dy,op,r){var id=(r!=null&&r<8)?"dsI":"dsP",C={on:true,last:true};src.setAttribute("filter","url(#"+id+")");
  C.sync=function(){if(C.on!==C.last){C.last=C.on;if(C.on)src.setAttribute("filter","url(#"+id+")");else src.removeAttribute("filter")}};
  C.rebuild=function(){};C.remove=function(){src.removeAttribute("filter")};return C}

/* ───────── стиль 2: люди как на странице «Девочка и мальчик — проекции и эмоции» ─────────
   Голова рисуется в координатах той страницы (кадр 400×900, голова ≈ 176) и вписывается в голову игры масштабом .85.
   Тень одним тоном: под формой — её копия цветом тени, сверху — копия формы со сдвигом к свету (свет сверху слева). */
var HT="translate(0 6) scale(.85) translate(-200 -264)",HTM="translate(0 6) scale(-.85 .85) translate(-200 -264)";
var KC={girl:{hair:"#FFD326",hsh:["#D2B205",.5],brow:"#D2B205",strand:"#D2B205"},boy:{hair:"#985037",hsh:["#7A3E2C",.55],brow:"#7A3E2C",strand:"#5E2E20"}};
var SH2={skin:["#FAB78E",.6],skinD:["#F9AB90",.6],white:["#C6D2E4",.9]};
function ellP(cx,cy,rx,ry,rot,n){n=n||18;var a=rad(rot||0),c=Math.cos(a),s=Math.sin(a),p=[];for(var i=0;i<n;i++){var t=i/n*Math.PI*2,x=rx*Math.cos(t),y=ry*Math.sin(t);p.push([cx+x*c-y*s,cy+x*s+y*c])}return p}
function smoothD(p,closed){var n=p.length,d="M"+f1(p[0][0])+" "+f1(p[0][1]),m=closed?n:n-1;for(var i=0;i<m;i++){var p0=p[closed?(i-1+n)%n:Math.max(i-1,0)],p1=p[i],p2=p[(i+1)%n],p3=p[closed?(i+2)%n:Math.min(i+2,n-1)];
  d+="C"+f1(p1[0]+(p2[0]-p0[0])/6)+" "+f1(p1[1]+(p2[1]-p0[1])/6)+" "+f1(p2[0]-(p3[0]-p1[0])/6)+" "+f1(p2[1]-(p3[1]-p1[1])/6)+" "+f1(p2[0])+" "+f1(p2[1])}return d+(closed?"Z":"")}
var S2ID=0;
/* форма d цветом fill; sh — [цвет тени, прозрачность]; k — сдвиг; v — сдвиг строго вверх (чёлка); X.inner — пятна под копией (тень головы на шее), X.cast — поверх */
function shade2(g,d,fill,sh,k,v,X){X=X||{};var w=el("g",{},g);el("path",{d:d,fill:fill},w);if(!sh&&!X.inner)return w;
  var id="s2c"+(S2ID++),cp=el("clipPath",{id:id},DEFS);el("path",{d:d},cp);var cg=el("g",{"clip-path":"url(#"+id+")"},w);
  if(sh)el("path",{d:d,fill:sh[0],opacity:sh[1]},cg);
  (X.inner||[]).forEach(function(q){el("path",{d:q[0],fill:q[1],opacity:q[2]},cg)});
  if(sh)el("path",{d:d,fill:fill,transform:v?"translate(0 "+(-k)+")":"translate("+(-k)+" "+f1(-k*.9)+")"},cg);
  (X.cast||[]).forEach(function(q){el("path",{d:q[0],fill:q[1],opacity:q[2]},cg)});return w}
function shp(g,pts,fill,sh,k,v,X){return shade2(g,smoothD(pts,1),fill,sh,k,v,X)}
function lineP(g,pts,col,w,op){var a={d:smoothD(pts,0),fill:"none",stroke:col,"stroke-width":w,"stroke-linecap":"round","stroke-linejoin":"round"};if(op!=null)a["stroke-opacity"]=op;return el("path",a,g)}
/* глаз с белком; группа — чтобы моргать */
function eyeW(p,cx,cy,k){k=k||1;var g=el("g",{},p);el("path",{d:smoothD(ellP(cx,cy,12.9*k,13.9,0,16),1),fill:"#FFFFFF"},g);
  el("path",{d:smoothD(ellP(cx,cy+1.35,9.6*k,11.5,0,16),1),fill:"#2C3A5C"},g);el("path",{d:smoothD(ellP(cx+3.5*k,cy-3.2,3.9*Math.max(k,.8),3.9,0,10),1),fill:"#FFFFFF"},g);
  el("path",{d:smoothD(ellP(cx-3.3*k,cy+5.5,1.85,1.85,0,8),1),fill:"#FFFFFF"},g);return g}
function arcEye(p,cx,cy,down){var y=down?-1:1;return lineP(p,[[cx-11,cy+3*y],[cx-5,cy-4*y],[cx,cy-5.5*y],[cx+5,cy-4*y],[cx+11,cy+3*y]],"#2C3A5C",4.2)}
/* кисть: ладонь с тенью, большой палец без тени */
function hand2(hd,s,skin){var far=skin!==SKIN;shp(hd,ellP(0,0,14,17,0,14),skin,far?SH2.skinD:SH2.skin,3.5);el("ellipse",{cx:-s*11,cy:-6,rx:6,ry:10,fill:skin,transform:"rotate("+(s*25)+" "+(-s*11)+" -6)"},hd)}
/* шея: тень от головы сверху */
function neck2(p,x,y,w,h,skin){var d="M"+(x+8)+" "+y+" H"+(x+w-8)+" Q"+(x+w)+" "+y+" "+(x+w)+" "+(y+8)+" V"+(y+h-8)+" Q"+(x+w)+" "+(y+h)+" "+(x+w-8)+" "+(y+h)+" H"+(x+8)+" Q"+x+" "+(y+h)+" "+x+" "+(y+h-8)+" V"+(y+8)+" Q"+x+" "+y+" "+(x+8)+" "+y+"Z";
  return shade2(p,d,skin||SKIN,SH2.skin,5,false,{inner:[[smoothD(ellP(x+w/2,y+2,w*1.1,13,0,12),1),"#FAB78E",.8]]})}
/* ёжик: шапка волос, край — зубчики одной линией от уха через лоб до другого уха */
function zigzag(Q,step,amp){var o=[],c=0;for(var j=0;j<Q.length-1;j++){var a0=Q[j][0],a1=Q[j][1],b0=Q[j+1][0],b1=Q[j+1][1],d=Math.hypot(b0-a0,b1-a1),n=Math.max(1,Math.round(d/step));
  for(var i=(j?1:0);i<=n;i++){var u=i/n,x=a0+(b0-a0)*u,y=a1+(b1-a1)*u,nx=-(b1-a1)/d,ny=(b0-a0)/d,k=c%2?amp:-amp*.6;o.push([x+nx*k,y+ny*k]);c++}}return o}
function spikyCap2(G,C,cx,cy,rx,ry,fk,fcx,LE,flat){var P=[];for(var a=165,i=0;a<=375;a+=7.5,i++){var t=rad(a),R=(i%2&&!flat)?1.13:1;P.push([cx+rx*R*Math.cos(t),cy+ry*R*Math.sin(t)])}
  P=P.concat(zigzag(LE,11.5,7));shp(G,P,C.hair,C.hsh,6);
  [[0,-76,0,-56],[-28,-70,-24,-50],[28,-70,24,-50],[-50,-54,-42,-36],[50,-54,42,-36]].forEach(function(q){lineP(G,[[fcx+q[0]*fk,cy+q[1]],[fcx+q[2]*fk,cy+q[3]]],C.strand,2.4,.38)})}
var BANGS_F=[[112,262],[114,216],[138,186],[170,172],[200,169],[230,172],[262,186],[286,216],[288,262],[276,236],[260,222],[240,230],[222,216],[202,228],[182,216],[162,230],[142,222],[126,236]];
/* рот в покое — плавная дуга; улыбка — приоткрытая, с язычком */
function mouth2(g,sm){if(!sm){var a=[];for(var i=0;i<=10;i++){var u=i/10;a.push([190+20*u,317+3.2*(1-Math.pow(2*u-1,2))])}lineP(g,a,"#A17269",3.4);return}
  el("path",{d:smoothD([[185,313],[200,315],[215,313],[210.5,322.5],[200,326],[189.5,322.5]],1),fill:"#985037"},g);el("path",{d:smoothD([[187.5,314.2],[200,316],[212.5,314.2],[211.3,318],[200,319.5],[188.7,318]],1),fill:"#FFFFFF"},g)}

/* голова спереди: K получает глаза, рот, хвостики, резинки */
function frontHead2(H,kind,K){var C=KC[kind],G=el("g",{transform:HT},H),girl=kind==="girl";K.hg=G;
  if(girl){K.tails=el("g",{},G);K.tailL=el("g",{},K.tails);K.tailR=el("g",{},K.tails);
    shp(K.tailL,ellP(84,246,25,44,28,18),C.hair,C.hsh,7);shp(K.tailR,ellP(316,246,25,44,-28,18),C.hair,C.hsh,7)}
  shp(G,girl?ellP(200,250,97,93,0,22):ellP(200,238,94,82,0,22),C.hair,C.hsh,7);
  [113,287].forEach(function(x){shp(G,ellP(x,280,14,16,0,12),SKIN,SH2.skin,3);el("path",{d:smoothD(ellP(x+(x<200?1:-1),281,7,9,0,10),1),fill:"#FBC8BE"},G)});
  shp(G,ellP(200,264,88,84,0,22),SKIN,SH2.skin,7);
  var F=el("g",{},G);
  K.eyeC=[[168,276],[232,276]];K.eyes=K.eyeC.map(function(c){return eyeW(F,c[0],c[1])});
  K.happy=K.eyeC.map(function(c){var a=arcEye(F,c[0],c[1]);a.setAttribute("opacity",0);return a});
  K.sleep=K.eyeC.map(function(c){var a=arcEye(F,c[0],c[1]+2,true);a.setAttribute("opacity",0);return a});
  lineP(F,[[154,252],[167,246],[181,249]],C.brow,4.5);lineP(F,[[219,249],[233,246],[246,252]],C.brow,4.5);
  [150,250].forEach(function(x){el("circle",{cx:x,cy:308,r:15,fill:"#FE88A8",opacity:.55},F)});
  el("ellipse",{cx:200,cy:294,rx:6,ry:4,fill:"#FAB78E"},F);
  K.mouth=el("g",{},F);
  K.smile=el("g",{opacity:0},F);
  K.yawn=el("ellipse",{cx:200,cy:324,rx:11,ry:14,fill:"#985037",opacity:0},F);
  K.blow=el("g",{opacity:0},F);el("ellipse",{cx:200,cy:322,rx:9.5,ry:10,fill:"#F9AB90"},K.blow);el("ellipse",{cx:200,cy:322,rx:4.8,ry:5.2,fill:"#985037"},K.blow);
  K.hair=el("g",{},G);
  if(girl){shp(K.hair,BANGS_F,C.hair,C.hsh,6,true);
    [[[200,174],[192,194],[182,214]],[[202,174],[210,198],[222,214]],[[168,180],[156,200],[144,220]],[[234,180],[246,200],[258,220]]].forEach(function(p){lineP(K.hair,p,C.strand,2.2,.38)});
    K.bands=el("g",{},G);K.bandL=el("g",{},K.bands);K.bandR=el("g",{},K.bands);
    el("path",{d:smoothD(ellP(109,212,13,9,-40,10),1),fill:"#FC3529"},K.bandL);el("path",{d:smoothD(ellP(291,212,13,9,40,10),1),fill:"#FC3529"},K.bandR)}
  else{var LE=[[293,262],[284,236],[264,222],[200,214],[136,222],[116,236],[107,262]];spikyCap2(K.hair,C,200,226,92,82,1,200,LE);
    /* под шапкой — та же причёска без колючек сверху, чтобы они не торчали из-под головного убора */
    K.hairHat=el("g",{display:"none"},G);spikyCap2(K.hairHat,C,200,228,88,76,1,200,LE,true)}}

/* голова сбоку: рисуем профиль лицом вправо, как на странице, и отражаем — в игре боковой персонаж смотрит влево в своих координатах */
function sideHead2(h,kind,o){var C=KC[kind],G=el("g",{transform:HTM},h),girl=kind==="girl";
  if(girl)shp(G,ellP(180,252,90,90,0,22),C.hair,C.hsh,7);
  shp(G,[[205,180],[250,188],[278,212],[290,240],[292,266],[294,280],[301,292],[294,301],[292,312],[290,323],[284,335],[268,346],[240,352],[205,348],[160,334],[128,298],[122,252],[140,206],[170,186]],SKIN,SH2.skin,7);
  el("circle",{cx:250,cy:310,r:13,fill:"#FE88A8",opacity:.55},G);
  o.eyeC=[264,278.5];o.eye=el("g",{},G);el("path",{d:smoothD(ellP(264,278,8.2,13.6,0,14),1),fill:"#FFFFFF"},o.eye);el("path",{d:smoothD(ellP(266.5,279.4,6.4,11.2,0,14),1),fill:"#2C3A5C"},o.eye);
  el("path",{d:smoothD(ellP(268.5,276,3,3.6,0,8),1),fill:"#FFFFFF"},o.eye);el("path",{d:smoothD(ellP(264.8,284.5,1.5,1.7,0,6),1),fill:"#FFFFFF"},o.eye);
  o.happy=el("g",{opacity:0},G);
  lineP(G,[[253,258],[265,253],[278,257]],C.brow,4.2);
  o.mouth=lineP(G,[[275,325],[283,327],[289,324]],"#A17269",3.4);
  o.smile=el("g",{opacity:0},G);lineP(o.smile,[[272,322],[281,328.5],[290,323]],"#A17269",3.4);
  o.grin=el("g",{opacity:0},G);
  if(girl){shp(G,[[112,256],[124,204],[162,172],[214,160],[258,174],[286,202],[296,236],[284,244],[274,234],[262,246],[250,232],[236,240],[222,232],[206,248],[184,258],[170,296],[152,334],[118,310]],C.hair,C.hsh,6,true);
    shp(G,ellP(196,284,13,16,0,12),SKIN,SH2.skin,3);el("path",{d:smoothD(ellP(197,285,6.5,9,0,10),1),fill:"#FBC8BE"},G);
    o.tail=el("g",{},G);shp(o.tail,ellP(100,268,26,46,42,18),C.hair,C.hsh,7);
    [[[214,166],[236,190],[252,214]],[[196,168],[214,194],[226,220]],[[176,176],[188,200],[196,226]]].forEach(function(p){lineP(G,p,C.strand,2.2,.38)});
    el("path",{d:smoothD(ellP(124,232,12,10,-48,10),1),fill:"#FC3529"},o.tail)}
  else{var O=[[278,224],[280,198],[262,172],[226,154],[190,152],[152,166],[124,194],[108,232],[110,272],[122,304],[146,330]],B=[[146,330],[170,300],[184,264],[206,240],[238,226],[278,224]];
    var walk=function(Q,step,amp){var r=[],c=0;for(var j=0;j<Q.length-1;j++){var a0=Q[j][0],a1=Q[j][1],b0=Q[j+1][0],b1=Q[j+1][1],d=Math.hypot(b0-a0,b1-a1),n=Math.max(1,Math.round(d/step));for(var i=(j?1:0);i<=n;i++){var u=i/n,x=a0+(b0-a0)*u,y=a1+(b1-a1)*u,nx=-(b1-a1)/d,ny=(b0-a0)/d,k=c%2?-amp:amp;r.push([x+nx*k,y+ny*k]);c++}}return r};
    var R=[],c=0;for(var j=0;j<O.length-1;j++){var a0=O[j][0],a1=O[j][1],b0=O[j+1][0],b1=O[j+1][1],n=Math.max(1,Math.round(Math.hypot(b0-a0,b1-a1)/11));for(var i=(j?1:0);i<=n;i++){var u=i/n,x=a0+(b0-a0)*u,y=a1+(b1-a1)*u,d=Math.hypot(x-196,y-236),k=(c%2&&!(j==O.length-2&&u>.5))?13:0;R.push([x+(x-196)/d*k,y+(y-236)/d*k]);c++}}
    shp(G,R.concat(walk(B,12,5).slice(1)),C.hair,C.hsh,6);
    [[[230,160],[226,182]],[[196,158],[198,180]],[[160,172],[170,190]],[[132,204],[146,214]],[[122,250],[138,256]],[[132,290],[148,290]]].forEach(function(p){lineP(G,p,C.strand,2.4,.38)});
    shp(G,ellP(196,284,13,16,0,12),SKIN,SH2.skin,3);el("path",{d:smoothD(ellP(197,285,6.5,9,0,10),1),fill:"#FBC8BE"},G)}
  return G}

/* голова сзади (девочка у шкафа): волосы до затылка, хвостики с резинками */
function backHead2(H,o){var C=KC.girl,G=el("g",{transform:HT},H);
  [113,287].forEach(function(x){el("path",{d:smoothD(ellP(x,282,14,16,0,12),1),fill:SKIN},G)});
  o.tl=el("g",{},G);o.tr=el("g",{},G);shp(o.tl,ellP(84,246,25,44,28,18),C.hair,C.hsh,7);shp(o.tr,ellP(316,246,25,44,-28,18),C.hair,C.hsh,7);
  var P=[];for(var i=0;i<15;i++){var t=rad(145+i*250/14);P.push([200+94*Math.cos(t),256+92*Math.sin(t)])}P=P.concat([[262,326],[240,344],[222,336],[200,348],[178,336],[160,344],[138,326]]);
  shp(G,P,C.hair,C.hsh,8);
  [[[200,168],[200,190],[200,212]],[[196,214],[176,260],[164,320]],[[204,214],[224,260],[236,320]],[[194,216],[192,270],[188,330]],[[206,216],[208,270],[212,330]],[[190,212],[150,240],[124,290]],[[210,212],[250,240],[276,290]]].forEach(function(p){lineP(G,p,C.strand,2.2,.38)});
  el("path",{d:smoothD(ellP(109,212,13,9,-40,10),1),fill:"#FC3529"},o.tl);el("path",{d:smoothD(ellP(291,212,13,9,40,10),1),fill:"#FC3529"},o.tr);
  /* резинки поверх волос: переносим в конец, вращаются вместе с хвостиками */
  o.bl=el("g",{},G);o.br=el("g",{},G);o.bl.appendChild(o.tl.lastChild);o.br.appendChild(o.tr.lastChild);return G}

/* ───────── персонаж спереди ───────── */
var SKIN="#FFE0CF",SKIN_D="#FBC8BE";
function eyeG(p,x,y,r){var g=el("g",{},p);el("ellipse",{cx:x,cy:y,rx:r,ry:r*1.12,fill:"#2C3A5C"},g);el("circle",{cx:x+r*.35,cy:y-r*.42,r:r*.38,fill:"#FFFFFF"},g);el("circle",{cx:x-r*.38,cy:y+r*.45,r:r*.16,fill:"#FFFFFF",opacity:.8},g);return g}
function happyArc(p,x,y,w){return el("path",{d:"M"+(x-w)+" "+(y+2)+" q"+w+" "+(-w*1.2)+" "+(2*w)+" 0",stroke:"#2C3A5C","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:0},p)}
function sleepArc(p,x,y,w){return el("path",{d:"M"+(x-w)+" "+(y-2)+" q"+w+" "+(w*1.1)+" "+(2*w)+" 0",stroke:"#2C3A5C","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:0},p)}
function armChain(parent,s,a,b,skin){var sh=el("g",{transform:"translate("+(s*50)+" -288)"},parent),up=el("g",{transform:"rotate("+f1(a)+")"},sh);
  if(skin){el("path",{d:"M0 0 V70",stroke:SKIN,"stroke-width":24,"stroke-linecap":"round"},up)}var upL=el("g",{},up);
  var fo=el("g",{transform:"translate(0 70) rotate("+f1(b)+")"},up);if(skin)el("path",{d:"M0 0 V60",stroke:SKIN,"stroke-width":21,"stroke-linecap":"round"},fo);var foL=el("g",{},fo);
  var hd=el("g",{transform:"translate(0 68)"},fo);if(skin)hand2(hd,s,SKIN);var hdL=el("g",{},hd);
  return {s:s,up:up,fo:fo,hd:hd,upL:upL,foL:foL,hdL:hdL}}
function makeKid(kind,parent,x,gy,gs){var K={kind:kind,x:x,gy:gy,gs:gs,hop:0,sq:0,arms:{},p:{},op:1};
  K.shadow=el("ellipse",{cx:0,cy:0,rx:80,ry:10,fill:"#2C3A5C",opacity:.13},parent);
  var root=el("g",{},parent);K.root=root;var B=el("g",{},root);K.body=B;K.parent=parent;
  [-1,1].forEach(function(s){el("path",{d:"M"+(s*22)+" -176 V-22",stroke:SKIN,"stroke-width":29,"stroke-linecap":"round"},B);el("ellipse",{cx:s*25,cy:-8,rx:21,ry:12,fill:SKIN},B)});
  neck2(B,-12,-326,24,30);
  el("rect",{x:-50,y:-304,width:100,height:134,rx:26,fill:SKIN},B);
  K.under=el("g",{},B);
  (function(w){var b=w.firstChild;b.setAttribute("stroke","#FFFFFF");b.setAttribute("stroke-width",6);b.setAttribute("stroke-linejoin","round")})(shade2(K.under,"M-51 -194 H51 L55 -150 Q36 -142 18 -152 Q0 -138 -18 -152 Q-36 -142 -55 -150 Z","#FFFFFF",SH2.white,8));
  el("rect",{x:-51,y:-196,width:102,height:9,rx:4,fill:"#E3E2E3"},K.under);
  shade2(K.under,"M-50 -266 Q-40 -300 -32 -304 L-24 -304 Q0 -276 24 -304 L32 -304 Q40 -300 50 -266 L52 -184 Q52 -176 44 -176 H-44 Q-52 -176 -52 -184 Z","#FFFFFF",SH2.white,10,false,{cast:[[smoothD(ellP(0,-300,30,8,0,12),1),"#C6D2E4",.7]]});
  K.L={legwear:el("g",{},B),shoes:el("g",{},B),top:el("g",{},B),outer:el("g",{},B),scarf:el("g",{},B)};
  K.arms[-1]=armChain(B,-1,10,0,true);K.arms[1]=armChain(B,1,-10,0,true);K.pose={"-1":{a:10,b:0},"1":{a:-10,b:0}};
  var H=el("g",{transform:"translate(0 -386)"},B);K.head=H;
  frontHead2(H,kind,K);K.mv=MOUTH;drawMouth(K,false);
  K.hatL=el("g",{},H);K.blinkAt=1.5;K.cast=castShadow(root,parent,24,8,.22,12);return K}
/* рот: несколько вариантов на выбор; ниже носа, неяркий */
var MOUTH="D";
var MOUTHS={
  A:function(g,sm){Ln(g,sm?"M-16 43 Q0 56 16 43":"M-11 46 Q0 51 11 46","#C77A62",4.5)},
  B:function(g,sm){P(g,sm?"M-16 43 Q-8 41 0 42.5 Q8 41 16 43 Q9 56 0 56 Q-9 56 -16 43 Z":"M-12 46 Q-6 43 0 44.5 Q6 43 12 46 Q6 53 0 53 Q-6 53 -12 46 Z","#F9AB90");
    Ln(g,sm?"M-15 43.5 Q0 50 15 43.5":"M-11 46.5 Q0 49 11 46.5","#C77A62",2.5)},
  C:function(g,sm){P(g,sm?"M-16 43 Q-8 41 0 42.5 Q8 41 16 43 Q9 56 0 56 Q-9 56 -16 43 Z":"M-12 46 Q-6 43 0 44.5 Q6 43 12 46 Q6 53 0 53 Q-6 53 -12 46 Z","#FBC8BE");
    Ln(g,sm?"M-15 43.5 Q0 50 15 43.5":"M-11 46.5 Q0 49 11 46.5","#E6615C",2.5,.45)},
  D:mouth2};
function drawMouth(K,sm){while(K.mouth.firstChild)K.mouth.firstChild.remove();MOUTHS[K.mv](K.mouth,sm)}
function setArm(K,s){var A=K.arms[s],P=K.pose[s];A.up.setAttribute("transform","rotate("+f1(P.a)+")");A.fo.setAttribute("transform","translate(0 70) rotate("+f1(P.b)+")")}
function poseKid(K,t){var br=Math.sin(t*2.2)*.006;
  K.root.setAttribute("transform","translate("+f1(K.x)+" "+f1(K.gy)+") scale("+K.gs+")");
  K.body.setAttribute("transform","translate(0 "+f1(-K.hop)+") rotate("+f1(K.lean||0)+") scale("+(1+K.sq).toFixed(3)+" "+(1-K.sq+br).toFixed(3)+")");
  if(t>K.blinkAt){K.blinkT=t;K.blinkAt=t+rr(2,3.6)}var bt=t-(K.blinkT||-9),bk=bt<.18?1-Math.abs(bt-.09)/.09:0;
  var st=K.p.sleep?"sleep":"open",calm=K.p.happy&&!K.p.sleep;
  K.eyes.forEach(function(e,i){var c=K.eyeC[i];e.setAttribute("transform","translate("+c[0]+" "+c[1]+") scale(1 "+(1-bk*.9).toFixed(2)+") translate("+(-c[0])+" "+(-c[1])+")");e.setAttribute("opacity",st==="open"?1:0)});
  K.happy.forEach(function(h){h.setAttribute("opacity",st==="happy"?1:0)});K.sleep.forEach(function(h){h.setAttribute("opacity",st==="sleep"?1:0)});
  var y=K.p.yawn||0;K.yawn.setAttribute("opacity",y>.05?1:0);K.yawn.setAttribute("ry",f1(6+y*14));
  K.blow.setAttribute("opacity",K.p.blow?1:0);K.mouth.setAttribute("opacity",(y>.05||K.p.blow)?0:1);if(calm!==K.wasCalm){K.wasCalm=calm;drawMouth(K,calm)}K.smile.setAttribute("opacity",0);
  if(K.tails){var sw=Math.sin(t*3)*4+(K.p.swing||0);K.tailL.setAttribute("transform","rotate("+f1(sw)+" 109 212)");K.tailR.setAttribute("transform","rotate("+f1(-sw)+" 291 212)");K.bandL.setAttribute("transform","rotate("+f1(sw)+" 109 212)");K.bandR.setAttribute("transform","rotate("+f1(-sw)+" 291 212)")}
  K.head.setAttribute("transform","translate(0 -386) rotate("+f1(K.p.tilt||0)+")");
  setArm(K,-1);setArm(K,1);
  K.shadow.setAttribute("cx",f1(K.x));K.shadow.setAttribute("cy",f1(K.gy+4));var k=1-Math.min(.45,K.hop/260);K.shadow.setAttribute("rx",f1(80*K.gs*k));K.shadow.setAttribute("ry",f1(10*K.gs/1.3));
  K.root.setAttribute("opacity",K.op.toFixed(2));K.shadow.setAttribute("opacity",(.13*k*K.op).toFixed(3));
  if(K.cast){K.cast.on=!K.castOff;K.cast.sync()}}

/* ───────── одежда (вид спереди): основной цвет + тёмный цвет деталей, как в первой игре ───────── */
function P(g,d,c,w){return el("path",w?{d:d,fill:c,stroke:c,"stroke-width":w,"stroke-linejoin":"round","stroke-linecap":"round"}:{d:d,fill:c},g)}
function Ln(g,d,c,w,op){var a={d:d,stroke:c,"stroke-width":w,fill:"none","stroke-linecap":"round","stroke-linejoin":"round"};if(op!=null)a.opacity=op;return el("path",a,g)}
function flower(g,x,y,r){for(var i=0;i<5;i++){var a=i/5*Math.PI*2-Math.PI/2;el("circle",{cx:f1(x+Math.cos(a)*r*.62),cy:f1(y+Math.sin(a)*r*.62),r:f1(r*.5),fill:"#FFFFFF"},g)}el("circle",{cx:x,cy:y,r:f1(r*.36),fill:"#FF8725"},g)}
function sleeveShort(c,d){return function(g){el("rect",{x:-19,y:-17,width:38,height:53,rx:12,fill:c},g);Ln(g,"M-16 30 H16",d,7)}}
function sleeveLongUp(c,w,d,quilt){return function(g){Ln(g,"M0 -4 V72",c,w||33);if(quilt)[16,44].forEach(function(y){Ln(g,"M"+(-(w/2-5))+" "+y+" Q0 "+(y+5)+" "+(w/2-5)+" "+y,d,4,.45)})}}
function sleeveLongFo(c,cuff,w,quilt){return function(g){Ln(g,"M0 0 V50",c,(w||33)-3);if(quilt)Ln(g,"M"+(-(w/2-6))+" 22 Q0 27 "+(w/2-6)+" 22",cuff,4,.45);Ln(g,"M0 46 V54",cuff,(w||33)-1)}}
function trousers(c,d,light,bottom){return function(g){var b=bottom;
  P(g,"M-56 -200 H56 L53 "+(b+8)+" Q53 "+b+" 44 "+b+" H10 Q4 "+b+" 4 "+(b+8)+" L0 -146 L-4 "+(b+8)+" Q-4 "+b+" -10 "+b+" H-44 Q-53 "+b+" -53 "+(b+8)+" Z",c,6);
  Ln(g,"M-56 -194 H56",d,14);[-40,-14,14,40].forEach(function(x){Ln(g,"M"+x+" -201 V-188",light,4,.7)});
  Ln(g,"M0 -186 V-150",light,3,.7);Ln(g,"M-50 -180 Q-34 -160 -22 -184",light,3,.7);Ln(g,"M50 -180 Q34 -160 22 -184",light,3,.7);
  Ln(g,"M-31 -146 V"+(b-4),light,2.5,.35);Ln(g,"M31 -146 V"+(b-4),light,2.5,.35);
  Ln(g,"M-50 "+(b-6)+" H-8 M8 "+(b-6)+" H50",d,8)}}
function feltDots(g,x,y,w,h,seed0){var s0=seed0||3;for(var i=0;i<26;i++){s0=(s0*16807)%2147483647;var u=s0/2147483647;s0=(s0*16807)%2147483647;var v=s0/2147483647;
  el("circle",{cx:f1(x+u*w),cy:f1(y+v*h),r:f1(1.6+((i*7)%3)),fill:i%2?"#575757":"#E3E2E3",opacity:i%2?.28:.55},g)}}
/* обувь на полке — сбоку, парой: так её сразу узнаёшь */
function sidePair(draw){return function(g){var b=el("g",{transform:"translate(-30 -10)"},g);draw(b,true);el("g",{},b);var f=el("g",{transform:"translate(26 8)"},g);draw(f,false)}}
function bootSide(c,top,band,sole,felt,shine){return function(g,back){
  P(g,"M-34 "+top+" Q-34 "+(top-8)+" -26 "+(top-8)+" H14 Q22 "+(top-8)+" 22 "+top+" L24 -46 Q26 -34 46 -30 Q76 -24 76 -6 Q76 8 60 8 H-30 Q-38 8 -38 -2 Z",c);
  if(band)el("rect",{x:-36,y:top-10,width:60,height:14,rx:7,fill:band},g);
  if(sole)P(g,"M-38 -4 H76 Q76 8 60 8 H-30 Q-38 8 -38 -4 Z",sole);
  if(felt){feltDots(g,-28,top+4,46,-top-14,back?11:5);feltDots(g,22,-38,46,32,back?13:7)}
  if(shine)Ln(g,"M-22 "+(top+14)+" V-30","#FFFFFF",6,.55);
  if(back)P(g,"M-34 "+top+" Q-34 "+(top-8)+" -26 "+(top-8)+" H14 Q22 "+(top-8)+" 22 "+top+" L24 -46 Q26 -34 46 -30 Q76 -24 76 -6 Q76 8 60 8 H-30 Q-38 8 -38 -2 Z","#2C3A5C").setAttribute("opacity",.14)}}
var ITEMS={
  tshirt:{name:"футболка",layer:"top",body:function(g){
      P(g,"M-56 -300 Q-36 -308 -22 -306 Q0 -288 22 -306 Q36 -308 56 -300 L57 -178 Q57 -168 47 -168 H-47 Q-57 -168 -57 -178 Z","#FE88A8");
      Ln(g,"M-22 -304 Q0 -284 22 -304","#E6615C",7);Ln(g,"M-50 -176 H50","#E6615C",6,.6);flower(g,0,-236,22)},up:sleeveShort("#FE88A8","#E6615C")},
  shorts:{name:"шорты",layer:"legwear",body:function(g){
      P(g,"M-55 -202 H55 L60 -122 H10 L2 -150 H-2 L-10 -122 H-60 Z","#6B91D5",8);
      Ln(g,"M-55 -194 H55","#20477C",14);Ln(g,"M-4 -186 Q-16 -172 -11 -162","#FFFFFF",4);Ln(g,"M4 -186 Q16 -172 11 -162","#FFFFFF",4);
      Ln(g,"M-57 -128 H-14 M14 -128 H57","#20477C",7);Ln(g,"M-54 -178 Q-44 -150 -26 -180","#20477C",4,.6);Ln(g,"M54 -178 Q44 -150 26 -180","#20477C",4,.6)}},
  cap:{name:"кепка",head:function(g){P(g,"M-72 -24 Q-70 -94 0 -96 Q70 -94 72 -24 Z","#FF8725");
      Ln(g,"M0 -94 V-26 M-38 -84 Q-46 -54 -48 -26 M38 -84 Q46 -54 48 -26","#DF8615",4,.8);
      P(g,"M-70 -28 Q0 -48 70 -28 Q74 -8 52 -6 Q0 -18 -52 -6 Q-74 -8 -70 -28 Z","#DF8615");Ln(g,"M-56 -10 Q0 -22 56 -10","#FEC981",4,.6);
      el("circle",{cx:0,cy:-96,r:8,fill:"#DF8615"},g);el("circle",{cx:0,cy:-58,r:9,fill:"#FFFFFF"},g)}},
  sandals:{name:"сандалии",layer:"shoes",icon:sidePair(function(g,back){P(g,"M-40 -4 Q-40 -12 -30 -12 H62 Q76 -12 76 -2 Q76 6 64 6 H-30 Q-40 6 -40 -4 Z","#985037");
      Ln(g,"M-28 -12 Q-30 -44 -6 -48 Q14 -50 14 -14","#C77A62",9);Ln(g,"M24 -12 Q38 -36 56 -12","#C77A62",9);el("rect",{x:-34,y:-40,width:10,height:12,rx:3,fill:"#FFD326"},g);
      if(back)P(g,"M-40 -4 Q-40 -12 -30 -12 H62 Q76 -12 76 -2 Q76 6 64 6 H-30 Q-40 6 -40 -4 Z","#2C3A5C").setAttribute("opacity",.14)}),body:function(g){[-1,1].forEach(function(s){var x=s*25;
      el("ellipse",{cx:x,cy:-1,rx:26,ry:10,fill:"#985037"},g);el("ellipse",{cx:x,cy:-4,rx:22,ry:6,fill:"#C77A62"},g);
      Ln(g,"M"+(x-17)+" -12 Q"+x+" -21 "+(x+17)+" -12","#C77A62",8);Ln(g,"M"+(x-19)+" -24 Q"+x+" -32 "+(x+19)+" -24","#C77A62",7);
      el("rect",{x:x+(s>0?9:-17),y:-30,width:8,height:10,rx:2,fill:"#FFD326"},g)})}},
  puffer:{name:"пуховик",layer:"outer",body:function(g){
      P(g,"M-64 -300 Q0 -322 64 -300 Q72 -278 66 -256 Q74 -234 68 -212 Q76 -190 68 -168 Q72 -150 66 -134 H-66 Q-72 -150 -68 -168 Q-76 -190 -68 -212 Q-74 -234 -66 -256 Q-72 -278 -64 -300 Z","#F97A50");
      [-256,-212,-168].forEach(function(y){Ln(g,"M-66 "+y+" Q0 "+(y+10)+" 66 "+y,"#C3200E",4,.4);Ln(g,"M-50 "+(y-26)+" Q-30 "+(y-32)+" -14 "+(y-26)+" M14 "+(y-26)+" Q30 "+(y-32)+" 50 "+(y-26),"#FAB78E",5,.55)});
      el("rect",{x:-38,y:-334,width:76,height:40,rx:17,fill:"#F97A50"},g);Ln(g,"M-30 -312 H30","#C3200E",4,.4);
      Ln(g,"M0 -334 V-136","#575757",5);el("rect",{x:-6,y:-322,width:12,height:20,rx:4,fill:"#BEBFBF"},g);
      Ln(g,"M-50 -196 L-36 -160 M50 -196 L36 -160","#C3200E",6,.55)},
    up:sleeveLongUp("#F97A50",40,"#C3200E",true),fo:sleeveLongFo("#F97A50","#C3200E",40,true)},
  valenki:{name:"валенки",layer:"shoes",icon:sidePair(bootSide("#908B90",-118,"#BEBFBF",null,true,false)),body:function(g){[-1,1].forEach(function(s){var x=s*25;
      x=s*27;P(g,"M"+(x-29)+" -96 Q"+(x-30)+" -100 "+(x-24)+" -102 H"+(x+24)+" Q"+(x+30)+" -100 "+(x+29)+" -96 L"+(x+29)+" -30 Q"+(x+30)+" -14 "+(x+30)+" -6 Q"+(x+28)+" 4 "+(x+8)+" 4 H"+(x-8)+" Q"+(x-28)+" 4 "+(x-30)+" -6 Q"+(x-30)+" -14 "+(x-26)+" -30 Z","#908B90");
      el("rect",{x:x-28,y:-104,width:56,height:14,rx:7,fill:"#BEBFBF"},g);feltDots(g,x-22,-88,44,86,s>0?7:3);
      Ln(g,"M"+(x-18)+" -60 Q"+(x-22)+" -30 "+(x-16)+" -8","#E3E2E3",4,.5)})}},
  pajama:{name:"пижама",layer:"top",body:function(g){trousers("#ADC6FD","#6B91D5","#EAF1FF",-26)(g);
      P(g,"M-56 -300 Q-36 -308 -22 -306 Q0 -290 22 -306 Q36 -308 56 -300 L58 -160 Q58 -150 48 -150 H-48 Q-58 -150 -58 -160 Z","#ADC6FD");
      Ln(g,"M-22 -306 L0 -276 L22 -306","#6B91D5",8);Ln(g,"M0 -276 V-152","#6B91D5",3,.6);
      [-250,-215,-180].forEach(function(y){el("circle",{cx:0,cy:y,r:6,fill:"#6B91D5"},g)});
      [[-34,-250],[30,-200],[-28,-180],[34,-262],[-30,-110],[30,-70]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:6,fill:"#EAF1FF"},g)});Ln(g,"M-56 -158 H56","#6B91D5",8)},
    up:sleeveLongUp("#ADC6FD",34),fo:sleeveLongFo("#ADC6FD","#6B91D5",34)},
  slippers:{name:"тапочки",layer:"shoes",body:function(g){[-1,1].forEach(function(s){el("ellipse",{cx:s*26,cy:-8,rx:28,ry:15,fill:"#FEC981"},g);el("ellipse",{cx:s*26,cy:-1,rx:28,ry:7,fill:"#DF8615"},g);el("circle",{cx:s*26,cy:-16,r:8,fill:"#FE88A8"},g)})}},
  raincoat:{name:"дождевик",layer:"outer",body:function(g){
      P(g,"M-46 -334 Q0 -350 46 -334 L58 -300 H-58 Z","#DF8615");
      P(g,"M-58 -302 Q0 -316 58 -302 L74 -112 Q74 -100 62 -100 H-62 Q-74 -100 -74 -112 Z","#F97A50");
      Ln(g,"M0 -304 V-102","#C3200E",3,.5);
      [-262,-222,-182,-142].forEach(function(y){el("rect",{x:-12,y:y-5,width:24,height:10,rx:5,fill:"#FFD326"},g)});
      P(g,"M-56 -186 H-14 V-170 Q-35 -160 -56 -170 Z","#DF8615");P(g,"M14 -186 H56 V-170 Q35 -160 14 -170 Z","#DF8615");
      Ln(g,"M-68 -110 H68","#DF8615",8);Ln(g,"M-40 -290 Q-48 -230 -46 -180","#FFFFFF",6,.3)},
    up:sleeveLongUp("#F97A50",36),fo:sleeveLongFo("#F97A50","#DF8615",36)},
  jacket:{name:"куртка",layer:"outer",body:function(g){
      P(g,"M-50 -336 Q0 -352 50 -336 L60 -300 H-60 Z","#575757");
      P(g,"M-60 -304 Q0 -318 60 -304 L64 -158 Q64 -146 52 -146 H-52 Q-64 -146 -64 -158 Z","#908B90");
      Ln(g,"M0 -318 V-148","#575757",5);el("rect",{x:-5,y:-312,width:10,height:18,rx:3,fill:"#BEBFBF"},g);
      P(g,"M-52 -218 H-16 V-192 Q-34 -186 -52 -192 Z","#575757");P(g,"M16 -218 H52 V-192 Q34 -186 16 -192 Z","#575757");
      Ln(g,"M-58 -154 H58","#575757",9);Ln(g,"M-14 -312 V-286 M14 -312 V-286","#EAF1FF",4,.8)},
    up:sleeveLongUp("#908B90",36),fo:sleeveLongFo("#908B90","#575757",36)},
  jeans:{name:"брюки",layer:"legwear",body:trousers("#20477C","#20477C","#6B91D5",-14)},
  hat0:{head:function(g){P(g,"M-76 -6 Q-78 -98 0 -100 Q78 -98 76 -6 Z","#0044D3");el("rect",{x:-80,y:-26,width:160,height:28,rx:14,fill:"#20477C"},g);el("circle",{cx:0,cy:-104,r:21,fill:"#FFFFFF"},g)}},
  rainboots:{name:"резиновые сапоги",layer:"shoes",icon:sidePair(bootSide("#FFD326",-112,"#D2B205","#D2B205",false,true)),body:function(g){[-1,1].forEach(function(s){var x=s*25;
      x=s*27;P(g,"M"+(x-30)+" -90 H"+(x+30)+" L"+(x+30)+" -22 Q"+(x+34)+" -16 "+(x+34)+" -8 Q"+(x+34)+" 4 "+(x+16)+" 4 H"+(x-16)+" Q"+(x-34)+" 4 "+(x-34)+" -8 Q"+(x-34)+" -16 "+(x-30)+" -22 Z","#FFD326");
      el("rect",{x:x-32,y:-94,width:64,height:12,rx:6,fill:"#D2B205"},g);el("rect",{x:x-30,y:-6,width:60,height:10,rx:5,fill:"#D2B205"},g);
      Ln(g,"M"+(x-14)+" -74 V-30","#FFFFFF",6,.55)})}},
  umbrella:{name:"зонт",side:1,fit:1.4,pose:{a:-60,b:-130},icon:function(g){var h=el("g",{transform:"translate(99 -320) rotate(170)"},g);ITEMS.umbrella.hand(h,1)},hand:function(g,s){if(s!==1)return;
      Ln(g,"M0 30 V190","#575757",7);
      Ln(g,"M0 30 Q0 4 -16 4 Q-30 4 -30 18","#985037",9);
      P(g,"M-150 154 Q-150 270 0 280 Q150 270 150 154 Q125 138 100 154 Q75 138 50 154 Q25 138 0 154 Q-25 138 -50 154 Q-75 138 -100 154 Q-125 138 -150 154 Z","#0044D3");
      P(g,"M-50 154 Q-56 240 0 280 Q-20 230 -2 154 Q-25 138 -50 154 Z","#6B91D5");P(g,"M50 154 Q56 240 0 280 Q20 230 2 154 Q25 138 50 154 Z","#6B91D5");
      Ln(g,"M0 280 V296","#575757",7)}}
};
/* нарисовать вещь: в слои персонажа (K, g=null) или отдельной группой в позе покоя (g) */
function drawItem(it,K,g){
  var to=g?{body:g,head:el("g",{transform:"translate(0 -386)"},g)}:{body:it.layer?K.L[it.layer]:K.L.top,head:K.hatL};
  var nb=it.body?el("g",{},to.body):null,nh=it.head?el("g",{},to.head):null,sub=[];if(nb){it.body(nb);sub.push(nb)}if(nh){it.head(nh);sub.push(nh)}
  if(!g&&K&&nh){if(/очки/.test(it.name))K.gogG=nh;else if(K.gogG)K.hatL.appendChild(K.gogG)}
  if(!g&&K&&it.head&&K.hairHat&&!/банты|очки/.test(it.name)){K.hair.setAttribute("display","none");K.hairHat.removeAttribute("display")}
  [-1,1].forEach(function(s){if(!it.up&&!it.fo&&!it.hand)return;if(it.side&&it.side!==s)return;
    var P=it.pose&&(!it.side||it.side===s)?it.pose:{a:-s*10,b:0};
    var Ar=g?armChain(g,s,P.a,P.b,false):K.arms[s];
    if(it.up){var a=el("g",{},Ar.upL);it.up(a,s);sub.push(a)}if(it.fo){var b=el("g",{},Ar.foL);it.fo(b,s);sub.push(b)}if(it.hand){var c=el("g",{},Ar.hdL);it.hand(c,s);sub.push(c)}});
  sub.forEach(function(q){shadeAll(q)});
  if(!g&&K&&it.side)K.body.appendChild(K.arms[it.side].up.parentNode);
  if(!g&&K&&K.cast)K.cast.rebuild()}

/* ───────── зима и осень для раундов 3–4 ───────── */
function spruce(p,x,y,s,snow){var g=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},p);if(BGSH)groundOval(g,10,4,110);
  el("rect",{x:-10,y:-30,width:20,height:34,rx:4,fill:"#985037"},g);
  [[0,-30,90,90],[0,-100,72,80],[0,-160,52,70]].forEach(function(t){P(g,"M"+(-t[2])+" "+t[1]+" Q0 "+(t[1]+8)+" "+t[2]+" "+t[1]+" L0 "+(t[1]-t[3])+" Z","#248C43",10);
    if(snow)P(g,"M"+(-t[2]*.62)+" "+(t[1]-t[3]*.38)+" Q0 "+(t[1]-t[3]*.25)+" "+(t[2]*.62)+" "+(t[1]-t[3]*.38)+" L0 "+(t[1]-t[3]-4)+" Z","#FFFFFF",8)});
  return g}
function makeWinter(){var g=el("g",{},null),o={g:g};
  var sk=el("linearGradient",{id:"gWin",gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:700},DEFS);[["0","#ACB3C6"],[".6","#C6D2E4"],["1","#EAF1FF"]].forEach(function(s){el("stop",{offset:s[0],"stop-color":s[1]},sk)});
  el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"url(#gWin)"},g);
  o.cl=[cloud2(g,260,200,1.1,"#E3E2E3"),cloud2(g,900,150,.9,"#E3E2E3"),cloud2(g,1380,220,1,"#E3E2E3")];
  ground(g,"M-20 690 Q360 610 760 660 Q1140 700 1556 630 V1044 H-20 Z","#EAF1FF");
  [[120,760,1.15],[290,720,.8],[620,700,.7],[1000,705,.75],[1420,750,1.1]].forEach(function(t){spruce(g,t[0],t[1],t[2],true)});
  ground(g,"M-20 780 Q420 740 820 770 Q1200 800 1556 760 V1044 H-20 Z","#FFFFFF");
  /* снеговик — в него полетит снежок */
  var s=el("g",{transform:"translate(1110 850)"},g);o.snowman=s;el("ellipse",{cx:0,cy:8,rx:76,ry:10,fill:"#2C3A5C",opacity:.13},s);
  el("circle",{cx:0,cy:-50,r:62,fill:"#FFFFFF"},s);el("circle",{cx:14,cy:-40,r:46,fill:"#D6E7FC",opacity:.5},s);el("circle",{cx:0,cy:-142,r:44,fill:"#FFFFFF"},s);el("circle",{cx:10,cy:-134,r:32,fill:"#D6E7FC",opacity:.5},s);
  [-60,-36].forEach(function(y){el("circle",{cx:0,cy:y,r:6,fill:"#2C3A5C"},s)});
  Ln(s,"M-40 -150 L-92 -186 M-80 -178 L-90 -198 M40 -150 L92 -186 M80 -178 L94 -196","#985037",7);
  o.head=el("g",{transform:"translate(0 -210)"},s);el("circle",{cx:0,cy:0,r:32,fill:"#FFFFFF"},o.head);el("circle",{cx:-11,cy:-6,r:5,fill:"#2C3A5C"},o.head);el("circle",{cx:11,cy:-6,r:5,fill:"#2C3A5C"},o.head);
  P(o.head,"M0 4 L34 10 L0 14 Z","#FF8725",4);Ln(o.head,"M-12 16 Q0 22 12 16","#2C3A5C",4);
  P(o.head,"M-30 -22 H30 L26 -60 H-26 Z","#C3200E",6);el("rect",{x:-36,y:-26,width:72,height:10,rx:5,fill:"#B20003"},o.head);
  ground(g,"M-20 862 Q460 846 840 858 Q1230 870 1556 852 V1044 H-20 Z","#D2E2FE");Ln(g,"M-20 862 Q460 846 840 858 Q1230 870 1556 852","#ADC6FD",10);
  for(var i=0;i<16;i++)el("ellipse",{cx:f1(rr(0,1536)),cy:f1(rr(880,1000)),rx:f1(rr(8,16)),ry:f1(rr(3,5)),fill:"#FFFFFF",opacity:.8},g);
  el("path",{d:"M-20 1004 Q500 990 900 1000 Q1250 1008 1556 996 V1044 H-20 Z",fill:"#FFFFFF"},g);
  o.flakes=[];for(var i=0;i<60;i++)o.flakes.push({e:el("circle",{r:f1(rr(3,7)),fill:"#FFFFFF"},g),x:rr(0,1536),y:rr(-40,1024),v:rr(40,90),p:rr(0,6)});
  o.tick=function(t,dt){o.cl.forEach(function(c){c.x+=c.v*dt*.5;if(c.x>1750)c.x=-200;c.g.setAttribute("transform","translate("+f1(c.x)+" "+c.y+") scale("+c.s+")")});
    o.flakes.forEach(function(f){f.y+=f.v*dt;if(f.y>1040){f.y=-20;f.x=rr(0,1536)}f.e.setAttribute("cx",f1(f.x+Math.sin(t*.9+f.p)*18));f.e.setAttribute("cy",f1(f.y))})};
  return o}
var LEAF_C=["#FF8725","#FFD326","#DF8615","#C3200E","#F97A50"];
function leafD(r){return "M0 "+(-r)+" Q"+(r*.9)+" "+(-r*.3)+" 0 "+r+" Q"+(-r*.9)+" "+(-r*.3)+" 0 "+(-r)+" Z"}
function makeAutumn(){var g=el("g",{},null),o={g:g};
  var sk=el("linearGradient",{id:"gAut",gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:700},DEFS);[["0","#ADC6FD"],[".6","#D2E2FE"],["1","#FDE8C7"]].forEach(function(s){el("stop",{offset:s[0],"stop-color":s[1]},sk)});
  el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"url(#gAut)"},g);
  o.cl=[cloud2(g,300,190,1,"#E3E2E3"),cloud2(g,950,150,.9,"#FFFFFF"),cloud2(g,1420,210,1,"#E3E2E3")];
  ground(g,"M-20 690 Q360 610 760 660 Q1140 700 1556 630 V1044 H-20 Z","#BEC278");
  [[150,760,1.05,0],[520,740,.8,1],[1000,745,.85,2],[1400,755,1.05,3]].forEach(function(t){var tg=el("g",{transform:"translate("+t[0]+" "+t[1]+") scale("+t[2]+")"},g);
    el("path",{d:"M-16 0 Q-10 -80 -12 -160 H12 Q10 -80 16 0 Z",fill:"#985037"},tg);
    var cs=[["#FF8725","#FFD326"],["#FFD326","#FEC981"],["#DF8615","#FF8725"],["#F97A50","#FFD326"]][t[3]];
    [[0,-220,84,0],[-62,-176,62,0],[64,-174,64,0],[-30,-250,52,1],[36,-236,56,1],[0,-170,58,1]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:cs[c[3]]},tg)})});
  ground(g,"M-20 780 Q420 740 820 770 Q1200 800 1556 760 V1044 H-20 Z","#A2A24D");
  ground(g,"M-20 862 Q460 846 840 858 Q1230 870 1556 852 V1044 H-20 Z","#FDE8C7");Ln(g,"M-20 862 Q460 846 840 858 Q1230 870 1556 852","#FAB78E",10);
  for(var i=0;i<46;i++){var lx=rr(0,1536),ly=rr(800,1010);el("path",{d:leafD(rr(9,14)),fill:LEAF_C[i%5],transform:"translate("+f1(lx)+" "+f1(ly)+") rotate("+f1(rr(0,360))+") scale(1 .55)"},g)}
  /* куча листьев у ног мальчика */
  o.pile=el("g",{transform:"translate(768 948)"},g);el("ellipse",{cx:0,cy:6,rx:170,ry:14,fill:"#2C3A5C",opacity:.13},o.pile);
  for(var i=0;i<70;i++){var a=rr(0,Math.PI),r=rr(0,1),px=Math.cos(a)*160*r,py=-Math.sin(a)*46*r;el("path",{d:leafD(rr(10,15)),fill:LEAF_C[i%5],transform:"translate("+f1(px)+" "+f1(py)+") rotate("+f1(rr(0,360))+")"},o.pile)}
  el("path",{d:"M-20 1004 Q500 990 900 1000 Q1250 1008 1556 996 V1044 H-20 Z",fill:"#A2A24D"},g);
  o.fall=[];for(var i=0;i<10;i++)o.fall.push({e:el("path",{d:leafD(12),fill:LEAF_C[i%5]},g),x:rr(0,1536),y:rr(-40,900),v:rr(50,90),p:rr(0,6),r:rr(0,360)});
  o.tick=function(t,dt){o.cl.forEach(function(c){c.x+=c.v*dt*.5;if(c.x>1750)c.x=-200;c.g.setAttribute("transform","translate("+f1(c.x)+" "+c.y+") scale("+c.s+")")});
    o.fall.forEach(function(f){f.y+=f.v*dt;f.r+=60*dt;if(f.y>990){f.y=-20;f.x=rr(0,1536)}f.e.setAttribute("transform","translate("+f1(f.x+Math.sin(t*1.2+f.p)*40)+" "+f1(f.y)+") rotate("+f1(f.r)+") scale(1 "+(.4+.6*Math.abs(Math.sin(t*2+f.p))).toFixed(2)+")")})};
  return o}

/* ───────── вещи для зимы и осени ───────── */
ITEMS.warmpants={name:"тёплые штаны",layer:"legwear",body:trousers("#20477C","#20477C","#6B91D5",-14)};
ITEMS.hat={name:"шапка и варежки",at:[0,-386],head:ITEMS.hat0.head,
  hand:function(g,s){el("ellipse",{cx:0,cy:2,rx:18,ry:22,fill:"#0044D3"},g);el("ellipse",{cx:-s*13,cy:-6,rx:8,ry:12,fill:"#0044D3",transform:"rotate("+(s*25)+" "+(-s*13)+" -6)"},g);el("rect",{x:-18,y:-22,width:36,height:9,rx:4,fill:"#20477C"},g);Ln(g,"M-10 6 H10","#FFFFFF",4,.7)},
  icon:function(g){var h=el("g",{transform:"translate(0 0)"},g);ITEMS.hat0.head(h);[[-74,40,-1],[74,40,1]].forEach(function(m){var mg=el("g",{transform:"translate("+m[0]+" "+m[1]+") rotate("+(m[2]*12)+")"},g);
    el("ellipse",{cx:0,cy:6,rx:24,ry:30,fill:"#0044D3"},mg);el("ellipse",{cx:-m[2]*18,cy:-2,rx:10,ry:16,fill:"#0044D3",transform:"rotate("+(m[2]*25)+" "+(-m[2]*18)+" -2)"},mg);el("rect",{x:-24,y:-26,width:48,height:12,rx:5,fill:"#20477C"},mg);Ln(mg,"M-12 12 H12","#FFFFFF",5,.7)})}};
ITEMS.swimsuit={name:"купальник",layer:"top",body:function(g){P(g,"M-50 -266 Q-40 -300 -32 -304 L-24 -304 Q0 -276 24 -304 L32 -304 Q40 -300 50 -266 L54 -154 Q36 -146 18 -156 Q0 -142 -18 -156 Q-36 -146 -54 -154 Z","#FE88A8");
  [[-22,-236],[18,-210],[-8,-186]].forEach(function(c){flower(g,c[0],c[1],12)})}};
ITEMS.coat2={name:"куртка",layer:"outer",body:function(g){
    P(g,"M-50 -336 Q0 -352 50 -336 L60 -300 H-60 Z","#248C43");
    P(g,"M-60 -304 Q0 -318 60 -304 L64 -150 Q64 -138 52 -138 H-52 Q-64 -138 -64 -150 Z","#4D9E10");
    Ln(g,"M0 -318 V-140","#248C43",5);[-280,-240,-200,-160].forEach(function(y){el("circle",{cx:0,cy:y,r:6,fill:"#FEC981"},g)});
    P(g,"M-54 -210 H-16 V-180 Q-35 -174 -54 -180 Z","#248C43");P(g,"M16 -210 H54 V-180 Q35 -174 16 -180 Z","#248C43");Ln(g,"M-60 -146 H60","#248C43",9)},
  up:sleeveLongUp("#4D9E10",36),fo:sleeveLongFo("#4D9E10","#248C43",36)};
ITEMS.jeans2={name:"джинсы",layer:"legwear",body:trousers("#6B91D5","#20477C","#D6E7FC",-14)};
ITEMS.boots2={name:"ботинки",layer:"shoes",
  body:function(g){[-1,1].forEach(function(s){var x=s*27;P(g,"M"+(x-29)+" -44 H"+(x+29)+" L"+(x+30)+" -18 Q"+(x+34)+" -10 "+(x+34)+" -4 Q"+(x+34)+" 4 "+(x+16)+" 4 H"+(x-16)+" Q"+(x-34)+" 4 "+(x-34)+" -4 Q"+(x-34)+" -10 "+(x-30)+" -18 Z","#985037");
    el("rect",{x:x-34,y:-4,width:68,height:9,rx:4,fill:"#7A3E2C"},g);Ln(g,"M"+(x-10)+" -38 L"+(x+10)+" -30 M"+(x+10)+" -38 L"+(x-10)+" -30 M"+(x-10)+" -26 L"+(x+10)+" -18","#FEC981",3)})},
  icon:sidePair(function(g,back){P(g,"M-34 -64 Q-34 -72 -26 -72 H14 Q22 -72 22 -64 L24 -40 Q26 -30 46 -28 Q76 -22 76 -6 Q76 8 60 8 H-30 Q-38 8 -38 -2 Z","#985037");
    P(g,"M-38 -4 H76 Q76 8 60 8 H-30 Q-38 8 -38 -4 Z","#7A3E2C");Ln(g,"M-6 -60 L14 -54 M-6 -48 L16 -42 M-4 -36 L20 -32","#FEC981",3);
    if(back)P(g,"M-34 -64 Q-34 -72 -26 -72 H14 Q22 -72 22 -64 L24 -40 Q26 -30 46 -28 Q76 -22 76 -6 Q76 8 60 8 H-30 Q-38 8 -38 -2 Z","#2C3A5C").setAttribute("opacity",.14)})};
ITEMS.scarf={name:"шарф",layer:"scarf",body:function(g){P(g,"M-46 -322 Q0 -302 46 -322 Q50 -304 44 -292 Q0 -276 -44 -292 Q-50 -304 -46 -322 Z","#FC3529");
    P(g,"M18 -298 L40 -296 L46 -214 L22 -214 Z","#FC3529");Ln(g,"M-30 -300 Q0 -290 30 -300","#FFFFFF",5,.8);Ln(g,"M22 -262 H42 M23 -238 H44","#FFFFFF",5,.8);
    Ln(g,"M24 -212 V-200 M32 -212 V-198 M40 -212 V-200","#C3200E",4)}};
ITEMS.flipflops={name:"шлёпанцы",layer:"shoes",body:function(g){[-1,1].forEach(function(s){el("ellipse",{cx:s*25,cy:-2,rx:26,ry:10,fill:"#4D9E10"},g);Ln(g,"M"+(s*25-15)+" -10 L"+(s*25)+" -20 L"+(s*25+15)+" -10","#71CB0D",7)})},
  icon:sidePair(function(g,back){P(g,"M-40 -2 Q-40 -10 -30 -10 H62 Q76 -10 76 -1 Q76 6 64 6 H-30 Q-40 6 -40 -2 Z","#4D9E10");Ln(g,"M-6 -10 Q6 -40 30 -36 Q40 -24 44 -10","#71CB0D",9);
    if(back)P(g,"M-40 -2 Q-40 -10 -30 -10 H62 Q76 -10 76 -1 Q76 6 64 6 H-30 Q-40 6 -40 -2 Z","#2C3A5C").setAttribute("opacity",.14)})};
ITEMS.apron={name:"фартук",layer:"outer",body:function(g){Ln(g,"M-34 -300 Q0 -330 34 -300","#FC3529",6);
    P(g,"M-40 -290 H40 L44 -220 Q60 -210 60 -190 L56 -110 Q0 -100 -56 -110 L-60 -190 Q-60 -210 -44 -220 Z","#FC3529");
    [[-24,-266],[18,-250],[-6,-226],[30,-200],[-40,-180],[0,-170],[36,-150],[-24,-140],[12,-124],[-48,-124]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:5,fill:"#FFFFFF"},g)});
    P(g,"M-30 -190 H30 V-152 Q0 -144 -30 -152 Z","#C3200E");Ln(g,"M-50 -114 Q0 -104 50 -114","#FFFFFF",5)}};

/* мультики: снежок в снеговика, листья вверх */
function snowballCartoon(K,o,FXg,cb){var P1=K.pose[1],tmp={x:50,a:0,b:0};K.p.happy=true;
  /* замах назад-вверх */
  anim(.45,function(u){var e=eio(u);P1.a=lerp(-10,-150,e);P1.b=lerp(0,-40,e);K.p.tilt=-4*e},function(){play("snowball",.6);
    var hp=handPos({x:50,a:P1.a,b:P1.b}),x0=K.x+hp.x*K.gs,y0=K.gy+(hp.y-K.hop)*K.gs,x1=1110,y1=850-150,ball=el("circle",{r:16,fill:"#FFFFFF"},FXg);
    anim(.3,function(u){var e=eout(u);P1.a=lerp(-150,-40,e);P1.b=lerp(-40,10,e);K.p.tilt=lerp(-4,3,e)});
    anim(.62,function(u){ball.setAttribute("cx",f1(lerp(x0,x1,u)));ball.setAttribute("cy",f1(lerp(y0,y1,u)-Math.sin(Math.PI*u)*160))},function(){ball.remove();
      for(var i=0;i<12;i++){var a=rr(0,Math.PI*2),v=rr(120,300);splashes.push({e:el("circle",{r:f1(rr(5,10)),fill:"#FFFFFF"},FXg),x:x1,y:y1,gy:900,vx:Math.cos(a)*v,vy:Math.sin(a)*v-200})}
      anim(.9,function(u){o.head.setAttribute("transform","translate(0 -210) rotate("+f1(Math.sin(u*Math.PI*4)*10*(1-u))+")")});
      anim(.4,function(u){P1.a=lerp(-40,-10,eio(u));P1.b=lerp(10,0,eio(u));K.p.tilt=lerp(3,0,u)});
      later(.2,function(){anim(.5,function(u){K.hop=Math.sin(Math.PI*u)*40})});later(.7,cb)})})}
function leavesCartoon(K,o,FXg,cb){var L=K.pose[-1],R=K.pose[1];K.p.happy=true;
  /* присел, руки вниз в кучу — и подбросил листья вверх */
  anim(.4,function(u){var e=eio(u);K.sq=.05*e;L.a=lerp(10,30,e);R.a=lerp(-10,-30,e)},function(){play("leaves",.6);
    anim(.35,function(u){var e=eout(u);K.sq=.05*(1-e);K.hop=Math.sin(Math.PI*u)*30;L.a=lerp(30,150,e);R.a=lerp(-30,-150,e)});
    var lv=[];for(var i=0;i<34;i++){var a=rad(rr(-150,-30)),v=rr(500,900);lv.push({e:el("path",{d:leafD(rr(11,16)),fill:LEAF_C[i%5]},FXg),x:768+rr(-90,90),y:930,vx:Math.cos(a)*v*.5,vy:Math.sin(a)*v,r:rr(0,360),vr:rr(-300,300),p:rr(0,6)})}
    var t0=clock,live=function(t,dt){lv=lv.filter(function(l){l.vy+=600*dt;if(l.vy>70)l.vy=70;l.vx*=.98;l.x+=l.vx*dt+Math.sin(t*3+l.p)*30*dt;l.y+=l.vy*dt;l.r+=l.vr*dt;
        if(l.y>975&&l.vy>0){l.e.remove();return false}l.e.setAttribute("transform","translate("+f1(l.x)+" "+f1(l.y)+") rotate("+f1(l.r)+") scale(1 "+(.4+.6*Math.abs(Math.sin(t*3+l.p))).toFixed(2)+")");return true})};
    ticks.push(live);
    later(.5,function(){anim(.6,function(u){var e=eio(u);L.a=lerp(150,10,e);R.a=lerp(-150,-10,e)})});
    later(2.4,function(){ticks=ticks.filter(function(f){return f!==live});lv.forEach(function(l){l.e.remove()});cb()})})}

/* ═════════ ЗВЁЗДЫ 3–4: по случаю и для занятия ═════════ */
/* ── вещи ── */
function sneakFront(c,sole,lace){return function(g){[-1,1].forEach(function(s){var x=s*26;el("ellipse",{cx:x,cy:-9,rx:28,ry:15,fill:c},g);el("rect",{x:x-29,y:-6,width:58,height:9,rx:4,fill:sole},g);Ln(g,"M"+(x-9)+" -18 H"+(x+9)+" M"+(x-9)+" -12 H"+(x+9),lace,3)})}}
function sneakSide(c,sole,lace){return sidePair(function(g,back){P(g,"M-36 -30 Q-36 -42 -24 -42 H8 Q22 -40 34 -26 Q70 -22 76 -6 Q76 8 60 8 H-30 Q-38 8 -38 -2 Z",c);P(g,"M-38 -4 H76 Q76 8 60 8 H-30 Q-38 8 -38 -4 Z",sole);
  Ln(g,"M2 -36 L14 -28 M10 -40 L22 -30",lace,3);if(back)P(g,"M-36 -30 Q-36 -42 -24 -42 H8 Q22 -40 34 -26 Q70 -22 76 -6 Q76 8 60 8 H-30 Q-38 8 -38 -2 Z","#2C3A5C").setAttribute("opacity",.14)})}
function teeItem(c,d,extra){return {layer:"top",body:function(g){P(g,"M-56 -300 Q-36 -308 -22 -306 Q0 -288 22 -306 Q36 -308 56 -300 L57 -178 Q57 -168 47 -168 H-47 Q-57 -168 -57 -178 Z",c);
  Ln(g,"M-22 -304 Q0 -284 22 -304",d,7);Ln(g,"M-50 -176 H50",d,6,.6);if(extra)extra(g)},up:sleeveShort(c,d)}}
ITEMS.teeY=teeItem("#FFD326","#D2B205");ITEMS.teeY.name="футболка";
ITEMS.sportTee=teeItem("#FF8725","#DF8615",function(g){Ln(g,"M-52 -290 V-176 M52 -290 V-176","#FFFFFF",6)});ITEMS.sportTee.name="спортивная футболка";
ITEMS.sportPants={name:"спортивные штаны",layer:"legwear",body:function(g){trousers("#2D2E2C","#2D2E2C","#575757",-14)(g);Ln(g,"M-56 -184 L-53 -22 M54 -184 L51 -22","#FFFFFF",4);Ln(g,"M-47 -184 L-45 -22 M45 -184 L43 -22","#FFFFFF",4)}};
ITEMS.sneakers={name:"кроссовки",layer:"shoes",body:sneakFront("#FFFFFF","#6B91D5","#ADC6FD"),icon:sneakSide("#FFFFFF","#6B91D5","#ADC6FD")};
ITEMS.shirtFancy={name:"нарядная рубашка",layer:"top",body:function(g){P(g,"M-56 -300 Q-36 -308 -22 -306 L0 -282 L22 -306 Q36 -308 56 -300 L57 -170 H-57 Z","#D6E7FC");
    P(g,"M-24 -306 L0 -282 L-10 -270 Z","#FFFFFF");P(g,"M24 -306 L0 -282 L10 -270 Z","#FFFFFF");[-250,-220,-190].forEach(function(y){el("circle",{cx:0,cy:y,r:4,fill:"#6B91D5"},g)});
    P(g,"M0 -290 L-20 -302 L-20 -278 Z M0 -290 L20 -302 L20 -278 Z","#C3200E",4);el("circle",{cx:0,cy:-290,r:6,fill:"#C3200E"},g)},
  up:sleeveLongUp("#D6E7FC",32),fo:sleeveLongFo("#D6E7FC","#FFFFFF",32)};
ITEMS.shoes={name:"туфли",layer:"shoes",body:function(g){[-1,1].forEach(function(s){var x=s*25;el("rect",{x:x-11,y:0,width:22,height:13,rx:4,fill:"#B20003"},g);el("ellipse",{cx:x,cy:-8,rx:28,ry:16,fill:"#C3200E"},g);Ln(g,"M"+(x-17)+" -21 H"+(x+17),"#B20003",5);el("circle",{cx:x+s*11,cy:-21,r:4,fill:"#FFD326"},g);Ln(g,"M"+(x-15)+" -10 Q"+x+" -15 "+(x+13)+" -10","#FC3529",4,.6)})},
  icon:sidePair(function(g,back){var d="M-34 -24 Q-30 -36 -10 -34 Q30 -30 60 -20 Q76 -14 76 -4 Q76 4 62 4 H10 L4 -6 H-14 L-14 14 H-34 Z";P(g,d,"#C3200E");P(g,"M-34 -2 H-14 V14 H-34 Z","#B20003");P(g,"M4 -4 H76 Q76 4 62 4 H10 Z","#B20003");Ln(g,"M2 -36 Q8 -50 20 -44","#C3200E",5);el("circle",{cx:20,cy:-42,r:4,fill:"#FFD326"},g);
    if(back)P(g,d,"#2C3A5C").setAttribute("opacity",.14)})};
function pajamaItem(c,d,dot){return {name:"пижама",layer:"top",body:function(g){trousers(c,d,dot,-26)(g);
    P(g,"M-56 -300 Q-36 -308 -22 -306 Q0 -290 22 -306 Q36 -308 56 -300 L58 -160 Q58 -150 48 -150 H-48 Q-58 -150 -58 -160 Z",c);
    Ln(g,"M-22 -306 L0 -276 L22 -306",d,8);Ln(g,"M0 -276 V-152",d,3,.6);[-250,-215,-180].forEach(function(y){el("circle",{cx:0,cy:y,r:6,fill:d},g)});
    [[-34,-250],[30,-200],[-28,-180],[34,-262],[-30,-110],[30,-70]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:6,fill:dot},g)});Ln(g,"M-56 -158 H56",d,8)},
  up:sleeveLongUp(c,34),fo:sleeveLongFo(c,d,34)}}
ITEMS.pajamaG=pajamaItem("#FBC8BE","#FE88A8","#FFFFFF");
ITEMS.dress={name:"нарядное платье",layer:"top",body:function(g){P(g,"M-50 -300 Q-30 -306 -22 -306 Q0 -290 22 -306 Q30 -306 50 -300 L52 -214 H-52 Z","#BC91E6");
    P(g,"M-52 -218 H52 Q90 -150 96 -96 Q0 -80 -96 -96 Q-90 -150 -52 -218 Z","#BC91E6");Ln(g,"M-52 -216 H52","#86278D",12);P(g,"M0 -216 L-18 -230 L-18 -202 Z M0 -216 L18 -230 L18 -202 Z","#86278D");
    [-60,-20,20,60].forEach(function(x){Ln(g,"M"+(x*.5)+" -206 L"+x+" -96","#CCB4E6",4,.8)});Ln(g,"M-94 -98 Q0 -82 94 -98","#FFFFFF",6,.8);
    [[-30,-280,1],[26,-252,0],[-6,-232,1],[-56,-170,0],[-18,-186,1],[34,-176,0],[66,-140,1],[-74,-124,1],[-36,-128,0],[8,-150,0],[40,-114,1],[-4,-108,1]].forEach(function(q){
      if(q[2])P(g,"M"+q[0]+" "+(q[1]-9)+" Q"+(q[0]+1.5)+" "+(q[1]-1.5)+" "+(q[0]+9)+" "+q[1]+" Q"+(q[0]+1.5)+" "+(q[1]+1.5)+" "+q[0]+" "+(q[1]+9)+" Q"+(q[0]-1.5)+" "+(q[1]+1.5)+" "+(q[0]-9)+" "+q[1]+" Q"+(q[0]-1.5)+" "+(q[1]-1.5)+" "+q[0]+" "+(q[1]-9)+" Z",q[0]%3?"#FFFFFF":"#FFD326");
      else el("circle",{cx:q[0],cy:q[1],r:3.5,fill:"#FEFCAE"},g)})},
  up:function(g){P(g,"M-22 -12 Q-30 20 -16 34 H16 Q30 20 22 -12 Q0 -24 -22 -12 Z","#BC91E6");Ln(g,"M-16 32 H16","#FFFFFF",5,.8)}};
ITEMS.bows={name:"банты",at:[0,-424],head:function(g){[-66,66].forEach(function(x){var b=el("g",{transform:"translate("+x+" -38)"},g);P(b,"M0 0 L-30 -18 Q-36 0 -30 18 Z M0 0 L30 -18 Q36 0 30 18 Z","#FE88A8",6);el("circle",{r:9,fill:"#E6615C"},b)})},
  icon:function(g){[-60,60].forEach(function(x){var b=el("g",{transform:"translate("+x+" 0) scale(1.4)"},g);P(b,"M0 0 L-30 -18 Q-36 0 -30 18 Z M0 0 L30 -18 Q36 0 30 18 Z","#FE88A8",6);el("circle",{r:9,fill:"#E6615C"},b)})}};
ITEMS.tracksuit={name:"спортивный костюм",layer:"outer",body:function(g){trousers("#4D9E10","#248C43","#B6D58C",-14)(g);Ln(g,"M-54 -184 L-51 -22 M54 -184 L51 -22","#FFFFFF",5);
    P(g,"M-60 -304 Q0 -318 60 -304 L62 -164 Q62 -152 50 -152 H-50 Q-62 -152 -62 -164 Z","#4D9E10");Ln(g,"M0 -316 V-152","#248C43",5);Ln(g,"M-60 -158 H60","#248C43",9);el("rect",{x:-34,y:-326,width:68,height:28,rx:12,fill:"#4D9E10"},g)},
  up:function(g){Ln(g,"M0 -4 V72","#4D9E10",34);Ln(g,"M14 0 V70","#FFFFFF",4)},fo:sleeveLongFo("#4D9E10","#248C43",34)};
ITEMS.trunks={name:"плавки",layer:"legwear",body:function(g){P(g,"M-52 -198 H52 L58 -150 Q36 -142 16 -156 Q0 -144 -16 -156 Q-36 -142 -58 -150 Z","#0044D3",6);Ln(g,"M-52 -192 H52","#20477C",8);Ln(g,"M30 -186 V-160","#FFD326",5)},
  onWear:function(K){K.under.setAttribute("opacity",0)}};
ITEMS.swimcapB={name:"шапочка",head:function(g){P(g,"M-80 4 Q-86 -92 0 -94 Q86 -92 80 4 Q74 -32 40 -38 H-40 Q-74 -32 -80 4 Z","#FC3529");Ln(g,"M-50 -70 Q0 -84 50 -70","#FFFFFF",5,.6)},onWear:function(K){if(K.tails){K.tails.setAttribute("opacity",0);K.bands.setAttribute("opacity",0)}}};
ITEMS.goggles={name:"очки для плавания",head:function(g){Ln(g,"M-80 -44 Q0 -60 80 -44","#20477C",8);[-26,26].forEach(function(x){el("circle",{cx:x,cy:-50,r:18,fill:"#D6E7FC"},g);el("circle",{cx:x,cy:-50,r:18,fill:"none",stroke:"#FFD326","stroke-width":6},g)})}};
ITEMS.knitHat={name:"вязаная шапка",head:ITEMS.hat0.head};
function armbandDraw(g){el("rect",{x:-27,y:-18,width:54,height:38,rx:17,fill:"#FF8725"},g);Ln(g,"M-24 0 H24","#FFD326",7);el("ellipse",{cx:-12,cy:-9,rx:8,ry:4,fill:"#FFFFFF",opacity:.6},g)}
ITEMS.armbands={name:"нарукавники",at:[0,-250],up:function(g){var b=el("g",{transform:"translate(0 34)"},g);armbandDraw(b)},
  icon:function(g){[-1,1].forEach(function(s){var b=el("g",{transform:"translate("+(s*50)+" 0) scale(1.5)"},g);armbandDraw(b)})}};
/* занятия */
ITEMS.kerchief={name:"косынка",head:function(g){P(g,"M-80 -6 Q-82 -94 0 -96 Q82 -94 80 -6 Q40 -26 0 -28 Q-40 -26 -80 -6 Z","#FC3529");[[-40,-60],[0,-74],[40,-60],[-20,-40],[24,-40]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:6,fill:"#FFFFFF"},g)});
    P(g,"M66 -20 L96 -4 L80 14 Z","#FC3529")}};
ITEMS.helmet={name:"шлем",head:function(g){Ln(g,"M-73 2 Q-72 54 -14 80 H14 Q72 54 73 2","#2C3A5C",5);el("rect",{x:-9,y:75,width:18,height:10,rx:3,fill:"#575757"},g);P(g,"M-84 -6 Q-90 -108 0 -112 Q90 -108 84 -6 Q40 -22 0 -24 Q-40 -22 -84 -6 Z","#FF8725");
    Ln(g,"M-46 -90 Q-40 -60 -44 -30 M0 -108 V-40 M46 -90 Q40 -60 44 -30","#2C3A5C",9,.8);P(g,"M-70 -16 Q0 -36 70 -16 Q60 -4 0 -14 Q-60 -4 -70 -16 Z","#DF8615")}};
ITEMS.pads={name:"наколенники и налокотники",at:[0,-120],layer:"shoes",body:function(g){[-1,1].forEach(function(s){el("ellipse",{cx:s*24,cy:-96,rx:21,ry:18,fill:"#FF8725"},g);Ln(g,"M"+(s*24-14)+" -96 H"+(s*24+14),"#DF8615",4)})},
  fo:function(g){el("ellipse",{cx:0,cy:2,rx:17,ry:14,fill:"#FF8725"},g)},
  icon:function(g){[[-70,0],[-20,0],[30,0],[80,0]].forEach(function(q,i){el("ellipse",{cx:q[0],cy:q[1],rx:i<2?26:21,ry:i<2?30:24,fill:"#FF8725"},g);Ln(g,"M"+(q[0]-14)+" "+q[1]+" H"+(q[0]+14),"#DF8615",5)})}};
function gloveHand(g,s){P(g,"M-15 -14 H15 V10 Q15 24 0 24 Q-15 24 -15 10 Z","#4D9E10");[-10,-3.5,3,9.5].forEach(function(x){el("rect",{x:x-3.5,y:12,width:7,height:16,rx:3.5,fill:"#4D9E10"},g)});
  el("ellipse",{cx:-s*15,cy:2,rx:6,ry:11,fill:"#4D9E10",transform:"rotate("+(s*30)+" "+(-s*15)+" 2)"},g);el("rect",{x:-17,y:-24,width:34,height:12,rx:4,fill:"#FFD326"},g);Ln(g,"M-8 0 H8","#71CB0D",3,.7)}
ITEMS.gloves={name:"садовые перчатки",at:[0,-150],hand:gloveHand,icon:function(g){[-1,1].forEach(function(s){var h=el("g",{transform:"translate("+(s*48)+" 0) scale(2.4) rotate("+(s*-8)+")"},g);gloveHand(h,s)})}};
ITEMS.panama={name:"панама",head:function(g){P(g,"M-68 -30 Q-66 -96 0 -98 Q66 -96 68 -30 Z","#FEC981");P(g,"M-96 -22 Q0 -54 96 -22 Q100 -8 80 -6 Q0 -30 -80 -6 Q-100 -8 -96 -22 Z","#FEC981");Ln(g,"M-66 -36 Q0 -54 66 -36","#DF8615",6)}};
ITEMS.fShirt={name:"футболка с номером",layer:"outer",body:function(g){P(g,"M-58 -302 Q-36 -310 -22 -308 Q0 -290 22 -308 Q36 -310 58 -302 L59 -172 Q59 -162 49 -162 H-49 Q-59 -162 -59 -172 Z","#FC3529");
    Ln(g,"M-22 -306 Q0 -288 22 -306","#FFFFFF",8);P(g,"M-18 -264 H18 L-2 -196 H-16 L1 -250 H-18 Z","#FFFFFF")},up:function(g){el("rect",{x:-20,y:-10,width:40,height:46,rx:15,fill:"#FC3529"},g);Ln(g,"M-16 30 H16","#FFFFFF",7)}};
ITEMS.socks={name:"гетры",at:[0,-30],layer:"legwear",body:function(g){[-1,1].forEach(function(s){var x=s*22;el("rect",{x:x-17,y:-104,width:34,height:96,rx:12,fill:"#FFFFFF"},g);el("ellipse",{cx:s*25,cy:-8,rx:22,ry:13,fill:"#FFFFFF"},g);Ln(g,"M"+(x-15)+" -94 H"+(x+15)+" M"+(x-15)+" -80 H"+(x+15),"#FC3529",6)})},
  icon:function(g){[-1,1].forEach(function(s){var b=el("g",{transform:"translate("+(s*40)+" 0)"},g);P(b,"M-18 -100 H18 V30 Q18 46 34 48 L52 50 Q64 54 60 66 Q56 76 40 74 L4 72 Q-18 70 -18 44 Z","#FFFFFF");Ln(b,"M-18 -88 H18 M-18 -72 H18","#FC3529",7)})}};
ITEMS.cleats={name:"бутсы",layer:"shoes",body:function(g){[-1,1].forEach(function(s){var x=s*26;el("ellipse",{cx:x,cy:-9,rx:28,ry:15,fill:"#2C3A5C"},g);Ln(g,"M"+(x-14)+" -14 L"+(x+14)+" -4","#FFFFFF",4);[-16,0,16].forEach(function(d){el("rect",{x:x+d-3,y:2,width:6,height:6,rx:2,fill:"#BEBFBF"},g)})})},
  icon:sidePair(function(g,back){P(g,"M-36 -30 Q-36 -42 -24 -42 H8 Q22 -40 34 -26 Q70 -22 76 -6 Q76 4 60 4 H-30 Q-38 4 -38 -2 Z","#2C3A5C");Ln(g,"M-10 -30 L20 -12 M0 -36 L30 -18","#FFFFFF",4);[-24,0,24,50].forEach(function(x){el("rect",{x:x-4,y:4,width:8,height:8,rx:2,fill:"#BEBFBF"},g)});
    if(back)P(g,"M-36 -30 Q-36 -42 -24 -42 H8 Q22 -40 34 -26 Q70 -22 76 -6 Q76 4 60 4 H-30 Q-38 4 -38 -2 Z","#2C3A5C").setAttribute("opacity",.14)})};

/* ── фоны ── */
function room(wall,floor,floorLine){var g=el("g",{},null),o={g:g};el("rect",{x:-10,y:-10,width:1556,height:880,fill:wall},g);
  ground(g,"M-10 860 H1546 V1044 H-10 Z",floor);var fl="";[905,955,1005].forEach(function(y){fl+="M-10 "+y+" H1546 "});Ln(g,fl,floorLine,3,.55);o.tick=function(){};return o}
function windowW(g,x,y,w,h,sky){el("rect",{x:x,y:y,width:w,height:h,rx:22,fill:"#FFFFFF"},g);el("rect",{x:x+14,y:y+14,width:w-28,height:h-28,rx:14,fill:sky||"#ADC6FD"},g);Ln(g,"M"+(x+w/2)+" "+(y+14)+" V"+(y+h-14)+" M"+(x+14)+" "+(y+h/2)+" H"+(x+w-14),"#FFFFFF",10)}
function bgGym(){var o=room("#FDE8C7","#D3A598","#A17269"),g=o.g;windowW(g,560,170,420,260);
  /* шведская стенка */var sw=el("g",{transform:"translate(110 0)"},g);Ln(sw,"M0 260 V860 M220 260 V860","#C77A62",16);for(var y=300;y<860;y+=56)Ln(sw,"M0 "+y+" H220","#C77A62",10);
  /* маты и мячи */el("rect",{x:1120,y:780,width:330,height:80,rx:16,fill:"#6B91D5"},g);el("rect",{x:1120,y:780,width:330,height:20,rx:10,fill:"#9DBBFF"},g);
  [[1200,746,34,"#FF8725"],[1290,756,24,"#FC3529"],[1370,746,34,"#FFD326"]].forEach(function(b){el("circle",{cx:b[0],cy:b[1],r:b[2],fill:b[3]},g);Ln(g,"M"+(b[0]-b[2])+" "+b[1]+" H"+(b[0]+b[2]),"#FFFFFF",4,.7)});
  /* стойка с гантелями */el("rect",{x:1180,y:520,width:220,height:16,rx:6,fill:"#575757"},g);[1200,1380].forEach(function(x){el("rect",{x:x-6,y:520,width:12,height:150,fill:"#575757"},g)});
  [1230,1290,1350].forEach(function(x){Ln(g,"M"+(x-22)+" 508 H"+(x+22),"#908B90",8);el("rect",{x:x-30,y:494,width:12,height:28,rx:4,fill:"#2C3A5C"},g);el("rect",{x:x+18,y:494,width:12,height:28,rx:4,fill:"#2C3A5C"},g)});
  el("ellipse",{cx:768,cy:950,rx:300,ry:40,fill:"#C77A62",opacity:.35},g);return o}
function bgParty(){var o=room("#FBC8BE","#C77A62","#A17269"),g=o.g;windowW(g,140,180,320,300);
  /* гирлянда флажков */var fl=["#FFD326","#6B91D5","#FE88A8","#4D9E10","#FF8725"];Ln(g,"M0 150 Q768 260 1536 150","#FFFFFF",4);for(var i=0;i<16;i++){var x=60+i*96,y=150+Math.sin(i/15*Math.PI)*108;P(g,"M"+(x-22)+" "+(y-4)+" L"+(x+22)+" "+(y+2)+" L"+x+" "+(y+44)+" Z",fl[i%5])}
  o.balloons=[];[[1150,420,"#FC3529"],[1250,380,"#6B91D5"],[1350,430,"#FFD326"],[620,400,"#BC91E6"]].forEach(function(b,i){var bg2=el("g",{},g);Ln(bg2,"M0 50 Q-10 160 6 300","#FFFFFF",3);el("ellipse",{cx:0,cy:0,rx:46,ry:56,fill:b[2]},bg2);el("ellipse",{cx:-16,cy:-20,rx:10,ry:16,fill:"#FFFFFF",opacity:.5},bg2);o.balloons.push({g:bg2,x:b[0],y:b[1],p:i})});
  o.tick=function(t){o.balloons.forEach(function(b){b.g.setAttribute("transform","translate("+f1(b.x+Math.sin(t*.8+b.p)*8)+" "+f1(b.y+Math.sin(t*1.1+b.p)*10)+")")})};return o}
function bgPool2(){var g=el("g",{},null),o={g:g};var p=el("pattern",{id:"tile2",width:72,height:72,patternUnits:"userSpaceOnUse"},DEFS);el("rect",{width:72,height:72,fill:"#D6E7FC"},p);el("path",{d:"M0 0.5 H72 M0.5 0 V72",stroke:"#ADC6FD","stroke-width":3},p);
  el("rect",{x:-10,y:-10,width:1556,height:620,fill:"url(#tile2)"},g);[260,768,1276].forEach(function(x){windowW(g,x-150,170,300,190)});
  el("rect",{x:-10,y:560,width:1556,height:44,fill:"#FFFFFF"},g);el("rect",{x:-10,y:604,width:1556,height:236,fill:lgrad(["#B8E0E0","#9DBBFF","#6B91D6"])},g);
  o.sh=el("path",{d:"",stroke:"#EAF1FF","stroke-width":6,"stroke-linecap":"round",fill:"none",opacity:.6},g);
  [660,760].forEach(function(y){for(var x=10;x<1536;x+=34)el("circle",{cx:x,cy:y,r:11,fill:(Math.floor(x/34)%4<2)?"#FC3529":"#FFFFFF"},g)});
  var L=el("g",{transform:"translate(1340 520)"},g);[-40,40].forEach(function(x){Ln(L,"M"+x+" 140 V20 Q"+x+" -24 "+(x-30)+" -24","#BEBFBF",12)});[40,80,120].forEach(function(y){Ln(L,"M-40 "+(y+40)+" H40","#BEBFBF",9)});
  el("rect",{x:-10,y:836,width:1556,height:24,fill:"#FFFFFF"},g);ground(g,"M-10 860 H1546 V1044 H-10 Z","#EAF1FF");var fl="";for(var x=-10;x<1546;x+=96)fl+="M"+x+" 860 V1044 ";Ln(g,fl+"M-10 950 H1546","#D2E2FE",4);
  o.tick=function(t){var d="";for(var k=0;k<5;k++){var y=630+k*44,x0=((t*40+k*230)%1700)-160;d+="M"+f1(x0)+" "+y+" q30 -10 60 0 q30 10 60 0 "}o.sh.setAttribute("d",d)};return o}
function bgKitchen(){var o=room("#CBF0A4","#FDE6C4","#F8B888"),g=o.g;windowW(g,620,170,300,240);
  /* шкафчики, плита, полка с банками */el("rect",{x:60,y:160,width:420,height:220,rx:16,fill:"#FFFFFF"},g);Ln(g,"M270 172 V368","#E3E2E3",6);[200,340].forEach(function(x){el("rect",{x:x-30,y:300,width:60,height:10,rx:5,fill:"#C77A62"},g)});
  el("rect",{x:60,y:560,width:420,height:300,rx:16,fill:"#FFFFFF"},g);el("rect",{x:50,y:540,width:440,height:30,rx:10,fill:"#C77A62"},g);Ln(g,"M270 580 V850","#E3E2E3",6);
  el("rect",{x:1080,y:540,width:360,height:320,rx:16,fill:"#ACB3C6"},g);el("rect",{x:1100,y:620,width:320,height:200,rx:12,fill:"#2D2E2C"},g);[1150,1260,1370].forEach(function(x){el("circle",{cx:x,cy:556,r:24,fill:"#575757"},g)});
  P(g,"M1230 500 H1320 L1312 548 H1238 Z","#FC3529");Ln(g,"M1260 500 Q1275 480 1290 500","#FC3529",6);
  el("rect",{x:1080,y:300,width:360,height:14,rx:6,fill:"#C77A62"},g);[[1120,"#FFD326"],[1190,"#FF8725"],[1260,"#4D9E10"],[1330,"#FE88A8"]].forEach(function(j){el("rect",{x:j[0],y:236,width:46,height:64,rx:10,fill:j[1]},g);el("rect",{x:j[0]-2,y:228,width:50,height:14,rx:5,fill:"#C77A62"},g)});
  return o}
function bgGarden(){var o=makeStreet(1536,"park",[]),g=o.g;fence2(g,1536,770);
  /* грядки с морковкой */o.bed=el("g",{},g);[[200,880],[1300,880]].forEach(function(b){var bd=el("g",{transform:"translate("+b[0]+" "+b[1]+")"},g);ground(bd,"M-170 -20 Q0 -40 170 -20 L180 30 Q0 50 -180 30 Z","#985037");
    for(var x=-140;x<=140;x+=46){var lf=el("g",{transform:"translate("+x+" -18)"},bd);[[-10,-36],[0,-46],[10,-36]].forEach(function(q){Ln(lf,"M0 0 L"+q[0]+" "+q[1],"#4D9E10",6)});el("ellipse",{cx:0,cy:2,rx:10,ry:6,fill:"#FF8725"},lf)}});
  return o}
function bgField(){var o=makeStreet(1536,"park",[]),g=o.g;
  /* ворота с сеткой вдали */var gt=el("g",{transform:"translate(1180 830)"},g);o.net=el("g",{},gt);
  for(var x=-150;x<=150;x+=24)Ln(o.net,"M"+x+" -200 V0","#FFFFFF",2,.7);for(var y=-200;y<=0;y+=24)Ln(o.net,"M-150 "+y+" H150","#FFFFFF",2,.7);
  Ln(gt,"M-160 0 V-210 H160 V0","#FFFFFF",14);Ln(g,"M200 950 H1340 M768 860 V1000","#FFFFFF",6,.7);o.goal={x:1180,y:740};return o}
function bgBedroom(){return bedroom()}

/* ── мультики ── */
function cartGym(K,o,C,cb){/* поднимает гантели три раза */K.p.happy=false;var L=K.pose[-1],R=K.pose[1];
  var dbs=[-1,1].map(function(s){var d=el("g",{},K.arms[s].hdL);Ln(d,"M-24 4 H24","#908B90",8);el("rect",{x:-34,y:-12,width:14,height:32,rx:4,fill:"#2C3A5C"},d);el("rect",{x:20,y:-12,width:14,height:32,rx:4,fill:"#2C3A5C"},d);return d});
  play("clank",.6);var n=0;(function up(){if(n>=3){K.p.happy=true;later(.5,cb);return}n++;
    anim(.6,function(u){var e=eio(u);L.a=10;L.b=lerp(0,150,e);R.a=-10;R.b=lerp(0,-150,e)},function(){anim(.6,function(u){var e=eio(u);L.b=lerp(150,0,e);R.b=lerp(-150,0,e)},up)},n===1?0:0)})()}
function cartParty(K,o,C,cb){var t0=K.x;anim(.7,function(u){K.x=lerp(t0,850,eio(u));K.hop=Math.abs(Math.sin(u*Math.PI*2))*6},function(){K.hop=0;
  later(.3,function(){K.p.tilt=8;K.p.blow=true;play("blow",.5);anim(1.0,function(u){o.flames.forEach(function(f,i){var k=clamp((u-i*.15)/.5,0,1);f.setAttribute("ry",f1(13*(1-k)));f.setAttribute("opacity",(1-k).toFixed(2))})},function(){
    K.p.blow=false;K.p.tilt=0;K.p.happy=true;o.flames.forEach(function(f){var s=Ln(o.cake,"M"+f.getAttribute("cx")+" -156 q8 -16 0 -32 q-8 -16 0 -32","#BEBFBF",5,.7);anim(1.4,function(u){s.setAttribute("opacity",(.7*(1-u)).toFixed(2));s.setAttribute("transform","translate(0 "+f1(-u*30)+")")})});
    later(.9,cb)})})})}
function cartPool(K,o,C,cb){/* прыгает в бассейн и плывёт вбок: над водой голова, руки под водой, вокруг шеи круги */
  var front=el("g",{opacity:0},C.g);el("rect",{x:-10,y:752,width:1556,height:88,fill:"#6B91D6",opacity:.94},front);Ln(front,"M-10 754 H1546","#EAF1FF",5,.8);
  el("rect",{x:-10,y:836,width:1556,height:24,fill:"#FFFFFF"},front);el("rect",{x:-10,y:860,width:1556,height:190,fill:"#EAF1FF"},front);var fl="";for(var x=-10;x<1546;x+=96)fl+="M"+x+" 860 V1044 ";Ln(front,fl+"M-10 950 H1546","#D2E2FE",4);
  var ring=el("ellipse",{cx:K.x,cy:756,rx:58,ry:9,fill:"none",stroke:"#FFFFFF","stroke-width":5,opacity:0},front);
  play("splash1",.5);var y0=K.gy,x0=K.x;anim(.75,function(u){var e=eio(u);K.gy=lerp(y0,1040,e)-Math.sin(Math.PI*u)*230;K.gs=lerp(1.3,1.0,e);if(u>.55){front.setAttribute("opacity",1);K.castOff=true}},function(){
    splash(K.x,760,2.2);later(.08,function(){splash(K.x-90,770,1.3);splash(K.x+90,770,1.3)});K.pose[-1].a=35;K.pose[1].a=-35;K.p.happy=true;ring.setAttribute("opacity",.7);
    var t0=clock,lastR=0,live=function(){var a=clock-t0;K.gy=1040+Math.sin(a*4)*5;ring.setAttribute("cx",f1(K.x));
      if(a-lastR>.42&&a<3.6){lastR=a;var r=el("ellipse",{cx:K.x-40,cy:757,rx:30,ry:6,fill:"none",stroke:"#FFFFFF","stroke-width":4,opacity:.8},front);anim(1.1,function(u){r.setAttribute("rx",f1(30+u*70));r.setAttribute("ry",f1(6+u*8));r.setAttribute("opacity",(.8*(1-u)).toFixed(2))},function(){r.remove()})}};ticks.push(live);
    later(.5,function(){K.p.tilt=7;anim(3.4,function(u){var e=u<.2?(u/.2)*(u/.2)*.1:.1+(u-.2)/.8*.9;K.x=lerp(x0,1230,e)},function(){K.p.tilt=0;later(.7,function(){ticks=ticks.filter(function(f){return f!==live});cb()})})})})}

function cartSleep(K,o,C,cb){/* идёт к кровати, забирается под одеяло, засыпает, ночник гаснет */K.castOff=false;C.g.appendChild(o.blanket);C.g.appendChild(o.foot);var bx=1120,by=1060;
  later(.4,function(){
    var x0=K.x,y0=K.gy;anim(.75,function(u){var e=eio(u);K.x=lerp(x0,bx,e);K.gy=lerp(y0,by,e)-Math.sin(Math.PI*u)*70;K.gs=lerp(1.3,1.12,e);if(u>.45){K.root.parentNode.setAttribute("clip-path","url(#bedclip)");K.castOff=true}},function(){
      play("dress",.25);later(.5,function(){K.p.sleep=true});later(1.3,function(){play("click",.45);anim(.5,function(u){o.glow.setAttribute("opacity",(.25*(1-u)).toFixed(3));o.shade.setAttribute("fill",u>.3?"#D2B205":"#FFD326");o.night.setAttribute("opacity",(.28*u).toFixed(3))})});later(1.6,cb)})})}
function cartKitchen(K,o,C,cb){/* режет огурец на доске: левой рукой держит огурец, в правой нож */
  var tb=el("g",{},C.g);el("rect",{x:380,y:780,width:780,height:30,rx:10,fill:"#C77A62"},tb);el("rect",{x:400,y:810,width:740,height:240,fill:"#D3A598"},tb);Ln(tb,"M420 900 H1120","#C77A62",5,.6);
  el("rect",{x:578,y:764,width:380,height:18,rx:8,fill:"#E3B27A"},tb);el("circle",{cx:938,cy:773,r:5,fill:"#C77A62"},tb);
  var cuc=el("rect",{x:648,y:740,width:230,height:26,rx:13,fill:"#4D9E10"},tb),dots=el("g",{},tb);
  function drawDots(xr){dots.innerHTML="";for(var x=664;x<xr-10;x+=22)el("circle",{cx:x,cy:x%44?749:757,r:2.5,fill:"#B6D58C"},dots)}drawDots(878);
  var sl=el("g",{},tb);castShadow(tb,C.g,0,0,0,4);
  var L=K.pose[-1],R=K.pose[1],tl={x:-50,a:0,b:0},tr={x:50,a:0,b:0};
  var knife=el("g",{},K.arms[1].hdL);el("rect",{x:-6,y:-14,width:12,height:26,rx:5,fill:"#985037"},knife);P(knife,"M-5 12 H6 V58 Q6 66 -2 62 L-5 60 Z","#E3E2E3");Ln(knife,"M5 14 V58","#BEBFBF",3);knife.setAttribute("opacity",0);
  function bx(x){return (x-K.x)/K.gs}function by(y){return (y-K.gy)/K.gs}
  function setL(){armTo(tl,bx(678),by(750),-1);L.a=tl.a;L.b=tl.b}
  function setR(x,y){armTo(tr,x,y,-1);R.a=tr.a;R.b=tr.b;knife.setAttribute("transform","rotate("+f1(-(R.a+R.b))+")")}
  /* руки к доске */var la=L.a,lb=L.b,ra=R.a,rb=R.b;setL();var La=L.a,Lb=L.b;setR(bx(888),by(670));var Ra=R.a,Rb=R.b;
  anim(.5,function(u){var e=eio(u);L.a=lerp(la,La,e);L.b=lerp(lb,Lb,e);R.a=lerp(ra,Ra,e);R.b=lerp(rb,Rb,e);knife.setAttribute("opacity",Math.min(1,u*3).toFixed(2));knife.setAttribute("transform","rotate("+f1(-(R.a+R.b))+")")},function(){
    var xs=[850,826,802,778,754,730],i=0;
    (function chop(){if(i>=xs.length){K.p.happy=true;anim(.4,function(u){setR(bx(888),by(lerp(676,640,u)))});later(.7,cb);return}var x=xs[i++];
      anim(.14,function(u){setR(bx(lerp(x+20,x,u)),by(670))},function(){anim(.14,function(u){setR(bx(x),by(lerp(670,694,eio(u))))},function(){play("chop",.55);
        cuc.setAttribute("width",f1(x-648));drawDots(x);var c=el("g",{transform:"translate("+(893+i*7)+" "+(755-i*1.5)+")"},sl);el("ellipse",{rx:13,ry:11,fill:"#4D9E10"},c);el("ellipse",{rx:9.5,ry:8,fill:"#CBF0A4"},c);[[-3,-2],[3,-2],[0,3]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:1.6,fill:"#B6D58C"},c)});
        anim(.2,function(u){setR(bx(x),by(lerp(694,670,eio(u))))},chop)})})})()})}

function cartBike(K,o,C,cb){/* подходит к велосипеду слева, садится и уезжает через весь кадр направо, звенит звонок */
  var PX=o.bikeX,holder=el("g",{opacity:0},C.g),bo={};buildRider(holder,bo);bo.later();bo.x=PX;bo.wa=0;bo.ca=0;bo.ring=0;bo.tick=function(){};poseS4(bo,clock);
  var x0=K.x;anim(1.0,function(u){K.x=lerp(x0,PX+90,eio(u));K.hop=Math.abs(Math.sin(u*Math.PI*3))*7},function(){K.hop=0;
    anim(.4,function(u){var e=eio(u);holder.setAttribute("opacity",e.toFixed(2));K.op=1-e;o.parked.setAttribute("opacity",(1-e).toFixed(2))});
    var lastX=bo.x,live=function(t){var dx=bo.x-lastX;lastX=bo.x;bo.wa+=dx/(86*1.35);bo.ca+=dx/(86*1.35)*.55;poseS4(bo,t)};ticks.push(live);
    later(.7,function(){anim(4.0,function(u){var e=u<.25?u*u/.4375:(u-.125)/.875;bo.x=lerp(PX,1960,e)},function(){ticks=ticks.filter(function(f){return f!==live})});later(2.6,cb);
      later(1.6,function(){play("bell",.55);anim(.25,function(u){bo.ring=Math.sin(Math.PI*u)});anim(.25,function(u){bo.ring=Math.sin(Math.PI*u)},function(){bo.ring=0;bo.happy=true},.25)})})})}

function cartGarden(K,o,C,cb){/* подходит к высокой грядке, наклоняется, берёт ботву рукой и выдёргивает морковку — та остаётся в руке */
  var R=K.pose[1],tmp={x:50,a:0,b:0},KX=700,GX=KX+260,GY=761;K.body.appendChild(K.arms[1].up.parentNode);
  function carrot(p){var c=el("g",{},p);[[-9,-34],[0,-44],[9,-34],[-4,-40],[5,-40]].forEach(function(q){Ln(c,"M0 26 Q"+(q[0]*.4)+" 10 "+q[0]+" "+(q[1]+30),"#4D9E10",6)});P(c,"M-13 26 Q-14 30 -12 40 Q-4 96 0 108 Q4 96 12 40 Q14 30 13 26 Z","#FF8725");Ln(c,"M-8 50 H-2 M3 66 H9 M-6 82 H0","#DF8615",3);return c}
  var bed=el("g",{},C.g),grow=el("g",{transform:"translate("+GX+" "+GY+") scale(1.3)"},bed),car=carrot(grow);
  [[-150,0],[150,0]].forEach(function(d){var c=el("g",{transform:"translate("+(GX+d[0])+" "+GY+") scale(1.3)"},bed);carrot(c)});
  var bf=el("g",{},bed);el("rect",{x:GX-230,y:796,width:460,height:16,rx:6,fill:"#7A3E2C"},bf);el("rect",{x:GX-240,y:806,width:480,height:132,rx:10,fill:"#C77A62"},bf);Ln(bf,"M"+(GX-232)+" 850 H"+(GX+232)+" M"+(GX-232)+" 894 H"+(GX+232),"#985037",5);
  [GX-226,GX+226].forEach(function(x){el("rect",{x:x-12,y:800,width:24,height:140,rx:6,fill:"#985037"},bf)});castShadow(bed,C.g,0,0,0,4);
  var x0=K.x,L0=10;anim(.8,function(u){K.x=lerp(x0,KX,eio(u));K.hop=Math.abs(Math.sin(u*Math.PI*2))*6},function(){K.hop=0;
    /* наклон: всё тело к грядке, рука к ботве (цель пересчитана в координаты наклонённого тела) */
    function reach(px,py,lean,sq){var th=rad(lean),c=Math.cos(th),s=Math.sin(th);return {x:(px*c+py*s)/(1+sq),y:(-px*s+py*c)/(1-sq)}}
    anim(.6,function(u){var e=eio(u),lean=20*e,sq=.05*e;K.lean=lean;K.sq=sq;var q=reach(lerp(70,200,e),lerp(-150,-130,e),lean,sq);armTo(tmp,q.x,q.y,1);R.a=tmp.a;R.b=tmp.b},function(){
      /* морковка переходит в руку: ботва в кулаке, корень висит вниз */
      car.remove();var hdL=K.arms[1].hdL,inH=el("g",{},null);hdL.insertBefore(inH,hdL.firstChild);var hc=carrot(inH);hc.setAttribute("transform","translate(0 -20)");
      var keep=function(){inH.setAttribute("transform","rotate("+f1(-(R.a+R.b+(K.lean||0)))+")")};keep();ticks.push(keep);
      play("pop",.6);later(.15,function(){anim(.7,function(u){var e=eout(u),lean=20*(1-e),sq=.05*(1-e);K.lean=lean;K.sq=sq;var q=reach(lerp(200,120,e),lerp(-130,-380,e),lean,sq);armTo(tmp,q.x,q.y,1);R.a=tmp.a;R.b=tmp.b},function(){
        K.lean=0;K.p.happy=true;later(.6,function(){ticks=ticks.filter(function(f){return f!==keep});cb()})})})})})}

function cartFootball(K,o,C,cb){/* бьёт по мячу — мяч летит в ворота, сетка прогибается */var ball=el("g",{},C.g),bi=el("g",{transform:"scale(1.65)"},ball);el("circle",{r:28,fill:"#FFFFFF"},bi);P(bi,"M0 -10 L10 -2 L6 10 H-6 L-10 -2 Z","#2C3A5C");
  var bx=880,by=888;ball.setAttribute("transform","translate("+bx+" "+by+")");anim(.5,function(u){K.x=lerp(768,700,eio(u))},function(){
    anim(.25,function(u){K.hop=Math.sin(Math.PI*u)*20;K.p.tilt=-6*Math.sin(Math.PI*u)},null);play("kick",.6);
    later(.1,function(){anim(.75,function(u){var x=lerp(bx,o.goal.x,u),y=lerp(by,o.goal.y,u)-Math.sin(Math.PI*u)*180,s=lerp(1,.75,u);ball.setAttribute("transform","translate("+f1(x)+" "+f1(y)+") scale("+s.toFixed(3)+") rotate("+f1(u*540)+")")},function(){
      anim(.6,function(u){o.net.setAttribute("transform","translate(0 "+f1(-Math.sin(Math.PI*u)*0)+") scale(1 "+(1+Math.sin(Math.PI*u)*.06).toFixed(3)+")")});
      K.p.happy=true;anim(.6,function(u){var s=Math.sin(Math.PI*u);K.hop=s*40;K.pose[-1].a=lerp(10,150,s);K.pose[1].a=lerp(-10,-150,s)});later(.9,cb)})})})}
ITEMS.gardenBoots={name:"резиновые сапоги",layer:"shoes",body:function(g){[-1,1].forEach(function(s){var x=s*27;P(g,"M"+(x-29)+" -54 H"+(x+29)+" L"+(x+30)+" -22 Q"+(x+34)+" -16 "+(x+34)+" -8 Q"+(x+34)+" 4 "+(x+16)+" 4 H"+(x-16)+" Q"+(x-34)+" 4 "+(x-34)+" -8 Q"+(x-34)+" -16 "+(x-30)+" -22 Z","#4D9E10");
    el("rect",{x:x-31,y:-58,width:62,height:10,rx:5,fill:"#248C43"},g);el("rect",{x:x-34,y:-6,width:68,height:10,rx:5,fill:"#248C43"},g);Ln(g,"M"+(x-14)+" -44 V-24","#FFFFFF",5,.5)})},
  icon:sidePair(bootSide("#4D9E10",-64,"#248C43","#248C43",false,true))};
ITEMS.pajamaTopG={name:"пижамная кофта",layer:"top",body:function(g){P(g,"M-56 -300 Q-36 -308 -22 -306 Q0 -290 22 -306 Q36 -308 56 -300 L58 -160 Q58 -150 48 -150 H-48 Q-58 -150 -58 -160 Z","#FBC8BE");
    Ln(g,"M-22 -306 L0 -276 L22 -306","#FE88A8",8);Ln(g,"M0 -276 V-152","#FE88A8",3,.6);[-250,-215,-180].forEach(function(y){el("circle",{cx:0,cy:y,r:6,fill:"#FE88A8"},g)});
    [[-34,-250],[30,-200],[-28,-180],[34,-262]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:6,fill:"#FFFFFF"},g)});Ln(g,"M-56 -158 H56","#FE88A8",8)},
  up:sleeveLongUp("#FBC8BE",34),fo:sleeveLongFo("#FBC8BE","#FE88A8",34)};
ITEMS.pajamaPantsG={name:"пижамные штаны",layer:"legwear",body:function(g){trousers("#FBC8BE","#FE88A8","#FFFFFF",-26)(g);[[-30,-110],[30,-70],[-34,-60],[28,-130]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:6,fill:"#FFFFFF"},g)});
    [-1,1].forEach(function(s){el("rect",{x:s*24-20,y:-40,width:40,height:14,rx:7,fill:"#FE88A8"},g)})}};
var CARTOONS={gym:cartGym,party:cartParty,pool:cartPool,sleep:cartSleep,kitchen:cartKitchen,bike:cartBike,garden:cartGarden,football:cartFootball};
var STAR3=[
 {kind:"boy",bg:"gym",ctx:"Мы идём в спортзал.",task:"Одень мальчика.",ok:["sportTee","sportPants","sneakers"],no:["shirtFancy","shoes","pajama"],cartoon:"gym"},
 {kind:"girl",bg:"party",ctx:"Мы идём на праздник.",task:"Одень девочку.",ok:["dress","shoes","bows"],no:["tracksuit","rainboots","scarf"],cartoon:"party"},
 {kind:"boy",bg:"pool",ctx:"Мы идём в бассейн.",task:"Одень мальчика.",noShirt:true,ok:["trunks","swimcapB","goggles","armbands"],no:["puffer","jeans"],cartoon:"pool"},
 {kind:"girl",bg:"bedroom",ctx:"Пора спать.",task:"Одень девочку.",ok:["pajamaTopG","pajamaPantsG"],no:["jacket","sandals"],cartoon:"sleep"}];
var STAR4=[
 {kind:"girl",bg:"kitchen",base:["tshirt","shorts","slippers"],ctx:"Будем готовить.",task:"Одень девочку.",ok:["apron","kerchief"],no:["helmet","rainboots"],cartoon:"kitchen"},
 {kind:"boy",bg:"bike",base:["teeY","shorts"],ctx:"Будем кататься на велосипеде.",task:"Одень мальчика.",ok:["helmet","pads","sneakers"],no:["valenki","knitHat","scarf"],cartoon:"bike"},
 {kind:"girl",bg:"garden",base:["tshirt","shorts"],ctx:"Будем работать в огороде.",task:"Одень девочку.",ok:["gardenBoots","gloves","panama"],no:["shoes","goggles","swimsuit"],cartoon:"garden"},
 {kind:"boy",bg:"field",base:["shorts"],ctx:"Будем играть в футбол.",task:"Одень мальчика.",ok:["fShirt","socks","cleats"],no:["pajama","umbrella","swimcapB"],cartoon:"football"}];

/* ═════════ подробные фоны для звёзд 3–4 ═════════ */
function planks(g,y0,y1,c1,c2){ground(g,"M-10 "+y0+" H1546 V"+y1+" H-10 Z",c1);var d="";for(var y=y0+34;y<y1;y+=34){d+="M-10 "+y+" H1546 ";}
  for(var y=y0,r=0;y<y1;y+=34,r++)for(var x=(r%2)*90-40;x<1546;x+=180)d+="M"+x+" "+y+" V"+(y+34)+" ";Ln(g,d,c2,3,.55)}
function frameW(g,x,y,w,h,sky,cur){if(cur){P(g,"M"+(x-36)+" "+(y-14)+" Q"+(x-6)+" "+(y+h*.5)+" "+(x-6)+" "+(y+h+20)+" L"+(x-50)+" "+(y+h+20)+" Q"+(x-60)+" "+(y+h*.5)+" "+(x-80)+" "+(y-14)+" Z",cur);
    P(g,"M"+(x+w+36)+" "+(y-14)+" Q"+(x+w+6)+" "+(y+h*.5)+" "+(x+w+6)+" "+(y+h+20)+" L"+(x+w+50)+" "+(y+h+20)+" Q"+(x+w+60)+" "+(y+h*.5)+" "+(x+w+80)+" "+(y-14)+" Z",cur)}
  windowW(g,x,y,w,h,sky);el("rect",{x:x-24,y:y+h-6,width:w+48,height:18,rx:6,fill:"#FFFFFF"},g)}
function pot(g,x,y,s){var p=el("g",{transform:"translate("+x+" "+y+") scale("+s+")"},g);P(p,"M-26 0 H26 L20 40 H-20 Z","#C77A62");[[-14,-30,18],[12,-36,20],[0,-50,18]].forEach(function(c){el("circle",{cx:c[0],cy:c[1],r:c[2],fill:"#4D9E10"},p)});el("circle",{cx:-6,cy:-54,r:7,fill:"#71CB0D"},p)}

/* спортзал: паркет с разметкой, шведская стенка, кольцо, канат, скамейка, маты, мячи */
function bgGym(){var g=el("g",{},null),o={g:g,tick:function(){}};
  el("rect",{x:-10,y:-10,width:1556,height:600,fill:"#FDE8C7"},g);el("rect",{x:-10,y:560,width:1556,height:270,fill:"#D3A598"},g);
  var pl="";for(var x=40;x<1536;x+=120)pl+="M"+x+" 572 V820 ";Ln(g,pl,"#C77A62",4,.5);el("rect",{x:-10,y:552,width:1556,height:16,fill:"#C77A62"},g);
  [[180,110],[620,110],[1060,110]].forEach(function(w){windowW(g,w[0],w[1],320,170,"#ADC6FD");Ln(g,"M"+(w[0]+80)+" "+(w[1]+14)+" V"+(w[1]+156)+" M"+(w[0]+240)+" "+(w[1]+14)+" V"+(w[1]+156),"#FFFFFF",6)});
  /* шведская стенка */var sw=el("g",{transform:"translate(70 0)"},g);Ln(sw,"M0 330 V830 M200 330 V830","#C77A62",18);for(var y=372;y<820;y+=50)Ln(sw,"M0 "+y+" H200","#D3A598",11);
  /* канат */P(g,"M452 -10 H468 V640 Q460 660 452 640 Z","#C77A62");var tw="";for(var y=10;y<630;y+=24)tw+="M452 "+y+" L468 "+(y+12)+" ";Ln(g,tw,"#985037",3,.6);
  /* баскетбольное кольцо */var hp=el("g",{transform:"translate(1190 0)"},g);el("rect",{x:-10,y:360,width:20,height:470,fill:"#575757"},hp);el("rect",{x:-110,y:300,width:220,height:150,rx:10,fill:"#FFFFFF"},hp);
  el("rect",{x:-46,y:370,width:92,height:64,fill:"none",stroke:"#FC3529","stroke-width":6},hp);el("ellipse",{cx:0,cy:458,rx:50,ry:10,fill:"none",stroke:"#FF8725","stroke-width":8},hp);
  Ln(hp,"M-48 460 L-30 520 M-24 466 L-14 524 M0 468 V526 M24 466 L14 524 M48 460 L30 520 M-36 494 H36","#FFFFFF",3,.9);
  /* пол-паркет с разметкой */planks(g,820,1044,"#D3A598","#A17269");Ln(g,"M-10 900 H1546","#FFFFFF",6,.8);P(g,"M600 900 Q768 960 936 900","#FC3529",0).setAttribute("fill","none");Ln(g,"M560 900 Q768 990 976 900","#FC3529",6,.8);
  /* скамейка вдоль стены */el("rect",{x:540,y:770,width:420,height:22,rx:8,fill:"#C77A62"},g);[570,930].forEach(function(x){el("rect",{x:x-8,y:792,width:16,height:40,rx:4,fill:"#985037"},g)});
  /* маты */el("rect",{x:1280,y:740,width:250,height:50,rx:12,fill:"#6B91D5"},g);el("rect",{x:1270,y:786,width:270,height:50,rx:12,fill:"#0044D3"},g);
  /* корзина с мячами */var bc=el("g",{transform:"translate(330 800)"},g);el("rect",{x:-80,y:-70,width:160,height:90,rx:10,fill:"#908B90"},bc);
  [[-46,-80,30,"#FF8725"],[0,-92,32,"#FC3529"],[44,-80,30,"#FFD326"],[-20,-60,28,"#6B91D5"],[26,-62,28,"#4D9E10"]].forEach(function(b){el("circle",{cx:b[0],cy:b[1],r:b[2],fill:b[3]},bc);Ln(bc,"M"+(b[0]-b[2]+4)+" "+b[1]+" Q"+b[0]+" "+(b[1]+8)+" "+(b[0]+b[2]-4)+" "+b[1],"#FFFFFF",3,.6)});
  var mesh="";for(var x=-70;x<80;x+=20)mesh+="M"+x+" -60 V14 ";Ln(bc,mesh,"#575757",3,.6);[-60,60].forEach(function(x){el("circle",{cx:x,cy:22,r:9,fill:"#2D2E2C"},bc)});
  /* конусы */[[1080,880],[1160,900],[1240,880]].forEach(function(c){P(g,"M"+(c[0]-20)+" "+c[1]+" L"+c[0]+" "+(c[1]-50)+" L"+(c[0]+20)+" "+c[1]+" Z","#FF8725");Ln(g,"M"+(c[0]-12)+" "+(c[1]-20)+" H"+(c[0]+12),"#FFFFFF",5)});
  el("circle",{cx:1420,cy:880,r:34,fill:"#FF8725"},g);Ln(g,"M1386 880 H1454 M1420 846 V914","#985037",3,.7);
  return o}

/* праздник: стол с угощениями и тортом, подарки, шары, гирлянда, конфетти */
function bgParty(){var g=el("g",{},null),o={g:g};
  el("rect",{x:-10,y:-10,width:1556,height:880,fill:"#FBC8BE"},g);var st="";for(var x=0;x<1546;x+=64)st+="M"+x+" 0 V860 ";Ln(g,st,"#FDD1DD",22,.6);
  frameW(g,200,200,300,260,"#ADC6FD","#BC91E6");
  el("rect",{x:640,y:250,width:200,height:150,rx:12,fill:"#C77A62"},g);el("rect",{x:656,y:266,width:168,height:118,rx:6,fill:"#D6E7FC"},g);P(g,"M670 370 L720 310 L760 350 L790 320 L812 370 Z","#4D9E10");el("circle",{cx:790,cy:296,r:14,fill:"#FFD326"},g);
  var fl=["#FFD326","#6B91D5","#FE88A8","#4D9E10","#FF8725"];Ln(g,"M0 120 Q768 230 1536 120","#FFFFFF",4);for(var i=0;i<16;i++){var x=60+i*96,tq=x/1536,y=120+220*tq*(1-tq);P(g,"M"+(x-22)+" "+(y-4)+" L"+(x+22)+" "+(y+2)+" L"+x+" "+(y+44)+" Z",fl[i%5])}
  o.balloons=[];[[90,420,"#FC3529"],[170,380,"#6B91D5"],[1460,360,"#FFD326"],[1390,410,"#BC91E6"],[1470,470,"#4D9E10"]].forEach(function(b,i){var bg2=el("g",{},g);Ln(bg2,"M0 50 Q-10 160 6 330","#FFFFFF",3);el("ellipse",{cx:0,cy:0,rx:46,ry:56,fill:b[2]},bg2);el("ellipse",{cx:-16,cy:-20,rx:10,ry:16,fill:"#FFFFFF",opacity:.5},bg2);P(bg2,"M-6 54 H6 L0 46 Z",b[2]);o.balloons.push({g:bg2,x:b[0],y:b[1],p:i})});
  planks(g,860,1044,"#C77A62","#A17269");
  /* стол справа с угощениями и тортом */var tb=el("g",{},g);el("rect",{x:900,y:640,width:520,height:30,rx:8,fill:"#FFFFFF"},tb);P(tb,"M900 666 H1420 V760 Q1395 780 1370 760 Q1345 780 1320 760 Q1295 780 1270 760 Q1245 780 1220 760 Q1195 780 1170 760 Q1145 780 1120 760 Q1095 780 1070 760 Q1045 780 1020 760 Q995 780 970 760 Q945 780 920 760 Q910 770 900 760 Z","#FE88A8");
  [940,1380].forEach(function(x){el("rect",{x:x-10,y:760,width:20,height:110,rx:6,fill:"#985037"},tb)});
  /* торт */var cake=el("g",{transform:"translate(1010 640)"},tb);el("ellipse",{cx:0,cy:-2,rx:110,ry:14,fill:"#E3E2E3"},cake);P(cake,"M-90 -2 V-90 Q0 -104 90 -90 V-2 Z","#FDE8C7");
  P(cake,"M-90 -90 Q0 -104 90 -90 Q80 -66 60 -74 Q40 -60 20 -74 Q0 -60 -20 -74 Q-40 -60 -60 -74 Q-80 -66 -90 -90 Z","#FE88A8");Ln(cake,"M-90 -40 Q0 -30 90 -40","#FE88A8",8);
  [[-40,-56],[30,-50],[0,-20],[-60,-24],[60,-26]].forEach(function(q){el("circle",{cx:q[0],cy:q[1],r:6,fill:["#FC3529","#FFD326","#4D9E10"][Math.abs(q[0])%3]},cake)});
  o.flames=[];[-45,0,45].forEach(function(x,i){el("rect",{x:x-6,y:-140,width:12,height:46,rx:4,fill:["#6B91D5","#FFD326","#4D9E10"][i]},cake);o.flames.push(el("ellipse",{cx:x,cy:-152,rx:8,ry:13,fill:"#FF8725"},cake))});o.cake=cake;
  /* угощения: тарелки с печеньем, фрукты, стаканы, кувшин */[1150,1250].forEach(function(x){el("ellipse",{cx:x,cy:636,rx:46,ry:10,fill:"#FFFFFF"},tb);[[-18,"#DF8615"],[0,"#C77A62"],[18,"#DF8615"]].forEach(function(c){el("ellipse",{cx:x+c[0],cy:628,rx:14,ry:8,fill:c[1]},tb)})});
  P(tb,"M1300 640 Q1340 600 1380 640 Z","#FFFFFF");[[1318,618,"#FC3529"],[1340,608,"#FFD326"],[1362,620,"#4D9E10"],[1340,626,"#FF8725"]].forEach(function(f){el("circle",{cx:f[0],cy:f[1],r:13,fill:f[2]},tb)});
  [1130,1200].forEach(function(x,i){P(tb,"M"+(x-14)+" 600 H"+(x+14)+" L"+(x+11)+" 638 H"+(x-11)+" Z",i?"#FE88A8":"#9DBBFF")});
  /* колпачки */[[1110,560,"#6B91D5"],[1280,566,"#FFD326"]].forEach(function(h){P(tb,"M"+(h[0]-20)+" "+(h[1]+44)+" L"+h[0]+" "+h[1]+" L"+(h[0]+20)+" "+(h[1]+44)+" Z",h[2]);el("circle",{cx:h[0],cy:h[1],r:7,fill:"#FFFFFF"},tb)});
  /* подарки слева */[[300,860,120,100,"#6B91D5","#FFD326"],[430,860,90,80,"#FE88A8","#FFFFFF"],[360,764,80,70,"#4D9E10","#FC3529"]].forEach(function(b){var x=b[0],y=b[1],w=b[2],h=b[3];
    el("rect",{x:x-w/2,y:y-h,width:w,height:h,rx:6,fill:b[4]},g);el("rect",{x:x-8,y:y-h,width:16,height:h,fill:b[5]},g);el("rect",{x:x-w/2,y:y-h*.55-8,width:w,height:16,fill:b[5]},g);P(g,"M"+x+" "+(y-h)+" L"+(x-26)+" "+(y-h-22)+" Q"+(x-30)+" "+(y-h-2)+" "+x+" "+(y-h)+" L"+(x+26)+" "+(y-h-22)+" Q"+(x+30)+" "+(y-h-2)+" "+x+" "+(y-h)+" Z",b[5])});
  for(var i=0;i<40;i++)el("rect",{x:f1(rr(0,1536)),y:f1(rr(880,1030)),width:10,height:6,rx:2,fill:fl[i%5],transform:"rotate("+f1(rr(0,180))+" 0 0)",opacity:.8},g);
  o.tick=function(t){o.balloons.forEach(function(b){b.g.setAttribute("transform","translate("+f1(b.x+Math.sin(t*.8+b.p)*8)+" "+f1(b.y+Math.sin(t*1.1+b.p)*10)+")")})};return o}

/* кухня: плитка, шкафчики, мойка, плита с кастрюлькой, холодильник, полка с утварью, часы */
function bgKitchen(){var g=el("g",{},null),o={g:g,tick:function(){}};
  el("rect",{x:-10,y:-10,width:1556,height:880,fill:"#CBF0A4"},g);
  var tp=el("pattern",{id:"ktile",width:56,height:56,patternUnits:"userSpaceOnUse"},DEFS);el("rect",{width:56,height:56,fill:"#FFFFFF"},tp);el("path",{d:"M0 .5 H56 M.5 0 V56",stroke:"#D6E7FC","stroke-width":3},tp);
  el("rect",{x:300,y:380,width:1240,height:180,fill:"url(#ktile)"},g);
  /* верхние шкафчики */[[330,"#FFFFFF"],[560,"#FFFFFF"],[1090,"#FFFFFF"],[1320,"#FFFFFF"]].forEach(function(c){el("rect",{x:c[0],y:150,width:210,height:200,rx:12,fill:c[1]},g);el("rect",{x:c[0]+14,y:164,width:182,height:172,rx:8,fill:"#EAF1FF"},g);el("rect",{x:c[0]+90,y:316,width:30,height:8,rx:4,fill:"#C77A62"},g)});
  frameW(g,800,140,240,220,"#ADC6FD");pot(g,880,370,.8);pot(g,960,370,.7);
  /* холодильник */el("rect",{x:20,y:240,width:250,height:620,rx:20,fill:"#E3E2E3"},g);Ln(g,"M30 470 H260","#BEBFBF",6);el("rect",{x:226,y:300,width:12,height:120,rx:6,fill:"#908B90"},g);el("rect",{x:226,y:500,width:12,height:160,rx:6,fill:"#908B90"},g);
  [[80,330,"#FC3529"],[130,360,"#FFD326"],[90,560,"#6B91D5"]].forEach(function(m){el("circle",{cx:m[0],cy:m[1],r:12,fill:m[2]},g)});el("rect",{x:110,y:540,width:70,height:56,rx:6,fill:"#FFFFFF"},g);P(g,"M122 586 L140 560 L156 576 L168 566 V586 Z","#4D9E10");
  /* столешница с мойкой и плитой */el("rect",{x:300,y:560,width:1240,height:300,fill:"#FFFFFF"},g);el("rect",{x:290,y:546,width:1260,height:28,rx:8,fill:"#C77A62"},g);
  [[430],[680],[1180],[1400]].forEach(function(d){Ln(g,"M"+d[0]+" 600 V840","#E3E2E3",5);el("rect",{x:d[0]-60,y:640,width:24,height:8,rx:4,fill:"#C77A62"},g)});
  el("rect",{x:560,y:540,width:180,height:14,rx:6,fill:"#BEBFBF"},g);Ln(g,"M650 540 V500 Q650 486 668 486 H690","#908B90",8);
  el("rect",{x:960,y:560,width:280,height:300,rx:10,fill:"#ACB3C6"},g);el("rect",{x:990,y:650,width:220,height:170,rx:10,fill:"#2D2E2C"},g);Ln(g,"M1010 620 H1190","#575757",8);[1010,1100,1190].forEach(function(x){el("circle",{cx:x,cy:600,r:9,fill:"#575757"},g)});
  P(g,"M1040 470 H1140 L1132 540 H1048 Z","#FC3529");Ln(g,"M1030 474 H1150","#C3200E",8);o.steam=[0,1,2].map(function(i){return Ln(g,"M"+(1070+i*20)+" 460 q10 -20 0 -40 q-10 -20 0 -40","#FFFFFF",5,.6)});
  /* полка с утварью */Ln(g,"M330 120 H1540","#C77A62",0);el("rect",{x:1320,y:380,width:200,height:12,rx:5,fill:"#C77A62"},g);
  [[1350,"ladle"],[1400,"sp"],[1450,"ladle"],[1490,"sp"]].forEach(function(u){Ln(g,"M"+u[0]+" 392 V470","#908B90",6);if(u[1]==="ladle")el("ellipse",{cx:u[0],cy:478,rx:16,ry:10,fill:"#908B90"},g);else el("rect",{x:u[0]-10,y:466,width:20,height:28,rx:4,fill:"#C77A62"},g)});
  /* часы без цифр */el("circle",{cx:1440,cy:90,r:0},g);
  planks(g,860,1044,"#FDE6C4","#F8B888");
  o.tick=function(t){o.steam.forEach(function(s,i){s.setAttribute("transform","translate(0 "+f1(-((t*20+i*14)%30))+")");s.setAttribute("opacity",(.6*(1-((t*20+i*14)%30)/30)).toFixed(2))})};return o}

/* велодорожка в парке: асфальт с разметкой, знак, стойка с велосипедом */
function bgBike(){var o=makeStreet(1536,"park",[]),g=o.g;
  ground(g,"M-20 862 Q460 846 840 858 Q1230 870 1556 852 V1004 H-20 Z","#ACB3C6");Ln(g,"M-20 862 Q460 846 840 858 Q1230 870 1556 852","#908B90",10);
  Ln(g,"M-20 934 H1556","#FFFFFF",6).setAttribute("stroke-dasharray","60 50");
  function bikeIcon(p,sw){[-30,30].forEach(function(x){el("circle",{cx:x,cy:12,r:17,fill:"none",stroke:"#FFFFFF","stroke-width":sw},p)});Ln(p,"M-30 12 L-8 -16 H20 L30 12 M-8 -16 L4 12 L20 -16 M-16 -26 H2 M20 -16 L16 -30 H28","#FFFFFF",sw)}
  var sy=el("g",{transform:"translate(1000 958) scale(1.5 .7)"},g);bikeIcon(sy,6);
  /* знак «велодорожка» */var sg=el("g",{transform:"translate(1400 0)"},g);el("rect",{x:-6,y:560,width:12,height:300,fill:"#908B90"},sg);el("circle",{cx:0,cy:540,r:60,fill:"#0044D3"},sg);el("circle",{cx:0,cy:540,r:60,fill:"none",stroke:"#FFFFFF","stroke-width":6},sg);
  var bs=el("g",{transform:"translate(0 538)"},sg);bikeIcon(bs,6);
  /* велосипед мальчика стоит слева — в том же месте и масштабе, что и в мультике */o.bikeX=330;
  o.parked=el("g",{transform:"translate("+o.bikeX+" 930) scale(-1.35 1.35)"},g);drawBikeOnly(o.parked);
  return o}
function drawBikeOnly(BK){function wheel(cx){var w=el("g",{transform:"translate("+cx+" -92)"},BK);el("circle",{r:86,fill:"none",stroke:"#2D2E2C","stroke-width":14},w);el("circle",{r:76,fill:"none",stroke:"#BEBFBF","stroke-width":5},w);
    for(var i=0;i<6;i++){var a=i*Math.PI/6;Ln(w,"M"+f1(Math.cos(a)*74)+" "+f1(Math.sin(a)*74)+" L"+f1(-Math.cos(a)*74)+" "+f1(-Math.sin(a)*74),"#BEBFBF",4)}el("circle",{r:10,fill:"#908B90"},w)}
  wheel(130);wheel(-180);Ln(BK,"M130 -92 L-20 -92 L30 -182 M28 -176 L-140 -230 L-20 -92 M30 -182 L130 -92 M-140 -236 L-180 -92 M-130 -260 L-150 -210","#FC3529",14);
  Ln(BK,"M-150 -262 Q-130 -280 -104 -270","#2D2E2C",12);Ln(BK,"M30 -182 V-192","#908B90",8);P(BK,"M-6 -204 H58 Q68 -204 64 -194 L58 -186 H0 Q-12 -188 -6 -204Z","#2C3A5C");el("circle",{cx:-118,cy:-278,r:11,fill:"#FFD326"},BK);Ln(BK,"M-10 -92 L20 -10","#908B90",6)}

/* огород: грядки с морковкой, капустой и помидорами, теплица, лопата, лейка, тачка */
function bgGarden(){var g=el("g",{},null),o={g:g,fl:[]};
  el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"url(#gDay)"},g);o.rays=sun(g,1250,200);o.cl=[cloud2(g,300,190,.9),cloud2(g,800,150,.7)];
  ground(g,"M-20 600 Q400 560 800 590 Q1200 610 1556 570 V1044 H-20 Z","url(#hillFar)");
  /* теплица */var gh=el("g",{transform:"translate(1060 0)"},g);P(gh,"M0 700 V520 Q140 420 280 520 V700 Z","#D6E7FC");Ln(gh,"M0 700 V520 Q140 420 280 520 V700 Z M70 700 V470 M140 700 V448 M210 700 V470 M0 600 H280","#FFFFFF",8);
  el("path",{d:"M30 600 Q60 520 120 500",stroke:"#FFFFFF","stroke-width":10,fill:"none",opacity:.6},gh);[[40,680],[110,680],[180,680],[250,680]].forEach(function(q){el("circle",{cx:q[0],cy:q[1]-14,r:16,fill:"#4D9E10",opacity:.8},gh);el("circle",{cx:q[0]+6,cy:q[1]-20,r:6,fill:"#FC3529"},gh)});
  fence2(g,1536,720);
  /* подсолнухи у забора */[[140,600],[230,630],[880,610]].forEach(function(s){Ln(g,"M"+s[0]+" "+s[1]+" V740","#4D9E10",8);el("ellipse",{cx:s[0]-14,cy:s[1]+60,rx:20,ry:9,fill:"#4D9E10"},g);for(var i=0;i<12;i++){var a=i/12*Math.PI*2;el("ellipse",{cx:f1(s[0]+Math.cos(a)*26),cy:f1(s[1]+Math.sin(a)*26),rx:12,ry:6,fill:"#FFD326",transform:"rotate("+f1(a*180/Math.PI)+" "+f1(s[0]+Math.cos(a)*26)+" "+f1(s[1]+Math.sin(a)*26)+")"},g)}el("circle",{cx:s[0],cy:s[1],r:18,fill:"#985037"},g)});
  /* земля огорода */ground(g,"M-20 740 H1556 V1044 H-20 Z","#C77A62");
  function bed(y,x0,x1,kind){var bd=el("g",{},g);ground(bd,"M"+x0+" "+(y-16)+" Q"+((x0+x1)/2)+" "+(y-34)+" "+x1+" "+(y-16)+" L"+(x1+10)+" "+(y+22)+" Q"+((x0+x1)/2)+" "+(y+36)+" "+(x0-10)+" "+(y+22)+" Z","#985037");
    for(var x=x0+30;x<x1-10;x+=kind==="cab"?80:44){if(kind==="car"){var lf=el("g",{transform:"translate("+x+" "+(y-14)+")"},bd);[[-10,-34],[0,-44],[10,-34]].forEach(function(q){Ln(lf,"M0 0 L"+q[0]+" "+q[1],"#4D9E10",6)});el("ellipse",{cx:0,cy:2,rx:9,ry:6,fill:"#FF8725"},lf)}
      else if(kind==="cab"){[[0,-20,26,"#4D9E10"],[-10,-24,18,"#71CB0D"],[10,-26,16,"#B6D58C"],[0,-30,12,"#CBF0A4"]].forEach(function(c){el("circle",{cx:x+c[0],cy:y+c[1],r:c[2],fill:c[3]},bd)})}
      else{Ln(bd,"M"+x+" "+y+" V"+(y-110),"#985037",5);[[-12,-40],[12,-62],[-12,-84]].forEach(function(q){el("ellipse",{cx:x+q[0],cy:y+q[1],rx:16,ry:8,fill:"#4D9E10"},bd)});[[8,-50],[-8,-74],[10,-90]].forEach(function(q){el("circle",{cx:x+q[0],cy:y+q[1],r:9,fill:"#FC3529"},bd)})}}}
  bed(790,40,560,"tom");bed(790,980,1500,"cab");bed(880,20,520,"car");bed(880,1020,1520,"car");
  /* тропинка */ground(g,"M560 1044 Q640 900 700 760 H840 Q900 900 980 1044 Z","#FDE8C7");
  /* лопата, лейка, тачка */var sh=el("g",{transform:"translate(620 950) rotate(-12)"},g);Ln(sh,"M0 0 V-170","#985037",10);Ln(sh,"M-16 -170 H16","#985037",10);P(sh,"M-22 0 H22 L18 40 Q0 56 -18 40 Z","#908B90");
  var wc=el("g",{transform:"translate(1380 990)"},g);P(wc,"M-50 0 H50 L40 -70 H-40 Z","#0044D3");Ln(wc,"M40 -60 L96 -96","#0044D3",12);el("ellipse",{cx:100,cy:-100,rx:14,ry:10,fill:"#0044D3"},wc);Ln(wc,"M-40 -70 Q0 -120 40 -70","#0044D3",8);
  var wb=el("g",{transform:"translate(200 990)"},g);P(wb,"M-90 -70 H80 L60 -10 H-70 Z","#FC3529");el("circle",{cx:76,cy:-4,r:20,fill:"#2D2E2C"},wb);Ln(wb,"M-90 -60 L-150 -30 M-70 -10 L-80 14","#985037",8);
  [[-40,-80,"#FF8725"],[0,-84,"#4D9E10"],[30,-80,"#FF8725"]].forEach(function(v){el("circle",{cx:v[0],cy:v[1],r:20,fill:v[2]},wb)});
  o.tick=function(t){o.rays.setAttribute("transform","rotate("+(t*6%360).toFixed(2)+")");o.cl.forEach(function(c){c.x+=c.v*.016;if(c.x>1750)c.x=-200;c.g.setAttribute("transform","translate("+f1(c.x)+" "+c.y+") scale("+c.s+")")})};return o}

/* футбольное поле: трибуны, рекламные щиты, прожекторы, полосатый газон, разметка, ворота */
function bgField(){var g=el("g",{},null),o={g:g};
  el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"url(#gDay)"},g);o.rays=sun(g,1300,180);o.cl=[cloud2(g,280,150,.8),cloud2(g,820,120,.6)];
  /* прожекторы */[120,1430].forEach(function(x){Ln(g,"M"+x+" 560 V230","#908B90",14);el("rect",{x:x-56,y:190,width:112,height:56,rx:8,fill:"#575757"},g);for(var i=0;i<3;i++)el("circle",{cx:x-34+i*34,cy:218,r:12,fill:"#FFF8A8"},g)});
  /* трибуны с цветными сиденьями */var cols=["#FC3529","#FFD326","#6B91D5","#4D9E10","#FF8725"];for(var r=0;r<4;r++){el("rect",{x:-10,y:440+r*44,width:1556,height:44,fill:r%2?"#ACB3C6":"#BEBFBF"},g);for(var x=10+(r%2)*20;x<1536;x+=40)el("rect",{x:x,y:450+r*44,width:26,height:22,rx:5,fill:cols[(x/40+r)%5|0]},g)}
  /* рекламные щиты */for(var x=-10,i=0;x<1546;x+=220,i++){el("rect",{x:x,y:616,width:216,height:60,rx:6,fill:["#0044D3","#FFFFFF","#FC3529","#FFD326"][i%4]},g)}
  /* газон полосами */for(var i=0;i<12;i++)el("rect",{x:-10+i*140,y:676,width:140,height:370,fill:i%2?"#71CB0D":"#4D9E10"},g);el("rect",{x:-10,y:676,width:1556,height:370,fill:"url(#grain)"},g);
  Ln(g,"M-10 700 H1546","#FFFFFF",7);Ln(g,"M260 700 V1044","#FFFFFF",9);el("ellipse",{cx:260,cy:880,rx:260,ry:96,fill:"none",stroke:"#FFFFFF","stroke-width":9},g);
  Ln(g,"M1546 730 H880 V1044","#FFFFFF",9);
  /* ворота с сеткой */var gt=el("g",{transform:"translate(1330 900)"},g);o.net=el("g",{},gt);P(o.net,"M-330 -470 H330 V0 H-330 Z","#FFFFFF").setAttribute("opacity",.15);
  var nd="";for(var x=-330;x<=330;x+=30)nd+="M"+x+" -470 V0 ";for(var y=-470;y<=0;y+=30)nd+="M-330 "+y+" H330 ";Ln(o.net,nd,"#FFFFFF",3,.8);
  Ln(gt,"M-340 0 V-484 H340 V0","#FFFFFF",22);o.goal={x:1300,y:700};
  P(g,"M60 1000 V900 L100 914 L60 928","#FC3529",3);Ln(g,"M60 1000 V900","#FFFFFF",4);
  o.tick=function(t){o.rays.setAttribute("transform","rotate("+(t*6%360).toFixed(2)+")");o.cl.forEach(function(c){c.x+=c.v*.016;if(c.x>1750)c.x=-200;c.g.setAttribute("transform","translate("+f1(c.x)+" "+c.y+") scale("+c.s+")")})};return o}

/* ───────── персонаж сбоку (лицом вправо; рисуем как в первой игре лицом влево и отражаем) ───────── */
function armTo(A,tx,ty,s){var a=70,b=68,sx=A.x,sy=-288,dx=tx-sx,dy=ty-sy,d=Math.min(Math.hypot(dx,dy),a+b-1),base=Math.atan2(-dx,dy),
  ang=Math.acos(clamp((a*a+d*d-b*b)/(2*a*d),-1,1)),th=base+s*ang,ex=sx-Math.sin(th)*a,ey=sy+Math.cos(th)*a,be=Math.atan2(-(tx-ex),ty-ey);
  A.a=th*180/Math.PI;A.b=(be-th)*180/Math.PI}
function handPos(A){var t=rad(A.a),t2=rad(A.a+A.b);return {x:A.x-Math.sin(t)*70-Math.sin(t2)*68,y:-288+Math.cos(t)*70+Math.cos(t2)*68}}
function legTo(L,tx,ty,s){var a=80,b=72,sx=L.x,sy=-170,dx=tx-sx,dy=ty-sy,d=Math.min(Math.hypot(dx,dy),a+b-1),base=Math.atan2(-dx,dy),
  ang=Math.acos(clamp((a*a+d*d-b*b)/(2*a*d),-1,1)),th=base+s*ang,ex=sx-Math.sin(th)*a,ey=sy+Math.cos(th)*a,be=Math.atan2(-(tx-ex),ty-ey);
  L.a=th*180/Math.PI;L.b=(be-th)*180/Math.PI}
/* рука сбоку: рукав (col) или голая */
function sArm(parent,x,skin,sleeve,cuff,padCol){var sh=el("g",{transform:"translate("+x+" -288)"},parent),up=el("g",{},sh);
  el("path",{d:"M0 0 V70",stroke:skin,"stroke-width":24,"stroke-linecap":"round"},up);
  if(sleeve)el("path",{d:"M0 -4 V"+(sleeve.long?72:34),stroke:sleeve.c,"stroke-width":sleeve.long?32:34,"stroke-linecap":"round"},up);
  var e2=el("g",{transform:"translate(0 70)"},up);el("path",{d:"M0 0 V60",stroke:skin,"stroke-width":21,"stroke-linecap":"round"},e2);
  if(sleeve&&sleeve.long){el("path",{d:"M0 0 V48",stroke:sleeve.c,"stroke-width":29,"stroke-linecap":"round"},e2);el("path",{d:"M0 46 V52",stroke:cuff,"stroke-width":30,"stroke-linecap":"round"},e2)}
  if(padCol)el("ellipse",{cx:0,cy:0,rx:17,ry:15,fill:padCol},e2);
  var hand=el("g",{transform:"translate(0 68)"},e2);hand2(hand,1,skin);
  return {x:x,up:up,el:e2,hand:hand,a:0,b:0}}
function setSArm(A){A.up.setAttribute("transform","rotate("+f1(A.a)+")");A.el.setAttribute("transform","translate(0 70) rotate("+f1(A.b)+")")}
/* нога сбоку: штанина, обувь, наколенник */
function sLeg(parent,x,o){var hip=el("g",{transform:"translate("+x+" -170)"},parent),th=el("g",{},hip);
  el("path",{d:"M0 0 V80",stroke:o.thigh||o.skin,"stroke-width":30,"stroke-linecap":"round"},th);
  if(o.shorts){el("path",{d:"M0 -6 V46",stroke:o.shorts,"stroke-width":38,"stroke-linecap":"round"},th);el("path",{d:"M-19 46 H19",stroke:o.shortsD||o.shorts,"stroke-width":7},th)}
  var kn=el("g",{transform:"translate(0 80)"},th);
  el("path",{d:"M0 0 V72",stroke:o.shin||o.skin,"stroke-width":27,"stroke-linecap":"round"},kn);
  if(o.boot){el("path",{d:"M0 30 V76",stroke:o.boot,"stroke-width":34,"stroke-linecap":"round"},kn);if(o.band)el("path",{d:"M0 30 V36",stroke:o.band,"stroke-width":36,"stroke-linecap":"round"},kn)}
  el("path",{d:"M14 84 Q14 68 -2 68 Q-30 68 -38 82 Q-40 92 -16 92 H6 Q14 92 14 84Z",fill:o.shoe},kn);
  if(o.sole)el("path",{d:"M-38 86 Q-40 94 -16 94 H6 Q16 94 14 86 Z",fill:o.sole},kn);
  if(o.pad)el("ellipse",{cx:0,cy:0,rx:19,ry:17,fill:o.pad},kn);
  return {x:x,th:th,kn:kn,a:0,b:0}}
function setSLeg(L){L.th.setAttribute("transform","rotate("+f1(L.a)+")");L.kn.setAttribute("transform","translate(0 80) rotate("+f1(L.b)+")")}
function sideHead(parent,kind){var h=el("g",{transform:"translate(0 -386)"},parent),o={g:h};sideHead2(h,kind,o);o.hat=el("g",{},h);return o}
function sideBlink(H,t,happy){if(t>(H.blinkAt||0)){H.blinkT=t;H.blinkAt=t+rr(2,3.6)}var bt=t-(H.blinkT||-9),bk=bt<.18?1-Math.abs(bt-.09)/.09:0;
  H.eye.setAttribute("transform","translate("+H.eyeC[0]+" "+H.eyeC[1]+") scale(1 "+(1-bk*.9).toFixed(2)+") translate("+(-H.eyeC[0])+" "+(-H.eyeC[1])+")");H.eye.setAttribute("opacity",1);H.happy.setAttribute("opacity",0);H.mouth.setAttribute("opacity",1);H.mouth.setAttribute("opacity",happy?0:1);H.smile.setAttribute("opacity",happy?1:0);H.grin.setAttribute("opacity",0)}

/* ───────── звук: несколько общих плееров, как в «Повелительном наклонении» ─────────
   SV — речь (фразы и похвала), SA — 2 плеера фона (чтобы фоны могли смениться с затуханием),
   SF — 4 плеера звуков действия, SM — музыка. Все 8 разблокируются одним нажатием «Старт».
   Звук ищется по ключу: плеер помнит, какой звук в нём стоит (__k), и не перезагружает файл, если он уже стоит. */
var soundOn=true,SU={},VURL={},VDUR={},PRAISE_U=[];
var SILENT_WAV="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
function mkEl(){var a=new Audio();a.preload="auto";a.__k=null;a.__u=null;a.__g=0;a.__t=0;return a}
var SV=mkEl(),SM=mkEl(),SA=[mkEl(),mkEl()],SF=[mkEl(),mkEl(),mkEl(),mkEl()],SALL=[SV,SM].concat(SA,SF);
SV.addEventListener("loadedmetadata",function(){var k=SV.__k;if(k&&k.indexOf("v:")===0&&!VDUR[k.slice(2)]&&isFinite(SV.duration)&&SV.duration>0)VDUR[k.slice(2)]=SV.duration});
function blobUrl(d){try{var b=atob(d.split(",")[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return URL.createObjectURL(new Blob([a],{type:"audio/mp4"}))}catch(e){return d}}
function buildAudio(){Object.keys(A.snd).forEach(function(k){SU[k]=srcFor(A.snd[k])});PRAISE_U=PRAISE.map(srcFor)}
/* длительность m4a — из заголовка файла (mvhd), без плеера */
function mp4Dur(buf){try{var b=new Uint8Array(buf),dv=new DataView(buf);for(var i=4;i<b.length-24;i++)if(b[i]===109&&b[i+1]===118&&b[i+2]===104&&b[i+3]===100){var v=b[i+4],ts,du;
  if(v===1){ts=dv.getUint32(i+24);du=dv.getUint32(i+28)*4294967296+dv.getUint32(i+32)}else{ts=dv.getUint32(i+16);du=dv.getUint32(i+20)}return ts>0&&du>0?du/ts:0}}catch(e){}return 0}
function setSrc(a,u){if(a.__u===u)return;try{a.pause()}catch(e){}a.__u=u;try{a.src=u}catch(e){}}
function busy(a){return !a.paused&&!a.ended}
/* разблокировка: каждый из 7 плееров один раз играет тишину в момент нажатия. Если пока тишина не доиграла,
   плеер уже понадобился (например, первая фраза), — тишину не трогаем, иначе она бы остановила настоящий звук. */
function unlock(){SALL.forEach(function(a){var prev=a.__u&&a.__u!==SILENT_WAV?a.__u:null;a.__u=SILENT_WAV;a.__k=null;
  var done=function(){if(a.__u!==SILENT_WAV)return;try{a.pause()}catch(e){}if(prev)setSrc(a,prev)};
  try{a.loop=false;a.src=SILENT_WAV;var p=a.play();if(p&&p.then)p.then(done,done);else done()}catch(e){done()}})}
function startEl(a,k,u,vol,loop){setSrc(a,u);a.__k=k;a.__g++;a.__t=performance.now();try{a.loop=!!loop;a.volume=vol==null?1:vol;a.currentTime=0}catch(e){}
  var p=a.play();if(p&&p.catch)p.catch(function(){});return a}
function isAmb(k){return k==="rain"||k.indexOf("amb")===0}
/* плеер для звука: тот, где этот звук уже стоит; иначе свободный; иначе тот, что запущен раньше всех */
function pick(pool,k){var i;for(i=0;i<pool.length;i++)if(pool[i].__k===k)return pool[i];for(i=0;i<pool.length;i++)if(!busy(pool[i])&&pool[i].__u!==SILENT_WAV)return pool[i];
  for(i=0;i<pool.length;i++)if(!busy(pool[i]))return pool[i];var o=pool[0];pool.forEach(function(b){if(b.__t<o.__t)o=b});return o}
function elFor(k){var L=SA.concat(SF);for(var i=0;i<L.length;i++)if(L[i].__k===k&&busy(L[i]))return L[i];return null}
var musicOn=false,musicHeld=true,DRESS_SND="dr2";
function musicHold(h){musicHeld=h;try{if(h||!musicOn||!SU.music)SM.pause();else{setSrc(SM,SU.music);SM.__k="music";SM.loop=true;SM.volume=1;var p=SM.play();if(p&&p.catch)p.catch(function(){})}}catch(e){}}
function play(k,vol){if(!soundOn)return null;if(k==="praise")return praise();var u=SU[k];if(!u)return null;var am=isAmb(k);return startEl(pick(am?SA:SF,k),k,u,vol,am)}
function praiseList(){return PRAISE_U.length?PRAISE_U:(SU.praise?[SU.praise]:[])}
var PRAISE_NEXT=null;
function praise(){if(!soundOn)return null;var L=praiseList();if(!L.length)return null;var u=PRAISE_NEXT||L[Math.floor(Math.random()*L.length)];PRAISE_NEXT=null;return startEl(SV,"praise",u,1,false)}
/* смена файла в плеере на iPad на долю секунды задерживает кадр. Поэтому файлы ставим в плееры заранее, в спокойный момент:
   звуки раунда — когда звучит задание, похвалу — когда задание договорено, следующую фразу — когда кончилась предыдущая */
function cuePraise(){var L=praiseList();if(!L.length||busy(SV)||SV.__u===SILENT_WAV)return;PRAISE_NEXT=L[Math.floor(Math.random()*L.length)];setSrc(SV,PRAISE_NEXT);SV.__k="praise"}
function cueAfter(i){if(mode!=="intro"&&i%2===1){cuePraise();return}var n=SCRIPT[i+1];if(n)cueVoice(n.v)}
var CART_SND={gym:["clank"],party:["blow"],pool:["splash1"],sleep:["dress","click"],kitchen:["chop"],bike:["bell"],garden:["pop"],football:["kick"],bubbles:["bubbles"],puddle:["splash"],snowball:["snowball"],leaves:["leaves"]};
function cueSnd(list){list.forEach(function(k){var u=SU[k],i;if(!u)return;for(i=0;i<SF.length;i++)if(SF[i].__k===k)return;
  for(i=0;i<SF.length;i++){var a=SF[i];if(!busy(a)&&a.__u!==SILENT_WAV&&list.indexOf(a.__k)<0){setSrc(a,u);a.__k=k;a.__t=0;return}}})}
function sndVol(k,v,d){var a=elFor(k);if(!a)return;var g=a.__g,v0=a.volume;anim(d,function(u){if(a.__g===g)try{a.volume=lerp(v0,v,u)}catch(e){}})}
function stopSnd(k){var a=elFor(k);if(a)try{a.pause()}catch(e){}}
function fadeSnd(k,d){var a=elFor(k);if(!a)return;var g=a.__g,v0=a.volume;anim(d,function(u){if(a.__g===g)try{a.volume=Math.max(0,v0*(1-u))}catch(e){}},function(){if(a.__g===g)try{a.pause()}catch(e){}})}
/* остановить всё (кроме звезды и фанфар, если keepStar); музыкой управляет musicHold */
function stopAll(keepStar){[SV].concat(SA,SF).forEach(function(a){if(keepStar&&(a.__k==="star"||a.__k==="fanfare"))return;try{a.pause()}catch(e){}})}
function voiceBusy(){return busy(SV)}
/* речь: файл ставится в плеер заранее (пока предыдущая фраза кончилась), чтобы в момент фразы не ждать загрузки */
function cueVoice(k){var u=k&&VURL[k];if(!u||busy(SV)||SV.__u===SILENT_WAV)return;setSrc(SV,u);SV.__k="v:"+k}
function sayVoice(k){var u=VURL[k];if(!soundOn||!u)return 0;startEl(SV,"v:"+k,u,1,false);var d=VDUR[k];return d?d+.15:0}

/* ───────── время ───────── */
var clock=0,tw=[],tok=0;
function anim(dur,upd,done,delay){tw.push({t0:clock+(delay||0),d:dur,u:upd,cb:done,tk:tok})}
function later(sec,cb){anim(.0001,function(){},cb,sec)}
function stepTw(){var list=tw;tw=[];list.forEach(function(a){if(a.tk!==tok)return;if(clock<a.t0){tw.push(a);return}var u=clamp((clock-a.t0)/a.d,0,1);a.u(u);if(u<1)tw.push(a);else if(a.cb)a.cb()})}

/* ───────── озвучка: голос Софьи — <имя>.m4a в корне репо wardrobe; играет через общий плеер речи SV ───────── */
function voiceLen(t){return .9+t.length*.065}
var SCRIPT=[],LASTV=null,LASTI=null;function setScript(list){SCRIPT=list;if(list[0])cueVoice(list[0].v)}function hl(){}
var VNAMES=["i1","i2","i3","i4","zhar","dozhd","sneg","osen","sport","prazd","bass","son","kuh","vel","og","fut","d","m"];
var BGV={sun:"zhar",rain:"dozhd",winter:"sneg",autumn:"osen",gym:"sport",party:"prazd",pool:"bass",bedroom:"son",kitchen:"kuh",bike:"vel",garden:"og",field:"fut"};
function say(i,cb){LASTV=SCRIPT[i].v;LASTI=i;var d=sayVoice(SCRIPT[i].v)||voiceLen(SCRIPT[i].txt);later(d,function(){cueAfter(i);if(cb)cb()});return d}

/* ───────── камера ───────── */
var CAM=[0,0,1536,1024],camFn=null;
var BGSVG=document.getElementById("sg-bg"),BGROOT=null;
function applyCam(){var v=CAM.map(f1).join(" ");SVG.setAttribute("viewBox",v);BGSVG.setAttribute("viewBox",v)}
function bgBlur(on){BGSVG.style.filter=on?"blur("+Math.max(4,Math.round(GAME.offsetWidth*.009))+"px)":"none"}
function panTo(c,d,cb){var c0=CAM.slice();camFn=null;anim(d,function(u){var e=eio(u);CAM=c0.map(function(v,i){return lerp(v,c[i],e)})},cb)}

/* ───────── слои ───────── */
var ROOT=el("g",{},SVG),FX=el("g",{},SVG);BGROOT=el("g",{},BGSVG);
var ticks=[],kids=[],splashes=[];
function splash(cx,cy,k){for(var i=0;i<14;i++){var side=i%2?1:-1,e=el("circle",{r:f1(rr(6,13)*k),fill:i%3?"#9DBBFF":"#D6E7FC"},FX);
    splashes.push({e:e,x:cx+side*rr(20,60),y:cy-6,gy:cy+20,vx:side*rr(140,360)*k,vy:-rr(320,560)*k})}
  var r=el("ellipse",{cx:f1(cx),cy:cy,rx:30,ry:6,fill:"none",stroke:"#EAF1FF","stroke-width":5},FX);anim(.8,function(u){r.setAttribute("rx",f1(30+u*120));r.setAttribute("ry",f1(6+u*18));r.setAttribute("opacity",(1-u).toFixed(2))},function(){r.remove()})}
function drawSplash(dt){splashes=splashes.filter(function(s){s.vy+=1500*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.y>s.gy&&s.vy>0){s.e.remove();return false}s.e.setAttribute("cx",f1(s.x));s.e.setAttribute("cy",f1(s.y));return true})}

/* ═════════ ЗВЕЗДА 1 — ВСТУПЛЕНИЕ-МУЛЬТИК ═════════
   Сцены стоят в ряд, как на ленте; камера переезжает вбок из одной в другую. */
var GAP=0,SC=[];
function scene(build,W){var x0=SC.length?SC[SC.length-1].x0+SC[SC.length-1].W+GAP:0,g=el("g",{transform:"translate("+x0+" 0)",display:"none"},ROOT),o=build(g);o.x0=x0;o.W=W;o.g=g;if(o.later)o.later();SC.push(o);return o}
function show(o){o.g.setAttribute("display","inline")}function hide(o){o.g.setAttribute("display","none")}

/* 1. У шкафа, со спины, камера медленно приближается */
function buildS1(g){var o=wardrobeRoom();shadeAll(o.g);g.appendChild(o.g);
  /* девочка со спины, крупно: внизу кадра видна до пояса */
  var R=el("g",{},g),B=el("g",{},R);o.R=R;o.B=B;o.later=function(){o.cast=castShadow(R,g,30,10,.24,14)};
  [-1,1].forEach(function(s){el("path",{d:"M"+(s*22)+" -176 V-22",stroke:SKIN,"stroke-width":29,"stroke-linecap":"round"},B)});
  shadeAll(el("path",{d:"M-56 -198 H56 L60 -124 H8 L0 -142 L-8 -124 H-60 Z",fill:"#6B91D5",stroke:"#6B91D5","stroke-width":8,"stroke-linejoin":"round"},el("g",{},B)).parentNode);
  neck2(B,-12,-326,24,30);
  el("rect",{x:-50,y:-304,width:100,height:134,rx:26,fill:SKIN},B);
  shadeAll(el("path",{d:"M-50 -276 Q-46 -300 -34 -304 L-26 -304 Q0 -296 26 -304 L34 -304 Q46 -300 50 -276 L52 -180 Q52 -170 44 -170 H-44 Q-52 -170 -52 -180 Z",fill:"#CBF0A4"},el("g",{},B)).parentNode);
  o.arms={};o.arms[-1]=armChain(B,-1,10,0,true);o.arms[1]=armChain(B,1,-10,0,true);o.pose={"-1":{a:10,b:0},"1":{a:-10,b:0}};
  var H=el("g",{transform:"translate(0 -386)"},B);o.H=H;
  backHead2(H,o);o["tail-1"]=o.tl;o.tail1=o.tr;o["band-1"]=o.bl;o.band1=o.br;
  o.R.setAttribute("transform","translate(768 1200) scale(1.6)");
  o.sh=null;return o}
function runS1(o,cb){var t0=clock,c0=[0,0,1536,1024],c1=[170,110,1196,797];CAM=c0.slice();
  camFn=function(){var u=clamp((clock-t0)/10.4,0,1),e=eio(u);CAM=[o.x0+lerp(c0[0],c1[0],e),lerp(c0[1],c1[1],e),lerp(c0[2],c1[2],e),lerp(c0[3],c1[3],e)]};
  o.live=function(t){var hx=o.headX||0,ht=o.headT||0;o.H.setAttribute("transform","translate("+f1(hx)+" -386) rotate("+f1(ht)+")");
    o.B.setAttribute("transform","scale(1 "+(1+Math.sin(t*2.2)*.006).toFixed(3)+")");
    [-1,1].forEach(function(s){var tr="rotate("+f1(s*Math.sin(t*3)*4)+" "+(s<0?109:291)+" 212)";o["tail"+s].setAttribute("transform",tr);o["band"+s].setAttribute("transform",tr);var A=o.arms[s],P=o.pose[s];A.up.setAttribute("transform","rotate("+f1(P.a)+")");A.fo.setAttribute("transform","translate(0 70) rotate("+f1(P.b)+")")});if(o.cast)o.cast.sync()};
  ticks.push(o.live);
  /* смотрит на шкаф и размышляет: голова медленно поворачивается к одной вещи, к другой, чуть наклоняется */
  anim(1.6,function(u){var e=eio(u);o.headX=-14*e;o.headT=-7*e},null,.6);
  var fin1=false,end1=function(){if(fin1)return;fin1=true;ticks=ticks.filter(function(f){return f!==o.live});cb()};
  later(1.0,function(){say(0,function(){later(.6,end1)})});
  anim(1.8,function(u){var e=eio(u);o.headX=lerp(-14,12,e);o.headT=lerp(-7,6,e)},null,3.0);
  anim(1.6,function(u){var e=eio(u);o.headX=lerp(12,-4,e);o.headT=lerp(6,10,e)},null,5.6);
  anim(1.4,function(u){var e=eio(u);o.headX=lerp(-4,0,e);o.headT=lerp(10,0,e)},null,8.0);
  later(10.6,end1)}

/* 2. Дождь: девочка идёт сбоку, камера ведёт; раскрывает зонт, шлёпает по луже */
var S2W=2700,S2PUD=[[2120,950,150],[900,960,70],[2560,940,80]];
function buildS2(g){var o=makeStreet(S2W,"rain",S2PUD);shadeAll(o.g);g.appendChild(o.g);o.rainOn=0;o.dark.setAttribute("opacity",.05);
  var F=el("g",{},g);o.F=F;o.shadow=el("ellipse",{cx:0,cy:934,rx:80,ry:10,fill:"#2C3A5C",opacity:.13},F);
  var R=el("g",{},F);o.R=R;var S=el("g",{},R);o.S=S;o.later=function(){o.cast=castShadow(R,F,24,8,.22,12)};
  var COAT="#F97A50",COAT_D="#DF8615",PANT="#20477C",PANT_D="#20477C";
  o.legF=sLeg(S,4,{skin:SKIN_D,thigh:PANT_D,shin:PANT_D,boot:"#D2B205",shoe:"#D2B205"});o.armF=sArm(S,4,SKIN_D,{c:COAT_D,long:true},"#C3200E");
  o.legN=sLeg(S,4,{skin:SKIN,thigh:PANT,shin:PANT,boot:"#FFD326",band:"#D2B205",shoe:"#FFD326"});
  el("rect",{x:-12,y:-326,width:24,height:30,rx:8,fill:SKIN},S);
  shadeAll(el("path",{d:"M-40 -300 Q2 -314 44 -300 L56 -112 Q56 -100 44 -100 H-48 Q-60 -100 -60 -112 Z",fill:COAT},el("g",{},S)).parentNode);
  shadeAll(el("rect",{x:-34,y:-326,width:66,height:30,rx:14,fill:COAT},el("g",{},S)).parentNode);[-262,-222,-182,-142].forEach(function(y){el("circle",{cx:-30,cy:y,r:6,fill:"#FFD326"},S)});
  o.head=sideHead(S,"girl");
  o.armN=sArm(S,4,SKIN,{c:COAT,long:true},"#C3200E");
  /* зонт держит ближняя рука */
  o.U=el("g",{},S);o.Ushaft=el("path",{d:"M0 30 V-196",stroke:"#575757","stroke-width":7,"stroke-linecap":"round"},o.U);
  el("path",{d:"M0 30 Q0 50 16 50 Q30 50 30 36",stroke:"#575757","stroke-width":7,fill:"none","stroke-linecap":"round"},o.U);
  o.canopy=el("g",{transform:"translate(0 -196)"},o.U);
  el("path",{d:"M-160 40 Q-160 -80 0 -90 Q160 -80 160 40 Q133 24 107 40 Q80 24 53 40 Q27 24 0 40 Q-27 24 -53 40 Q-80 24 -107 40 Q-133 24 -160 40 Z",fill:"#0044D3"},o.canopy);
  el("path",{d:"M-53 40 Q-60 -40 0 -90 M53 40 Q60 -40 0 -90",stroke:"#20477C","stroke-width":5,fill:"none",opacity:.5},o.canopy);
  el("path",{d:"M0 -90 V-106",stroke:"#575757","stroke-width":7,"stroke-linecap":"round"},o.canopy);
  o.furl=el("path",{d:"M-13 30 Q-11 -50 0 -80 Q11 -50 13 30 Z",fill:"#0044D3",transform:"translate(0 -196)"},o.U);
  return o}
function poseS2(o,t){var gs=1.3,x=o.x;o.R.setAttribute("transform","translate("+f1(x)+" "+f1(930-(o.hop||0))+") scale("+(-gs)+" "+gs+")");
  var ph=o.ph||0,w=o.walk||0,bob=Math.abs(Math.cos(ph))*5*w;o.S.setAttribute("transform","translate(0 "+f1(-bob)+")");
  [[o.legN,1],[o.legF,-1]].forEach(function(a){var s=a[1];a[0].a=24*Math.sin(ph)*w*s;a[0].b=-(6+36*Math.max(0,Math.sin(ph+(s>0?1.4:1.4+Math.PI))))*w;if(o.tuck){a[0].a=lerp(a[0].a,30,o.tuck);a[0].b=lerp(a[0].b,-50,o.tuck)}setSLeg(a[0])});
  o.armF.a=18*Math.sin(ph)*w+2;o.armF.b=10;setSArm(o.armF);
  if(o.hold==null){o.armN.a=-18*Math.sin(ph)*w+2;o.armN.b=10}setSArm(o.armN);
  var h=handPos(o.armN);o.U.setAttribute("transform","translate("+f1(h.x)+" "+f1(h.y)+") rotate("+f1(o.uRot||0)+")");
  o.furl.setAttribute("opacity",(o.open||0)<.1?1:0);o.canopy.setAttribute("transform","translate(0 -196) scale("+lerp(.1,1,o.open||0).toFixed(3)+" "+lerp(.9,1,o.open||0).toFixed(3)+")");
  o.canopy.setAttribute("opacity",(o.open||0)<.1?0:1);
  o.head.tail.setAttribute("transform","rotate("+f1(-(Math.sin(t*3)*4+6*w*Math.sin(ph*2)))+" 124 232)");sideBlink(o.head,t,o.happy);
  o.shadow.setAttribute("cx",f1(x));var k=1-Math.min(.45,(o.hop||0)/260);o.shadow.setAttribute("rx",f1(80*gs*k));o.shadow.setAttribute("opacity",(.13*k).toFixed(3));if(o.cast)o.cast.sync()}
function runS2(o,cb){o.x=420;o.uRot=-112;o.open=0;o.hold=null;var X0=420,X1=980,X2=1700;
  var camOn=function(){var cx=clamp(o.x-1536*.36,0,S2W-1536);CAM=[o.x0+cx,0,1536,1024]};camFn=camOn;
  o.live=function(t,dt){o.tick(t,dt);poseS2(o,t)};ticks.push(o.live);
  function walk(xa,xb,d,cb2){play("steps",.35);anim(d,function(u){var e=u<.85?u/.85*.93:(.93+.07*eout((u-.85)/.15)),w=u<.9?1:Math.max(0,(1-u)/.1);o.x=lerp(xa,xb,e);o.ph=u*d*2*Math.PI/.62;o.walk=w},function(){stopSnd("steps");o.walk=0;if(cb2)cb2()})}
  walk(X0,X1,2.6,function(){
    /* остановилась — поднимает зонт и раскрывает */
    o.hold=1;var a0=o.armN.a,b0=o.armN.b;
    anim(.6,function(u){var e=eio(u),A=o.armN;armTo(A,lerp(-30,-100,e),lerp(-160,-296,e),-1);A.a=lerp(a0,A.a,e);A.b=lerp(b0,A.b,e);o.uRot=lerp(-112,0,e)},function(){
      play("umbrella",.45);anim(.4,function(u){o.open=back(u)})});
    later(1.3,function(){walk(X1,X2,2.6,function(){later(.6,function(){ticks=ticks.filter(function(f){return f!==o.live});cb()})})})});
  /* дождь начинается, пока она идёт */
  anim(1.0,function(u){o.rainOn=u;o.dark.setAttribute("opacity",(.05+.2*u).toFixed(3))},null,1.2);later(1.2,function(){var a=play("rain",0);if(a){var g=a.__g;anim(1.0,function(u){if(a.__g===g)try{a.volume=u*.4}catch(e){}})}});
  later(2.0,function(){say(1)})}

/* 3. Сон: спереди, камера стоит */
function buildS3(g){var o=bedroom();shadeAll(o.g);g.appendChild(o.g);
  var K=makeKid("boy",o.kidL,450,930,1.3);o.K=K;drawItem(ITEMS.pajama,K,null);drawItem(ITEMS.slippers,K,null);K.under.setAttribute("opacity",0);
  o.blanket.setAttribute("transform","translate(0 0)");return o}
function runS3(o,cb){var K=o.K;camFn=null;
  o.live=function(t){poseKid(K,t)};ticks.push(o.live);
  /* зевает и потягивается */
  anim(1.2,function(u){var s=Math.sin(Math.PI*u);K.p.yawn=s;K.pose[-1].a=lerp(10,150,s);K.pose[1].a=lerp(-10,-150,s);K.pose[-1].b=lerp(0,30,s);K.pose[1].b=lerp(0,-30,s);K.p.tilt=s*-4},null,1.4);
  later(1.8,function(){say(2)});
  /* прыгает в кровать: голова на подушку, одеяло спереди закрывает пижаму */
  var bx=1120,by=1060;
  later(3.2,function(){var xw=K.x;play("steps",.35);
    anim(1.8,function(u){var e=u<.85?u/.85*.94:(.94+.06*eout((u-.85)/.15)),ph=u*1.8*2*Math.PI/.62,w=u<.9?1:Math.max(0,(1-u)/.1);
      K.x=lerp(xw,760,e);K.hop=Math.abs(Math.sin(ph))*8*w;K.p.tilt=Math.sin(ph)*3*w;K.pose[-1].a=10+Math.sin(ph)*8*w;K.pose[1].a=-10+Math.sin(ph)*8*w},function(){stopSnd("steps");K.p.tilt=0;K.hop=0;
    var x0=K.x,y0=K.gy;anim(.75,function(u){var e=eio(u);K.x=lerp(x0,bx,e);K.gy=lerp(y0,by,e)-Math.sin(Math.PI*u)*70;K.gs=lerp(1.3,1.12,e);if(u>.45){o.kidL.setAttribute("clip-path","url(#bedclip)");K.castOff=true}},function(){
    play("dress",.25);anim(.5,function(u){K.sq=Math.sin(Math.PI*u)*.04});
    later(.4,function(){K.p.sleep=true});
    later(.9,function(){play("click",.45);anim(.5,function(u){o.glow.setAttribute("opacity",(.25*(1-u)).toFixed(3));o.shade.setAttribute("fill",u>.3?"#D2B205":"#FFD326");o.night.setAttribute("opacity",(.28*u).toFixed(3))})});
    later(1.4,function(){ticks=ticks.filter(function(f){return f!==o.live});cb()})})})})}

/* 4. Велосипед: сбоку, камера ведёт, в конце звонок */
var S4W=2900;
function buildS4(g){var o=makeStreet(S4W,"park",[]);shadeAll(o.g);g.appendChild(o.g);buildRider(g,o);return o}
function buildRider(g,o){
  var F=el("g",{},g);o.shadow=el("ellipse",{cx:0,cy:934,rx:270,ry:13,fill:"#2C3A5C",opacity:.13},F);
  var R=el("g",{},F);o.R=R;o.later=function(){o.cast=castShadow(R,F,24,8,.22,12)};
  /* велосипед (лицом влево в своих координатах, весь персонаж отражён) */
  var BK=el("g",{},R);o.wheels=[];
  function wheel(cx){var w=el("g",{transform:"translate("+cx+" -92)"},BK);el("circle",{r:86,fill:"none",stroke:"#2D2E2C","stroke-width":14},w);el("circle",{r:76,fill:"none",stroke:"#BEBFBF","stroke-width":5},w);
    var sp=el("g",{},w);for(var i=0;i<6;i++){var a=i*Math.PI/6;el("path",{d:"M"+f1(Math.cos(a)*74)+" "+f1(Math.sin(a)*74)+" L"+f1(-Math.cos(a)*74)+" "+f1(-Math.sin(a)*74),stroke:"#BEBFBF","stroke-width":4},sp)}
    el("circle",{r:10,fill:"#908B90"},w);o.wheels.push(sp)}
  o.legFg=el("g",{},R);
  wheel(130);wheel(-180);
  var FR="#FC3529";
  el("path",{d:"M130 -92 L-20 -92 L30 -182 M28 -176 L-140 -230 L-20 -92 M30 -182 L130 -92 M-140 -236 L-180 -92 M-130 -260 L-150 -210",stroke:FR,"stroke-width":14,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},BK);
  el("path",{d:"M-150 -262 Q-130 -280 -104 -270",stroke:"#2D2E2C","stroke-width":12,"stroke-linecap":"round",fill:"none"},BK);
  el("path",{d:"M30 -182 V-192",stroke:"#908B90","stroke-width":8},BK);el("path",{d:"M-6 -204 H58 Q68 -204 64 -194 L58 -186 H0 Q-12 -188 -6 -204Z",fill:"#2C3A5C"},BK);
  o.bell=el("circle",{cx:-118,cy:-278,r:11,fill:"#FFD326"},BK);
  o.crank=el("g",{transform:"translate(-20 -92)"},BK);el("circle",{r:18,fill:"#908B90"},o.crank);
  /* мальчик: футболка, шорты, шлем, наколенники и налокотники, кроссовки */
  var RB=el("g",{transform:"translate(24 -35)"},R);o.RB=RB;
  var TEE="#FFD326",TEE_D="#D2B205",SH="#6B91D5",PAD="#FF8725";
  o.legF=sLeg(RB,4,{skin:SKIN_D,thigh:SKIN_D,shorts:"#20477C",shin:SKIN_D,shoe:"#E3E2E3",sole:"#6B91D5",pad:"#DF8615"});
  RB.insertBefore(o.legF.th.parentNode,RB.firstChild);
  o.T=el("g",{},RB);
  o.armF=sArm(o.T,4,SKIN_D,{c:TEE_D,long:false},null,"#DF8615");
  el("rect",{x:-12,y:-326,width:24,height:30,rx:8,fill:SKIN},o.T);
  shadeAll(el("rect",{x:-34,y:-304,width:70,height:134,rx:22,fill:TEE},el("g",{},o.T)).parentNode);
  o.head=sideHead(o.T,"boy");
  /* шлем */
  var HL=o.head.hat;
  Ln(HL,"M42 -10 Q26 40 -30 72","#2C3A5C",6);Ln(HL,"M6 -16 Q-2 30 -30 72","#2C3A5C",6);el("rect",{x:-42,y:64,width:20,height:14,rx:4,fill:"#575757"},HL);
  HL=el("g",{transform:"translate(6 -22) rotate(16)"},HL);
  P(HL,"M-86 -4 Q-96 -64 -46 -96 Q10 -126 72 -96 Q118 -72 112 -22 Q108 0 90 2 Q40 -10 -10 -8 Q-60 -6 -86 -4 Z","#FF8725");
  P(HL,"M-80 -8 Q-30 -16 20 -14 Q70 -10 104 -12 Q104 2 90 4 Q40 -6 -10 -2 Q-60 0 -84 2 Z","#DF8615");
  [["M-50 -78 Q-20 -98 14 -100","M-50 -78 Q-20 -88 14 -90"],["M-30 -58 Q10 -82 54 -80",""],["M30 -104 Q70 -96 96 -66",""]].forEach(function(v){Ln(HL,v[0],"#2C3A5C",9,.8)});
  P(HL,"M-86 -6 Q-104 -6 -112 4 Q-96 10 -78 4 Z","#2C3A5C");
  el("path",{d:"M-36 -190 Q4 -198 42 -190 L46 -150 Q4 -140 -38 -150 Z",fill:SH,stroke:SH,"stroke-width":8,"stroke-linejoin":"round"},RB);
  el("path",{d:"M-36 -186 Q4 -194 42 -186",stroke:"#20477C","stroke-width":8,fill:"none"},RB);
  o.legN=sLeg(RB,4,{skin:SKIN,thigh:SKIN,shorts:SH,shortsD:"#20477C",shin:SKIN,shoe:"#FFFFFF",sole:"#6B91D5",pad:PAD});
  o.T2=el("g",{},RB);o.armN=sArm(o.T2,4,SKIN,{c:TEE,long:false},null,PAD);
  return o}
function poseS4(o,t){var gs=1.35,x=o.x;o.R.setAttribute("transform","translate("+f1(x)+" 930) scale("+(-gs)+" "+gs+")");
  var ang=o.wa||0;o.wheels.forEach(function(w){w.setAttribute("transform","rotate("+f1(-ang*180/Math.PI)+")")});
  var c=o.ca||0;o.crank.setAttribute("transform","translate(-20 -92) rotate("+f1(-c*180/Math.PI)+")");
  o.T.setAttribute("transform","rotate(-12 0 -170)");o.T2.setAttribute("transform","rotate(-12 0 -170)");
  /* педали: в координатах RB (смещение 20,-30) */
  [[o.legN,0],[o.legF,Math.PI]].forEach(function(a){var p=-c+a[1],px=-20+Math.cos(p)*34-24,py=-92+Math.sin(p)*34+35-16;legTo(a[0],px,py,1);setSLeg(a[0])});
  /* руки к рулю (с учётом наклона корпуса) */
  var th=rad(-12),hx=-118-24,hy=-262+35,dx=hx-0,dy=hy+170,lx=dx*Math.cos(-th)-dy*Math.sin(-th),ly=dx*Math.sin(-th)+dy*Math.cos(-th)-170;
  if(o.ring>0){armTo(o.armN,lx+lerp(0,6,o.ring),ly-o.ring*16,-1)}else armTo(o.armN,lx,ly,-1);setSArm(o.armN);armTo(o.armF,lx-6,ly+6,-1);setSArm(o.armF);
  sideBlink(o.head,t,o.happy);
  o.shadow.setAttribute("cx",f1(x-30));if(o.cast)o.cast.sync()}
function runS4(o,cb){o.x=300;o.wa=0;o.ca=0;var X0=300,X1=1700,D=5.4;
  camFn=function(){var cx=clamp(o.x-1536*.42,0,S4W-1536);CAM=[o.x0+cx,0,1536,1024]};
  var lastX=o.x;o.live=function(t,dt){o.tick(t,dt);var dx=o.x-lastX;lastX=o.x;o.wa+=dx/(86*1.35);o.ca+=dx/(86*1.35)*.55;poseS4(o,t)};ticks.push(o.live);
  anim(D,function(u){var e=u<.12?(u/.12)*(u/.12)*.06:u<.8?.06+(u-.12)/.68*.8:.86+.14*eout((u-.8)/.2);o.x=lerp(X0,X1,e)},function(){
    /* звонок большим пальцем */
    play("bell",.55);anim(.25,function(u){o.ring=Math.sin(Math.PI*u)},null,0);anim(.25,function(u){o.ring=Math.sin(Math.PI*u)},function(){o.ring=0;o.happy=true;later(1.6,function(){ticks=ticks.filter(function(f){return f!==o.live});cb()})},.25)});
  later(1.6,function(){say(3)})}

var INTRO_SCRIPT=[
 {who:"Сцена 1 · шкаф",txt:"Одежды бывает много. Её выбирают по погоде и по случаю.",v:"i1"},
 {who:"Сцена 2 · дождь",txt:"Идёт дождь — надеваем дождевик и резиновые сапоги.",v:"i2"},
 {who:"Сцена 3 · сон",txt:"Спать ложимся в пижаме.",v:"i3"},
 {who:"Сцена 4 · велосипед",txt:"На велосипеде катаемся в шлеме и наколенниках.",v:"i4"}];
var S1,S2,S3,S4;
function buildIntro(){SC=[];S1=scene(buildS1,1536);S2=scene(buildS2,S2W);S3=scene(buildS3,1536);S4=scene(buildS4,S4W)}
/* смена сцен вступления — растворение: прошлая сцена (пересчитанная под камеру новой) плавно гаснет поверх новой; соседние сцены не видны */
function dissolve(A,B,N,cb){var c=CAM.slice(),k=N[2]/c[2];show(B);ROOT.appendChild(A.g);
  A.g.setAttribute("transform","translate("+f1(N[0]-c[0]*k+A.x0*k)+" "+f1(N[1]-c[1]*k)+") scale("+k.toFixed(4)+")");camFn=null;CAM=N.slice();
  anim(.8,function(u){A.g.setAttribute("opacity",(1-eio(u)).toFixed(2))},function(){hide(A);A.g.removeAttribute("opacity");A.g.setAttribute("transform","translate("+A.x0+" 0)");if(cb)cb()})}
function runIntro(){show(S1);
  runS1(S1,function(){S2.x=420;S2.uRot=-112;S2.open=0;S2.hold=null;S2.walk=0;poseS2(S2,clock);
    dissolve(S1,S2,[S2.x0,0,1536,1024],function(){runS2(S2,function(){fadeSnd("rain",1.2);poseKid(S3.K,clock);
      dissolve(S2,S3,[S3.x0,0,1536,1024],function(){runS3(S3,function(){S4.x=300;S4.wa=0;S4.ca=0;poseS4(S4,clock);
        dissolve(S3,S4,[S4.x0,0,1536,1024],function(){runS4(S4,function(){starDone(0,afterStar)})})})})})})})}

/* ═════════ ЗВЕЗДА 2 — РАУНДЫ: одень по погоде ═════════ */
var ROUNDS=[
 {kind:"girl",bg:"sun",ctx:"На улице жарко.",task:"Одень девочку.",ok:["tshirt","shorts","sandals","cap"],no:["puffer","valenki"],cartoon:"bubbles"},
 {kind:"boy",bg:"rain",ctx:"На улице идёт дождь.",task:"Одень мальчика.",ok:["jacket","jeans","rainboots","umbrella"],no:["shorts","sandals"],cartoon:"puddle"},
 {kind:"girl",bg:"winter",ctx:"На улице снег и мороз.",task:"Одень девочку.",ok:["puffer","warmpants","valenki","hat"],no:["tshirt","swimsuit"],cartoon:"snowball"},
 {kind:"boy",bg:"autumn",ctx:"На улице осень, прохладно.",task:"Одень мальчика.",ok:["coat2","jeans2","boots2","scarf"],no:["flipflops","apron"],cartoon:"leaves"}];
/* по бокам — по три вещи столбиком; взять вещь можно за всю её ячейку */
var SHELF_Y=[400,645,890],TILE_POS=[[215,400],[215,645],[215,890],[1321,400],[1321,645],[1321,890]];
function shelfUnit(p,cx){var g=el("g",{},p);el("rect",{x:cx-132,y:150,width:264,height:770,rx:18,fill:"#C77A62"},g);
  el("rect",{x:cx-116,y:168,width:232,height:740,rx:10,fill:"#FDE8C7"},g);el("rect",{x:cx-116,y:168,width:232,height:740,rx:10,fill:"url(#grain)"},g);
  SHELF_Y.forEach(function(y){el("rect",{x:cx-122,y:y,width:244,height:20,rx:6,fill:"#A17269"},g);el("rect",{x:cx-116,y:y+20,width:232,height:10,fill:"#2C3A5C",opacity:.1},g)});
  el("rect",{x:cx-140,y:140,width:280,height:26,rx:10,fill:"#A17269"},g);castShadow(g,p,0,0,0,4);return g}
var G2={},drag=null;
function svgPt(e){var p=SVG.createSVGPoint();p.x=e.clientX;p.y=e.clientY;var m=SVG.getScreenCTM();return m?p.matrixTransform(m.inverse()):{x:0,y:0}}
var START_R=0,CUR_STAR=2,STARS={2:ROUNDS,3:STAR3,4:STAR4};
function earnedBefore(){for(var k=0;k<CUR_STAR-1;k++)starBacks[k].classList.add("sg-earned")}
function runStar2(){earnedBefore();var L=STARS[CUR_STAR],i=START_R;(function next(){if(i>=L.length){endPreview();return}
  round(L[i],i,function(){if(i<L.length){later(.1,function(){praise()});later(1.6,next)}else next()});i++})()}
function bgFor(R,idx){seed=100+idx+CUR_STAR*10;var b=R.bg;
  return shadeAll(b==="sun"?makeStreet(1536,"playground",[]):b==="rain"?makeStreet(1536,"yard",[[930,950,150],[300,962,70],[1330,940,64]]):b==="winter"?makeWinter():b==="autumn"?makeAutumn():
    b==="gym"?bgGym():b==="party"?bgParty():b==="pool"?bgPool2():b==="bedroom"?bgBedroom():b==="kitchen"?bgKitchen():b==="bike"?bgBike():b==="garden"?bgGarden():bgField())}
function round(R,idx,cb){if(G2.prev&&!G2.instant){var p=G2.prev;G2.prev=null;round1(R,idx,cb,false,.55);
    ROOT.appendChild(p.g);if(p.bg)BGROOT.appendChild(p.bg);
    anim(.5,function(u){var v=(1-eio(u)).toFixed(2);p.g.setAttribute("opacity",v);if(p.bg)p.bg.setAttribute("opacity",v)},function(){p.g.remove();if(p.bg)p.bg.remove();if(p.o)ticks=ticks.filter(function(f){return f!==p.o.tick})});return}
  round1(R,idx,cb,false)}
function round1(R,idx,cb,fadeIn,qd){var g=el("g",{},ROOT),bgG=el("g",{},BGROOT),o=bgFor(R,idx);bgG.appendChild(o.g);
  ticks.push(o.tick);camFn=null;CAM=[77,51,1382,921];anim(3.2,function(u){var e=eio(u);CAM=[lerp(77,0,e),lerp(51,0,e),lerp(1382,1536,e),lerp(921,1024,e)]});
  var VE=el("rect",{x:-10,y:-10,width:1556,height:1044,fill:"#EAF1FF",opacity:0},bgG),KL=el("g",{},g),TL=el("g",{},g),DL=el("g",{},g);
  var cur={g:g,bg:bgG,o:o};if(G2.prev&&G2.instant){G2.prev.g.remove();if(G2.prev.bg)G2.prev.bg.remove();G2.instant=false}if(fadeIn){g.setAttribute("opacity",0);bgG.setAttribute("opacity",0);anim(.5,function(u){var v=eio(u).toFixed(2);g.setAttribute("opacity",v);bgG.setAttribute("opacity",v)})}G2.prev=cur;
  /* спрей для мультика «жарко» — стоит на газоне */
  o.bubL=el("g",{},null);
  var K=null,tiles=[],need=R.ok.length,worn=0,canDrag=false;G2.tiles=tiles;
  var amb={sun:"ambS",rain:"ambR",winter:"ambW",autumn:"ambA",pool:"ambP",bike:"ambS",garden:"ambS",field:"ambF",kitchen:"ambK",gym:"ambG",party:"ambPA",bedroom:"ambN"}[R.bg]||"none",ambV={ambR:.45,ambW:.45,ambA:.5,ambP:.3,ambG:.7,ambPA:.6,ambN:.8}[amb]||.9;
  later(qd||0,function(){musicHold(true);var keepAmb=G2.prevAmb===amb;if(G2.prevAmb&&!keepAmb)fadeSnd(G2.prevAmb,.5);G2.prevAmb=null;if(keepAmb)sndVol(amb,ambV,.5);else play(amb,ambV);
  say(idx*2,function(){
    VE.setAttribute("opacity",0);anim(.6,function(u){VE.setAttribute("opacity",(.4*eio(u)).toFixed(3))});bgBlur(true);
    later(.6,function(){ticks=ticks.filter(function(f){return f!==o.tick})});
    later(.25,function(){K=makeKid(R.kind,KL,768,930,1.3);if(R.noShirt&&K.under.lastChild)K.under.lastChild.setAttribute("opacity",0);(R.base||[]).forEach(function(k){drawItem(ITEMS[k],K,null)});kids.push(K);K.op=0;anim(.5,function(u){var e=eout(u);K.op=e;K.hop=-24*(1-e)})});
    /* полка: шесть вещей по три с каждой стороны, порядок случайный */
    later(.5,function(){
      var keys=R.ok.concat(R.no),ord=keys.slice();for(var q=ord.length-1;q>0;q--){var w=Math.floor(Math.random()*(q+1)),t=ord[q];ord[q]=ord[w];ord[w]=t}
      var nL=Math.ceil(ord.length/2),nR=ord.length-nL;function slot(i){var left=i<nL,n=left?nL:nR,j=left?i:i-nL,y=(n===3?[400,645,890]:n===2?[522,768]:[645])[j];return [left?215:1321,y]}
      ord.forEach(function(k,i){var T=makeTile(k,slot(i),TL,K,R.ok.indexOf(k)>=0);tiles.push(T);T.g.setAttribute("opacity",0);anim(.4,function(u){T.g.setAttribute("opacity",eio(u).toFixed(2))},null,i*.06)});
      later(.5,function(){canDrag=true;sndVol(amb,ambV*.35,1.2)})});
    later(1.2,function(){cueSnd([DRESS_SND].concat(CART_SND[R.cartoon]||[],["star"]));say(idx*2+1,function(){
      /* подсказка — только в первом раунде звезды: одна нужная вещь сама тянется к ребёнку */
      if(CUR_STAR===2&&idx===0&&worn===0&&!drag){var T=tiles.filter(function(t){return t.ok&&!t.done})[0];var p0={x:T.cx,y:T.cy};anim(1.4,function(u){if(T.done||(drag&&drag.T===T)||T.hintStop){T.hintStop=true;return}var s=Math.sin(Math.PI*u)*.45;T.cx=lerp(p0.x,768,s);T.cy=lerp(p0.y,600,s);placeTile(T)},function(){if(T.hintStop||T.done)return;T.cx=p0.x;T.cy=p0.y;placeTile(T)})}})})})});
  function makeTile(key,pos,parent,Kref,ok){var it=ITEMS[key],T={key:key,it:it,ok:ok,home:{x:pos[0],y:pos[1]},cx:pos[0],cy:pos[1],s:1};
    T.plate=el("rect",{x:pos[0]-116,y:pos[1]-228,width:232,height:236,fill:"#000",opacity:0},parent);
    T.g=el("g",{style:"cursor:grab"},parent);T.inner=el("g",{},T.g);if(it.icon)it.icon(T.inner);else drawItem(it,null,T.inner);
    var sh=castShadow(T.inner,T.g,6,8,.2,4);
    var bb=T.inner.getBBox();T.bc={x:bb.x+bb.width/2,y:bb.y+bb.height/2};var fit=it.fit||1;T.s0=Math.min(196*fit/bb.width,186*fit/bb.height,1.3);T.s=T.s0;
    T.home.y=pos[1]-112;T.cy=T.home.y;placeTile(T);
    el("rect",{x:bb.x-20,y:bb.y-20,width:bb.width+40,height:bb.height+40,fill:"#000",opacity:0},T.inner);
    var grab=function(e){if(!canDrag||T.done||drag)return;e.preventDefault();var p=svgPt(e);drag={T:T,dx:T.cx-p.x,dy:T.cy-p.y,id:e.pointerId};try{SVG.setPointerCapture(e.pointerId)}catch(_){}
      parent.appendChild(T.g);T.s=T.s0*1.08;placeTile(T)};
    /* брать вещь можно за всю ячейку полки, а не только за саму картинку */
    T.g.addEventListener("pointerdown",grab);T.plate.addEventListener("pointerdown",grab);T.plate.style.cursor="grab";
    return T}
  function placeTile(T){T.g.setAttribute("transform","translate("+f1(T.cx)+" "+f1(T.cy)+") scale("+T.s.toFixed(3)+") translate("+f1(-T.bc.x)+" "+f1(-T.bc.y)+")")}
  G2.move=function(e){if(!drag)return;var p=svgPt(e);drag.T.cx=p.x+drag.dx;drag.T.cy=p.y+drag.dy;placeTile(drag.T)};
  G2.up=function(e){if(!drag)return;var T=drag.T;drag=null;var onKid=T.cx>380&&T.cx<1156;
    if(onKid&&T.ok){T.done=true;canDrag=false;
      /* на место: центр вещи туда, где она будет на ребёнке, масштаб ребёнка */
      var AT=T.it.at||[0,0],tx=K.x+(AT[0]+T.bc.x)*K.gs,ty=K.gy+(AT[1]+T.bc.y)*K.gs,x0=T.cx,y0=T.cy,s0=T.s,P=T.it.pose&&K.pose[T.it.side],pa=P?P.a:0,pb=P?P.b:0;
      anim(.26,function(u){var e=eio(u);T.cx=lerp(x0,tx,e);T.cy=lerp(y0,ty,e);T.s=lerp(s0,K.gs,e);placeTile(T);if(P){P.a=lerp(pa,T.it.pose.a,e);P.b=lerp(pb,T.it.pose.b,e)}},function(){
        T.g.remove();drawItem(T.it,K,null);if(T.it.onWear)T.it.onWear(K);play(DRESS_SND);anim(.3,function(u){K.sq=Math.sin(Math.PI*u)*.025});worn++;
        if(worn>=need)later(.6,finish);else canDrag=true})}
    else{var x0=T.cx,y0=T.cy;anim(.2,function(u){var e=eio(u);T.cx=lerp(x0,T.home.x,e);T.cy=lerp(y0,T.home.y,e);T.s=lerp(T.s0*1.08,T.s0,e);placeTile(T)})}};
  function finish(){if(!elFor(amb))play(amb,ambV*.35);sndVol(amb,ambV,1.0);var cb0=cb;cb=function(){fadeSnd(amb,1.5);G2.prevAmb=null;cb0()};anim(1.8,function(u){var e=eio(u);CAM=[lerp(0,77,e),lerp(0,51,e),lerp(1536,1382,e),lerp(1024,921,e)]},null,.3);bgBlur(false);ticks.push(o.tick);anim(.6,function(u){VE.setAttribute("opacity",(.4*(1-eio(u))).toFixed(3));TL.setAttribute("opacity",(1-eio(u)).toFixed(2))});
    later(.5,function(){CARTOONS[R.cartoon]?CARTOONS[R.cartoon](K,o,{g:g},cb):R.cartoon==="bubbles"?cartoonBubbles():R.cartoon==="puddle"?cartoonPuddle():R.cartoon==="snowball"?snowballCartoon(K,o,FX,cb):leavesCartoon(K,o,FX,cb)})}
  function cartoonBubbles(){var A1=K.arms[1],P1=K.pose[1],tmp={x:50,a:0,b:0};g.appendChild(o.bubL);
    /* палочка для пузырей в правой руке, колечко у рта */
    var W=el("g",{opacity:0},K.body);Ln(W,"M0 0 L-14 -44","#FE88A8",6);el("circle",{cx:-18,cy:-56,r:13,fill:"none",stroke:"#FE88A8","stroke-width":6},W);
    var bubs=[],emit=false,live=function(t,dt){var hp=handPos({x:50,a:P1.a,b:P1.b});W.setAttribute("transform","translate("+f1(hp.x)+" "+f1(hp.y)+")");
      if(emit&&Math.random()<dt*7){var rx=K.x+(hp.x-18)*K.gs,ry=K.gy+(hp.y-56-K.hop)*K.gs,b={x:rx,y:ry,vx:rr(60,160),vy:-rr(50,110),r:rr(10,22),t:t,life:rr(2.2,3.2),ph:rr(0,6)};
        b.g=el("g",{},o.bubL);el("circle",{r:1,fill:"#FFFFFF",opacity:.25},b.g);el("circle",{r:1,fill:"none",stroke:"#ADC6FD","stroke-width":3},b.g);el("circle",{r:1,fill:"#FFFFFF",opacity:.9},b.g);bubs.push(b)}
      if(!emit&&W.done&&!bubs.length){ticks=ticks.filter(function(f){return f!==live});return}
      bubs=bubs.filter(function(b){var a=t-b.t;if(a>b.life){b.g.remove();return false}b.x+=b.vx*dt;b.y+=b.vy*dt;b.vy-=6*dt;var r=b.r*Math.min(1,a/.4);
        b.g.setAttribute("transform","translate("+f1(b.x+Math.sin(t*2+b.ph)*10)+" "+f1(b.y)+")");var c=b.g.children;c[0].setAttribute("r",f1(r));c[1].setAttribute("r",f1(r));c[2].setAttribute("r",f1(r*.22));c[2].setAttribute("cx",f1(-r*.4));c[2].setAttribute("cy",f1(-r*.4));return true})};
    ticks.push(live);
    /* поднимает палочку ко рту и дует; пузыри летят; потом радуется */
    anim(.6,function(u){var e=eio(u);armTo(tmp,lerp(60,90,e),lerp(-150,-292,e),1);P1.a=lerp(-10,tmp.a,e);P1.b=lerp(0,tmp.b,e);W.setAttribute("opacity",Math.min(1,u*3).toFixed(2))},function(){
      emit=true;K.p.blow=true;play("bubbles",.5);later(3.0,function(){play("bubbles",.5)});anim(5.6,function(u){K.p.tilt=Math.sin(u*Math.PI*5)*2},function(){emit=false;K.p.blow=false;K.p.happy=true;
        anim(.5,function(u){var e=eio(u);P1.a=lerp(tmp.a,-10,e);P1.b=lerp(tmp.b,0,e)},function(){W.remove();W.done=true;later(.5,cb)})})})}
  function cartoonPuddle(){var x0=K.x,x1=920,L=K.pose[-1],LT=[0,.5,1.15,1.8],t0=clock,tt=0,land=0,go=false,a=play("splash",.4);
    /* ждём начала звука (не дольше 0,3 с), дальше прыжки идут по часам игры — плавно, без подстройки под звук на лету */
    var live=function(){if(!go){var at=(a&&a.__k==="splash"&&!a.paused)?a.currentTime:0;if(at>0){go=true;t0=clock-at}else if(clock-t0>.3){go=true;t0=clock}else return}tt=clock-t0;
      if(tt>=1.8){if(land<3){land=3;splash(K.x,950,.9);anim(.18,function(u){K.sq=Math.sin(Math.PI*u)*.06})}K.hop=0;L.a=10;ticks=ticks.filter(function(f){return f!==live});K.p.happy=true;later(.5,cb);return}
      var j=tt<.5?0:tt<1.15?1:2,u=(tt-LT[j])/(LT[j+1]-LT[j]);if(j>land){land=j;splash(K.x,950,.9);anim(.18,function(v){K.sq=Math.sin(Math.PI*v)*.06})}
      if(j===0)K.x=lerp(x0,x1,eio(u));K.hop=Math.sin(Math.PI*u)*(j===0?120:80);L.a=lerp(10,j===0?60:50,Math.sin(Math.PI*u))};
    ticks.push(live)}}
function endPreview(){musicHold(true);later(.1,function(){praise()});later(1.6,function(){if(G2.prevAmb){fadeSnd(G2.prevAmb,1.2);G2.prevAmb=null}starDone(CUR_STAR-1,afterStar)})}
SVG.addEventListener("pointermove",function(e){if(G2.move)G2.move(e)});
SVG.addEventListener("pointerup",function(e){if(G2.up)G2.up(e)});
SVG.addEventListener("pointercancel",function(e){if(G2.up)G2.up(e)});
function starScript(){var o=[];STARS[CUR_STAR].forEach(function(R,i){o.push({who:"Раунд "+(i+1)+" · фон",txt:R.ctx,v:BGV[R.bg]});o.push({who:"Раунд "+(i+1)+" · задание",txt:R.task,v:R.kind==="girl"?"d":"m"})});return o}

/* ───────── звезда ───────── */
var starBacks=[].slice.call(document.querySelectorAll(".sg-starback")),BIG=document.getElementById("sg-bigstar");
function starDone(slot,cb){play("star");launchFireworks();BIG.style.display="block";var gr=GAME.getBoundingClientRect(),br=starBacks[slot].getBoundingClientRect();
  var dx=br.left+br.width/2-(gr.left+gr.width/2),dy=br.top+br.height/2-(gr.top+gr.height/2),bw=BIG.offsetWidth||150,ts=br.width/(bw||150)*.9;
  anim(.45,function(u){BIG.style.transform="translate(-50%,-50%) scale("+back(u).toFixed(3)+")"},function(){
    anim(.7,function(u){var e=eio(u);BIG.style.transform="translate(calc(-50% + "+(dx*e).toFixed(1)+"px),calc(-50% + "+(dy*e).toFixed(1)+"px)) scale("+lerp(1,ts,e).toFixed(3)+")"},function(){
      BIG.style.display="none";starBacks[slot].classList.add("sg-earned");starBacks[slot].classList.remove("sg-pulse");void starBacks[slot].offsetWidth;starBacks[slot].classList.add("sg-pulse");if(cb)later(.8,cb)},.3)})}
var fwC=document.getElementById("sg-fireworks"),c2d=fwC.getContext("2d"),fwP=[],fwRun=false,fwRaf=null;
function launchFireworks(){fwC.width=GAME.offsetWidth;fwC.height=GAME.offsetHeight;fwP=[];fwRun=true;spawnBurst();spawnBurst();if(!fwRaf)fwLoop();setTimeout(function(){fwRun=false},1500)}
function spawnBurst(){var x=.2+Math.random()*.6,y=.1+Math.random()*.5,cols=["#6DCC0B","#F97A4F","#FED224","#E4615C","#6B91D6","#FC88A7"],col=cols[Math.floor(Math.random()*cols.length)];
  for(var i=0;i<26;i++){var a=Math.random()*Math.PI*2,v=1.5+Math.random()*3.5;fwP.push({x:x*fwC.width,y:y*fwC.height,vx:Math.cos(a)*v,vy:Math.sin(a)*v,alpha:1,r:2+Math.random()*2.5,color:col})}}
function fwLoop(){c2d.clearRect(0,0,fwC.width,fwC.height);fwP.forEach(function(q){q.x+=q.vx;q.y+=q.vy;q.vy+=.12;q.alpha-=.018;c2d.globalAlpha=Math.max(0,q.alpha);c2d.beginPath();c2d.arc(q.x,q.y,q.r,0,Math.PI*2);c2d.fillStyle=q.color;c2d.fill()});
  fwP=fwP.filter(function(q){return q.alpha>0});if(fwRun&&Math.random()<.08)spawnBurst();if(fwP.length||fwRun)fwRaf=requestAnimationFrame(fwLoop);else{fwRaf=null;c2d.clearRect(0,0,fwC.width,fwC.height)}}


/* ───────── ход игры: вступление → звёзды 2, 3, 4 → финал ───────── */
function $id(i){return document.getElementById(i)}
function mark(){}
var mode="intro",started=false,loadedReady=false,STAGE=$id("sg-stage");
function reset(keepStars){tok++;tw=[];ticks=[];kids=[];splashes=[];ROOT.innerHTML="";FX.innerHTML="";BGROOT.innerHTML="";bgBlur(false);musicHold(true);drag=null;G2={};camFn=null;CAM=[0,0,1536,1024];
  stopAll(true);
  if(!keepStars)starBacks.forEach(function(b){b.classList.remove("sg-earned","sg-pulse")});BIG.style.display="none"}
function prepare(keepStars){reset(keepStars);
  if(mode==="intro"){setScript(INTRO_SCRIPT);buildIntro();show(S1);
    S1.live=null;CAM=[S1.x0,0,1536,1024];var o=S1;ticks.push(function(t){o.R.setAttribute("transform","translate(768 1200) scale(1.6)")})}
  else{setScript(starScript());
    /* до старта звезды стоит тот же фон, что будет в раунде, и с той же камерой — без скачка */
    var o=bgFor(STARS[CUR_STAR][START_R],START_R),bgG=el("g",{},BGROOT);bgG.appendChild(o.g);ticks.push(o.tick);CAM=[77,51,1382,921];G2.prev={g:el("g",{},ROOT),bg:bgG};G2.instant=true;earnedBefore()}}
/* смена звезды без пустого экрана и без копий сцены: пока строится следующая звезда, на экране стоит последний кадр, затем сразу новая сцена */
function goStar(n){var t0=Date.now();(function w(){/* сначала даём догореть салюту: сборка новой звезды занимает поток, и салют бы замер */
  if(fwRaf&&Date.now()-t0<900){setTimeout(w,60);return}fwRun=false;fwP=[];c2d.clearRect(0,0,fwC.width,fwC.height);
  /* смена звезды так же, как смена раунда: последний кадр уходит в отдельную группу (пересчитанную под камеру нового раунда),
     новая звезда строится под ней, старая плавно гаснет сверху. Сцену не копируем — те же элементы просто переносим. */
  var c=CAM.slice(),N=[77,51,1382,921],k=N[2]/c[2],tr="translate("+f1(N[0]-c[0]*k)+" "+f1(N[1]-c[1]*k)+") scale("+k.toFixed(4)+")";
  var oG=el("g",{transform:tr}),oB=el("g",{transform:tr});while(ROOT.firstChild)oG.appendChild(ROOT.firstChild);while(BGROOT.firstChild)oB.appendChild(BGROOT.firstChild);FX.innerHTML="";
  tok++;tw=[];ticks=[];kids=[];splashes=[];camFn=null;drag=null;musicHold(true);
  stopAll(true);
  ROOT.appendChild(oG);BGROOT.appendChild(oB);G2={prev:{g:oG,bg:oB}};CAM=N.slice();
  mode="star";CUR_STAR=n;START_R=0;setScript(starScript());earnedBefore();runStar2()})()}
function afterStar(){if(mode==="intro"){goStar(2);return}if(CUR_STAR<4){goStar(CUR_STAR+1);return}
  play("fanfare");launchFireworks();showEnd()}
function showEnd(){setTimeout(function(){$id("sg-end-overlay").classList.add("sg-show")},1500)}
function restartGame(){$id("sg-end-overlay").classList.remove("sg-show");mode="intro";CUR_STAR=2;START_R=0;prepare(false);later(.6,runIntro)}
$id("sg-endbtn").addEventListener("click",restartGame);
$id("sg-nextbtn").addEventListener("click",function(){try{window.top.location.href=NEXT_GAME_URL}catch(e){window.location.href=NEXT_GAME_URL}});

/* 🔊 — повторить последнюю фразу; 🎶 — фоновая музыка (по умолчанию выключена) */
/* 🔊 в звёздах 2–4 повторяет условие раунда («Мы идём в спортзал»), затем задание */
$id("sg-repeat").addEventListener("click",function(){if(!started||LASTI==null||!SCRIPT[LASTI])return;
  if(voiceBusy())return;var i=LASTI;
  if(mode!=="intro"&&i%2===1)i--;var d=sayVoice(SCRIPT[i].v)||voiceLen(SCRIPT[i].txt);
  if(mode!=="intro"&&SCRIPT[i+1])later(d,function(){sayVoice(SCRIPT[i+1].v)})});
$id("sg-music").addEventListener("click",function(){musicOn=!musicOn;this.classList.toggle("sg-off",!musicOn);musicHold(musicHeld)});
/* вкладка скрыта — звук на паузу, вернулись — продолжаем то, что играло */
var hiddenPlaying=[];
document.addEventListener("visibilitychange",function(){
  if(document.hidden){hiddenPlaying=[];SALL.forEach(function(a){if(!a.paused){hiddenPlaying.push(a);try{a.pause()}catch(e){}}})}
  else{hiddenPlaying.forEach(function(a){var p=a.play();if(p&&p.catch)p.catch(function(){})});hiddenPlaying=[]}});

/* ───────── загрузка: всё скачивается заранее в память (blob), полоска — собачка ───────── */
var loaded=0,total=0,loadRevealed=false;
function tickLoad(){loaded++;if(window.__uzorProgress)window.__uzorProgress(loaded/total);if(loaded>=total){if(window.__uzorFinish)window.__uzorFinish(revealStart);else setTimeout(revealStart,300)}}
function revealStart(){if(loadRevealed)return;loadRevealed=true;buildAudio();onLoaded()}
function grab(u,ok,bad){fetch(u).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){var x=u;try{x=URL.createObjectURL(b)}catch(e){}ok(x)}).catch(bad)}
(function(){var urls=[],seen={};Object.keys(A.snd).forEach(function(k){var u=A.snd[k];if(!seen[u]){seen[u]=1;urls.push(u)}});urls=urls.concat(PRAISE);
  total=urls.length+VNAMES.length+1;
  urls.forEach(function(u){grab(u,function(x){objUrls[u]=x;tickLoad()},tickLoad)});
  VNAMES.forEach(function(k){var u=REPO+k+".m4a";fetch(u).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(function(b){var d=mp4Dur(b);if(d)VDUR[k]=d;
    var x=u;try{x=URL.createObjectURL(new Blob([b],{type:"audio/mp4"}))}catch(e){}VURL[k]=x;tickLoad()}).catch(function(){VURL[k]=u;tickLoad()})});
  var im=new Image();im.onload=im.onerror=tickLoad;im.src=A.star})();
function onLoaded(){$id("sg-loading").style.display="none";loadedReady=true;if(isPhone())syncMobileUI();else $id("sg-start-overlay").style.display="flex"}
$id("sg-start-btn").addEventListener("click",function(){$id("sg-start-overlay").style.display="none";unlock();started=true;syncMobileUI();prepare(false);later(.6,runIntro)});

/* ─── полноэкранный режим и поворот телефона (как в первой игре «Гардероб») ─── */
var game=GAME,fsWrap=$id("sg-fs-wrap"),rotEl=$id("sg-rotate"),canRealFS=!!(fsWrap.requestFullscreen||fsWrap.webkitRequestFullscreen),pseudoFS=false;
function isLandscape(){return window.matchMedia("(orientation: landscape)").matches||window.innerWidth>window.innerHeight}
function isPhone(){return Math.min(window.screen.width,window.screen.height)<480}
function inRealFS(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function isFS(){return pseudoFS||inRealFS()}
var FS_E='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2B3A5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14,4 20,4 20,10"/><line x1="20" y1="4" x2="13.5" y2="10.5"/><polyline points="10,20 4,20 4,14"/><line x1="4" y1="20" x2="10.5" y2="13.5"/></svg>';
var FS_C='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2B3A5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="4" x2="14" y2="10"/><polyline points="14,4 14,10 20,10"/><line x1="4" y1="20" x2="10" y2="14"/><polyline points="10,20 10,14 4,14"/></svg>';
var fsIcon=null;function setFsIcon(){var w=isFS()?"c":"e";if(w===fsIcon)return;fsIcon=w;$id("sg-fs").innerHTML=w==="c"?FS_C:FS_E}
function refreshFsBtn(){$id("sg-fs").style.display=isPhone()?"none":"flex";setFsIcon()}
function lockLandscape(){try{if(screen.orientation&&screen.orientation.lock){var p=screen.orientation.lock("landscape");if(p&&p.catch)p.catch(function(){})}}catch(e){}}
function unlockOrientation(){try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}}
function pseudoOn(){if(!pseudoFS){pseudoFS=true;fsWrap.classList.add("sg-pseudo-fs");document.documentElement.style.overflow="hidden";document.body.style.overflow="hidden"}refreshFsBtn()}
function pseudoOff(){if(pseudoFS){pseudoFS=false;fsWrap.classList.remove("sg-pseudo-fs");document.documentElement.style.overflow="";document.body.style.overflow=""}refreshFsBtn()}
function syncMobileUI(){
  if(!isPhone()){game.classList.remove("sg-portrait");rotEl.classList.remove("sg-show");return}
  if(!loadedReady){game.classList.toggle("sg-portrait",!isLandscape());rotEl.classList.remove("sg-show");return}
  if(isLandscape()){game.classList.remove("sg-portrait");pseudoOn();rotEl.classList.remove("sg-show");if(!started)$id("sg-start-overlay").style.display="flex"}
  else{game.classList.add("sg-portrait");pseudoOff();if(!started)$id("sg-start-overlay").style.display="none";rotEl.classList.add("sg-show")}}
function enterFS(){if(canRealFS){var req=fsWrap.requestFullscreen||fsWrap.webkitRequestFullscreen;try{var p=req.call(fsWrap);if(p&&p.then)p.then(lockLandscape).catch(pseudoOn);else lockLandscape()}catch(e){pseudoOn()}}else pseudoOn();refreshFsBtn()}
function exitFS(){if(inRealFS()){var ex=document.exitFullscreen||document.webkitExitFullscreen;try{ex.call(document)}catch(e){}unlockOrientation()}pseudoOff();refreshFsBtn()}
$id("sg-fs").addEventListener("click",function(){if(isFS())exitFS();else enterFS()});
document.addEventListener("fullscreenchange",function(){if(!inRealFS())unlockOrientation();syncMobileUI();refreshFsBtn()});
document.addEventListener("webkitfullscreenchange",function(){if(!inRealFS())unlockOrientation();syncMobileUI();refreshFsBtn()});
window.addEventListener("orientationchange",function(){setTimeout(function(){syncMobileUI();refreshFsBtn()},250)});
var rzT=null;window.addEventListener("resize",function(){if(rzT)clearTimeout(rzT);rzT=setTimeout(function(){syncMobileUI();refreshFsBtn()},200)});
syncMobileUI();refreshFsBtn();
prepare(false);

/* ───────── кадр: шаг не больше 34 мс, провалы не догоняем ───────── */
var last=performance.now();
function frame(now){var dt=Math.min(.034,(now-last)/1000);last=now;step(dt,started);requestAnimationFrame(frame)}
function step(dt,run){if(run){clock+=dt;stepTw()}if(camFn)camFn();applyCam();ticks.forEach(function(f){f(clock,run?dt:0)});kids.forEach(function(K){poseKid(K,clock)});drawSplash(dt)}
requestAnimationFrame(frame);
/* для проверки в консоли: __sg.star(n) — сразу к звезде n (2–4), __sg.ff(сек) — промотать время */
window.__sg={star:function(n){mode="star";CUR_STAR=n;START_R=0;started=true;prepare(true);later(.6,runStar2)},ff:function(sec){var n=Math.round(sec/.03);for(var i=0;i<n;i++)step(.03,true)},G2:function(){return G2}};
})();
