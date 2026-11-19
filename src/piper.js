'use strict';
/* ===== Giọng AI ngoại tuyến (Piper VITS, nhúng sẵn, không gọi mạng ngoài) ===== */
const PIPER={state:0,p:null,sess:null,map:null,cache:new Map(),pct:0,SR:22050,base:'assets/'};
PIPER.fetchBuf=async function(url,onp){
  const r=await fetch(url);if(!r.ok)throw new Error('HTTP '+r.status+' '+url);
  const total=+r.headers.get('content-length')||0;
  if(!r.body||!total||!onp)return new Uint8Array(await r.arrayBuffer());
  const rd=r.body.getReader(),parts=[];let got=0;
  for(;;){const x=await rd.read();if(x.done)break;parts.push(x.value);got+=x.value.length;onp(got,total)}
  const out=new Uint8Array(got);let o=0;parts.forEach(a=>{out.set(a,o);o+=a.length});return out;
};
PIPER.load=function(onp){
  if(PIPER.p)return PIPER.p;PIPER.state=1;
  PIPER.p=(async()=>{
    if(!window.ort||!window.PHON)throw new Error('thiếu thư viện');
    const B=PIPER.base,cfg=await (await fetch(B+'voice.json')).json();PIPER.map=cfg.map;PIPER.SR=cfg.sr;PIPER.spk=cfg.spk;
    const sizes=cfg.parts.map(p=>p.size),tot=sizes.reduce((a,b)=>a+b,0);let done=0;
    const bufs=[];for(const p of cfg.parts){const base=done;bufs.push(await PIPER.fetchBuf(B+p.name,(g)=>{PIPER.pct=Math.round((base+g)/tot*100);onp&&onp(PIPER.pct)}));done+=p.size}
    const all=new Uint8Array(tot);let o=0;bufs.forEach(b=>{all.set(b,o);o+=b.length});
    ort.env.wasm.wasmPaths=new URL(B,document.baseURI).href;ort.env.wasm.numThreads=1;ort.env.wasm.proxy=false;
    PIPER.sess=await ort.InferenceSession.create(all,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
    PIPER.state=2;return true})();
  PIPER.p.catch(e=>{PIPER.state=-1;PIPER.err=e});return PIPER.p;
};
PIPER.ids=async function(clauses){
  const M=PIPER.map,ids=[M['^']];
  for(const c of clauses){
    if(c.t){const ph=(await window.PHON.phonemize(c.t,'en-us')).join(' ');for(const ch of ph){if(M[ch]!=null){ids.push(M[ch],0)}}}
    if(c.p){const ch=c.p[0];if(M[ch]!=null){ids.push(M[ch],0)}}
  }
  ids.push(M['$']);return ids;
};
PIPER.split=function(text){
  const out=[];const re=/([^,.;:!?]+)([,.;:!?]*)/g;let m;
  while((m=re.exec(text))){const t=m[1].replace(/[“”"()\[\]]/g,' ').replace(/\s+/g,' ').trim(),p=m[2];if(t||p)out.push({t:t,p:p})}
  const sents=[];let cur=[];out.forEach(c=>{cur.push(c);if(/[.!?]/.test(c.p)){sents.push(cur);cur=[]}});if(cur.length)sents.push(cur);
  return sents;
};
PIPER.synth=async function(text,sid,rate){
  await PIPER.load();const S=PIPER.sess,parts=[];let n=0;const sil=Math.floor(PIPER.SR*.22);
  for(const cl of PIPER.split(text)){
    if(!cl.some(c=>c.t))continue;
    if(!cl[cl.length-1].p)cl[cl.length-1].p='.';
    const ids=await PIPER.ids(cl);
    const feeds={input:new ort.Tensor('int64',BigInt64Array.from(ids.map(BigInt)),[1,ids.length]),input_lengths:new ort.Tensor('int64',BigInt64Array.from([BigInt(ids.length)]),[1]),scales:new ort.Tensor('float32',Float32Array.from([.4,1/Math.max(.5,rate||1),.45]),[3]),sid:new ort.Tensor('int64',BigInt64Array.from([BigInt(sid)]),[1])};
    const r=await S.run(feeds);const a=r[Object.keys(r)[0]].data;parts.push(a,new Float32Array(sil));n+=a.length+sil;
  }
  const out=new Float32Array(n);let o=0;parts.forEach(a=>{out.set(a,o);o+=a.length});
  /* cắt khoảng lặng cuối và làm mượt đầu/cuối */
  let end=out.length;while(end>1000&&Math.abs(out[end-1])<.004)end--;end=Math.min(out.length,end+Math.floor(PIPER.SR*.12));
  const res=out.slice(0,end),f=Math.floor(PIPER.SR*.01);for(let i=0;i<f&&i<res.length;i++){res[i]*=i/f;res[res.length-1-i]*=i/f}
  return res;
};
