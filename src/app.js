'use strict';
/* ============ App logic ============ */
const $=s=>document.querySelector(s),$$=s=>Array.prototype.slice.call(document.querySelectorAll(s));
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const sv=(p,f)=>'<svg viewBox="0 0 24 24" fill="'+(f?'currentColor':'none')+'" stroke="'+(f?'none':'currentColor')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
const IC={
 play:sv('<path d="M8 5v14l11-7z"/>',1),pause:sv('<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',1),
 prev:sv('<path d="M6 6h2v12H6zM9.5 12L19 6v12z"/>',1),next:sv('<path d="M16 6h2v12h-2zM14.5 12L5 18V6z"/>',1),
 sub:sv('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 11h3M7 15h6M14 11h3M16 15h1"/>'),
 vol:sv('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"/>'),
 mute:sv('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/>'),
 full:sv('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
 gear:sv('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
 star:sv('<path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/>',1),
 flame:'<svg viewBox="0 0 24 24" fill="#ff7a1a" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/></svg>',
 spk:sv('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7"/>')
};

/* ---------- state ---------- */
const KEY='mimi-english-v1';
const DEF_SET={voice:true,vname:'',rate:.9,bi:false,speed:1,sub:'both',music:false,theme:'auto',sfx:true,lv:1,slv:1,sel:true,mvol:.5,rvol:.35,track:'rand',vm:'ai',vmv:3};
const freshST=()=>({xp:0,streak:0,last:'',done:{},qbest:{},words:{},badges:{},rec:0,matchWins:0,dict:{},rd:{},lis:{},gr:{},irr:{},set:Object.assign({},DEF_SET)});
let ST=freshST();
function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j){ST=Object.assign(ST,j);ST.set=Object.assign({},DEF_SET,j.set||{});if(ST.set.vmv!==3){ST.set.vm='ai';ST.set.vmv=3}}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}
const dayStr=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function streakNow(){const t=dayStr(new Date()),y=new Date();y.setDate(y.getDate()-1);return(ST.last===t||ST.last===dayStr(y))?ST.streak:0}
function touchDay(){const t=dayStr(new Date());if(ST.last===t)return;const y=new Date();y.setDate(y.getDate()-1);ST.streak=(ST.last===dayStr(y))?ST.streak+1:1;ST.last=t}
function addXP(n){ST.xp+=n;touchDay();save();hud();checkBadges()}
const isDone=l=>l.parts.every((p,i)=>ST.done[l.id+':'+i]);
const BADGES=[
 {id:'first',t:'Bước đầu',d:'Hoàn thành 1 bài',ok:()=>LESSONS.filter(isDone).length>=1},
 {id:'five',t:'Chăm chỉ',d:'Hoàn thành 5 bài',ok:()=>LESSONS.filter(isDone).length>=5},
 {id:'lv1',t:'Xong cấp 1',d:'Hoàn thành mọi bài cấp 1',ok:()=>LEVELS[0].lessons.every(isDone)},
 {id:'star3',t:'Ba sao',d:'Đạt 3 sao ở một bài trắc nghiệm',ok:()=>Object.keys(ST.qbest).some(k=>ST.qbest[k]>=3)},
 {id:'w20',t:'Kho từ vựng',d:'Học 20 từ',ok:()=>Object.keys(ST.words).length>=20},
 {id:'st3',t:'Ba ngày liền',d:'Học 3 ngày liên tiếp',ok:()=>ST.streak>=3},
 {id:'match',t:'Trí nhớ tốt',d:'Thắng trò ghép cặp',ok:()=>ST.matchWins>=1},
 {id:'rec',t:'Nhà sáng tạo',d:'Quay một video',ok:()=>ST.rec>=1},
 {id:'lv5',t:'Nửa chặng đường',d:'Hoàn thành mọi bài cấp 5',ok:()=>LEVELS[4].lessons.every(isDone)},
 {id:'g10',t:'Ngữ pháp vững',d:'Đánh dấu đã học 10 thẻ ngữ pháp',ok:()=>Object.keys(ST.gr).length>=10},
 {id:'rd10',t:'Mọt sách',d:'Đọc hiểu đúng 10 bài',ok:()=>Object.keys(ST.rd).length>=10},
 {id:'li10',t:'Tai thính',d:'Nghe hiểu đúng 10 bài',ok:()=>Object.keys(ST.lis).length>=10},
 {id:'w100',t:'Triệu phú từ vựng',d:'Học 100 từ',ok:()=>Object.keys(ST.words).length>=100},
 {id:'dict',t:'Nhà tra cứu',d:'Lưu 5 từ vào sổ từ',ok:()=>Object.keys(ST.dict).length>=5}];
function checkBadges(){BADGES.forEach(b=>{if(!ST.badges[b.id]&&b.ok()){ST.badges[b.id]=1;save();toast('Huy hiệu mới: '+b.t)}})}
function hud(){$('#xpChip').innerHTML=IC.star+'<span>'+ST.xp+' XP</span>';$('#stChip').innerHTML=IC.flame+'<span>'+streakNow()+' ngày</span>'}
let toastT;function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),2600)}

/* ---------- audio: sfx + music (WebAudio) ---------- */
const AU={ctx:null,master:null,rec:null,sfx:null,music:null,timer:null,step:0};
function auInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return AU.ctx}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  try{AU.ctx=new C();const c=AU.ctx;AU.master=c.createGain();AU.master.connect(c.destination);
    AU.rec=c.createMediaStreamDestination();
    AU.voice=c.createGain();AU.voice.gain.value=1.0;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=110;const pk=c.createBiquadFilter();pk.type='peaking';pk.frequency.value=2600;pk.gain.value=3;pk.Q.value=.8;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=6800;const cp=c.createDynamicsCompressor();cp.threshold.value=-18;cp.ratio.value=3;AU.voice.connect(hp);hp.connect(pk);pk.connect(lp);lp.connect(cp);cp.connect(AU.master);cp.connect(AU.rec);
    AU.sfx=c.createGain();AU.sfx.gain.value=.5;AU.sfx.connect(AU.master);AU.sfx.connect(AU.rec);
    AU.mduck=c.createGain();AU.mduck.connect(AU.master);AU.mduck.connect(AU.rec);AU.music=c.createGain();AU.music.gain.value=.4;AU.music.connect(AU.mduck);}catch(e){AU.ctx=null}
  return AU.ctx;
}
function tone(f,t0,d,type,vol,dest){const c=AU.ctx;if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.value=f;
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.015);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(dest);o.start(t0);o.stop(t0+d+.05)}
function sfx(kind){
  if(!ST.set.sfx||!auInit())return;const c=AU.ctx,t=c.currentTime;
  if(kind==='pop'){tone(520,t,.12,'sine',.5,AU.sfx);tone(780,t+.05,.12,'sine',.35,AU.sfx)}
  else if(kind==='ok'){tone(660,t,.15,'triangle',.6,AU.sfx);tone(990,t+.12,.25,'triangle',.6,AU.sfx)}
  else if(kind==='bad'){tone(220,t,.25,'sawtooth',.25,AU.sfx);tone(165,t+.15,.3,'sawtooth',.25,AU.sfx)}
  else if(kind==='win'){[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.12,.3,'triangle',.5,AU.sfx))}
  else if(kind==='flip'){tone(400,t,.06,'square',.12,AU.sfx)}
}
const CH=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
function musicTick(){const c=AU.ctx;if(!c)return;const t=c.currentTime+.05,s=AU.step++,ch=CH[Math.floor(s/8)%4];
  tone(ch[[0,1,2,1,0,2,1,2][s%8]]*2,t,.42,'triangle',.9,AU.music);if(s%8===0)tone(ch[0]/2,t,1.9,'sine',1.1,AU.music);if(s%4===2)tone(ch[1],t,.5,'sine',.5,AU.music)}
const SONGS=[{"id": "ngot-ngao-tinh-khuc-yeu-nhau", "t": "Ngọt Ngào Tình Khúc Yêu Nhau"}, {"id": "ben-song-cho-anh", "t": "Bến Sông Chờ Anh"}, {"id": "chieu-hoang-hon-thuong-nho", "t": "Chiều Hoàng Hôn Thương Nhớ"}, {"id": "giot-suong-tren-loi-nho", "t": "Giọt Sương Trên Lối Nhỏ"}, {"id": "hen-uoc-mua-trang", "t": "Hẹn Ước Mùa Trăng"}, {"id": "huong-que-mien-song-nuoc", "t": "Hương Quê Miền Sông Nước"}, {"id": "loi-yeu-tren-canh-dong", "t": "Lời Yêu Trên Cánh Đồng"}, {"id": "minh-se-den-ngay-sau", "t": "Mình Sẽ Đến Ngày Sau"}, {"id": "nho-mot-mien-que", "t": "Nhớ Một Miền Quê"}, {"id": "nho-que-huong", "t": "Nhớ Quê Hương"}, {"id": "nhung-ngay-ben-em", "t": "Những Ngày Bên Em"}, {"id": "thuong-lam-mien-tay", "t": "Thương Lắm Miền Tây"}, {"id": "tinh-khuc-ben-doi-thong", "t": "Tình Khúc Bên Đồi Thông"}, {"id": "tinh-yeu-dong-xanh", "t": "Tình Yêu Đồng Xanh"}, {"id": "tinh-yeu-giua-nui-rung", "t": "Tình Yêu Giữa Núi Rừng"}];
const MU={buf:null,id:'',src:null,on:false,tok:0,fallback:false,vol:null};
const musicVol=()=>recOn?(ST.set.rvol):(ST.set.mvol);
function applyMusicVol(){if(AU.music)AU.music.gain.value=(MU.fallback?1:.9)*musicVol()*(MU.fallback?.2:1)}
/* Nhạc đọc trực tiếp từ repo GitHub qualokhach/nhac-cua-minh (thư mục music), không đóng gói trong app. */
const MREPO={user:'qualokhach',repo:'nhac-cua-minh',branch:'main'};
const MBASE=[ 'https://raw.githubusercontent.com/'+MREPO.user+'/'+MREPO.repo+'/'+MREPO.branch+'/',
              'https://cdn.jsdelivr.net/gh/'+MREPO.user+'/'+MREPO.repo+'@'+MREPO.branch+'/', '' ];
