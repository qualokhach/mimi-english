'use strict';
/* ===== Thẻ ngữ pháp: tất cả các thì, động từ, tình thái, thành phần câu, từ loại, mệnh đề ===== */
const GCATS=[
 {id:'T',t:'Các thì',c:'#3d6bff'},{id:'V',t:'Động từ',c:'#12b886'},{id:'M',t:'Tình thái',c:'#ff8a3d'},
 {id:'S',t:'Câu và thành phần',c:'#e64980'},{id:'P',t:'Từ loại',c:'#7950f2'},{id:'C',t:'Mệnh đề',c:'#15aabf'},{id:'X',t:'Nâng cao',c:'#c2255c'}];
const GRAM=[];
function GR(cat,id,t,vi,lv,def,forms,use,sig,ex,tips,tl,q){
  GRAM.push({cat:cat,id:id,t:t,vi:vi,lv:lv,def:def,forms:forms.split(';'),use:use.split(';'),sig:sig?sig.split(';'):[],
    ex:ex.split(';').map(s=>{const a=s.split('|'),tiles=a[0].indexOf(':')>0&&/:[svoax]\b/.test(a[0]);
      return{tiles:tiles?a[0]:null,en:tiles?a[0].split(' ').map(w=>w.replace(/:[svoax]$/,'').replace(/_/g,' ')).join(' '):a[0],vi:a[1]||'',obj:a[2]||''}}),
    tips:tips?tips.split(';'):[],tl:tl||'',q:q?q.split('§').map(x=>{const p=x.split('|');return{q:p[0],opts:p.slice(1).map(o=>({t:o.replace('*',''),ok:o.indexOf('*')>=0}))}}):[]});
}
/* ---------- CÁC THÌ ---------- */
GR('T','ps','Present Simple','Hiện tại đơn','A1','Dùng cho thói quen, sự thật và lịch trình cố định.',
 '(+) S + V(s/es): She works every day.;(−) S + do/does not + V: She does not work.;(?) Do/Does + S + V? Does she work?',
 'Thói quen lặp lại;Sự thật, chân lý hiển nhiên;Lịch trình cố định (tàu, lớp học)','always, usually, often, sometimes, never;every day / week;on Mondays',
 'I:s work:v every:a day:a|Mình làm việc mỗi ngày|💼;She:s drinks:v tea:o in:x the:x morning:o|Cô ấy uống trà vào buổi sáng|🍵;The:x sun:o rises:v in:x the:x east:o|Mặt trời mọc ở phía đông|🌅',
 'He, she, it: thêm s hoặc es (goes, watches);Trạng từ tần suất đứng trước động từ thường','habit',
 'She ___ to school every day.|goes*|go|going§Water ___ at 100 degrees.|boils*|boil|is boiling');
GR('T','pc','Present Continuous','Hiện tại tiếp diễn','A1','Diễn tả hành động đang xảy ra ngay lúc nói hoặc quanh thời điểm hiện tại.',
 '(+) S + am/is/are + V-ing;(−) S + am/is/are not + V-ing;(?) Am/Is/Are + S + V-ing?',
 'Hành động đang diễn ra lúc nói;Tạm thời, quanh hiện tại;Kế hoạch gần đã sắp xếp','now, right now, at the moment;Look! Listen!;today, this week',
 'I:s am:v reading:v a:x book:o|Mình đang đọc sách|📖;The:x baby:o is:v sleeping:v|Em bé đang ngủ|😴;We:s are:v meeting:v at:x six:a tonight:a|Tối nay 6 giờ chúng mình gặp nhau|🤝',
 'Không dùng với động từ trạng thái: know, like, want, love;Quy tắc thêm ing: make→making, run→running','now',
 'Look! It ___ now.|is raining*|rains|rained§I ___ a book at the moment.|am reading*|read|reads');
GR('T','pp','Present Perfect','Hiện tại hoàn thành','A2','Nối quá khứ với hiện tại: kinh nghiệm, kết quả còn lại, việc vừa xảy ra.',
 '(+) S + have/has + V3;(−) S + have/has not + V3;(?) Have/Has + S + V3?',
 'Kinh nghiệm sống (ever, never);Kết quả ở hiện tại;Việc bắt đầu trong quá khứ, còn đến nay (for, since)','already, yet, just, ever, never;for + khoảng thời gian, since + mốc;so far, recently',
 'I:s have:v visited:v Hue:o|Mình đã từng đến Huế|🏯;She:s has:v just:a finished:v|Cô ấy vừa mới xong|✅;We:s have:v lived:v here:a since:x 2020:o|Chúng mình sống ở đây từ 2020|🏠',
 'Không dùng với mốc quá khứ cụ thể (yesterday, in 2019);Have you ever…? thường dùng để hỏi kinh nghiệm','pperf',
 'I ___ never ___ sushi.|have / eaten*|did / eat|am / eating§She has lived here ___ 2018.|since*|for|ago');
GR('T','ppc','Present Perfect Continuous','Hiện tại hoàn thành tiếp diễn','B1','Nhấn mạnh hành động kéo dài liên tục từ quá khứ đến hiện tại.',
 '(+) S + have/has been + V-ing;(−) S + have/has not been + V-ing;(?) Have/Has + S + been + V-ing?',
 'Việc kéo dài và còn tiếp tục;Việc vừa dừng, thấy dấu hiệu rõ ràng;Nhấn mạnh quá trình, không phải kết quả','for, since, all day;recently, lately;How long…?',
 'I:s have:v been:v waiting:v for:x an:x hour:o|Mình đã chờ cả tiếng rồi|⏳;She:s has:v been:v studying:v since:x morning:o|Cô ấy học từ sáng đến giờ|📚',
 'So sánh: I have read three books (kết quả) và I have been reading all day (quá trình)','ppc',
 'He ___ for two hours.|has been running*|has run|is run');
GR('T','pas','Past Simple','Quá khứ đơn','A1','Dùng cho hành động đã xảy ra và kết thúc ở thời điểm xác định trong quá khứ.',
 '(+) S + V2 / V-ed;(−) S + did not + V;(?) Did + S + V?',
 'Việc đã xong trong quá khứ;Chuỗi hành động nối tiếp;Thói quen trong quá khứ','yesterday, last week, ago;in 2020, when I was a child',
 'I:s visited:v my:x aunt:o yesterday:a|Hôm qua mình thăm dì|👩;He:s went:v to:x school:o by:x bus:o|Cậu ấy đi học bằng xe buýt|🚌;They:s did:v not:v come:v|Họ đã không đến|🚫',
 'Sau did not, did dùng động từ nguyên mẫu (did not go, không phải did not went);Học bảng động từ bất quy tắc','past',
 'Yesterday I ___ a cake.|made*|make|have made§Did she ___ the door?|open*|opened|opens');
