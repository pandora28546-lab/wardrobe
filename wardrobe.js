
/* Игра «Гардероб» — движок. Логика интерфейса как в «Повелительном наклонении». */
(function(){
"use strict";
/* ───────── базовые помощники ───────── */
var NS="http://www.w3.org/2000/svg",SVG=document.getElementById("sg-sc");
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function f1(v){return (Math.round(v*10)/10).toString()}
function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,a,b){return v<a?a:v>b?b:v}
var seed=7;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
function rr(a,b){return a+(b-a)*rnd()}
function eio(u){return u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2}
function eout(u){return 1-Math.pow(1-u,3)}
function back(u){var c=1.6;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2)}
var DEFS=el("defs",{},SVG),UID=0;

/* ───────── зерно бумаги: только пол ───────── */
(function(){var c=document.createElement("canvas");c.width=c.height=180;var g=c.getContext("2d"),d=g.createImageData(180,180);
  for(var i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=0;d.data[i+3]=Math.round(Math.random()*11.5)}
  g.putImageData(d,0,0);var p=el("pattern",{id:"grain",width:180,height:180,patternUnits:"userSpaceOnUse"},DEFS);el("image",{href:c.toDataURL(),width:180,height:180},p)})();
var wg=el("linearGradient",{id:"water",x1:0,y1:0,x2:0,y2:1},DEFS);el("stop",{offset:0,"stop-color":"#B8E0E0"},wg);el("stop",{offset:1,"stop-color":"#6B91D6"},wg);
var dc=el("clipPath",{id:"drumClip"},DEFS);el("circle",{cx:1220,cy:670,r:132},dc);

/* ───────── комната ───────── */
var ROOM=el("g",{},SVG);
el("rect",{x:0,y:0,width:1536,height:1024,fill:"#D3E2FF"},ROOM);
el("rect",{x:0,y:830,width:1536,height:30,fill:"#ADC6FD"},ROOM);
el("rect",{x:0,y:858,width:1536,height:170,fill:"#FDE6C4"},ROOM);
[905,960,1012].forEach(function(y){el("path",{d:"M0 "+y+" H1536",stroke:"#F8B888","stroke-width":3,opacity:.55},ROOM)});
el("rect",{x:0,y:858,width:1536,height:170,fill:"url(#grain)","pointer-events":"none"},ROOM);
el("ellipse",{cx:800,cy:915,rx:230,ry:46,fill:"#CCB4E6"},ROOM);
el("ellipse",{cx:800,cy:915,rx:196,ry:34,fill:"#D8CCE6"},ROOM);
var SH={wd:el("ellipse",{cx:325,cy:878,rx:290,ry:20,fill:"#2C3A5C",opacity:.13},ROOM),
        wm:el("ellipse",{cx:1220,cy:902,rx:240,ry:18,fill:"#2C3A5C",opacity:.13},ROOM),
        it:el("ellipse",{cx:800,cy:905,rx:110,ry:12,fill:"#2C3A5C",opacity:0},ROOM)};

/* ───────── шкаф ───────── */
var WD=el("g",{},SVG);
function rpath(d,fill,p,w){return el("path",{d:d,fill:fill,stroke:fill,"stroke-width":w||12,"stroke-linejoin":"round"},p)}
rpath("M90 165 L34 196 L34 808 L90 838 Z","#D3A598",WD);rpath("M80 205 L48 222 L48 782 L80 798 Z","#C77A62",WD,8);
rpath("M560 165 L616 196 L616 808 L560 838 Z","#D3A598",WD);rpath("M570 205 L602 222 L602 782 L570 798 Z","#C77A62",WD,8);
[[122,840],[528,840]].forEach(function(p){el("rect",{x:p[0]-16,y:p[1]-6,width:32,height:40,rx:14,fill:"#985037"},WD)});
el("rect",{x:90,y:150,width:470,height:696,rx:16,fill:"#C77A62"},WD);
el("rect",{x:72,y:126,width:506,height:36,rx:14,fill:"#985037"},WD);
el("rect",{x:112,y:180,width:206,height:420,rx:10,fill:"#985037"},WD);
el("rect",{x:334,y:180,width:204,height:420,rx:10,fill:"#985037"},WD);
el("path",{d:"M118 232 H312",stroke:"#E3E2E3","stroke-width":10,"stroke-linecap":"round"},WD);
[124,306].forEach(function(x){el("circle",{cx:x,cy:232,r:9,fill:"#D3A598"},WD)});
var SHELF_Y=[306,446,586];
SHELF_Y.forEach(function(y){el("rect",{x:334,y:y,width:204,height:14,rx:5,fill:"#D3A598"},WD)});
[[112,616,206,86],[334,616,204,86],[112,714,426,108]].forEach(function(r){el("rect",{x:r[0],y:r[1],width:r[2],height:r[3],rx:12,fill:"#D3A598"},WD);
  el("rect",{x:r[0]+r[2]/2-30,y:r[1]+r[3]/2-7,width:60,height:14,rx:7,fill:"#FDE8C7"},WD)});
var HANG=el("g",{},SVG),FOLD=el("g",{},SVG);

/* ───────── стиральная машина ───────── */
var WMo=el("g",{},SVG),WM=el("g",{},WMo);
[[1040,880],[1400,880]].forEach(function(p){el("rect",{x:p[0]-18,y:p[1]-4,width:36,height:22,rx:8,fill:"#908B90"},WM)});
el("rect",{x:1000,y:380,width:440,height:504,rx:34,fill:"#FFFFFF"},WM);
el("path",{d:"M1000 470 V414 Q1000 380 1034 380 H1406 Q1440 380 1440 414 V470 Z",fill:"#E3E2E3"},WM);
el("ellipse",{cx:1130,cy:425,rx:74,ry:24,fill:"#2C3A5C"},WM);
var LEDS=[0,1,2].map(function(i){return el("circle",{cx:1100+i*26,cy:425,r:6,fill:"#575757"},WM)});
var LED_OK=el("circle",{cx:1180,cy:425,r:7,fill:"#575757"},WM);
[[1322,"#9DBBFF"],[1386,"#6B91D5"]].forEach(function(k){el("circle",{cx:k[0],cy:425,r:24,fill:k[1]},WM);el("path",{d:"M"+k[0]+" 425 V407",stroke:"#FFFFFF","stroke-width":5,"stroke-linecap":"round"},WM)});
el("circle",{cx:1220,cy:670,r:176,fill:"#E3E2E3"},WM);
el("circle",{cx:1220,cy:670,r:134,fill:"#20477C"},WM);
var DRUM=el("g",{"clip-path":"url(#drumClip)"},WM);
var DRUMR=el("g",{},DRUM);           // вращается: дырочки + вещи
for(var a=0;a<12;a++){var an=a/12*Math.PI*2;el("circle",{cx:1220+Math.cos(an)*104,cy:670+Math.sin(an)*104,r:6,fill:"#0044D3",opacity:.6},DRUMR)}
for(a=0;a<6;a++){an=a/6*Math.PI*2+.3;el("circle",{cx:1220+Math.cos(an)*56,cy:670+Math.sin(an)*56,r:5,fill:"#0044D3",opacity:.6},DRUMR)}
var LOAD=el("g",{},DRUMR);
var WATER=el("path",{d:"",fill:"url(#water)",opacity:.75},DRUM);
var BUB=el("g",{},DRUM);var bubbles=[];for(a=0;a<12;a++)bubbles.push({e:el("circle",{r:f1(rr(4,9)),fill:"#FFFFFF",opacity:0},BUB),x:rr(1110,1330),p:rr(0,1),v:rr(.35,.7)});
var DOOR=el("g",{},WM);
el("circle",{cx:1220,cy:670,r:156,fill:"none",stroke:"#C6D2E4","stroke-width":26},DOOR);
el("circle",{cx:1220,cy:670,r:138,fill:"none",stroke:"#ACB3C6","stroke-width":12},DOOR);
var GLASS=el("circle",{cx:1220,cy:670,r:132,fill:"#2C3A5C",opacity:.22},DOOR);
var GHL=el("path",{d:"M1130 600 A112 112 0 0 1 1236 560",stroke:"#FFFFFF","stroke-width":16,"stroke-linecap":"round",fill:"none",opacity:.35},DOOR);
el("rect",{x:1376,y:640,width:18,height:60,rx:9,fill:"#ACB3C6"},DOOR);

/* ───────── сушилка (звезда 3) ───────── */
var RACK=el("g",{display:"none"},SVG);
el("ellipse",{cx:1220,cy:888,rx:240,ry:14,fill:"#2C3A5C",opacity:.13},RACK);
[[1040,1010],[1040,1076],[1400,1366],[1400,1432]].forEach(function(l){el("path",{d:"M"+l[0]+" 430 L"+l[1]+" 880",stroke:"#ACB3C6","stroke-width":12,"stroke-linecap":"round"},RACK)});
[[650,8],[690,8]].forEach(function(r){el("path",{d:"M1050 "+r[0]+" H1390",stroke:"#C6D2E4","stroke-width":r[1],"stroke-linecap":"round"},RACK)});
el("path",{d:"M1010 430 H1430",stroke:"#C6D2E4","stroke-width":12,"stroke-linecap":"round"},RACK);
var RACKC=el("g",{},RACK),RSLOTS=[[1110,430],[1220,430],[1330,430],[1110,650],[1220,650],[1330,650]].map(function(a){return {x:a[0],y:a[1],o:null,n:0}}),rackN=0;
/* ───────── гладильная доска (звезда 4) ───────── */
var BOARD=el("g",{display:"none"},SVG);
el("ellipse",{cx:1220,cy:888,rx:230,ry:14,fill:"#2C3A5C",opacity:.13},BOARD);
el("path",{d:"M1090 612 L1350 880 M1350 612 L1090 880",stroke:"#908B90","stroke-width":12,"stroke-linecap":"round"},BOARD);
[1090,1350].forEach(function(x){el("rect",{x:x-22,y:872,width:44,height:14,rx:7,fill:"#575757"},BOARD)});
el("path",{d:"M1004 606 Q1004 592 1030 590 H1360 Q1462 594 1474 606 Q1462 622 1360 626 H1030 Q1004 622 1004 606Z",fill:"#BC91E6"},BOARD);
el("path",{d:"M1004 598 Q1004 582 1030 580 H1360 Q1462 584 1474 598 Q1462 612 1360 616 H1030 Q1004 614 1004 598Z",fill:"#CCB4E6"},BOARD);
var BOARDC=el("g",{},BOARD);
var IRON=el("g",{},BOARD);
el("path",{d:"M-62 0 L54 0 Q76 0 68 -14 Q52 -42 0 -44 L-62 -44 Q-68 -44 -68 -38 L-68 -6 Q-68 0 -62 0Z",fill:"#FF8725"},IRON);
el("rect",{x:-68,y:-8,width:140,height:8,rx:4,fill:"#E3E2E3"},IRON);
el("path",{d:"M-50 -44 Q-44 -78 -4 -76 Q28 -76 36 -44",stroke:"#DF8615","stroke-width":14,fill:"none","stroke-linecap":"round"},IRON);
el("circle",{cx:-6,cy:-24,r:7,fill:"#FFD326"},IRON);
var STEAM=el("g",{},BOARD),steams=[];for(var q=0;q<8;q++)steams.push({e:el("circle",{r:12,fill:"#FFFFFF",opacity:0},STEAM),t:-9,x:0,y:0});
var IRON_REST={x:1418,y:582};function ironAt(x,y,r,flip){IRON.setAttribute("transform","translate("+f1(x)+" "+f1(y)+") rotate("+f1(r||0)+") scale("+(flip?-1:1)+" 1)")}ironAt(IRON_REST.x,IRON_REST.y);
function puff(x,y){var s0=steams.filter(function(p){return clock-p.t>1})[0];if(s0){s0.t=clock;s0.x=x;s0.y=y}}
function drawSteam(){steams.forEach(function(p){var u=(clock-p.t)/1;if(u<0||u>1){p.e.setAttribute("opacity",0);return}
  p.e.setAttribute("transform","translate("+f1(p.x+Math.sin(u*5)*8)+" "+f1(p.y-u*90)+") scale("+(.6+u*1.2).toFixed(2)+")");p.e.setAttribute("opacity",(.75*(1-u)).toFixed(2))})}

var FLY=el("g",{},SVG),IRONL=el("g",{display:"none"},SVG);IRONL.appendChild(IRON);IRONL.appendChild(STEAM);var GAL=el("g",{display:"none"},SVG),STINK=el("g",{"pointer-events":"none"},SVG);
/* подсказка-сонар: через 3 с бездействия — вокруг верного места (шкаф или машинка) */
var HINT=el("g",{"pointer-events":"none",opacity:0},SVG),hintAt=1e9,WAVES=[0,1,2].map(function(){return el("circle",{r:100,fill:"none",stroke:"#6B91D6","stroke-width":4,"vector-effect":"non-scaling-stroke",opacity:0},HINT)});
function hideHint(){hintAt=1e9;HINT.setAttribute("opacity",0)}
function drawHint(){var c=introHintTarget();if(mode!=="game"||!c||clock<hintAt){HINT.setAttribute("opacity",0);return}HINT.setAttribute("opacity",1);
  var hx=clock-hintAt;
  WAVES.forEach(function(w,i){var q=hx-i*1.2;if(q<0){w.setAttribute("opacity",0);return}var u=(q%3.6)/3.6,k=1-Math.pow(1-u,2);
    w.setAttribute("transform","translate("+c.x+" "+c.y+") scale("+(.5+1.3*k).toFixed(3)+")");w.setAttribute("opacity",(.8*(1-k)).toFixed(3))})}

