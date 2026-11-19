'use strict';
/* ===== Ngữ pháp mở rộng: GX (thêm bài tập), giới từ chi tiết ===== */
GCATS.push({id:'F',t:'Phát âm',c:'#0b7285'});
/* GX: mỗi dòng "câu hỏi|đáp án đúng|sai 1|sai 2" -> thêm vào thẻ id */
function GX(id,text){
  const g=GRAM.find(x=>x.id===id);if(!g)throw new Error('GX: không có thẻ '+id);
  text.split('\n').map(s=>s.trim()).filter(Boolean).forEach(l=>{
    const p=l.split('|');if(p.length<3)throw new Error('GX dòng lỗi: '+l);
    if(g.q.some(x=>x.q===p[0]))return;
    g.q.push({q:p[0],opts:p.slice(1).map((o,i)=>({t:o,ok:i===0}))});
  });
}

GR('P','prepplace','Prepositions of Place','Giới từ chỉ vị trí','A1','Cho biết vật hoặc người ở đâu: in, on, at, under, between, behind…',
 'at + điểm cụ thể: at the bus stop, at home;in + không gian bao quanh: in a room, in Hanoi;on + bề mặt: on the table, on the wall;under / over / above / below: dưới, trên (phía trên), cao hơn, thấp hơn;between (hai vật) / among (nhiều vật);in front of / behind / next to / opposite / near',
 'Chỉ vị trí của vật;Chỉ địa điểm: thành phố, nước, tòa nhà;Mô tả bức tranh, phòng, đường đi','where? Where is it?;next to, in front of, behind;on the left / on the right',
 'The:x cat:o is:v on:x the:x sofa:o|Con mèo ở trên ghế sofa|🐱;The:x bank:o is:v opposite:x the:x park:o|Ngân hàng nằm đối diện công viên|🏦;She:s stands:v between:x two:a trees:o|Cô ấy đứng giữa hai cái cây|🌳',
 'in cho khu vực rộng, at cho điểm, on cho bề mặt;between dùng cho hai, among cho từ ba trở lên;on the third floor, at the end of the street','',
 '');
GX('prepplace',`The cat is sleeping ___ the sofa.|on|in|at
She lives ___ Hanoi.|in|on|at
Meet me ___ the bus stop.|at|in|on
The picture is hanging ___ the wall.|on|in|at
The dog is hiding ___ the table (below it).|under|over|across
A bridge goes ___ the river.|over|in|at
There is a lamp ___ the two sofas.|between|among|behind
She stood ___ the crowd of fans.|among|between|beside
The bank is ___ the supermarket (on the other side of the street).|opposite|between|under
Please sit ___ me (at my side).|next to|in front|above
The garden is ___ the house (at the back).|behind|opposite|above
There is a clock ___ the door (higher than it).|above|between|beside
He is waiting ___ the end of the street.|at|in|on
My keys are ___ my bag.|in|on|at
He is ___ home now.|at|in|on
The children are ___ school today.|at|in|on
I read it ___ the newspaper.|in|on|at
There is a spider ___ the ceiling.|on|in|at
They live ___ 25 Nguyen Hue Street.|at|in|on
Tom sits ___ the back of the classroom.|at|on|between
Mount Fuji is ___ Japan.|in|at|on
There are many fish ___ the lake.|in|on|at
The plane is flying ___ the clouds.|above|under|beside
The village lies ___ the mountains and the sea.|between|among|under
Stand ___ the line, please.|behind|between|among
The stars are ___ us.|above|between|in
There is a mirror ___ the bathroom door.|on|in|at
My office is ___ the third floor.|on|in|at
Who is that man ___ the phone?|on|in|at
The shop is ___ the corner, next to the bank.|on|at|by`);