let MLIST_DONE=false;
async function musicLoadList(){
  if(MLIST_DONE)return;MLIST_DONE=true;
  for(const base of MBASE.slice(0,2)){
    try{const r=await fetch(base+'songs.json',{cache:'no-cache'});if(!r.ok)continue;const j=await r.json();
      const arr=(Array.isArray(j)?j:(j.songs||[])).map(x=>({id:x.id,t:x.title||x.t||x.id})).filter(x=>x.id);
      if(arr.length){SONGS.length=0;arr.forEach(x=>SONGS.push(x));buildMusicUI();return}
    }catch(e){}
  }
}
async function musicFetchBuf(id){
  let lastErr=null;
  for(const base of MBASE){
    try{const r=await fetch(base+'music/'+id+'.mp3');if(!r.ok)throw new Error('http '+r.status);
      const ab=await r.arrayBuffer();return await new Promise((res,rej)=>AU.ctx.decodeAudioData(ab,res,rej))}
    catch(e){lastErr=e}
  }
  throw lastErr||new Error('load');
}
async function musicLoadTrack(id){
  if(MU.id===id&&MU.buf)return MU.buf;
  MU.buf=null;MU.buf=await musicFetchBuf(id);MU.id=id;return MU.buf;
}
function pickTrack(){if(ST.set.track&&ST.set.track!=='rand'&&SONGS.some(x=>x.id===ST.set.track))return ST.set.track;const o=SONGS.filter(x=>x.id!==MU.id);return o[Math.floor(Math.random()*o.length)].id}
async function musicStart(){
  if(MU.on||!auInit())return;MU.on=true;const tok=++MU.tok;applyMusicVol();
  try{
    musicNowLabel('Đang tải nhạc…');await musicLoadList();if(tok!==MU.tok)return;
    let id=pickTrack(),buf=null;
    for(let k=0;k<3&&!buf;k++){
      try{buf=await musicLoadTrack(id)}catch(e){if(tok!==MU.tok)return;
        const o=SONGS.filter(x=>x.id!==id);if(!o.length)break;id=o[Math.floor(Math.random()*o.length)].id}
    }
    if(tok!==MU.tok)return;if(!buf)throw new Error('load');
    MU.fallback=false;applyMusicVol();
    const src=AU.ctx.createBufferSource();src.buffer=buf;src.loop=false;src.connect(AU.music);MU.src=src;
    src.onended=()=>{if(tok===MU.tok&&MU.on){MU.on=false;musicStart()}};src.start();
    const sg=SONGS.find(x=>x.id===id);musicNowLabel('♪ '+(sg?sg.t:''));
  }catch(e){
    if(tok!==MU.tok)return;MU.fallback=true;applyMusicVol();musicNowLabel('♪ Không tải được nhạc từ GitHub, đang dùng nhạc dự phòng');
    if(!AU.timer){AU.step=0;musicTick();AU.timer=setInterval(musicTick,330)}
  }
}
function musicStop(){MU.tok++;MU.on=false;clearInterval(AU.timer);AU.timer=null;try{if(MU.src){MU.src.onended=null;MU.src.stop()}}catch(e){}MU.src=null;musicNowLabel('')}
function musicNowLabel(t){const e=document.getElementById('musNow');if(e)e.textContent=t}
function syncMusic(){if(recOn)return;if(ST.set.music&&currentView==='learn')musicStart();else musicStop()}

/* ---------- speech ---------- */
const SS=('speechSynthesis' in window)?window.speechSynthesis:null;
let EN=[],viVoice=null;
function loadVoices(){
  if(!SS)return;const all=SS.getVoices()||[];
  const score=v=>(/natural|neural|online/i.test(v.name)?4:0)+(/google/i.test(v.name)?2:0)+(/samantha|aria|jenny|ava|zira|daniel|karen|serena/i.test(v.name)?1:0)+(/en-US/i.test(v.lang)?1:0);
  EN=all.filter(v=>/^en/i.test(v.lang)).sort((a,b)=>score(b)-score(a));
  viVoice=all.find(v=>/^vi/i.test(v.lang))||null;
  const sel=$('#setVoice');sel.innerHTML='<option value="">Tự chọn giọng tốt nhất</option>'+EN.map(v=>'<option value="'+esc(v.name)+'">'+esc(v.name)+' ('+esc(v.lang)+')</option>').join('');
  sel.value=ST.set.vname;if(sel.value!==ST.set.vname)sel.value='';
  $('#voiceNote').textContent=EN.length?(EN.length+' giọng tiếng Anh'+(viVoice?', có giọng Việt':', chưa có giọng Việt')):'Máy chưa có giọng tiếng Anh. Bài vẫn chạy với phụ đề.';
}
function enVoice(){return EN.find(v=>v.name===ST.set.vname)||EN[0]||null}
const estDur=(t,rate)=>Math.max(1.5,t.split(/\s+/).length*.42/((rate||.9)/.9)+.8);
let runTok=0,waiters=[];
const wait=ms=>new Promise(r=>{let t;const done=()=>{clearTimeout(t);r()};t=setTimeout(done,ms);waiters.push(done)});
function stopAll(){runTok++;if(SS)try{SS.cancel()}catch(e){}try{if(voiceSrc){voiceSrc.onended=null;voiceSrc.stop()}}catch(e){}voiceSrc=null;waiters.splice(0).forEach(f=>f())}
/* offline voice (meSpeak) rendered to audio so it can be recorded into the video */
const MS={state:0,p:null,cache:{}};
function msLoad(){
  if(MS.p)return MS.p;
  MS.p=(async()=>{
    if(!window.meSpeak||!window.__MSCFG||!window.__MSVOICE)throw new Error('no meSpeak');
    window.meSpeak.loadConfig(window.__MSCFG);window.meSpeak.loadVoice(window.__MSVOICE);MS.state=1;return true})();
  MS.p.catch(()=>{MS.state=-1});return MS.p;
}
async function msBuf(text,who,rate){
  const key=who+'|'+rate.toFixed(2)+'|'+text;if(MS.cache[key])return MS.cache[key];
  const f=who==='B'?{pitch:32,variant:'m3'}:(who==='N'?{pitch:55,variant:'f2'}:{pitch:62,variant:'f3'});
  const raw=window.meSpeak.speak(text,{rawdata:'array',speed:Math.round(135*rate/.9),pitch:f.pitch,variant:f.variant,amplitude:100,wordgap:3});
  if(!raw)return null;const ab=(raw instanceof ArrayBuffer)?raw:new Uint8Array(raw).buffer;
  const buf=await new Promise((res,rej)=>AU.ctx.decodeAudioData(ab.slice(0),res,rej));
  MS.cache[key]=buf;return buf;
}
/* ---------- Giọng AI tự nhiên (Kokoro chạy trong trình duyệt) ----------
   Dùng chung một giọng khi học và khi quay video, nên hai nơi nghe giống hệt nhau. */
