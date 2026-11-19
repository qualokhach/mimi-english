'use strict';
/* ============ Tab mới: Ngữ pháp, Đọc hiểu, Nghe hiểu, Từ điển + dịch nổi ============ */
window.EXT={};
buildCorpus();
const lvCls=l=>'tag lv'+l[0];
const emj=(e,d)=>e||d||'⭐';

/* ---------- trình chạy trắc nghiệm chung ---------- */
function mcRun(box,qs,o){
  o=o||{};let i=0,ok=0;const wrong=[];
  const draw=()=>{
    const q=qs[i];
    box.innerHTML='<div class="qhead"><button class="ib" id="mcBack" aria-label="Thoát">'+IC.prev+'</button><div class="qbar"><i style="width:'+(i/qs.length*100)+'%"></i></div><span>'+(i+1)+'/'+qs.length+'</span></div>'
     +(o.title?'<p class="center muted" style="font-weight:800">'+esc(o.title)+'</p>':'')
     +'<div class="qp">'+esc(q.q)+'</div><div class="opts"></div><div class="qfb" id="mcFb" aria-live="polite"></div><div class="row c mt"><button class="ib" id="mcSpk" aria-label="Nghe" '+(q.speak?'':'hidden')+'>'+IC.spk+'</button><button class="btn" id="mcNext" hidden>'+(i===qs.length-1?'Xem kết quả':'Câu tiếp')+'</button></div>';
    $('#mcBack').onclick=()=>{stopAll();o.back&&o.back()};
    $('#mcSpk').onclick=()=>speakNow(q.speak);
    const og=box.querySelector('.opts');
    q.opts.forEach(op=>{const b=el('button','opt',esc(op.t));og.appendChild(b);b.onclick=()=>{
      if(og.classList.contains('lock'))return;og.classList.add('lock');
      og.querySelectorAll('.opt').forEach((x,k)=>{if(q.opts[k].ok)x.classList.add('ok')});
      const fb=$('#mcFb');
      if(op.ok){ok++;sfx('ok');fb.className='qfb ok';fb.textContent='Chính xác! '+(q.why||'')}
      else{b.classList.add('bad');sfx('bad');fb.className='qfb bad';fb.textContent='Chưa đúng. '+(q.why||'');wrong.push(q)}
      if(q.speak&&o.speakAfter!==false)speakNow(q.speak);
      $('#mcNext').hidden=false;$('#mcNext').focus()}});
    $('#mcNext').onclick=()=>{i++;i>=qs.length?end():draw()};
  };
  const end=()=>{
    const p=ok/qs.length,stars=p>=.9?3:(p>=.6?2:(ok>0?1:0));sfx(stars?'win':'bad');
    box.innerHTML='<h2 class="center">Kết quả</h2><div class="big-score">'+ok+'/'+qs.length+'</div><div class="stars">'+[1,2,3].map(k=>IC.star.replace('<svg','<svg class="'+(k<=stars?'on':'')+'"')).join('')+'</div><div class="row c mt"><button class="btn" id="mcAgain">Làm lại</button><button class="btn alt" id="mcDone">Quay lại</button></div>';
    $('#mcAgain').onclick=()=>{i=0;ok=0;wrong.length=0;draw()};$('#mcDone').onclick=()=>o.back&&o.back();
    o.onDone&&o.onDone(ok,qs.length);
  };
  draw();
}
const mkq=q=>({q:q.q,opts:shuffle(q.opts.map(x=>({t:x.t,ok:x.ok}))),why:(q.opts.find(x=>x.ok)||{}).t?'Đáp án: '+q.opts.find(x=>x.ok).t:'',speak:q.say||null});

/* ---------- đọc có tô sáng câu / từ (dùng cho Nghe hiểu và Đọc hiểu) ---------- */
let lisBusy=0;
function speakLine(text,who,onProg,rateMul){
  return new Promise(res=>{
    const rate=Math.min(1.5,ST.set.rate*(rateMul||1));let fin=false,tm,iv,gotB=false;
    const est=estDur(text,rate)*1000,t0=performance.now();
    const done=()=>{if(fin)return;fin=true;clearTimeout(tm);clearInterval(iv);res()};waiters.push(done);
    if(onProg)iv=setInterval(()=>{if(!gotB){onProg(Math.floor(Math.min(1,(performance.now()-t0)/est)*text.length))}},60);
    const v=enVoice();
    const viaMs=()=>{tm=setTimeout(done,est+9000);msLoad().then(()=>msBuf(text,who==='B'?'B':'A',rate)).then(b=>{if(fin)return;if(!b)return done();if(!auInit())return done();
      const s=AU.ctx.createBufferSource();s.buffer=b;s.connect(AU.voice);voiceSrc=s;s.onended=done;s.start();clearTimeout(tm);tm=setTimeout(done,b.duration*1000+800)}).catch(()=>{clearTimeout(tm);tm=setTimeout(done,est)})};
    if(SS&&v){tm=setTimeout(done,est+6000);
      try{SS.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=rate;u.pitch=who==='B'?.75:(who==='A'?1.2:1);
        u.onboundary=e=>{if(typeof e.charIndex==='number'){gotB=true;onProg&&onProg(e.charIndex)}};u.onend=done;u.onerror=done;SS.speak(u)}catch(e){viaMs()}}
    else viaMs();
  });
}
function wordSpans(text){let out='',pos=0;text.replace(/\S+/g,(m,off)=>{out+=esc(text.slice(pos,off))+'<span class="w" data-s="'+off+'" data-e="'+(off+m.length)+'">'+esc(m)+'</span>';pos=off+m.length;return m});return out+esc(text.slice(pos))}
function markProg(lineEl,ci){let cur=null;lineEl.querySelectorAll('.w').forEach(w=>{const s=+w.dataset.s,e=+w.dataset.e;w.classList.toggle('past',e<=ci);w.classList.toggle('cur',s<=ci&&ci<e);if(s<=ci&&ci<e)cur=w})}
const FILTERS=['A1','A2','B1','B2','C1','C2'];
function filterBar(box,key,cb){
  const w=el('div','seg2');const cur=ST.set[key]||'all';
  [['all','Tất cả']].concat(FILTERS.map(f=>[f,f])).forEach(a=>{const b=el('button',cur===a[0]?'on':'',a[1]);b.onclick=()=>{ST.set[key]=a[0];save();cb()};w.appendChild(b)});
  box.appendChild(w);
}
const backBtn=(txt)=>'<button class="back" id="bkBtn">'+IC.prev+(txt||'Quay lại')+'</button>';