GR('P','prepmove','Prepositions of Movement','Giới từ chỉ chuyển động','A2','Cho biết hướng đi hoặc đường đi của người, vật: to, from, into, out of, across, through…',
 'to / from: đến, từ;into / out of: vào trong, ra khỏi;onto / off: lên trên, xuống khỏi bề mặt;across (băng ngang bề mặt), through (xuyên qua không gian), along (dọc theo);up / down: lên, xuống;past (đi ngang qua), around (vòng quanh), towards (về phía)',
 'Hướng dẫn đường đi;Kể lại hành trình;Mô tả chuyển động','Go straight along…;Turn left past the…;walk / run / jump / fly + giới từ',
 'She:s walked:v into:x the:x room:o|Cô ấy bước vào phòng|🚪;The:x train:o goes:v through:x a:x tunnel:o|Tàu đi xuyên qua đường hầm|🚆;He:s jumped:v off:x the:x wall:o|Anh ấy nhảy xuống khỏi bức tường|🧱',
 'across: mặt phẳng, through: không gian có thành bao quanh;get in / on a bus, get out of / off a car;arrive at (nơi nhỏ), arrive in (thành phố, nước)','',
 '');
GX('prepmove',`She walked ___ the room and sat down.|into|to|at
He took a book ___ the shelf.|from|at|in
The bus goes ___ the tunnel.|through|across|along
We swam ___ the river to the other bank.|across|along|through
They walked ___ the beach, enjoying the view.|along|across|into
He ran ___ the stairs.|up|in|on
She came out ___ the house.|of|from|off
The cat jumped ___ the table.|onto|into|to
Go ___ the bridge and you will see the park.|across|through|into
I walked ___ the bakery on my way home.|past|into|onto
He fell ___ the horse.|off|from|out
She is walking ___ the school.|towards|between|under
The plane flew ___ the mountains.|over|onto|into
We drove ___ Hue to Da Nang.|from|at|by
The water flows ___ the hill.|down|up|at
The ball rolled ___ the table and broke.|off|from|into
Please get ___ the bus at the next stop.|off|out of|from
Please get ___ the car.|out of|off|from
He climbed ___ the wall to get into the garden.|over|in|at
The children ran ___ the tree in a circle.|around|along|into
They went ___ the escalator to the ground floor.|down|up|over
A bird flew ___ the open window.|through|along|onto
She got ___ the taxi.|into|onto|up
Walk ___ the corner and you will see the shop.|around|between|at
The boat sailed ___ the bridge.|under|onto|up
He went ___ the room to answer the phone.|out of|from|off
We are going ___ Paris next week.|to|at|in
She arrived ___ the airport at noon.|at|to|into
They arrived ___ Singapore yesterday.|in|to|at
Go straight ___ this road for two kilometres.|along|onto|between`);

GR('P','prepadj','Adjective + Preposition','Tính từ đi với giới từ','B1','Nhiều tính từ luôn đi với một giới từ nhất định. Hãy học theo cụm.',
 'good / bad / terrible at + N/V-ing;afraid / proud / fond / capable / aware of;interested / involved in;keen / crazy on or about;famous / ready / responsible for;different from, similar to, married to, engaged to, allergic to;worried / excited / nervous about;angry with (người), angry about (việc)',
 'Sau giới từ dùng danh từ hoặc V-ing;Diễn tả cảm xúc, khả năng, tính chất','She is good at…;I am afraid of…;He is interested in…',
 'She:s is:v good:a at:x maths:o|Cô ấy giỏi toán|➗;I:s am:v afraid:a of:x spiders:o|Mình sợ nhện|🕷️;We:s are:v proud:a of:x our:x team:o|Chúng mình tự hào về đội|🏆',
 'Học theo cụm, không dịch từng từ;Sau giới từ dùng V-ing, không dùng to V;kind of you, nice to me','',
 '');
