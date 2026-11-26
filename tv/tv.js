'use strict';
const $=id=>document.getElementById(id);
const snrt=id=>'https://snrt.player.easybroadcast.io/events/'+id;
const logoSvg=(text,bg,fg='#fff',accent='#fff')=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="69" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI,Tahoma,sans-serif" font-size="'+(text.length>8?18:text.length>4?25:38)+'" font-weight="750" fill="'+fg+'">'+text+'</text></svg>'
);
const logoPath=(kind,id)=>'logos/'+kind+'/'+id+'.png';
const builtin=[
 {id:'aoula',name:'Al Aoula',logo:logoPath('tv','aoula'),rgb:'242,138,34',sources:[snrt('73_aloula_w1dqfwm'),'https://streaming.snrtlive.ma/live/slaalaoula/slaalaoula.m3u8','https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/al_aoula_inter/hls_snrt/index.m3u8']},
 {id:'2m',name:'2M Maroc',logo:logoPath('tv','2m'),rgb:'194,72,133',sources:["https://viamotionhsi.netplus.ch/live/eds/2mmaroc/browser-HLS8/2mmaroc.m3u8"]},
 {id:'arryadia',name:'Arryadia',logo:logoPath('tv','arryadia'),rgb:'22,155,98',sources:[snrt('73_arryadia_k2tgcj0'),'https://streaming.snrtlive.ma/live/slaarryadia/slaarryadia.m3u8','https://cdn-globecast.akamaized.net/live/eds/arriadia/hls_snrt/index.m3u8']},
 {id:'athaqafia',name:'Athaqafia',logo:logoPath('tv','athaqafia'),logoBackup:'https://i.imgur.com/mrwFI2L.png',rgb:'117,82,168',sources:[snrt('73_arrabia_hthcj4p'),'https://cdn-globecast.akamaized.net/live/eds/arrabiaa/hls_snrt/index.m3u8']},
 {id:'maghribia',name:'Al Maghribia',logo:logoPath('tv','maghribia'),logoBackup:'https://i.imgur.com/7GaahYh.png',rgb:'7,140,136',sources:[snrt('73_almaghribia_83tz85q'),'https://cdn-globecast.akamaized.net/live/eds/al_maghribia_snrt/hls_snrt/index.m3u8']},
 {id:'assadissa',name:'Assadissa',logo:logoPath('tv','assadissa'),logoBackup:'https://i.imgur.com/un6qTGO.png',rgb:'50,160,90',sources:["https://snrt.player.easybroadcast.io/events/73_assadissa_7b7u5n1","https://cdn.live.easybroadcast.io/ts_corp/73_assadissa_7b7u5n1/playlist_dvr.m3u8"]},
 {id:'aflam',name:'Aflam TV (7)',logo:logoPath('tv','aflam'),logoBackup:'https://stream.moroccohelp.com/logos/tv/aflam-tv.png',rgb:'221,56,61',sources:[]},
 {id:'tamazight',name:'Tamazight',logo:logoPath('tv','tamazight'),logoBackup:'https://i.imgur.com/fm6S7we.png',rgb:'184,148,66',sources:[snrt('73_tamazight_tccybxt'),'https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/tamazight_tv8_snrt/hls_snrt/index.m3u8']},
 {id:'laayoune',name:'Laayoune',logo:logoPath('tv','laayoune'),logoBackup:'https://i.ibb.co/GQmw3nx/laayoune.png',rgb:'217,108,37',sources:[snrt('73_laayoune_pgagr52'),'https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/al_aoula_laayoune/hls_snrt/index.m3u8']},
 {id:'medi1',name:'Medi 1 TV Maghreb',logo:logoPath('tv','medi1tv'),rgb:'215,25,49',sources:["https://medi1tv.player.easybroadcast.io/events/83_medi1tv-maghreb_jnbspmg","https://cdn.live.easybroadcast.io/abr_corp/83_medi1tv-maghreb_jnbspmg/playlist.m3u8"]},
 {id:'2mmonde',name:'2M Monde',logo:logoPath('tv','2mmonde'),logoBackup:'https://raw.githubusercontent.com/t4r1k2-dev/minitv-logos/main/2mmonde.png',rgb:'194,72,133',sources:["https://d2qh3gh0k5vp3v.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-n6pess5lwbghr/2M_ES.m3u8","https://cdn-globecast.akamaized.net/live/eds/2m_monde/hls_video_ts_tuhawxpiemz257adfc/2m_monde.m3u8"]},
 {id:'medi1arabic',name:'Medi 1 TV Arabic',logo:logoPath('tv','medi1tv'),rgb:'215,25,49',sources:["https://medi1tv.player.easybroadcast.io/events/83_medi1tv-arabic_g90v4ec","https://streaming1.medi1tv.com/live/smil:medi1ar.smil/playlist.m3u8"]},
 {id:'medi1afrique',name:'Medi 1 TV Afrique',logo:logoPath('tv','medi1afrique'),logoBackup:'https://i.imgur.com/gHwCFb0.png',rgb:'215,25,49',sources:["https://medi1tv.player.easybroadcast.io/events/83_medi1tv-afrique_tm7tu45","https://streaming1.medi1tv.com/live/smil:medi1fr.smil/playlist.m3u8"]},
 {id:'chadatv',name:'Chada TV',logo:logoPath('tv','chadatv'),logoBackup:'https://i.imgur.com/inJyJBN.png',rgb:'192,45,60',sources:["https://chadatv.vedge.infomaniak.com/livecast/chadatv/playlist.m3u8"]},
 {id:'m24',name:'M24 TV',logo:logoPath('tv','m24'),logoBackup:'https://i.imgur.com/7uv5Feu.png',rgb:'76,131,190',sources:["https://www.m24tv.ma/live/smil:OutStream1.smil/chunklist.m3u8","https://63df3191463ce.streamlock.net/live/ngrp:Live2.stream_all/index.m3u8"]},
 {id:'telemaroc',name:'Tele Maroc',logo:logoPath('tv','telemaroc'),logoBackup:'https://upload.wikimedia.org/wikipedia/commons/8/8f/Logotelemaroc.jpeg',rgb:'181,54,72',sources:[]}
];
const radios=[
 {id:"mohammed-6",kind:'radio',name:"Radio Mohammed VI du Saint Coran - 98.6 FM",group:"Holy Quran",logo:logoPath('radio',"mohammed-6"),rgb:"176,131,38",sources:["https://cdn.live.easybroadcast.io/live/radio_med_VI/chunks.m3u8"]},
 {id:"medi1-radio-876",kind:'radio',name:"Medi 1 Radio - 87.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-radio-876"),rgb:"210,37,53",sources:["https://streaming1.medi1tv.com/radio/radio_mag.stream_aac/chunklist_w1614112007.m3u8"]},
 {id:"med-radio",kind:'radio',name:"Med Radio - 88.2 FM",group:"Moroccan FM",logo:logoPath('radio',"med-radio"),rgb:"70,118,190",sources:["https://medradio.ice.infomaniak.ch/medradio-128.mp3"]},
 {id:"u-radio",kind:'radio',name:"U Radio - 88.7 FM",group:"Moroccan FM",logo:logoPath('radio',"u-radio"),rgb:"31,145,112",sources:["https://uradio-aac.ice.infomaniak.ch/uradio.aac"]},
 {id:"snrt-chaine-inter",kind:'radio',name:"SNRT Chaîne Inter - 89.0 FM",group:"Moroccan FM",logo:logoPath('radio',"snrt-chaine-inter"),rgb:"184,70,112",sources:["https://cdn.live.easybroadcast.io/live/radio_inter/chunks.m3u8"]},
 {id:"radio-mars",kind:'radio',name:"Radio Mars - 91.2 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-mars"),rgb:"70,118,190",sources:["https://radiomars.ice.infomaniak.ch/radiomars-128.mp3"]},
 {id:"atlantic-925",kind:'radio',name:"Atlantic Radio - 92.5 FM",group:"Moroccan FM",logo:logoPath('radio',"atlantic-925"),rgb:"31,145,112",sources:["https://atlantic-sonic.nindohost.net:9300/stream/1/"]},
 {id:"radio-2m",kind:'radio',name:"Radio 2M - 93.1 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-2m"),rgb:"184,70,112",sources:["https://stream-175.zeno.fm/nefhp3q9fc9uv"]},
 {id:"radio-plus",kind:'radio',name:"Radio Plus - 94.0 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-plus"),rgb:"70,118,190",sources:["https://stream.radio.co/s8cc7a5da4/listen"]},
 {id:"radio-amazighe",kind:'radio',name:"Radio Amazighe - 95.3 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-amazighe"),rgb:"31,145,112",sources:["https://cdn.live.easybroadcast.io/live/radio_amazigh/chunks.m3u8"]},
 {id:"rim-radio",kind:'radio',name:"RIM RADIO - 102.4 FM",group:"Moroccan FM",logo:logoPath('radio',"rim-radio"),rgb:"184,70,112",sources:["https://streaming.rimradio.ma/live"]},
 {id:"mc-doualiya",kind:'radio',name:"MC Doualiya - 98.9 FM",group:"International radio",logo:logoPath('radio',"mc-doualiya"),rgb:"70,120,185",sources:["https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3"]},
 {id:"radio-tanger-med",kind:'radio',name:"Radio Tanger Med - 99.2 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-tanger-med"),rgb:"31,145,112",sources:["https://radiotangermed-22.ice.infomaniak.ch/radiotangermed-22-128.mp3"]},
 {id:"medi1-radio-996",kind:'radio',name:"Medi 1 Radio - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-radio-996"),rgb:"210,37,53",sources:["https://live.medi1.com/medi1#.mp3"]},
 {id:"medi1-classique",kind:'radio',name:"Medi 1 Classique - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-classique"),rgb:"210,37,53",sources:["https://live.medi1.com/Classique"]},
 {id:"medi1-acoustic",kind:'radio',name:"Medi 1 Acoustic - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-acoustic"),rgb:"210,37,53",sources:["https://live.medi1.com/Acoustic"]},
 {id:"medi1-nayda",kind:'radio',name:"Medi 1 Nayda - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-nayda"),rgb:"210,37,53",sources:["https://live.medi1.com/Nayda"]},
 {id:"medi1-tarab",kind:'radio',name:"Medi 1 Tarab - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-tarab"),rgb:"210,37,53",sources:["https://live.medi1.com/Tarab"]},
 {id:"medi1-andalouse",kind:'radio',name:"Medi 1 Andalouse - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-andalouse"),rgb:"210,37,53",sources:["https://live.medi1.com/Andalouse"]},
 {id:"medi1-soufi",kind:'radio',name:"Medi 1 Soufi - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-soufi"),rgb:"210,37,53",sources:["https://live.medi1.com/Soufi"]},
 {id:"medi1-francaise",kind:'radio',name:"Medi 1 Francaise - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-francaise"),rgb:"210,37,53",sources:["https://live.medi1.com/Francaise"]},
 {id:"medi1-dj",kind:'radio',name:"Medi 1 Dj - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-dj"),rgb:"210,37,53",sources:["https://live.medi1.com/Dj"]},
 {id:"medi1-hits",kind:'radio',name:"Medi 1 Hits - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-hits"),rgb:"210,37,53",sources:["https://live.medi1.com/Hits"]},
 {id:"medi1-jazz",kind:'radio',name:"Medi 1 Jazz - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-jazz"),rgb:"210,37,53",sources:["https://live.medi1.com/Jazz"]},
 {id:"medi1-latino",kind:'radio',name:"Medi 1 Latino - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-latino"),rgb:"210,37,53",sources:["https://live.medi1.com/Latino"]},
 {id:"medi1-lounge",kind:'radio',name:"Medi 1 Lounge - 99.6 FM",group:"Medi 1",logo:logoPath('radio',"medi1-lounge"),rgb:"210,37,53",sources:["https://live.medi1.com/Lounge"]},
 {id:"hit-radio",kind:'radio',name:"Hit Radio - 100.3 FM",group:"Moroccan FM",logo:logoPath('radio',"hit-radio"),rgb:"70,118,190",sources:["https://hitradio-maroc.ice.infomaniak.ch/hitradio-maroc-128.mp3"]},
 {id:"chada-fm",kind:'radio',name:"Chada FM - 100.8 FM",group:"Moroccan FM",logo:logoPath('radio',"chada-fm"),rgb:"31,145,112",sources:["https://stream.bodkas.com/playlist?id=chadafmradio"]},
 {id:"bbc-arabic",kind:'radio',name:"BBC/ Sawa Radio - 101.5 FM",group:"International radio",logo:logoPath('radio',"bbc-arabic"),rgb:"70,120,185",sources:["https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio"]},
 {id:"radio-medina-fm",kind:'radio',name:"Radio Medina FM - 102.1 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-medina-fm"),rgb:"70,118,190",sources:["https://medinafm.ice.infomaniak.ch/medinafm-64.mp3"]},
 {id:"mfm-1029",kind:'radio',name:"MFM Radio - 102.9 FM",group:"Moroccan FM",logo:logoPath('radio',"mfm-1029"),rgb:"31,145,112",sources:["https://a5.asurahosting.com:7980/radio.mp3"]},
 {id:"snrt-casablanca",kind:'radio',name:"SNRT Casablanca Régionale - 103.1 FM",group:"Moroccan FM",logo:logoPath('radio',"snrt-casablanca"),rgb:"184,70,112",sources:["https://cdn.live.easybroadcast.io/live/radio_casablanca/chunks.m3u8"]},
 {id:"radio-aswat",kind:'radio',name:"Radio Aswat - 104.3 FM",group:"Moroccan FM",logo:logoPath('radio',"radio-aswat"),rgb:"70,118,190",sources:["https://aswat.ice.infomaniak.ch/aswat-high.mp3"]},
 {id:"mfm-1049",kind:'radio',name:"MFM Radio - 104.9 FM",group:"Moroccan FM",logo:logoPath('radio',"mfm-1049"),rgb:"31,145,112",sources:["https://a5.asurahosting.com:7980/radio.mp3"]},
 {id:"cap-radio",kind:'radio',name:"Cap Radio - 105.7 FM",group:"Moroccan FM",logo:logoPath('radio',"cap-radio"),rgb:"184,70,112",sources:["https://listen.radioking.com/radio/710810/stream/776360"]},
 {id:"atlantic-1064",kind:'radio',name:"Atlantic Radio - 106.4 FM",group:"Moroccan FM",logo:logoPath('radio',"atlantic-1064"),rgb:"70,118,190",sources:["https://atlantic-sonic.nindohost.net:9300/stream"]},
 {id:"adwaa-fm",kind:'radio',name:"Adwaa FM - 106.7 FM",group:"Moroccan FM",logo:logoPath('radio',"adwaa-fm"),rgb:"31,145,112",sources:["https://stream-156.zeno.fm/5bxh2nh0x1zuv"]},
 {id:"rap-lbeldi-maroc",kind:'radio',name:"Rap Lbeldi Maroc",group:"Music and variety",logo:logoPath('radio',"rap-lbeldi-maroc"),rgb:"184,70,112",sources:["https://stream.zeno.fm/ivdufrl7q0quv.m3u"]},
 {id:"yabiladi-chaabi",kind:'radio',name:"Yabiladi Chaabi Maroc",group:"Music and variety",logo:logoPath('radio',"yabiladi-chaabi"),rgb:"70,118,190",sources:["https://radio.yabiladi.com:8102/;stream.mp3"]},
 {id:"fayroz",kind:'radio',name:"Fayroz",group:"Music and variety",logo:logoPath('radio',"fayroz"),rgb:"31,145,112",sources:["https://stream.zeno.fm/zv3e5wykprhvv.mp3"]},
 {id:"radio-coran",kind:'radio',name:"Radio Coran",group:"Holy Quran",logo:logoPath('radio',"radio-coran"),rgb:"176,131,38",sources:["https://virmach1.hajjam.net:8005/stream/1/"]},
 {id:"saad-al-ghamdi",kind:'radio',name:"Saad Al-Ghamdi",group:"Holy Quran",logo:logoPath('radio',"saad-al-ghamdi"),rgb:"176,131,38",sources:["https://backup.qurango.net/radio/saad_alghamdi"]}
];
const key='pebbly-tv-channels-v1';
const {validURL,normalize,parseM3U}=TVData;
let custom=[];try{custom=normalize(JSON.parse(localStorage.getItem(key)||'[]'))}catch{}
let mode='tnt',active=null,hls=null,timeout=null,generation=0,sourceIndex=0;
const video=$('video'),audio=$('audio'),iframe=$('frame'),screen=$('screen');
function radioUI(state){
 const playing=state==='playing';
 $('radioStage').classList.toggle('is-playing',playing);
 $('radioState').textContent=({playing:'Live on air',paused:'Paused',loading:'Connecting…',error:'Stream unavailable',idle:'Ready to listen'})[state];
 $('radioPlayIcon').setAttribute('d',playing?'M7 5h4v14H7zM13 5h4v14h-4z':'M8 5v14l11-7z');
 $('radioPlay').setAttribute('aria-label',playing?'Pause':'Play');
}
function say(value){$('status').textContent=value||''}
function save(){try{localStorage.setItem(key,JSON.stringify(custom));return true}catch{say('Could not save channel list');return false}}
function setAccent(ch){
 document.documentElement.style.setProperty('--accent',ch?.rgb||'110,155,255');
 if(ch?.logo)document.documentElement.style.setProperty('--ambient','url("'+ch.logo.replace(/"/g,'%22')+'")');
 else document.documentElement.style.removeProperty('--ambient')
}
function clear(){
 generation++;clearTimeout(timeout);iframe.onload=null;iframe.onerror=null;$('retry').textContent='Retry';$('emptyTitle').textContent=mode==='radio'?'Live radio':'Live TV';$('emptyHint').textContent=mode==='radio'?'Choose a station below':'Choose a channel below';audio.onplaying=null;audio.onerror=null;audio.onpause=null;audio.onwaiting=null;video.onplaying=null;video.onerror=null;radioUI('idle');if(hls){hls.destroy();hls=null}
 for(const media of [video,audio]){media.pause();media.removeAttribute('src');media.load()}
 video.style.display='none';iframe.removeAttribute('src');iframe.style.display='none';$('radioStage').hidden=true;
 $('empty').hidden=false;$('noise').hidden=false;$('retry').hidden=true;$('stop').hidden=true;screen.classList.remove('playing');setAccent(null)
}
function ready(ch,token){
 if(token!==generation)return;if(ch.kind==='radio')radioUI('playing');clearTimeout(timeout);$('empty').hidden=true;$('noise').hidden=true;
 screen.classList.add('playing');setAccent(ch);say(ch.name);$('retry').hidden=true
}
function play(ch,index=0){
 clear();active=ch;sourceIndex=index;render();const token=generation,url=ch.sources[index];
 if(!url){const message=ch.id==='aflam'?'TNT only — no verified online stream':ch.id==='telemaroc'?'No verified online stream':'Stream unavailable — all sources failed';say(ch.name+' — '+message);$('emptyTitle').textContent=ch.name;$('emptyHint').textContent=message;$('retry').hidden=!ch.sources.length;$('stop').hidden=false;if(ch.kind==='radio'){$('radioStage').hidden=false;$('empty').hidden=true;setAccent(ch);radioUI('error')}return}
 $('stop').hidden=false;say(ch.name+(index?' — Trying alternate stream '+(index+1):''));setAccent(ch);
 let failed=false;
 const fail=()=>{if(token!==generation||failed)return;failed=true;play(ch,index+1)};
 const u=new URL(url);
 if(ch.kind==='radio'){
  const stage=$('radioStage');stage.hidden=false;$('empty').hidden=true;$('noise').hidden=true;
  const frequency=ch.name.match(/^(.*?)\s+-\s+([0-9.]+\s*FM)$/i);
  const logo=$('radioLogo');logo.onerror=()=>{logo.onerror=null;logo.src=fallbackLogo(ch.name)};logo.src=ch.logo||fallbackLogo(ch.name);logo.alt=ch.name;
  $('radioName').textContent=frequency?frequency[1]:ch.name;$('radioFrequency').textContent=frequency?frequency[2]:(ch.group||'Radio');
  radioUI('loading');
  audio.onplaying=()=>ready(ch,token);audio.onerror=fail;
  audio.onpause=()=>{if(token===generation)radioUI('paused')};
  audio.onwaiting=()=>{if(token===generation&&!audio.paused)radioUI('loading')};
  const start=()=>audio.play().catch(()=>{if(token===generation){clearTimeout(timeout);radioUI('paused');say(ch.name)}});
  timeout=setTimeout(fail,20000);
  if(/\.m3u8(?:[?#]|$)/i.test(url)&&window.Hls&&Hls.isSupported()){hls=new Hls({enableWorker:true,maxBufferLength:20});hls.on(Hls.Events.MANIFEST_PARSED,start);hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)fail()});hls.loadSource(url);hls.attachMedia(audio)}
  else{audio.src=url;start()}
  return
 }
 if(['snrt.player.easybroadcast.io','medi1tv.player.easybroadcast.io'].includes(u.hostname)&&u.pathname.startsWith('/events/')){
  $('empty').hidden=true;iframe.style.display='block';
  say(ch.name+' — Official player');
  iframe.onerror=fail;
  iframe.onload=()=>{if(token===generation){clearTimeout(timeout);screen.classList.add('playing');say(ch.name+' — Official player (press play if needed)')}};
  timeout=setTimeout(fail,18000);
  iframe.src=url;
  if(ch.sources.length>1){$('retry').textContent='Next source';$('retry').hidden=false}
  return
 }
 video.style.display='block';video.onplaying=()=>ready(ch,token);video.onerror=fail;
 const start=()=>video.play().catch(err=>{if(token!==generation)return;if(err.name==='NotAllowedError'){say(ch.name+' — Press play');return}fail()});
 timeout=setTimeout(fail,20000);
 if(/\.m3u8(?:[?#]|$)/i.test(url)&&window.Hls&&Hls.isSupported()){hls=new Hls({enableWorker:true,maxBufferLength:20});hls.on(Hls.Events.MANIFEST_PARSED,start);hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)fail()});hls.loadSource(url);hls.attachMedia(video)}
 else{video.src=url;start()}
}
function list(){return mode==='tnt'?builtin:mode==='radio'?radios:custom}
function fallbackLogo(name){return logoSvg((name||'TV').slice(0,5),'#30343d','#fff','#8bb8ff')}
function render(){
 const root=$('channels'),scroll=root.scrollLeft;root.replaceChildren();
 const query=$('search').value.trim().toLocaleLowerCase();
 for(const ch of list().filter(item=>!query||item.name.toLocaleLowerCase().includes(query)||String(item.group||'').toLocaleLowerCase().includes(query))){
  const wrap=document.createElement('div');wrap.className='channel-wrap'+(mode==='iptv'?' removable':'');
  const row=document.createElement('button');row.className='channel'+(active===ch?' selected':'');row.type='button';row.title=ch.name;row.setAttribute('aria-label',ch.name);row.setAttribute('aria-pressed',String(active===ch));
  const logo=document.createElement('img');logo.className='logo';logo.src=ch.logo||fallbackLogo(ch.name);logo.alt='';logo.loading='lazy';logo.onerror=()=>{if(ch.logoBackup&&logo.src!==ch.logoBackup){logo.src=ch.logoBackup;return}logo.onerror=null;logo.src=fallbackLogo(ch.name)};
  const copy=document.createElement('span');copy.className='channel-copy';
  const name=document.createElement('span');name.className='name';
  const meta=document.createElement('span');meta.className='meta';
  const frequency=ch.name.match(/^(.*?)\s+-\s+([0-9.]+\s*FM)$/i);
  name.textContent=frequency?frequency[1]:ch.name;
  meta.textContent=frequency?frequency[2]:(ch.group||(mode==='iptv'?'IPTV':'TNT'));
  copy.append(name,meta);row.append(logo,copy);row.onclick=()=>play(ch);wrap.append(row);
  if(mode==='iptv'){
   const remove=document.createElement('button');remove.className='remove';remove.type='button';remove.textContent='×';remove.title='Remove';remove.setAttribute('aria-label','Remove '+ch.name);
   remove.onclick=()=>{if(active===ch){clear();active=null}custom=custom.filter(c=>c!==ch);save();render()};wrap.append(remove)
  }
  root.append(wrap)
 }
 root.scrollLeft=scroll;
}
function setMode(value){
 if(value===mode)return;clear();active=null;mode=value;document.body.dataset.mode=value;
 for(const id of ['tnt','radio','iptv']){$(id).classList.toggle('active',id===value);$(id).setAttribute('aria-pressed',String(id===value))}
 $('editor').hidden=value!=='iptv';$('search').value='';$('emptyTitle').textContent=value==='radio'?'Live radio':'Live TV';$('emptyHint').textContent=value==='radio'?'Choose a station below':'Choose a channel below';say('');render();$('channels').scrollLeft=0
}
$('search').addEventListener('input',()=>{render();$('channels').scrollLeft=0});
$('channels').addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&$('channels').scrollWidth>$('channels').clientWidth){e.preventDefault();$('channels').scrollLeft+=e.deltaY}},{passive:false});
$('radioPlay').onclick=()=>{if(!active||active.kind!=='radio')return;if($('radioState').textContent==='Stream unavailable'){play(active);return}if(audio.paused){audio.play().catch(()=>{radioUI('error');$('retry').hidden=false})}else{clearTimeout(timeout);audio.pause();radioUI('paused')}};
$('radioVolume').addEventListener('input',()=>{audio.volume=Number($('radioVolume').value)});
audio.addEventListener('volumechange',()=>{$('radioVolume').value=audio.volume});

$('tnt').onclick=()=>setMode('tnt');$('radio').onclick=()=>setMode('radio');$('iptv').onclick=()=>setMode('iptv');
$('stop').onclick=()=>{clear();active=null;say('');render()};$('retry').onclick=()=>{if(active)play(active,$('retry').textContent==='Next source'?(sourceIndex+1)%active.sources.length:0)};
const hostCommand=command=>window.chrome?.webview?.postMessage(command);
$('closeWindow').onclick=()=>hostCommand('close');
$('sizeWindow').onclick=()=>hostCommand('toggle-size');
$('windowDrag').addEventListener('mousedown',e=>{if(e.button===0&&!e.target.closest('button'))hostCommand('drag')});
$('screenFull').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await screen.requestFullscreen()}catch{}};
$('editor').onsubmit=e=>{e.preventDefault();const name=e.target.elements.name.value.trim(),url=e.target.elements.url.value.trim();if(!name||!validURL(url)){say('Invalid stream URL');return}custom.push({id:'custom-'+Date.now(),name,sources:[url]});custom=normalize(custom.slice(-500));save();e.target.reset();render()};
$('importButton').onclick=()=>$('import').click();
$('import').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){say('File is too large');return}
 try{const text=await file.text();let incoming=[];
  if(file.name.toLowerCase().endsWith('.json')){const json=JSON.parse(text);incoming=normalize(Array.isArray(json)?json:json.channels)}
  else incoming=parseM3U(text);
  const existing=new Set(custom.map(c=>c.sources[0]));const added=incoming.filter(c=>!existing.has(c.sources[0]));custom=normalize(custom.concat(added));save();render();say(added.length+' new channels')
 }catch{say('Could not read file')}finally{e.target.value=''}
};
let wheel=0,last=0;
$('tabs').addEventListener('wheel',e=>{e.preventDefault();const now=Date.now();if(now-last<180)return;wheel+=e.deltaY;if(Math.abs(wheel)<35)return;window.chrome?.webview?.postMessage(wheel>0?'next':'previous');wheel=0;last=now},{passive:false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.fullscreenElement)document.exitFullscreen();else window.chrome?.webview?.postMessage('close')}});
const canvas=$('noise'),ctx=canvas.getContext('2d');
function noise(){if(document.hidden||$('noise').hidden)return;const img=ctx.createImageData(canvas.width,canvas.height);for(let i=0;i<img.data.length;i+=4){const n=24+Math.random()*72;img.data[i]=n;img.data[i+1]=n+2;img.data[i+2]=n+6;img.data[i+3]=255}ctx.putImageData(img,0,0)}
render();