/* ───────── одежда ───────── */
var CAT=[
 {t:"tee",   n:"Футболка",           c:"#FFFFFF",d:"#C6D2E4",to:"hang", st:[[-22,30,22,"juice","splat"],[32,74,12,"juice"]]},
 {t:"card",  n:"Кофта",              c:"#BC91E6",d:"#86278D",to:"hang", st:[[-36,46,22,"mud","smear"]]},
 {t:"shirt", n:"Рубашка",            c:"#9DBBFF",d:"#6B91D5",to:"hang", st:[[-30,52,26,"markerB","scribble"],[100,40,13,"ink"]]},
 {t:"pants", n:"Джинсы",             c:"#6B91D5",d:"#20477C",to:"fold",shelf:2,btn:1, st:[[-48,94,24,"mud","splat"],[46,98,22,"mud"]]},
 {t:"pants", n:"Брюки",              c:"#FEC981",d:"#DF8615",to:"fold",shelf:2, st:[[-40,30,20,"grass","smear"],[46,86,18,"mud","splat"]]},
 {t:"shorts",n:"Шорты",              c:"#85A74D",d:"#248C43",to:"fold",shelf:1, st:[[-42,22,20,"grass","smear"]]},
 {t:"tee",   n:"Футболка с цветком", c:"#CCB4E6",d:"#BC91E6",to:"hang",print:1, st:[[-6,52,30,"markerR","scribble"]]},
 {t:"skirt", n:"Юбка",               c:"#FDD1DD",d:"#FE88A8",to:"fold",shelf:1, st:[[40,30,24,"mud","splat"]]},
 {t:"dress", n:"Платье",             c:"#FFD326",d:"#D2B205",to:"hang",pat:"flowers", st:[[-12,-58,18,"juice"],[30,44,16,"juice","splat"]]},
 {t:"tank",  n:"Майка",              c:"#908B90",d:"#575757",to:"fold",shelf:0, st:[[-8,34,30,"grass","smear"]]},
 {t:"boxers",n:"Трусы",              c:"#ADC6FD",d:"#6B91D5",to:"fold",shelf:0, st:[[-42,0,18,"olive","splat"]]},
 {t:"vest",  n:"Жилет",              c:"#FF8725",d:"#DF8615",to:"hang", st:[[-30,10,22,"ink"],[40,70,20,"ink","splat"]]},
 {t:"long",  n:"Лонгслив",           c:"#FFFFFF",d:"#4D9E10",p:"#71CB0D",to:"hang",pat:"stripes", st:[[18,30,28,"markerB","scribble"]]},
 {t:"socks", n:"Носки",              c:"#FFFFFF",d:"#C6D2E4",p:"#6B91D5",to:"fold",shelf:0,stripe:1, st:[[-40,96,34,"soot","smear",4],[30,108,34,"soot","smear",4],[18,82,14,"mud"],[90,96,14,"mud"],[-86,62,16,"soot","splat"]]},
 {t:"hood",  n:"Худи",               c:"#B6D58C",d:"#85A74D",to:"hang", st:[[-30,46,26,"mud","splat"]]},
 {t:"socks", n:"Носки с сердечками", c:"#FFE0CF",d:"#FAB78E",p:"#FC3529",to:"fold",shelf:0,pat:"hearts", st:[[-40,96,34,"soot","smear",4],[30,108,34,"soot","smear",4],[88,96,14,"mud"]]}
];
var STAIN={mud:["#985037",.75],grass:["#4D9E10",.55],ink:["#2C3A5C",.55],juice:["#CF0043",.5],olive:["#A2A24D",.85],soot:["#575757",.62],markerB:["#0044D3",.9],markerR:["#FC3529",.9]};
/* стили пятен: blob — клякса, splat — брызги, smear — мазок, scribble — фломастер */
function drawStain(p,a,k){k=k||1;var x=a[0],y=a[1],r=a[2]*k,c=STAIN[a[3]],st=a[4]||"blob";
  if(st==="scribble"){var d="M"+f1(x-r)+" "+f1(y);for(var i=1;i<=7;i++)d+=" Q"+f1(x-r+(i-.5)*r*.32+(i%2?r*.35:-r*.35))+" "+f1(y+(i%2?-r*.95:r*.95))+" "+f1(x-r+i*r*.32)+" "+f1(y+(i%2?-r*.2:r*.2));
    el("path",{d:d,stroke:c[0],"stroke-width":f1(9*k),fill:"none","stroke-linecap":"round","stroke-linejoin":"round",opacity:c[1]},p);
    el("path",{d:"M"+f1(x-r*.7)+" "+f1(y+r*.75)+" q"+f1(r*.5)+" "+f1(-r*.4)+" "+f1(r*1.3)+" "+f1(-r*.1),stroke:c[0],"stroke-width":f1(6*k),fill:"none","stroke-linecap":"round",opacity:c[1]},p);return}
  if(st==="smear"){el("path",{d:blobD(0,0,r),transform:"translate("+f1(x)+" "+f1(y)+") rotate("+(a[5]==null?-28:a[5])+") scale(1.7 .5)",fill:c[0],opacity:c[1]},p);return}
  el("path",{d:blobD(x,y,st==="splat"?r*.75:r),fill:c[0],opacity:c[1]},p);
  if(st==="splat")for(i=0;i<5;i++){var an=rr(0,6.28),dd=r*rr(1.05,1.6);el("circle",{cx:f1(x+Math.cos(an)*dd),cy:f1(y+Math.sin(an)*dd),r:f1(r*rr(.12,.24)),fill:c[0],opacity:c[1]},p)}}
function blobD(x,y,r){var n=8,p=[];for(var i=0;i<n;i++){var a=i/n*Math.PI*2,k=r*rr(.7,1.2);p.push([x+Math.cos(a)*k,y+Math.sin(a)*k])}
  var d="M"+f1((p[0][0]+p[1][0])/2)+" "+f1((p[0][1]+p[1][1])/2);
  for(i=1;i<=n;i++){var a1=p[i%n],a2=p[(i+1)%n];d+=" Q"+f1(a1[0])+" "+f1(a1[1])+" "+f1((a1[0]+a2[0])/2)+" "+f1((a1[1]+a2[1])/2)}return d+"Z"}
function heart(x,y,s){return "M"+f1(x)+" "+f1(y+s*.9)+" C"+f1(x-s*1.4)+" "+f1(y-s*.1)+" "+f1(x-s*.6)+" "+f1(y-s*1.1)+" "+f1(x)+" "+f1(y-s*.35)+" C"+f1(x+s*.6)+" "+f1(y-s*1.1)+" "+f1(x+s*1.4)+" "+f1(y-s*.1)+" "+f1(x)+" "+f1(y+s*.9)+"Z"}