GX('prepadj',`She is good ___ maths.|at|in|of
I'm afraid ___ spiders.|of|from|at
He is interested ___ jazz.|in|on|about
We're proud ___ our team.|of|for|about
I'm tired ___ waiting.|of|at|on
She is married ___ a doctor.|to|with|by
This city is famous ___ its food.|for|of|as
He is responsible ___ the project.|for|about|at
Your idea is different ___ mine.|from|with|of
I'm worried ___ the exam.|about|of|at
She was angry ___ me for being late.|with|in|on
They were surprised ___ the news.|at|for|of
He is keen ___ football.|on|in|at
I'm fond ___ chocolate.|of|for|on
The film is similar ___ the book.|to|with|from
She is jealous ___ her sister's success.|of|for|at
I'm not aware ___ any problem.|of|to|on
He is capable ___ running a marathon.|of|for|to
I'm sorry ___ being late.|for|of|at
We are satisfied ___ the service.|with|for|of
She is allergic ___ cats.|to|of|at
He is bad ___ remembering names.|at|in|for
The room is full ___ people.|of|with|by
I'm very excited ___ the trip.|about|of|on
She is impressed ___ his speech.|by|of|for
They are crazy ___ music.|about|of|on
I'm disappointed ___ the result.|with|for|from
He is accustomed ___ the cold.|to|with|of
She is nervous ___ the interview.|about|for|by
We are ready ___ the exam.|for|to|of
He is dependent ___ his parents.|on|of|from
She is engaged ___ a French man.|to|with|by
It's very kind ___ you to help.|of|for|to
I'm interested ___ learning Japanese.|in|at|for
Smoking is bad ___ your health.|for|at|to
She is absent ___ school today.|from|of|at
We are late ___ the meeting.|for|to|at
Vietnam is rich ___ natural resources.|in|of|with
She is typical ___ her generation.|of|for|to
I'm grateful ___ your help.|for|of|at`);

GR('P','prepverb','Verb + Preposition','Động từ đi với giới từ','B1','Nhiều động từ đi cố định với một giới từ. Giới từ đổi thì nghĩa cũng đổi: look at, look for, look after.',
 'depend / rely / insist / concentrate on;listen / belong / reply / apply to;wait / look / ask / pay / apply for;believe / succeed / participate in;suffer from, borrow from;consist of, think of, dream of;complain / worry / care about;laugh / shout / stare at;agree / argue with',
 'Sau giới từ dùng danh từ hoặc V-ing;Nghĩa thay đổi khi đổi giới từ','depend on, listen to, wait for;look forward to + V-ing',
 'It:s depends:v on:x the:x weather:o|Còn tùy thời tiết|🌦️;I:s am:v waiting:v for:x the:x bus:o|Mình đang đợi xe buýt|🚌;She:s apologized:v for:x being:x late:a|Cô ấy xin lỗi vì đến muộn|🙏',
 'look forward to + V-ing (to là giới từ);Nhóm to: listen, belong, reply, object, prefer…to;Ghi nhớ cặp: look at / for / after','',
 '');
GX('prepverb',`It depends ___ the weather.|on|of|from
Listen ___ the teacher.|to|at|for
I'm waiting ___ the bus.|for|to|at
She is looking ___ her keys.|for|to|on
This book belongs ___ me.|to|for|with
He apologized ___ being late.|for|of|to
She suffers ___ headaches.|from|of|with
Do you believe ___ ghosts?|in|on|at
The team consists ___ ten players.|of|from|in
He insisted ___ paying the bill.|on|to|for
She succeeded ___ passing the test.|in|at|on
I object ___ this plan.|to|for|with
We participated ___ the contest.|in|on|at
They complained ___ the noise.|about|for|against
She cares ___ her family.|about|on|to
Don't laugh ___ me.|at|on|to
I agree ___ you.|with|to|on
I disagree ___ you.|with|to|on
Think ___ the answer before you speak.|about|for|on
I dream ___ becoming a pilot.|of|to|for
Who is paying ___ the dinner?|for|to|at
She spoke ___ the manager.|to|at|for
He is arguing ___ his brother.|with|to|on
I borrowed money ___ my friend.|from|to|of
This room smells ___ fish.|of|to|at
I prefer tea ___ coffee.|to|than|from
Thank you ___ your help.|for|of|to
She is looking ___ the picture.|at|on|to
He is looking ___ his little sister while Mum is out.|after|for|at
We are looking forward ___ seeing you.|to|for|at
He hopes ___ a promotion.|for|of|on
Don't worry ___ it.|about|for|on
She replied ___ my email.|to|at|for
The accident resulted ___ three injuries.|in|of|with
She divided the cake ___ four pieces.|into|to|for
He is saving money ___ a new bike.|for|to|at
Please concentrate ___ your work.|on|at|in
This letter is addressed ___ you.|to|for|at
She stared ___ the strange painting.|at|on|to
I'm applying ___ a job.|for|of|on`);

