/* Mimi English: lưu sẵn để chạy nhanh và ngoại tuyến. Tăng số phiên bản khi cập nhật app. */
const V='mimi-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','assets/three.min.js','assets/voice.json','assets/ort-wasm-simd-threaded.mjs'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;
  const u=new URL(r.url);
  const own=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.host)||u.host==='cdnjs.cloudflare.com';
  if(!own&&!font)return; /* nhạc từ GitHub và các nguồn khác: để trình duyệt tự xử lý */
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r);
    const net=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>hit);
    return hit||net}))});
