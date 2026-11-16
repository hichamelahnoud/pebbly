(function(root){
 'use strict';
 function validURL(value){
  if(typeof value!=='string'||value.length>2048)return false;
  try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password}catch{return false}
 }
 function normalize(list){return (Array.isArray(list)?list:[]).slice(0,500).filter(c=>c&&typeof c.name==='string'&&Array.isArray(c.sources)&&c.sources.some(validURL)).map((c,i)=>({id:'custom-'+i,name:c.name.slice(0,80),sources:c.sources.filter(validURL).slice(0,5)}))}
 function parseM3U(text){
  const channels=[];let name='';
  for(const raw of text.split(/\r?\n/)){
   const line=raw.trim();
   if(line.startsWith('#EXTINF:'))name=line.includes(',')?line.slice(line.indexOf(',')+1):'';
   else if(validURL(line)){channels.push({name:name||'TV '+(channels.length+1),sources:[line]});name=''}
  }
  return normalize(channels);
 }
 const api={validURL,normalize,parseM3U};
 if(typeof module!=='undefined')module.exports=api;else root.TVData=api;
})(typeof window!=='undefined'?window:globalThis);
