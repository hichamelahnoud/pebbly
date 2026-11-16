'use strict';
const fs=require('fs'),path=require('path');
const [,,packFile,outDir]=process.argv;
if(!packFile||!outDir)throw new Error('usage: node download-logos.cjs <pack.json> <out-dir>');
const pack=JSON.parse(fs.readFileSync(packFile,'utf8'));
const jobs=[];
for(const [kind,items] of Object.entries(pack))for(const [id,sources] of Object.entries(items))jobs.push({kind,id,sources});
async function download(job){
 const dir=path.join(outDir,job.kind);fs.mkdirSync(dir,{recursive:true});
 for(const url of job.sources)try{
  const r=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Pebbly-Logo-Pack/1.0'}});
  if(!r.ok)throw new Error('HTTP '+r.status);const b=Buffer.from(await r.arrayBuffer());
  if(!b.length||b.length>3*1024*1024)throw new Error('invalid size');
  fs.writeFileSync(path.join(dir,job.id+'.png'),b);return true
 }catch(e){console.warn('logo',job.kind,job.id,e.message)}
 return false
}
(async()=>{let saved=0;for(let i=0;i<jobs.length;i+=8){const done=await Promise.all(jobs.slice(i,i+8).map(download));saved+=done.filter(Boolean).length}console.log('Saved '+saved+' verified logos of '+jobs.length+'.')})().catch(e=>{console.error(e);process.exitCode=1});