const NV={state:0,p:null,tts:null,cache:new Map(),q:Promise.resolve(),pct:0};
const nvOn=()=>ST.set.vm==='ai';
const lightOn=()=>ST.set.vm!=='native'&&!nvOn();
function nvNote(t){const e=document.getElementById('nvNote');if(e)e.textContent=t||''}
function nvNoteAuto(){nvNote(ST.set.vm==='native'?'Giọng của máy. Trình duyệt không cho thu giọng này vào video, nên video dùng giọng nhẹ.':nvOn()?(NV.state===2?'Giọng AI đã sẵn sàng. Dùng chung cho học và video, hoạt động ngoại tuyến.':NV.state===1?('Đang tải giọng AI… '+NV.pct+'% (chỉ lần đầu, sau đó lưu trong trình duyệt)'):NV.state===-1?'Không tải được giọng AI nên đang dùng giọng dự phòng. Hãy mở app qua địa chỉ web (không mở file trực tiếp) rồi tải lại.':'Giọng AI sẽ tự tải khi bắt đầu học.'):'Giọng nhẹ: nhỏ gọn, nghe hơi máy.')}
function nvLoad(){
  if(NV.p)return NV.p;
  NV.state=1;NV.pct=0;nvNoteAuto();
  NV.p=PIPER.load(p=>{NV.pct=Math.min(99,p);nvNoteAuto();const r=document.getElementById('recStatus');if(r&&r.dataset.nv==='1')r.textContent='Đang tải giọng AI… '+NV.pct+'%'}).then(()=>{NV.state=2;nvNoteAuto();return true});
  NV.p.catch(e=>{NV.state=-1;NV.err=e;nvNoteAuto()});
  return NV.p;
}
function nvRetry(){if(NV.state===-1){NV.p=null;NV.state=0}if(nvOn())nvLoad().catch(()=>{})}
function nvBuf(text,who,rate){
  who=who||'A';rate=Math.min(1.5,Math.max(.6,rate||.9));
  const key=who+'|'+rate.toFixed(2)+'|'+text;if(NV.cache.has(key))return Promise.resolve(NV.cache.get(key));
  const job=NV.q.then(async()=>{
    if(NV.cache.has(key))return NV.cache.get(key);
    await nvLoad();if(!auInit())throw new Error('audio');
    const d=await PIPER.synth(text,(PIPER.spk&&PIPER.spk[who])||0,rate);if(!d||!d.length)throw new Error('empty');
    let pk=0;for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);if(v>pk)pk=v}const g=pk>0?Math.min(3,.7/pk):1;for(let i=0;i<d.length;i++)d[i]*=g;
    const buf=AU.ctx.createBuffer(1,d.length,PIPER.SR);buf.copyToChannel(d,0);
    NV.cache.set(key,buf);if(NV.cache.size>500)NV.cache.delete(NV.cache.keys().next().value);return buf});
  NV.q=job.catch(()=>{});return job;
}
const stepWho=st=>{const w=st.k==='d'?st.who:'A';return w==='B'?'B':(st.k==='n'||st.k==='s'||st.k==='v'?'N':'A')};
const stepRate=()=>Math.min(1.6,Math.max(.5,ST.set.rate*speedMul));
function nvPrefetch(list,i){
  if(!nvOn()||NV.state<1)return;
  for(let k=i;k<Math.min(list.length,i+3);k++){const st=list[k].step;if(st&&st.en)nvBuf(st.en,stepWho(st),stepRate()).catch(()=>{})}
}
async function sayNeural(text,o,done,alive){
  try{
    const buf=await nvBuf(text,o.who||'A',o.rate||.9);
    if(!alive())return;
    if(!auInit())return done();
    const src=AU.ctx.createBufferSource();src.buffer=buf;src.connect(AU.voice);voiceSrc=src;
    if(Eng.sp&&Eng.sp.en===text){Eng.sp.t0=performance.now();Eng.sp.dur=buf.duration*1000}
    src.onended=done;src.start();setTimeout(done,buf.duration*1000+600);
  }catch(e){if(alive())sayRec(text,o,done)}
}
function nvSpeak(text,rate){nvBuf(text,'N',rate).then(b=>{if(!auInit())return;const s=AU.ctx.createBufferSource();s.buffer=b;s.connect(AU.voice);s.start()}).catch(()=>{})}
let voiceSrc=null;
async function sayRec(text,o,done){
  try{
    await msLoad();if(!auInit())return done();
    const buf=await msBuf(text,o.who||'A',o.rate||.9);if(!buf)return done();
    const src=AU.ctx.createBufferSource();src.buffer=buf;src.connect(AU.voice);voiceSrc=src;
    if(Eng.sp&&Eng.sp.en===text){Eng.sp.t0=performance.now();Eng.sp.dur=buf.duration*1000}
    src.onended=done;src.start();setTimeout(done,buf.duration*1000+600);
  }catch(e){done()}
}
function duck(on){try{if(AU.mduck)AU.mduck.gain.setTargetAtTime(on?.22:1,AU.ctx.currentTime,.12)}catch(e){}}
function say(text,o){
  o=o||{};return new Promise(res=>{
    const rate=o.rate||ST.set.rate,est=estDur(text,rate)*1000;let fin=false,tm;
    const done=()=>{if(fin)return;fin=true;clearTimeout(tm);voiceSrc=null;duck(false);res()};waiters.push(done);if(o.voice&&!o.vi)duck(true);
    if(o.voice&&!o.vi&&nvOn()&&NV.state===0)nvLoad().catch(()=>{});
    if(o.voice&&!o.vi&&nvOn()&&NV.state===2){tm=setTimeout(done,est+40000);sayNeural(text,o,done,()=>!fin);return}
    if(o.voice&&!o.vi&&((recOn&&!recTab)||!SS||!enVoice()||(lightOn()&&!recTab))){tm=setTimeout(done,est+9000);sayRec(text,o,done);return}
    const v=o.vi?viVoice:enVoice();
    if(!o.voice||!SS||!v||(recOn&&!recTab)){tm=setTimeout(done,est);return}
    tm=setTimeout(done,est+4500);
    try{SS.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=rate;u.pitch=o.pitch||1;
      u.onstart=()=>{if(Eng.sp&&Eng.sp.en===text){Eng.sp.t0=performance.now()}};
      u.onboundary=e=>{if(Eng.sp&&Eng.sp.en===text&&typeof e.charIndex==='number')Eng.sp.ci=e.charIndex};
      u.onend=done;u.onerror=done;SS.speak(u)}catch(e){clearTimeout(tm);tm=setTimeout(done,est)}
  });
}
async function msPlay(text){try{await msLoad();if(!auInit())return;const b=await msBuf(text,'N',Math.min(1.3,ST.set.rate*(ST.set.speed||1)));if(!b)return;const s=AU.ctx.createBufferSource();s.buffer=b;s.connect(AU.voice);s.start()}catch(e){}}
function speakNow(text,o){o=o||{};if(!o.vi&&nvOn()&&NV.state===0)nvLoad().catch(()=>{});if(!o.vi&&nvOn()&&NV.state===2){nvSpeak(text,Math.min(1.4,(o.rate||ST.set.rate*(o.slow?.75:1))*(ST.set.speed||1)));return true}if(!o.vi&&(lightOn()||!SS||!enVoice())){msPlay(text);return true}if(!SS)return false;const v=o.vi?viVoice:enVoice();if(!v)return false;try{SS.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=o.rate||ST.set.rate*(o.slow?.75:1)*(ST.set.speed||1);SS.speak(u);return true}catch(e){return false}}

/* ---------- runner ---------- */
function buildFlat(l,only){const f=[];l.parts.forEach((p,pi)=>{if(only!=null&&only!==pi)return;p.steps.forEach((st,si)=>f.push({pi:pi,si:si,step:st,pt:p.name,pv:p.vi}))});return f}
function showCard(title,sub,ms){Eng.cardS={title:title,sub:sub,t0:performance.now(),dur:ms||1700,c1:'#3d6bff',c2:'#8b3df0'};return wait(ms||1700)}
let speedMul=ST.set.speed||1;
async function doStep(st,tok,o){
  const who=st.k==='d'?st.who:'A',rate=Math.min(1.6,Math.max(.5,ST.set.rate*speedMul)),voice=(o.voice!==undefined)?o.voice:ST.set.voice;
  Eng.sp={en:st.en,sub:st.sub,hl:true,t0:performance.now(),dur:estDur(st.en,rate)*1000,ci:null};
  Eng.setTalk(who);
  await say(st.en,{voice:voice,rate:rate,who:who==='B'?'B':(st.k==='n'||st.k==='s'||st.k==='v'?'N':'A'),pitch:who==='B'?.8:(st.k==='n'||st.k==='s'||st.k==='v'?1.05:1.25)});
  if(tok!==runTok)return;
  Eng.setTalk(null);if(Eng.sp)Eng.sp.hl=false;
  if((o.bi!==undefined?o.bi:ST.set.bi)&&st.sub){
    Eng.subMode='both';
    if(voice&&viVoice&&!recOn){await say(st.sub,{voice:true,vi:true,rate:Math.min(1.3,rate)})}
    else await wait(Math.max(1200,st.sub.length*62)/speedMul);
    if(tok!==runTok)return;
  }
  await wait(480/speedMul);
}
async function run(list,i0,o){
  const tok=++runTok;
  for(let i=i0;i<list.length;i++){
    if(tok!==runTok)return false;
    const f=list[i];if(o.onStep)o.onStep(i,f);
    Eng.partTitle=f.pt;Eng.show(f.step);
    if(o.cards&&f.si===0){await showCard(f.pt,f.pv,1700);if(tok!==runTok)return false}
    if(o.voice!==false&&(o.voice||ST.set.voice))nvPrefetch(list,i);
    await doStep(f.step,tok,o);
    if(tok!==runTok)return false;
    if(o.afterStep)o.afterStep(i,f,i===list.length-1||list[i+1].pi!==f.pi);
  }
  return true;
}

/* ---------- views ---------- */
let currentView='learn';
function mountStage(){
  const host=currentView==='studio'?$('#studioStage'):(currentView==='learn'?$('#stageBox'):(currentView==='gram'?$('#gStage'):null));if(!host)return;
  if(!Eng.isOK()){host.innerHTML='<div class="err">Trình duyệt này chưa bật được WebGL nên không vẽ được cảnh 3D. Hãy thử Chrome, Edge hoặc Safari bản mới.</div>'}
  Eng.mount(host);
}
function go(v){
  if(v==='studio'&&typeof proActive==='function'&&!proActive()){proOpen();return}
  if(recOn)stopRec();
  stopAll();playing=false;updPlay();Eng.setTalk(null);
  currentView=v;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  $$('.view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));
  if(v==='learn'){Eng.setFormat('16:9');mountStage();Eng.showChip=true;Eng.subMode=ST.set.sub;previewCur()}
  else if(v==='studio'){mountStage();studioPreview()}
  else if(v==='prog')renderProg();
  else if(v==='quiz'&&!quizState)quizHome();
  else if(v==='cards'&&!$('#cardBox').children.length)cardsHome();
  else if(v==='match'&&!$('#matchBox').children.length)matchHome();
  else if(window.EXT&&EXT[v])EXT[v]();
  syncMusic();window.scrollTo({top:0})
}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(b.dataset.v)});