GR('T','pasc','Past Continuous','Quá khứ tiếp diễn','A2','Hành động đang diễn ra tại một thời điểm trong quá khứ, hoặc bị một việc khác cắt ngang.',
 '(+) S + was/were + V-ing;(−) S + was/were not + V-ing;(?) Was/Were + S + V-ing?',
 'Đang làm gì lúc 8 giờ tối qua;Việc đang diễn ra thì có việc khác chen vào;Hai việc cùng diễn ra song song','while, when, as;at 8 pm yesterday',
 'I:s was:v cooking:v at:x seven:a|Lúc 7 giờ mình đang nấu ăn|🍳;It:s was:v raining:v when:x we:s left:v|Trời đang mưa khi chúng mình rời đi|🌧️',
 'Việc dài dùng quá khứ tiếp diễn, việc ngắn chen vào dùng quá khứ đơn','pastc',
 'I ___ TV when she called.|was watching*|watched|am watching');
GR('T','papf','Past Perfect','Quá khứ hoàn thành','B1','Việc xảy ra trước một việc khác trong quá khứ.',
 '(+) S + had + V3;(−) S + had not + V3;(?) Had + S + V3?',
 'Việc xảy ra trước một mốc quá khứ;Giải thích nguyên nhân của việc quá khứ;Câu điều kiện loại 3','before, after, by the time;already, just, never (trong quá khứ)',
 'When:x I:s arrived:v the:x train:o had:v left:v|Khi mình đến thì tàu đã đi|🚆;She:s had:v already:a eaten:v|Cô ấy đã ăn rồi|🍽️',
 'Dùng cặp: việc trước = past perfect, việc sau = past simple','pastperf',
 'When I got there, the film ___.|had started*|started|has started');
GR('T','papc','Past Perfect Continuous','Quá khứ hoàn thành tiếp diễn','B2','Nhấn mạnh quá trình kéo dài trước một mốc trong quá khứ.',
 '(+) S + had been + V-ing;(−) S + had not been + V-ing;(?) Had + S + been + V-ing?',
 'Việc kéo dài đến một mốc quá khứ;Giải thích nguyên nhân của tình huống trong quá khứ','for, since, how long;before + mốc quá khứ',
 'She:s had:v been:v crying:v when:x I:s saw:v her:o|Cô ấy đã khóc từ trước khi mình thấy|😢;We:s had:v been:v waiting:v for:x an:x hour:o|Chúng mình đã chờ cả tiếng|⏳',
 'Ít gặp hơn past perfect; thường đi với for/since','pastpc',
 'He was tired because he ___ all day.|had been working*|worked|has worked');
GR('T','fut','Future Simple (will)','Tương lai đơn','A2','Quyết định tức thời, dự đoán, lời hứa và đề nghị.',
 '(+) S + will + V;(−) S + will not (won\'t) + V;(?) Will + S + V?',
 'Quyết định ngay lúc nói;Dự đoán dựa trên ý kiến;Lời hứa, lời đề nghị, lời cảnh báo','tomorrow, next week, soon;I think, probably, perhaps',
 'I:s will:v call:v you:o tonight:a|Tối nay mình sẽ gọi bạn|📞;It:s will:v rain:v tomorrow:a|Ngày mai trời sẽ mưa|🌧️;I:s will:v help:v you:o|Mình sẽ giúp bạn|🤝',
 'Rút gọn: I will = I\'ll, will not = won\'t','future',
 'It is hot. I ___ open the window.|will*|am going|would§She ___ come soon.|will*|are|did');
GR('T','gt','Be going to','Tương lai gần (be going to)','A2','Kế hoạch đã định trước hoặc dự đoán có dấu hiệu rõ ràng.',
 '(+) S + am/is/are going to + V;(−) S + am/is/are not going to + V;(?) Am/Is/Are + S + going to + V?',
 'Dự định, kế hoạch đã có;Dự đoán dựa trên dấu hiệu hiện tại','tonight, next month, this weekend;Look at the clouds!',
 'We:s are:v going:v to:x travel:v next:a month:o|Tháng sau chúng mình sẽ đi du lịch|✈️;Look!:x It:s is:v going:v to:x rain:v|Nhìn kìa! Trời sắp mưa|⛈️',
 'Khác will: going to = đã dự định, will = quyết định tức thời','gt',
 'Look at those clouds! It ___ rain.|is going to*|will|did');
GR('T','futc','Future Continuous','Tương lai tiếp diễn','B1','Việc sẽ đang diễn ra tại một thời điểm trong tương lai.',
 '(+) S + will be + V-ing;(−) S + will not be + V-ing;(?) Will + S + be + V-ing?',
 'Đang làm gì vào lúc này ngày mai;Hỏi lịch trình một cách lịch sự','at this time tomorrow;this time next week',
 'This:x time:o tomorrow:a I:s will:v be:v flying:v to:x Paris:o|Giờ này mai mình đang bay đến Paris|✈️',
 'Dùng để dự đoán việc đang diễn ra ở tương lai','futc',
 'At 9 tomorrow I ___ in a meeting.|will be sitting*|will sit|sit');
GR('T','futp','Future Perfect','Tương lai hoàn thành','B2','Việc sẽ hoàn thành trước một mốc trong tương lai.',
 '(+) S + will have + V3;(−) S + will not have + V3;(?) Will + S + have + V3?',
 'Xong trước một mốc tương lai;Dự đoán việc đã xảy ra','by + mốc tương lai;by the time, before',
 'By:x next:a year:o I:s will:v have:v graduated:v|Đến sang năm mình sẽ tốt nghiệp|🎓',
 'Thường đi với by (vào lúc, trước lúc)','futperf',
 'By 2030 she ___ her degree.|will have finished*|will finish|finishes');
GR('T','futpc','Future Perfect Continuous','Tương lai hoàn thành tiếp diễn','C1','Nhấn mạnh thời lượng của việc kéo dài đến một mốc tương lai.',
 '(+) S + will have been + V-ing;(−) S + will not have been + V-ing;(?) Will + S + have been + V-ing?',
 'Thời gian kéo dài tính đến mốc tương lai','by + mốc, for + khoảng thời gian',
 'By:x June:o I:s will:v have:v been:v working:v here:a for:x ten:o years:o|Đến tháng Sáu mình làm ở đây được mười năm|💼',
 'Rất ít dùng, thường gặp trong văn viết trang trọng','futpc',
 'By May, he ___ for the company for five years.|will have been working*|will work|works');
