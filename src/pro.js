'use strict';
/* ===== Khóa tính năng Quay video (Pro) bằng key theo thiết bị ===== */
const ZALO='https://zalo.me/g/rvkfzky48olffyggqjk0';
function proDevice(){let d=null;try{d=localStorage.getItem('mimi_dev')}catch(e){}
  if(!d||PRO.norm(d).length!==8){const a=new Uint8Array(8);(window.crypto||{getRandomValues:x=>x.forEach((_,i)=>x[i]=Math.random()*256)}).getRandomValues(a);d=Array.from(a,x=>PRO.AL[x&31]).join('');try{localStorage.setItem('mimi_dev',d)}catch(e){}}
  return d.slice(0,4)+'-'+d.slice(4)}
function proKey(){try{return localStorage.getItem('mimi_pro')||''}catch(e){return ''}}
function proState(){const k=proKey();return k?PRO.check(k,proDevice()):{ok:false,why:'none'}}
function proActive(){return proState().ok}
function proOpen(){
  const m=$('#proModal');$('#proDev').textContent=proDevice();$('#proMsg').textContent='';$('#proKey').value='';
  const s=proState();$('#proMsg').textContent=s.why==='exp'?'Key của bạn đã hết hạn ngày '+PRO.dateOf(s.exp)+'. Vui lòng liên hệ admin để gia hạn.':'';
  m.classList.add('on');
}
function proClose(){$('#proModal').classList.remove('on')}
$('#proLater').onclick=()=>{proClose();go('learn')};
$('#proZalo').onclick=()=>{try{window.open(ZALO,'_blank','noopener')}catch(e){location.href=ZALO}};
$('#proCopy').onclick=()=>{const t=proDevice();try{navigator.clipboard.writeText(t).then(()=>toast('Đã sao chép mã thiết bị'),()=>toast('Mã thiết bị: '+t))}catch(e){toast('Mã thiết bị: '+t)}};
$('#proGo').onclick=()=>{
  const k=$('#proKey').value.trim();if(!k){$('#proMsg').textContent='Hãy nhập key nhé.';return}
  const r=PRO.check(k,proDevice());
  if(r.ok){try{localStorage.setItem('mimi_pro',k)}catch(e){}proClose();toast('Đã mở khóa Quay video. Còn '+r.left+' ngày (đến '+PRO.dateOf(r.exp)+')');go('studio')}
  else $('#proMsg').textContent=({bad:'Key không đúng định dạng.',dev:'Key này không dùng cho thiết bị này. Mỗi key chỉ dùng được trên 1 thiết bị.',exp:'Key đã hết hạn ngày '+PRO.dateOf(r.exp)+'.',early:'Key chưa đến ngày bắt đầu.'})[r.why]||'Key không hợp lệ.';
};
$('#proKey').addEventListener('keydown',e=>{if(e.key==='Enter')$('#proGo').click()});
$('#proModal').addEventListener('click',e=>{if(e.target.id==='proModal')proClose()});