/* ================= NGỮ PHÁP ================= */
let gs={tab:'cards',cat:'all',q:'',lv:'all'};
const CATC=id=>(GCATS.find(c=>c.id===id)||{}).c||'#3d6bff';
EXT.gram=()=>gramHome();
function gramHome(){
  const box=$('#gramBox');stopAll();
  box.innerHTML='<h2>Ngữ pháp</h2><p class="muted">'+GRAM.length+' thẻ từ cơ bản đến nâng cao, mỗi thẻ có công thức, ví dụ 3D, sơ đồ tư duy và bài tập luyện.</p>';
  const tabs=el('div','seg2 mt');[['cards','Thẻ ngữ pháp'],['irr','Động từ bất quy tắc']].forEach(a=>{const b=el('button',gs.tab===a[0]?'on':'',a[1]);b.onclick=()=>{gs.tab=a[0];gramHome()};tabs.appendChild(b)});box.appendChild(tabs);
  if(gs.tab==='irr')return irrView(box);
  const t=el('div','tools');t.innerHTML='<input type="search" id="gQ" placeholder="Tìm thẻ: past, will, modal, mệnh đề…" aria-label="Tìm thẻ ngữ pháp" value="'+esc(gs.q)+'">';box.appendChild(t);
  const cs=el('div','seg2');[{id:'all',t:'Tất cả'}].concat(GCATS).forEach(c=>{const b=el('button',gs.cat===c.id?'on':'',c.t);b.onclick=()=>{gs.cat=c.id;gramHome()};cs.appendChild(b)});box.appendChild(cs);
  const lvs=el('div','seg2');lvs.style.marginTop='8px';['all'].concat(FILTERS).forEach(f=>{const b=el('button',gs.lv===f?'on':'',f==='all'?'Mọi trình độ':f);b.onclick=()=>{gs.lv=f;gramHome()};lvs.appendChild(b)});box.appendChild(lvs);
  const grid=el('div','cardgrid mt');box.appendChild(grid);
  const norm=s=>s.toLowerCase();
  const list=GRAM.filter(g=>(gs.cat==='all'||g.cat===gs.cat)&&(gs.lv==='all'||g.lv===gs.lv)&&(!gs.q||norm(g.t+' '+g.vi+' '+g.def).indexOf(norm(gs.q))>=0));
  if(!list.length)grid.innerHTML='<p class="muted">Không có thẻ phù hợp.</p>';
  list.forEach(g=>{const b=el('button','gc'+(ST.gr[g.id]?' done':''),'<span class="'+lvCls(g.lv)+'">'+g.lv+'</span><b>'+esc(g.t)+'</b><span class="v">'+esc(g.vi)+'</span><p>'+esc(g.def)+'</p>');b.style.setProperty('--c',CATC(g.cat));b.onclick=()=>gramOpen(g.id);grid.appendChild(b)});
  const q=$('#gQ');q.oninput=()=>{gs.q=q.value;clearTimeout(q._t);q._t=setTimeout(()=>{gramHome();const n=$('#gQ');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}},250)};
}
function tlSVG(type){
  if(!type)return'';
  const W=560,H=120,y=70,P=130,N=280,F=430,c='#3d6bff',d='#ff8a3d';
  let s='<svg class="tlsvg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Trục thời gian"><line x1="20" y1="'+y+'" x2="'+(W-24)+'" y2="'+y+'" stroke="#9aa3d6" stroke-width="3"/><path d="M'+(W-24)+' '+y+'l-10 -7v14z" fill="#9aa3d6"/>'
   +'<text x="'+P+'" y="108" text-anchor="middle">Quá khứ</text><text x="'+N+'" y="108" text-anchor="middle">Hiện tại</text><text x="'+F+'" y="108" text-anchor="middle">Tương lai</text>'
   +'<line x1="'+N+'" y1="'+(y-14)+'" x2="'+N+'" y2="'+(y+14)+'" stroke="#9aa3d6" stroke-width="3"/>';
  const dot=(x,col,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(r||9)+'" fill="'+(col||c)+'"/>';
  const bar=(x1,x2,col)=>'<rect x="'+x1+'" y="'+(y-9)+'" width="'+(x2-x1)+'" height="18" rx="9" fill="'+(col||c)+'" opacity=".85"/>';
  const arc=(x1,x2)=>'<path d="M'+x1+' '+(y-12)+'Q'+((x1+x2)/2)+' '+(y-58)+' '+x2+' '+(y-12)+'" fill="none" stroke="'+c+'" stroke-width="4" stroke-dasharray="6 5"/>';
  const T={habit:[60,130,200,280,360,430,500].map(x=>dot(x,c,7)).join(''),now:dot(N,d,11),
    pperf:dot(P,c)+arc(P,N)+dot(N,d,7),ppc:bar(P-20,N,c)+dot(N,d,8),past:dot(P,c,11),pastc:bar(P-40,P+40,c)+dot(P+60,d,8),
    pastperf:dot(P-50,c)+dot(P+30,d)+'<path d="M'+(P-50)+' '+(y-14)+'Q'+(P-10)+' '+(y-44)+' '+(P+30)+' '+(y-14)+'" fill="none" stroke="'+c+'" stroke-width="3" stroke-dasharray="5 4"/>',
    pastpc:bar(P-70,P+20,c)+dot(P+40,d,9),future:dot(F,c,11),gt:dot(N,d,8)+'<path d="M'+N+' '+(y-14)+'Q'+((N+F)/2)+' '+(y-52)+' '+F+' '+(y-14)+'" fill="none" stroke="'+c+'" stroke-width="4"/>'+dot(F,c,9),
    futc:bar(F-45,F+45,c),futperf:dot(F-50,c)+dot(F+20,d,9),futpc:bar(N,F+20,c)+dot(F+40,d,9)}[type]||'';
  return s+T+'</svg>';
}
function mindmap(g){
  const br=[['Công thức','#3d6bff',g.forms],['Cách dùng','#12b886',g.use],['Dấu hiệu nhận biết','#ff8a3d',g.sig],['Mẹo nhớ','#e64980',g.tips]].filter(b=>b[2]&&b[2].length);
  return '<div class="mm"><span class="mm-c">'+esc(g.t)+'<br><small style="font-family:var(--body);font-weight:600">'+esc(g.vi)+'</small></span><div class="mm-b">'+br.map(b=>'<div class="mm-n" style="--c:'+b[1]+'"><h5>'+b[0]+'</h5><ul>'+b[2].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>').join('')+'</div></div>';
}
function gramOpen(id){
  const g=GRAM.find(x=>x.id===id),box=$('#gramBox');stopAll();
  const ex=g.ex.map((x,i)=>'<div class="ex"><span class="e">'+(x.obj||'💬')+'</span><div style="min-width:0"><b>'+esc(x.en)+'</b><span>'+esc(x.vi)+'</span></div><button class="ib" data-play="'+i+'" aria-label="Nghe">'+IC.spk+'</button><button class="ib" data-3d="'+i+'" aria-label="Xem 3D" title="Xem 3D">'+sv('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>')+'</button></div>').join('');
  box.innerHTML=backBtn('Tất cả thẻ')+'<div class="gh"><div><span class="'+lvCls(g.lv)+'">'+g.lv+'</span> <span class="tag">'+esc((GCATS.find(c=>c.id===g.cat)||{}).t||'')+'</span><h2>'+esc(g.t)+'</h2><p class="muted" style="font-weight:700">'+esc(g.vi)+'</p></div><div class="sp"><button class="btn alt" id="gAll">Nghe các ví dụ</button><button class="btn'+(ST.gr[g.id]?'':' alt')+'" id="gLearn">'+(ST.gr[g.id]?'Đã học':'Đánh dấu đã học')+'</button></div></div>'
   +'<p class="mt" style="font-size:18px">'+esc(g.def)+'</p>'
   +(g.tl?'<div class="sec"><h4>Trục thời gian</h4>'+tlSVG(g.tl)+'</div>':'')
   +'<div class="sec"><h4>Sơ đồ tư duy</h4>'+mindmap(g)+'</div>'
   +'<div class="sec"><h4>Ví dụ trực quan</h4><div class="stagebox gstage" id="gStage"></div>'+ex+'</div>'
   +'<div class="row mt">'+(g.q.length?'<button class="btn" id="gQuiz">Kiểm tra nhanh ('+Math.min(10,g.q.length)+' câu ngẫu nhiên)</button>':'')+(g.q.length>10?'<button class="btn alt" id="gQuizAll">Luyện tất cả ('+g.q.length+' câu)</button>':'')+'<button class="btn alt" id="gNext">Thẻ tiếp theo</button></div>';
  $('#bkBtn').onclick=gramHome;
  mountStage();Eng.setFormat('16:9');Eng.setTheme('room');Eng.lessonTitle=g.t;Eng.showChip=true;Eng.subMode='both';Eng.partTitle=g.vi;Eng.rec=false;
  const stepOf=x=>x.tiles?{k:'s',tiles:x.tiles,en:x.en,sub:x.vi,obj:x.obj||undefined}:{k:'n',en:x.en,sub:x.vi,obj:x.obj||undefined};
  const play=async(i)=>{stopAll();const tok=runTok,x=g.ex[i],st=stepOf(x);Eng.resetCur();Eng.show(st);Eng.sp={en:x.en,sub:x.vi,hl:true,t0:performance.now(),dur:estDur(x.en,ST.set.rate)*1000,ci:null};Eng.setTalk('A');
    await say(x.en,{voice:ST.set.voice,rate:ST.set.rate*speedMul,who:'N'});if(tok===runTok){Eng.setTalk(null);if(Eng.sp)Eng.sp.hl=false}};
  box.querySelectorAll('[data-play],[data-3d]').forEach(b=>b.onclick=()=>{play(+(b.dataset.play||b.dataset['3d']));if(b.dataset['3d']!=null)$('#gStage').scrollIntoView({block:'center',behavior:'smooth'})});
  $('#gAll').onclick=async()=>{stopAll();const tok=runTok+1;runTok=tok;for(let i=0;i<g.ex.length;i++){if(tok!==runTok)return;const x=g.ex[i];Eng.resetCur();Eng.show(stepOf(x));Eng.sp={en:x.en,sub:x.vi,hl:true,t0:performance.now(),dur:estDur(x.en,ST.set.rate)*1000,ci:null};Eng.setTalk('A');await say(x.en,{voice:ST.set.voice,rate:ST.set.rate*speedMul,who:'N'});Eng.setTalk(null);if(tok!==runTok)return;await wait(500)}};
  Eng.resetCur();if(g.ex.length){const x=g.ex[0];Eng.show(stepOf(x));Eng.sp={en:x.en,sub:x.vi,hl:false}}
  $('#gLearn').onclick=()=>{if(ST.gr[g.id])delete ST.gr[g.id];else{ST.gr[g.id]=1;addXP(5)}save();checkBadges();gramOpen(id)};
  const runGq=(pool)=>{Eng.setTalk(null);mcRun(box,pool.map(mkq).map(q=>Object.assign(q,{speak:null})),{title:g.t,back:()=>gramOpen(id),onDone:(ok,n)=>{if(ok===n&&!ST.gr[g.id]){ST.gr[g.id]=1;addXP(8);save()}}})};
  const qb=$('#gQuiz');if(qb)qb.onclick=()=>runGq(shuffle(g.q.slice()).slice(0,10));
  const qa=$('#gQuizAll');if(qa)qa.onclick=()=>runGq(shuffle(g.q.slice()));
  $('#gNext').onclick=()=>{const i=GRAM.findIndex(x=>x.id===id);gramOpen(GRAM[(i+1)%GRAM.length].id);window.scrollTo({top:0})};
  window.scrollTo({top:0});
}
/* động từ bất quy tắc */
let irrQ='';
function irrView(box){
  box.insertAdjacentHTML('beforeend','<div class="tools"><input type="search" id="iQ" placeholder="Tìm động từ hoặc nghĩa…" value="'+esc(irrQ)+'" aria-label="Tìm động từ"><button class="btn" id="iDrill">Luyện tập</button></div><p class="muted" style="font-size:13px">'+IRR.length+' động từ. Bấm loa để nghe V1, V2, V3. Đánh dấu ô vuông khi bạn đã thuộc ('+Object.keys(ST.irr).length+' đã thuộc).</p><div class="tw"><table class="irr"><thead><tr><th class="k"></th><th>V1</th><th>V2</th><th>V3</th><th>Nghĩa</th><th></th></tr></thead><tbody id="iBody"></tbody></table></div>');
  const draw=()=>{const q=irrQ.toLowerCase();$('#iBody').innerHTML=IRR.filter(r=>!q||(r.v1+' '+r.v2+' '+r.v3+' '+r.vi).toLowerCase().indexOf(q)>=0).map(r=>'<tr><td class="k"><input type="checkbox" data-k="'+r.v1+'" '+(ST.irr[r.v1]?'checked':'')+' aria-label="Đã thuộc '+r.v1+'"></td><td>'+r.v1+'</td><td>'+r.v2+'</td><td>'+r.v3+'</td><td>'+esc(r.vi)+'</td><td><button class="ib" data-s="'+r.v1+'" style="width:34px;height:34px" aria-label="Nghe">'+IC.spk+'</button></td></tr>').join('')};
  draw();
  $('#iQ').oninput=e=>{irrQ=e.target.value;draw()};
  $('#iBody').onclick=e=>{const b=e.target.closest('button[data-s]');if(b){const r=IRR.find(x=>x.v1===b.dataset.s);speakNow(r.v1+'. '+r.v2.split('/')[0]+'. '+r.v3.split('/')[0]);return}
    const c=e.target.closest('input[data-k]');if(c){if(c.checked)ST.irr[c.dataset.k]=1;else delete ST.irr[c.dataset.k];save()}};
  $('#iDrill').onclick=()=>{
    const pick=shuffle(IRR).slice(0,10),qs=pick.map((r,i)=>{const two=i%2===0,key=two?'v2':'v3',ans=r[key].split('/')[0];
      const d=shuffle(IRR.filter(x=>x.v1!==r.v1&&x[key].split('/')[0]!==ans)).slice(0,3).map(x=>x[key].split('/')[0]);
      return{q:(two?'Quá khứ đơn (V2)':'Quá khứ phân từ (V3)')+' của “'+r.v1+'” ('+r.vi+') là gì?',opts:shuffle([{t:ans,ok:true}].concat(d.map(t=>({t:t,ok:false})))),why:r.v1+' – '+r.v2+' – '+r.v3,speak:ans}});
    mcRun($('#gramBox'),qs,{title:'Luyện động từ bất quy tắc',back:gramHome,onDone:(ok,n)=>{addXP(ok*2)}});
  };
}

/* ================= ĐỌC HIỂU ================= */
EXT.read=()=>readHome();
function readHome(){
  const box=$('#readBox');stopAll();
  box.innerHTML='<h2>Đọc hiểu</h2><p class="muted">'+READ.length+' bài đọc từ A1 đến C2. Chạm vào từ bất kỳ để xem nghĩa. Đã làm đúng hết: '+Object.keys(ST.rd).length+' bài.</p>';
  const t=el('div','tools');filterBar(t,'rdlv',readHome);box.appendChild(t);
  const f=ST.set.rdlv||'all';
  READ.filter(r=>f==='all'||r.lv===f).forEach(r=>{const b=el('button','rdcard'+(ST.rd[r.id]?' done':''),'<span class="em">'+r.e+'</span><div style="min-width:0"><b>'+esc(r.t)+'</b><span>'+esc(r.vi)+' · '+r.text.split(/\s+/).length+' từ</span></div><span class="'+lvCls(r.lv)+'" style="margin-left:auto">'+r.lv+'</span>');b.onclick=()=>readOpen(r.id);box.appendChild(b)});
}
function sentSplit(text){return text.match(/[^.!?]+[.!?]*["”]?\s*/g)||[text]}
function readOpen(id){
  const r=READ.find(x=>x.id===id),box=$('#readBox');stopAll();
  const sents=sentSplit(r.text);
  const html=sents.map((s,i)=>'<span class="s" data-i="'+i+'">'+s.replace(/[A-Za-z][A-Za-z'’\-]*/g,m=>'<span class="wd">'+m+'</span>')+'</span>').join('');
  box.innerHTML=backBtn('Danh sách bài')+'<div class="gh"><div><span class="'+lvCls(r.lv)+'">'+r.lv+'</span><h2>'+r.e+' '+esc(r.t)+'</h2><p class="muted" style="font-weight:700">'+esc(r.vi)+'</p></div></div>'
   +'<div class="rdtext" id="rdText"><p>'+html+'</p></div>'
   +'<div class="row"><button class="btn alt" id="rdRead">'+IC.spk.replace('<svg','<svg width="18" height="18"')+' Nghe đọc cả bài</button><button class="btn alt" id="rdStop">Dừng</button><button class="btn alt" id="rdGist">Xem tóm tắt tiếng Việt</button></div>'
   +'<p class="muted mt" id="rdG" hidden></p>'
   +'<p class="muted mt" style="font-size:13px">Mẹo: chạm vào một từ để xem nghĩa. Bôi đen cả câu để dịch.</p>'
   +'<div class="row mt"><button class="btn" id="rdQuiz">Làm bài đọc hiểu ('+r.q.length+' câu)</button><button class="btn alt" id="rdNext">Bài tiếp theo</button></div>';
  $('#bkBtn').onclick=readHome;
  $('#rdG').textContent=r.gist;
  $('#rdGist').onclick=()=>{const g=$('#rdG');g.hidden=!g.hidden};
  $('#rdText').onclick=e=>{const w=e.target.closest('.wd');if(w){showTip(w.textContent,w)}};
  $('#rdRead').onclick=async()=>{stopAll();const tok=runTok,ss=[...box.querySelectorAll('.s')];for(let i=0;i<ss.length;i++){if(tok!==runTok)break;ss.forEach(x=>x.classList.remove('on'));ss[i].classList.add('on');await speakLine(sents[i].trim(),'N',null,speedMul);}ss.forEach(x=>x.classList.remove('on'))};
  $('#rdStop').onclick=()=>{stopAll();box.querySelectorAll('.s').forEach(x=>x.classList.remove('on'))};
  $('#rdQuiz').onclick=()=>{stopAll();mcRun(box,r.q.map(mkq),{title:r.t,speakAfter:false,back:()=>readOpen(id),onDone:(ok,n)=>{if(ok===n){if(!ST.rd[id]){ST.rd[id]=1;addXP(10)}}else addXP(ok*2);save();checkBadges()}})};
  $('#rdNext').onclick=()=>{const f=ST.set.rdlv||'all',L=READ.filter(x=>f==='all'||x.lv===f),i=L.findIndex(x=>x.id===id);readOpen(L[(i+1)%L.length].id);window.scrollTo({top:0})};
  window.scrollTo({top:0});
}

/* ================= NGHE HIỂU ================= */
let lMode='text',lSpeed=1;
EXT.listen=()=>listenHome();
function listenHome(){
  const box=$('#listenBox');stopAll();
  box.innerHTML='<h2>Nghe hiểu</h2><p class="muted">'+LISTEN.length+' bài nghe. Có 3 chế độ: chỉ nghe, hiện chữ, và karaoke tô sáng từng từ. Đã làm đúng hết: '+Object.keys(ST.lis).length+' bài.</p>';
  const t=el('div','tools');filterBar(t,'lslv',listenHome);box.appendChild(t);
  const f=ST.set.lslv||'all';
  LISTEN.filter(r=>f==='all'||r.lv===f).forEach(r=>{const b=el('button','rdcard'+(ST.lis[r.id]?' done':''),'<span class="em">'+r.e+'</span><div style="min-width:0"><b>'+esc(r.t)+'</b><span>'+esc(r.vi)+' · '+r.lines.length+' lượt nói</span></div><span class="'+lvCls(r.lv)+'" style="margin-left:auto">'+r.lv+'</span>');b.onclick=()=>listenOpen(r.id);box.appendChild(b)});
}
function listenOpen(id){
  const r=LISTEN.find(x=>x.id===id),box=$('#listenBox');stopAll();
  const modes=[['audio','Chỉ nghe'],['text','Hiện chữ'],['kara','Karaoke']],spd=[[.7,'Chậm'],[1,'Bình thường'],[1.3,'Nhanh']];
  const draw=()=>{
    const body=lMode==='audio'?'<div class="kara"><p class="muted" style="font-size:16px">Chỉ nghe, chữ đang ẩn. Hãy lắng nghe, rồi trả lời câu hỏi. Muốn kiểm tra lại thì chuyển sang “Hiện chữ”.</p></div>'
      :'<div class="kara" id="lsText">'+r.lines.map((l,i)=>'<p data-i="'+i+'" style="cursor:pointer">'+(l.who==='N'?'':'<b>'+l.who+': </b>')+(lMode==='kara'?wordSpans(l.text):esc(l.text))+'</p>').join('')+'</div>';
    box.innerHTML=backBtn('Danh sách bài')+'<div class="gh"><div><span class="'+lvCls(r.lv)+'">'+r.lv+'</span><h2>'+r.e+' '+esc(r.t)+'</h2><p class="muted" style="font-weight:700">'+esc(r.vi)+'</p></div></div>'
     +'<div class="tools"><div class="seg2" id="lsModes"></div><div class="seg2" id="lsSpd"></div></div>'
     +'<div class="audbig"><button class="ib big" id="lsPlay" aria-label="Nghe">'+IC.play+'</button><span class="eq" id="lsEq"><i></i><i></i><i></i><i></i></span><span class="muted" id="lsStat">Bấm nút để nghe.</span></div>'+body
     +'<div class="row mt"><button class="btn" id="lsQuiz">Trả lời câu hỏi ('+r.q.length+' câu)</button><button class="btn alt" id="lsNext">Bài tiếp theo</button></div>';
    modes.forEach(m=>{const b=el('button',lMode===m[0]?'on':'',m[1]);b.onclick=()=>{lMode=m[0];stopAll();draw()};$('#lsModes').appendChild(b)});
    spd.forEach(m=>{const b=el('button',lSpeed===m[0]?'on':'',m[1]);b.onclick=()=>{lSpeed=m[0];stopAll();draw()};$('#lsSpd').appendChild(b)});
    $('#bkBtn').onclick=listenHome;
    let playing=false;
    const setP=on=>{playing=on;$('#lsPlay').innerHTML=on?IC.pause:IC.play;$('#lsEq').classList.toggle('on',on);$('#lsStat').textContent=on?'Đang phát…':'Bấm nút để nghe.'};
    const playFrom=async(start)=>{stopAll();const tok=runTok;setP(true);auInit();
      const ps=[...box.querySelectorAll('#lsText p')];
      for(let i=start;i<r.lines.length;i++){if(tok!==runTok)return;const l=r.lines[i],pe=ps[i];ps.forEach(p=>p.querySelectorAll('.w').forEach(w=>w.classList.remove('cur','past')));
        await speakLine(l.text,l.who,lMode==='kara'&&pe?ci=>markProg(pe,ci):null,lSpeed);if(tok!==runTok)return;if(pe)markProg(pe,9999);await wait(450/lSpeed)}
      if(tok===runTok)setP(false)};
    $('#lsPlay').onclick=()=>{if(playing){stopAll();setP(false)}else playFrom(0)};
    box.querySelectorAll('#lsText p').forEach(p=>p.onclick=()=>{if(!window.getSelection().toString())playFrom(+p.dataset.i)});
    $('#lsQuiz').onclick=()=>{stopAll();mcRun(box,r.q.map(mkq),{title:r.t,speakAfter:false,back:()=>listenOpen(id),onDone:(ok,n)=>{if(ok===n){if(!ST.lis[id]){ST.lis[id]=1;addXP(10)}}else addXP(ok*2);save();checkBadges()}})};
    $('#lsNext').onclick=()=>{const f=ST.set.lslv||'all',L=LISTEN.filter(x=>f==='all'||x.lv===f),i=L.findIndex(x=>x.id===id);listenOpen(L[(i+1)%L.length].id);window.scrollTo({top:0})};
  };
  draw();window.scrollTo({top:0});
}

/* ================= TỪ ĐIỂN ================= */
EXT.dict=()=>dictHome();
function dictCardHTML(e,note,q){
  return '<div class="dres"><h3>'+esc(e.w)+' <button class="ib" id="dSpk" aria-label="Nghe">'+IC.spk+'</button>'+(e.pos?'<span class="pos">'+esc(e.pos)+'</span>':'')+'</h3><div class="mean">'+esc(e.vi)+'</div>'
   +(note?'<p class="muted mt" style="font-size:14px">'+esc(note)+'</p>':'')+(e.forms?'<p class="exs">'+esc(e.forms)+'</p>':'')+(e.ex?'<p class="exs">Ví dụ: <b>'+esc(e.ex)+'</b></p>':'')
   +'<div class="row mt"><button class="btn'+(ST.dict[e.w.toLowerCase()]?' alt':'')+'" id="dSave">'+(ST.dict[e.w.toLowerCase()]?'Bỏ khỏi sổ từ':'Lưu vào sổ từ')+'</button></div></div>';
}
function dictHome(q){
  const box=$('#dictBox');
  box.innerHTML='<h2>Từ điển</h2><p class="muted">Gõ một từ tiếng Anh để xem nghĩa và nghe đọc. Gõ tiếng Việt để tra ngược. Từ điển chạy ngay trên máy, không cần mạng.</p>'
   +'<div class="tools"><input type="text" id="dQ" placeholder="Nhập từ, ví dụ: went, beautiful, nhà…" autocomplete="off" aria-label="Từ cần tra"><button class="btn" id="dGo">Tra từ</button></div><div class="sugg" id="dSug"></div><div id="dRes"></div>'
   +'<h3 class="mt">Sổ từ của bạn <span class="muted" style="font-size:14px">('+Object.keys(ST.dict).length+')</span></h3><div class="gloss" id="dSaved"></div>';
  const saved=$('#dSaved');Object.keys(ST.dict).sort().forEach(k=>{const b=el('button','', '<b>'+esc(k)+'</b> · '+esc(ST.dict[k]));b.style.cssText='padding:5px 11px;border-radius:12px;background:var(--surface2);font-size:14px';b.onclick=()=>{$('#dQ').value=k;doLookup(k)};saved.appendChild(b)});
  if(!Object.keys(ST.dict).length)saved.innerHTML='<span class="muted">Chưa có từ nào. Tra một từ rồi bấm “Lưu vào sổ từ”.</span>';
  const inp=$('#dQ');
  const doLookup=w=>{
    w=(w||inp.value).trim();const out=$('#dRes');if(!w){out.innerHTML='';return}
    if(isVi(w)||!/^[A-Za-z'\- ]+$/.test(w)){const rv=dictReverse(w);out.innerHTML=rv.length?'<div class="dres"><b>Từ tiếng Anh tương ứng với “'+esc(w)+'”:</b><div class="sugg">'+rv.map(x=>'<button data-w="'+esc(x.w)+'">'+esc(x.w)+' · '+esc(x.vi)+'</button>').join('')+'</div></div>':'<div class="dres">Chưa có kết quả cho “'+esc(w)+'” trong từ điển ngoại tuyến.</div>';
      out.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.w;doLookup(b.dataset.w)});return}
    const r=dictLookup(w);
    if(r){out.innerHTML=dictCardHTML(r.e,r.note);$('#dSpk').onclick=()=>speakNow(r.e.w);
      $('#dSave').onclick=()=>{const k=r.e.w.toLowerCase();if(ST.dict[k])delete ST.dict[k];else{ST.dict[k]=r.e.vi;addXP(1)}save();checkBadges();dictHome();inp2(w)}}
    else{out.innerHTML='<div class="dres"><b>Chưa có “'+esc(w)+'” trong từ điển ngoại tuyến.</b><p class="muted mt" style="font-size:14px">Bạn có thể nhờ Claude giải thích. Từ này sẽ được gửi cho Claude (lần đầu có hỏi quyền).</p><div class="row mt"><button class="btn" id="dAsk">Hỏi Claude</button><button class="ib" id="dSpk2" aria-label="Nghe">'+IC.spk+'</button></div><p class="mt" id="dAns"></p></div>';
      $('#dSpk2').onclick=()=>speakNow(w);$('#dAsk').onclick=async()=>{const a=$('#dAns');a.textContent='Đang hỏi…';const t=await claudeTranslate('Giải thích ngắn gọn từ tiếng Anh “'+w+'” bằng tiếng Việt: loại từ, nghĩa chính và một câu ví dụ có dịch. Không thêm lời dẫn.');a.textContent=t||'Không hỏi được Claude lúc này.'}}
  };
  const inp2=w=>{const n=$('#dQ');n.value=w;doLookup(w)};
  $('#dGo').onclick=()=>doLookup();
  inp.onkeydown=e=>{if(e.key==='Enter')doLookup()};
  inp.oninput=()=>{const s=dictSuggest(inp.value,8);$('#dSug').innerHTML=s.map(x=>'<button>'+esc(x)+'</button>').join('');$('#dSug').querySelectorAll('button').forEach(b=>b.onclick=()=>{inp.value=b.textContent;doLookup(b.textContent)})};
  if(q){inp.value=q;doLookup(q)}
}
async function claudeTranslate(prompt){
  try{const sm=window.claude&&window.claude.use?await window.claude.use('sample'):null;if(!sm){toast('Tính năng hỏi Claude chưa dùng được ở đây');return null}
    const r=await sm(prompt,{modelTier:'quick',cache:false});return (r&&r.text||'').trim()||null}catch(e){if(e&&e.code==='not_granted')toast('Bạn đã từ chối quyền hỏi Claude');return null}
}

/* ================= DỊCH NỔI KHI BÔI CHỌN ================= */
let tipFor='';
function translateLocal(text){
  const t=text.trim();
  if(isVi(t)){const rv=dictReverse(t);return rv.length?{tr:rv.map(x=>x.w).join(', '),meta:'Tra ngược Việt → Anh',words:[]}:{tr:'',meta:'Chưa có trong từ điển ngoại tuyến.',words:[]}}
  const ws=t.match(/[A-Za-z][A-Za-z'’\-]*/g)||[];
  if(!ws.length)return null;
  if(ws.length===1){const r=dictLookup(ws[0]);return r?{tr:r.e.vi,meta:[r.e.pos,r.note,r.e.forms].filter(Boolean).join(' · '),words:[]}:{tr:'',meta:'Chưa có trong từ điển ngoại tuyến.',words:[]}}
  const c=CORPUS[nrm(t)];
  const gl=[];ws.forEach(w=>{const r=dictLookup(w);if(r&&gl.findIndex(x=>x[0]===w.toLowerCase())<0)gl.push([w.toLowerCase(),r.e.vi])});
  if(c)return{tr:c,meta:'Câu có trong bài học',words:gl.slice(0,10)};
  return{tr:'',meta:'Câu này chưa có bản dịch sẵn. Dưới đây là nghĩa từng từ.',words:gl.slice(0,12)};
}
function hideTip(){const t=$('#selTip');t.hidden=true;tipFor=''}
function showTip(text,anchor){
  if(ST.set.sel===false&&!anchor)return;
  text=text.trim();if(!text||text.length>500)return;
  const tip=$('#selTip'),res=translateLocal(text);if(!res)return hideTip();
  tipFor=text;
  tip.innerHTML='<div class="o">'+esc(text.length>120?text.slice(0,120)+'…':text)+'</div>'+(res.tr?'<div class="t" id="tipT">'+esc(res.tr)+'</div>':'')+'<div class="m">'+esc(res.meta)+'</div>'
   +(res.words.length?'<div class="gloss" style="margin-top:6px">'+res.words.map(x=>'<span style="font-size:12.5px;padding:3px 8px"><b>'+esc(x[0])+'</b>: '+esc(x[1])+'</span>').join('')+'</div>':'')
   +'<div class="r"><button data-a="say">Nghe</button><button class="p" data-a="copy">Chép bản dịch</button><button data-a="copyo">Chép gốc</button>'+(!isVi(text)&&text.split(/\s+/).length>1&&!res.tr?'<button class="p" data-a="ai">Dịch bằng Claude</button>':'')+'<button data-a="x">Đóng</button></div>';
  tip.hidden=false;
  let rect=anchor?anchor.getBoundingClientRect():(window.getSelection().rangeCount?window.getSelection().getRangeAt(0).getBoundingClientRect():null);
  if(!rect||(!rect.width&&!rect.height))rect={left:20,bottom:80,top:60};
  const w=tip.offsetWidth,vw=document.documentElement.clientWidth;
  let left=Math.max(8,Math.min(rect.left+scrollX,scrollX+vw-w-8)),top=rect.bottom+scrollY+8;
  if(rect.bottom+tip.offsetHeight+16>innerHeight&&rect.top>tip.offsetHeight+16)top=rect.top+scrollY-tip.offsetHeight-8;
  tip.style.left=left+'px';tip.style.top=top+'px';
  tip.onmousedown=e=>e.stopPropagation();
  tip.onclick=async e=>{const b=e.target.closest('button[data-a]');if(!b)return;const a=b.dataset.a;
    const cp=async s=>{try{await navigator.clipboard.writeText(s);toast('Đã sao chép')}catch(err){const ta=document.createElement('textarea');ta.value=s;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Đã sao chép')}catch(e2){toast('Không sao chép được, hãy bôi đen và chép thủ công')}ta.remove()}};
    if(a==='say')speakNow(isVi(text)?(res.tr||''):text);
    else if(a==='copy')cp((tip.querySelector('#tipT')||{}).textContent||text);
    else if(a==='copyo')cp(text);
    else if(a==='x')hideTip();
    else if(a==='ai'){b.textContent='Đang dịch…';const t=await claudeTranslate('Dịch sang tiếng Việt, chỉ trả lời bản dịch, không giải thích: '+text);if(t){res.tr=t;res.meta='Bản dịch bởi Claude';showTip(text,anchor)}else b.textContent='Dịch bằng Claude'}};
}
function onSel(e){
  if(ST.set.sel===false)return;
  if(e&&e.target&&e.target.closest&&e.target.closest('#selTip,input,textarea,select,#setModal'))return;
  setTimeout(()=>{
    const s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount)return;
    const t=s.toString().trim();if(!t||t.length>500)return;
    const n=s.anchorNode&&(s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentElement);if(n&&n.closest&&n.closest('#selTip,.stagebox,input,textarea'))return;
    if(t===tipFor&&!$('#selTip').hidden)return;
    showTip(t,null);
  },30);
}
document.addEventListener('mouseup',onSel);document.addEventListener('touchend',onSel);document.addEventListener('keyup',e=>{if(e.shiftKey)onSel(e)});
document.addEventListener('mousedown',e=>{if(!e.target.closest('#selTip'))hideTip()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip()});
window.addEventListener('scroll',()=>{},{passive:true});
try{if(!(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia)||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)){const r=document.getElementById('stTabRow');if(r)r.style.display='none'}}catch(e){}
try{tabRowVis()}catch(e){}
