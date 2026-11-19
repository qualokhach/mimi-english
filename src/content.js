'use strict';
/* ============ Nội dung bài học ============ */
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const art=w=>/^[aeiou]/i.test(w)?'an':'a';
const V=(w,vi,obj,o)=>{o=o||{};return Object.assign({k:'v',pic:true,w:w,vi:vi,obj:obj,en:cap(w)+'. '+(o.s||('This is '+art(w)+' '+w+'.')),sub:cap(vi)+'. '+(o.vs||('Đây là '+vi+'.'))},o)};
const W=(w,vi,o)=>Object.assign({k:'v',w:w,vi:vi},o);
const N=(en,sub,o)=>Object.assign({k:'n',en:en,sub:sub},o||{});
const D=(who,en,sub,o)=>Object.assign({k:'d',who:who,en:en,sub:sub},o||{});
const S=(tiles,sub,o)=>{const en=tiles.split(' ').map(t=>t.slice(0,t.lastIndexOf(':')).replace(/_/g,' ')).join(' ');return Object.assign({k:'s',tiles:tiles,en:/[.!?]$/.test(en)?en:en+'.',sub:sub},o||{})};
const PP=(w,vi,en,sub,tiles)=>({k:'v',pic:true,w:w,vi:vi,prep:w,en:en,sub:sub,tiles:tiles});
const P=(name,vi,steps)=>({name:name,vi:vi,steps:steps});
const FAM={mother:{tint:'#ff7aa8',hair:'#5a3a22',long:true},father:{tint:'#3d6bff',hair:'#2b2b2b'},brother:{scale:.8,tint:'#12b886',hair:'#4a2c14'},sister:{scale:.8,long:true,tint:'#fcc419',hair:'#7a3b12'},baby:{scale:.5,tint:'#ffa8a8',hair:'#7a3b12'},grandmother:{glasses:true,hair:'#dcdcdc',tint:'#9775fa',scale:.95}};
const COL={red:'#ef4444',blue:'#3b82f6',green:'#22c55e',yellow:'#facc15',orange:'#fb923c',purple:'#a855f7',pink:'#f472b6',black:'#1f2937'};
const CV=(w,vi)=>V(w,'màu '+vi,'ball',{tint:COL[w],s:'The ball is '+w+'.',vs:'Quả bóng màu '+vi+'.'});
const NUM=(w,n,vi)=>V(w,'số '+n,'star',{n:n,big:String(n),s:(n===1?'One star.':cap(w)+' stars.'),vs:vi+' ngôi sao.'});
const ACT=(w,ing,vi,vs,act)=>({k:'v',w:w,vi:vi,act:act,tiles:'I:s am:v '+ing+':v',en:cap(w)+'. I am '+ing+'.',sub:cap(vi)+'. '+vs});

