'use strict';
/* ===== Bộ sinh bài học từ dữ liệu gọn + bài mới cấp 1-5 ===== */
const LVMETA=[null,null,null,
 {t:'Cấp 4 · Sơ cấp+',sub:'Sức khỏe, thị trấn, du lịch (A2+)',c:'#e64980'},
 {t:'Cấp 5 · Trung cấp',sub:'Tiền bạc, bếp núc, kế hoạch (B1)',c:'#7950f2'},
 {t:'Cấp 6 · Trung cấp+',sub:'Công việc, tin tức, quan hệ (B1+)',c:'#15aabf'},
 {t:'Cấp 7 · Khá',sub:'Môi trường, khoa học, cụm động từ (B2)',c:'#74b816'},
 {t:'Cấp 8 · Khá+',sub:'Kinh doanh, thành ngữ, tranh luận (B2+)',c:'#f08c00'},
 {t:'Cấp 9 · Nâng cao',sub:'Học thuật, nghiên cứu, văn phong (C1)',c:'#c2255c'},
 {t:'Cấp 10 · Nâng cao+',sub:'Vấn đề toàn cầu, sắc thái ngôn ngữ (C1+)',c:'#364fc7'},
 {t:'Cấp 11 · Thành thạo',sub:'Văn học, diễn thuyết, ngôn ngữ tinh tế (C2)',c:'#0b7285'},
 {t:'Cấp 12 · Bậc thầy',sub:'Ngôn ngữ như người bản xứ (C2+)',c:'#862e9c'}];