var LONG="M-58 -104 Q0 -84 58 -104 L96 -84 L118 70 L92 76 L64 -20 L62 108 L-62 108 L-64 -20 L-92 76 L-118 70 L-96 -84 Z";
var SOCK="M-22 -96 L22 -96 L22 26 Q22 56 52 60 L76 62 Q100 66 96 90 Q92 110 62 108 L8 106 Q-24 102 -24 66 Z";
var SHAPE={
 tee:function(k){k.B("M-58 -104 Q0 -84 58 -104 L104 -66 L82 -26 L60 -38 L60 108 L-60 108 L-60 -38 L-82 -26 L-104 -66 Z");k.pat();
   k.L("M-30 -101 Q0 -74 30 -101",k.d,9);k.L("M84 -32 L100 -62",k.d,8);k.L("M-84 -32 L-100 -62",k.d,8);if(k.s.print)k.flower(0,-26,20)},
 long:function(k){k.B(LONG);k.pat();k.L("M-30 -101 Q0 -74 30 -101",k.d,9);k.cuffs();k.L("M-58 102 H58",k.d,10)},
 shirt:function(k){k.B(LONG);k.pat();k.F("M-42 -104 L-4 -64 L-50 -72 Z",k.d);k.F("M42 -104 L4 -64 L50 -72 Z",k.d);k.L("M0 -62 V106",k.d,4);
   [-36,-2,32,66].forEach(function(y){k.C(0,y,5,k.d)});k.L("M22 -40 H54 V-10 Q38 -2 22 -10 Z",k.d,4);k.cuffs()},
 card:function(k){k.B(LONG);k.pat();k.F("M-30 -100 L0 -34 L30 -100 Q0 -88 -30 -100 Z","#FFFFFF");k.L("M0 -34 V106",k.d,4);
   [-12,22,56,88].forEach(function(y){k.C(0,y,6,k.d)});k.L("M-60 102 H60",k.d,12);k.cuffs()},
 hood:function(k){k.B("M-52 -96 Q-68 -162 0 -164 Q68 -162 52 -96 Z");k.B(LONG);k.pat();
   k.F("M-34 -98 Q-38 -140 0 -142 Q38 -140 34 -98 Q0 -86 -34 -98 Z",k.d);
   k.F("M-48 28 H48 L62 84 H-62 Z",k.d);k.L("M-14 -88 V-42","#FFFFFF",5);k.L("M14 -88 V-42","#FFFFFF",5);k.C(-14,-40,5,"#FFFFFF");k.C(14,-40,5,"#FFFFFF");k.cuffs();k.L("M-60 102 H60",k.d,12)},
 dress:function(k){k.B("M-40 -104 Q0 -86 40 -104 L46 -22 L-46 -22 Z");k.B("M-46 -26 L46 -26 L104 110 Q0 124 -104 110 Z");
   k.B("M-40 -104 Q-82 -112 -82 -78 Q-76 -56 -46 -62 Z");k.B("M40 -104 Q82 -112 82 -78 Q76 -56 46 -62 Z");k.pat();
   k.L("M-46 -24 H46",k.d,8);k.L("M-22 -100 V-84 H22 V-100",k.d,6)},
 vest:function(k){k.B("M-46 -104 Q0 -92 46 -104 L70 -76 L74 108 L-74 108 L-70 -76 Z");k.pat();
   k.F("M-46 -104 L-42 -124 Q0 -114 42 -124 L46 -104 Q0 -92 -46 -104 Z",k.d);
   [-40,10,60].forEach(function(y){k.L("M-70 "+y+" H70",k.d,4)});k.L("M0 -100 V106","#FFFFFF",5);k.L("M-56 34 L-46 74",k.d,6);k.L("M56 34 L46 74",k.d,6)},
 tank:function(k){k.B("M-36 -112 L-22 -112 Q0 -74 22 -112 L36 -112 Q40 -72 62 -52 L60 108 L-60 108 L-62 -52 Q-40 -72 -36 -112 Z");k.pat();
   k.L("M-22 -108 Q0 -76 22 -108",k.d,7);k.L("M36 -108 Q40 -72 60 -54",k.d,6);k.L("M-36 -108 Q-40 -72 -60 -54",k.d,6)},
 pants:function(k){k.B("M-64 -112 L64 -112 L76 112 L16 112 L2 -20 L-2 -20 L-16 112 L-76 112 Z");k.pat();
   k.L("M-64 -104 H64",k.d,16);k.L("M0 -94 V-30",k.d,4);k.L("M-58 -90 Q-42 -62 -22 -92",k.d,4);k.L("M58 -90 Q42 -62 22 -92",k.d,4);
   k.L("M-74 104 H-20",k.d,8);k.L("M74 104 H20",k.d,8);if(k.s.btn)k.C(0,-104,5,"#FFD326")},
 shorts:function(k){k.B("M-70 -60 L70 -60 L84 48 L12 56 L2 0 L-2 0 L-12 56 L-84 48 Z");k.pat();k.L("M-70 -52 H70",k.d,16);
   k.L("M-4 -46 Q-20 -30 -12 -18","#FFFFFF",4);k.L("M4 -46 Q20 -30 12 -18","#FFFFFF",4);k.L("M-82 42 L-16 50",k.d,8);k.L("M82 42 L16 50",k.d,8)},
 skirt:function(k){k.B("M-56 -56 L56 -56 L100 70 Q0 84 -100 70 Z");k.pat();[-34,-12,12,34].forEach(function(x){k.L("M"+x+" -54 L"+(x*2)+" 74",k.d,4)});
   k.F("M-56 -78 H56 V-56 H-56 Z",k.d)},
 boxers:function(k){k.B("M-66 -52 L66 -52 L74 40 L14 46 L0 8 L-14 46 L-74 40 Z");k.pat();k.L("M-66 -44 H66",k.d,16);k.L("M0 -34 V2",k.d,4)},
 socks:function(k){["translate(-66 -6)","translate(6 6)"].forEach(function(tf){k.B(SOCK,tf)});k.pat();
   ["translate(-66 -6)","translate(6 6)"].forEach(function(tf){var g=el("g",{transform:tf},k.g);k.L("M-22 -82 H22",k.d,16,g);if(k.s.stripe){k.L("M-22 -60 H22",k.s.p,6,g);k.L("M-22 -48 H22",k.s.p,6,g)}})}
};
/* мятая вещь: весь рисунок слегка изогнут волной, край чуть неровный, на ткани мягкие тени складок */
function WP(x,y){return [x+8*Math.sin(y*.045+1.3)+5*Math.sin((x+y)*.07+.4),y+7*Math.sin(x*.05+2.1)+5*Math.sin((x-y)*.06+1)]}
function warpD(d,zig){var tk=d.match(/[MmLlHhVvQqTtCcZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)||[],i=0,cmd="",x=0,y=0,sx=0,sy=0,qx=null,qy=null,pts=[],out="";
  function num(){return parseFloat(tk[i++])}
  function seg(n,f){for(var j=1;j<=n;j++)pts.push(f(j/n))}
  function flush(closed){if(pts.length<2){pts=[];return}var o2=pts.map(function(p,j){var px=p[0],py=p[1];
      if(zig&&j>0&&j<pts.length-1){var a=pts[j-1],b=pts[j+1],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1,z=(j%2?3:-3);px+=-ty/L*z;py+=tx/L*z}
      var w=WP(px,py);return f1(w[0])+" "+f1(w[1])});out+="M"+o2[0]+" L"+o2.slice(1).join(" L")+(closed?"Z ":" ");pts=[]}
  while(i<tk.length){if(/[A-Za-z]/.test(tk[i]))cmd=tk[i++];var rel=cmd===cmd.toLowerCase(),C=cmd.toUpperCase(),ox=rel?x:0,oy=rel?y:0;
    if(C==="Z"){flush(true);x=sx;y=sy;qx=null;continue}
    if(C==="M"){flush(false);x=ox+num();y=oy+num();sx=x;sy=y;pts=[[x,y]];cmd=rel?"l":"L";qx=null;continue}
    if(C==="L"||C==="H"||C==="V"){var nx=C==="V"?x:ox+num(),ny=C==="H"?y:(C==="V"?oy+num():oy+num());if(C==="H")ny=y;
      if(C==="V"){nx=x}var x0=x,y0=y,n=Math.max(1,Math.ceil(Math.hypot(nx-x0,ny-y0)/12));seg(n,function(t){return [lerp(x0,nx,t),lerp(y0,ny,t)]});x=nx;y=ny;qx=null;continue}
    if(C==="Q"||C==="T"){var cx,cy;if(C==="Q"){cx=ox+num();cy=oy+num()}else{cx=qx==null?x:2*x-qx;cy=qy==null?y:2*y-qy}var ex2=ox+num(),ey2=oy+num(),x1=x,y1=y;
      n=Math.max(2,Math.ceil((Math.hypot(cx-x1,cy-y1)+Math.hypot(ex2-cx,ey2-cy))/12));seg(n,function(t){var m=1-t;return [m*m*x1+2*m*t*cx+t*t*ex2,m*m*y1+2*m*t*cy+t*t*ey2]});qx=cx;qy=cy;x=ex2;y=ey2;continue}
    if(C==="C"){var c1x=ox+num(),c1y=oy+num(),c2x=ox+num(),c2y=oy+num(),e3x=ox+num(),e3y=oy+num(),x2=x,y2=y;
      n=Math.max(3,Math.ceil((Math.hypot(c1x-x2,c1y-y2)+Math.hypot(c2x-c1x,c2y-c1y)+Math.hypot(e3x-c2x,e3y-c2y))/12));
      seg(n,function(t){var m=1-t;return [m*m*m*x2+3*m*m*t*c1x+3*m*t*t*c2x+t*t*t*e3x,m*m*m*y2+3*m*m*t*c1y+3*m*t*t*c2y+t*t*t*e3y]});x=e3x;y=e3y;qx=null;continue}
    i++}
  flush(false);return out.trim()}
var FOLDS=[[-40,-50,30,-30],[30,-10,34,40],[-20,40,36,-15],[40,78,26,-40],[-50,92,22,20]];
function makeClothes(s,dirty,parent,ex){ex=ex||{};
  var g=el("g",{},parent),id="cl"+(++UID),cp=el("clipPath",{id:id},DEFS),pg=null;
  var W=ex.wr?function(d,z){return warpD(d,z)}:function(d){return d};
  var k={s:s,g:g,d:s.d,
    B:function(d,tf){d=W(d,true);var a={d:d,fill:s.c,stroke:s.c,"stroke-width":14,"stroke-linejoin":"round","stroke-linecap":"round"};if(tf)a.transform=tf;el("path",a,g);var b={d:d};if(tf)b.transform=tf;el("path",b,cp)},
    pat:function(){pg=el("g",{"clip-path":"url(#"+id+")"},g);
      if(s.pat==="stripes")for(var y=-96;y<120;y+=28)el("path",{d:W("M-130 "+y+" H130"),stroke:s.p,"stroke-width":11},pg);
      if(s.pat==="flowers")for(var r=0;r<5;r++)for(var c=0;c<6;c++)k.flower(-100+c*40+(r%2)*20,-96+r*44,9,pg);
      if(s.pat==="hearts")for(r=0;r<6;r++)for(c=0;c<6;c++)el("path",{d:W(heart(-90+c*34+(r%2)*17,-80+r*34,7)),fill:s.p},pg)},
    L:function(d,col,w,p){return el("path",{d:W(d),stroke:col,"stroke-width":w,fill:"none","stroke-linecap":"round","stroke-linejoin":"round"},p||g)},
    F:function(d,col){return el("path",{d:W(d),fill:col,stroke:col,"stroke-width":6,"stroke-linejoin":"round"},g)},
    C:function(x,y,r,col){var w=ex.wr?WP(x,y):[x,y];return el("circle",{cx:f1(w[0]),cy:f1(w[1]),r:r,fill:col},g)},
    cuffs:function(){k.L("M94 64 L116 58",k.d,14);k.L("M-94 64 L-116 58",k.d,14)},
    flower:function(x,y,r,p){p=p||g;if(ex.wr){var w0=WP(x,y);x=w0[0];y=w0[1]}for(var i=0;i<5;i++){var a=i/5*Math.PI*2-Math.PI/2;el("circle",{cx:f1(x+Math.cos(a)*r*.62),cy:f1(y+Math.sin(a)*r*.62),r:f1(r*.5),fill:"#FFFFFF"},p)}el("circle",{cx:x,cy:y,r:f1(r*.36),fill:"#FF8725"},p)}
  };
  SHAPE[s.t](k);
  var cg=el("g",ex.wr?{"clip-path":"url(#"+id+")"}:{opacity:0},g);
  if(ex.wr)FOLDS.forEach(function(f){var tf="translate("+f[0]+" "+f[1]+") rotate("+f[3]+") scale(1.9 .32)";
    el("path",{d:blobD(0,0,f[2]),transform:tf,fill:"#2C3A5C",opacity:.14},cg);
    el("path",{d:blobD(0,-18,f[2]*.8),transform:tf,fill:"#FFFFFF",opacity:.28},cg)});
  var wg=el("g",ex.wet?{"clip-path":"url(#"+id+")"}:{opacity:0},g);if(ex.wet){el("rect",{x:-160,y:-200,width:320,height:340,fill:"#20477C",opacity:.32},wg);
  [[-40,-30,26],[36,40,30],[-10,80,22]].forEach(function(a){el("path",{d:blobD(a[0],a[1],a[2]),fill:"#20477C",opacity:.18},wg)})}
  var sg=el("g",dirty?{"clip-path":"url(#"+id+")"}:{opacity:0},g);
  if(dirty)s.st.forEach(function(a){drawStain(sg,a)});
  return {g:g,stains:sg,wet:wg,cr:cg,clip:cp,remove:function(){g.remove();cp.remove()}};
}
function makeFolded(s,dirty,parent){
  var g=el("g",{},parent),w=s.t==="socks"?116:150;
  el("rect",{x:-w/2,y:-24,width:w,height:48,rx:14,fill:s.c},g);
  el("rect",{x:-w/2+6,y:8,width:w-12,height:10,rx:5,fill:s.d,opacity:.7},g);
  if(s.pat==="stripes")[-40,-6,28].forEach(function(x){el("rect",{x:x,y:-24,width:14,height:48,fill:s.p},g)});
  if(s.pat==="flowers")[-46,-10,26,56].forEach(function(x,i){el("circle",{cx:x,cy:i%2?-4:-12,r:6,fill:"#FFFFFF"},g)});
  if(s.pat==="hearts")[-30,0,30].forEach(function(x){el("path",{d:heart(x,-8,7),fill:s.p},g)});
  if(s.stripe)el("rect",{x:-w/2+6,y:-14,width:w-12,height:6,rx:3,fill:s.p},g);
  if(s.print)el("circle",{cx:0,cy:-6,r:8,fill:"#FFFFFF"},g);
  var sg=el("g",{opacity:dirty?1:0},g);if(dirty){var a0=s.st[0];drawStain(sg,[w*.2,-4,a0[4]==="scribble"?22:13,a0[3],a0[4]==="scribble"?"scribble":"blob"],a0[4]==="scribble"?.6:1)}
  return {g:g,remove:function(){g.remove()}};
}

/* ───────── запах ───────── */
var stinkMode=2,stinks=[];
function addStink(anchor,gal){var o={anchor:anchor,gal:!!gal,g:el("g",{},STINK),ph:rr(0,3),parts:[]};buildStink(o);stinks.push(o);return o}
function buildStink(o){while(o.g.firstChild)o.g.firstChild.remove();o.parts=[];
  if(stinkMode===1){for(var i=0;i<4;i++){var pg=el("g",{},o.g);[[0,0,15],[17,-4,19],[33,2,13]].forEach(function(c){el("circle",{cx:c[0]-16,cy:c[1],r:c[2],fill:"#B6D58C"},pg)});o.parts.push(pg)}}
  else{for(i=0;i<3;i++)o.parts.push(el("path",{d:"",stroke:"#85A74D","stroke-width":10,"stroke-linecap":"round",fill:"none"},o.g))}
  if(stinkMode===2){var fl=el("g",{},o.g);el("ellipse",{cx:0,cy:0,rx:11,ry:8,fill:"#2D2E2C"},fl);el("circle",{cx:10,cy:-2,r:6,fill:"#2D2E2C"},fl);
    var w1=el("ellipse",{cx:-2,cy:-10,rx:10,ry:6,fill:"#FFFFFF",opacity:.85},fl),w2=el("ellipse",{cx:4,cy:-11,rx:9,ry:5,fill:"#E3E2E3",opacity:.85},fl);o.fly={g:fl,w1:w1,w2:w2}}else o.fly=null}
/* капли с мокрой вещи */
var DROP="M0 -10 C4 -4 8 1 8 5 A8 8 0 0 1 -8 5 C-8 1 -4 -4 0 -10Z",drips=[];
function addDrips(anchor,gal){var o={anchor:anchor,gal:!!gal,g:el("g",{},STINK),ph:rr(0,1)};o.d=[0,1,2].map(function(){return el("path",{d:DROP,fill:"#6B91D6"},o.g)});drips.push(o);return o}
function removeDrips(o){if(!o)return;o.g.remove();drips=drips.filter(function(x){return x!==o})}
function drawDrips(t){drips.forEach(function(o){var a=o.anchor();if(!a||(mode==="all")!==o.gal){o.g.setAttribute("opacity",0);return}o.g.setAttribute("opacity",a.op==null?1:a.op);
  o.d.forEach(function(e,i){var u=((t+i*.41+o.ph)%1.2)/1.2,x=a.x+[-.5,.05,.48][i]*a.w,y,sc,op;
    if(u<.35){y=a.y;sc=u/.35;op=1}else{var f=(u-.35)/.65;y=a.y+f*f*a.fall;sc=1;op=1-f*f*f}
    e.setAttribute("transform","translate("+f1(x)+" "+f1(y)+") scale("+(sc*a.s).toFixed(3)+")");e.setAttribute("opacity",op.toFixed(3))})})}
function removeStink(o){if(!o)return;o.g.remove();stinks=stinks.filter(function(x){return x!==o})}
function drawStinks(t){stinks.forEach(function(o){var a=o.anchor();if(!a||a.hide||(mode==="all")!==o.gal){o.g.setAttribute("opacity",0);return}
  o.g.setAttribute("opacity",a.op==null?1:a.op);var s=a.s,T=t+o.ph;
  if(stinkMode===1){o.parts.forEach(function(p,i){var u=((T+i*.65)%2.6)/2.6,x=a.x+[-50,30,-10,50][i]*s+Math.sin(T*1.6+i)*8*s,y=a.y-u*150*s,sc=(.5+u*.8)*s;
      p.setAttribute("transform","translate("+f1(x)+" "+f1(y)+") scale("+sc.toFixed(3)+")");p.setAttribute("opacity",(Math.sin(Math.PI*u)*.8).toFixed(3))})}
  else{o.parts.forEach(function(p,i){var u=((T+i*.8)%2.4)/2.4,x=a.x+[-44,0,44][i]*s,y=a.y-(10+u*120)*s,w=16*s*Math.sin(T*3+i*2),h=30*s;
      p.setAttribute("d","M"+f1(x)+" "+f1(y)+" q"+f1(w)+" "+f1(-h)+" 0 "+f1(-2*h)+" t0 "+f1(-2*h));p.setAttribute("stroke-width",f1(10*s));
      p.setAttribute("opacity",(Math.sin(Math.PI*u)*.85).toFixed(3))})}
  if(o.fly){var ft=T*1.7,fx=a.x+Math.cos(ft)*120*s,fy=a.y+30*s+Math.sin(ft*2)*36*s,fl=Math.sin(T*60)*.5+.5;
    o.fly.g.setAttribute("transform","translate("+f1(fx)+" "+f1(fy)+") scale("+(Math.cos(ft)>0?-s:s).toFixed(3)+" "+s.toFixed(3)+")");
    o.fly.w1.setAttribute("ry",f1(2+fl*5));o.fly.w2.setAttribute("ry",f1(2+(1-fl)*5))}})}

/* ───────── звук: HTMLAudio + blob-ссылки (Web Audio на iOS ломает звук) ───────── */
var REPO="https://cdn.jsdelivr.net/gh/pandora28546-lab/wardrobe@main/";
var G2="https://cdn.jsdelivr.net/gh/pandora28546-lab/sofia-game2@main/";
var DBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/Otvlekashki@main/";
var PBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/sofia-game-image@main/";
var NEXT_GAME_URL=(window.SG_CFG&&window.SG_CFG.next)||"https://sofiatmn.ru/";
var STAR_URL=G2+"Starsystems.png";
var objUrls={};function srcFor(u){return objUrls[u]||u}
var soundOn=true;
/* звуки игры (репо wardrobe) и общие звуки звезды и финала (репо Otvlekashki) */
var SND={wash:REPO+"wash.m4a",place:REPO+"place.m4a",rack:REPO+"rack.m4a",iron:REPO+"iron.m4a",
  step:REPO+"step.m4a",steps:REPO+"steps.m4a",grab:REPO+"grab.m4a",dress:REPO+"dress.m4a",tug:REPO+"tug.m4a",thumb:REPO+"thumb.m4a",
  star:DBASE+encodeURIComponent("stage complete.wav"),fanfare:DBASE+"fanfare.wav"};
var AUD={},STEPS=[],stepI=0;
function buildAudio(){Object.keys(SND).forEach(function(k){var a=new Audio();a.preload="auto";a.src=srcFor(SND[k]);AUD[k]=a});
  STEPS=[0,1,2].map(function(){var a=new Audio();a.preload="auto";a.src=srcFor(SND.step);return a})}
/* шаг звучит в момент, когда нога касается пола — из самой анимации, а не одним файлом */
function playStep(){if(!soundOn||!STEPS.length)return;var a=STEPS[stepI++%3];try{a.currentTime=0}catch(e){}var p=a.play();if(p&&p.catch)p.catch(function(){})}
function play(k){if(!soundOn)return;var a=AUD[k];if(!a)return;try{a.pause();a.currentTime=0}catch(e){}var p=a.play();if(p&&p.catch)p.catch(function(){})}
var SILENT="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
function unlockSpeech(){try{speechEl.src=SILENT;speechEl.__u=null;var p=speechEl.play();if(p&&p.then)p.then(function(){cueVoice("clean")}).catch(function(){cueVoice("clean")})}catch(e){}}
function unlock(){unlockSpeech();Object.keys(AUD).map(function(k){return AUD[k]}).concat(STEPS).forEach(function(a){a.muted=true;var p=a.play();if(p&&p.then)p.then(function(){a.pause();a.currentTime=0;a.muted=false}).catch(function(){a.muted=false});else a.muted=false})}

/* ───────── анимации ───────── */
var tw=[],clock=0;
function anim(dur,upd,done,delay){tw.push({t0:clock+(delay||0),d:dur,u:upd,cb:done})}
function stepTw(){var list=tw;tw=[];list.forEach(function(a){if(clock<a.t0){tw.push(a);return}var u=clamp((clock-a.t0)/a.d,0,1);a.u(u);if(u<1)tw.push(a);else if(a.cb)a.cb()})}
function later(sec,cb){anim(.0001,function(){},cb,sec)}

/* ───────── состояние игры ───────── */
var CX=800,CY=560,cur=null,phase="start",deck=[];
function newDeck(){var d=[],sp=CAT.slice();for(var q=sp.length-1;q>0;q--){var w=Math.floor(Math.random()*(q+1)),t=sp[q];sp[q]=sp[w];sp[w]=t}
  var R=Math.round(PER_STAR*.6);
  sp.slice(0,PER_STAR).forEach(function(s,i){var n={s:s};
    if(i<R){if(stage===1){var kind=i%3;n.stn=kind!==1;n.sm=kind!==0}if(stage===2)n.wet=true;if(stage===3)n.wr=true}
    d.push(n)});
  for(var i=d.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=d[i];d[i]=d[j];d[j]=x}return d}
function setT(o){o.wrap.setAttribute("transform","translate("+f1(o.x)+" "+f1(o.y)+") rotate("+f1(o.rot)+") scale("+o.s.toFixed(3)+")");
  o.inner.setAttribute("transform","scale("+o.sx.toFixed(3)+" "+o.sy.toFixed(3)+")")}
function makeObj(n,x,y,sc){var o={sp:n.s,stn:!!n.stn,sm:!!n.sm,wet:!!n.wet,wr:!!n.wr,x:x,y:y,rot:0,s:sc,sx:1,sy:1};o.wrap=el("g",{},FLY);o.inner=el("g",{},o.wrap);
  o.item=makeClothes(n.s,o.stn,o.inner,{wet:o.wet,wr:o.wr});
  o.stink=o.sm?addStink(function(){return o.gone?null:{x:o.x,y:o.y-118*o.s*o.sy,s:o.s,op:o.stinkOp==null?1:o.stinkOp}}):null;
  o.drip=o.wet?addDrips(function(){return o.gone?null:{x:o.x,y:o.y+104*o.s*o.sy,w:110*o.s,s:o.s,fall:150,op:o.stinkOp==null?1:o.stinkOp}}):null;
  setT(o);return o}
function dropObj(o){if(!o)return;o.gone=true;o.wrap.remove();o.item.clip.remove();removeStink(o.stink);removeDrips(o.drip)}
var PER_STAR=15,done=0,voiceUntil=0;
function spawn(){if(pendingStage!=null){applyStage(pendingStage);return}if(stage===0){startIntro();return}if(done>=PER_STAR){stageDone();return}if(!deck.length)deck=newDeck();var n=deck.pop();
  var o=makeObj(n,CX,CY+90,0);
  cur=o;phase="spawn";setT(o);
  anim(.5,function(u){o.s=1.2*back(u);o.y=CY+90*(1-eout(u));setT(o);SH.it.setAttribute("opacity",(.13*u).toFixed(3))},function(){phase="idle";o.t0=clock;hintAt=demo[sideOf(o)]?1e9:Math.max(clock+.8,voiceUntil+.3)})}
/* подсказка как в «Что к чему?»: вещь сама проплывает полпути к верному месту волной и возвращается.
   Только в начале звезды: один раз для «в шкаф» и один раз для «направо» — дальше подсказок нет */
var demo={};function sideOf(o){return (stage===1?isDirty(o):stage===2?o.wet:o.wr)?"r":"l"}
function targetPos(o){var right=stage===1?isDirty(o):stage===2?o.wet:o.wr;return right?(stage===1?{x:1220,y:640}:stage===2?{x:1220,y:500}:{x:1220,y:590}):{x:325,y:470}}
function idle(){if(!cur||phase!=="idle"||stage===0)return;var t=clock-cur.t0,ox=0,oy=0;
  if(clock>=hintAt){demo[sideOf(cur)]=true;var q=clock-hintAt,tg=targetPos(cur),vx=tg.x-CX,vy=tg.y-CY,len=Math.hypot(vx,vy)||1,ux=vx/len,uy=vy/len,reach=len*.5,amp=Math.min(len*.14,61),pp;
    if(q<1.3)pp=eio(q/1.3);else if(q<1.55)pp=1;else if(q<1.87){var r2=(q-1.55)/.32;pp=1-r2*r2}else{pp=0;hintAt=1e9}
    var wave=Math.sin(pp*Math.PI*3)*amp*Math.sin(pp*Math.PI);ox=ux*pp*reach-uy*wave;oy=uy*pp*reach+ux*wave}
  cur.x=CX+ox;cur.y=CY+Math.sin(t*2*Math.PI/2.2)*6+oy;cur.rot=Math.sin(t*2*Math.PI/3.1)*2;setT(cur)}

/* шкаф: вешалки и полки */
var SLOTS=[150,193,236,279].map(function(x){return {x:x,o:null,n:0}}),slotN=0;
var SHELVES=SHELF_Y.map(function(y){return {y:y,items:[]}});
function stackPos(sh,i){return {x:436+(i%2?5:-4),y:sh.y-15-i*29}}
function restack(sh){sh.items.forEach(function(it,i){var p=stackPos(sh,i);it.p=p;it.f.g.setAttribute("transform","translate("+f1(p.x)+" "+f1(p.y)+") scale(.62)")})}
function toWardrobe(){var o=cur;phase="anim";SH.it.setAttribute("opacity",0);
  if(o.sp.to==="fold")foldIt(o);else hangIt(o)}
function foldIt(o){play("place");var s0=o.s,sy0=o.sy;var sh=SHELVES[o.sp.shelf];if(sh.items.length>=4){var old=sh.items.shift();old.f.remove();removeStink(old.st);restack(sh)}
  var x0=o.x,y0=o.y,r0=o.rot,tgt=stackPos(sh,sh.items.length);
  anim(.22,function(u){var e=eio(u);o.sx=1-.5*e;o.sy=lerp(sy0,.94,e);o.rot=r0*(1-e);setT(o)});
  anim(.22,function(u){var e=eio(u);o.sy=.94-.58*e;setT(o)},function(){
    o.item.remove();o.sx=o.sy=1;makeFolded(o.sp,o.stn,o.inner);
    var sx=o.x,sy=o.y;anim(.45,function(u){var e=eio(u);o.x=lerp(sx,tgt.x,e);o.y=lerp(sy,tgt.y,e)-150*Math.sin(Math.PI*u);o.s=lerp(s0*.85,.62,e);setT(o)},function(){
      o.wrap.remove();var f=makeFolded(o.sp,o.stn,FOLD);var it={f:f,p:tgt};
      it.st=o.sm?addStink(function(){return {x:it.p.x,y:it.p.y-14,s:.42}}):null;removeStink(o.stink);
      sh.items.push(it);restack(sh);
      anim(.25,function(u){var k=1+Math.sin(Math.PI*u)*.12;f.g.setAttribute("transform","translate("+f1(it.p.x)+" "+f1(it.p.y)+") scale("+(.62*k).toFixed(3)+" "+(.62/k).toFixed(3)+")")});
      later(.45,spawn)})},.22)}
function hangIt(o){play("place");var s0=o.s,sy0=o.sy;var slot=SLOTS[0];SLOTS.forEach(function(s){if(!s.o&&slot.o)slot=s});if(slot.o)SLOTS.forEach(function(s){if(s.n<slot.n)slot=s});
  if(slot.o){var old=slot.o;slot.o=null;removeStink(old.st);anim(.25,function(u){old.g.setAttribute("opacity",1-u)},function(){old.g.remove();old.item.remove()})}
  var hg=el("g",{opacity:0},o.inner);el("path",{d:"M0 -186 q0 -14 12 -14 q12 0 12 12",stroke:"#908B90","stroke-width":7,fill:"none","stroke-linecap":"round"},hg);
  el("path",{d:"M0 -186 L-96 -118 H96 Z",fill:"none",stroke:"#A17269","stroke-width":10,"stroke-linejoin":"round"},hg);
  var x0=o.x,y0=o.y,r0=o.rot;
  anim(.25,function(u){var e=eio(u);hg.setAttribute("opacity",e);o.rot=r0*(1-e);o.y=y0-20*e;o.sy=lerp(sy0,1,e);setT(o)});
  anim(.64,function(u){var e=eio(u);o.x=lerp(x0,slot.x,e);o.y=lerp(y0-20,232+93,e)-120*Math.sin(Math.PI*u);o.s=lerp(s0,.5,e);setT(o)},function(){
    o.wrap.remove();removeStink(o.stink);
    var g=el("g",{},HANG),item=makeClothes(o.sp,o.stn,el("g",{transform:"translate(0 93) scale(.5)"},g));
    el("path",{d:"M0 0 q0 -7 6 -7 q6 0 6 6",stroke:"#908B90","stroke-width":4,fill:"none","stroke-linecap":"round"},g);
    el("path",{d:"M0 0 L-48 34 H48 Z",fill:"none",stroke:"#A17269","stroke-width":5,"stroke-linejoin":"round"},g);
    var h={g:g,item:item,ang:0};slot.o=h;slot.n=++slotN;
    h.st=o.sm?addStink(function(){var a=h.ang*Math.PI/180;return {x:slot.x-Math.sin(a)*40,y:232+40,s:.45,op:+g.getAttribute("opacity")||1}}):null;
    anim(1.6,function(u){var t=u*1.6;h.ang=14*Math.exp(-t*2.6)*Math.cos(t*9);g.setAttribute("transform","translate("+slot.x+" 232) rotate("+f1(h.ang)+")")});
    g.setAttribute("transform","translate("+slot.x+" 232) rotate(14)");
    later(.45,spawn)},.25)}

/* стиральная машина */
var drumAng=0,drumV=0,water=0,inLoad=[],washing=false;
function doorK(k){DOOR.setAttribute("transform","translate(1052 670) scale("+k.toFixed(3)+" 1) translate(-1052 -670)")}
function toWasher(){var o=cur;phase="anim";SH.it.setAttribute("opacity",0);play("wash");
  var x0=o.x,y0=o.y,r0=o.rot;
  anim(.3,function(u){doorK(1-.88*eio(u))});
  anim(.55,function(u){var e=eio(u);o.x=lerp(x0,1220,e);o.y=lerp(y0,670,e)-110*Math.sin(Math.PI*u);o.s=lerp(1.2,.5,e);o.rot=r0+200*e;setT(o)},function(){
    anim(.25,function(u){o.s=.5-.3*u;o.stinkOp=1-u;o.wrap.setAttribute("opacity",1-u*.6);setT(o)},function(){
      o.gone=true;o.wrap.remove();removeStink(o.stink);
      if(inLoad.length>=3){inLoad.shift().remove()}
      var lg=el("g",{},LOAD),pl=[[-38,20],[34,34],[0,-24]][inLoad.length%3];
      var a=rr(0,360);var c=makeClothes(o.sp,o.stn,el("g",{transform:"translate("+(1220+pl[0])+" "+(670+pl[1])+") rotate("+f1(a)+") scale(.4)"},lg));
      lg.cl=c;lg.remove2=function(){lg.remove();c.remove()};inLoad.push({remove:function(){lg.remove2()}});
      washRun(c)})});
  function washRun(c){anim(.25,function(u){doorK(.12+.88*eio(u))});
    later(.45,function(){washing=true;
      anim(.8,function(u){water=eout(u)});
      anim(3.2,function(u){var t=u*3.2;drumV=t<.8?t/.8:t>2.6?Math.max(0,(3.2-t)/.6):1;var on=Math.floor(t/.5)%3;LEDS.forEach(function(L,i){L.setAttribute("fill",i<=on?"#71CB0D":"#575757")});
        c.stains.setAttribute("opacity",clamp(1-(t-.6)/1.6,0,1).toFixed(3))},function(){drumV=0},.2);
      anim(.6,function(u){water=1-eio(u)},function(){washing=false;LEDS.forEach(function(L){L.setAttribute("fill","#575757")});
        LED_OK.setAttribute("fill","#71CB0D");later(.9,function(){LED_OK.setAttribute("fill","#575757")});later(.3,spawn)},3.0)})}
}
function drawWasher(dt){drumAng+=drumV*560*dt;DRUMR.setAttribute("transform","rotate("+f1(drumAng)+" 1220 670)");
  if(water>.001){var lvl=802-water*120,d="M1080 "+f1(lvl);for(var x=1080;x<=1360;x+=20)d+=" L"+x+" "+f1(lvl+Math.sin(x/28+clock*7)*7*(.4+drumV));WATER.setAttribute("d",d+" L1360 820 L1080 820Z")}
  else WATER.setAttribute("d","");
  bubbles.forEach(function(b){if(water<.2){b.e.setAttribute("opacity",0);return}b.p=(b.p+dt*b.v)%1;var lvl=802-water*120;
    b.e.setAttribute("cx",f1(b.x+Math.sin(clock*4+b.x)*6));b.e.setAttribute("cy",f1(lerp(800,lvl+8,b.p)));b.e.setAttribute("opacity",(.7*Math.sin(Math.PI*b.p)*Math.min(1,drumV+.3)).toFixed(3))});
  var sh=drumV>.6?(drumV-.6)*2.5:0;WMo.setAttribute("transform",sh?"translate("+f1((Math.random()-.5)*5*sh)+" "+f1((Math.random()-.5)*3*sh)+")":"")}

/* ───────── свайп ───────── */
var drag=null;
function pt(e){var r=SVG.getBoundingClientRect(),k=Math.min(r.width/1536,r.height/1024),ox=(r.width-1536*k)/2,oy=(r.height-1024*k)/2;return {x:(e.clientX-r.left-ox)/k,y:(e.clientY-r.top-oy)/k}}
SVG.addEventListener("pointerdown",function(e){if(mode==="game"&&stage===0&&phase==="intro"){introTap(pt(e));return}if(mode!=="game"||phase!=="idle"||!cur)return;var p=pt(e);if(Math.hypot(p.x-cur.x,p.y-cur.y)>200)return;
  e.preventDefault();try{SVG.setPointerCapture(e.pointerId)}catch(_){}drag={x0:p.x,y0:p.y,id:e.pointerId,hist:[{x:p.x,t:performance.now()}]};phase="drag";hideHint()});
SVG.addEventListener("pointermove",function(e){if(!drag||e.pointerId!==drag.id)return;var p=pt(e),dx=p.x-drag.x0,dy=p.y-drag.y0;
  cur.x=CX+dx;cur.y=CY+dy*.45;cur.rot=clamp(dx*.05,-18,18);setT(cur);drag.hist.push({x:p.x,t:performance.now()});if(drag.hist.length>6)drag.hist.shift()});
function endDrag(e){if(!drag)return;var h=drag.hist,v=h.length>1?(h[h.length-1].x-h[0].x)/Math.max(1,h[h.length-1].t-h[0].t):0,dx=cur.x-CX;drag=null;
  var side=dx<-120||(v<-.9&&dx<-30)?-1:dx>120||(v>.9&&dx>30)?1:0;choose(side)}
function isDirty(o){return o.stn||o.sm}
/* верно → шкаф/машинка; не туда → вещь отскакивает в центр, звук ошибки */
function choose(side){if(side===0){bounce(false);return}
  var right=stage===1?isDirty(cur):stage===2?cur.wet:cur.wr,want=right?1:-1;if(side!==want){bounce(true);return}
  demo[side<0?"l":"r"]=true;done++;hideHint();if(side<0)toWardrobe();else if(stage===1)toWasher();else if(stage===2)toRack();else toBoard()}
/* сушилка: мокрая вещь на прищепках, капает, потом высыхает */
function toRack(){var o=cur;phase="anim";SH.it.setAttribute("opacity",0);play("rack");
  var slot=RSLOTS[0];RSLOTS.forEach(function(s){if(!s.o&&slot.o)slot=s});if(slot.o)RSLOTS.forEach(function(s){if(s.n<slot.n)slot=s});
  if(slot.o){var old=slot.o;slot.o=null;anim(.25,function(u){old.g.setAttribute("opacity",1-u)},function(){old.g.remove();old.item.remove();removeDrips(old.dr)})}
  var x0=o.x,y0=o.y,r0=o.rot,s0=o.s;
  anim(.6,function(u){var e=eio(u);o.x=lerp(x0,slot.x,e);o.y=lerp(y0,slot.y+70,e)-100*Math.sin(Math.PI*u);o.s=lerp(s0,.6,e);o.rot=r0*(1-e);setT(o)},function(){
    removeDrips(o.drip);o.gone=true;o.wrap.remove();
    var g=el("g",{transform:"translate("+slot.x+" "+(slot.y+70)+")"},RACKC),item=makeClothes(o.sp,false,el("g",{transform:"scale(.6)"},g),{wet:true});
    [-34,34].forEach(function(x){el("rect",{x:x-6,y:-82,width:12,height:28,rx:5,fill:"#F97A4F"},g);el("rect",{x:x-6,y:-82,width:12,height:9,rx:4,fill:"#FEC981"},g)});
    var h={g:g,item:item,wetK:1};slot.o=h;slot.n=++rackN;
    h.dr=addDrips(function(){return stage===2&&mode==="game"?{x:slot.x,y:slot.y+132,w:66,s:.7,fall:870-(slot.y+132),op:h.wetK}:null});
    anim(.5,function(u){g.setAttribute("transform","translate("+slot.x+" "+(slot.y+70)+") rotate("+f1(8*Math.exp(-u*3)*Math.cos(u*14))+")")});
    anim(2.2,function(u){h.wetK=1-u;item.wet.setAttribute("opacity",(1-u).toFixed(3))},function(){removeDrips(h.dr);h.dr=null},1.4);
    later(.4,spawn)})}
/* гладильная доска: вещь ложится, утюг проходит три раза, складки уходят, потом вещь — в шкаф */
function toBoard(){var o=cur;phase="anim";SH.it.setAttribute("opacity",0);play("iron");
  var x0=o.x,y0=o.y,r0=o.rot,s0=o.s,BX=1190,BY=556,IY=592,W=95;
  anim(.5,function(u){var e=eio(u);o.x=lerp(x0,BX,e);o.y=lerp(y0,BY,e)-80*Math.sin(Math.PI*u);o.s=lerp(s0,.85,e);o.sy=lerp(1,.36,e);o.rot=r0*(1-e);setT(o)},function(){
    var wr=o.item,sm=makeClothes(o.sp,false,o.inner);o.inner.insertBefore(sm.g,wr.g);
    var idW="iw"+(++UID),idS="is"+(++UID),cW=el("clipPath",{id:idW},DEFS),cS=el("clipPath",{id:idS},DEFS),rW=el("rect",{x:-300,y:-300,width:600,height:600},cW),rS=el("rect",{x:300,y:-300,width:0,height:600},cS);
    wr.g.setAttribute("clip-path","url(#"+idW+")");sm.g.setAttribute("clip-path","url(#"+idS+")");
    function reveal(ix){var lx=(ix-o.x)/(o.s*o.sx);rW.setAttribute("width",f1(Math.max(0,lx+300)));rS.setAttribute("x",f1(lx));rS.setAttribute("width",f1(Math.max(0,300-lx)))}
    var revealed=false;
    anim(.25,function(u){var e=eio(u);ironAt(lerp(IRON_REST.x,BX+W,e),lerp(IRON_REST.y,IY,e)-30*Math.sin(Math.PI*u),true)});
    anim(1.8,function(u){var k=u*3,pass=Math.floor(k),f=k-pass,dir=pass%2?-1:1,a=BX+70*dir*-1,b=BX+70*dir;
      var x=pass%2?lerp(BX-W,BX+W,eio(f)):lerp(BX+W,BX-W,eio(f));if(pass>2)x=BX-W;
      ironAt(x,IY-Math.abs(Math.sin(f*Math.PI))*4,0,pass%2===0);if(Math.random()<.18)puff(x+(pass%2?60:-60),IY-10);
      if(!revealed){if(pass===0)reveal(x);else{revealed=true;wr.remove();cW.remove();cS.remove();sm.g.removeAttribute("clip-path");o.item=sm}}},function(){
      anim(.35,function(u){var e=eio(u);ironAt(lerp(BX-W,IRON_REST.x,e),lerp(IY,IRON_REST.y,e)-30*Math.sin(Math.PI*u),false)});
      o.wr=false;later(.15,function(){if(o.sp.to==="fold")foldIt(o);else hangIt(o)})},.25)})}
function bounce(bad){phase="anim";var x0=cur.x,y0=cur.y,r0=cur.rot;
  anim(.45,function(u){var e2=back(u);cur.x=lerp(x0,CX,e2);cur.y=lerp(y0,CY,e2);cur.rot=lerp(r0,0,e2);setT(cur)},function(){phase="idle";cur.t0=clock})}
SVG.addEventListener("pointerup",endDrag);SVG.addEventListener("pointercancel",endDrag);


/* ───────── звёзды-этапы ───────── */
var stage=0,pendingStage=null,started=false;
var NOTES_UNUSED=["Звезда-знакомство идёт сама: вещь, о которой говорит голос, выходит вперёд. В конце — сценка с девочкой, потом похвала и звезда.",
  "15 вещей на звезду: 9 «направо», 6 в шкаф. Чистую вещь смахните влево — в шкаф, грязную вправо — в машинку. Грязь бывает трёх видов: пятна, запах (волны и муха) или всё сразу. Подсказка показывается только в начале звезды: один раз для шкафа и один раз для машинки.",
  "Сухую вещь — в шкаф, мокрую (темнее, с неё капает) — на сушилку, в два яруса. На сушилке вещь высыхает.",
  "Гладкую вещь — в шкаф, мятую (складки) — на гладильную доску. После утюга она сама уходит в шкаф."];
function setStars(){starBacks.forEach(function(b,i){b.classList.toggle("sg-earned",i<stage);b.classList.remove("sg-pulse")})}
function setStage(k){if(!started){stage=k;showStage();return}
  if(phase==="idle"||phase==="start"||phase==="stagedone"||stage===0)applyStage(k);else pendingStage=k}
function showStage(){[[WMo,1],[RACK,2],[BOARD,3],[IRONL,3]].forEach(function(a){a[0].setAttribute("display",stage===a[1]?"inline":"none")});
  SH.wm.setAttribute("opacity",stage===1?.13:0);
  [WD,HANG,FOLD,SH.wd].forEach(function(g){g.setAttribute("display",stage===0?"none":"inline")});
  setStars()}
var TASK=[null,["task-dirty","Чистую одежду — в шкаф, грязную — в стиральную машину."],["task-wet","Сухую одежду — в шкаф, мокрую — на сушилку."],["task-wrinkled","Гладкую одежду — в шкаф, мятую — погладим утюгом."]];
function applyStage(k){vWait=null;camTo(CAM0);pendingStage=null;stage=k;demo={};done=0;voiceUntil=0;try{speechEl.pause()}catch(e){}$id("sg-end-overlay").classList.remove("sg-show");dropObj(cur);cur=null;introClear();hideHint();SH.it.setAttribute("opacity",0);deck=[];showStage();
  if(started){phase="start";if(k>0)voiceUntil=clock+voice(TASK[k][0],TASK[k][1]);later(.25,spawn)}}
/* знакомство: пары одной вещи сменяют друг друга сами. Вещь, о которой говорит голос, выходит вперёд и растёт,
   потом возвращается на место. В конце — сценка: девочка берёт из шкафа футболку, надевает и показывает «класс». */
var INTRO=[{i:0,b:{stn:1},ka:"clean",kb:"dirty",la:"Это чистая футболка.",lb:"Это грязная футболка. На ней пятна."},
  {i:1,b:{sm:1},ka:"smell-good",kb:"smell-bad",la:"Эта кофта пахнет приятно.",lb:"А эта кофта пахнет неприятно. Её надо постирать."},
  {i:3,b:{wet:1},ka:"dry",kb:"wet",la:"Это сухие джинсы.",lb:"Это мокрые джинсы. С них капает вода."},
  {i:2,b:{wr:1},ka:"smooth",kb:"wrinkled",la:"Это гладкая рубашка.",lb:"Это мятая рубашка. Её надо погладить."}];
var intro={k:0,items:[],tok:0,girl:null,finw:null};
function say(){}
function voiceLen(t){return .9+t.length*.065}           /* пока нет записи — длительность фразы по её длине */
/* голос Софьи: key → {src, len}; записи из репо игры подставляются сюда, без записи — текст под окном и оценка длины */
var VOICE={"clean":{url:REPO+"clean.m4a",len:1.65},"dirty":{url:REPO+"dirty.m4a",len:4.61},"smell-good":{url:REPO+"smell-good.m4a",len:3.83},"smell-bad":{url:REPO+"smell-bad.m4a",len:5.99},"dry":{url:REPO+"dry.m4a",len:1.78},"wet":{url:REPO+"wet.m4a",len:4.72},"smooth":{url:REPO+"smooth.m4a",len:1.68},"wrinkled":{url:REPO+"wrinkled.m4a",len:3.11},"wardrobe":{url:REPO+"wardrobe.m4a",len:7.12},"task-dirty":{url:REPO+"task-dirty.m4a",len:4.64},"task-wet":{url:REPO+"task-wet.m4a",len:4.30},"task-wrinkled":{url:REPO+"task-wrinkled.m4a",len:4.90}};
var PRAISE=[{url:PBASE+"Rock3.m4a",len:1.34},{url:PBASE+"Rock4.m4a",len:1.34},{url:PBASE+"Rock5.m4a",len:1.17},{url:PBASE+"Rock6.m4a",len:1.26},{url:PBASE+"Rock7.m4a",len:1.17},{url:PBASE+"Rock8.m4a",len:1.26},{url:PBASE+"Rock9.m4a",len:1.21}];
var ALL_AUDIO=Object.keys(SND).map(function(k){return SND[k]}).concat(Object.keys(VOICE).map(function(k){return VOICE[k].url}),PRAISE.map(function(p){return p.url}));
var speechEl=new Audio();speechEl.preload="auto";
/* играет фразу и возвращает её длину в секундах */
function voice(key,text){var v=VOICE[key];say(text||"");if(!v)return voiceLen(text||"");
  cueVoice(key);try{speechEl.pause();speechEl.currentTime=0}catch(e){}var p=speechEl.play();if(p&&p.catch)p.catch(function(){});return v.len}
/* следующую фразу грузим в плеер заранее: на iPad смена src перед play даёт задержку */
function cueVoice(key){var v=VOICE[key];if(!v)return;var u=srcFor(v.url);if(speechEl.__u===u)return;try{speechEl.pause();speechEl.src=u;speechEl.__u=u;speechEl.load()}catch(e){}}
/* ждём по самой записи: cb — за lead секунд до конца фразы (если звук начался позже, анимация подождёт) */
var vWait=null;
function waitVoice(key,text,lead,cb,onStart){var v=VOICE[key],len=voice(key,text);if(!v){if(onStart)onStart();later(Math.max(.2,len-lead),cb);return}
  vWait={end:v.len-lead,until:clock+len+2,cb:cb,start:onStart,t0:clock}}
function checkVoice(){if(!vWait)return;var w=vWait,t=0;try{t=speechEl.currentTime}catch(e){}
  if(w.start&&(t>.03||clock>w.t0+.6)){var s0=w.start;w.start=null;s0()}
  if(speechEl.ended||t>=w.end||clock>w.until){vWait=null;w.cb()}}
function praise(){var v=PRAISE[Math.floor(Math.random()*PRAISE.length)];say("Похвала (общая запись)");
  try{speechEl.pause();speechEl.src=srcFor(v.url);speechEl.__u=null;speechEl.currentTime=0}catch(e){}var p=speechEl.play();if(p&&p.catch)p.catch(function(){});return v.len}
function introClear(){intro.tok++;intro.items.forEach(function(it){dropObj(it.o)});intro.items=[];
  if(intro.girl){intro.girl.root.remove();intro.girl=null}if(intro.finw){intro.finw.remove();intro.finw=null}}
function introHintTarget(){return null}
function introTap(){}
function startIntro(){introClear();intro.k=0;phase="introanim";say("");introPair()}
function introPair(){var tk=intro.tok;intro.items.forEach(function(it){dropObj(it.o)});intro.items=[];var P=INTRO[intro.k],s=CAT[P.i];
  [{n:{s:s},x:560,line:P.la,key:P.ka},{n:Object.assign({s:s},P.b),x:1000,line:P.lb,key:P.kb}].forEach(function(a,j){var o=makeObj(a.n,a.x,560,0);
    var it={o:o,x:a.x,line:a.line,key:a.key};intro.items.push(it);anim(.5,function(u){o.s=1.25*back(u);setT(o)},null,j*.12)});
  later(.6,function(){if(tk!==intro.tok)return;focus(0,function(){focus(1,function(){
    anim(.35,function(u){intro.items.forEach(function(x){x.o.s=1.25*(1-eio(u));setT(x.o)})},function(){if(tk!==intro.tok)return;
      intro.k++;if(intro.k<INTRO.length)introPair();else introFinale()})})})});
  /* вещь растёт вместе с началом фразы, держится, пока фраза звучит, и возвращается за 0,45 с до её конца */
  function layer(x,after){[x.stink,x.drip].forEach(function(f){if(f)FLY.insertBefore(f.g,after.nextSibling)})}
  function dim(x,k){x.wrap.setAttribute("opacity",k.toFixed(2));x.stinkOp=k}
  function focus(i,done){var it=intro.items[i],other=intro.items[1-i],o=it.o,heard=false,grown=false,tx=i?860:720;
    FLY.appendChild(o.wrap);layer(o,o.wrap);layer(other.o,other.o.wrap);
    function goBack(){if(!heard||!grown||tk!==intro.tok)return;heard=false;
      anim(.45,function(u){var e=eio(u);o.x=lerp(tx,it.x,e);o.y=lerp(520,560,e);o.s=lerp(1.95,1.25,e);setT(o);dim(other.o,.45+.55*e)},function(){
        if(tk===intro.tok)later(.3,done)})}
    waitVoice(it.key,it.line,.45,function(){heard=true;goBack()},function(){
      anim(.45,function(u){var e=eio(u);o.x=lerp(it.x,tx,e);o.y=lerp(560,520,e);o.s=lerp(1.25,1.95,e);setT(o);dim(other.o,1-.55*e)},function(){grown=true;goBack()})})}}

/* ── сценка в конце знакомства: девочка ── */
var SKIN="#FFE0CF",SKIN_D="#FBC8BE",HAIR="#FFD326",TANK="#CBF0A4",SHORTS="#6B91D5",SHOE="#FE88A8",SHOE_D="#E6615C",TIE="#FC3529",GS=1.25,GY=880;
function eyeG(p,x,y,r){var g=el("g",{},p);el("circle",{cx:x,cy:y,r:r,fill:"#2C3A5C"},g);el("circle",{cx:x+r*.35,cy:y-r*.4,r:r*.36,fill:"#FFFFFF"},g);return g}
function happyArc(p,x,y,w){return el("path",{d:"M"+(x-w)+" "+(y+2)+" q"+w+" "+(-w*1.2)+" "+(2*w)+" 0",stroke:"#2C3A5C","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:0},p)}
/* рука: плечо → локоть → кисть; кисть мягкая (ладонь + большой палец) */
function makeArm(parent,x,col,thumbSide){var sh=el("g",{transform:"translate("+x+" -288)"},parent),up=el("g",{},sh);
  el("path",{d:"M0 0 V70",stroke:col,"stroke-width":24,"stroke-linecap":"round"},up);
  var sl=el("path",{d:"M0 -2 V30",stroke:"#CCB4E6","stroke-width":33,"stroke-linecap":"round",opacity:0},up);
  var e2=el("g",{transform:"translate(0 70)"},up);el("path",{d:"M0 0 V60",stroke:col,"stroke-width":21,"stroke-linecap":"round"},e2);
  var hand=el("g",{transform:"translate(0 68)"},e2),soft=el("g",{},hand);
  el("ellipse",{cx:0,cy:0,rx:14,ry:17,fill:col},soft);el("ellipse",{cx:thumbSide*11,cy:-6,rx:6,ry:10,fill:col,transform:"rotate("+(thumbSide*-25)+" "+(thumbSide*11)+" -6)"},soft);
  /* «класс»: кулак с согнутыми пальцами и большой палец вверх; кисть всегда держится прямо */
  var up2=el("g",{opacity:0},hand);
  el("rect",{x:-17,y:-15,width:34,height:32,rx:11,fill:col},up2);
  [-6,3,12].forEach(function(y){el("path",{d:"M-4 "+y+" H13",stroke:"#FAB78E","stroke-width":3,"stroke-linecap":"round"},up2)});
  el("rect",{x:thumbSide>0?3:-15,y:-46,width:13,height:36,rx:6.5,fill:col},up2);
  el("path",{d:"M"+(thumbSide>0?5:-13)+" -40 H"+(thumbSide>0?14:-4),stroke:"#FAB78E","stroke-width":3,"stroke-linecap":"round"},up2);
  return {x:x,up:up,el:e2,hand:hand,soft:soft,thumb:up2,sl:sl,a:0,b:0,th:false}}
function setArm(A){A.up.setAttribute("transform","rotate("+f1(A.a)+")");A.el.setAttribute("transform","translate(0 70) rotate("+f1(A.b)+")");
  A.hand.setAttribute("transform","translate(0 68)"+(A.th?" rotate("+f1(-(A.a+A.b))+")":""));A.soft.setAttribute("opacity",A.th?0:1);A.thumb.setAttribute("opacity",A.th?1:0)}
function armTo(A,tx,ty,s){var a=70,b=68,sx=A.x,sy=-288,dx=tx-sx,dy=ty-sy,d=Math.min(Math.hypot(dx,dy),a+b-1),base=Math.atan2(-dx,dy),
  ang=Math.acos(clamp((a*a+d*d-b*b)/(2*a*d),-1,1)),th=base+s*ang,ex=sx-Math.sin(th)*a,ey=sy+Math.cos(th)*a,be=Math.atan2(-(tx-ex),ty-ey);
  A.a=th*180/Math.PI;A.b=(be-th)*180/Math.PI}
function handPos(A){var t=A.a*Math.PI/180,t2=(A.a+A.b)*Math.PI/180;return {x:A.x-Math.sin(t)*70-Math.sin(t2)*68,y:-288+Math.cos(t)*70+Math.cos(t2)*68}}
function makeLeg(parent,x,col,shoe,side){var hip=el("g",{transform:"translate("+x+" -170)"},parent),th=el("g",{},hip);
  el("path",{d:"M0 0 V80",stroke:col,"stroke-width":30,"stroke-linecap":"round"},th);
  var kn=el("g",{transform:"translate(0 80)"},th);el("path",{d:"M0 0 V72",stroke:col,"stroke-width":27,"stroke-linecap":"round"},kn);
  if(side)el("path",{d:"M14 84 Q14 68 -2 68 Q-30 68 -38 82 Q-40 92 -16 92 H6 Q14 92 14 84Z",fill:shoe},kn);           /* туфля носком влево */
  else el("path",{d:"M-17 84 Q-17 68 2 68 Q26 68 28 82 Q28 92 4 92 Q-17 92 -17 84Z",fill:shoe,transform:x<0?"scale(-1 1)":""},kn);
  return {th:th,kn:kn}}
function makeGirl(parent){var G={x:1560,p:{},view:"side"},root=el("g",{},parent);G.root=root;
  G.sh=el("ellipse",{cx:0,cy:0,rx:66,ry:9,fill:"#2C3A5C",opacity:.13},root);
  G.turn=el("g",{},root);
  /* ── вид сбоку (идёт влево, к шкафу) ── */
  var S=el("g",{},G.turn);G.side=S;
  G.sLegF=makeLeg(S,4,SKIN_D,SHOE_D,1);G.sArmF=makeArm(S,4,SKIN_D,-1);
  G.sLegN=makeLeg(S,4,SKIN,SHOE,1);
  el("path",{d:"M-36 -188 H40 L44 -128 H-40 Z",fill:SHORTS,stroke:SHORTS,"stroke-width":8,"stroke-linejoin":"round"},S);
  el("rect",{x:-12,y:-326,width:24,height:30,rx:8,fill:SKIN},S);
  el("rect",{x:-30,y:-304,width:64,height:132,rx:24,fill:SKIN},S);
  el("rect",{x:-33,y:-278,width:70,height:106,rx:20,fill:TANK},S);el("path",{d:"M-6 -302 V-278",stroke:TANK,"stroke-width":12,"stroke-linecap":"round"},S);
  var sh2=el("g",{transform:"translate(0 -386)"},S);G.sHead=sh2;
  G.sTail=el("g",{},sh2);el("path",{d:"M52 -34 Q104 -30 98 30 Q94 66 74 78 Q84 30 56 0 Z",fill:HAIR},G.sTail);el("circle",{cx:58,cy:-30,r:11,fill:TIE},G.sTail);
  el("circle",{cx:0,cy:6,r:72,fill:SKIN},sh2);el("circle",{cx:-70,cy:6,r:10,fill:SKIN},sh2);
  el("path",{d:"M-66 -20 Q-62 -82 6 -84 Q80 -82 80 6 Q80 50 54 68 Q58 30 42 6 Q26 -22 -10 -28 Q-44 -32 -66 -20Z",fill:HAIR},sh2);
  el("circle",{cx:22,cy:12,r:13,fill:SKIN},sh2);el("circle",{cx:22,cy:12,r:6,fill:SKIN_D},sh2);
  G.sEye=eyeG(sh2,-34,6,9);G.sHappy=happyArc(sh2,-34,8,10);
  el("circle",{cx:-30,cy:30,r:11,fill:"#FC88A8",opacity:.45},sh2);
  el("path",{d:"M-58 38 Q-49 45 -40 39",stroke:"#2C3A5C","stroke-width":5,fill:"none","stroke-linecap":"round"},sh2);
  G.sArmN=makeArm(S,4,SKIN,-1);
  /* ── вид спереди (одевается, «класс») ── */
  var F=el("g",{display:"none"},G.turn);G.front=F;
  G.legL=makeLeg(F,-22,SKIN,SHOE,0);G.legR=makeLeg(F,22,SKIN,SHOE,0);
  el("path",{d:"M-54 -186 H54 L58 -128 H8 L0 -146 L-8 -128 H-58 Z",fill:SHORTS,stroke:SHORTS,"stroke-width":8,"stroke-linejoin":"round"},F);
  el("rect",{x:-12,y:-326,width:24,height:30,rx:8,fill:SKIN},F);
  el("rect",{x:-50,y:-304,width:100,height:132,rx:26,fill:SKIN},F);
  G.tank=el("path",{d:"M-50 -268 Q-38 -300 -30 -304 L-22 -304 Q0 -278 22 -304 L30 -304 Q38 -300 50 -268 L52 -180 Q52 -172 44 -172 H-44 Q-52 -172 -52 -180 Z",fill:TANK},F);
  G.band=el("rect",{x:-55,y:-308,width:110,height:44,rx:20,fill:"#CCB4E6",opacity:0},F);
  G.worn=el("g",{transform:"translate(0 -238) scale(.94 .62)",opacity:0},F);
  G.armL=makeArm(F,-50,SKIN,1);G.armR=makeArm(F,50,SKIN,-1);
  var head=el("g",{transform:"translate(0 -386)"},F);G.head=head;
  G.tailL=el("g",{},head);el("path",{d:"M-62 -40 Q-112 -30 -106 26 Q-102 60 -84 72 Q-92 30 -66 2 Z",fill:HAIR},G.tailL);el("circle",{cx:-66,cy:-36,r:11,fill:TIE},G.tailL);
  G.tailR=el("g",{},head);el("path",{d:"M62 -40 Q112 -30 106 26 Q102 60 84 72 Q92 30 66 2 Z",fill:HAIR},G.tailR);el("circle",{cx:66,cy:-36,r:11,fill:TIE},G.tailR);
  [-72,72].forEach(function(x){el("circle",{cx:x,cy:14,r:13,fill:SKIN},head)});
  el("circle",{cx:0,cy:6,r:74,fill:SKIN},head);
  var face=el("g",{},head);G.face=face;
  G.eyes=[-26,26].map(function(x){return eyeG(face,x,10,9)});G.happy=[-26,26].map(function(x){return happyArc(face,x,12,10)});
  [-46,46].forEach(function(x){el("circle",{cx:x,cy:30,r:11,fill:"#FC88A8",opacity:.45},face)});
  G.mouth=el("path",{d:"M-13 36 Q0 46 13 36",stroke:"#2C3A5C","stroke-width":5,fill:"none","stroke-linecap":"round"},face);
  G.smile=el("path",{d:"M-18 32 Q0 54 18 32 Z",fill:"#2C3A5C",opacity:0},face);
  el("path",{d:"M-74 -2 Q-78 -80 0 -82 Q78 -80 74 -2 Q66 -40 34 -46 Q8 -48 2 -34 Q-6 -48 -32 -46 Q-66 -40 -74 -2Z",fill:HAIR},head);
  G.top=el("g",{},G.turn);                 /* футболка в руках — поверх всего */
  G.blinkAt=2;return G}
function poseGirl(G,t){var p=G.p;G.root.setAttribute("transform","translate("+f1(G.x)+" "+GY+") scale("+GS+")");
  G.turn.setAttribute("transform","scale("+(p.turn==null?1:p.turn).toFixed(3)+" 1)");
  G.side.setAttribute("display",G.view==="side"?"inline":"none");G.front.setAttribute("display",G.view==="front"?"inline":"none");
  if(t>G.blinkAt){G.blinkT=t;G.blinkAt=t+rr(2,3.6)}var bt=t-(G.blinkT||-9),bk=bt<.18?1-Math.abs(bt-.09)/.09:0;
  var sw=Math.sin(t*3)*4+(p.swing||0),bob=p.bob||0;
  if(G.view==="side"){var ph=p.ph||0,w=p.walk||0;
    G.side.setAttribute("transform","translate(0 "+f1(-bob)+")");
    [[G.sLegN,1],[G.sLegF,-1]].forEach(function(a){var s=a[1];a[0].th.setAttribute("transform","rotate("+f1(24*Math.sin(ph)*w*s)+")");
      a[0].kn.setAttribute("transform","translate(0 80) rotate("+f1(-(6+36*Math.max(0,Math.sin(ph+(s>0?1.4:1.4+Math.PI))))*w)+")")});
    if(!p.reach){G.sArmN.a=-18*Math.sin(ph)*w+2;G.sArmN.b=10;}G.sArmF.a=18*Math.sin(ph)*w+2;G.sArmF.b=10;setArm(G.sArmN);setArm(G.sArmF);
    G.sTail.setAttribute("transform","rotate("+f1(sw+6*w*Math.sin(ph*2))+" 56 -30)");
    G.sEye.setAttribute("transform","translate(-34 6) scale(1 "+(1-bk*.9).toFixed(2)+") translate(34 -6)");
    G.sHead.setAttribute("transform","translate(0 -386) rotate("+f1(p.tilt||0)+")")}
  else{G.front.setAttribute("transform","translate(0 "+f1(-bob)+")");
    [G.legL,G.legR].forEach(function(L){L.th.setAttribute("transform","");L.kn.setAttribute("transform","translate(0 80)")});
    setArm(G.armL);setArm(G.armR);
    G.head.setAttribute("transform","translate(0 -386) rotate("+f1(p.tilt||0)+")");
    G.tailL.setAttribute("transform","rotate("+f1(sw)+" -66 -36)");G.tailR.setAttribute("transform","rotate("+f1(-sw)+" 66 -36)");
    G.eyes.forEach(function(e,i){var x=i?26:-26;e.setAttribute("transform","translate("+x+" 10) scale(1 "+(1-bk*.9).toFixed(2)+") translate("+(-x)+" -10)");e.setAttribute("opacity",p.happy?0:1)});
    G.happy.forEach(function(h){h.setAttribute("opacity",p.happy?1:0)});G.mouth.setAttribute("opacity",p.happy?0:1);G.smile.setAttribute("opacity",p.happy?1:0)}
  G.sh.setAttribute("rx",f1(66-bob*.8))}
/* камера: окно 3:2 плавно наезжает на девочку */
var GSVG=null;
function girlLayer(){if(!GSVG){GSVG=document.createElementNS(NS,"svg");GSVG.setAttribute("class","sg-svg");GSVG.setAttribute("preserveAspectRatio","xMidYMid meet");
  GSVG.setAttribute("viewBox",SVG.getAttribute("viewBox"));GSVG.style.pointerEvents="none";SVG.parentNode.appendChild(GSVG)}return GSVG}
function camTo(v){var s=v.map(f1).join(" ");SVG.setAttribute("viewBox",s);if(GSVG)GSVG.setAttribute("viewBox",s)}
function camLerp(a,b,e){return a.map(function(x,i){return lerp(x,b[i],e)})}
var CAM0=[0,0,1536,1024],CAM1=[0,214,1000,667],CAM2=[40,212,760,507];
function runSteps(steps,tk){var i=0;(function next(){if(tk!==intro.tok||i>=steps.length)return;var st=steps[i++];if(st.go)st.go();anim(st.d,st.u||function(){},next)})()}
function introFinale(){var tk=intro.tok;holdMusic(true);intro.items.forEach(function(it){dropObj(it.o)});intro.items=[];
  var line="В шкафу лежит чистая, сухая и гладкая одежда. Её можно сразу надеть и пойти гулять!",vEnd=clock+.5+(VOICE.wardrobe?VOICE.wardrobe.len:voiceLen(line));
  [WD,SH.wd].forEach(function(g){g.setAttribute("display","inline")});
  /* шкаф заполнен: на штанге три вещи и футболка, на полках стопки */
  var W=el("g",{},SVG);SVG.insertBefore(W,FLY);intro.finw=W;var tee=null;
  [[150,2],[193,8],[236,14],[279,6]].forEach(function(a){var g=el("g",{transform:"translate("+a[0]+" 232)"},W);
    var holder=el("g",{transform:"translate(0 93) scale(.5)"},g);makeClothes(CAT[a[1]],false,holder);
    el("path",{d:"M0 0 q0 -7 6 -7 q6 0 6 6",stroke:"#908B90","stroke-width":4,fill:"none","stroke-linecap":"round"},g);
    el("path",{d:"M0 0 L-48 34 H48 Z",fill:"none",stroke:"#A17269","stroke-width":5,"stroke-linejoin":"round"},g);if(a[1]===6)tee={g:g,holder:holder}});
  [[0,13],[0,15],[1,5],[1,7],[2,3],[2,4]].forEach(function(a,i){var sh=SHELF_Y[a[0]],n=i%2,f=makeFolded(CAT[a[1]],false,W);
    f.g.setAttribute("transform","translate("+(436+(n?5:-4))+" "+(sh-15-n*29)+") scale(.62)")});
  var G=makeGirl(girlLayer());intro.girl=G;
  var X1=420,t0=clock,hx=0,hy=0,T=null,ti=null;
  function teeAt(x,y,sx,sy){T.setAttribute("transform","translate("+f1(x)+" "+f1(y)+") scale("+sx.toFixed(3)+" "+sy.toFixed(3)+")")}
  /* сценка начинается сразу, фраза про шкаф — через 0,5 с */
  later(.5,function(){if(tk===intro.tok)voice("wardrobe",line)});
  later(.01,function(){if(tk===intro.tok)runSteps(STEPS_F,tk)});
  var STEPS_F=([
    /* 1. идёт к шкафу боком: шаг с коленом, руки в такт, хвостик качается */
    {go:function(){play("steps")},d:3.8,u:function(u){var t=u*3.8,e=u<.85?u/.85*.93:(.93+.07*eout((u-.85)/.15)),w=u<.9?1:Math.max(0,(1-u)/.1);
      G.x=lerp(1580,X1,e);G.p.ph=t*2*Math.PI/.62;G.p.walk=w;G.p.bob=Math.abs(Math.cos(G.p.ph))*5*w;
      }},
    {d:.25},
    /* 2. тянется к футболке, голова чуть вверх */
    {go:function(){G.p.reach=true;G.p.walk=0;G.p.bob=0;hx=(279-G.x)/GS;hy=(380-GY)/GS},d:.75,u:function(u){var e=eio(u);
      G.sArmN.a=lerp(2,0,e);armTo(G.sArmN,lerp(-30,hx,e),lerp(-160,hy,e),-1);G.p.tilt=8*e}},
    /* 3. снимает с вешалки (вешалка качается) и прижимает к себе */
    {go:function(){play("grab");var hp=handPos(G.sArmN);T=el("g",{},G.top);ti=makeClothes(CAT[6],false,T);tee.holder.remove();teeAt(hp.x,hp.y-20,.42,.42);
       anim(1,function(u){tee.g.setAttribute("transform","translate(279 232) rotate("+f1(12*Math.exp(-u*3)*Math.cos(u*12))+")")})},
     d:.7,u:function(u){var e=eio(u),tx=lerp(hx,-62,e),ty=lerp(hy,-240,e);armTo(G.sArmN,tx,ty,-1);G.p.tilt=8*(1-e);var h=handPos(G.sArmN);teeAt(h.x+6,h.y-10,lerp(.42,.5,e),lerp(.42,.5,e))}},
    /* 4. поворачивается к нам; камера начинает наезд */
    {d:.2,u:function(u){G.p.turn=1-.95*eio(u)}},
    {go:function(){G.view="front";G.p={turn:.05};armTo(G.armL,-46,-250,1);armTo(G.armR,46,-250,-1);teeAt(0,-250,.62,.62)},d:.22,u:function(u){G.p.turn=.05+.95*eio(u)}},
    {d:.6,u:function(u){camTo(camLerp(CAM0,CAM1,eio(u)))}},
    /* 5. поднимает над головой */
    {go:function(){play("dress")},d:.55,u:function(u){var e=eio(u),y=lerp(-250,-520,e);armTo(G.armL,-58,y+40,1);armTo(G.armR,58,y+40,-1);teeAt(0,y,lerp(.62,.92,e),lerp(.62,.6,e))}},
    /* 6. натягивает через голову: голова под футболкой, потом выныривает */
    {d:.75,u:function(u){var e=eio(u),y=lerp(-520,-236,e);armTo(G.armL,-62,y+50,1);armTo(G.armR,62,y+50,-1);teeAt(0,y,.92,.6);G.p.bob=Math.sin(Math.PI*u)*4}},
    /* 7. футболка надета: одёргивает край */
    {go:function(){ti.remove();T.remove();makeClothes(CAT[6],false,G.worn);G.worn.setAttribute("opacity",1);G.band.setAttribute("opacity",1);G.tank.setAttribute("opacity",0);
       [G.armL,G.armR].forEach(function(A){A.sl.setAttribute("opacity",1)});play("tug")},
     d:.4,u:function(u){var e=eio(u);armTo(G.armL,lerp(-62,-56,e),lerp(-186,-172,e),1);armTo(G.armR,lerp(62,56,e),lerp(-186,-172,e),-1)}},
    {d:.35,u:function(u){var e=eio(u);armTo(G.armL,-58,lerp(-172,-150,e),1);armTo(G.armR,58,lerp(-172,-150,e),-1)}},
    /* 8. камера ближе; «класс»: кулак, большой палец вверх, улыбка, подпрыгивание */
    {d:.5,u:function(u){camTo(camLerp(CAM1,CAM2,eio(u)))}},
    {go:function(){G.armR.th=true;play("thumb")},d:.45,u:function(u){var e=eio(u);armTo(G.armR,lerp(58,128,e),lerp(-150,-340,e),1);G.p.happy=u>.3;G.p.tilt=-6*e}},
    {d:.5,u:function(u){G.p.bob=Math.sin(Math.PI*u)*16;G.p.swing=Math.sin(Math.PI*u)*10}},
    {go:function(){later(Math.max(.4,vEnd-clock+.3),function(){if(tk===intro.tok)stageDone()})},d:.01}
  ])}
/* звёзды-этапы — как в остальных играх (stage complete + салют + большая звезда летит в кружок; в конце — фанфары) */
var STAR_IMG=STAR_URL;
var GAME=document.getElementById("sofia-game"),starBacks=[].slice.call(document.querySelectorAll("#sofia-game .sg-starback"));
GAME.style.setProperty("--sg-star-mask",'url("'+STAR_IMG+'")');document.getElementById("sg-bigstar-img").src=STAR_IMG;
[].forEach.call(document.querySelectorAll("#sofia-game .sg-starsym"),function(im){im.src=STAR_IMG});
function flyBigStar(slot,cb){var back=starBacks[slot],gr=GAME.getBoundingClientRect(),br=back.getBoundingClientRect();
  var dx=(br.left+br.width/2)-(gr.left+gr.width/2),dy=(br.top+br.height/2)-(gr.top+gr.height/2),big=document.getElementById("sg-bigstar");
  big.style.transition="none";big.style.display="block";big.style.transform="translate(-50%,-50%) scale(0)";
  requestAnimationFrame(function(){requestAnimationFrame(function(){big.style.transition="transform .45s cubic-bezier(.34,1.56,.64,1)";big.style.transform="translate(-50%,-50%) scale(1)";
    setTimeout(function(){var k=Math.max(.05,br.width/(big.offsetWidth||160));big.style.transition="transform .7s ease";
      big.style.transform="translate(calc(-50% + "+dx+"px), calc(-50% + "+dy+"px)) scale("+k+")";
      setTimeout(function(){back.classList.add("sg-earned");big.style.display="none";if(cb)cb()},720)},600)})})}
function pulseAllStars(){starBacks.forEach(function(b,i){setTimeout(function(){b.classList.remove("sg-pulse");void b.offsetWidth;b.classList.add("sg-pulse")},i*180)})}
var fwC=document.getElementById("sg-fireworks"),c2d=fwC.getContext("2d"),fwP=[],fwRun=false,fwRaf=null;
function launchFireworks(){fwC.width=GAME.offsetWidth;fwC.height=GAME.offsetHeight;if(fwRaf)cancelAnimationFrame(fwRaf);fwP=[];fwRun=true;spawnBurst();spawnBurst();fwLoop();setTimeout(function(){fwRun=false},1500)}
function spawnBurst(){var x=.2+Math.random()*.6,y=.1+Math.random()*.5,cols=["#6DCC0B","#F97A4F","#FED224","#E4615C","#6B91D6","#FC88A7"],col=cols[Math.floor(Math.random()*cols.length)];
  for(var i=0;i<60;i++){var a=Math.random()*Math.PI*2,sp=2+Math.random()*5;fwP.push({x:fwC.width*x,y:fwC.height*y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,alpha:1,color:col,r:2+Math.random()*3})}}
function fwLoop(){c2d.clearRect(0,0,fwC.width,fwC.height);fwP.forEach(function(q){q.x+=q.vx;q.y+=q.vy;q.vy+=.12;q.alpha-=.018;c2d.globalAlpha=Math.max(0,q.alpha);c2d.beginPath();c2d.arc(q.x,q.y,q.r,0,Math.PI*2);c2d.fillStyle=q.color;c2d.fill()});
  c2d.globalAlpha=1;fwP=fwP.filter(function(q){return q.alpha>0});if(fwRun&&fwP.length<100)spawnBurst();if(fwP.length>0||fwRun)fwRaf=requestAnimationFrame(fwLoop);else c2d.clearRect(0,0,fwC.width,fwC.height)}
/* конец звезды: похвала (кроме знакомства — там ребёнок только смотрел) → звезда → следующая звезда */
function stageDone(){var k=stage;phase="stagedone";holdMusic(true);
  later(k===0?0:praise()+.15,function(){if(stage!==k)return;var last=k===3;say("");
    if(last){play("fanfare");launchFireworks();flyBigStar(k,function(){pulseAllStars();holdMusic(false);phase="end";showEnd()});return}
    play("star");launchFireworks();flyBigStar(k,function(){later(1.2,function(){holdMusic(false);if(stage===k)setStage(k+1)})})})}
function drawGirl(){var G=intro.girl;if(G)poseGirl(G,clock)}

var mode="game";

/* ───────── загрузка, старт, кнопки, музыка (логика интерфейса — как в «Повелительном наклонении») ───────── */
function $id(id){return document.getElementById(id)}
function mark(){}
var game=GAME,started=false,loadedReady=false;
/* фоновая музыка — общие дорожки, по кругу; на сценке с девочкой и на звёздах пауза */
var MUSIC_FILES=["Music.m4a","Music2.m4a"].map(function(f){return G2+f}),musicEl=new Audio(),musicOn=true,musicIdx=0,musicWant=false,musicHold=false;
musicEl.preload="auto";musicEl.volume=.2;
musicEl.addEventListener("ended",function(){musicIdx=(musicIdx+1)%MUSIC_FILES.length;playTrack()});
function playTrack(){try{musicEl.src=srcFor(MUSIC_FILES[musicIdx]);musicEl.currentTime=0}catch(e){}if(musicOn&&!musicHold){var p=musicEl.play();if(p&&p.catch)p.catch(function(){})}}
function startMusic(){musicWant=true;musicIdx=Math.floor(Math.random()*MUSIC_FILES.length);playTrack()}
function holdMusic(on){musicHold=on;if(on){try{musicEl.pause()}catch(e){}}else if(musicWant&&musicOn&&!document.hidden){var p=musicEl.play();if(p&&p.catch)p.catch(function(){})}}
$id("sg-music").addEventListener("click",function(){musicOn=!musicOn;this.classList.toggle("sg-off",!musicOn);if(!musicOn){try{musicEl.pause()}catch(e){}}else holdMusic(musicHold)});
/* 🔊 — повторить инструкцию этапа */
$id("sg-repeat").addEventListener("click",function(){if(!started||stage===0||phase!=="idle")return;voice(TASK[stage][0])});
function pauseBg(){try{speechEl.pause()}catch(e){}try{musicEl.pause()}catch(e){}}
document.addEventListener("visibilitychange",function(){if(document.hidden)pauseBg();else holdMusic(musicHold)});
window.addEventListener("pagehide",pauseBg);
/* предзагрузка → полоска собачки; музыка качается фоном и в полосу не входит */
var loaded=0,total=0,loadRevealed=false;
function tick(){loaded++;if(window.__uzorProgress)window.__uzorProgress(loaded/total);if(loaded>=total){if(window.__uzorFinish)window.__uzorFinish(revealStart);else setTimeout(revealStart,300)}}
function revealStart(){if(loadRevealed)return;loadRevealed=true;buildAudio();onLoaded()}
(function(){var urls=ALL_AUDIO.slice(),imgs=[STAR_URL];total=urls.length+imgs.length;
  urls.forEach(function(u){fetch(u).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){try{objUrls[u]=URL.createObjectURL(b)}catch(e){}tick()}).catch(function(){tick()})});
  imgs.forEach(function(u){var im=new Image();im.onload=im.onerror=tick;im.src=u});
  MUSIC_FILES.forEach(function(u){fetch(u).then(function(r){return r.blob()}).then(function(b){try{objUrls[u]=URL.createObjectURL(b)}catch(e){}}).catch(function(){})})})();
$id("sg-start-btn").addEventListener("click",function(){$id("sg-start-overlay").style.display="none";unlock();started=true;startMusic();syncMobileUI();
  setTimeout(function(){applyStage(0)},600)});
/* финальный экран */
function showEnd(){setTimeout(function(){$id("sg-end-overlay").classList.add("sg-show")},1500)}
$id("sg-endbtn").addEventListener("click",function(){$id("sg-end-overlay").classList.remove("sg-show");starBacks.forEach(function(b){b.classList.remove("sg-earned","sg-pulse")});applyStage(0)});
$id("sg-nextbtn").addEventListener("click",function(){try{window.top.location.href=NEXT_GAME_URL}catch(e){window.location.href=NEXT_GAME_URL}});
/* для проверки: window.__sg.go(k) — сразу к звезде k (0 — знакомство) */
window.__sg={go:function(k){applyStage(k)},get stage(){return stage},get phase(){return phase},get done(){return done}};

/* ─── полноэкранный режим и поворот телефона (как в «Виммельбухе») ─── */
var fsWrap=$id("sg-fs-wrap"),rotEl=$id("sg-rotate"),canRealFS=!!(fsWrap.requestFullscreen||fsWrap.webkitRequestFullscreen),pseudoFS=false;
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
function onLoaded(){$id("sg-loading").style.display="none";loadedReady=true;if(isPhone())syncMobileUI();else $id("sg-start-overlay").style.display="flex"}
function enterFS(){if(canRealFS){var req=fsWrap.requestFullscreen||fsWrap.webkitRequestFullscreen;try{var p=req.call(fsWrap);if(p&&p.then)p.then(lockLandscape).catch(pseudoOn);else lockLandscape()}catch(e){pseudoOn()}}else pseudoOn();refreshFsBtn()}
function exitFS(){if(inRealFS()){var ex=document.exitFullscreen||document.webkitExitFullscreen;try{ex.call(document)}catch(e){}unlockOrientation()}pseudoOff();refreshFsBtn()}
$id("sg-fs").addEventListener("click",function(){if(isFS())exitFS();else enterFS()});
document.addEventListener("fullscreenchange",function(){mark("полн.экран");if(!inRealFS())unlockOrientation();syncMobileUI();refreshFsBtn()});
document.addEventListener("webkitfullscreenchange",function(){mark("полн.экран");if(!inRealFS())unlockOrientation();syncMobileUI();refreshFsBtn()});
window.addEventListener("orientationchange",function(){setTimeout(function(){syncMobileUI();refreshFsBtn()},250)});
var rzT=null;window.addEventListener("resize",function(){mark("resize");if(rzT)clearTimeout(rzT);rzT=setTimeout(function(){syncMobileUI();refreshFsBtn()},200)});
syncMobileUI();refreshFsBtn();

/* ───────── кадр ───────── */
var last=performance.now();doorK(1);showStage();
function frame(now){var dt=Math.min(.05,(now-last)/1000);last=now;clock+=dt;stepTw();idle();
  if(cur&&(phase==="idle"||phase==="drag")){SH.it.setAttribute("cx",f1(cur.x));SH.it.setAttribute("rx",f1(110-Math.abs(cur.x-CX)*.1))}
  drawWasher(dt);drawStinks(clock);drawDrips(clock);drawSteam();drawHint();drawGirl();checkVoice();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();