/* ---------- ĐỘNG TỪ ---------- */
GR('V','tobe','Verb To Be','Động từ to be (am, is, are, was, were)','A1','Động từ quan trọng nhất: là, thì, ở.',
 'I am / You are / He, she, it is;We, you, they are;Quá khứ: I, he, she, it was; you, we, they were',
 'Giới thiệu tên, nghề, tuổi;Nói về vị trí;Miêu tả tính chất','',
 'I:s am:v a:x student:o|Mình là học sinh|🧑‍🎓;She:s is:v tall:a|Cô ấy cao|🦒;They:s were:v at:x home:o|Họ đã ở nhà|🏠','Phủ định: am not, is not (isn\'t), are not (aren\'t);Câu hỏi: đảo to be lên trước chủ ngữ','',
 'My parents ___ teachers.|are*|is|am');
GR('V','dohave','Do, Does, Did, Have, Has','Trợ động từ do/does/did và have/has','A1','Trợ động từ giúp lập câu phủ định, câu hỏi và các thì hoàn thành.',
 'Do/Does/Did + S + V? (câu hỏi);S + do/does/did not + V (phủ định);Have/Has + V3 (hoàn thành)',
 'Do dùng với I, you, we, they;Does dùng với he, she, it;Have to: phải làm gì','',
 'Does:v she:s like:v coffee:o|Cô ấy có thích cà phê không|☕;I:s do:v not:v know:v|Mình không biết|🤷;He:s has:v a:x dog:o|Anh ấy có một con chó|🐶','Sau does/did động từ chính ở dạng nguyên mẫu, không thêm s hay ed','',
 '___ he play football?|Does*|Do|Is');
GR('V','irregular','Irregular Verbs','Động từ bất quy tắc','A2','Động từ không thêm -ed ở quá khứ. Xem bảng đầy đủ ở mục Động từ bất quy tắc.',
 'go – went – gone;eat – ate – eaten;see – saw – seen;write – wrote – written',
 'Học theo nhóm cùng âm;Ôn mỗi ngày 5 động từ;Luyện bằng câu ví dụ','',
 'I:s went:v to:x Hue:o last:a year:o|Năm ngoái mình đến Huế|🏯;She:s has:v written:v a:x letter:o|Cô ấy đã viết một lá thư|✉️','Nhóm giống nhau: sing–sang–sung, ring–rang–rung, drink–drank–drunk;V2 và V3 giống nhau: buy–bought–bought','',
 'Yesterday I ___ a film.|saw*|seen|see');
GR('V','usedto','Used to, Would','Thói quen trong quá khứ','B1','Nói về thói quen hoặc trạng thái đã từng có nhưng không còn nữa.',
 '(+) S + used to + V;(−) S + did not use to + V;(?) Did + S + use to + V?',
 'Thói quen đã bỏ;Trạng thái cũ (would không dùng cho trạng thái)','when I was a child, years ago',
 'I:s used:v to:x live:v in:x Hanoi:o|Mình từng sống ở Hà Nội|🏙️;We:s would:v play:v outside:a every:a day:a|Ngày xưa ngày nào chúng mình cũng chơi ngoài trời|⚽','Khác be used to + V-ing (đã quen với việc gì)','',
 'I ___ play chess, but now I do not.|used to*|am used to|use to');
GR('V','gerinf','Gerund and Infinitive','Danh động từ và nguyên mẫu','B1','Sau một số động từ ta dùng V-ing, sau số khác dùng to + V.',
 'enjoy, avoid, finish, mind + V-ing;want, hope, decide, plan + to V;like, love, start + V-ing hoặc to V',
 'Sau giới từ luôn dùng V-ing;Mục đích dùng to V','',
 'I:s enjoy:v reading:v|Mình thích đọc sách|📖;She:s wants:v to:x travel:v|Cô ấy muốn đi du lịch|🧳;He:s stopped:v smoking:v|Anh ấy bỏ hút thuốc|🚭','stop doing (ngừng hẳn) khác stop to do (dừng lại để làm);remember doing (nhớ đã làm) khác remember to do (nhớ phải làm)','',
 'I enjoy ___ music.|listening*|to listen|listen§She decided ___ abroad.|to study*|studying|study');
GR('V','passive','Passive Voice','Câu bị động','B1','Nhấn mạnh việc được làm, không quan trọng ai làm.',
 'S + be + V3 (+ by agent);Present: is made / Past: was made;Future: will be made / Perfect: has been made',
 'Không biết hoặc không cần nói ai làm;Văn bản khoa học, tin tức','',
 'The:x room:o is:v cleaned:v every:a day:a|Phòng được dọn mỗi ngày|🧹;The:x bridge:o was:v built:v in:x 1990:o|Cây cầu được xây năm 1990|🌉;English:o is:v spoken:v worldwide:a|Tiếng Anh được nói khắp thế giới|🌍','Chuyển: tân ngữ thành chủ ngữ, động từ thành be + V3;Chỉ nội động từ (happen, arrive) thì không có bị động','',
 'The letter ___ yesterday.|was sent*|sent|is sent');
GR('V','causative','Causative: have/get something done','Nhờ người khác làm','B2','Nói ai đó làm việc gì cho mình.',
 'have + O + V3;get + O + V3;have + người + V (nguyên mẫu)',
 'Dịch vụ (cắt tóc, sửa xe);Nhờ vả, thuê người','',
 'I:s had:v my:x hair:o cut:v|Mình đã đi cắt tóc|💇;She:s gets:v her:x car:o repaired:v|Cô ấy mang xe đi sửa|🔧','Khác I cut my hair (tự cắt)','',
 'I am going to ___ my computer fixed.|have*|make|do');
GR('V','reported','Reported Speech','Câu gián tiếp','B1','Thuật lại lời người khác: lùi thì, đổi đại từ và trạng từ chỉ thời gian.',
 'Present → Past: "I am tired" → He said he was tired;Past → Past perfect;will → would, can → could',
 'Tường thuật lời nói;Tường thuật câu hỏi: asked if / whether','now → then, today → that day, tomorrow → the next day',
 'She:s said:v she:s was:v busy:a|Cô ấy nói rằng cô ấy bận|📣;He:s asked:v if:x I:s liked:v tea:o|Anh ấy hỏi mình có thích trà không|🍵','Không cần lùi thì nếu sự thật còn đúng hoặc động từ tường thuật ở hiện tại','',
 'He said, "I am hungry." → He said he ___ hungry.|was*|is|were');