LVMETA.forEach((m,i)=>{if(m)LEVELS.push({id:i+1,t:m.t,sub:m.sub,c:m.c,lessons:[]})});
const rxEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const T_PRON=new Set('i you he she it we they my your his her our their this that these those there'.split(' '));
const T_VERB=new Set('am is are was were be been being have has had do does did will would can could should must may might shall go goes went like likes want wants need needs love loves see saw eat ate drink get got make made take took give gave come came know knew think thought say said tell told ask asked use used work works play plays live lives study buy bought'.split(' '));
const T_ADV=new Set('today yesterday tomorrow every always never often sometimes usually now soon already yet very too really quickly slowly well here first then finally later again'.split(' '));
const T_ART=new Set('a an the to of and or but for with from by as than in on at under next about after before because so if when while'.split(' '));
function tileRole(w){const k=w.toLowerCase().replace(/[^a-z']/g,'');if(T_PRON.has(k))return 's';if(T_VERB.has(k))return 'v';if(T_ART.has(k))return 'x';if(T_ADV.has(k)||/ly$/.test(k))return 'a';return 'o'}
function GL(lv,id,t,vi,theme,icon,words,sents,dlg){
  const ws=words.split(';').map(s=>{const a=s.trim().split('|');return{w:a[0].trim(),vi:(a[1]||'').trim(),e:(a[2]||'⭐').trim(),ex:(a[3]||'').trim()}});
  const vs=ws.map(x=>({k:'v',w:x.w,vi:x.vi,obj:x.e,emo:x.e,ex:x.ex,en:cap(x.w)+'. '+x.ex,sub:cap(x.w)+' nghĩa là '+x.vi+'.'}));
  const half=Math.ceil(vs.length/2);
  const ss=sents.split(';').filter(Boolean).map(s=>{const a=s.split('|'),en=a[0].trim();
    const hit=ws.find(x=>new RegExp('\\b'+rxEsc(x.w)+'\\b','i').test(en));
    return{k:'s',tiles:en.split(' ').map(w=>w+':'+tileRole(w)).join(' '),en:en,sub:(a[1]||'').trim(),obj:hit?hit.e:undefined}});
  const ds=dlg.split(';').filter(Boolean).map((s,i)=>{const a=s.split('|');return D(i%2?'B':'A',a[0].trim(),(a[1]||'').trim())});
  const L={id:id,t:t,vi:vi,theme:theme,icon:{obj:icon},quiz:[],gen:true,parts:[
    P('Từ vựng 1','Học '+half+' từ đầu',vs.slice(0,half)),
    P('Từ vựng 2','Các từ tiếp theo',vs.slice(half)),
    P('Mẫu câu','Dùng từ trong câu',[N('Now let us see these words in real sentences.','Bây giờ hãy xem các từ này trong câu thực tế.')].concat(ss)),
    P('Hội thoại','Luyện nói theo cặp',[N('Listen to a short talk and repeat after it.','Nghe một đoạn hội thoại ngắn rồi nói theo.')].concat(ds))]};
  LEVELS[lv-1].lessons.push(L);
}

/* ---------- Cấp 1 ---------- */
GL(1,'body','My Body','Cơ thể mình','meadow','\u{1F441}️',
`eye|con mắt|👁️|I see with my eyes.;nose|cái mũi|👃|I smell with my nose.;mouth|cái miệng|👄|I eat with my mouth.;ear|cái tai|👂|I hear with my ears.;hand|bàn tay|✋|I wash my hands.;foot|bàn chân|🦶|My foot is small.;tooth|cái răng|🦷|I brush my teeth.;hair|tóc|💇|She has long hair.`,
`I have two eyes.|Mình có hai mắt.;I touch my nose.|Mình chạm vào mũi.;Open your mouth.|Hãy mở miệng ra.`,
`What is this?|Đây là gì?;It is my nose.|Đó là mũi của mình.;Touch your ears.|Hãy chạm vào tai của bạn.;OK! I touch my ears.|Được! Mình chạm vào tai.`);
GL(1,'shapes','Shapes','Hình khối','space','🔷',
`circle|hình tròn|⚪|The sun is a circle.;square|hình vuông|🟦|The box is a square.;triangle|hình tam giác|🔺|A roof is a triangle.;star|ngôi sao|⭐|I see a star.;heart|trái tim|❤️|I draw a heart.;diamond|hình thoi|🔶|The kite is a diamond.;rectangle|hình chữ nhật|🚪|The door is a rectangle.;moon|mặt trăng|🌙|The moon is round.`,
`It is a big circle.|Đó là một hình tròn lớn.;I see a red triangle.|Mình thấy một hình tam giác đỏ.;The star is yellow.|Ngôi sao màu vàng.`,
`What shape is it?|Nó là hình gì?;It is a square.|Nó là hình vuông.;Is it blue?|Nó có màu xanh không?;Yes, it is blue.|Vâng, nó màu xanh.`);
GL(1,'classroom','In the Classroom','Trong lớp học','room','🏫',
`pencil|bút chì|✏️|I write with a pencil.;pen|bút mực|🖊️|This pen is blue.;ruler|cái thước|📏|I need a ruler.;eraser|cục tẩy|🧽|Use an eraser.;notebook|quyển vở|📓|Open your notebook.;teacher|giáo viên|👩‍🏫|The teacher is kind.;student|học sinh|🧑‍🎓|I am a student.;board|cái bảng|📋|Look at the board.`,
`Take your pencil.|Hãy lấy bút chì của bạn.;The teacher is in the classroom.|Cô giáo ở trong lớp học.;I put my notebook on the desk.|Mình để vở lên bàn.`,
`Do you have a pen?|Bạn có bút mực không?;Yes, I do.|Có, mình có.;Can I use your ruler?|Mình mượn thước của bạn được không?;Sure! Here you are.|Được chứ! Của bạn đây.`);

/* ---------- Cấp 2 ---------- */
GL(2,'clothes','Clothes','Quần áo','room','👕',
`shirt|áo sơ mi|👕|I wear a blue shirt.;dress|cái váy|👗|She wears a pink dress.;pants|quần dài|👖|My pants are black.;shoes|đôi giày|👟|I put on my shoes.;hat|cái mũ|🧢|He wears a red hat.;socks|đôi tất|🧦|These socks are warm.;coat|áo khoác|🧥|Take your coat.;scarf|khăn quàng|🧣|I wear a scarf in winter.`,
`I am wearing a white shirt.|Mình đang mặc áo sơ mi trắng.;It is cold, so put on your coat.|Trời lạnh nên hãy mặc áo khoác vào.;She likes her new dress.|Cô ấy thích chiếc váy mới.`,
`What are you wearing today?|Hôm nay bạn mặc gì?;I am wearing a hat and a coat.|Mình đang đội mũ và mặc áo khoác.;Are you cold?|Bạn có lạnh không?;A little. I need a scarf!|Hơi lạnh. Mình cần một cái khăn!`);
GL(2,'feelings','Feelings','Cảm xúc','city','😊',
`happy|vui vẻ|😊|I am happy today.;sad|buồn|😢|He is sad.;angry|tức giận|😠|Do not be angry.;tired|mệt|😴|I am tired after school.;hungry|đói|🤤|I am hungry.;scared|sợ hãi|😨|The child is scared.;excited|hào hứng|🤩|We are excited.;surprised|ngạc nhiên|😲|She is surprised.`,
`Why are you sad?|Sao bạn buồn vậy?;I feel happy when I play.|Mình thấy vui khi chơi.;He is tired, so he goes to bed.|Cậu ấy mệt nên đi ngủ.`,
`How do you feel?|Bạn cảm thấy thế nào?;I feel tired.|Mình thấy mệt.;Do you want some water?|Bạn muốn uống nước không?;Yes, please. Thank you!|Có, làm ơn. Cảm ơn bạn!`);
GL(2,'jobs','Jobs','Nghề nghiệp','city','👩‍⚕️',
`doctor|bác sĩ|👩‍⚕️|The doctor helps sick people.;farmer|nông dân|👨‍🌾|The farmer grows rice.;driver|tài xế|🚌|The driver is careful.;cook|đầu bếp|👨‍🍳|The cook makes soup.;police officer|cảnh sát|👮|The police officer helps us.;singer|ca sĩ|🎤|The singer is famous.;pilot|phi công|👨‍✈️|The pilot flies a plane.;firefighter|lính cứu hỏa|🚒|The firefighter is brave.`,
`My mother is a doctor.|Mẹ mình là bác sĩ.;What does your father do?|Bố bạn làm nghề gì?;He is a farmer.|Ông ấy là nông dân.`,
`What do you want to be?|Bạn muốn làm nghề gì?;I want to be a pilot.|Mình muốn làm phi công.;Why?|Tại sao?;Because I love planes!|Vì mình yêu máy bay!`);
GL(2,'daymonth','Days and Months','Thứ và tháng','meadow','📅',
`Monday|thứ Hai|📅|We have English on Monday.;Friday|thứ Sáu|🎉|Friday is my favorite day.;Saturday|thứ Bảy|🏖️|I play on Saturday.;Sunday|Chủ nhật|😴|I rest on Sunday.;January|tháng Một|⛄|January is cold.;July|tháng Bảy|☀️|July is hot.;December|tháng Mười Hai|🎄|Christmas is in December.;birthday|sinh nhật|🎂|My birthday is in May.`,
`Today is Monday.|Hôm nay là thứ Hai.;My birthday is in May.|Sinh nhật mình vào tháng Năm.;We do not go to school on Sunday.|Chúng mình không đi học vào Chủ nhật.`,
`What day is it today?|Hôm nay là thứ mấy?;It is Friday.|Hôm nay là thứ Sáu.;When is your birthday?|Sinh nhật bạn khi nào?;It is in July.|Vào tháng Bảy.`);

/* ---------- Cấp 3 ---------- */
GL(3,'shopping','Shopping','Mua sắm','city','🛍️',
`price|giá tiền|🏷️|What is the price?;cheap|rẻ|💸|This bag is cheap.;expensive|đắt|💎|That watch is expensive.;buy|mua|🛒|I want to buy a hat.;sell|bán|🏪|They sell fruit.;money|tiền|💵|I have some money.;bag|cái túi|👜|My bag is new.;discount|giảm giá|🔖|There is a discount today.`,
`How much is this shirt?|Cái áo này bao nhiêu tiền?;It is too expensive for me.|Nó quá đắt với mình.;Can I pay by card?|Mình trả bằng thẻ được không?`,
`Can I help you?|Tôi giúp gì được cho bạn?;I want to buy this bag.|Mình muốn mua cái túi này.;It is twenty dollars.|Nó giá hai mươi đô.;OK. I will take it.|Được. Mình sẽ lấy nó.`);
GL(3,'hobbies','Sports and Hobbies','Thể thao và sở thích','meadow','⚽',
`football|bóng đá|⚽|I play football with friends.;swimming|bơi lội|🏊|Swimming is fun.;drawing|vẽ tranh|🎨|She likes drawing.;singing|ca hát|🎤|He enjoys singing.;cooking|nấu ăn|🍳|My dad loves cooking.;cycling|đạp xe|🚴|We go cycling on Sunday.;reading|đọc sách|📚|Reading is my hobby.;chess|cờ vua|♟️|I play chess every week.`,
`What is your hobby?|Sở thích của bạn là gì?;I enjoy swimming in summer.|Mình thích bơi vào mùa hè.;She is good at drawing.|Cô ấy vẽ giỏi.`,
`What do you do in your free time?|Bạn làm gì lúc rảnh?;I play chess and read books.|Mình chơi cờ vua và đọc sách.;Do you like sports?|Bạn có thích thể thao không?;Yes, I love football!|Có, mình yêu bóng đá!`);
GL(3,'restaurant','At the Restaurant','Ở nhà hàng','beach','🍽️',
`menu|thực đơn|📋|Can I see the menu?;order|gọi món|📝|I want to order now.;waiter|người phục vụ|🤵|The waiter is friendly.;bill|hóa đơn|🧾|The bill, please.;soup|món súp|🍲|The soup is hot.;salad|món salad|🥗|I like fresh salad.;coffee|cà phê|☕|One coffee, please.;delicious|ngon|😋|The food is delicious.`,
`I would like a bowl of soup.|Mình muốn một bát súp.;Could we have the bill, please?|Cho chúng tôi hóa đơn nhé?;The salad is fresh and delicious.|Món salad tươi và rất ngon.`,
`Are you ready to order?|Bạn sẵn sàng gọi món chưa?;Yes. I would like soup and salad.|Rồi. Mình muốn súp và salad.;Anything to drink?|Bạn uống gì không?;A coffee, please.|Cho mình một ly cà phê.`);
GL(3,'directions','Giving Directions','Chỉ đường','city','🧭',
`left|bên trái|⬅️|Turn left here.;right|bên phải|➡️|The bank is on the right.;straight|thẳng|⬆️|Go straight for two blocks.;corner|góc đường|🛣️|The shop is on the corner.;map|bản đồ|🗺️|Look at the map.;bridge|cây cầu|🌉|Cross the bridge.;traffic light|đèn giao thông|🚦|Stop at the traffic light.;near|gần|📍|The park is near here.`,
`Go straight and turn left.|Đi thẳng rồi rẽ trái.;The station is next to the bank.|Nhà ga ở cạnh ngân hàng.;Excuse me, where is the post office?|Xin lỗi, bưu điện ở đâu ạ?`,
`Excuse me, how do I get to the park?|Xin lỗi, đi đến công viên thế nào?;Go straight and turn right.|Đi thẳng rồi rẽ phải.;Is it far?|Có xa không?;No, it is near the bridge.|Không, nó gần cây cầu.`);

/* ---------- Cấp 4 ---------- */
GL(4,'health','At the Doctor','Đi khám bệnh','room','🏥',
`headache|đau đầu|🤕|I have a headache.;fever|sốt|🌡️|She has a fever.;cough|ho|😷|He has a bad cough.;medicine|thuốc|💊|Take this medicine.;appointment|cuộc hẹn khám|📅|I have an appointment at ten.;sore throat|đau họng|🗣️|I have a sore throat.;rest|nghỉ ngơi|🛌|You need to rest.;healthy|khỏe mạnh|🥦|Eat healthy food.`,
`What is the matter?|Bạn bị làm sao vậy?;You should drink more water.|Bạn nên uống nhiều nước hơn.;I do not feel well today.|Hôm nay mình thấy không khỏe.`,
`What seems to be the problem?|Bạn gặp vấn đề gì?;I have a fever and a cough.|Tôi bị sốt và ho.;You should rest and take this medicine.|Bạn nên nghỉ ngơi và uống thuốc này.;Thank you, doctor.|Cảm ơn bác sĩ.`);
GL(4,'town','Around Town','Quanh thị trấn','city','🏙️',
`hospital|bệnh viện|🏥|The hospital is near the park.;library|thư viện|📚|I read at the library.;bank|ngân hàng|🏦|The bank opens at nine.;market|chợ|🛒|We buy fruit at the market.;post office|bưu điện|📮|I send a letter at the post office.;supermarket|siêu thị|🏬|The supermarket is big.;museum|bảo tàng|🏛️|The museum is interesting.;cinema|rạp chiếu phim|🎬|We go to the cinema on Friday.`,
`There is a bank on the corner.|Có một ngân hàng ở góc đường.;The library is opposite the museum.|Thư viện đối diện bảo tàng.;I usually shop at the market.|Mình thường mua sắm ở chợ.`,
`Where are you going?|Bạn đang đi đâu?;I am going to the library.|Mình đang đến thư viện.;Can I come with you?|Mình đi cùng bạn được không?;Of course! Let us go.|Dĩ nhiên! Đi thôi.`);
GL(4,'holidays','Holidays and Festivals','Ngày lễ và lễ hội','beach','🎆',
`festival|lễ hội|🎊|The festival is in spring.;fireworks|pháo hoa|🎆|We watch fireworks.;gift|món quà|🎁|I give her a gift.;family dinner|bữa cơm gia đình|🍲|We have a family dinner.;lantern|đèn lồng|🏮|The lantern is red.;costume|trang phục hóa trang|🎃|I wear a costume.;celebrate|ăn mừng|🥳|We celebrate together.;vacation|kỳ nghỉ|🏖️|I love summer vacation.`,
`We celebrate the New Year with fireworks.|Chúng mình đón năm mới bằng pháo hoa.;Children get gifts on their birthday.|Trẻ em nhận quà vào sinh nhật.;Tet is the biggest festival in Vietnam.|Tết là lễ hội lớn nhất ở Việt Nam.`,
`What do you do at Tet?|Bạn làm gì vào dịp Tết?;We have a big family dinner.|Chúng mình ăn bữa cơm gia đình lớn.;Do you get gifts?|Bạn có được nhận quà không?;Yes, red envelopes with lucky money.|Có, bao lì xì có tiền mừng tuổi.`);
GL(4,'phone','Phone and Internet','Điện thoại và Internet','space','📱',
`phone|điện thoại|📱|My phone is new.;message|tin nhắn|💬|I send a message.;call|gọi điện|📞|I will call you tonight.;website|trang web|🌐|This website is useful.;password|mật khẩu|🔑|Do not share your password.;download|tải xuống|⬇️|I download a game.;battery|pin|🔋|My battery is low.;wifi|mạng wifi|📶|Is there free wifi here?`,
`Can you send me a message?|Bạn gửi tin nhắn cho mình được không?;My phone battery is almost empty.|Pin điện thoại của mình gần hết.;I will call you after dinner.|Mình sẽ gọi cho bạn sau bữa tối.`,
`What is the wifi password?|Mật khẩu wifi là gì?;It is on the wall.|Nó ở trên tường.;Thanks. Can I download this app?|Cảm ơn. Mình tải ứng dụng này được không?;Sure, but the connection is slow.|Được, nhưng kết nối hơi chậm.`);
GL(4,'hotel','Hotel and Travel','Khách sạn và du lịch','beach','🏨',
`hotel|khách sạn|🏨|The hotel is by the sea.;reservation|đặt phòng|📖|I have a reservation.;passport|hộ chiếu|🛂|Show your passport.;luggage|hành lý|🧳|My luggage is heavy.;ticket|vé|🎫|I buy two tickets.;airport|sân bay|🛫|The airport is far.;guide|hướng dẫn viên|🧭|The guide speaks English.;souvenir|quà lưu niệm|🎎|I buy a souvenir.`,
`I would like to book a room for two nights.|Mình muốn đặt một phòng hai đêm.;What time is check-out?|Mấy giờ phải trả phòng?;Please carry my luggage to the room.|Làm ơn mang hành lý lên phòng giúp tôi.`,
`Good evening. Do you have a reservation?|Chào buổi tối. Bạn có đặt phòng chưa?;Yes, under the name Lan.|Có, tên Lan.;Here is your key. Breakfast is at seven.|Chìa khóa của bạn đây. Bữa sáng lúc bảy giờ.;Thank you very much.|Cảm ơn rất nhiều.`);
GL(4,'people','Describing People','Miêu tả người','room','🧑',
`tall|cao|🦒|My brother is tall.;short|thấp|🐭|She is short.;kind|tốt bụng|🤗|My teacher is kind.;funny|hài hước|🤡|He is very funny.;shy|nhút nhát|🙈|The girl is shy.;strong|khỏe|💪|The man is strong.;young|trẻ|👶|My sister is young.;clever|thông minh|🧠|She is clever.`,
`My best friend is tall and funny.|Bạn thân của mình cao và hài hước.;He has short black hair.|Cậu ấy có tóc đen ngắn.;She is not shy, she is very friendly.|Cô ấy không nhút nhát mà rất thân thiện.`,
`What does your friend look like?|Bạn của bạn trông thế nào?;She is tall with long hair.|Cô ấy cao và có mái tóc dài.;What is she like?|Tính cách cô ấy thế nào?;She is kind and clever.|Cô ấy tốt bụng và thông minh.`);
GL(4,'comparing','Comparing Things','So sánh','meadow','⚖️',
`bigger|to hơn|🐘|An elephant is bigger than a cat.;smaller|nhỏ hơn|🐜|An ant is smaller than a bee.;faster|nhanh hơn|🐆|A car is faster than a bike.;slower|chậm hơn|🐢|A turtle is slower than a rabbit.;heavier|nặng hơn|🏋️|A stone is heavier than a leaf.;cheaper|rẻ hơn|💰|This bag is cheaper.;the best|tốt nhất|🥇|She is the best student.;the tallest|cao nhất|🏔️|Fansipan is the tallest mountain.`,
`My bag is bigger than yours.|Túi của mình to hơn túi của bạn.;This is the most beautiful beach.|Đây là bãi biển đẹp nhất.;Tom runs faster than me.|Tom chạy nhanh hơn mình.`,
`Which phone is better?|Điện thoại nào tốt hơn?;This one is cheaper but that one is faster.|Cái này rẻ hơn nhưng cái kia nhanh hơn.;I will buy the faster one.|Mình sẽ mua cái nhanh hơn.;Good choice!|Lựa chọn tốt!`);
GL(4,'lifeevents','Life Stories','Chuyện đã qua','city','📖',
`born|được sinh ra|👶|I was born in 2010.;graduate|tốt nghiệp|🎓|She graduated last year.;move|chuyển nhà|📦|We moved to a new house.;marry|kết hôn|💍|They married in May.;start school|bắt đầu đi học|🎒|I started school at six.;travel|đi du lịch|✈️|I traveled to Japan.;learn|học|📘|I learned to swim.;remember|nhớ|💭|I remember that day.`,
`I was born in Hanoi.|Mình sinh ra ở Hà Nội.;She moved to Da Nang two years ago.|Cô ấy chuyển đến Đà Nẵng hai năm trước.;We learned English when we were children.|Chúng mình học tiếng Anh khi còn nhỏ.`,
`Where were you born?|Bạn sinh ra ở đâu?;I was born in Hue, but I moved to Saigon.|Mình sinh ra ở Huế nhưng chuyển vào Sài Gòn.;When did you start learning English?|Bạn bắt đầu học tiếng Anh khi nào?;When I was seven.|Khi mình bảy tuổi.`);

/* ---------- Cấp 5 ---------- */
GL(5,'money','Money and Banking','Tiền bạc','city','💰',
`save|tiết kiệm|🐷|I save money every month.;spend|tiêu|💳|Do not spend too much.;borrow|mượn|🤝|Can I borrow ten dollars?;pay|trả tiền|💵|I pay by cash.;cost|có giá|🏷️|It costs five dollars.;account|tài khoản|🏦|I opened a bank account.;salary|lương|💼|His salary is good.;coin|đồng xu|🪙|I found a coin.`,
`How much does it cost?|Nó có giá bao nhiêu?;I am saving money for a new bike.|Mình đang tiết kiệm tiền mua xe đạp mới.;Could you lend me some money?|Bạn cho mình vay ít tiền được không?`,
`I would like to open a bank account.|Tôi muốn mở tài khoản ngân hàng.;Do you have your ID card?|Bạn có mang căn cước không?;Yes, here it is.|Có, đây ạ.;Great. Please fill in this form.|Tốt. Vui lòng điền vào mẫu này.`);
GL(5,'subjects','School Subjects','Môn học','room','🧪',
`math|toán|➕|I like math.;science|khoa học|🧪|Science is interesting.;history|lịch sử|🏺|History is about the past.;geography|địa lý|🌍|We study geography.;music|âm nhạc|🎵|We sing in music class.;art|mỹ thuật|🎨|Art is my favorite.;physical education|thể dục|🏃|Physical education is fun.;homework|bài tập về nhà|📝|I finish my homework.`,
`My favorite subject is science.|Môn học yêu thích của mình là khoa học.;We have math on Tuesday and Thursday.|Chúng mình học toán vào thứ Ba và thứ Năm.;I must finish my homework before dinner.|Mình phải làm xong bài tập trước bữa tối.`,
`What subject do you like best?|Bạn thích môn nào nhất?;I like history because it is interesting.|Mình thích lịch sử vì nó thú vị.;I prefer math. It is easy for me.|Mình thích toán hơn. Nó dễ với mình.;We are different!|Chúng mình khác nhau nhỉ!`);
GL(5,'cooking','Cooking','Nấu ăn','room','🍳',
`recipe|công thức|📜|This recipe is easy.;ingredient|nguyên liệu|🧂|We need three ingredients.;boil|luộc, đun sôi|♨️|Boil the eggs.;fry|chiên|🍳|Fry the fish.;chop|thái nhỏ|🔪|Chop the onions.;mix|trộn|🥣|Mix the flour and eggs.;oven|lò nướng|🔥|Put it in the oven.;tasty|ngon miệng|😋|The cake is tasty.`,
`First, chop the vegetables.|Đầu tiên, hãy thái rau.;Then fry them for five minutes.|Sau đó chiên chúng trong năm phút.;Finally, add some salt.|Cuối cùng, thêm một ít muối.`,
`What are you cooking?|Bạn đang nấu gì?;I am making fried rice.|Mình đang làm cơm chiên.;What do you need?|Bạn cần gì?;Eggs, rice, and some vegetables.|Trứng, cơm và một ít rau.`);
GL(5,'nature','Nature','Thiên nhiên','meadow','🌲',
`mountain|ngọn núi|⛰️|We climb the mountain.;river|dòng sông|🏞️|The river is long.;forest|khu rừng|🌲|Many animals live in the forest.;lake|cái hồ|🛶|We row a boat on the lake.;ocean|đại dương|🌊|The ocean is deep.;island|hòn đảo|🏝️|We visit an island.;desert|sa mạc|🏜️|The desert is dry.;sunrise|bình minh|🌅|The sunrise is beautiful.`,
`The river flows through the forest.|Dòng sông chảy qua khu rừng.;We saw a beautiful sunrise from the mountain.|Chúng mình ngắm bình minh đẹp từ trên núi.;Nature is important for all of us.|Thiên nhiên quan trọng với tất cả chúng ta.`,
`Where did you go on holiday?|Kỳ nghỉ bạn đã đi đâu?;We went to an island with white beaches.|Chúng mình đến một hòn đảo có bãi cát trắng.;Was the water warm?|Nước có ấm không?;Yes, and the sunset was amazing.|Có, và hoàng hôn thật tuyệt.`);
GL(5,'entertain','Music and Movies','Âm nhạc và phim ảnh','city','🎬',
`movie|bộ phim|🎬|I watched a funny movie.;actor|diễn viên|🎭|The actor is famous.;song|bài hát|🎶|This song is popular.;concert|buổi hòa nhạc|🎤|We went to a concert.;guitar|đàn ghi-ta|🎸|He plays the guitar.;ticket|vé|🎫|I bought two tickets.;comedy|phim hài|😂|I love comedy.;boring|chán|🥱|The film was boring.`,
`What kind of music do you like?|Bạn thích loại nhạc nào?;The movie was so funny that we laughed a lot.|Bộ phim vui đến mức chúng mình cười rất nhiều.;I have never been to a concert.|Mình chưa bao giờ đi xem hòa nhạc.`,
`Have you seen the new movie?|Bạn đã xem bộ phim mới chưa?;Yes, it was exciting.|Rồi, nó rất hấp dẫn.;Who is your favorite actor?|Diễn viên bạn thích nhất là ai?;I really like the main actor.|Mình rất thích nam chính.`);
GL(5,'social','Social Media','Mạng xã hội','space','📲',
`post|đăng bài|📝|I post a photo.;share|chia sẻ|🔗|Please share this video.;follow|theo dõi|👣|I follow my friends.;likes|lượt thích|👍|This photo got many likes.;comment|bình luận|💬|She wrote a comment.;photo|bức ảnh|📸|Take a photo.;video|video|🎥|I watch a video.;online|trực tuyến|🌐|We chat online.`,
`I post a photo every weekend.|Mình đăng ảnh vào mỗi cuối tuần.;Do not share your private information.|Đừng chia sẻ thông tin cá nhân.;She has more than a thousand followers.|Cô ấy có hơn một nghìn người theo dõi.`,
`Did you see my new post?|Bạn xem bài đăng mới của mình chưa?;Yes! I liked it and left a comment.|Rồi! Mình đã thích và bình luận.;Thanks! I took the photo yesterday.|Cảm ơn! Mình chụp ảnh đó hôm qua.;It looks great.|Trông tuyệt lắm.`);
GL(5,'plans','Plans and Invitations','Kế hoạch và lời mời','beach','🗓️',
`invite|mời|💌|I invite my friends.;accept|chấp nhận|✅|She accepted the invitation.;refuse|từ chối|❌|He refused politely.;weekend|cuối tuần|🛋️|What do you do at the weekend?;meet|gặp|🤝|Let us meet at six.;party|bữa tiệc|🎉|There is a party tonight.;free|rảnh|🕊️|Are you free tomorrow?;busy|bận|📚|I am busy this week.`,
`Are you free on Saturday?|Bạn có rảnh vào thứ Bảy không?;I am going to have a birthday party.|Mình sắp tổ chức tiệc sinh nhật.;I would love to come, but I am busy.|Mình rất muốn đến nhưng mình bận.`,
`Would you like to come to my party?|Bạn có muốn đến tiệc của mình không?;I would love to! When is it?|Mình rất muốn! Khi nào vậy?;On Saturday at seven.|Vào thứ Bảy lúc bảy giờ.;Great. See you there!|Tuyệt. Hẹn gặp bạn ở đó!`);
GL(5,'complaints','Problems and Complaints','Phàn nàn và sự cố','room','🛠️',
`broken|bị hỏng|🔨|The TV is broken.;late|trễ|⏰|The bus is late.;noisy|ồn ào|🔊|The room is noisy.;dirty|bẩn|🧹|The table is dirty.;refund|hoàn tiền|💱|I want a refund.;problem|vấn đề|⚠️|There is a problem.;apologize|xin lỗi|🙇|I apologize for the delay.;fix|sửa|🔧|Can you fix it?`,
`Excuse me, there is a problem with my room.|Xin lỗi, phòng của tôi có vấn đề.;The air conditioner does not work.|Máy lạnh không hoạt động.;I would like a refund, please.|Tôi muốn được hoàn tiền.`,
`I am sorry, but the TV is broken.|Xin lỗi, nhưng tivi bị hỏng.;I am very sorry. I will send someone.|Tôi rất xin lỗi. Tôi sẽ cử người đến.;How long will it take?|Mất bao lâu?;About ten minutes.|Khoảng mười phút.`);
