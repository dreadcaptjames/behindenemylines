/* Behind Enemy Lines: mobile dual-thumb controls. Loaded after the game script. */
(function(){
'use strict';
var shell=document.getElementById('shell'),canvas=document.getElementById('game');
if(!shell||!canvas)return;
var force=new URLSearchParams(location.search).get('touch')==='1';
if(!force&&!(navigator.maxTouchPoints>0)&&!matchMedia('(pointer:coarse)').matches)return;
document.body.classList.add('bel-touch-capable');
var ui=document.createElement('section');ui.id='belTouchControls';ui.setAttribute('aria-label','Touch game controls');
ui.innerHTML=[
'<div id="belTouchDpad" role="group" aria-label="Move and enter stratagem directions">',
'<button data-key="arrowup" aria-label="Up" type="button">▲</button>',
'<button data-key="arrowleft" aria-label="Move left" type="button">◀</button>',
'<div class="center">MOVE<br>CODE</div>',
'<button data-key="arrowright" aria-label="Move right" type="button">▶</button>',
'<button data-key="arrowdown" aria-label="Down" type="button">▼</button></div>',
'<div id="belTouchActions" role="group" aria-label="Jump dive and interact">',
'<button data-key="interact" type="button" aria-label="Interact">USE</button>',
'<button data-key="dive" type="button" aria-label="Tactical dive">DIVE</button>',
'<button data-key="jump" type="button" aria-label="Jump or jump jet">JUMP</button></div>',
'<div id="belTouchAim" role="application" aria-label="Drag to aim and shoot">',
'<div class="ring"></div><div id="belTouchKnob"></div><div class="caption">AIM + FIRE</div></div>',
'<div id="belTouchStage" hidden>',
'<button type="button" data-key="enter" id="belTouchAdvance">DEPLOY</button>',
'<button type="button" data-key="c" id="belTouchResume" class="alt">RESUME CHECKPOINT</button></div>',
'<div id="belTouchStrat" hidden>STRATAGEM: ▲ ▶ ▼ ▲</div>',
'<div id="belTouchRotate">ROTATE FOR BETTER VISIBILITY</div>'
].join('');
shell.appendChild(ui);
var tools=document.createElement('div');tools.id='belTouchTools';tools.setAttribute('role','group');tools.setAttribute('aria-label','Mission equipment controls');
tools.innerHTML=[
'<button type="button" data-key="reload" aria-label="Reload">RLD</button>',
'<button type="button" data-key="stratagem" aria-label="Orbital stratagem">STRAT</button>',
'<button type="button" data-key="pulse" aria-label="EMP pulse">EMP</button>',
'<button type="button" data-key="map" aria-label="Sector map">MAP</button>',
'<button type="button" data-key="escape" aria-label="Pause game">PAUSE</button>'
].join('');
var header=document.querySelector('header');if(header)header.appendChild(tools);
var toggle=document.createElement('button');toggle.id='belTouchToggle';toggle.type='button';
if(header)header.insertBefore(toggle,tools);
var dpad=ui.querySelector('#belTouchDpad'),actions=ui.querySelector('#belTouchActions');
var aim=ui.querySelector('#belTouchAim'),knob=ui.querySelector('#belTouchKnob');
var stage=ui.querySelector('#belTouchStage'),advance=ui.querySelector('#belTouchAdvance');
var resume=ui.querySelector('#belTouchResume'),stratHint=ui.querySelector('#belTouchStrat');
var enabled=true;try{enabled=localStorage.getItem('bel_touch_enabled')!=='off'}catch(e){}
var pressedByPointer=new Map(),counts=new Map(),aimPointer=null,aimX=1,aimY=0;
function pressKey(key,on){window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:key,bubbles:true,cancelable:true}))}
function actionKey(btn){
var key=btn.getAttribute('data-key')||'';
if(['jump','dive','interact','reload','stratagem','pulse','map'].indexOf(key)>=0){
try{return bindings[key]||key}catch(e){return key}
}return key;
}
function begin(event,btn){
if(!enabled||event.button!==0)return;
event.preventDefault();event.stopPropagation();if(btn.disabled)return;
var id=event.pointerId;if(pressedByPointer.has(id))return;
try{btn.setPointerCapture(id)}catch(e){}
var key=actionKey(btn);pressedByPointer.set(id,{btn:btn,key:key});
var count=(counts.get(key)||0)+1;counts.set(key,count);
if(count===1)pressKey(key,true);btn.classList.add('pressed');
try{if(musicOn&&!musicStarted)startMusic()}catch(e){}
}
function end(id){
var hold=pressedByPointer.get(id);if(!hold)return;
pressedByPointer.delete(id);hold.btn.classList.remove('pressed');
var count=(counts.get(hold.key)||1)-1;
if(count<=0){counts.delete(hold.key);pressKey(hold.key,false)}else counts.set(hold.key,count);
}
function endAim(id){
if(aimPointer!==id)return;aimPointer=null;aim.classList.remove('aiming');
knob.style.transform='translate(0,0)';try{mouseDown=false}catch(e){}
}
function releaseAll(){Array.from(pressedByPointer.keys()).forEach(end);if(aimPointer!==null)endAim(aimPointer)}
function enabledUI(on){
enabled=on;ui.hidden=!on;tools.hidden=!on;
document.body.classList.toggle('bel-touch-on',on);
toggle.textContent=on?'✥ TOUCH ON':'✥ TOUCH OFF';toggle.setAttribute('aria-pressed',String(on));
if(!on)releaseAll();try{localStorage.setItem('bel_touch_enabled',on?'on':'off')}catch(e){}
}
toggle.addEventListener('click',function(){enabledUI(!enabled)});
[...ui.querySelectorAll('button[data-key]'),...tools.querySelectorAll('button[data-key]')].forEach(function(btn){
btn.addEventListener('pointerdown',function(e){begin(e,btn)});
['pointerup','pointercancel','lostpointercapture'].forEach(function(type){
btn.addEventListener(type,function(e){e.preventDefault();e.stopPropagation();end(e.pointerId)});
});
btn.addEventListener('contextmenu',function(e){e.preventDefault()});
});
function setAim(event){
var r=aim.getBoundingClientRect(),dx=event.clientX-r.left-r.width/2,dy=event.clientY-r.top-r.height/2;
var len=Math.hypot(dx,dy),distance=Math.min(len,r.width*.31);
if(len>9){aimX=dx/len;aimY=dy/len}
knob.style.transform='translate('+(len?dx/len*distance:0)+'px,'+(len?dy/len*distance:0)+'px)';
aim.classList.add('aiming');updateAim();
}
function updateAim(){
try{
if(!enabled||aimPointer===null||state!=='playing'||!p)return;
mouseDown=true;mouseX=p.x-camera+aimX*135;mouseY=p.y-27+aimY*135;mouseSeen=clock+5;
}catch(e){}
}
aim.addEventListener('pointerdown',function(e){
if(!enabled||e.button!==0||aimPointer!==null)return;
e.preventDefault();e.stopPropagation();aimPointer=e.pointerId;aimX=1;aimY=0;
try{aim.setPointerCapture(e.pointerId)}catch(x){}
try{if(musicOn&&!musicStarted)startMusic()}catch(x){}
setAim(e);
});
aim.addEventListener('pointermove',function(e){
if(e.pointerId!==aimPointer)return;e.preventDefault();e.stopPropagation();setAim(e);
});
['pointerup','pointercancel','lostpointercapture'].forEach(function(type){
aim.addEventListener(type,function(e){if(e.pointerId===aimPointer){e.preventDefault();e.stopPropagation();endAim(e.pointerId)}});
});
aim.addEventListener('contextmenu',function(e){e.preventDefault()});
window.addEventListener('blur',releaseAll);
document.addEventListener('visibilitychange',function(){if(document.hidden)releaseAll()});
function refresh(){
if(enabled){
var s='title';try{s=state}catch(e){}
var playing=s==='playing',paused=s==='pause',title=s==='title',dialogue=s==='dialogue',victory=s==='victory';
var showStage=title||paused||dialogue||victory;
stage.hidden=!showStage;dpad.hidden=!playing;actions.hidden=!playing;aim.hidden=!playing;
tools.hidden=!playing&&!paused;
stratHint.hidden=!playing||(typeof stratMode==='undefined')||!stratMode;
advance.textContent=title?'DEPLOY':dialogue?'CONTINUE ▸':paused?'RESUME GAME':'REDEPLOY';
advance.setAttribute('data-key',paused?'escape':'enter');
try{resume.hidden=!title||!hasSave()}catch(e){resume.hidden=true}
var empBtn=tools.querySelector('[data-key="pulse"]'),stratBtn=tools.querySelector('[data-key="stratagem"]');
try{empBtn.classList.toggle('locked',!emp);stratBtn.classList.toggle('locked',!comms)}catch(e){}
if(!playing&&aimPointer!==null)endAim(aimPointer);
if(playing)updateAim();
}
requestAnimationFrame(refresh);
}
enabledUI(enabled);refresh();
})();