GR('P','prepnoun','Noun + Preposition and Fixed Phrases','Danh từ + giới từ và cụm cố định','B2','Danh từ và cụm giới từ cố định cần học nguyên cụm: a reason for, an increase in, by mistake, on purpose.',
 'reason for, demand for, need for;increase / decrease / rise / fall in;solution / answer / key / access to;cause / lack / example of;difference between;damage to, attitude towards;by mistake / by hand / by heart;on purpose / on time / on holiday / on sale;in advance / in charge of / in spite of / in terms of;at risk / at least / at first;out of order, under pressure',
 'Viết học thuật và nói trang trọng;Cụm cố định không đổi giới từ','There is a reason for…;in spite of + N/V-ing',
 'There:x is:v a:x high:a demand:o for:x solar:a panels:o|Nhu cầu về pin mặt trời rất cao|☀️;The:x lift:o is:v out:x of:x order:o|Thang máy bị hỏng|🛗;She:s knows:v it:o by:x heart:o|Cô ấy thuộc lòng|🧠',
 'on time (đúng giờ) khác in time (kịp lúc);at the end of (điểm cuối) khác in the end (cuối cùng);in spite of = despite (không có of)','',
 '');
GX('prepnoun',`There is a reason ___ this.|for|of|to
We saw an increase ___ prices.|in|of|at
They found a solution ___ the problem.|to|for|of
What was the cause ___ the fire?|of|for|to
What is the difference ___ these two words?|between|of|from
Students have access ___ the library.|to|at|in
There is high demand ___ electric cars.|for|of|on
The storm caused damage ___ the roof.|to|of|at
Practice is the key ___ success.|to|of|for
His attitude ___ work is positive.|towards|at|for
She took my umbrella ___ mistake.|by|in|on
He did it ___ purpose, not by accident.|on|by|in
Please book the tickets ___ advance.|in|on|at
The animals are ___ risk of extinction.|at|in|on
The lift is ___ order.|out of|off|without
I'm ___ a lot of pressure at work.|under|in|on
She spoke ___ behalf of the team.|on|in|by
Who is ___ charge of this department?|in|at|on
We went out ___ spite of the rain.|in|at|on
___ the whole, the trip was great.|On|In|At
She knows the poem ___ heart.|by|in|with
___ terms of price, this one is better.|In|On|At
It will take two hours ___ least.|at|in|by
He is ___ holiday this week.|on|in|at
They are ___ love.|in|at|on
The book is ___ sale now.|on|in|at
I paid ___ cash.|in|by|on
I paid ___ credit card.|by|in|with
I heard it ___ the radio.|on|in|at
___ the end, we won the game.|In|At|On
We arrived ___ the end of the film.|at|in|on
___ first, I didn't like him.|At|In|On
The train left at 9:00 exactly. It was ___ time.|on|in|at
We got to the airport just ___ time to catch the plane.|in|on|at
This cake is made ___ hand.|by|with|in
She is ___ a diet.|on|in|at
___ my opinion, it's a good idea.|In|On|At
The workers are ___ strike.|on|in|at
She is ___ a good mood today.|in|on|at
He wrote the letter ___ pencil.|in|by|at`);

GR('P','prepconf','Confusing Prepositions','Giới từ dễ nhầm','B1','Những cặp giới từ hay bị dùng sai: between/among, during/for/while, by/until, since/for, beside/besides, like/as.',
 'between (hai hoặc vị trí cụ thể) / among (nhóm từ ba);during + danh từ / while + mệnh đề / for + khoảng thời gian;by (không muộn hơn) / until (suốt đến);since + mốc / for + khoảng;beside (bên cạnh) / besides (ngoài ra);like (giống) / as (với tư cách);except (loại trừ)',
 'Chọn đúng giới từ theo nghĩa;Tránh lỗi phổ biến trong viết và nói','Hỏi: mốc hay khoảng? vị trí hay nhóm?',
 'She:s works:v as:x a:x teacher:o|Cô ấy làm giáo viên|👩‍🏫;I:s must:v finish:v by:x Friday:a|Mình phải xong trước thứ Sáu|📅;He:s has:v lived:v here:a since:x 2015:a|Anh ấy sống ở đây từ 2015|🏠',
 'since 2015 / for ten years;by Friday = hạn chót, until Friday = kéo dài đến thứ Sáu;She works as a teacher, she looks like a teacher','',
 '');