GR('V','cond01','Conditionals 0 and 1','Câu điều kiện loại 0 và 1','A2','Loại 0 cho sự thật luôn đúng, loại 1 cho khả năng có thật ở tương lai.',
 'Loại 0: If + hiện tại, hiện tại;Loại 1: If + hiện tại, will + V;Có thể dùng unless = if … not',
 'Sự thật khoa học;Khả năng có thể xảy ra, lời hứa','if, unless, as soon as',
 'If:x you:s heat:v ice:o it:s melts:v|Nếu làm nóng, đá tan|🧊;If:x it:s rains:v we:s will:v stay:v home:a|Nếu trời mưa, ta sẽ ở nhà|🌧️','Mệnh đề if không dùng will','',
 'If it ___ tomorrow, we will cancel the trip.|rains*|will rain|rained');
GR('V','cond2','Second Conditional','Câu điều kiện loại 2','B1','Tình huống không có thật hoặc khó xảy ra ở hiện tại.',
 'If + quá khứ đơn, would + V;If I were you, I would…;Could / might thay would khi ít chắc chắn',
 'Ước mơ, giả định;Đưa lời khuyên','If I were you, imagine',
 'If:x I:s had:v a:x car:o I:s would:v drive:v|Nếu có xe mình sẽ lái|🚗;If:x I:s were:v you:s I:s would:v go:v|Nếu là bạn mình sẽ đi|🧭','Với to be, người ta thường dùng were cho mọi ngôi','',
 'If I ___ rich, I would travel the world.|were*|am|will be');
GR('V','cond3','Third Conditional','Câu điều kiện loại 3','B2','Tình huống không có thật trong quá khứ, nói về điều tiếc nuối.',
 'If + had + V3, would have + V3;If I had studied, I would have passed;Dùng could have, might have để nhẹ hơn',
 'Tiếc nuối chuyện đã qua;Phê bình, giải thích nguyên nhân','if only, I wish (quá khứ)',
 'If:x I:s had:v known:v I:s would:v have:v called:v|Nếu mình biết thì đã gọi|📞','Không thể thay đổi quá khứ, chỉ tưởng tượng','',
 'If she ___ earlier, she would have caught the bus.|had left*|left|leaves');
GR('V','wish','Wish and If only','Câu ước','B2','Diễn đạt điều mong muốn khác với thực tế.',
 'Hiện tại: wish + quá khứ đơn;Quá khứ: wish + had + V3;Tương lai: wish + would + V',
 'Ước điều không có thật;Phàn nàn về thói quen của người khác','',
 'I:s wish:v I:s had:v more:o time:o|Ước gì mình có nhiều thời gian hơn|⏰;She:s wishes:v she:s had:v studied:v|Cô ấy ước đã học bài|📚','Với to be thường dùng were: I wish I were taller','',
 'I wish I ___ a car.|had*|have|will have');
/* ---------- TÌNH THÁI ---------- */
GR('M','canould','Can and Could','Can và Could','A1','Khả năng, sự cho phép và lời đề nghị.',
 'S + can + V (hiện tại);S + could + V (quá khứ, lịch sự);Can/Could + S + V? (xin phép, nhờ vả)',
 'Khả năng;Xin phép, đề nghị;Khả năng trong quá khứ','',
 'I:s can:v swim:v|Mình biết bơi|🏊;Could:v you:s help:v me:o|Bạn giúp mình được không|🙏;She:s could:v read:v at:x four:o|Cô ấy biết đọc từ năm bốn tuổi|📖','Phủ định: cannot, can\'t, could not','',
 '___ you open the window, please?|Could*|Are|Do');
GR('M','maymight','May and Might','May và Might','A2','Khả năng xảy ra và sự cho phép trang trọng.',
 'S + may / might + V;May I + V? (xin phép lịch sự);might not / may not (có thể không)',
 'Có thể (may ≈ 50%, might ≈ 30%);Xin phép trang trọng','perhaps, maybe',
 'It:s might:v rain:v tonight:a|Tối nay có thể mưa|🌧️;May:v I:s come:v in:x|Cho phép tôi vào được không|🚪','Maybe là trạng từ, may be là hai từ','',
 'Take an umbrella. It ___ rain.|might*|must|can');
GR('M','musthave','Must and Have to','Must và Have to','A2','Sự bắt buộc, cần thiết.',
 'S + must + V (bắt buộc từ người nói);S + have to + V (bắt buộc từ bên ngoài);must not = cấm, do not have to = không cần',
 'Quy định, luật lệ;Suy luận chắc chắn (must be)','',
 'You:s must:v wear:v a:x helmet:o|Bạn phải đội mũ bảo hiểm|⛑️;I:s have:v to:x get:v up:x early:a|Mình phải dậy sớm|⏰','Quá khứ của must/have to là had to','',
 'You ___ park here. It is forbidden.|must not*|do not have to|may');
GR('M','should','Should and Ought to','Should và Ought to','A2','Lời khuyên và điều nên làm.',
 'S + should + V;S + ought to + V;S + should not + V (không nên)',
 'Đưa lời khuyên;Kỳ vọng hợp lý','I think, I suggest',
 'You:s should:v drink:v more:a water:o|Bạn nên uống nhiều nước hơn|💧','Có thể nhẹ hơn: you had better = tốt hơn hết bạn nên','',
 'You look tired. You ___ rest.|should*|must not|can');
GR('M','willwould','Will and Would','Will và Would','A2','Tương lai, lời đề nghị lịch sự và thói quen.',
 'Will you…? (nhờ vả);Would you like…? (mời lịch sự);would + V (giả định, câu điều kiện)',
 'Lịch sự hơn will;Hỏi sở thích','',
 'Would:v you:s like:v some:x tea:o|Bạn dùng trà nhé|🍵;I:s would:v love:v to:x come:v|Mình rất muốn đến|💌','Would like = muốn (lịch sự), like = thích','',
 '___ you like some coffee?|Would*|Do|Are');
GR('M','shall','Shall','Shall','B1','Lời đề nghị và gợi ý.',
 'Shall I + V? (Tôi … nhé?);Shall we + V? (Chúng ta … nhé?)',
 'Gợi ý trực tiếp;Đề nghị giúp','',
 'Shall:v we:s go:v out:a|Chúng ta ra ngoài nhé|🚶;Shall:v I:s open:v the:x door:o|Để tôi mở cửa nhé|🚪','Hay dùng trong tiếng Anh Anh','',
 '___ we start now?|Shall*|Must|Did');
