'use strict';
/* ================= LUYỆN NÓI =================
   Nhận diện giọng nói bằng Web Speech API của trình duyệt (Chrome, Edge, Safari). Không tải thêm dữ liệu nặng.
   Chấm điểm theo từng từ, chia 5 bậc, gợi ý phát âm. Kết quả chỉ lưu trong trình duyệt (ST.sp). */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const SPT=[['Khởi động',0,'#ef476f'],['Đang tiến bộ',30,'#ff9f43'],['Khá',55,'#f2c230'],['Tốt',75,'#4cc38a'],['Xuất sắc',90,'#12b886']];
const spTier=s=>{let t=0;SPT.forEach((x,i)=>{if(s>=x[1])t=i});return t};
const NUMW='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' ');
const spNorm=t=>String(t).toLowerCase().replace(/\b(\d{1,2})\b/g,(m,n)=>NUMW[+n]||m).replace(/[’‘]/g,"'").replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean);
function spLev(a,b){const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++){d[i]=[i];for(let j=1;j<=n;j++)d[i][j]=i?0:j}
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
/* so khớp từng từ: quy hoạch động, trả về trạng thái mỗi từ mẫu: 2 đúng, 1 gần đúng, 0 thiếu hoặc sai */
function spAlign(exp,got){
  const m=exp.length,n=got.length,cost=(a,b)=>{if(a===b)return 0;const l=spLev(a,b);return l<=1&&a.length>3?.45:(l<=2&&a.length>6?.6:1)};
  const D=[];for(let i=0;i<=m;i++){D[i]=[];for(let j=0;j<=n;j++)D[i][j]=i&&j?0:(i||j)}
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+.7,D[i-1][j-1]+cost(exp[i-1],got[j-1]));
  const st=new Array(m).fill(0);let i=m,j=n;
  while(i>0&&j>0){const c=cost(exp[i-1],got[j-1]);
    if(Math.abs(D[i][j]-(D[i-1][j-1]+c))<1e-9){st[i-1]=c===0?2:(c<1?1:0);i--;j--}
    else if(Math.abs(D[i][j]-(D[i-1][j]+1))<1e-9){st[i-1]=0;i--}else j--}
  return st;
}
function spScore(expText,alts,dur){
  const exp=spNorm(expText);if(!exp.length)return null;let best=null;
  (alts||[]).forEach(a=>{const got=spNorm(a.t);if(!got.length)return;const st=spAlign(exp,got);
    const acc=st.reduce((s,x)=>s+(x===2?1:x===1?.55:0),0)/exp.length*100;
    const conf=a.c>0?a.c*100:acc;const extra=Math.max(0,got.length-exp.length);
    let sc=acc*.8+Math.min(acc,conf)*.2-Math.min(15,extra*4);sc=Math.max(0,Math.min(100,sc));
    if(!best||sc>best.score)best={score:Math.round(sc),st:st,exp:exp,got:got,conf:conf}});
  if(!best)return {score:0,st:exp.map(()=>0),exp:exp,got:[],conf:0};
  const sec=dur>0?dur/1000:0;if(sec&&exp.length>=4){const wpm=exp.length/sec*60;best.wpm=Math.round(wpm)}
  return best;
}
/* gợi ý phát âm theo từ bị sai */
const SPTIPS=[
 [/th/,'Âm “th”: đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi nhẹ, đừng đọc thành “t”, “d” hay “s”. Xem thẻ Phát âm “th”.'],
 [/(ed)$/,'Đuôi -ed: đọc /t/, /d/ hoặc /ɪd/, không đọc rõ chữ “e”. Xem thẻ Phát âm “-ed”.'],
 [/(s|es)$/,'Đuôi -s/-es: đừng bỏ âm cuối. Đọc /s/, /z/ hoặc /ɪz/. Xem thẻ Phát âm “-s”.'],
 [/^(sh|ch)|(sh|ch)$/,'Cặp “sh” và “ch” khác nhau: sh là hơi xì, ch là bật hơi như “chờ”.'],
 [/ee|ea|ie/,'Nguyên âm dài /iː/: kéo dài hơn, môi kéo ngang. Phân biệt ship và sheep.'],
 [/^(r|l)|(r|l)$|rl|lr/,'Phân biệt r và l: r cuộn lưỡi lên không chạm, l chạm lợi trên.'],
 [/(t|d|k|p|b|g)$/,'Phụ âm cuối: đọc nhẹ nhưng đừng bỏ, người nghe sẽ khó phân biệt từ.'],
 [/./,'Nghe mẫu chậm vài lần, chú ý trọng âm (âm nhấn) của từ rồi nhại lại.']
];
const spTip=w=>{for(const t of SPTIPS)if(t[0].test(w))return t[1];return ''};
function spPool(lv,type){
  const seen=new Set(),out=[];const add=(en,vi,key)=>{en=String(en||'').trim();if(!en||seen.has(en.toLowerCase()))return;seen.add(en.toLowerCase());out.push({en:en,vi:vi||'',key:key||('t'+type+'|'+en.toLowerCase())})};
  if(type==='p'){READ.filter(r=>r.lv===lv).forEach(r=>{const ss=r.text.replace(/\s+/g,' ').match(/[^.!?]+[.!?]+/g)||[r.text];add(ss.slice(0,2).join(' ').trim(),r.vi,'p'+r.id)});return out}
  LESSONS.filter(l=>l.lv.cefr===lv).forEach(l=>l.parts.forEach(p=>p.steps.forEach(s=>{
    if(type==='w'){if(s.k==='v'&&s.w)add(s.w,s.vi)}
    else if(s.en&&(s.k==='d'||s.k==='n'||s.k==='s')&&s.en.split(' ').length>=3&&s.en.length<=110)add(s.en,s.sub)})));
  return out;
}
let spLv='A1',spType='w',spRec=null;
function spStars(n){return '<span class="spst">'+[0,1,2,3,4].map(i=>'<i style="color:'+(i<n?'var(--sun)':'var(--line)')+'">★</i>').join('')+'</span>'}
EXT.speak=()=>speakHome();
function speakHome(){
  const box=$('#speakBox');spStop();ST.sp=ST.sp||{};
  const done=Object.keys(ST.sp).length,avg=done?Math.round(Object.values(ST.sp).reduce((a,b)=>a+b,0)/done):0;
  box.innerHTML='<h2>Luyện nói</h2><p class="muted">Nói vào micro, mình nhận diện và chấm theo 5 bậc từ Khởi động đến Xuất sắc, kèm góp ý phát âm. Đã luyện: <b>'+done+'</b> mục, điểm trung bình <b>'+avg+'</b>.</p>'
   +(SR?'':'<div class="panel" style="background:var(--surface2)"><b>Máy này chưa hỗ trợ nhận diện giọng nói.</b><p class="muted">Hãy mở app bằng Chrome, Edge hoặc Safari bản mới, qua địa chỉ https. Trong lúc đó bạn vẫn luyện được ở chế độ tự chấm: nghe mẫu, nói theo, rồi tự đánh giá.</p></div>');
  const t=el('div','tools'),a=el('div','seg2'),b=el('div','seg2');
  FILTERS.forEach(f=>{const x=el('button',spLv===f?'on':'',f);x.onclick=()=>{spLv=f;speakHome()};a.appendChild(x)});
  [['w','Từ'],['s','Câu'],['p','Đoạn ngắn']].forEach(f=>{const x=el('button',spType===f[0]?'on':'',f[1]);x.onclick=()=>{spType=f[0];speakHome()};b.appendChild(x)});
  t.appendChild(a);t.appendChild(b);box.appendChild(t);
  const pool=spPool(spLv,spType);box.appendChild(el('p','muted',pool.length+' mục ở cấp '+spLv+'. Bấm vào mục bạn muốn nói.'));
  const g=el('div','spgrid');
  pool.slice(0,120).forEach((it,i)=>{const sc=ST.sp[it.key];const c=el('button','rdcard'+(sc>=75?' done':''),'<div style="min-width:0"><b>'+esc(it.en)+'</b><span>'+esc(it.vi)+'</span></div>'+(sc!=null?spStars(spTier(sc)+1):''));c.onclick=()=>speakOpen(pool,i);g.appendChild(c)});
  box.appendChild(g);if(pool.length>120)box.appendChild(el('p','muted','Hiển thị 120 mục đầu. Dùng nút “Mục tiếp theo” để đi tiếp.'));
}
function spDisp(t){let k=0;return t.trim().split(/\s+/).map(w=>{const n=spNorm(w).length;const h='<span data-k="'+k+'" data-n="'+n+'">'+esc(w)+'</span>';k+=n;return h}).join(' ')}
function spStop(){try{if(spRec){spRec.onend=null;spRec.onerror=null;spRec.onresult=null;spRec.abort()}}catch(e){}spRec=null}
function speakOpen(pool,i){
  const it=pool[i],box=$('#speakBox');spStop();stopAll();
  box.innerHTML=backBtn('Danh sách')+'<div class="gh"><div><span class="'+lvCls(spLv)+'">'+spLv+'</span><p class="muted" style="font-weight:700">Mục '+(i+1)+'/'+pool.length+'</p></div></div>'
   +'<div class="spcard"><div class="sptxt" id="spTxt">'+spDisp(it.en)+'</div><div class="muted">'+esc(it.vi)+'</div></div>'
   +'<div class="row"><button class="btn alt" id="spHear">Nghe mẫu</button><button class="btn alt" id="spSlow">Nghe chậm</button></div>'
   +'<div class="spmic"><button class="btn rec" id="spMic">'+(SR?'Bấm và nói':'Bắt đầu nói')+'</button><div class="muted" id="spSt">'+(SR?'Bấm nút, đợi biểu tượng nghe rồi nói cả câu.':'Nói thành tiếng rồi tự đánh giá.')+'</div></div>'
   +'<div id="spRes"></div><div class="row mt"><button class="btn alt" id="spPrev">Mục trước</button><button class="btn" id="spNext">Mục tiếp theo</button></div>';
  $('#bkBtn').onclick=speakHome;
  $('#spHear').onclick=()=>speakNow(it.en);$('#spSlow').onclick=()=>speakNow(it.en,{slow:true,rate:ST.set.rate*.75});
  $('#spPrev').onclick=()=>speakOpen(pool,(i+pool.length-1)%pool.length);$('#spNext').onclick=()=>speakOpen(pool,(i+1)%pool.length);
  const fin=(r)=>{
    const tier=spTier(r.score),had=ST.sp[it.key]||0;
    if(r.score>had){ST.sp[it.key]=r.score;if(had<75&&r.score>=75)addXP(5);else if(!had)addXP(2);save()}
    spShow(it,r,tier);
  };
  const manual=()=>{$('#spRes').innerHTML='<p class="muted mt">Bạn thấy mình nói thế nào?</p><div class="row">'+[['Còn vấp',25],['Khá',65],['Rất tốt',95]].map(x=>'<button class="btn alt" data-s="'+x[1]+'">'+x[0]+'</button>').join('')+'</div>';
    $$('#spRes [data-s]').forEach(b=>b.onclick=()=>{const sc=+b.dataset.s;const exp=spNorm(it.en);fin({score:sc,st:exp.map(()=>sc>=65?2:1),exp:exp,got:exp,conf:0,manual:1})})};
  $('#spMic').onclick=()=>{
    if(!SR)return manual();
    if(spRec){spStop();$('#spMic').textContent='Bấm và nói';return}
    stopAll();const r=new SR();spRec=r;r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;r.continuous=false;
    let t0=0,t1=0,got=false;
    r.onaudiostart=()=>{$('#spSt').textContent='Đang nghe… hãy nói ngay.'};
    r.onspeechstart=()=>{t0=performance.now()};r.onspeechend=()=>{t1=performance.now()};
    r.onresult=e=>{got=true;const res=e.results[0],alts=[];for(let k=0;k<res.length;k++)alts.push({t:res[k].transcript,c:res[k].confidence});
      spRec=null;$('#spMic').textContent='Nói lại';const sc=spScore(it.en,alts,t0&&t1?t1-t0:0);fin(sc||{score:0,st:[],exp:[],got:[],conf:0})};
    r.onerror=e=>{spRec=null;$('#spMic').textContent='Bấm và nói';const m={'not-allowed':'Mình chưa được dùng micro. Hãy cho phép micro cho trang web này (biểu tượng ổ khóa cạnh địa chỉ). Nếu đang mở trong khung xem trước thì cần mở app ở trang riêng.','service-not-allowed':'Trình duyệt không cho dùng nhận diện giọng nói ở trang này.','no-speech':'Mình chưa nghe thấy gì. Thử nói gần micro hơn.','audio-capture':'Không tìm thấy micro.','network':'Nhận diện giọng nói cần kết nối mạng.'}[e.error];
      $('#spSt').textContent=m||'Chưa nhận diện được, thử lại nhé.';if(e.error==='not-allowed'||e.error==='service-not-allowed'||e.error==='audio-capture'){$('#spRes').innerHTML='<p class="muted">Bạn có thể dùng chế độ tự chấm:</p>';manual()}};
    r.onend=()=>{if(spRec===r){spRec=null;$('#spMic').textContent='Bấm và nói';if(!got)$('#spSt').textContent='Mình chưa nghe rõ. Bấm và thử lại.'}};
    try{r.start();$('#spMic').textContent='Dừng';$('#spSt').textContent='Đang bật micro…'}catch(e){spRec=null;$('#spSt').textContent='Không bật được micro.'}
  };
}
function spShow(it,r,tier){
  const T=SPT[tier];
  $$('#spTxt span').forEach(s=>{const k0=+s.dataset.k,n=+s.dataset.n;let v=2;if(!n)v=-1;else for(let q=k0;q<k0+n;q++)v=Math.min(v,r.st[q]==null?0:r.st[q]);if(v<0)return;s.style.color=v===2?'#12b886':v===1?'#e8a317':'#ef476f';s.style.fontWeight=800;s.title=v===2?'Đúng':v===1?'Gần đúng':'Cần luyện'});
  const miss=[];r.exp.forEach((w,k)=>{if(r.st[k]<2&&miss.indexOf(w)<0)miss.push(w)});
  let tips='';
  if(r.manual)tips='<p class="muted">Đã ghi nhận tự đánh giá. Khi trình duyệt hỗ trợ nhận diện, mình sẽ chấm chi tiết từng từ.</p>';
  else{
    tips+=r.got.length?'<p class="muted">Mình nghe được: “'+esc(r.got.join(' '))+'”</p>':'<p class="muted">Mình chưa nghe được từ nào rõ ràng.</p>';
    if(miss.length)tips+='<div class="sptips"><b>Từ cần luyện</b>'+miss.slice(0,4).map(w=>'<div><button class="btn alt sm" data-w="'+esc(w)+'">'+esc(w)+'</button> '+esc(spTip(w))+'</div>').join('')+'</div>';
    if(r.wpm)tips+='<p class="muted">Tốc độ khoảng '+r.wpm+' từ/phút. '+(r.wpm<70?'Hơi chậm, thử nói liền mạch hơn.':r.wpm>190?'Hơi nhanh, hãy nói rõ từng từ.':'Tốc độ tốt.')+'</p>';
    if(tier<=1)tips+='<p class="muted">Gợi ý: nghe mẫu chậm, nói theo từng cụm ngắn, rồi ghép lại cả câu. Vào tab Ngữ pháp, nhóm Phát âm để xem thẻ luyện âm.</p>';
  }
  $('#spRes').innerHTML='<div class="spscore" style="border-color:'+T[2]+'"><div class="num" style="color:'+T[2]+'">'+r.score+'</div><div><b>'+T[0]+'</b>'+spStars(tier+1)+'</div></div>'+tips;
  $$('#spRes [data-w]').forEach(b=>b.onclick=()=>speakNow(b.dataset.w,{slow:true,rate:ST.set.rate*.7}));
  sfx(tier>=3?'ok':'pop');
}