/* ---------- learn ---------- */
let cur=null,flat=[],pstart=[],idx=0,playing=false,curPart=-1;
const byId=id=>LESSONS.find(l=>l.id===id);
const lessonNo=l=>l.lv.lessons.indexOf(l)+1;
const lessonLabel=l=>'Cấp '+l.lv.id+' - Bài '+lessonNo(l)+': '+l.t+' · '+l.vi;
const hashOf=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h};
const SKINS=[['#4f7cff','#dbe7ff','#2f55d4'],['#ff6b9d','#ffe3ee','#d94a7e'],['#12b886','#d3f9e6','#0b8f68'],['#9775fa','#eadfff','#6f4fd6'],['#ff8a3d','#ffe8d4','#d96a1d'],['#15aabf','#d0f4fa','#0b8397'],['#e64980','#ffe0ec','#b8305f']];
const OUTFIT_RULES=[
 [/cook|restaurant|food|fruit|kitchen|breakfast|dinner|lunch|eat|drink|shop|market|bakery|snack/,[['chef'],['apron','#ff6b6b']]],
 [/school|class|subject|study|exam|library|homework|number|alphabet|abc|color|colour/,[['cap','#3d6bff'],['bag','#ff8a3d']]],
 [/job|work|career|office|business|interview|company|career|economy|money|bank/,[['helmet','#ffc233'],['bowtie','#e03131']]],
 [/weather|winter|cold|season|snow|rain|holiday|christmas|autumn/,[['beanie','#e03131'],['scarf','#ffd43b']]],
 [/music|song|dance|party|hobby|entertain|game|sport|film|movie|birthday/,[['phones','#7950f2'],['party','#ff5470']]],
 [/travel|hotel|trip|airport|direction|town|city|transport|holiday|beach|nature|animal|farm|zoo/,[['cap','#12b886'],['shades']]],
 [/health|body|doctor|hospital|feel|emotion/,[['bow','#ff5470']]],
 [/science|technology|research|academic|environment|climate|global|nuance|literature|politic|law|media/,[['glasses'],['bowtie','#364fc7']]],
 [/hello|greet|family|friend|people|social|home|house|room|clothes|daily/,[['flowers']]]];
function outfitFor(l){
  const h=hashOf(l.id),sk=SKINS[h%SKINS.length];let acc=null;
  for(const r of OUTFIT_RULES){if(r[0].test(l.id+' '+l.t.toLowerCase())){acc=r[1];break}}
  if(!acc){const pool=[[['bow','#ff5470']],[['cap','#3d6bff']],[['glasses']],[['scarf','#ffc233']],[['phones','#12b886']],[['crown']],[['bowtie','#e03131'],['glasses']],[['beanie','#7950f2']]];acc=pool[(h>>3)%pool.length]}
  return {mimi:{body:sk[0],belly:sk[1],feet:sk[2],acc:acc},leo:{}};
}
const sideFor=l=>(hashOf(l.id)>>5)%3===0?-1:1;
function applyLessonLook(l){Eng.dress(outfitFor(l));Eng.setSide(sideFor(l))}
let thumbQ=[],thumbBusy=false;
function lazyThumb(img,spec,px){
  thumbQ.push([img,spec,px||120]);if(thumbBusy)return;thumbBusy=true;
  const next=()=>{const t=thumbQ.shift();if(!t){thumbBusy=false;return}
    try{const u=Eng.thumb(t[1],t[2]);if(u)t[0].src=u;else t[0].style.display='none'}catch(e){t[0].style.display='none'}
    setTimeout(next,16)};setTimeout(next,30);
}
function lvChips(box,key,cb){
  const w=el('div','lvchips');
  LEVELS.forEach(lv=>{const b=el('button','lvchip'+(ST.set[key]===lv.id?' on':''),'<b>'+lv.id+'</b>');b.style.setProperty('--c',lv.c);b.title=lv.t;b.setAttribute('aria-label',lv.t);
    b.onclick=()=>{ST.set[key]=lv.id;save();cb()};w.appendChild(b)});
  box.appendChild(w);
}
function renderCur(){
  const box=$('#cur');box.innerHTML='';
  lvChips(box,'lv',renderCur);
  const lv=LEVELS.find(x=>x.id===ST.set.lv)||LEVELS[0];
  {
    const d=el('div','lv');d.style.setProperty('--c',lv.c);d.appendChild(el('h3','','<i></i>'+esc(lv.t)));d.appendChild(el('small','',esc(lv.sub)+' · '+lv.lessons.length+' bài'));
    lv.lessons.forEach(l=>{
      const b=el('button','les'+(cur&&cur.id===l.id?' on':''));b.style.setProperty('--c',lv.c);
      b.innerHTML='<img alt="" width="44" height="44"><div><b>Bài '+lessonNo(l)+'. '+esc(l.t)+'</b><span>'+esc(l.vi)+'</span><div class="dots">'+l.parts.map((p,i)=>'<i class="'+(ST.done[l.id+':'+i]?'d':'')+'"></i>').join('')+'</div></div>';
      b.onclick=()=>{selectLesson(l.id,true);if(window.innerWidth<=900)$('#v-learn').scrollIntoView({behavior:'smooth'})};
      d.appendChild(b);lazyThumb(b.querySelector('img'),l.icon,96);
    });
    box.appendChild(d);
  }
}
function selectLesson(id,auto){
  stopAll();playing=false;cur=byId(id);ST.set.lv=cur.lv.id;flat=buildFlat(cur);pstart=[];flat.forEach((f,i)=>{if(f.si===0)pstart[f.pi]=i});
  Eng.setTheme(cur.theme);applyLessonLook(cur);Eng.resetCur();Eng.lessonTitle=lessonLabel(cur);Eng.subMode=ST.set.sub;
  $('#lTitle').textContent=lessonLabel(cur);$('#lSub').textContent=cur.lv.t+'  ·  '+cur.parts.length+' phần, '+flat.length+' câu';
  curPart=-1;renderCur();renderSeek();setCur(0,true);updPlay();
  if(auto)play();
}
function renderSeek(){const s=$('#seek');s.innerHTML='';flat.forEach(()=>s.appendChild(el('i')))}
function renderParts(){
  const box=$('#parts');box.innerHTML='';
  cur.parts.forEach((p,i)=>{const b=el('button','pchip'+(i===curPart?' on':'')+(ST.done[cur.id+':'+i]?' d':''),esc(p.name)+'<small>'+esc(p.vi)+'</small>');b.onclick=()=>jump(pstart[i]);box.appendChild(b)});
}
function renderScript(){
  const box=$('#script');box.innerHTML='';
  flat.forEach((f,i)=>{if(f.pi!==curPart)return;const st=f.step;
    const li=el('li',i===idx?'on':'');li.dataset.i=i;
    const who=st.k==='d'?'<span class="who'+(st.who==='B'?' b':'')+'">'+(st.who==='B'?'L':'M')+'</span>':'<span class="who">'+IC.spk.replace('<svg','<svg width="14" height="14"')+'</span>';
    li.innerHTML=who+'<div><b>'+esc(st.en)+'</b><span>'+esc(st.sub||'')+'</span></div>';li.onclick=()=>jump(i);box.appendChild(li)});
}
function setCur(i,preview){
  idx=Math.max(0,Math.min(flat.length-1,i));const f=flat[idx];
  if(f.pi!==curPart){curPart=f.pi;renderParts();renderScript()}
  $$('#script li').forEach(li=>li.classList.toggle('on',+li.dataset.i===idx));
  $$('#seek i').forEach((e,k)=>{e.className=k<idx?'d':(k===idx?'c':'')});
  const on=$('#script li.on');if(on&&playing){const r=on.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)on.scrollIntoView({block:'nearest',behavior:'smooth'})}
  Eng.partTitle=f.pt;
  if(preview){Eng.show(f.step);Eng.sp={en:f.step.en,sub:f.step.sub,hl:false}}
}
function previewCur(){if(cur&&flat.length){Eng.lessonTitle=lessonLabel(cur);Eng.setTheme(cur.theme);applyLessonLook(cur);setCur(idx,true)}}
function updPlay(){$('#bPlay').innerHTML=playing?IC.pause:IC.play;$('#bPlay').setAttribute('aria-label',playing?'Tạm dừng':'Phát')}
function play(){
  if(!cur)return;auInit();syncMusic();playing=true;updPlay();Eng.subMode=ST.set.sub;
  run(flat,idx,{cards:true,voice:true,
    onStep:(i,f)=>setCur(i,false),
    afterStep:(i,f,end)=>{const st=f.step;if(st.k==='v'&&st.w&&!ST.words[st.w]){ST.words[st.w]=1}
      if(end&&!ST.done[cur.id+':'+f.pi]){ST.done[cur.id+':'+f.pi]=1;addXP(10);renderParts();renderCur();sfx('ok')}}
  }).then(async ok=>{if(!ok)return;playing=false;updPlay();Eng.setTalk(null);sfx('win');addXP(isDone(cur)?20:5);
    await showCard('Hoàn thành bài!',cur.t+' · '+cur.vi,2200);Eng.cardS=null;toast('Bạn nhận được XP. Thử làm trắc nghiệm nhé!');save();setCur(0,true)});
}
function pause(){stopAll();playing=false;updPlay();Eng.setTalk(null);if(Eng.sp)Eng.sp.hl=false}
function jump(i){stopAll();playing=false;setCur(i,true);play()}
$('#bPlay').onclick=()=>{playing?pause():play()};
$('#bPrev').onclick=()=>{const f=flat[idx];const t=(f.si>0&&idx-1>=0)?idx-1:Math.max(0,idx-1);jump(t)};
$('#bNext').onclick=()=>{if(idx<flat.length-1)jump(idx+1)};
$('#seek').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();jump(Math.min(flat.length-1,Math.floor((e.clientX-r.left)/r.width*flat.length)))};
$('#selSpeed').onchange=e=>{speedMul=+e.target.value;ST.set.speed=speedMul;save();if(playing){stopAll();play()}};
$('#bBi').onclick=()=>{ST.set.bi=!ST.set.bi;if(ST.set.bi){Eng.subMode='both'}else Eng.subMode=ST.set.sub;save();refreshIcons();toast(ST.set.bi?'Giảng song ngữ: bật. Sau câu tiếng Anh sẽ có lời giải thích tiếng Việt.':'Giảng song ngữ: tắt. Chỉ giảng tiếng Anh.')};
function refreshIcons(){
  $('#bPrev').innerHTML=IC.prev;$('#bNext').innerHTML=IC.next;$('#bSub').innerHTML=IC.sub;$('#bFull').innerHTML=IC.full;$('#btnSet').innerHTML=IC.gear;
  $('#bBi').classList.toggle('on',!!ST.set.bi);$('#selSpeed').value=String(ST.set.speed||1);$('#bVoice').innerHTML=ST.set.voice?IC.vol:IC.mute;$('#bVoice').classList.toggle('on',ST.set.voice);$('#bSub').classList.toggle('on',ST.set.sub!=='off');updPlay();
}
$('#bSub').onclick=()=>{ST.set.sub={both:'en',en:'off',off:'both'}[ST.set.sub];Eng.subMode=ST.set.sub;$('#setSub').value=ST.set.sub;save();refreshIcons();toast({both:'Phụ đề Anh và Việt',en:'Chỉ phụ đề tiếng Anh',off:'Đã tắt phụ đề'}[ST.set.sub])};
$('#bVoice').onclick=()=>{ST.set.voice=!ST.set.voice;save();refreshIcons();if(!ST.set.voice&&SS)SS.cancel();toast(ST.set.voice?'Đã bật giọng đọc':'Đã tắt giọng đọc')};
$('#bFull').onclick=()=>{const b=$('#stageBox');try{if(document.fullscreenElement)document.exitFullscreen();else if(b.requestFullscreen)b.requestFullscreen().catch(()=>toast('Màn hình này không cho phép toàn màn hình'))}catch(e){}};
$('#bQuizThis').onclick=()=>{go('quiz');quizStart(cur.id)};
$('#bCardsThis').onclick=()=>{go('cards');cardsStart(cur.id)};
$('#bRecThis').onclick=()=>{go('studio');$('#stLesson').value=cur.id;fillParts();studioPreview()};
Eng.onPop=()=>sfx('pop');