GR('M','modalperf','Modal Perfect','Tình thái hoàn thành','B2','Suy đoán hoặc phê bình về quá khứ.',
 'must have + V3 (chắc là đã);might / may have + V3 (có thể đã);should have + V3 (đáng lẽ nên)',
 'Suy đoán về việc đã qua;Tiếc nuối, trách nhẹ','',
 'He:s must:v have:v left:v|Chắc là anh ấy đã đi rồi|🚪;You:s should:v have:v called:v me:o|Đáng lẽ bạn nên gọi mình|📞','Could have: lẽ ra đã có thể làm','',
 'The ground is wet. It ___ rained.|must have*|should have|can');
GR('M','needdare','Need, Dare and Semi-modals','Need, dare và bán tình thái','C1','Một số động từ vừa như thường vừa như tình thái.',
 'need not + V = không cần;need to + V = cần;dare not / dare to',
 'Không cần thiết;Dám làm','',
 'You:s needn\'t:v hurry:v|Bạn không cần vội|🐢','Trong Anh Mỹ thường dùng do not need to','',
 'You ___ come early. We start late.|do not need to*|must|should');
/* ---------- CÂU VÀ THÀNH PHẦN ---------- */
GR('S','patterns','Basic Sentence Patterns','Cấu trúc câu cơ bản','A1','Câu tiếng Anh thường có chủ ngữ + động từ (+ tân ngữ / bổ ngữ).',
 'S + V: Birds fly.;S + V + O: I read books.;S + V + C: She is happy.;S + V + O + O: He gave me a gift.',
 'Chủ ngữ (S): ai/cái gì;Động từ (V): làm/là;Tân ngữ (O), bổ ngữ (C)','',
 'Birds:s fly:v|Chim bay|🐦;I:s read:v books:o|Mình đọc sách|📚;She:s is:v happy:a|Cô ấy vui|😊','Mỗi câu cần ít nhất chủ ngữ và động từ (trừ câu mệnh lệnh)','',
 'Which is a correct sentence?|She likes music.*|Likes she music.|She music likes.');
GR('S','subobj','Subject and Object','Chủ ngữ và tân ngữ','A1','Chủ ngữ làm hành động, tân ngữ nhận hành động.',
 'Tân ngữ trực tiếp (direct object): I eat rice.;Tân ngữ gián tiếp (indirect): I give her a gift.;Đại từ tân ngữ: me, you, him, her, it, us, them',
 'Chủ ngữ đứng trước động từ;Tân ngữ đứng sau động từ hoặc giới từ','',
 'She:s loves:v him:o|Cô ấy yêu anh ấy|❤️;I:s gave:v her:o a:x book:o|Mình tặng cô ấy một quyển sách|📘','Sau giới từ dùng đại từ tân ngữ: with me, for them','',
 'Please call ___ tomorrow.|me*|I|my');
GR('S','complement','Complements','Bổ ngữ','B1','Bổ ngữ là phần bổ sung ý nghĩa cho chủ ngữ hoặc tân ngữ.',
 'Subject complement: She is a doctor. / He looks tired.;Object complement: We made him captain.;Động từ nối: be, seem, become, look, feel, sound',
 'Bổ ngữ chủ ngữ mô tả chủ ngữ;Bổ ngữ tân ngữ mô tả tân ngữ','',
 'She:s became:v a:x nurse:o|Cô ấy trở thành y tá|👩‍⚕️;The:x soup:o smells:v good:a|Món súp thơm|🍲;They:s elected:v her:o president:o|Họ bầu cô ấy làm chủ tịch|🗳️','Sau động từ nối dùng tính từ, không dùng trạng từ: looks good (không phải looks well)','',
 'The cake smells ___.|delicious*|deliciously|deliciousness');
GR('S','adverbial','Adverbials','Trạng ngữ','B1','Trạng ngữ cho biết thời gian, nơi chốn, cách thức, lý do, mục đích của hành động.',
 'Thời gian: yesterday, in May;Nơi chốn: at home, in the park;Cách thức: quickly, with care;Lý do/mục đích: because of the rain, to learn',
 'Đứng đầu, giữa hoặc cuối câu;Đầu câu thường có dấu phẩy','',
 'Yesterday:a I:s met:v her:o at:x the:x station:o|Hôm qua mình gặp cô ấy ở nhà ga|🚉;He:s drove:v carefully:a|Anh ấy lái xe cẩn thận|🚗','Thứ tự thường gặp: cách thức, nơi chốn, thời gian','',
 'She speaks English ___.|fluently*|fluent|fluency');
GR('S','questions','Question Forms','Các dạng câu hỏi','A1','Yes/No, câu hỏi Wh-, và câu hỏi đuôi.',
 'Yes/No: Do you like tea?;Wh-: What / Where / When / Why / Who / How + trợ động từ + S + V?;Tag: She is happy, isn\'t she?',
 'Hỏi thông tin;Xác nhận điều đã biết','',
 'Where:o do:v you:s live:v|Bạn sống ở đâu|🏠;You:s like:v tea:o don\'t:v you:s|Bạn thích trà đúng không|🍵','Câu hỏi đuôi: khẳng định đuôi phủ định và ngược lại','',
 'You are Tom, ___?|aren\'t you*|do you|are you');
GR('S','negimp','Negatives and Imperatives','Câu phủ định và câu mệnh lệnh','A1','Nói không và ra lệnh, yêu cầu, rủ rê.',
 'Phủ định: S + do/does/did not + V;Mệnh lệnh: V! (Sit down!);Phủ định mệnh lệnh: Do not + V;Rủ rê: Let us + V',
 'Hướng dẫn, ra lệnh;Gợi ý, mời','',
 'Please:a sit:v down:a|Mời ngồi|🪑;Do:v not:v run:v|Đừng chạy|🚫;Let:v us:s go:v|Chúng ta đi nào|🚶','Thêm please để lịch sự hơn','',
 '___ touch the stove! It is hot.|Do not*|Not|Are not');
