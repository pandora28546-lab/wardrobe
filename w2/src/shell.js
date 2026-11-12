
/* ───────── ход игры: вступление → звёзды 2, 3, 4 → финал ───────── */
function $id(i){return document.getElementById(i)}
function mark(){}
var mode="intro",started=false,loadedReady=false,STAGE=$id("sg-stage");
function reset(keepStars){tok++;tw=[];ticks=[];kids=[];splashes=[];ROOT.innerHTML="";FX.innerHTML="";BGROOT.innerHTML="";bgBlur(false);musicHold(true);drag=null;G2={};camFn=null;CAM=[0,0,1536,1024];
  Object.keys(AUD).forEach(function(k){if(k!=="star"&&k!=="fanfare")try{AUD[k].pause()}catch(e){}});Object.keys(VOICE).forEach(function(k){try{VOICE[k].pause()}catch(e){}});
  if(!keepStars)starBacks.forEach(function(b){b.classList.remove("sg-earned","sg-pulse")});BIG.style.display="none"}
function prepare(keepStars){reset(keepStars);
  if(mode==="intro"){setScript(INTRO_SCRIPT);buildIntro();show(S1);
    S1.live=null;CAM=[S1.x0,0,1536,1024];var o=S1;ticks.push(function(t){o.R.setAttribute("transform","translate(768 1200) scale(1.6)")})}
  else{setScript(starScript());
    /* до старта звезды стоит тот же фон, что будет в раунде, и с той же камерой — без скачка */
    var o=bgFor(STARS[CUR_STAR][START_R],START_R),bgG=el("g",{},BGROOT);bgG.appendChild(o.g);ticks.push(o.tick);CAM=[77,51,1382,921];G2.prev={g:el("g",{},ROOT),bg:bgG};G2.instant=true;earnedBefore()}}
/* смена звезды без пустого экрана и без копий сцены: пока строится следующая звезда, на экране стоит последний кадр, затем сразу новая сцена */
function goStar(n){setTimeout(function(){mode="star";CUR_STAR=n;START_R=0;prepare(true);later(.6,runStar2)},0)}
function afterStar(){if(mode==="intro"){goStar(2);return}if(CUR_STAR<4){goStar(CUR_STAR+1);return}
  play("fanfare");launchFireworks();showEnd()}
function showEnd(){setTimeout(function(){$id("sg-end-overlay").classList.add("sg-show")},1500)}
function restartGame(){$id("sg-end-overlay").classList.remove("sg-show");mode="intro";CUR_STAR=2;START_R=0;prepare(false);later(.6,runIntro)}
$id("sg-endbtn").addEventListener("click",restartGame);
$id("sg-nextbtn").addEventListener("click",function(){try{window.top.location.href=NEXT_GAME_URL}catch(e){window.location.href=NEXT_GAME_URL}});

/* 🔊 — повторить последнюю фразу; 🎶 — фоновая музыка (по умолчанию выключена) */
/* 🔊 в звёздах 2–4 повторяет условие раунда («Мы идём в спортзал»), затем задание */
$id("sg-repeat").addEventListener("click",function(){if(!started||LASTI==null||!SCRIPT[LASTI])return;
  if(Object.keys(VOICE).some(function(k){return !VOICE[k].paused}))return;var i=LASTI;
  if(mode!=="intro"&&i%2===1)i--;var d=sayVoice(SCRIPT[i].v)||voiceLen(SCRIPT[i].txt);
  if(mode!=="intro"&&SCRIPT[i+1])later(d,function(){sayVoice(SCRIPT[i+1].v)})});
$id("sg-music").addEventListener("click",function(){musicOn=!musicOn;this.classList.toggle("sg-off",!musicOn);musicHold(musicHeld)});
/* вкладка скрыта — звук на паузу, вернулись — продолжаем то, что играло */
var hiddenPlaying=[];
document.addEventListener("visibilitychange",function(){
  if(document.hidden){hiddenPlaying=[];Object.keys(AUD).map(function(k){return AUD[k]}).concat(Object.keys(VOICE).map(function(k){return VOICE[k]})).forEach(function(a){if(!a.paused){hiddenPlaying.push(a);try{a.pause()}catch(e){}}})}
  else{hiddenPlaying.forEach(function(a){var p=a.play();if(p&&p.catch)p.catch(function(){})});hiddenPlaying=[]}});

/* ───────── загрузка: всё скачивается заранее в память (blob), полоска — собачка ───────── */
var loaded=0,total=0,loadRevealed=false;
function tickLoad(){loaded++;if(window.__uzorProgress)window.__uzorProgress(loaded/total);if(loaded>=total){if(window.__uzorFinish)window.__uzorFinish(revealStart);else setTimeout(revealStart,300)}}
function revealStart(){if(loadRevealed)return;loadRevealed=true;buildAudio();onLoaded()}
function grab(u,ok,bad){fetch(u).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){var x=u;try{x=URL.createObjectURL(b)}catch(e){}ok(x)}).catch(bad)}
(function(){var urls=[],seen={};Object.keys(A.snd).forEach(function(k){var u=A.snd[k];if(!seen[u]){seen[u]=1;urls.push(u)}});urls=urls.concat(PRAISE);
  total=urls.length+VNAMES.length+1;
  urls.forEach(function(u){grab(u,function(x){objUrls[u]=x;tickLoad()},tickLoad)});
  VNAMES.forEach(function(k){grab(REPO+k+".m4a",function(x){VURL[k]=x;tickLoad()},tickLoad)});
  var im=new Image();im.onload=im.onerror=tickLoad;im.src=A.star})();
function onLoaded(){$id("sg-loading").style.display="none";loadedReady=true;if(isPhone())syncMobileUI();else $id("sg-start-overlay").style.display="flex"}
/* вступление уже построено при загрузке — по «Начать» не перестраиваем, только пауза 0,6 с */
$id("sg-start-btn").addEventListener("click",function(){$id("sg-start-overlay").style.display="none";unlock();started=true;syncMobileUI();later(.6,runIntro)});

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