/* ---------- scope picker ---------- */
function scopeGrid(box,title,sub,cb){
  box.innerHTML='<h2>'+title+'</h2><p class="muted">'+sub+'</p>';
  lvChips(box,'slv',()=>scopeGrid(box,title,sub,cb));
  const lv=LEVELS.find(x=>x.id===ST.set.slv)||LEVELS[0];
  box.insertAdjacentHTML('beforeend','<p class="muted" style="margin-top:8px"><b style="color:'+lv.c+'">'+esc(lv.t)+'</b> · '+esc(lv.sub)+'</p><div class="pickgrid mt"></div>');const g=box.querySelector('.pickgrid');
  const add=(id,t,s,spec)=>{const b=el('button','pick','<img alt="" width="54" height="54"><div><b>'+esc(t)+'</b><span>'+esc(s)+'</span></div>');g.appendChild(b);b.onclick=()=>cb(id);lazyThumb(b.querySelector('img'),spec,96)};
  add('all','Tổng hợp','Trộn mọi bài',{obj:'star'});
  add('lv'+lv.id,'Cả '+lv.t.split(' · ')[0].toLowerCase(),'Trộn các bài trong cấp',{obj:'trophy'});
  lv.lessons.forEach(l=>add(l.id,'Bài '+lessonNo(l)+'. '+l.t,l.vi+(ST.qbest[l.id]&&box.id==='quizBox'?'  ·  '+'★'.repeat(ST.qbest[l.id]):''),l.icon));
}
const scopeLessons=scope=>scope==='all'?LESSONS:(/^lv\d+$/.test(scope)?LEVELS[+scope.slice(2)-1].lessons:[byId(scope)]);
const inScope=(v,scope)=>scope==='all'||(/^lv\d+$/.test(scope)?byId(v.lid).lv.id===+scope.slice(2):v.lid===scope);