GR('S','thereit','There is, There are, It','There is/are và chủ ngữ giả it','A1','There giới thiệu sự tồn tại; it làm chủ ngữ giả cho thời tiết, thời gian.',
 'There is + danh từ số ít;There are + danh từ số nhiều;It is raining / It is late / It is easy to learn',
 'Nói có cái gì ở đâu;Thời tiết, thời gian, khoảng cách','',
 'There:s is:v a:x cat:o on:x the:x sofa:o|Có một con mèo trên ghế sofa|🐱;It:s is:v cold:a today:a|Hôm nay trời lạnh|🥶','Động từ hòa hợp với danh từ đứng sau there','',
 'There ___ two books on the table.|are*|is|be');
GR('S','inversion','Inversion','Đảo ngữ','C1','Đảo trợ động từ lên trước chủ ngữ để nhấn mạnh.',
 'Never have I seen…;Not only did he win, but…;Hardly had she left when…;Only after / Only when + trợ động từ + S',
 'Văn viết trang trọng, nhấn mạnh;Sau trạng từ phủ định đứng đầu câu','never, hardly, seldom, rarely, not only',
 'Never:a have:v I:s seen:v such:x a:x view:o|Chưa bao giờ mình thấy cảnh nào như vậy|🏔️','Câu điều kiện đảo: Had I known = If I had known','',
 'Never ___ such a beautiful place.|have I seen*|I have seen|I saw');
GR('S','cleft','Cleft Sentences and Emphasis','Câu chẻ và nhấn mạnh','C1','Tách câu để nhấn mạnh một thành phần.',
 'It is / was + phần nhấn mạnh + that…;What I need is…;The one who…',
 'Nhấn mạnh người, nơi chốn, thời gian;Nhấn mạnh điều cần','',
 'It:s was:v Tom:o who:x broke:v the:x window:o|Chính Tom đã làm vỡ cửa sổ|🪟','Dùng that/who/which sau phần nhấn mạnh','',
 'It was in Hue ___ we met.|that*|what|where');
/* ---------- TỪ LOẠI ---------- */
GR('P','nouns','Nouns: countable and uncountable','Danh từ đếm được và không đếm được','A1','Danh từ đếm được có số nhiều, danh từ không đếm được thì không.',
 'Đếm được: a book, two books;Không đếm được: water, rice, advice, information;Số nhiều bất quy tắc: man–men, child–children, foot–feet',
 'Danh từ đếm được dùng a / an / many / few;Không đếm được dùng much / little / some','',
 'I:s need:v some:x water:o|Mình cần một ít nước|💧;She:s has:v two:o children:o|Cô ấy có hai đứa con|👧👦','Information, advice, furniture không bao giờ thêm s','',
 'I need some ___.|advice*|advices|an advice');
GR('P','articles','Articles','Mạo từ a, an, the','A1','Dùng a/an cho thứ chưa xác định, the cho thứ đã xác định.',
 'a + phụ âm: a book;an + nguyên âm: an apple;the: thứ cụ thể, duy nhất; không dùng mạo từ trước tên riêng hầu hết',
 'Lần đầu nhắc đến dùng a / an;Nhắc lại hoặc duy nhất dùng the','',
 'I:s saw:v a:x dog:o The:x dog:o was:v big:a|Mình thấy một con chó. Con chó đó to|🐕;The:x sun:o is:v hot:a|Mặt trời nóng|☀️','Quyết định theo âm, không theo chữ: an hour, a university','',
 'She is ___ engineer.|an*|a|the');
GR('P','quant','Determiners and Quantifiers','Từ hạn định và lượng từ','A2','Cho biết số lượng: some, any, much, many, a few, a little.',
 'Đếm được: many, a few, few;Không đếm được: much, a little, little;Cả hai: some, any, a lot of, enough',
 'some dùng trong câu khẳng định, any trong phủ định và nghi vấn;few / little = rất ít (ý tiêu cực)','',
 'There:s are:v many:o apples:o|Có nhiều táo|🍎;I:s have:v a:x little:a time:o|Mình có chút thời gian|⏰','a few / a little mang nghĩa tích cực, few / little mang nghĩa tiêu cực','',
 'How ___ money do you have?|much*|many|few');
GR('P','pronouns','Pronouns','Đại từ','A1','Đại từ thay cho danh từ: nhân xưng, sở hữu, phản thân.',
 'Chủ ngữ: I, you, he, she, it, we, they;Tân ngữ: me, you, him, her, it, us, them;Sở hữu: mine, yours, his, hers, ours, theirs;Phản thân: myself, himself, themselves',
 'Tránh lặp danh từ;Phản thân khi chủ ngữ và tân ngữ cùng người','',
 'This:x is:v my:x book:o It:s is:v mine:o|Đây là sách của mình. Nó là của mình|📘;He:s hurt:v himself:o|Anh ấy tự làm đau mình|🤕','my + danh từ, mine đứng một mình','',
 'This bag is ___.|mine*|my|me');
GR('P','adjectives','Adjectives','Tính từ','A1','Tính từ miêu tả danh từ, đứng trước danh từ hoặc sau động từ nối.',
 'Thứ tự: ý kiến – kích cỡ – tuổi – hình dạng – màu – nguồn gốc – chất liệu;-ed: cảm xúc của người (bored);-ing: tính chất của vật (boring)',
 'Miêu tả người, vật;So sánh','',
 'A:x beautiful:a small:a red:a car:o|Một chiếc xe nhỏ màu đỏ rất đẹp|🚗;I:s am:v bored:a|Mình thấy chán|🥱;The:x film:o is:v boring:a|Bộ phim chán|🎬','Tính từ không thêm s ở số nhiều','',
 'The movie was ___.|boring*|bored|bore');
GR('P','adverbs','Adverbs','Trạng từ','A2','Trạng từ bổ nghĩa cho động từ, tính từ hoặc trạng từ khác.',
 'Cách thức: slowly, well;Tần suất: always, never;Mức độ: very, quite, too;Nơi chốn / thời gian: here, now',
 'Hình thành từ tính từ + ly;Một số trạng từ bất quy tắc: good → well, fast → fast','',
 'She:s sings:v beautifully:a|Cô ấy hát rất hay|🎤;I:s often:a visit:v her:o|Mình thường ghé thăm cô ấy|🏠','Tần suất đứng sau to be nhưng trước động từ thường','',
 'He drives very ___.|carefully*|careful|care');
GR('P','comparison','Comparatives and Superlatives','So sánh hơn và so sánh nhất','A2','So sánh hai hay nhiều đối tượng.',
 'Tính từ ngắn: -er / the -est (taller, the tallest);Tính từ dài: more / the most (more beautiful);Bất quy tắc: good–better–best, bad–worse–worst;So sánh bằng: as … as',
 'Hơn: than;Nhất: the + so sánh nhất','',
 'My:x bag:o is:v bigger:a than:x yours:o|Túi mình to hơn túi bạn|👜;She:s is:v the:x tallest:a|Cô ấy cao nhất|🦒','Gấp đôi phụ âm: big → bigger; y → ier: happy → happier','',
 'This book is ___ than that one.|more interesting*|interestinger|most interesting');
