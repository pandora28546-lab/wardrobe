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
/* свистки — новый файл, ссылка по коммиту (по @main кэш jsDelivr мог отдавать 404) */
A.snd.ambF="https://cdn.jsdelivr.net/gh/pandora28546-lab/wardrobe@d12e445e2b70992d3447dcfbe8c03fbc567e2430/w2/amb-whistle.m4a";
[["ambS","amb-summer"],["ambR","amb-rain"],["ambA","amb-autumn"],["ambW","amb-winter"],["ambG","amb-gym"],["ambPA","amb-party"],["ambP","amb-pool"],["ambN","amb-night"],["ambK","amb-kitchen"]].forEach(function(q){A.snd[q[0]]=W2+q[1]+".m4a"});
A.snd.star=DBASE+encodeURIComponent("stage complete.wav");A.snd.fanfare=DBASE+"fanfare.wav";A.snd.correct=DBASE+"correct.wav";A.snd.music=G2URL+"Music.m4a";
var PRAISE=[3,4,5,6,7,8,9].map(function(n){return PBASE+"Rock"+n+".m4a"});
var objUrls={};function srcFor(u){return objUrls[u]||u}'''+js[j:]
# 2. звук: общие плееры из src2.html; ссылки — заранее скачанные blob; похвала — случайная Rock3–Rock9
rep('''function buildAudio(){Object.keys(A.snd).forEach(function(k){if(k!=="pym")SU[k]=blobUrl(A.snd[k])})}''',
'''function buildAudio(){Object.keys(A.snd).forEach(function(k){SU[k]=srcFor(A.snd[k])});PRAISE_U=PRAISE.map(srcFor)}''')
js=js.replace('play("praise")','praise()')
# 3. озвучка: голос Софьи — <имя>.m4a в корне репо; файлы и длительности (из заголовка m4a) скачивает оболочка
i=js.index('/* ───────── озвучка текстом ───────── */');j=js.index('/* ───────── камера ───────── */')
js=js[:i]+'''/* ───────── озвучка: голос Софьи — <имя>.m4a в корне репо wardrobe; играет через общий плеер речи SV ───────── */
function voiceLen(t){return .9+t.length*.065}
var SCRIPT=[],LASTV=null,LASTI=null;function setScript(list){SCRIPT=list;if(list[0])cueVoice(list[0].v)}function hl(){}
var VNAMES=["i1","i2","i3","i4","zhar","dozhd","sneg","osen","sport","prazd","bass","son","kuh","vel","og","fut","d","m"];
var BGV={sun:"zhar",rain:"dozhd",winter:"sneg",autumn:"osen",gym:"sport",party:"prazd",pool:"bass",bedroom:"son",kitchen:"kuh",bike:"vel",garden:"og",field:"fut"};
function say(i,cb){LASTV=SCRIPT[i].v;LASTI=i;var d=sayVoice(SCRIPT[i].v)||voiceLen(SCRIPT[i].txt);later(d,function(){cueAfter(i);if(cb)cb()});return d}

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