GX('prepconf',`The prize was shared ___ the ten winners.|among|between|beside
The ball rolled ___ the two chairs.|between|among|beside
Please sit ___ me.|beside|besides|between
___ English, she speaks French.|Besides|Beside|Between
We stayed there ___ the summer.|during|for|while
She slept ___ eight hours.|for|during|while
Don't talk ___ I am speaking.|while|during|for
Please wait here ___ five o'clock.|until|by|during
I must finish this ___ Friday (no later than).|by|until|during
I've lived here ___ 2015.|since|for|from
I've lived here ___ ten years.|for|since|during
Everyone came ___ Tom.|except|beside|among
The shop is ___ the bank and the post office.|between|among|during
She works ___ a teacher.|as|like|such
He looks ___ his father.|like|as|such
She used the box ___ a chair.|as|like|by
He lives ___ the street from me.|across|through|during
The meeting starts ___ 9 o'clock.|at|on|in
We usually have a party ___ New Year's Eve.|on|in|at
We exchange gifts ___ Christmas Day.|on|at|in
He was born ___ 1999.|in|on|at
The film starts ___ the evening.|in|at|on
The owls wake up ___ night.|at|in|on
We have class ___ Monday morning.|on|in|at
He arrived ___ the party late.|at|to|in
She was born ___ a small village.|in|at|on
The report is due ___ tomorrow.|by|until|during
I'll stay here ___ tomorrow.|until|by|since
He has worked here ___ last year.|since|for|from
It rained ___ the night.|during|while|since
I read a magazine ___ I was waiting.|while|during|for
___ the lesson, please be quiet.|During|While|Since
Everyone is here ___ Anna.|except|among|during
He is tall ___ his age.|for|at|of
She lives ___ her parents.|with|by|at
She goes to school ___ foot.|on|by|in
They travel to work ___ bus.|by|on foot|with
He is in hospital ___ two weeks.|for|during|since
I have been waiting ___ an hour.|for|since|during
The shop is open ___ Monday ___ Friday.|from … to|since … to|by … until`);

/* bài tập thêm cho thẻ có sẵn */
GX('preptime',`My birthday is ___ the 5th of May.|on|in|at
The shop closes ___ 8 pm.|at|on|in
We go on holiday ___ August.|in|on|at
I wake up ___ 6 o'clock.|at|in|on
She was born ___ 2001.|in|on|at
See you ___ Saturday.|on|in|at
It's cold ___ winter.|in|on|at
We have lunch ___ noon.|at|in|on
The meeting is ___ the morning.|in|on|at
He arrived ___ midnight.|at|in|on
They got married ___ a sunny day.|on|in|at
I'll call you ___ the evening.|in|at|on
___ Sunday morning we relax.|On|In|At
The museum is ___ the corner.|on|at|in
The letter is ___ the table.|on|in|at
She is ___ the kitchen.|in|on|at
Wait for me ___ the entrance.|at|in|on
We stayed ___ a small hotel.|in|on|by
The class starts ___ ten minutes.|in|at|on
He lives ___ the second floor.|on|in|at`);
GX('prepdep',`She is good ___ swimming.|at|in|for
He depends ___ his parents.|on|of|from
I am waiting ___ my friend.|for|to|at
We talked ___ the problem.|about|for|at
They are afraid ___ the dark.|of|from|at
I'm looking ___ my phone.|for|to|on
She listens ___ music every day.|to|at|for
This wine is made ___ grapes. (the grapes change)|from|of|by
He is married ___ Lan.|to|with|by
I am proud ___ you.|of|for|about
This is similar ___ that.|to|from|as
She is interested ___ art.|in|on|at
We are worried ___ the weather.|about|for|of
Are you ready ___ the test?|for|to|about
He is famous ___ his songs.|for|of|as
I completely agree ___ my teacher.|with|to|for
She apologized ___ her mistake.|for|to|at
They arrived ___ the station.|at|to|on
We are different ___ each other.|from|with|to
He is afraid ___ losing his job.|of|for|to`);
