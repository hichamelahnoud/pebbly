'use strict';
const $=id=>document.getElementById(id);
const snrt=id=>'https://snrt.player.easybroadcast.io/events/'+id;
const logoSvg=(text,bg,fg='#fff',accent='#fff')=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="'+bg+'"/><circle cx="96" cy="23" r="8" fill="'+accent+'"/><text x="60" y="69" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI,Tahoma,sans-serif" font-size="'+(text.length>8?18:text.length>4?25:38)+'" font-weight="750" fill="'+fg+'">'+text+'</text></svg>'
);
const builtin=[
 {id:'aoula',name:'الأولى',logo:logoSvg('1','#f28a22','#fff','#ffe1a8'),rgb:'242,138,34',sources:[snrt('73_aloula_w1dqfwm'),'https://streaming.snrtlive.ma/live/slaalaoula/slaalaoula.m3u8']},
 {id:'arryadia',name:'الرياضية',logo:logoSvg('3','#169b62','#fff','#f6ce3e'),rgb:'22,155,98',sources:[snrt('73_arryadia_k2tgcj0'),'https://streaming.snrtlive.ma/live/slaarryadia/slaarryadia.m3u8']},
 {id:'2m',name:'2M Monde',logo:logoSvg('2M','#23242a','#fff','#e54c80'),rgb:'194,72,133',sources:['https://cdn-globecast.akamaized.net/live/eds/2m_monde/hls_video_ts_tuhawxpiemz257adfc/2m_monde.m3u8']},
 {id:'medi1',name:'Medi 1 TV',logo:logoSvg('MEDI1','#d71931','#fff','#fff'),rgb:'215,25,49',sources:['https://cdn.live.easybroadcast.io/abr_corp/83_medi1tv-maghreb_jnbspmg/playlist.m3u8']},
 {id:'tamazight',name:'تمازيغت',logo:logoSvg('ⵜⵎⵣⵖⵜ','#1573bc','#fff','#69d2ff'),rgb:'21,115,188',sources:[snrt('73_tamazight_tccybxt')]},
 {id:'maghribia',name:'المغربية',logo:logoSvg('المغربية','#078c88','#fff','#8ef0df'),rgb:'7,140,136',sources:[snrt('73_almaghribia_83tz85q')]},
 {id:'athaqafia',name:'الثقافية',logo:logoSvg('الثقافية','#7552a8','#fff','#c7a8ff'),rgb:'117,82,168',sources:[snrt('73_arrabia_hthcj4p')]},
 {id:'laayoune',name:'العيون',logo:logoSvg('العيون','#d96c25','#fff','#ffd384'),rgb:'217,108,37',sources:[snrt('73_laayoune_pgagr52')]},
 {id:'assadissa',name:'السادسة',logo:logoSvg('6','#a47b1b','#fff','#ffe178'),rgb:'164,123,27',sources:['https://streaming.snrtlive.ma/live/slaassadissa/slaassadissa.m3u8']}
];
const radios=[
 {id:'hit',kind:'radio',name:'Hit Radio',logo:logoSvg('HIT','#ed1b2e','#fff','#fff'),rgb:'237,27,46',sources:['https://hitradio-maroc.ice.infomaniak.ch/hitradio-maroc-128.mp3']},
 {id:'mars',kind:'radio',name:'Radio Mars',logo:logoSvg('MARS','#f15a24','#fff','#ffc32a'),rgb:'241,90,36',sources:['https://radiomars.ice.infomaniak.ch/radiomars-128.mp3']},
 {id:'mfm',kind:'radio',name:'MFM Radio',logo:logoSvg('MFM','#79268c','#fff','#ffca28'),rgb:'121,38,140',sources:['https://a5.asurahosting.com:7980/radio.mp3']},
 {id:'chada',kind:'radio',name:'Chada FM',logo:logoSvg('CHADA','#e41f45','#fff','#f7b32b'),rgb:'228,31,69',sources:['https://edge16.vedge.infomaniak.com/livecast/ik:chadatv/manifest.m3u8']},
 {id:'medina',kind:'radio',name:'Medina FM',logo:logoSvg('MEDINA','#087d5c','#fff','#ffe082'),rgb:'8,125,92',sources:['https://medinafm.ice.infomaniak.ch/medinafm-64.mp3']},
 {id:'marrakech',kind:'radio',name:'إذاعة مراكش',logo:logoSvg('SNRT','#c66a20','#fff','#ffd180'),rgb:'198,106,32',sources:['https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_marrakech/hls_snrt_radio/radio_marrakech-mp4a_130400_qad=1.m3u8']},
 {id:'yabiladi',kind:'radio',name:'Yabiladi Chaabi',logo:logoSvg('YBL','#1d6d9b','#fff','#90caf9'),rgb:'29,109,155',sources:['https://radio.yabiladi.com:8102/;stream.mp3']},
 {id:'zine',kind:'radio',name:'Zine Bladi',logo:logoSvg('ZINE','#b13a65','#fff','#ffc1d6'),rgb:'177,58,101',sources:['https://asmaki.ma:8000/radio.mp3']}
];
const key='pebbly-tv-channels-v1';
const {validURL,normalize,parseM3U}=TVData;
let custom=[];try{custom=normalize(JSON.parse(localStorage.getItem(key)||'[]'))}catch{}
let mode='tnt',active=null,hls=null,timeout=null,generation=0;
const video=$('video'),audio=$('audio'),iframe=$('frame'),screen=$('screen');
function say(value){$('status').textContent=value||''}
function save(){try{localStorage.setItem(key,JSON.stringify(custom));return true}catch{say('تعذر حفظ اللائحة');return false}}
function setAccent(ch){document.documentElement.style.setProperty('--accent',ch?.rgb||'110,155,255')}
function clear(){
 generation++;clearTimeout(timeout);if(hls){hls.destroy();hls=null}
 for(const media of [video,audio]){media.pause();media.removeAttribute('src');media.load()}
 video.style.display='none';iframe.removeAttribute('src');iframe.style.display='none';$('radioStage').hidden=true;
 $('empty').hidden=false;$('noise').hidden=false;$('retry').hidden=true;$('stop').hidden=true;screen.classList.remove('playing');setAccent(null)
}
function ready(ch,token){
 if(token!==generation)return;clearTimeout(timeout);$('empty').hidden=true;$('noise').hidden=true;
 screen.classList.add('playing');setAccent(ch);say(ch.name);$('retry').hidden=true
}
function play(ch,index=0){
 clear();active=ch;render();const token=generation,url=ch.sources[index];
 if(!url){say('البث غير متاح');$('retry').hidden=false;return}
 $('stop').hidden=false;say(ch.name);setAccent(ch);
 let failed=false;
 const fail=()=>{if(token!==generation||failed)return;failed=true;play(ch,index+1)};
 const u=new URL(url);
 if(ch.kind==='radio'){
  const stage=$('radioStage');stage.hidden=false;$('empty').hidden=true;$('noise').hidden=true;
  $('radioLogo').src=ch.logo;$('radioLogo').alt=ch.name;$('radioName').textContent=ch.name;screen.classList.add('playing');
  audio.onplaying=()=>ready(ch,token);audio.onerror=fail;
  const start=()=>audio.play().catch(()=>say(ch.name));
  timeout=setTimeout(fail,20000);
  if(/\.m3u8(?:[?#]|$)/i.test(url)&&window.Hls&&Hls.isSupported()){hls=new Hls({enableWorker:true,maxBufferLength:20});hls.on(Hls.Events.MANIFEST_PARSED,start);hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)fail()});hls.loadSource(url);hls.attachMedia(audio)}
  else{audio.src=url;start()}
  return
 }
 if(u.hostname==='snrt.player.easybroadcast.io'&&u.pathname.startsWith('/events/')){
  iframe.style.display='block';iframe.src=url;ready(ch,token);return
 }
 video.style.display='block';video.onplaying=()=>ready(ch,token);video.onerror=fail;
 const start=()=>video.play().catch(()=>say(ch.name));
 timeout=setTimeout(fail,20000);
 if(/\.m3u8(?:[?#]|$)/i.test(url)&&window.Hls&&Hls.isSupported()){hls=new Hls({enableWorker:true,maxBufferLength:20});hls.on(Hls.Events.MANIFEST_PARSED,start);hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)fail()});hls.loadSource(url);hls.attachMedia(video)}
 else{video.src=url;start()}
}
function list(){return mode==='tnt'?builtin:mode==='radio'?radios:custom}
function fallbackLogo(name){return logoSvg((name||'TV').slice(0,5),'#30343d','#fff','#8bb8ff')}
function render(){
 const root=$('channels');root.replaceChildren();
 for(const ch of list()){
  const wrap=document.createElement('div');wrap.className='channel-wrap'+(mode==='iptv'?' removable':'');
  const row=document.createElement('button');row.className='channel'+(active===ch?' selected':'');row.type='button';row.setAttribute('aria-label',ch.name);
  const logo=document.createElement('img');logo.className='logo';logo.src=ch.logo||fallbackLogo(ch.name);logo.alt='';logo.loading='lazy';logo.onerror=()=>{logo.onerror=null;logo.src=fallbackLogo(ch.name)};
  const name=document.createElement('span');name.className='name';name.textContent=ch.name;row.append(logo,name);row.onclick=()=>play(ch);wrap.append(row);
  if(mode==='iptv'){
   const remove=document.createElement('button');remove.className='remove';remove.type='button';remove.textContent='×';remove.title='حذف';remove.setAttribute('aria-label','حذف '+ch.name);
   remove.onclick=()=>{if(active===ch){clear();active=null}custom=custom.filter(c=>c!==ch);save();render()};wrap.append(remove)
  }
  root.append(wrap)
 }
}
function setMode(value){
 if(value===mode)return;clear();active=null;mode=value;
 for(const id of ['tnt','radio','iptv']){$(id).classList.toggle('active',id===value);$(id).setAttribute('aria-pressed',String(id===value))}
 $('editor').hidden=value!=='iptv';say('');render()
}
$('tnt').onclick=()=>setMode('tnt');$('radio').onclick=()=>setMode('radio');$('iptv').onclick=()=>setMode('iptv');
$('stop').onclick=()=>{clear();active=null;say('');render()};$('retry').onclick=()=>{if(active)play(active)};
$('screenFull').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await screen.requestFullscreen()}catch{}};
$('editor').onsubmit=e=>{e.preventDefault();const name=e.target.elements.name.value.trim(),url=e.target.elements.url.value.trim();if(!name||!validURL(url)){say('الرابط غير صالح');return}custom.push({id:'custom-'+Date.now(),name,sources:[url]});custom=normalize(custom.slice(-500));save();e.target.reset();render()};
$('importButton').onclick=()=>$('import').click();
$('import').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){say('الملف كبير');return}
 try{const text=await file.text();let incoming=[];
  if(file.name.toLowerCase().endsWith('.json')){const json=JSON.parse(text);incoming=normalize(Array.isArray(json)?json:json.channels)}
  else incoming=parseM3U(text);
  const existing=new Set(custom.map(c=>c.sources[0]));const added=incoming.filter(c=>!existing.has(c.sources[0]));custom=normalize(custom.concat(added));save();render();say(added.length+' قناة جديدة')
 }catch{say('تعذر قراءة الملف')}finally{e.target.value=''}
};
let wheel=0,last=0;
$('tabs').addEventListener('wheel',e=>{e.preventDefault();const now=Date.now();if(now-last<180)return;wheel+=e.deltaY;if(Math.abs(wheel)<35)return;window.chrome?.webview?.postMessage(wheel>0?'next':'previous');wheel=0;last=now},{passive:false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.fullscreenElement)document.exitFullscreen();else window.chrome?.webview?.postMessage('close')}});
const canvas=$('noise'),ctx=canvas.getContext('2d');
function noise(){if(document.hidden||$('noise').hidden)return;const img=ctx.createImageData(canvas.width,canvas.height);for(let i=0;i<img.data.length;i+=4){const n=24+Math.random()*72;img.data[i]=n;img.data[i+1]=n+2;img.data[i+2]=n+6;img.data[i+3]=255}ctx.putImageData(img,0,0)}
noise();setInterval(noise,220);render();