/* ---------- quiz ---------- */
let quizState=null;
function quizHome(){quizState=null;scopeGrid($('#quizBox'),'Trắc nghiệm','Chọn bài để kiểm tra. Có câu hỏi nhìn hình 3D và câu hỏi chữ.',quizStart)}
const isVi=t=>/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t);
const isEn=t=>t&&!isVi(t)&&/[a-z]/i.test(t);
/* what the speaker reads: always the ENGLISH correct answer (or the English sentence completed with it) */
function speakFor(q){
  if(q.speak)return q.speak;
  const ok=q.opts.find(o=>o.ok);if(!ok||!ok.t)return null;
  if(/_{2,}/.test(q.q)){const full=q.q.replace(/_{2,}/g,ok.t);const m=full.split('|')[0];return isEn(m.replace(/[“”"]/g,''))?m:(isEn(ok.t)?ok.t:null)}
  if(isEn(ok.t))return ok.t;
  const m=q.q.match(/[“"']([^”"']+)[”"']/);if(m&&isEn(m[1]))return m[1];
  return null;
}
function autoQuiz(l){
  const vs=vocabOf(l),out=[];if(vs.length<4)return out;
  const pickD=(v,key)=>shuffle(vs.filter(x=>x.w!==v.w)).slice(0,3);
  shuffle(vs).slice(0,3).forEach(v=>{const d=pickD(v);out.push({q:'“'+v.w+'” nghĩa là gì?',opts:shuffle([{t:v.vi,ok:true}].concat(d.map(x=>({t:x.vi,ok:false})))),why:v.w+' = '+v.vi+'.',speak:v.w})});
  shuffle(vs).slice(0,3).forEach(v=>{const d=pickD(v);out.push({q:'Tiếng Anh của “'+v.vi+'” là gì?',opts:shuffle([{t:v.w,ok:true}].concat(d.map(x=>({t:x.w,ok:false})))),why:v.vi+' = '+v.w+'.',speak:v.w})});
  shuffle(vs.filter(v=>v.ex&&new RegExp('\\b'+v.w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(v.ex))).slice(0,2).forEach(v=>{
    const d=pickD(v);out.push({q:v.ex.replace(new RegExp('\\b'+v.w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'___'),opts:shuffle([{t:v.w,ok:true}].concat(d.map(x=>({t:x.w,ok:false})))),why:v.ex,speak:v.ex})});
  return out;
}
function buildQuiz(scope){
  const ls=scopeLessons(scope),multi=ls.length>1;let qs=[];
  ls.forEach(l=>{
    const hand=l.quiz.map(q=>({type:'t',q:q.q,opts:shuffle(q.o.map((t,i)=>({t:t,ok:i===q.a}))),why:q.why}));
    const pool=hand.length?hand:autoQuiz(l).map(q=>Object.assign({type:'t'},q));
    qs=qs.concat(multi?shuffle(pool).slice(0,2):pool);
  });
  if(multi)qs=shuffle(qs).slice(0,8);
  qs.forEach(q=>{q.speak=speakFor(q)});
  if(Eng.isOK()){
    const pool=allVocab().filter(v=>picOf(v));let mine=shuffle(multi?pool.filter(v=>ls.some(l=>l.id===v.lid)):pool.filter(v=>v.lid===scope));
    if(mine.length<4)mine=shuffle(pool);
    const n=multi?4:Math.min(4,mine.length),seen={};let k=0;
    for(const v of mine){
      if(k>=n)break;if(seen[v.w])continue;seen[v.w]=1;
      const dist=[],dw={};dw[v.w]=1;shuffle(pool).forEach(o=>{if(dist.length<3&&!dw[o.w]){dw[o.w]=1;dist.push(o)}});
      if(dist.length<3)continue;
      if(k%2===0)qs.push({type:'i2w',q:'Đây là gì?',img:Eng.thumb(picOf(v),300),speak:v.w,opts:shuffle([{t:v.w,ok:true}].concat(dist.map(d=>({t:d.w,ok:false})))),why:v.w+' = '+v.vi+'.'});
      else{const good=Eng.thumb(picOf(v),200),ds=[];dist.forEach(d=>{const u=Eng.thumb(picOf(d),200);if(u!==good)ds.push({img:u,ok:false})});
        if(ds.length<3)continue;qs.push({type:'w2i',q:'Hình nào là “'+v.w+'”?',speak:v.w,opts:shuffle([{img:good,ok:true}].concat(ds)),why:v.w+' = '+v.vi+'.'})}
      k++;
    }
  }
  return shuffle(qs);
}
function quizStart(scope){quizState={scope:scope,qs:buildQuiz(scope),i:0,ok:0,wrong:[]};quizQ()}
function quizQ(){
  const st=quizState,q=st.qs[st.i],box=$('#quizBox');
  box.innerHTML='<div class="qhead"><button class="ib" id="qBack" aria-label="Thoát">'+IC.prev+'</button><div class="qbar"><i style="width:'+(st.i/st.qs.length*100)+'%"></i></div><span>'+(st.i+1)+'/'+st.qs.length+'</span></div>'
   +'<div class="qp">'+esc(q.q)+'</div>'+(q.img?'<img class="qimg" alt="" src="'+q.img+'">':'')
   +'<div class="opts"></div><div class="qfb" id="qfb" aria-live="polite"></div><div class="row c mt"><button class="ib" id="qSpk" aria-label="Nghe đáp án đúng" title="Nghe đáp án đúng bằng tiếng Anh" '+(q.speak?'':'hidden')+'>'+IC.spk+'</button><button class="btn" id="qNext" hidden>'+(st.i===st.qs.length-1?'Xem kết quả':'Câu tiếp')+'</button></div>';
  $('#qBack').onclick=()=>{stopAll();quizHome()};
  $('#qSpk').onclick=()=>speakNow(q.speak);
  const og=box.querySelector('.opts');
  q.opts.forEach(o=>{const b=el('button','opt',o.img?'<img alt="Lựa chọn" src="'+o.img+'">':esc(o.t));og.appendChild(b);
    b.onclick=()=>{
      if(og.classList.contains('lock'))return;og.classList.add('lock');
      $$('#quizBox .opt').forEach((x,i)=>{if(q.opts[i].ok)x.classList.add('ok')});
      const fb=$('#qfb');
      if(o.ok){st.ok++;sfx('ok');fb.className='qfb ok';fb.textContent='Chính xác! '+q.why}
      else{b.classList.add('bad');sfx('bad');fb.className='qfb bad';fb.textContent='Chưa đúng. '+q.why;st.wrong.push(q)}
      if(q.speak)speakNow(q.speak);
      $('#qNext').hidden=false;$('#qNext').focus();
    }});
  $('#qNext').onclick=()=>{st.i++;st.i>=st.qs.length?quizEnd():quizQ()};
  if(q.type==='w2i'&&q.speak)setTimeout(()=>speakNow(q.speak),250);
}
function quizEnd(){
  const st=quizState,n=st.qs.length,p=st.ok/n,stars=p>=.9?3:(p>=.6?2:(st.ok>0?1:0));
  const xp=st.ok*4+stars*5;ST.qbest[st.scope]=Math.max(ST.qbest[st.scope]||0,stars);addXP(xp);sfx(stars?'win':'bad');
  $('#quizBox').innerHTML='<h2 class="center">Kết quả</h2><div class="big-score">'+st.ok+'/'+n+'</div><div class="stars">'+[1,2,3].map(i=>IC.star.replace('<svg','<svg class="'+(i<=stars?'on':'')+'"')).join('')+'</div>'
   +'<p class="center muted">+'+xp+' XP</p>'
   +(st.wrong.length?'<div class="wrong"><b>Câu cần ôn lại</b>'+st.wrong.map(q=>'<div>'+esc(q.q)+' <span class="muted">'+esc(q.why)+'</span></div>').join('')+'</div>':'<p class="center mt"><b>Không sai câu nào. Tuyệt vời!</b></p>')
   +'<div class="row c mt"><button class="btn" id="qAgain">Làm lại</button><button class="btn alt" id="qHome">Chọn bài khác</button></div>';
  $('#qAgain').onclick=()=>quizStart(st.scope);$('#qHome').onclick=quizHome;
}

/* ---------- flashcards ---------- */
let cardSt=null;
function cardsHome(){cardSt=null;scopeGrid($('#cardBox'),'Thẻ từ 3D','Chọn bài để ôn từ vựng. Bấm vào thẻ để lật.',cardsStart)}
function cardsStart(scope){
  let items=[];scopeLessons(scope).forEach(l=>vocabOf(l).forEach(v=>items.push(Object.assign({lid:l.id},v))));const seen={};items=items.filter(v=>{if(seen[v.w])return false;seen[v.w]=1;return true});
  if(!items.length){toast('Bài này chưa có từ vựng để làm thẻ');return}
  cardSt={scope:scope,items:items,i:0,flip:false};cardsDraw();
}
const bigEmoji=v=>v.emo||EMO[v.w]||(typeof v.obj==='string'&&!/^[a-z_]+$/i.test(v.obj)?v.obj:'\u{1F4AC}');
function cardsDraw(){
  const c=cardSt,v=c.items[c.i],box=$('#cardBox'),pic=picOf(v),img=pic&&Eng.isOK()?Eng.thumb(pic,360):'';
  const front=(img?'<img alt="" src="'+img+'">':'<div class="emo" aria-hidden="true">'+bigEmoji(v)+'</div>')+'<div class="fw">'+esc(v.w)+'</div>';
  box.innerHTML='<div class="qhead"><button class="ib" id="cBack" aria-label="Thoát">'+IC.prev+'</button><div class="qbar"><i style="width:'+((c.i+1)/c.items.length*100)+'%"></i></div><span>'+(c.i+1)+'/'+c.items.length+'</span></div>'
   +'<div class="fc'+(c.flip?' flip':'')+'" id="fc"><div class="fc-in" role="button" tabindex="0" aria-label="Lật thẻ"><div class="fc-f">'+front+'</div><div class="fc-b"><div>'+(img?'':'<div class="emo sm">'+bigEmoji(v)+'</div>')+'<div class="w">'+esc(v.w)+'</div><p style="font-size:22px;font-weight:800">'+esc(v.vi)+'</p><p style="margin-top:10px;font-size:14px">'+esc(v.en)+'</p></div></div></div></div>'
   +'<p class="center muted" style="font-size:13px">Bấm vào thẻ để xem nghĩa tiếng Việt.</p>'
   +'<div class="row c mt"><button class="ib" id="cPrev" aria-label="Thẻ trước">'+IC.prev+'</button><button class="ib big" id="cSpk" aria-label="Nghe">'+IC.spk+'</button><button class="ib" id="cNext" aria-label="Thẻ sau">'+IC.next+'</button><button class="btn alt" id="cShuf">Xáo thẻ</button></div>';
  const fc=$('#fc');const flip=()=>{c.flip=!c.flip;fc.classList.toggle('flip',c.flip);sfx('flip');if(c.flip){ST.words[v.w]=1;save();speakNow(v.w)}};
  fc.querySelector('.fc-in').onclick=flip;fc.querySelector('.fc-in').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}};
  $('#cBack').onclick=cardsHome;$('#cSpk').onclick=()=>speakNow(v.w);
  $('#cPrev').onclick=()=>{c.i=(c.i-1+c.items.length)%c.items.length;c.flip=false;cardsDraw()};
  $('#cNext').onclick=()=>{c.i=(c.i+1)%c.items.length;c.flip=false;cardsDraw()};
  $('#cShuf').onclick=()=>{c.items=shuffle(c.items);c.i=0;c.flip=false;cardsDraw()};
}
document.addEventListener('keydown',e=>{if(currentView!=='cards'||!cardSt||e.target.closest('input,select,textarea'))return;
  if(e.key==='ArrowRight'){cardSt.i=(cardSt.i+1)%cardSt.items.length;cardSt.flip=false;cardsDraw()}
  else if(e.key==='ArrowLeft'){cardSt.i=(cardSt.i-1+cardSt.items.length)%cardSt.items.length;cardSt.flip=false;cardsDraw()}});

/* ---------- match ---------- */
function matchHome(){scopeGrid($('#matchBox'),'Ghép cặp','Lật thẻ để ghép hình 3D với từ tiếng Anh.',matchStart)}
const PRAISE=[['Great!','🎉'],['Good job!','👏'],['Nice!','😄'],['Well done!','🌟'],['Awesome!','🚀'],['Super!','🦸'],['Cheer!','🥳'],['Perfect!','💯'],['Excellent!','🏆'],['Wow!','🤩']];
const COMBO=['','','Two in a row!','Three in a row! Amazing!','Four in a row! Incredible!','Unstoppable!'];
let matchN=6;
function matchStart(scope){
  const pool=allVocab().filter(v=>picOf(v));if(!Eng.isOK()||pool.length<3){toast('Cần WebGL để chơi trò này');return}
  let src=scope==='all'?pool:pool.filter(v=>inScope(v,scope));if(src.length<3){src=pool;toast('Bài này ít hình, mình trộn thêm từ bài khác')}
  const sw={},uniq=[];shuffle(src).forEach(v=>{if(!sw[v.w]){sw[v.w]=1;uniq.push(v)}});const pick=uniq.slice(0,Math.min(matchN,uniq.length));
  const cards=shuffle(pick.reduce((a,v)=>a.concat([{w:v.w,kind:'i',img:Eng.thumb(picOf(v),160)},{w:v.w,kind:'w',vi:v.vi}]),[]));
  const box=$('#matchBox');
  box.innerHTML='<div class="qhead"><button class="ib" id="mBack" aria-label="Thoát">'+IC.prev+'</button><b>Ghép cặp</b><span class="chip" id="mCombo" style="margin-left:auto">Chuỗi 0</span><span id="mMoves">0 lượt</span></div>'
   +'<div class="seg2" style="justify-content:center;margin:6px 0">'+[4,6,8].map(n=>'<button data-n="'+n+'" class="'+(matchN===n?'on':'')+'">'+n+' cặp</button>').join('')+'</div>'
   +'<div class="mgrid mg'+pick.length+'" id="mgrid"></div><div class="cheer" id="cheer" aria-live="polite"></div><p class="center muted" id="mMsg">Lật thẻ để nghe đọc. Tìm hình và từ giống nhau.</p>';
  $('#mBack').onclick=()=>{stopAll();matchHome()};
  box.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{matchN=+b.dataset.n;matchStart(scope)});
  const g=$('#mgrid');let open=[],lock=false,moves=0,found=0,combo=0,best=0;
  const cheer=(t,e)=>{const c=$('#cheer');c.innerHTML='<span>'+e+'</span><b>'+esc(t)+'</b>';c.classList.remove('go');void c.offsetWidth;c.classList.add('go')};
  cards.forEach(cd=>{const b=el('div','mc','<div class="mc-in"><div class="mc-f">?</div><div class="mc-b">'+(cd.kind==='i'?'<img alt="" src="'+cd.img+'">':'<span>'+esc(cd.w)+'<br><small style="font-weight:600;opacity:.7">'+esc(cd.vi)+'</small></span>')+'</div></div>');b.setAttribute('role','button');b.setAttribute('tabindex','0');b.setAttribute('aria-label','Thẻ bí mật');b.dataset.w=cd.w;g.appendChild(b);
    const flipIt=()=>{
      if(lock||b.classList.contains('flip')||b.classList.contains('done'))return;
      b.classList.add('flip');sfx('flip');speakNow(cd.w);open.push([b,cd]);
      if(open.length===2){moves++;$('#mMoves').textContent=moves+' lượt';lock=true;const x=open[0],y=open[1];
        if(x[1].w===y[1].w){
          setTimeout(()=>{x[0].classList.add('done');y[0].classList.add('done');sfx('ok');combo++;best=Math.max(best,combo);found++;open=[];
            const pr=PRAISE[Math.floor(Math.random()*PRAISE.length)];cheer(pr[0],pr[1]);$('#mCombo').textContent='Chuỗi '+combo;
            setTimeout(()=>speakNow(found===pick.length?'Hooray! You did it!':(combo>=2&&COMBO[Math.min(combo,5)]?COMBO[Math.min(combo,5)]:pr[0])),1000);
            if(combo>=3){const e=document.createElement('div');e.className='conf';e.textContent='✨';$('#cheer').appendChild(e)}
            if(found===pick.length){const stars=moves<=pick.length+2?3:(moves<=pick.length*2?2:1);ST.matchWins++;addXP(8+stars*4+best);save();checkBadges();sfx('win');
              setTimeout(()=>{$('#mMsg').innerHTML='<b>Hoàn thành! '+moves+' lượt, '+stars+' sao, chuỗi dài nhất '+best+'. +'+(8+stars*4+best)+' XP</b> <button class="btn" id="mAgain" style="margin-left:8px">Chơi lại</button>';$('#mAgain').onclick=()=>matchStart(scope)},300)}
            lock=false},650)}
        else{combo=0;$('#mCombo').textContent='Chuỗi 0';setTimeout(()=>{sfx('bad');x[0].classList.remove('flip');y[0].classList.remove('flip');open=[];lock=false},1100)}
      }};
    b.onclick=flipIt;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flipIt()}};
  });
}

/* ---------- progress ---------- */
function renderProg(){
  const total=LESSONS.reduce((a,l)=>a+l.parts.length,0),done=Object.keys(ST.done).length,pct=Math.round(done/total*100);
  const box=$('#progBox');
  const cnt=(o)=>Object.keys(o||{}).length;
  box.innerHTML='<div class="pgrid"><div class="panel center"><div class="ring" style="--p:'+pct+'"><i>'+pct+'%</i></div><p class="mt"><b>'+done+'/'+total+'</b> phần bài học</p><div class="row c mt"><span class="chip">'+IC.star+ST.xp+' XP</span><span class="chip">'+IC.flame+streakNow()+' ngày</span><span class="chip">'+cnt(ST.words)+' từ</span></div>'
   +'<div class="row c mt"><span class="chip">Ngữ pháp '+cnt(ST.gr)+'/'+GRAM.length+'</span><span class="chip">Đọc '+cnt(ST.rd)+'/'+READ.length+'</span><span class="chip">Nghe '+cnt(ST.lis)+'/'+LISTEN.length+'</span></div>'
   +'<p class="muted mt" style="font-size:13px">Tiến trình được lưu ngay trên trình duyệt này, không gửi lên máy chủ nào. Hãy sao lưu ra file nếu muốn chuyển sang máy khác.</p>'
   +'<div class="row c mt"><button class="btn alt" id="bBackup">Sao lưu</button><button class="btn alt" id="bRestore">Khôi phục</button></div></div>'
   +'<div class="panel"><h3>Các cấp độ</h3>'+LEVELS.map(lv=>{const tp=lv.lessons.reduce((a,l)=>a+l.parts.length,0),dp=lv.lessons.reduce((a,l)=>a+l.parts.filter((p,i)=>ST.done[l.id+':'+i]).length,0),dl=lv.lessons.filter(isDone).length;
     return '<div class="lrow" style="grid-template-columns:1fr 90px 70px"><span><b style="color:'+lv.c+'">'+esc(lv.t.split(' · ')[0])+'</b> <small class="muted">'+esc(lv.t.split(' · ')[1]||'')+'</small></span><div class="bar" style="--c:'+lv.c+'"><i style="width:'+(dp/tp*100)+'%"></i></div><span class="muted">'+dl+'/'+lv.lessons.length+' bài</span></div>'}).join('')+'</div>'
   +'<div class="panel"><h3>Huy hiệu</h3><div class="badges mt">'+BADGES.map(b=>'<div class="badge'+(ST.badges[b.id]?' on':'')+'"><b>'+esc(b.t)+'</b><span>'+esc(b.d)+'</span></div>').join('')+'</div></div></div>';
  $('#bBackup').onclick=backupSave;$('#bRestore').onclick=()=>$('#fileRestore').click();
}
async function backupSave(){
  const blob=new Blob([JSON.stringify({app:'mimi-english',v:2,at:new Date().toISOString(),data:ST},null,1)],{type:'application/json'}),name='mimi-english-backup.json';
  let d=null;try{d=window.claude&&window.claude.use?await window.claude.use('downloads'):null}catch(e){}
  if(d){try{await d.save({filename:name,data:blob});toast('Đã lưu file sao lưu');return}catch(e){if(e&&e.code==='declined')return}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
}
function backupLoad(file){
  const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);if(!j||j.app!=='mimi-english'||!j.data)throw 0;ST=Object.assign(freshST(),j.data);ST.set=Object.assign({},DEF_SET,j.data.set||{});save();applyTheme();hud();refreshIcons();renderCur();renderProg();toast('Đã khôi phục tiến trình')}catch(e){toast('File này không phải bản sao lưu của Mimi English')}};r.readAsText(file);
}

