'use strict';
const $ = id => document.getElementById(id);
const snrt = id => 'https://snrt.player.easybroadcast.io/events/' + id;
// Official player pages and streams from the user's earlier NOVA TV kit.
const builtin = [
  {id:'aoula',name:'الأولى',sources:[snrt('73_aloula_w1dqfwm'),'https://streaming.snrtlive.ma/live/slaalaoula/slaalaoula.m3u8']},
  {id:'arryadia',name:'الرياضية',sources:[snrt('73_arryadia_k2tgcj0'),'https://streaming.snrtlive.ma/live/slaarryadia/slaarryadia.m3u8']},
  {id:'2m',name:'2M Monde',sources:['https://cdn-globecast.akamaized.net/live/eds/2m_monde/hls_video_ts_tuhawxpiemz257adfc/2m_monde.m3u8']},
  {id:'medi1',name:'Medi 1 TV',sources:['https://cdn.live.easybroadcast.io/abr_corp/83_medi1tv-maghreb_jnbspmg/playlist.m3u8']},
  {id:'tamazight',name:'تمازيغت',sources:[snrt('73_tamazight_tccybxt')]},
  {id:'maghribia',name:'المغربية',sources:[snrt('73_almaghribia_83tz85q')]},
  {id:'athaqafia',name:'الثقافية',sources:[snrt('73_arrabia_hthcj4p')]},
  {id:'laayoune',name:'العيون',sources:[snrt('73_laayoune_pgagr52')]},
  {id:'assadissa',name:'السادسة',sources:['https://streaming.snrtlive.ma/live/slaassadissa/slaassadissa.m3u8']}
];
const key = 'pebbly-tv-channels-v1';
const {validURL,normalize,parseM3U}=TVData;
let custom=[];try{custom=normalize(JSON.parse(localStorage.getItem(key)||'[]'))}catch{}
let mode='tnt',active=null,hls=null,timeout=null,generation=0;
const video=$('video'),iframe=$('frame');
function say(s){$('status').textContent=s}
function save(){try{localStorage.setItem(key,JSON.stringify(custom));return true}catch{say('ما قدرناش نحفظو اللائحة. مساحة التخزين عامرة.');return false}}
function clear(){generation++;clearTimeout(timeout);if(hls){hls.destroy();hls=null}video.pause();video.removeAttribute('src');video.load();video.style.display='none';iframe.removeAttribute('src');iframe.style.display='none';$('empty').hidden=false;$('noise').hidden=false;$('retry').hidden=true;$('stop').hidden=true}
function play(ch,index=0){
  clear();active=ch;render();const token=generation;const url=ch.sources[index];
  if(!url){say('البث غير متاح دابا. جرّب قناة أخرى أو حدّث الرابط.');$('retry').hidden=false;return}
  $('stop').hidden=false;say('كيتفتح البث: '+ch.name);
  let failed=false;
  const fail=()=>{if(token!==generation||failed)return;failed=true;play(ch,index+1)};
  const ready=()=>{if(token!==generation)return;clearTimeout(timeout);$('empty').hidden=true;$('noise').hidden=true;say(ch.name);$('retry').hidden=true};
  const u=new URL(url);
  if(u.hostname==='snrt.player.easybroadcast.io'&&u.pathname.startsWith('/events/')){
    iframe.style.display='block';iframe.src=url;$('empty').hidden=true;$('noise').hidden=true;
    say(ch.name+' — إلا طلب المشغّل، اضغط Play');$('retry').hidden=false;return;
  }
  video.style.display='block';video.muted=false;video.volume=1;
  video.onplaying=ready;video.onerror=fail;
  const start=()=>video.play().catch(()=>{if(token===generation)say('اضغط Play داخل الفيديو لتشغيل '+ch.name)});
  timeout=setTimeout(fail,20000);
  if(/\.m3u8(?:[?#]|$)/i.test(url)&&window.Hls&&Hls.isSupported()){
    hls=new Hls({enableWorker:true,maxBufferLength:20});
    hls.on(Hls.Events.MANIFEST_PARSED,start);
    hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)fail()});
    hls.loadSource(url);hls.attachMedia(video);
  }else{video.src=url;start()}
}
function render(){
  const root=$('channels');root.replaceChildren();
  for(const ch of mode==='tnt'?builtin:custom){
    const row=document.createElement('button');row.className='channel'+(active===ch?' selected':'');row.type='button';row.setAttribute('aria-label',ch.name);
    const badge=document.createElement('span');badge.className='badge';badge.textContent='TV';
    const name=document.createElement('span');name.className='name';name.textContent=ch.name;
    row.append(badge,name);row.onclick=()=>play(ch);root.append(row);
    if(mode==='iptv'){
      const remove=document.createElement('button');remove.className='remove';remove.type='button';remove.textContent='×';remove.title='حذف '+ch.name;
      // Separate sibling control: no nested interactive elements.
      row.style.position='relative';row.style.paddingInlineEnd='27px';
      const wrap=document.createElement('div');wrap.style.position='relative';row.replaceWith(wrap);wrap.append(row,remove);row.style.width='100%';
      Object.assign(remove.style,{position:'absolute',left:'2px',top:'6px',background:'transparent',padding:'3px 6px'});
      remove.onclick=()=>{if(active===ch){clear();active=null}custom=custom.filter(c=>c!==ch);save();render()};
    }
  }
  $('notice').textContent=mode==='iptv'?'زيد رابط بث مباشر HTTP/HTTPS، أو استورد لائحة M3U ديالك.':'توفر البث كيتعلق بالقناة والمنطقة.';
}
function setMode(value){mode=value;for(const id of ['tnt','iptv']){$(id).classList.toggle('active',id===value);$(id).setAttribute('aria-pressed',String(id===value))}$('editor').hidden=value!=='iptv';render()}
$('tnt').onclick=()=>setMode('tnt');$('iptv').onclick=()=>setMode('iptv');
$('stop').onclick=()=>{clear();active=null;say('توقف البث');render()};$('retry').onclick=()=>{if(active)play(active)};
$('editor').onsubmit=e=>{e.preventDefault();const name=e.target.elements.name.value.trim(),url=e.target.elements.url.value.trim();if(!name||!validURL(url)){say('دخل اسم ورابط بث HTTP/HTTPS صحيح.');return}custom.push({id:'custom-'+Date.now(),name,sources:[url]});custom=custom.slice(-500);save();e.target.reset();render()};
$('importButton').onclick=()=>$('import').click();
$('import').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){say('اللائحة كبيرة بزاف: الحد الأقصى 2 MB.');return}
 try{const text=await file.text();let incoming=[];
  if(file.name.toLowerCase().endsWith('.json')){const json=JSON.parse(text);incoming=normalize(Array.isArray(json)?json:json.channels)}
  else{incoming=parseM3U(text)}
  incoming=normalize(incoming);const existing=new Set(custom.map(c=>c.sources[0]));const added=incoming.filter(c=>!existing.has(c.sources[0]));custom=normalize(custom.concat(added));save();render();say('تم استيراد '+added.length+' قناة.');
 }catch{say('ما قدرناش نقراو هاد الملف. استعمل M3U أو JSON ديال القنوات.')}finally{e.target.value=''}
};
let wheel=0,last=0;
$('tabs').addEventListener('wheel',e=>{e.preventDefault();const now=Date.now();if(now-last<180)return;wheel+=e.deltaY;if(Math.abs(wheel)<35)return;window.chrome?.webview?.postMessage(wheel>0?'next':'previous');wheel=0;last=now},{passive:false});
document.addEventListener('keydown',e=>{if(e.key==='Escape')window.chrome?.webview?.postMessage('close')});
const canvas=$('noise'),ctx=canvas.getContext('2d');
function noise(){if(document.hidden||$('noise').hidden)return;const img=ctx.createImageData(160,90);for(let i=0;i<img.data.length;i+=4){const n=30+Math.random()*100;img.data[i]=img.data[i+1]=img.data[i+2]=n;img.data[i+3]=255}ctx.putImageData(img,0,0)}
noise();setInterval(noise,180);render();
