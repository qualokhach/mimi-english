'use strict';
/* ===== Lõi tạo và kiểm tra key Pro (dùng chung cho app và công cụ admin) ===== */
const PRO={SECRET:'1640eca86a107d16f85517e9b37c4b979f94861363004263',AL:'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',EPOCH:Date.UTC(2026,0,1),LIFE:30};
PRO.sha256=function(m){
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const l=m.length,n=((l+9+63)>>6)<<6,b=new Uint8Array(n);b.set(m);b[l]=0x80;const dv=new DataView(b.buffer);dv.setUint32(n-4,(l*8)>>>0);dv.setUint32(n-8,Math.floor(l*8/4294967296));
  const w=new Array(64),r=(x,k)=>(x>>>k)|(x<<(32-k));
  for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);
    for(let i=16;i<64;i++){const a=w[i-15],c=w[i-2];w[i]=(w[i-16]+(r(a,7)^r(a,18)^(a>>>3))+w[i-7]+(r(c,17)^r(c,19)^(c>>>10)))>>>0}
    let [a,c,d,e,f,g,h,j]=H;
    for(let i=0;i<64;i++){const t1=(j+(r(f,6)^r(f,11)^r(f,25))+((f&g)^(~f&h))+K[i]+w[i])>>>0,t2=((r(a,2)^r(a,13)^r(a,22))+((a&c)^(a&d)^(c&d)))>>>0;j=h;h=g;g=f;f=(e+t1)>>>0;e=d;d=c;c=a;a=(t1+t2)>>>0}
    H=[H[0]+a,H[1]+c,H[2]+d,H[3]+e,H[4]+f,H[5]+g,H[6]+h,H[7]+j].map(x=>x>>>0)}
  const out=new Uint8Array(32),ov=new DataView(out.buffer);H.forEach((x,i)=>ov.setUint32(i*4,x));return out};
PRO.utf8=s=>{const a=[];for(const ch of unescape(encodeURIComponent(s)))a.push(ch.charCodeAt(0));return Uint8Array.from(a)};
PRO.hmac=function(k,m){let key=PRO.utf8(k);if(key.length>64)key=PRO.sha256(key);const ip=new Uint8Array(64+m.length),op=new Uint8Array(96);
  for(let i=0;i<64;i++){const x=key[i]||0;ip[i]=x^0x36;op[i]=x^0x5c}ip.set(m,64);op.set(PRO.sha256(ip),64);return PRO.sha256(op)};
PRO.norm=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'').replace(/O/g,'0').replace(/I/g,'1');
PRO.tag=function(dev,day,mo){const h=PRO.hmac(PRO.SECRET,PRO.utf8(PRO.norm(dev)+'|'+day+'|'+mo));let v=0n;for(let i=0;i<11;i++)v=(v<<8n)|BigInt(h[i]);return v>>6n};
PRO.make=function(dev,day,mo){let v=(BigInt(day)<<86n)|(BigInt(mo)<<82n)|PRO.tag(dev,day,mo),s='';for(let i=19;i>=0;i--)s+=PRO.AL[Number((v>>BigInt(i*5))&31n)];return s.replace(/(.{5})(?=.)/g,'$1-')};
PRO.parse=function(key){const k=String(key||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(k.length!==20)return null;let v=0n;for(const ch of k){const i=PRO.AL.indexOf(ch);if(i<0)return null;v=(v<<5n)|BigInt(i)}
  return {day:Number((v>>86n)&0x3FFFn),mo:Number((v>>82n)&15n),tag:v&((1n<<82n)-1n)}};
PRO.today=()=>Math.floor((Date.now()-PRO.EPOCH)/864e5);
PRO.dateOf=d=>{const t=new Date(PRO.EPOCH+d*864e5);return String(t.getUTCDate()).padStart(2,'0')+'/'+String(t.getUTCMonth()+1).padStart(2,'0')+'/'+t.getUTCFullYear()};
PRO.check=function(key,dev,now){const p=PRO.parse(key);if(!p||p.mo<1)return {ok:false,why:'bad'};if(PRO.tag(dev,p.day,p.mo)!==p.tag)return {ok:false,why:'dev'};
  const last=p.day+PRO.LIFE*p.mo-1;now=now==null?PRO.today():now;if(now<p.day-1)return {ok:false,why:'early'};if(now>last)return {ok:false,why:'exp',exp:last};return {ok:true,exp:last,left:last-now+1}};