/* ---------- studio / recording ---------- */
let recTab=false,recOn=false,recAbort=false,recorder=null,lastUrl=null;
function fillStudio(){
  $('#stLesson').innerHTML=LEVELS.map(lv=>'<optgroup label="'+esc(lv.t)+'">'+lv.lessons.map((l,i)=>'<option value="'+l.id+'">Bài '+(i+1)+'. '+esc(l.t+' · '+l.vi)+'</option>').join('')+'</optgroup>').join('');
  fillParts();
}
function fillParts(){const l=byId($('#stLesson').value);$('#stPart').innerHTML='<option value="-1">Cả bài</option>'+l.parts.map((p,i)=>'<option value="'+i+'">Phần '+(i+1)+': '+esc(p.name)+'</option>').join('')}
function curFmt(){const r=document.querySelector('input[name=fmt]:checked');return r?r.value:'16:9'}
function studioPreview(){
  if(recOn||currentView!=='studio')return;const l=byId($('#stLesson').value),pi=+$('#stPart').value;
  Eng.setFormat(curFmt());Eng.setTheme(l.theme);applyLessonLook(l);Eng.lessonTitle=lessonLabel(l);Eng.showChip=true;Eng.subMode=$('#stVi').checked?'both':'en';Eng.wm='';Eng.rec=false;Eng.cardS=null;
  const f=buildFlat(l,pi<0?null:pi);Eng.resetCur();Eng.partTitle=f[0].pt;Eng.show(f[0].step);Eng.sp={en:f[0].step.en,sub:f[0].step.sub,hl:false};
}
$('#stLesson').onchange=()=>{fillParts();studioPreview()};$('#stPart').onchange=studioPreview;$('#stVi').onchange=studioPreview;
$$('input[name=fmt]').forEach(r=>r.onchange=studioPreview);
function recUI(on){$('#bStartRec').disabled=on;$('#bStopRec').disabled=!on;$$('#v-studio select,#v-studio input').forEach(e=>e.disabled=on)}
function pickMime(){const c=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];for(const m of c){try{if(MediaRecorder.isTypeSupported(m))return m}catch(e){}}return ''}
async function startRec(){
  if(recOn)return;
  if(typeof proActive==='function'&&!proActive()){proOpen();return}
  if(!window.MediaRecorder||!Eng.comp.captureStream){toast('Trình duyệt chưa hỗ trợ quay. Hãy dùng Chrome, Edge hoặc Firefox bản mới.');return}
  if(!Eng.isOK()){toast('Cần WebGL để quay cảnh 3D');return}
  const l=byId($('#stLesson').value),pi=+$('#stPart').value;
  stopAll();playing=false;recAbort=false;auInit();
  let useNV=false,e0=null;
  if($('#stVoice').checked&&nvOn()){
    const rs=$('#recStatus');recUI(true);rs.dataset.nv='1';
    try{
      rs.textContent='Đang tải giọng AI…';await nvLoad();
      const lst=buildFlat(l,pi<0?null:pi);rs.dataset.nv='0';
      for(let k=0;k<lst.length;k++){const st=lst[k].step;if(!st.en)continue;rs.textContent='Đang tạo giọng AI '+(k+1)+'/'+lst.length+'…';await nvBuf(st.en,stepWho(st),stepRate())}
      useNV=true;
    }catch(e){useNV=false;e0=e}
    rs.dataset.nv='0';recUI(false);
    if(!useNV){const em=(NV.err&&NV.err.message)||(e0&&e0.message)||'';rs.textContent='Chưa quay được: giọng AI chưa sẵn sàng ('+em.slice(0,80)+'). Mình không quay bằng giọng dự phòng vì nghe rất tệ. Hãy tải lại trang, hoặc mở app qua địa chỉ web có thư mục assets, rồi quay lại.';toast('Giọng AI chưa sẵn sàng nên mình chưa quay, tránh video có giọng tệ.');return}
  }
  const list=buildFlat(l,pi<0?null:pi),wm=$('#stWm').value.trim(),intro=$('#stIntro').checked;
  Eng.setFormat(curFmt());Eng.setTheme(l.theme);applyLessonLook(l);Eng.lessonTitle=lessonLabel(l);Eng.wm=wm;Eng.showChip=true;Eng.subMode=$('#stVi').checked?'both':'en';Eng.resetCur();Eng.show(list[0].step);
  let tabS=null;recTab=false;
  if($('#stTab')&&$('#stTab').checked&&$('#stVoice').checked&&!nvOn()&&navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia){
    try{toast('Hãy chọn tab này và bật “Chia sẻ âm thanh của tab”');
      tabS=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true,preferCurrentTab:true,selfBrowserSurface:'include',systemAudio:'exclude'});
      if(!tabS.getAudioTracks().length){tabS.getTracks().forEach(t=>t.stop());tabS=null;toast('Chưa thấy âm thanh tab nên video dùng giọng nhẹ. Lần sau nhớ bật “Chia sẻ âm thanh của tab”.')}
      else{recTab=true;tabS.getVideoTracks().forEach(t=>t.stop());tabS.getVideoTracks().forEach(t=>tabS.removeTrack(t))}
    }catch(e){tabS=null;toast('Không bật được thu âm từ tab nên video dùng giọng nhẹ.')}
  }
  const stream=Eng.comp.captureStream(30);if(recTab){tabS.getAudioTracks().forEach(t=>stream.addTrack(t))}else if(AU.rec)AU.rec.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
  const mime=pickMime(),chunks=[];
  try{recorder=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:4000000,audioBitsPerSecond:192000}:{})}catch(e){toast('Không khởi động được bộ quay video');return}
  recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  const stopped=new Promise(r=>recorder.onstop=r);
  recOn=true;recUI(true);Eng.rec=true;Eng.recProg=0;$('#recResult').hidden=true;$('#recStatus').textContent='Đang quay…';
  musicStop();ST.set.rvol=+$('#stMvol').value;if($('#stMusic').checked)musicStart();
  recorder.start(400);
  let ok=false;
  if($('#stVoice').checked&&!useNV&&!recTab){$('#recStatus').textContent='Đang chuẩn bị giọng đọc…';try{await msLoad()}catch(e){toast('Không khởi động được giọng đọc ngoại tuyến nên mình dừng quay, tránh làm video câm.');recAbort=true}}
  try{
    if(intro){await showCard(l.t,l.vi+(wm?'  ·  '+wm:''),2300)}
    if(!recAbort){
      ok=await run(list,0,{cards:true,voice:$('#stVoice').checked,bi:$('#stBi').checked,onStep:(i,f)=>{Eng.recProg=i/list.length;$('#recBar i').style.width=(i/list.length*100)+'%';$('#recStatus').textContent='Đang quay: câu '+(i+1)+'/'+list.length}});
      if(ok&&intro&&!recAbort)await showCard('Thanks for watching!','Hẹn gặp lại ở bài sau'+(wm?'  ·  '+wm:''),2400)
    }
  }catch(e){}
  Eng.cardS=null;Eng.rec=false;$('#recBar i').style.width='100%';
  try{if(recorder.state!=='inactive')recorder.stop()}catch(e){}
  await stopped;recOn=false;if(tabS){tabS.getTracks().forEach(t=>t.stop());tabS=null}recTab=false;recUI(false);musicStop();applyMusicVol();syncMusic();
  const type=(recorder.mimeType||mime||'video/webm'),blob=new Blob(chunks,{type:type}),ext=/mp4/.test(type)?'mp4':'webm';
  if(lastUrl)URL.revokeObjectURL(lastUrl);lastUrl=URL.createObjectURL(blob);
  const r=$('#recResult');r.hidden=false;
  r.innerHTML='<h3>'+(ok?'Video đã sẵn sàng':'Video (đã dừng sớm)')+'</h3><video controls playsinline src="'+lastUrl+'"></video><p class="muted mt">'+(blob.size/1048576).toFixed(1)+' MB · '+ext.toUpperCase()+'</p><div class="row mt"><button class="btn" id="bSaveVid">Lưu video</button><button class="btn alt" id="bRecAgain">Quay lại</button></div><p class="muted mt" style="font-size:13px">Tải file lên YouTube, TikTok, Facebook hoặc Instagram.</p>';
  $('#bSaveVid').onclick=()=>saveVideo(blob,'mimi-english-'+l.id+'.'+ext);$('#bRecAgain').onclick=()=>{r.hidden=true;studioPreview();$('#recBar i').style.width='0'};
  $('#recStatus').textContent=(ok?'Quay xong.':'Đã dừng quay.')+($('#stVoice').checked?(useNV?' Giọng trong video: giọng AI.':' Giọng trong video: '+(nvOn()?'':'giọng dự phòng/nhẹ.')):'');
  if(ok){ST.rec++;addXP(15);sfx('win')}
}
function stopRec(){recAbort=true;stopAll();if(recorder&&recorder.state==='recording'){}}
async function saveVideo(blob,name){
  let d=null;try{d=window.claude&&window.claude.use?await window.claude.use('downloads'):null}catch(e){}
  if(d){try{await d.save({filename:name,data:blob});toast('Đã lưu video');return}catch(e){if(e&&e.code==='declined')return;toast('Không lưu được. Hãy bấm giữ hoặc chuột phải vào video để lưu.');return}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
}
$('#bStartRec').onclick=startRec;$('#bStopRec').onclick=stopRec;

/* ---------- music UI + click stage to pause ---------- */
function buildMusicUI(){
  const opts='<option value="rand">Ngẫu nhiên</option>'+SONGS.map(x=>'<option value="'+x.id+'">'+esc(x.t)+'</option>').join('');
  ['#setTrack','#stTrack'].forEach(q=>{const e=$(q);if(e){e.innerHTML=opts;e.value=SONGS.some(x=>x.id===ST.set.track)?ST.set.track:'rand'}});
  $('#rVol').value=ST.set.mvol;$('#setMvol').value=ST.set.mvol;$('#stMvol').value=ST.set.rvol;
}
function setMusicOn(on){ST.set.music=on;save();$('#bMus').classList.toggle('on',on);$('#setMusic').checked=on;if(on){auInit();syncMusic()}else musicStop()}
$('#bMus').onclick=()=>{setMusicOn(!ST.set.music);toast(ST.set.music?'Đã bật nhạc nền':'Đã tắt nhạc nền')};
$('#rVol').oninput=e=>{ST.set.mvol=+e.target.value;$('#setMvol').value=e.target.value;save();applyMusicVol();if(+e.target.value===0&&ST.set.music){}};
$('#setMvol').oninput=e=>{ST.set.mvol=+e.target.value;$('#rVol').value=e.target.value;save();applyMusicVol()};
$('#stMvol').oninput=e=>{ST.set.rvol=+e.target.value;save();if(recOn)applyMusicVol()};
function trackChanged(v){ST.set.track=v;save();['#setTrack','#stTrack'].forEach(q=>$(q).value=v);if(MU.on||AU.timer){musicStop();if(!recOn&&ST.set.music)musicStart()}}
$('#setTrack').onchange=e=>trackChanged(e.target.value);$('#stTrack').onchange=e=>trackChanged(e.target.value);
function flashPP(icon){const b=$('#stageBox');let e=b.querySelector('.pp');if(!e){e=el('div','pp');b.appendChild(e)}e.innerHTML=icon;e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
$('#stageBox').addEventListener('click',e=>{if(currentView!=='learn'||!cur)return;if(e.target.closest('.pp'))return;playing?pause():play();flashPP(playing?IC.play:IC.pause)});
document.addEventListener('keydown',e=>{if(e.code!=='Space'||currentView!=='learn'||!cur||e.target.closest('input,select,textarea,button,[tabindex]'))return;e.preventDefault();playing?pause():play();flashPP(playing?IC.play:IC.pause)});

/* ---------- settings ---------- */
function applyTheme(){const t=ST.set.theme,r=document.documentElement;if(t==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t)}
function tabRowVis(){const r=document.getElementById('stTabRow');if(r&&!/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)&&navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia)r.style.display=nvOn()?'none':'';const c=document.getElementById('stTab');if(c&&nvOn())c.checked=false}
function syncSettingsUI(){tabRowVis();$('#setVM').value=ST.set.vm||'native';nvNoteAuto();$('#setSel').checked=ST.set.sel!==false;$('#setSub').value=ST.set.sub;$('#setMusic').checked=ST.set.music;$('#setTheme').value=ST.set.theme}
$('#btnSet').onclick=()=>{loadVoices();syncSettingsUI();$('#setModal').classList.add('on');$('#bSetClose').focus()};
const closeSet=()=>$('#setModal').classList.remove('on');
$('#bSetClose').onclick=closeSet;$('#setModal').addEventListener('click',e=>{if(e.target.id==='setModal')closeSet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSet()});
$('#setVoice').onchange=e=>{ST.set.vname=e.target.value;save()};
$('#setVM').onchange=e=>{ST.set.vm=e.target.value;save();tabRowVis();if(nvOn())nvRetry();nvNoteAuto()};
$('#fileRestore').onchange=e=>{if(e.target.files[0])backupLoad(e.target.files[0]);e.target.value=''};
$('#setSub').onchange=e=>{ST.set.sub=e.target.value;Eng.subMode=ST.set.sub;save();refreshIcons()};
$('#setSel').onchange=e=>{ST.set.sel=e.target.checked;save()};
$('#setMusic').onchange=e=>setMusicOn(e.target.checked);
$('#setTheme').onchange=e=>{ST.set.theme=e.target.value;save();applyTheme()};
$('#bTestVoice').onclick=()=>{auInit();if(nvOn()&&NV.state===-1)nvRetry();speakNow('Hello! I am Mimi. Let us learn English together!')};
let resetArm=0;
$('#bReset').onclick=e=>{if(!resetArm){resetArm=1;e.target.textContent='Bấm lần nữa để xóa';setTimeout(()=>{resetArm=0;e.target.textContent='Xóa tiến độ'},4000);return}
  resetArm=0;e.target.textContent='Xóa tiến độ';ST=freshST();save();applyTheme();syncSettingsUI();hud();renderCur();if(cur)selectLesson(cur.id,false);toast('Đã xóa tiến độ')};
if(SS){SS.onvoiceschanged=loadVoices}

/* ---------- init ---------- */
(async function init(){
  load();speedMul=ST.set.speed||1;applyTheme();refreshIcons();hud();loadVoices();fillStudio();buildMusicUI();$('#bMus').classList.toggle('on',!!ST.set.music);
  try{await Promise.race([Promise.all([document.fonts.load('800 40px "Baloo 2"'),document.fonts.load('700 20px Nunito')]),sleep(2500)])}catch(e){}
  Eng.subMode=ST.set.sub;mountStage();selectLesson(LESSONS[0].id,false);
  window.__ready=true;
})();
