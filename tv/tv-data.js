(function(root){
 'use strict';
 function validURL(value){
  if(typeof value!=='string'||value.length>2048)return false;
  try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password}catch{return false}
 }
 function normalize(list){
  return (Array.isArray(list)?list:[]).slice(0,500).filter(c=>c&&typeof c.name==='string'&&Array.isArray(c.sources)&&c.sources.some(validURL)).map((c,i)=>{
   const item={id:typeof c.id==='string'?c.id:'custom-'+i,name:c.name.slice(0,80),sources:c.sources.filter(validURL).slice(0,5)};
   if(validURL(c.logo))item.logo=c.logo;
   if(typeof c.rgb==='string'&&/^\d{1,3},\d{1,3},\d{1,3}$/.test(c.rgb))item.rgb=c.rgb;
   return item
  })
 }
 function parseM3U(text){
  const channels=[];let name='',logo='';
  for(const raw of text.split(/\r?\n/)){
   const line=raw.trim();
   if(line.startsWith('#EXTINF:')){
    name=line.includes(',')?line.slice(line.indexOf(',')+1).trim():'';
    const match=line.match(/tvg-logo=["']([^"']+)["']/i);logo=match?match[1]:''
   }else if(validURL(line)){channels.push({name:name||'TV '+(channels.length+1),logo,sources:[line]});name='';logo=''}
  }
  return normalize(channels)
 }
 const api={validURL,normalize,parseM3U};
 if(typeof module!=='undefined')module.exports=api;else root.TVData=api;
})(typeof window!=='undefined'?window:globalThis);