GR('P','preptime','Prepositions of Time and Place','Giới từ chỉ thời gian và nơi chốn','A1','At, in, on là ba giới từ quan trọng nhất.',
 'Thời gian: at 5 pm, on Monday, in May;Nơi chốn: at the station (điểm), in a box (bên trong), on the wall (bề mặt);Chuyển động: to, from, into, across, through',
 'at: giờ, điểm cụ thể;on: ngày, thứ;in: tháng, năm, mùa, khoảng thời gian dài','',
 'See:v you:s at:x six:a on:x Friday:a in:x May:a|Hẹn gặp lúc 6 giờ thứ Sáu tháng Năm|🗓️','Cố định: at night, at the weekend (Anh Anh), on time, in time','',
 'My birthday is ___ June.|in*|on|at§The meeting is ___ Monday.|on*|in|at');
GR('P','prepdep','Dependent Prepositions','Giới từ đi kèm','B1','Nhiều động từ và tính từ luôn đi với giới từ nhất định.',
 'depend on, listen to, wait for;good at, afraid of, interested in;different from, famous for, responsible for',
 'Cần học thuộc theo cụm;Sau giới từ dùng danh từ hoặc V-ing','',
 'I:s am:v interested:v in:x music:o|Mình quan tâm đến âm nhạc|🎵;She:s is:v good:a at:x drawing:o|Cô ấy vẽ giỏi|🎨','Tra từ điển khi gặp cụm mới','',
 'He is afraid ___ dogs.|of*|from|at');
GR('P','conj','Conjunctions','Liên từ','A2','Nối từ, cụm từ và mệnh đề.',
 'Đẳng lập: and, but, or, so;Phụ thuộc: because, although, when, if, while;Tương liên: either … or, neither … nor, both … and',
 'and thêm ý, but đối lập, so chỉ kết quả;because chỉ lý do','',
 'I:s was:v tired:a so:x I:s went:v to:x bed:o|Mình mệt nên đi ngủ|🛏️;Although:x it:s rained:v we:s played:v|Dù trời mưa chúng mình vẫn chơi|⚽','although + mệnh đề, despite + danh từ hoặc V-ing','',
 '___ it was raining, we stayed at home.|Because*|Although|But');
/* ---------- MỆNH ĐỀ ---------- */
GR('C','relative','Relative Clauses','Mệnh đề quan hệ','B1','Mệnh đề bổ nghĩa cho danh từ đứng trước nó.',
 'who: người;which: vật;that: người hoặc vật;whose: sở hữu;where: nơi chốn',
 'Xác định (defining): không dùng dấu phẩy;Không xác định (non-defining): có dấu phẩy','',
 'The:x man:o who:x lives:v next:a door:o is:v a:x doctor:o|Người đàn ông sống bên cạnh là bác sĩ|👨‍⚕️;This:x is:v the:x book:o that:x I:s love:v|Đây là quyển sách mình yêu|📘','Có thể bỏ that khi nó là tân ngữ','',
 'The girl ___ sings is my sister.|who*|which|where');
GR('C','nounclause','Noun Clauses','Mệnh đề danh từ','B2','Mệnh đề đóng vai trò danh từ trong câu.',
 'that + mệnh đề: I know that she is kind.;if / whether + mệnh đề: I wonder if he knows.;wh- + mệnh đề: I do not know where she lives.',
 'Làm chủ ngữ, tân ngữ hoặc bổ ngữ;Câu hỏi gián tiếp','',
 'I:s do:v not:v know:v where:x he:s lives:v|Mình không biết anh ấy sống ở đâu|🏠','Trong mệnh đề danh từ dùng trật tự câu khẳng định, không đảo','',
 'Could you tell me where ___?|the station is*|is the station|does the station');
GR('C','advclause','Adverbial Clauses','Mệnh đề trạng ngữ','B1','Mệnh đề chỉ thời gian, lý do, nhượng bộ, mục đích, kết quả.',
 'Thời gian: when, while, after, before;Lý do: because, since, as;Nhượng bộ: although, though, even if;Mục đích: so that, in order to',
 'Có thể đứng đầu hoặc cuối câu;Đầu câu thì dùng dấu phẩy','',
 'When:x I:s arrived:v it:s was:v dark:a|Khi mình đến, trời đã tối|🌙','Không dùng will trong mệnh đề thời gian ở tương lai','',
 'I will call you when I ___ home.|get*|will get|got');
GR('C','participle','Participle Clauses','Mệnh đề phân từ','B2','Rút gọn mệnh đề bằng V-ing hoặc V3.',
 'V-ing: Walking home, I met Tom.;V3: Built in 1990, the bridge is old.;Having + V3: Having finished, she left.',
 'Cùng chủ ngữ với mệnh đề chính;Giúp câu gọn, văn viết trang trọng','',
 'Walking:v home:a I:s saw:v a:x rainbow:o|Đi bộ về nhà, mình thấy cầu vồng|🌈','Chủ ngữ phải trùng, nếu không sẽ sai nghĩa','',
 '___ the letter, she cried.|Reading*|Read|To read');
GR('C','reduced','Reduced Relative Clauses','Mệnh đề quan hệ rút gọn','C1','Bỏ đại từ quan hệ và to be để câu gọn.',
 'The man who is standing there → The man standing there;The book that was written by her → The book written by her',
 'Dùng V-ing cho chủ động;Dùng V3 cho bị động','',
 'The:x girl:o sitting:v there:a is:v my:x friend:o|Cô gái ngồi đằng kia là bạn mình|👧','Chỉ dùng khi đại từ quan hệ là chủ ngữ','',
 'The woman ___ at the door is my aunt.|standing*|stands|stood');
/* ---------- NÂNG CAO ---------- */
GR('X','wordform','Word Formation','Cấu tạo từ','B1','Tạo từ mới bằng tiền tố và hậu tố.',
 'Tiền tố: un-, re-, dis-, pre-;Hậu tố danh từ: -tion, -ment, -ness;Hậu tố tính từ: -ful, -less, -able;Hậu tố trạng từ: -ly',
 'Đoán nghĩa từ mới;Chuyển loại từ','',
 'Happy:a →:x happiness:o|Vui → niềm vui|😊;Care:o →:x careful:a|Sự cẩn thận → cẩn thận|⚠️','un- và dis- tạo nghĩa ngược','',
 'The opposite of "happy" is ___.|unhappy*|dishappy|inhappy');