const LEVELS=[
 {id:1,t:'Cấp 1 · Khởi động',sub:'Từ vựng và câu đầu tiên (Pre-A1)',c:'#12b886',lessons:[
  {id:'hello',t:'Hello!',vi:'Chào hỏi và làm quen',theme:'meadow',icon:{obj:'heart'},parts:[
   P('Lời chào','Xin chào và tạm biệt',[
    N('Welcome to Mimi English! I am Mimi. Let us learn together!','Chào mừng đến với Mimi English! Mình là Mimi. Cùng học nhé!',{act:'wave',card:'Welcome!'}),
    W('hello','xin chào',{en:'Hello! We say hello when we meet someone.',sub:'Hello là xin chào. Ta nói hello khi gặp ai đó.',tiles:'Hello!:x',act:'wave'}),
    W('goodbye','tạm biệt',{en:'Goodbye! We say goodbye when we leave.',sub:'Goodbye là tạm biệt. Ta nói khi chia tay.',tiles:'Goodbye!:v',act:'wave'}),
    W('good morning','chào buổi sáng',{en:'Good morning! We say it in the morning.',sub:'Good morning là chào buổi sáng.',tiles:'Good:a morning:o',obj:'sun'}),
    W('good night','chúc ngủ ngon',{en:'Good night! We say it before we sleep.',sub:'Good night là chúc ngủ ngon.',tiles:'Good:a night:o',obj:'moon'})]),
   P('Lịch sự','Cảm ơn và xin lỗi',[
    W('thank you','cảm ơn',{en:'Thank you! We say it when someone helps us.',sub:'Thank you là cảm ơn. Ta nói khi được giúp đỡ.',tiles:'Thank:s you!:s',obj:'heart'}),
    W('sorry','xin lỗi',{en:'Sorry! We say it when we make a mistake.',sub:'Sorry là xin lỗi. Ta nói khi mắc lỗi.',tiles:'Sorry!:v'}),
    W('please','làm ơn',{en:'Please! It is a polite word when we ask for something.',sub:'Please là làm ơn, dùng khi nhờ ai đó một cách lịch sự.',tiles:'Please:a'}),
    N('Now you know seven useful words. Great job!','Vậy là bạn đã biết bảy từ hữu ích rồi. Giỏi lắm!',{act:'jump',card:'Great job!'})]),
   P('Hội thoại','Làm quen với bạn mới',[
    D('A','Hello! My name is Mimi.','Xin chào! Mình tên là Mimi.',{act:'wave'}),
    D('B','Hi, Mimi! I am Leo.','Chào Mimi! Mình là Leo.',{act:'wave'}),
    D('A','Nice to meet you, Leo.','Rất vui được gặp bạn, Leo.'),
    D('B','Nice to meet you, too!','Mình cũng rất vui được gặp bạn!'),
    D('A','How are you?','Bạn khỏe không?'),
    D('B','I am fine, thank you. And you?','Mình khỏe, cảm ơn bạn. Còn bạn?'),
    D('A','I am great! Goodbye, Leo!','Mình rất khỏe! Tạm biệt Leo!',{act:'wave'}),
    D('B','Goodbye, Mimi! See you!','Tạm biệt Mimi! Hẹn gặp lại!',{act:'wave'})])],
   quiz:[
    {q:'Khi gặp ai đó lần đầu, bạn nói gì?',o:['Nice to meet you.','Goodbye.','I am sorry.','Good night.'],a:0,why:'Nice to meet you = rất vui được gặp bạn.'},
    {q:'“How are you?” — trả lời nào đúng?',o:['I am fine, thank you.','My name is Leo.','See you.','Nice to meet you.'],a:0,why:'How are you? là hỏi thăm sức khỏe.'},
    {q:'My ___ is Mimi.',o:['name','am','fine','hello'],a:0,why:'My name is… = Tên mình là…'},
    {q:'Bạn làm vỡ cốc của bạn. Bạn nói:',o:['Sorry!','Please!','Good morning!','Hello!'],a:0,why:'Sorry = xin lỗi.'}]},
  {id:'colors',t:'Colors',vi:'Màu sắc',theme:'meadow',icon:{obj:'ball',tint:'#ef4444'},parts:[
   P('Màu cơ bản','Đỏ, xanh dương, xanh lá, vàng',[
    N('Colors are everywhere! Look at this ball.','Màu sắc có ở khắp nơi! Hãy nhìn quả bóng này.',{obj:'ball',tint:'#ef4444'}),
    CV('red','đỏ'),CV('blue','xanh dương'),CV('green','xanh lá'),CV('yellow','vàng')]),
   P('Thêm màu mới','Cam, tím, hồng, đen',[CV('orange','cam'),CV('purple','tím'),CV('pink','hồng'),CV('black','đen')]),
   P('Đặt câu','Màu của đồ vật',[
    S('The:x apple:o is:v red:a','Quả táo màu đỏ.',{obj:'apple'}),
    S('The:x banana:o is:v yellow:a','Quả chuối màu vàng.',{obj:'banana'}),
    S('The:x tree:o is:v green:a','Cái cây màu xanh lá.',{obj:'tree'}),
    D('A','What color is it?','Nó màu gì vậy?',{obj:'ball',tint:'#a855f7'}),
    D('B','It is purple!','Nó màu tím!',{obj:'ball',tint:'#a855f7'}),
    D('A','And this one?','Còn quả này?',{obj:'ball',tint:'#f472b6'}),
    D('B','It is pink!','Nó màu hồng!',{obj:'ball',tint:'#f472b6'})])],
   quiz:[
    {q:'Quả chuối thường có màu gì?',o:['yellow','blue','purple','black'],a:0,why:'Banana is yellow.'},
    {q:'Chọn câu đúng:',o:['The apple is red.','The apple red is.','Red the apple is.','Is the apple red the.'],a:0,why:'Cấu trúc: The + danh từ + is + màu sắc.'},
    {q:'The grass is ___.',o:['green','pink','black','purple'],a:0,why:'Cỏ màu xanh lá: green.'}]},
  {id:'numbers',t:'Numbers 1–10',vi:'Đếm từ 1 đến 10',theme:'space',icon:{obj:'star',n:3},parts:[
   P('Từ 1 đến 5','Đếm những ngôi sao',[NUM('one',1,'Một'),NUM('two',2,'Hai'),NUM('three',3,'Ba'),NUM('four',4,'Bốn'),NUM('five',5,'Năm')]),
   P('Từ 6 đến 10','Đếm tiếp nào',[NUM('six',6,'Sáu'),NUM('seven',7,'Bảy'),NUM('eight',8,'Tám'),NUM('nine',9,'Chín'),NUM('ten',10,'Mười')]),
   P('Đếm và hỏi','How many?',[
    N('Let us count the stars together: one, two, three, four, five, six, seven!','Cùng đếm những ngôi sao nhé: một, hai, ba, bốn, năm, sáu, bảy!',{obj:'star',n:7,big:'7'}),
    D('A','How many stars?','Có bao nhiêu ngôi sao?',{obj:'star',n:3,big:'3'}),
    D('B','Three stars!','Ba ngôi sao!',{obj:'star',n:3,big:'3'}),
    S('I:s have:v five:a apples:o','Mình có năm quả táo.',{obj:'apple',n:5,big:'5'}),
    S('I:s have:v four:a cats:o','Mình có bốn con mèo.',{obj:'cat',n:4,big:'4'})])],
   quiz:[
    {q:'Số 8 đọc là gì?',o:['eight','eighteen','eat','nine'],a:0,why:'8 = eight.'},
    {q:'Số nào lớn nhất?',o:['ten','seven','nine','four'],a:0,why:'Ten = 10.'},
    {q:'I have ___ apples. (5 quả)',o:['five','four','six','nine'],a:0,why:'5 = five.'}]},
  {id:'animals',t:'Animals',vi:'Các con vật',theme:'meadow',icon:{obj:'cat'},parts:[
   P('Thú cưng','Mèo, chó, chim',[V('cat','con mèo','cat'),V('dog','con chó','dog'),V('bird','con chim','bird')]),
   P('Bạn nhỏ khác','Cá, vịt, thỏ',[V('fish','con cá','fish'),V('duck','con vịt','duck'),V('rabbit','con thỏ','rabbit')]),
   P('Con vật làm gì?','Câu đơn giản',[
    S('The:x cat:o is:v small:a','Con mèo thì nhỏ.',{obj:'cat'}),
    S('The:x dog:o can:v run:v','Con chó có thể chạy.',{obj:'dog'}),
    S('The:x bird:o can:v fly:v','Con chim có thể bay.',{obj:'bird'}),
    S('The:x fish:o can:v swim:v','Con cá có thể bơi.',{obj:'fish'}),
    S('I:s like:v rabbits:o','Mình thích thỏ.',{obj:'rabbit'})])],
   quiz:[
    {q:'Which animal can fly?',o:['bird','dog','fish','cat'],a:0,why:'A bird can fly.'},
    {q:'Which animal can swim?',o:['fish','dog','cat','rabbit'],a:0,why:'A fish can swim.'},
    {q:'The dog can ___.',o:['run','fly','swim','read'],a:0,why:'The dog can run.'}]},
  {id:'fruits',t:'Fruits',vi:'Trái cây',theme:'meadow',icon:{obj:'apple'},parts:[
   P('Trái cây quen thuộc','Táo, chuối, cam',[V('apple','quả táo','apple'),V('banana','quả chuối','banana'),V('orange','quả cam','orange')]),
   P('Thêm trái cây','Dâu, nho, dưa hấu',[V('strawberry','quả dâu tây','strawberry'),V('grapes','chùm nho','grapes',{s:'These are grapes.',vs:'Đây là những quả nho.'}),V('watermelon','quả dưa hấu','watermelon')]),
   P('Bạn thích gì?','Do you like…?',[
    S('I:s like:v apples:o','Mình thích táo.',{obj:'apple'}),
    D('A','Do you like bananas?','Bạn có thích chuối không?',{obj:'banana'}),
    D('B','Yes, I do! I love bananas.','Có, mình thích! Mình rất thích chuối.',{obj:'banana'}),
    D('A','Do you like grapes?','Bạn có thích nho không?',{obj:'grapes'}),
    D('B','No, I do not. I like strawberries.','Không, mình không thích. Mình thích dâu tây.',{obj:'strawberry'})])],
   quiz:[
    {q:'Do you like apples? — Yes, I ___.',o:['do','am','like','is'],a:0,why:'Trả lời ngắn: Yes, I do.'},
    {q:'I ___ oranges.',o:['like','am','is','likes'],a:0,why:'Với I ta dùng like.'},
    {q:'Quả nào có màu vàng và cong cong?',o:['banana','apple','grapes','watermelon'],a:0,why:'Banana = chuối.'}]}
 ]},
 {id:2,t:'Cấp 2 · Cơ bản',sub:'Gia đình, đồ ăn, nhà cửa (A1)',c:'#3d6bff',lessons:[
  {id:'family',t:'My Family',vi:'Gia đình của mình',theme:'room',icon:{obj:'person',opt:FAM.mother},parts:[
   P('Thành viên','Mẹ, bố, anh em',[
    V('mother','mẹ','person',{opt:FAM.mother,s:'This is my mother.',vs:'Đây là mẹ của mình.'}),
    V('father','bố','person',{opt:FAM.father,s:'This is my father.',vs:'Đây là bố của mình.'}),
    V('brother','anh trai hoặc em trai','person',{opt:FAM.brother,s:'This is my brother.',vs:'Đây là anh hoặc em trai của mình.'}),
    V('sister','chị gái hoặc em gái','person',{opt:FAM.sister,s:'This is my sister.',vs:'Đây là chị hoặc em gái của mình.'})]),
   P('Người thân','Em bé, bà',[
    V('baby','em bé','person',{opt:FAM.baby,s:'This is my baby brother.',vs:'Đây là em bé của mình.'}),
    V('grandmother','bà','person',{opt:FAM.grandmother,s:'This is my grandmother.',vs:'Đây là bà của mình.'}),
    N('A family is a group of people who love each other.','Gia đình là những người yêu thương nhau.',{obj:'heart',card:'Family'})]),
   P('Is, am, are','Câu giới thiệu',[
    N('We use “am” with I.','Ta dùng “am” với I.',{tiles:'I:s am:v happy:a'}),
    N('We use “is” with he, she, and it.','Ta dùng “is” với he, she và it.',{tiles:'She:s is:v kind:a'}),
    S('He:s is:v my:x father:o','Ông ấy là bố của mình.',{obj:'person',opt:FAM.father}),
    S('She:s is:v my:x sister:o','Cô ấy là chị gái của mình.',{obj:'person',opt:FAM.sister}),
    N('We use “are” with you, we, and they.','Ta dùng “are” với you, we và they.',{tiles:'We:s are:v a:x family:o',obj:'heart'})])],
   quiz:[
    {q:'He ___ my brother.',o:['is','am','are','be'],a:0,why:'He đi với is.'},
    {q:'I ___ happy.',o:['am','is','are','be'],a:0,why:'I đi với am.'},
    {q:'They ___ my parents.',o:['are','is','am','be'],a:0,why:'They đi với are.'},
    {q:'We ___ a happy family.',o:['are','is','am','be'],a:0,why:'We đi với are.'}]},
  {id:'food',t:'Food and Drink',vi:'Đồ ăn và thức uống',theme:'beach',icon:{obj:'pizza'},parts:[
   P('Món ngon','Bánh kem, pizza, bánh mì',[V('cake','bánh kem','cake'),V('pizza','bánh pizza','pizza'),V('bread','bánh mì','bread',{s:'This is bread.'})]),
   P('Thêm món nữa','Nước ép, trứng, kem',[V('juice','nước ép','cup',{s:'This is orange juice.',vs:'Đây là nước cam ép.'}),V('egg','quả trứng','egg'),V('ice cream','cây kem','icecream',{s:'This is ice cream.'})]),
   P('I like / I do not like','Nói về sở thích',[
    S('I:s like:v pizza:o','Mình thích pizza.',{obj:'pizza'}),
    N('To say no, we use “do not” before the verb.','Để nói không, ta dùng “do not” trước động từ.',{tiles:'I:s do_not:v like:x eggs:o',obj:'egg'}),
    D('A','Do you like cake?','Bạn có thích bánh kem không?',{obj:'cake'}),
    D('B','Yes, I do. I love cake!','Có, mình thích. Mình rất thích bánh kem!',{obj:'cake'}),
    D('A','Do you like eggs?','Bạn có thích trứng không?',{obj:'egg'}),
    D('B','No, I do not. I like bread.','Không, mình không thích. Mình thích bánh mì.',{obj:'bread'})])],
   quiz:[
    {q:'I ___ not like eggs.',o:['do','am','is','does'],a:0,why:'Phủ định với I: do not.'},
    {q:'___ you like pizza?',o:['Do','Are','Is','Does'],a:0,why:'Câu hỏi với you: Do you…?'},
    {q:'Yes, I ___.',o:['do','like','am','are'],a:0,why:'Trả lời ngắn: Yes, I do.'}]},
  {id:'house',t:'Around the House',vi:'Đồ vật và vị trí',theme:'room',icon:{obj:'chair'},parts:[
   P('Đồ trong nhà','Ghế, bàn, đèn',[V('chair','cái ghế','chair'),V('table','cái bàn','table'),V('lamp','cái đèn','lamp')]),
   P('Thêm đồ vật','Sách, giường, nhà',[V('book','quyển sách','book'),V('bed','cái giường','bed'),V('house','ngôi nhà','house')]),
   P('Giới từ','On, in, under, next to',[
    N('Where is the ball? Let us learn four small words.','Quả bóng ở đâu? Cùng học bốn từ nhỏ nhé.',{prep:'on'}),
    PP('on','ở trên','On. The ball is on the table.','On là ở trên. Quả bóng ở trên bàn.','The:x ball:o is:v on:a the:x table:o'),
    PP('in','ở trong','In. The ball is in the box.','In là ở trong. Quả bóng ở trong hộp.','The:x ball:o is:v in:a the:x box:o'),
    PP('under','ở dưới','Under. The ball is under the table.','Under là ở dưới. Quả bóng ở dưới bàn.','The:x ball:o is:v under:a the:x table:o'),
    PP('next to','ở bên cạnh','Next to. The ball is next to the table.','Next to là ở bên cạnh. Quả bóng ở cạnh bàn.','The:x ball:o is:v next_to:a the:x table:o'),
    D('A','Where is my book?','Quyển sách của mình ở đâu?',{obj:'book'}),
    D('B','It is on the chair.','Nó ở trên ghế.',{obj:'chair'})])],
   quiz:[
    {q:'Quả bóng nằm DƯỚI bàn: The ball is ___ the table.',o:['under','on','in','next to'],a:0,why:'Under = ở dưới.'},
    {q:'The cat is ___ the box. (ở trong hộp)',o:['in','on','under','at'],a:0,why:'In = ở trong.'},
    {q:'The lamp is ___ the table. (ở trên bàn)',o:['on','under','in','next'],a:0,why:'On = ở trên.'}]},
  {id:'routine',t:'My Day',vi:'Một ngày của mình',theme:'city',icon:{obj:'clock',opt:{time:[7,0]}},parts:[
   P('Buổi sáng','Thức dậy, ăn sáng, đi học',[
    V('wake up','thức dậy','clock',{nopic:true,opt:{time:[6,30],ring:true},s:'I wake up at six thirty.',vs:'Mình thức dậy lúc sáu giờ rưỡi.'}),
    V('have breakfast','ăn sáng','bread',{nopic:true,s:'I have breakfast at seven.',vs:'Mình ăn sáng lúc bảy giờ.'}),
    V('go to school','đi học','backpack',{nopic:true,s:'I go to school at eight.',vs:'Mình đi học lúc tám giờ.'})]),
   P('Buổi tối','Học bài, đi ngủ, xem giờ',[
    V('study','học bài','book',{nopic:true,s:'I study in the afternoon.',vs:'Mình học bài vào buổi chiều.'}),
    V('go to bed','đi ngủ','bed',{nopic:true,s:'I go to bed at ten.',vs:'Mình đi ngủ lúc mười giờ.'}),
    N('What time is it? It is seven o’clock.','Mấy giờ rồi? Bây giờ là bảy giờ đúng.',{obj:'clock',opt:{time:[7,0]},big:'7:00'}),
    N('It is half past three.','Bây giờ là ba giờ rưỡi.',{obj:'clock',opt:{time:[3,30]},big:'3:30'})]),
   P('Thì hiện tại đơn','He, she, it thêm s',[
    S('I:s get:v up:x at:x six:a','Mình dậy lúc sáu giờ.',{obj:'clock',opt:{time:[6,0]}}),
    N('With he, she, and it, we add s to the verb.','Với he, she và it, ta thêm s vào động từ.',{tiles:'She:s goes:v to:x school:o'}),
    S('She:s goes:v to:x school:o','Cô ấy đi học.',{obj:'backpack'}),
    S('He:s studies:v in:x the:x evening:o','Cậu ấy học bài vào buổi tối.',{obj:'book'}),
    D('A','What time do you get up?','Bạn dậy lúc mấy giờ?',{obj:'clock',opt:{time:[6,30]}}),
    D('B','I get up at six thirty.','Mình dậy lúc sáu giờ rưỡi.',{obj:'clock',opt:{time:[6,30]}})])],
   quiz:[
    {q:'She ___ to school every day.',o:['goes','go','going','gone'],a:0,why:'She + động từ thêm s: goes.'},
    {q:'I ___ breakfast at seven.',o:['have','has','having','am'],a:0,why:'Với I dùng have.'},
    {q:'Đồng hồ chỉ 7:00. Chọn câu đúng:',o:['It is seven o’clock.','It is seven thirty.','It is six o’clock.','It is eight o’clock.'],a:0,why:'7:00 = seven o’clock.'},
    {q:'What time ___ you get up?',o:['do','does','are','is'],a:0,why:'Câu hỏi với you: do you…?'}]}
 ]},
 {id:3,t:'Cấp 3 · Giao tiếp',sub:'Đang làm, đã làm, sẽ làm (A1+)',c:'#ff8a3d',lessons:[
  {id:'actions',t:'What Are You Doing?',vi:'Hành động đang diễn ra',theme:'meadow',icon:{obj:'person',opt:{tint:'#ff8a3d'}},parts:[
   P('Động từ','Chạy, nhảy, nhảy múa',[ACT('run','running','chạy','Mình đang chạy.','run'),ACT('jump','jumping','nhảy','Mình đang nhảy.','jump'),ACT('dance','dancing','nhảy múa','Mình đang nhảy múa.','dance')]),
   P('Thêm động từ','Ngủ, đọc, ăn',[ACT('sleep','sleeping','ngủ','Mình đang ngủ.','sleep'),ACT('read','reading','đọc sách','Mình đang đọc sách.','read'),ACT('eat','eating','ăn','Mình đang ăn.','eat')]),
   P('Am, is, are + V-ing','Đang làm gì?',[
    N('To talk about now, we use am, is, or are plus a verb with ing.','Để nói về lúc này, ta dùng am, is hoặc are cộng động từ thêm ing.',{tiles:'I:s am:v reading:v',act:'read'}),
    S('The:x cat:o is:v sleeping:v','Con mèo đang ngủ.',{obj:'cat'}),
    S('The:x bird:o is:v flying:v','Con chim đang bay.',{obj:'bird'}),
    S('The:x fish:o is:v swimming:v','Con cá đang bơi.',{obj:'fish'}),
    D('A','What are you doing?','Bạn đang làm gì vậy?'),
    D('B','I am reading a book.','Mình đang đọc sách.',{act:'read'}),
    D('A','Me? I am dancing!','Còn mình á? Mình đang nhảy múa!',{act:'dance'})])],
   quiz:[
    {q:'I am ___ a book.',o:['reading','read','reads','to read'],a:0,why:'am + V-ing: reading.'},
    {q:'She ___ dancing now.',o:['is','am','are','be'],a:0,why:'She đi với is.'},
    {q:'What are you doing? — I ___ sleeping.',o:['am','is','are','do'],a:0,why:'I đi với am.'}]},
  {id:'past',t:'Yesterday',vi:'Chuyện hôm qua',theme:'city',icon:{obj:'backpack'},parts:[
   P('Động từ quá khứ','Chơi, thăm, ăn',[
    W('played','đã chơi',{en:'Played. Yesterday I played ball.',sub:'Played là đã chơi. Hôm qua mình chơi bóng.',tiles:'Yesterday:a I:s played:v ball:o',obj:'ball'}),
    W('visited','đã thăm',{en:'Visited. Yesterday I visited my grandmother.',sub:'Visited là đã thăm. Hôm qua mình thăm bà.',tiles:'Yesterday:a I:s visited:v',obj:'person',opt:FAM.grandmother}),
    W('ate','đã ăn',{en:'Ate. Yesterday I ate an apple.',sub:'Ate là đã ăn. Hôm qua mình ăn một quả táo.',tiles:'Yesterday:a I:s ate:v',obj:'apple'})]),
   P('Động từ bất quy tắc','Đi, thấy, có',[
    W('went','đã đi',{en:'Went. Yesterday I went to school.',sub:'Went là đã đi. Hôm qua mình đi học.',tiles:'Yesterday:a I:s went:v',obj:'backpack'}),
    W('saw','đã thấy',{en:'Saw. Yesterday I saw a cat.',sub:'Saw là đã thấy. Hôm qua mình thấy một con mèo.',tiles:'Yesterday:a I:s saw:v',obj:'cat'}),
    W('had','đã có, đã ăn',{en:'Had. Yesterday I had a cake.',sub:'Had là đã có hoặc đã ăn. Hôm qua mình có một cái bánh kem.',tiles:'Yesterday:a I:s had:v',obj:'cake'})]),
   P('Quy tắc','-ed và bất quy tắc',[
    N('Yesterday means the day before today.','Yesterday nghĩa là hôm qua.',{tiles:'Yesterday:a',obj:'sun'}),
    N('For regular verbs, we add ed. Play becomes played.','Với động từ có quy tắc, ta thêm ed. Play thành played.',{tiles:'play:x played:v'}),
    N('Some verbs change. Go becomes went. Eat becomes ate.','Một số động từ đổi hẳn. Go thành went. Eat thành ate.',{tiles:'go:x went:v eat:x ate:v'}),
    S('I:s did:v not:v go:v to:x school:o','Mình đã không đi học.',{obj:'backpack'}),
    D('A','What did you do yesterday?','Hôm qua bạn đã làm gì?'),
    D('B','I played ball with my brother.','Mình chơi bóng với em trai.',{obj:'ball'})])],
   quiz:[
    {q:'Yesterday I ___ to school.',o:['went','go','goes','going'],a:0,why:'Quá khứ của go là went.'},
    {q:'She ___ an apple last night.',o:['ate','eat','eats','eaten'],a:0,why:'Quá khứ của eat là ate.'},
    {q:'Yesterday we ___ football.',o:['played','play','plays','playing'],a:0,why:'Thêm ed: played.'},
    {q:'I ___ a cat in the garden.',o:['saw','see','sees','seen'],a:0,why:'Quá khứ của see là saw.'}]},
  {id:'weather',t:'Weather',vi:'Thời tiết',theme:'beach',icon:{obj:'sun'},parts:[
   P('Các kiểu thời tiết','Nắng, mây, mưa, tuyết',[
    V('sunny','có nắng','sun',{s:'It is sunny today.',vs:'Hôm nay trời nắng.'}),
    V('cloudy','nhiều mây','cloud',{s:'It is cloudy today.',vs:'Hôm nay trời nhiều mây.'}),
    V('rainy','có mưa','raincloud',{s:'It is rainy today.',vs:'Hôm nay trời mưa.'}),
    V('snowy','có tuyết','snowman',{s:'It is snowy today.',vs:'Hôm nay trời có tuyết.'})]),
   P('Hỏi về thời tiết','What is the weather like?',[
    D('A','What is the weather like today?','Hôm nay thời tiết thế nào?',{obj:'cloud'}),
    D('B','It is rainy. Let us stay home!','Trời mưa. Mình ở nhà thôi!',{obj:'raincloud'}),
    D('A','What about tomorrow?','Còn ngày mai thì sao?',{obj:'cloud'}),
    D('B','Tomorrow it will be sunny!','Ngày mai trời sẽ nắng!',{obj:'sun'})]),
   P('Mình thích gì?','Nói về sở thích',[
    S('I:s like:v sunny:a days:o','Mình thích những ngày nắng.',{obj:'sun'}),
    S('I:s do_not:v like:x rainy:a days:o','Mình không thích những ngày mưa.',{obj:'raincloud'}),
    S('It:s is:v cold:a and:x snowy:a','Trời lạnh và có tuyết.',{obj:'snowman'}),
    N('Great! Now you can talk about the weather.','Tuyệt! Bây giờ bạn có thể nói về thời tiết rồi.',{act:'jump',card:'Well done!'})])],
   quiz:[
    {q:'It is raining. The weather is ___.',o:['rainy','sunny','snowy','cloudy'],a:0,why:'Rainy = có mưa.'},
    {q:'What is the weather like? — It is ___.',o:['cloudy','a cat','blue','happy'],a:0,why:'Trả lời bằng tính từ thời tiết.'},
    {q:'I ___ like rainy days.',o:['do not','am not','not','no'],a:0,why:'Phủ định: do not.'}]},
  {id:'travel',t:'Travel Plans',vi:'Kế hoạch tương lai',theme:'space',icon:{obj:'rocket'},parts:[
   P('Phương tiện','Máy bay, ô tô, tên lửa',[V('plane','máy bay','plane'),V('car','ô tô','car',{tint:'#ef4444'}),V('rocket','tên lửa','rocket')]),
   P('Will và going to','Nói về tương lai',[
    N('To talk about the future, we use “will” plus a verb.','Để nói về tương lai, ta dùng “will” cộng động từ.',{tiles:'I:s will:v travel:v'}),
    S('I:s will:v fly:v to:x Paris:o','Mình sẽ bay đến Paris.',{obj:'plane'}),
    S('We:s will:v go:v by:x car:o','Chúng mình sẽ đi bằng ô tô.',{obj:'car',tint:'#3b82f6'}),
    S('He:s will:v fly:v to:x the:x moon:o','Anh ấy sẽ bay lên mặt trăng.',{obj:'rocket'}),
    N('We can also say “going to” for plans.','Ta cũng có thể dùng “going to” cho những kế hoạch.',{tiles:'We:s are:v going_to:v visit:v'})]),
   P('Hội thoại','Chuyến đi mùa hè',[
    D('A','Where will you go next summer?','Mùa hè tới bạn sẽ đi đâu?',{obj:'plane'}),
    D('B','I will fly to Japan! And you?','Mình sẽ bay đến Nhật Bản! Còn bạn?',{obj:'plane'}),
    D('A','I am going to visit my grandmother by car.','Mình sẽ đi thăm bà bằng ô tô.',{obj:'car'}),
    D('B','Have a nice trip!','Chúc bạn có một chuyến đi vui vẻ!',{act:'wave'})])],
   quiz:[
    {q:'Tomorrow I ___ visit my grandmother.',o:['will','did','am','was'],a:0,why:'Tương lai: will + động từ.'},
    {q:'We are ___ to fly to Japan.',o:['going','go','went','goes'],a:0,why:'are going to + động từ.'},
    {q:'Chọn câu nói về tương lai:',o:['I will go to the beach.','I went to the beach.','I go to the beach every day.','I am at the beach.'],a:0,why:'Will = sẽ.'}]}
 ]}
];
function vocabOf(l){const out=[];l.parts.forEach(p=>p.steps.forEach(s=>{if(s.k==='v'&&s.w)out.push(s)}));return out}
function allVocab(){const out=[];LESSONS.forEach(l=>vocabOf(l).forEach(v=>out.push(Object.assign({lid:l.id},v))));return out}
const EMO={hello:'\u{1F44B}',goodbye:'\u{1F44B}','thank you':'\u{1F64F}',sorry:'\u{1F614}',please:'\u{1F97A}',run:'\u{1F3C3}',jump:'\u{1F938}',dance:'\u{1F483}',sleep:'\u{1F634}',read:'\u{1F4D6}',eat:'\u{1F37D}\uFE0F'};
const picOf=v=>{if(v.obj)return{obj:v.obj,tint:v.tint,n:v.n,opt:v.opt};if(v.prep)return{prep:v.prep};const e=v.emo||EMO[v.w];return e?{obj:e}:null};
