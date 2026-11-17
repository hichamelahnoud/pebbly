const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve('tv');
const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;const p=path.join(root,name==='/'?'index.html':name);if(!p.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(p,(err,buf)=>{res.writeHead(err?404:200,{'Content-Type':p.endsWith('.js')?'text/javascript':'text/html'});res.end(err?'':buf)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:720,height:578}});const errors=[];
 await page.addInitScript(()=>{window.__commands=[];window.chrome=window.chrome||{};window.chrome.webview={postMessage:m=>window.__commands.push(m)}});
 page.on('pageerror',e=>errors.push(String(e)));await page.goto('http://127.0.0.1:'+server.address().port);
 assert.equal(await page.locator('.channel').count(),9);assert.equal(await page.locator('.channel .logo').count(),9);
 const box=await page.locator('#screen').boundingBox();assert.ok(Math.abs(box.width/box.height-16/9)<.02);
 await page.locator('#radio').click();assert.equal(await page.locator('.channel').count(),42);assert.equal(await page.locator('.channel .meta').count(),42);assert.equal(await page.locator('#radio[aria-pressed=true]').count(),1);await page.locator('#search').fill('Medi 1');assert.equal(await page.locator('.channel').count(),14);await page.locator('#search').fill('');assert.equal(await page.locator('.channel').count(),42);
 await page.locator('#iptv').click();await page.locator('[name=name]').fill('قناة تجريبية');await page.locator('[name=url]').fill('https://example.com/live.m3u8');await page.locator('button[type=submit]').click();assert.equal(await page.locator('.channel').count(),1);
 await page.reload();await page.locator('#iptv').click();assert.equal(await page.locator('.channel').count(),1);await page.locator('.remove').click();assert.equal(await page.locator('.channel').count(),0);
 await page.locator('#import').setInputFiles({name:'channels.m3u',mimeType:'text/plain',buffer:Buffer.from('#EXTM3U\n#EXTINF:-1 tvg-logo="https://example.com/a.png",الأولى\nhttps://example.com/a.m3u8\n#EXTINF:-1,الثانية\nhttps://example.com/b.m3u8')});
 await page.waitForFunction(()=>document.querySelectorAll('.channel').length===2);assert.equal(await page.locator('.channel .logo').first().getAttribute('src'),'https://example.com/a.png');
 await page.locator('#tnt').click();assert.equal(await page.locator('.channel').count(),9);await page.locator('#tabs').hover();await page.mouse.wheel(0,120);await page.waitForFunction(()=>window.__commands.includes('next'));
 assert.deepEqual(errors,[]);console.log('PASS: modern two-column channel cards, metadata, 42-station radio, IPTV import and wheel navigation.');
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});