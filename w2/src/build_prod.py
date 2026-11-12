# Сборка боевого движка «Гардероб 2» из исходника превью src2.html
import re
import sys
s=open(sys.argv[1] if len(sys.argv)>1 else '/home/claude/prev/src2.html').read()
js=s[s.index('<script>')+8:s.rindex('</script>')]
def rep(a,b,n=1):
    global js;c=js.count(a);assert c==n,(c,a[:90]);js=js.replace(a,b)
cut=js.index('/* ───────── режимы и запуск ───────── */');tail=js[cut:];js=js[:cut]
# 1. ассеты: ссылки на jsDelivr вместо встроенных файлов
i=js.index('var A={star:"%%STARPNG%%"');j=js.index('};',i)+2
js=js[:i]+'''var REPO="https://cdn.jsdelivr.net/gh/pandora28546-lab/wardrobe@main/",W2=REPO+"w2/";
var G2URL="https://cdn.jsdelivr.net/gh/pandora28546-lab/sofia-game2@main/";
var DBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/Otvlekashki@main/";
var PBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/sofia-game-image@main/";
var NEXT_GAME_URL=(window.SG_CFG&&window.SG_CFG.next)||"https://sofiatmn.ru/";
/* звуки игры — папка w2 репо wardrobe; общие звуки — из репо других игр */
var A={star:G2URL+"Starsystems.png",snd:{}};
["splash","splash1","rain","umbrella","click","bell","steps","dress","bubbles","snowball","leaves","chop","clank","blow","kick","pop"].forEach(function(k){A.snd[k]=W2+k+".m4a"});
A.snd.dr2=W2+"kalimba.m4a";
[["ambS","amb-summer"],["ambR","amb-rain"],["ambA","amb-autumn"],["ambW","amb-winter"],["ambG","amb-gym"],["ambPA","amb-party"],["ambP","amb-pool"],["ambN","amb-night"],["ambF","amb-whistle"],["ambK","amb-kitchen"]].forEach(function(q){A.snd[q[0]]=W2+q[1]+".m4a"});
A.snd.star=DBASE+encodeURIComponent("stage complete.wav");A.snd.fanfare=DBASE+"fanfare.wav";A.snd.correct=DBASE+"correct.wav";A.snd.music=G2URL+"Music.m4a";
var PRAISE=[3,4,5,6,7,8,9].map(function(n){return PBASE+"Rock"+n+".m4a"});
var objUrls={};function srcFor(u){return objUrls[u]||u}'''+js[j:]
# 2. звук: из заранее скачанных blob-ссылок; похвала — случайная Rock3–Rock9
rep('''function blobUrl(d){try{var b=atob(d.split(",")[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return URL.createObjectURL(new Blob([a],{type:"audio/mp4"}))}catch(e){return d}}
function buildAudio(){var u={};Object.keys(A.snd).forEach(function(k){u[k]=blobUrl(A.snd[k])});
  Object.keys(u).forEach(function(k){if(k==="pym")return;var a=new Audio();a.preload="auto";a.src=u[k];AUD[k]=a});
  for(var i=0;i<3;i++){var a=new Audio();a.preload="auto";a.src=u.pym;PYMS.push(a)}}''',
'''var PRA=[];
function buildAudio(){Object.keys(A.snd).forEach(function(k){var a=new Audio();a.preload="auto";a.src=srcFor(A.snd[k]);AUD[k]=a});
  PRAISE.forEach(function(u){var a=new Audio();a.preload="auto";a.src=srcFor(u);PRA.push(a)});buildVoice()}
function praise(){if(!soundOn||!PRA.length)return;var a=PRA[Math.floor(Math.random()*PRA.length)];try{a.currentTime=0}catch(e){}var p=a.play();if(p&&p.catch)p.catch(function(){})}''')
rep('.concat(PYMS).concat(Object.keys(VOICE)','.concat(PRA).concat(Object.keys(VOICE)')
js=js.replace('play("praise")','praise()')
# 3. озвучка: голос Софьи, файлы скачаны при загрузке; длительность — из самого файла
i=js.index('/* ───────── озвучка текстом ───────── */');j=js.index('/* ───────── камера ───────── */')
js=js[:i]+'''/* ───────── озвучка: голос Софьи — <имя>.m4a в корне репо wardrobe ───────── */
function voiceLen(t){return .9+t.length*.065}
var SCRIPT=[],LASTV=null,LASTI=null;function setScript(list){SCRIPT=list}function hl(){}
var VNAMES=["i1","i2","i3","i4","zhar","dozhd","sneg","osen","sport","prazd","bass","son","kuh","vel","og","fut","d","m"],VOICE={},VURL={};
function buildVoice(){VNAMES.forEach(function(k){var u=VURL[k];if(!u)return;var a=new Audio();a.preload="auto";
  a.addEventListener("loadedmetadata",function(){if(isFinite(a.duration)&&a.duration>0)a.dur=a.duration});a.src=u;try{a.load()}catch(e){}VOICE[k]=a})}
var BGV={sun:"zhar",rain:"dozhd",winter:"sneg",autumn:"osen",gym:"sport",party:"prazd",pool:"bass",bedroom:"son",kitchen:"kuh",bike:"vel",garden:"og",field:"fut"};
function sayVoice(k){var a=VOICE[k];if(!soundOn||!a)return 0;try{a.pause();a.currentTime=0;a.volume=1}catch(e){}
  if(!a.rw){a.rw=1;a.addEventListener("ended",function(){try{a.currentTime=0}catch(e){}})}
  var p=a.play();if(p&&p.catch)p.catch(function(){});return a.dur?a.dur+.15:0}
function say(i,cb){LASTV=SCRIPT[i].v;LASTI=i;var d=sayVoice(SCRIPT[i].v)||voiceLen(SCRIPT[i].txt);later(d,function(){if(cb)cb()});return d}

'''+js[j:]
# 4. конец звезды: похвала, звезда, дальше следующая звезда или финал
rep('function endPreview(){hl(-1);musicHold(true);later(.1,function(){praise()});later(1.6,function(){if(G2.prevAmb){fadeSnd(G2.prevAmb,1.2);G2.prevAmb=null}starDone(CUR_STAR-1)})}',
'function endPreview(){musicHold(true);later(.1,function(){praise()});later(1.6,function(){if(G2.prevAmb){fadeSnd(G2.prevAmb,1.2);G2.prevAmb=null}starDone(CUR_STAR-1,afterStar)})}')
rep('runS4(S4,function(){starDone(0)})','runS4(S4,function(){starDone(0,afterStar)})')
# 5. оболочка: загрузка, старт, звёзды подряд, финал, полный экран, поворот
shell=open(sys.argv[2] if len(sys.argv)>2 else '/home/claude/prod/shell.js').read()
js=js+shell
assert '%%' not in js
open(sys.argv[3] if len(sys.argv)>3 else '/home/claude/prod/wardrobe2.js','w').write('/* Игра «Гардероб 2»: по погоде и по случаю — движок. Собран из исходника превью (build_prod.py). */\n'+js.strip()+'\n')
print(len(js))
