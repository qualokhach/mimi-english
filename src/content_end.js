'use strict';
/* ===== Hoàn tất: tên cấp theo CEFR, gỡ cấp rỗng, dựng LESSONS ===== */
const CEFR=['A1','A1','A2','A2','B1','B1','B2','B2','C1','C1','C2','C2'];
const LVTITLE=[['Cấp 1 · Khởi động','Từ và câu đầu tiên (A1)'],['Cấp 2 · Cơ bản','Giao tiếp hằng ngày (A1+)'],['Cấp 3 · Sơ cấp','Mua sắm, sở thích, chỉ đường (A2)']];
LVTITLE.forEach((a,i)=>{if(LEVELS[i]){LEVELS[i].t=a[0];LEVELS[i].sub=a[1]}});
while(LEVELS.length&&!LEVELS[LEVELS.length-1].lessons.length)LEVELS.pop();
LEVELS.forEach(lv=>{lv.cefr=CEFR[lv.id-1]});
const LESSONS=[];LEVELS.forEach(lv=>lv.lessons.forEach(l=>{l.lv=lv;LESSONS.push(l)}));