GR('X','phrasal','Phrasal Verbs','Cụm động từ','B1','Động từ + tiểu từ tạo nghĩa mới.',
 'give up = bỏ cuộc;look after = chăm sóc;turn on / turn off = bật / tắt;put off = trì hoãn',
 'Tách được: turn the light on;Không tách: look after her','',
 'Never:a give:v up:x|Đừng bao giờ bỏ cuộc|🏳️;She:s looks:v after:x her:x baby:o|Cô ấy chăm em bé|👶','Học theo chủ đề, mỗi ngày vài cụm','',
 'Please ___ the TV. It is too loud.|turn off*|turn at|turn in');
GR('X','punct','Punctuation','Dấu câu','A2','Dấu câu giúp câu rõ nghĩa.',
 'Dấu chấm . kết thúc câu;Dấu phẩy , tách ý, liệt kê;Dấu hỏi ? và chấm than !;Nháy đơn \' sở hữu: Tom\'s book',
 'Viết hoa chữ đầu câu và tên riêng;Dùng dấu phẩy trước but, and nối hai mệnh đề','',
 'Let\'s:v eat:v Grandma:o|Cùng ăn nào, bà ơi|👵;Let\'s:v eat:v grandma:o|Cùng ăn bà thôi (sai nghĩa!)|😱','Dấu phẩy có thể thay đổi nghĩa cả câu','',
 'Which is correct?|It is Tom\'s book.*|It is Toms book.|It is Toms\' book.');
GR('X','discourse','Discourse Markers','Từ nối trong văn nói và viết','B2','Từ giúp mạch ý trôi chảy.',
 'Thêm ý: moreover, in addition;Đối lập: however, on the other hand;Kết quả: therefore, as a result;Kết luận: in conclusion, to sum up',
 'Mở bài, thân bài, kết bài rõ ràng;Giúp người nghe theo dõi','',
 'However:a the:x price:o is:v high:a|Tuy nhiên giá cao|💸','Không dùng quá nhiều trong một đoạn','',
 'It was cheap. ___, it was poor quality.|However*|Moreover|Therefore');
GR('X','hedging','Hedging and Politeness','Nói giảm nói tránh và lịch sự','C1','Làm câu mềm mại, thận trọng, nhất là trong học thuật và công việc.',
 'seems to, appears to;It could be argued that…;somewhat, relatively, fairly;I was wondering if you could…',
 'Tránh khẳng định tuyệt đối;Đề nghị khéo léo','',
 'I:s was:v wondering:v if:x you:s could:v help:v me:o|Mình đang tự hỏi bạn có thể giúp mình không|🙏','Dùng thì quá khứ làm lời đề nghị lịch sự hơn','',
 'Which is the most polite?|I was wondering if you could help.*|Help me.|You must help me.');

/* ---------- Động từ bất quy tắc ---------- */
const IRR=`be|was/were|been|thì, là, ở;become|became|become|trở thành;begin|began|begun|bắt đầu;break|broke|broken|làm vỡ;bring|brought|brought|mang đến;build|built|built|xây dựng;buy|bought|bought|mua;catch|caught|caught|bắt, đón;choose|chose|chosen|chọn;come|came|come|đến;cost|cost|cost|có giá;cut|cut|cut|cắt;do|did|done|làm;draw|drew|drawn|vẽ;drink|drank|drunk|uống;drive|drove|driven|lái xe;eat|ate|eaten|ăn;fall|fell|fallen|ngã, rơi;feel|felt|felt|cảm thấy;fight|fought|fought|đánh nhau;find|found|found|tìm thấy;fly|flew|flown|bay;forget|forgot|forgotten|quên;forgive|forgave|forgiven|tha thứ;get|got|got/gotten|có được;give|gave|given|cho;go|went|gone|đi;grow|grew|grown|lớn lên, trồng;have|had|had|có;hear|heard|heard|nghe;hide|hid|hidden|giấu;hit|hit|hit|đánh;hold|held|held|cầm, giữ;hurt|hurt|hurt|làm đau;keep|kept|kept|giữ;know|knew|known|biết;lead|led|led|dẫn dắt;learn|learnt/learned|learnt/learned|học;leave|left|left|rời đi;lend|lent|lent|cho mượn;let|let|let|để cho;lie|lay|lain|nằm;lose|lost|lost|mất, thua;make|made|made|làm ra;mean|meant|meant|có nghĩa;meet|met|met|gặp;pay|paid|paid|trả tiền;put|put|put|đặt;read|read|read|đọc;ride|rode|ridden|cưỡi, đi xe;ring|rang|rung|rung chuông;rise|rose|risen|mọc, tăng;run|ran|run|chạy;say|said|said|nói;see|saw|seen|nhìn thấy;sell|sold|sold|bán;send|sent|sent|gửi;set|set|set|đặt, thiết lập;shake|shook|shaken|lắc;shine|shone|shone|chiếu sáng;shoot|shot|shot|bắn;show|showed|shown|cho xem;shut|shut|shut|đóng;sing|sang|sung|hát;sink|sank|sunk|chìm;sit|sat|sat|ngồi;sleep|slept|slept|ngủ;speak|spoke|spoken|nói;spend|spent|spent|tiêu, dành;stand|stood|stood|đứng;steal|stole|stolen|ăn trộm;swim|swam|swum|bơi;take|took|taken|lấy;teach|taught|taught|dạy;tear|tore|torn|xé;tell|told|told|kể, bảo;think|thought|thought|nghĩ;throw|threw|thrown|ném;understand|understood|understood|hiểu;wake|woke|woken|thức dậy;wear|wore|worn|mặc;win|won|won|thắng;write|wrote|written|viết;bend|bent|bent|uốn cong;bite|bit|bitten|cắn;blow|blew|blown|thổi;burn|burnt/burned|burnt/burned|đốt cháy;dig|dug|dug|đào;feed|fed|fed|cho ăn;hang|hung|hung|treo;lay|laid|laid|đặt xuống;light|lit|lit|thắp sáng;seek|sought|sought|tìm kiếm;sweep|swept|swept|quét;swing|swung|swung|đu đưa;wind|wound|wound|cuộn, lên dây`.split(';').map(s=>{const a=s.split('|');return{v1:a[0],v2:a[1],v3:a[2],vi:a[3]}});
