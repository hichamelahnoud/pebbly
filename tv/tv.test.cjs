const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validURL,normalize,parseM3U}=require('./tv-data.js');
test('imports named CRLF M3U channels and rejects executable/local entries',()=>{
 const result=parseM3U('#EXTM3U\r\n#EXTINF:-1 tvg-id="a",الأولى\r\nhttps://tv.example/live.m3u8\r\n#EXTINF:-1,Unsafe\r\njavascript:alert(1)\r\nfile:///secret.mp4\r\n#EXTINF:-1,Second\r\nhttps://tv.example/second.m3u8');
 assert.deepEqual(result.map(c=>c.name),['الأولى','Second']);assert.equal(result.length,2);
});
test('rejects credentials and malformed imported channel structures',()=>{
 assert.equal(validURL('https://user:secret@tv.example/stream'),false);
 assert.equal(validURL({toString:()=> 'https://tv.example'}),false);
 assert.deepEqual(normalize([null,{name:'x',sources:'https://tv.example'},{name:'ok',sources:['data:text/html,x','https://tv.example/live']}]).map(c=>c.sources),[['https://tv.example/live']]);
});
test('caps imported data and preserves Unicode channel names',()=>{
 const result=normalize(Array.from({length:800},()=>({name:'تمازيغت',sources:['https://tv.example/live']})));
 assert.equal(result.length,500);assert.equal(result[0].name,'تمازيغت');
});
