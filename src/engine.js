'use strict';
/* ============ 3D engine: scene, objects, characters, overlay ============ */
const FONT_D='"Baloo 2","Nunito",system-ui,sans-serif', FONT_B='"Nunito",system-ui,sans-serif';
const matCache={};
function M(c,o){const k=c+(o?JSON.stringify(o):'');return matCache[k]||(matCache[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.55,metalness:.04},o||{})))}
function mesh(geo,c,x,y,z,o){o=o||{};const m=new THREE.Mesh(geo,M(c,o.m));m.position.set(x||0,y||0,z||0);if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);m.castShadow=true;return m}
const sph=(r,c,x,y,z,o)=>mesh(new THREE.SphereGeometry(r,28,20),c,x,y,z,o);
const cyl=(a,b,h,c,x,y,z,o)=>mesh(new THREE.CylinderGeometry(a,b,h,28),c,x,y,z,o);
const bx=(w,h,d,c,x,y,z,o)=>mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,o);
const cn=(r,h,c,x,y,z,o)=>mesh(new THREE.ConeGeometry(r,h,28),c,x,y,z,o);
const tr=(r,t,c,x,y,z,o,arc)=>mesh(new THREE.TorusGeometry(r,t,14,36,arc||Math.PI*2),c,x,y,z,o);
const G=function(){const g=new THREE.Group();for(let i=0;i<arguments.length;i++)if(arguments[i])g.add(arguments[i]);return g};
const eye=(x,y,z,r)=>G(sph(r,'#ffffff',x,y,z),sph(r*.55,'#1b1b2f',x,y,z+r*.62));
function extrude(shape,depth,c,bev){const g=new THREE.ExtrudeGeometry(shape,{depth:depth,bevelEnabled:true,bevelThickness:bev||.08,bevelSize:bev||.08,bevelSegments:3,curveSegments:16});g.center();return mesh(g,c)}
function starShape(R,r){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,d=i%2?r:R,x=Math.cos(a)*d,y=Math.sin(a)*d;if(i)s.lineTo(x,y);else s.moveTo(x,y)}s.closePath();return s}
function heartShape(){const s=new THREE.Shape();s.moveTo(0,-1);s.bezierCurveTo(-.4,-.6,-1.2,-.2,-1.2,.45);s.bezierCurveTo(-1.2,1.05,-.4,1.25,0,.7);s.bezierCurveTo(.4,1.25,1.2,1.05,1.2,.45);s.bezierCurveTo(1.2,-.2,.4,-.6,0,-1);return s}
function textTex(txt,w,h,bg,fg,size){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.font='800 '+(size||h*.6)+'px '+FONT_D;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,w/2,h/2+h*.04);return new THREE.CanvasTexture(c)}
function cloudG(col){col=col||'#ffffff';const g=G();[[0,0,.9],[-.95,-.15,.7],[.95,-.1,.75],[.35,.5,.7],[-.4,.45,.6]].forEach(a=>g.add(sph(a[2],col,a[0],a[1],0,{s:[1,.85,.85]})));return g}

const OBJ={

 emoji:o=>{const e=o.e||'\u2B50',c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  x.font='170px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,128,138);
  const tex=new THREE.CanvasTexture(c),mat=new THREE.MeshBasicMaterial({map:tex,transparent:true}),f=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.9),mat),b=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.9),mat);
  f.position.set(0,1.2,.17);b.position.set(0,1.2,-.17);b.rotation.y=Math.PI;
  return G(cyl(1.18,1.18,.3,'#fff6dc',0,1.2,0,{r:[Math.PI/2,0,0]}),tr(1.2,.09,'#ffc233',0,1.2,0,{}),f,b)},
 ball:o=>{const c=o.tint||'#ff5d6c';return G(sph(1,c,0,0,0),tr(1.005,.05,'#ffffff',0,0,0,{}),tr(1.005,.05,'#ffffff',0,0,0,{r:[Math.PI/2,0,0]}),tr(1.005,.05,'#ffffff',0,0,0,{r:[0,Math.PI/2,0]}))},
 star:o=>G(extrude(starShape(1.1,.5),.35,o.tint||'#ffc233')),
 heart:o=>G(extrude(heartShape(),.4,o.tint||'#ff5d6c')),
 cat:()=>{const c='#f4a259',d='#e07b39';return G(sph(.9,c,0,.9,0,{s:[1,.95,1]}),sph(.7,c,0,2,.3),
  cn(.25,.5,c,-.42,2.6,.2,{r:[0,0,.25]}),cn(.25,.5,c,.42,2.6,.2,{r:[0,0,-.25]}),
  eye(-.27,2.12,.88,.15),eye(.27,2.12,.88,.15),sph(.08,'#ff7a90',0,1.95,.99),
  cyl(.012,.012,.7,'#444',-.65,1.92,.9,{r:[0,0,Math.PI/2+.1]}),cyl(.012,.012,.7,'#444',.65,1.92,.9,{r:[0,0,Math.PI/2-.1]}),
  tr(.6,.12,c,-.95,.8,-.2,{r:[0,Math.PI/2,0]},Math.PI),sph(.28,d,-.38,.2,.75,{s:[1,.6,1.2]}),sph(.28,d,.38,.2,.75,{s:[1,.6,1.2]}),
  bx(.5,.07,.02,d,0,1.45,.93,{r:[0,0,.1]}),bx(.5,.07,.02,d,0,1.2,.96,{r:[0,0,-.1]}))},
 dog:()=>{const c='#b9824b',l='#ecd0a6';return G(sph(.95,c,0,.95,0,{s:[1,.95,1.05]}),sph(.72,c,0,2.05,.3),sph(.4,l,0,1.88,.88,{s:[1,.8,1]}),sph(.13,'#222',0,2,1.22),
  sph(.3,'#7a4a22',-.72,2.1,.2,{s:[.55,1.2,.8],r:[0,0,.2]}),sph(.3,'#7a4a22',.72,2.1,.2,{s:[.55,1.2,.8],r:[0,0,-.2]}),
  eye(-.28,2.25,.9,.14),eye(.28,2.25,.9,.14),sph(.11,'#ff6b81',0,1.68,1.1,{s:[1,.5,1]}),
  cyl(.1,.16,.9,c,-.8,1.1,-.6,{r:[.6,0,.5]}),sph(.3,l,-.4,.2,.75,{s:[1,.6,1.2]}),sph(.3,l,.4,.2,.75,{s:[1,.6,1.2]}))},
 bird:()=>{const y='#ffd23f',w='#f2b705';return G(sph(.95,y,0,1,0),sph(.6,y,0,1.95,.3),cn(.18,.45,'#ff8c1a',0,1.88,.95,{r:[Math.PI/2,0,0]}),
  eye(-.26,2.1,.76,.13),eye(.26,2.1,.76,.13),sph(.5,w,-.92,1,0,{s:[.35,.8,.7]}),sph(.5,w,.92,1,0,{s:[.35,.8,.7]}),
  cn(.3,.7,w,0,.75,-1,{r:[-2,0,0]}),cyl(.05,.05,.4,'#ff8c1a',-.3,.15,.2),cyl(.05,.05,.4,'#ff8c1a',.3,.15,.2),sph(.14,'#ffb3c1',-.5,1.8,.8,{s:[1,.7,.4]}),sph(.14,'#ffb3c1',.5,1.8,.8,{s:[1,.7,.4]}))},
 fish:()=>{const o='#ff8a3d',d='#ff6a13';const g=G(sph(1,o,0,1,0,{s:[1.4,.9,.6]}),cn(.6,.9,d,-1.75,1,0,{r:[0,0,-Math.PI/2]}),cn(.35,.6,d,0,1.8,0),cn(.3,.5,d,.2,.3,.1,{r:[0,0,Math.PI]}),
  eye(.85,1.2,.42,.17),sph(.15,'#bfe9ff',1.6,2.3,0,{m:{transparent:true,opacity:.7}}),sph(.1,'#bfe9ff',1.9,2.7,0,{m:{transparent:true,opacity:.7}}),
  bx(.06,1.1,.02,'#fff',.3,1,.58,{m:{transparent:true,opacity:.7}}),bx(.06,1.1,.02,'#fff',-.3,1,.58,{m:{transparent:true,opacity:.7}}));g.rotation.y=.35;return g},
 duck:()=>{const y='#ffe14d',w='#f5c400';return G(sph(1,y,0,.95,0,{s:[1.15,.85,1]}),sph(.55,y,0,1.95,.45),sph(.3,'#ff9a1f',0,1.8,.98,{s:[1,.4,1]}),eye(-.27,2.1,.85,.12),eye(.27,2.1,.85,.12),
  sph(.5,w,-1.0,1,-.1,{s:[.3,.7,.9]}),sph(.5,w,1.0,1,-.1,{s:[.3,.7,.9]}),cn(.3,.5,y,0,1.1,-1.05,{r:[-1.8,0,0]}),bx(.4,.06,.55,'#ff9a1f',-.35,.04,.55),bx(.4,.06,.55,'#ff9a1f',.35,.04,.55))},
 rabbit:()=>G(sph(.9,'#ffffff',0,.9,0),sph(.62,'#ffffff',0,1.95,.25),sph(.22,'#ffffff',-.28,3.05,.1,{s:[.6,2.1,.5],r:[0,0,.12]}),sph(.22,'#ffffff',.28,3.05,.1,{s:[.6,2.1,.5],r:[0,0,-.12]}),
  sph(.12,'#ffb3c1',-.28,3.05,.22,{s:[.5,1.9,.3],r:[0,0,.12]}),sph(.12,'#ffb3c1',.28,3.05,.22,{s:[.5,1.9,.3],r:[0,0,-.12]}),
  eye(-.25,2.05,.78,.11),eye(.25,2.05,.78,.11),sph(.09,'#ff8fa3',0,1.9,.86),sph(.28,'#ffffff',0,.8,-.9),sph(.28,'#f1f3f5',-.38,.2,.75,{s:[1,.6,1.2]}),sph(.28,'#f1f3f5',.38,.2,.75,{s:[1,.6,1.2]}),
  sph(.14,'#ffb3c1',-.5,1.78,.7,{s:[1,.7,.4]}),sph(.14,'#ffb3c1',.5,1.78,.7,{s:[1,.7,.4]})),
 apple:()=>G(sph(1,'#ef3b3b',0,1,0,{s:[1,.93,1]}),cyl(.06,.08,.4,'#6b4423',0,2,0),sph(.28,'#3ccf4e',.3,2.05,0,{s:[1.4,.3,.7],r:[0,0,.5]}),sph(.18,'#ff9a9a',.5,1.5,.75,{s:[.6,1,.4]})),
 banana:()=>{const R=1.3,a1=Math.PI*1.5-Math.PI*.35,a2=Math.PI*1.5+Math.PI*.35;return G(tr(R,.3,'#ffe135',0,0,0,{r:[0,0,a1]},Math.PI*.7),
  sph(.3,'#6b4a12',Math.cos(a1)*R,Math.sin(a1)*R,0),sph(.3,'#6b4a12',Math.cos(a2)*R,Math.sin(a2)*R,0))},
 orange:()=>G(sph(1,'#ff9f1c',0,1,0),cyl(.05,.07,.25,'#6b4423',0,2,0),sph(.3,'#3ccf4e',.3,2,0,{s:[1.4,.3,.7],r:[0,0,.4]}),sph(.2,'#ffc46b',.5,1.5,.75,{s:[.6,1,.4]})),
 strawberry:()=>{const g=G(sph(.95,'#e63946',0,1,0,{s:[1,1.1,1]}));for(let i=0;i<22;i++){const y=-.8+i*.075,r=Math.sqrt(Math.max(0,1-y*y)),a=i*2.4;g.add(sph(.05,'#ffe08a',Math.cos(a)*r*.95,1+y*1.05,Math.sin(a)*r*.95))}
  for(let i=0;i<6;i++){const a=i*Math.PI/3;g.add(sph(.28,'#2fb344',Math.cos(a)*.35,2.02,Math.sin(a)*.35,{s:[1,.25,.6],r:[0,-a,0]}))}g.add(cyl(.05,.05,.3,'#2fb344',0,2.2,0));return g},
 grapes:()=>{const g=G(cyl(.06,.06,.5,'#6b4423',0,2.9,0),sph(.3,'#3ccf4e',.3,2.85,0,{s:[1.4,.3,.7],r:[0,0,.4]}));for(let r=0;r<4;r++){const n=4-r;for(let i=0;i<n;i++)g.add(sph(.4,'#7b3fa0',(i-(n-1)/2)*.75,.55+r*.65,(i%2?.18:-.18),{}))}return g},
 watermelon:()=>{const g=G();const dome=mesh(new THREE.SphereGeometry(1.25,32,20,0,Math.PI*2,0,Math.PI/2),'#2f9e44',0,0,0,{r:[Math.PI,0,0]});g.add(dome);
  const face=new THREE.Mesh(new THREE.CircleGeometry(1.25,40),M('#ff4d6d'));face.rotation.x=-Math.PI/2;face.position.y=.005;g.add(face);
  const ring=new THREE.Mesh(new THREE.RingGeometry(1.08,1.25,40),M('#d8f5a2'));ring.rotation.x=-Math.PI/2;ring.position.y=.01;g.add(ring);
  [[-.5,.2],[.3,.5],[.6,-.3],[-.2,-.5],[0,0],[-.7,-.2],[.2,-.1]].forEach(p=>g.add(sph(.09,'#222',p[0],.03,p[1],{s:[1,.4,1.6]})));g.rotation.x=.6;return g},
 person:o=>{const sc=o.scale||1,skin=o.skin||'#ffd7b0',shirt=o.tint||'#4f7cff',hair=o.hair||'#3a2a1a';
  const g=G(cyl(.55,.7,1.3,shirt,0,1,0),sph(.62,skin,0,2.15,0),sph(.66,hair,0,2.38,-.08,{s:[1,.85,1]}),sph(.07,'#222',-.22,2.2,.55),sph(.07,'#222',.22,2.2,.55),
   tr(.16,.03,'#c0392b',0,2.02,.57,{r:[0,0,Math.PI]},Math.PI),cyl(.12,.12,1,shirt,-.8,1.1,0,{r:[0,0,.25]}),cyl(.12,.12,1,shirt,.8,1.1,0,{r:[0,0,-.25]}),
   sph(.15,skin,-.93,.58,0),sph(.15,skin,.93,.58,0),cyl(.2,.2,.9,'#2d3a6d',-.25,.15,0),cyl(.2,.2,.9,'#2d3a6d',.25,.15,0),sph(.14,'#ff9aa8',-.4,2.05,.5,{s:[1,.7,.4]}),sph(.14,'#ff9aa8',.4,2.05,.5,{s:[1,.7,.4]}));
  if(o.long)g.add(sph(.6,hair,0,1.95,-.35,{s:[1.05,1.3,.6]}));
  if(o.glasses)g.add(tr(.14,.02,'#333',-.22,2.22,.6),tr(.14,.02,'#333',.22,2.22,.6));
  g.scale.setScalar(sc);const w=G(g);return w},
 cake:()=>{const g=G(cyl(1.2,1.2,.7,'#ffb3c7',0,.35,0),cyl(1.22,1.22,.2,'#ffffff',0,.78,0),cyl(.8,.8,.55,'#ffd6e0',0,1.15,0),cyl(.82,.82,.14,'#ffffff',0,1.46,0),
   cyl(.07,.07,.5,'#4dabf7',0,1.8,0),sph(.1,'#ffd43b',0,2.15,0,{s:[.8,1.4,.8],m:{emissive:'#ffb000',emissiveIntensity:.8}}));
  for(let i=0;i<6;i++){const a=i*Math.PI/3;g.add(sph(.14,'#e03131',Math.cos(a)*.6,1.6,Math.sin(a)*.6))}return g},
 pizza:()=>{const g=G();const w=Math.PI/3;const crust=mesh(new THREE.CylinderGeometry(1.5,1.5,.18,32,1,false,0,w),'#f4b860',0,0,0);const cheese=mesh(new THREE.CylinderGeometry(1.36,1.36,.2,32,1,false,0,w),'#ffd54a',0,.02,0);
  const sl=G(crust,cheese);[[0,-.55],[-.25,-1.0],[.25,-1.0]].forEach(p=>sl.add(cyl(.2,.2,.08,'#c92a2a',p[0],.14,p[1])));sl.rotation.y=Math.PI-Math.PI/6;g.add(sl);g.rotation.x=.45;return g},
 cup:()=>G(cyl(.85,.65,1.7,'#bfe9ff',0,.85,0,{m:{transparent:true,opacity:.35}}),cyl(.8,.62,1.3,'#ff9f1c',0,.7,0),cyl(.06,.06,1.6,'#ff4d6d',.3,1.7,0,{r:[0,0,-.3]}),cyl(.42,.42,.08,'#ff9f1c',.85,1.6,0,{r:[Math.PI/2,0,0]}),tr(.42,.04,'#ffd8a8',.85,1.6,0,{})),
 egg:()=>G(sph(.75,'#fff8e7',0,1.35,0,{s:[1,1.25,1]}),cyl(.55,.4,.5,'#4dabf7',0,.4,0),cyl(.6,.6,.08,'#339af0',0,.68,0)),
 bread:()=>{const g=G(sph(1.3,'#d9993d',0,.9,0,{s:[1,.62,.7]}));[-.6,0,.6].forEach(x=>{const y=.9+.806*Math.sqrt(Math.max(0,1-(x/1.3)*(x/1.3)));g.add(bx(.14,.06,.7,'#f3c98a',x,y-.02,0,{r:[0,.5,0]}))});return g},
 icecream:()=>G(cn(.7,1.8,'#e8b05a',0,.9,0,{r:[Math.PI,0,0]}),sph(.8,'#ff9ec7',0,2.05,0),sph(.75,'#fff1d6',0,2.85,0),sph(.18,'#e03131',0,3.6,0)),
 chair:()=>{const c='#c98b4b',d='#a86f35';return G(bx(1.6,.2,1.6,c,0,1.1,0),bx(1.6,1.6,.2,c,0,1.9,-.7),cyl(.1,.1,1.1,d,-.65,.55,.65),cyl(.1,.1,1.1,d,.65,.55,.65),cyl(.1,.1,1.1,d,-.65,.55,-.65),cyl(.1,.1,1.1,d,.65,.55,-.65))},
 table:()=>G(bx(3,.25,1.8,'#c98b4b',0,1.5,0),cyl(.12,.12,1.4,'#a86f35',-1.3,.7,.7),cyl(.12,.12,1.4,'#a86f35',1.3,.7,.7),cyl(.12,.12,1.4,'#a86f35',-1.3,.7,-.7),cyl(.12,.12,1.4,'#a86f35',1.3,.7,-.7)),
 lamp:()=>G(cyl(.7,.8,.2,'#495057',0,.1,0),cyl(.07,.07,1.8,'#868e96',0,1.1,0),cyl(.55,.95,.95,'#ffe066',0,2.3,0,{m:{emissive:'#ffd43b',emissiveIntensity:.5}})),
 book:()=>{const lab=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.6),new THREE.MeshStandardMaterial({map:textTex('ABC',256,140,'#ffffff','#3d6bff')}));lab.position.set(0,.45,.19);
  const g=G(bx(1.6,2.1,.35,'#3d6bff',0,0,0),bx(1.45,1.95,.28,'#ffffff',.07,0,.02),bx(.12,2.1,.37,'#2b4fd1',-.78,0,0),lab);g.rotation.set(.1,-.45,0);return G(g)},
 box:()=>{const c='#d9a066';return G(bx(2.2,.15,2.2,c,0,.075,0),bx(2.2,1.1,.15,c,0,.6,1.025),bx(2.2,1.1,.15,c,0,.6,-1.025),bx(.15,1.1,2.2,c,-1.025,.6,0),bx(.15,1.1,2.2,c,1.025,.6,0))},
 clock:o=>{const g=G(cyl(1.2,1.2,.3,'#ffffff',0,0,0,{r:[Math.PI/2,0,0]}),tr(1.2,.12,'#ff5d6c',0,0,0,{}),sph(.38,'#ffc233',-.85,1.1,0),sph(.38,'#ffc233',.85,1.1,0),cyl(.05,.05,.5,'#555',0,1.45,0));
  for(let i=0;i<12;i++){const a=i*Math.PI/6;g.add(sph(.07,'#333',Math.sin(a)*.95,Math.cos(a)*.95,.17))}
  const t=o.time||[10,10],hh=G(bx(.13,.6,.06,'#222',0,.27,.2)),mm=G(bx(.09,.88,.06,'#444',0,.42,.24));hh.rotation.z=-((t[0]%12)+t[1]/60)/12*Math.PI*2;mm.rotation.z=-t[1]/60*Math.PI*2;g.add(hh,mm,sph(.1,'#222',0,0,.27));
  if(o.ring)g.userData.update=(dt,T)=>{g.rotation.z=Math.sin(T*30)*.08};return g},
 backpack:()=>G(sph(1,'#ff7a59',0,1,-.05,{s:[.95,1.15,.75]}),bx(1.1,.7,.3,'#ff9a7a',0,.6,.62),tr(.35,.07,'#8a3b2a',0,2.2,-.05,{},Math.PI),bx(1.5,.05,.05,'#ffffff',0,1.5,.68),sph(.1,'#ffffff',.2,1.5,.7),bx(.14,1.2,.1,'#5f2a1c',-.7,.9,.35),bx(.14,1.2,.1,'#5f2a1c',.7,.9,.35)),
 moon:()=>{const g=G(sph(1.2,'#fff3b0',0,1.2,0,{m:{emissive:'#ffe066',emissiveIntensity:.25}}),sph(.22,'#f0e08a',-.4,1.55,1.05,{s:[1,1,.3]}),sph(.3,'#f0e08a',.5,.9,1,{s:[1,1,.3]}),sph(.16,'#f0e08a',.1,1.95,1.1,{s:[1,1,.3]}),eye(-.35,1.3,1.1,.1),eye(.35,1.3,1.1,.1),tr(.2,.03,'#c08a00',0,1.0,1.15,{r:[0,0,Math.PI]},Math.PI));return g},
 sun:()=>{const rays=G();for(let i=0;i<12;i++){const a=i*Math.PI/6;rays.add(cn(.16,.55,'#ffb000',Math.cos(a)*1.45,Math.sin(a)*1.45,0,{r:[0,0,a-Math.PI/2]}))}
  const g=G(sph(1,'#ffc928',0,0,0,{m:{emissive:'#ffb000',emissiveIntensity:.6}}),rays,eye(-.32,.2,.85,.14),eye(.32,.2,.85,.14),tr(.3,.05,'#c2410c',0,-.15,.95,{r:[0,0,Math.PI]},Math.PI),sph(.14,'#ff9aa8',-.6,-.1,.8,{s:[1,.7,.4]}),sph(.14,'#ff9aa8',.6,-.1,.8,{s:[1,.7,.4]}));
  g.userData.update=(dt)=>{rays.rotation.z+=dt*.5};return g},
 cloud:()=>G(cloudG('#ffffff'),eye(-.3,.05,.78,.12),eye(.3,.05,.78,.12),tr(.18,.03,'#6b7280',0,-.22,.8,{r:[0,0,Math.PI]},Math.PI)),
 raincloud:()=>{const g=G(cloudG('#9aa5b8'),eye(-.3,.05,.78,.12),eye(.3,.05,.78,.12));const ds=[];for(let i=0;i<9;i++){const d=sph(.1,'#4dabf7',-1.3+i*.33,-.8-(i%3)*.5,(i%2?.2:-.2),{s:[.6,1.3,.6]});ds.push(d);g.add(d)}
  g.userData.update=(dt)=>{ds.forEach(d=>{d.position.y-=dt*2.4;if(d.position.y<-2.6)d.position.y=-.5})};return g},
 snowman:()=>{const g=G(sph(1,'#ffffff',0,1,0),sph(.72,'#ffffff',0,2.4,0),sph(.52,'#ffffff',0,3.35,0),cn(.08,.5,'#ff8c1a',0,3.35,.55,{r:[Math.PI/2,0,0]}),eye(-.2,3.5,.45,.09),eye(.2,3.5,.45,.09),
   sph(.07,'#222',0,2.6,.7),sph(.07,'#222',0,2.3,.72),sph(.07,'#222',0,2,.74),tr(.5,.1,'#e03131',0,2.9,0,{r:[Math.PI/2,0,0]}),cyl(.4,.4,.5,'#222',0,4,0),cyl(.62,.62,.06,'#222',0,3.78,0));
  const fl=[];for(let i=0;i<14;i++){const f=sph(.07,'#ffffff',-1.8+(i*.27),Math.random()*4,(i%3-1)*.5);fl.push(f);g.add(f)}
  g.userData.update=(dt,T)=>{fl.forEach((f,i)=>{f.position.y-=dt*(.8+(i%3)*.3);f.position.x+=Math.sin(T*2+i)*dt*.3;if(f.position.y<-.1)f.position.y=4.2})};return g},
 plane:()=>{const g=G(cyl(.5,.5,3,'#ffffff',0,0,0,{r:[0,0,Math.PI/2]}),sph(.5,'#ffffff',1.5,0,0),cn(.5,1,'#ffffff',-1.95,0,0,{r:[0,0,Math.PI/2]}),bx(.9,.1,3.8,'#3d6bff',.1,-.1,0),bx(.6,.8,.1,'#3d6bff',-1.5,.6,0,{r:[0,0,.3]}),bx(.5,.08,1.5,'#3d6bff',-1.6,.05,0),bx(3,.12,.02,'#ff5d6c',0,-.1,.5));
  for(let i=0;i<6;i++)g.add(sph(.12,'#74c0fc',-.8+i*.4,.12,.48));g.rotation.set(0,-.55,.08);return G(g)},
 car:o=>{const c=o.tint||'#ef4444';const g=G(bx(3,.8,1.5,c,0,.65,0),bx(1.7,.7,1.4,c,-.1,1.35,0),bx(1.74,.45,1.42,'#bfe9ff',-.1,1.38,0),sph(.15,'#ffe066',1.5,.7,.45),sph(.15,'#ffe066',1.5,.7,-.45),sph(.12,'#ff3b30',-1.5,.7,.45),sph(.12,'#ff3b30',-1.5,.7,-.45));
  [[-1,.75],[1,.75],[-1,-.75],[1,-.75]].forEach(p=>{g.add(cyl(.45,.45,.3,'#222',p[0],.45,p[1],{r:[Math.PI/2,0,0]}));g.add(cyl(.22,.22,.32,'#adb5bd',p[0],.45,p[1],{r:[Math.PI/2,0,0]}))});g.rotation.y=-.55;return G(g)},
 rocket:()=>{const fl=cn(.4,1,'#ffa94d',0,-.3,0,{r:[Math.PI,0,0],m:{emissive:'#ff922b',emissiveIntensity:1}});const g=G(cyl(.7,.7,2.4,'#f1f3f5',0,1.4,0),cn(.7,1.2,'#ff5d6c',0,3.2,0),sph(.3,'#74c0fc',0,1.8,.62),tr(.3,.06,'#868e96',0,1.8,.62,{}),
   bx(.15,1,.9,'#ff5d6c',-.85,.6,0,{r:[0,0,.35]}),bx(.15,1,.9,'#ff5d6c',.85,.6,0,{r:[0,0,-.35]}),bx(.9,1,.15,'#ff5d6c',0,.6,.85),fl,cyl(.7,.7,.1,'#ff5d6c',0,.2,0));
  g.userData.update=(dt,T)=>{fl.scale.y=1+Math.sin(T*25)*.25};return g},
 house:()=>{const g=G(bx(2.4,1.6,2,'#ffd8a8',0,.8,0),mesh(new THREE.ConeGeometry(1.9,1.1,4),'#e8590c',0,2.15,0,{r:[0,Math.PI/4,0]}),bx(.6,1,.08,'#8d5524',0,.5,1.02),bx(.5,.5,.08,'#a5d8ff',-.8,1,1.02),bx(.5,.5,.08,'#a5d8ff',.8,1,1.02),bx(.35,.8,.35,'#c2410c',.7,2.4,-.2));g.rotation.y=-.4;return G(g)},
 tree:()=>G(cyl(.25,.35,1.4,'#8d5524',0,.7,0),sph(1.1,'#37b24d',0,2,0),sph(.8,'#2f9e44',.6,1.6,.3),sph(.75,'#40c057',-.6,1.7,-.2)),
 bed:()=>{const g=G(bx(2.8,.5,1.8,'#c98b4b',0,.4,0),bx(2.6,.45,1.6,'#e7f5ff',0,.85,0),bx(1.7,.3,1.65,'#4dabf7',.45,1.1,0),sph(.45,'#ffffff',-.85,1.15,0,{s:[1.2,.5,1.5]}),bx(.15,1.3,1.8,'#a86f35',-1.4,1,0),bx(.15,.7,1.8,'#a86f35',1.4,.7,0));g.rotation.y=-.5;return G(g)},
 flower:()=>{const g=G(cyl(.05,.05,1.2,'#2f9e44',0,.6,0),sph(.2,'#ffd43b',0,1.3,.1));for(let i=0;i<6;i++){const a=i*Math.PI/3;g.add(sph(.22,'#ff8787',Math.cos(a)*.35,1.3+Math.sin(a)*.35,0,{s:[1,1,.5]}))}return g}
};
function fit(g,h){g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(g),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());const k=h/Math.max(s.y,s.x*.8,s.z,.001);
  g.position.sub(c);const w=new THREE.Group();w.add(g);w.scale.setScalar(k);w.userData.k=k;w.userData.inner=g;if(g.userData.update)w.userData.update=g.userData.update;return w}
function makeObj(key,o,h){o=o||{};const f=OBJ[key];if(!f)return fit(OBJ.emoji(Object.assign({},o,{e:key})),h||2.2);return fit(f(o),h||2.2)}
function disposeTree(o){o.traverse(m=>{if(m.geometry)m.geometry.dispose()})}

/* characters */
function makeChar(P){
  const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);
  rig.add(sph(1,P.body,0,1.1,0,{s:[1,1.12,.95]}),sph(.75,P.belly,0,.9,.42,{s:[1,1.05,.55]}));
  const eL=G(sph(.27,'#ffffff',0,0,0),sph(.14,'#1b1b2f',0,0,.17)),eR=G(sph(.27,'#ffffff',0,0,0),sph(.14,'#1b1b2f',0,0,.17));
  eL.position.set(-.34,1.62,.78);eR.position.set(.34,1.62,.78);rig.add(eL,eR);
  rig.add(sph(.16,'#ff8fa3',-.64,1.32,.7,{s:[1,.7,.4]}),sph(.16,'#ff8fa3',.64,1.32,.7,{s:[1,.7,.4]}));
  const mouth=sph(.17,'#6b1d2a',0,1.2,.93,{s:[1.3,.4,.4]});rig.add(mouth);
  const mkArm=(x)=>{const a=G();a.position.set(x,1.25,.05);a.add(sph(.24,P.body,0,-.32,0,{s:[.8,1.4,.8]}));rig.add(a);return a};
  const aL=mkArm(-.98),aR=mkArm(.98);
  const fL=sph(.3,P.feet,-.42,.14,.38,{s:[1,.5,1.35]}),fR=sph(.3,P.feet,.42,.14,.38,{s:[1,.5,1.35]});rig.add(fL,fR);
  if(P.antenna){rig.add(cyl(.04,.04,.5,'#cfd8ff',0,2.35,0),sph(.15,'#ffd43b',0,2.65,0,{m:{emissive:'#ffb000',emissiveIntensity:.6}}))}
  if(P.ears){rig.add(cn(.28,.6,P.body,-.55,2.15,0,{r:[0,0,.35]}),cn(.28,.6,P.body,.55,2.15,0,{r:[0,0,-.35]}))}
  const hold=G();hold.position.set(0,1.0,1.1);rig.add(hold);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(1.15,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.18}));sh.rotation.x=-Math.PI/2;sh.position.y=.012;root.add(sh);
  root.traverse(m=>{if(m.isMesh&&m.material&&m.material.color&&m.geometry.type!=='CircleGeometry')m.material=m.material.clone()});
  const parts={body:[],belly:[],feet:[]},hx=c=>new THREE.Color(c).getHex();
  root.traverse(m=>{if(!m.isMesh||!m.material.color)return;const h=m.material.color.getHex();if(h===hx(P.body))parts.body.push(m);else if(h===hx(P.belly))parts.belly.push(m);else if(h===hx(P.feet))parts.feet.push(m)});
  const acc=new THREE.Group();rig.add(acc);
  return {root:root,rig:rig,eL:eL,eR:eR,mouth:mouth,aL:aL,aR:aR,fL:fL,fR:fR,hold:hold,ph:Math.random()*6,tx:0,look:0,gx:0,gc:0,held:null,zs:null,parts:parts,acc:acc,P:P};
}
const ACC={
 cap:(c)=>G(sph(.86,c,0,2.0,.02,{s:[1,.62,1]}),bx(.9,.08,.55,c,0,1.86,.88,{r:[.15,0,0]})),
 beanie:(c)=>G(sph(.88,c,0,2.0,0,{s:[1,.7,1]}),sph(.17,'#ffffff',0,2.62,0)),
 party:(c)=>G(cn(.55,1.0,c,0,2.75,0),sph(.1,'#ffd43b',0,3.3,0)),
 crown:()=>{const g=G(cyl(.55,.6,.35,'#ffc233',0,2.4,0));for(let i=0;i<5;i++){const a=i*Math.PI*2/5;g.add(cn(.13,.4,'#ffc233',Math.cos(a)*.5,2.75,Math.sin(a)*.5))}return g},
 chef:()=>G(cyl(.55,.6,.45,'#ffffff',0,2.35,0),sph(.62,'#ffffff',0,2.8,0,{s:[1,.8,1]})),
 helmet:(c)=>G(sph(.9,c,0,2.0,0,{s:[1,.7,1]}),bx(1.9,.1,1.3,c,0,1.88,.1)),
 bow:(c)=>G(cn(.28,.55,c,-.42,2.45,.1,{r:[0,0,1.2]}),cn(.28,.55,c,.42,2.45,.1,{r:[0,0,-1.2]}),sph(.14,c,0,2.45,.1)),
 glasses:()=>G(tr(.3,.045,'#2b2b44',-.34,1.62,.98,{}),tr(.3,.045,'#2b2b44',.34,1.62,.98,{}),bx(.12,.04,.04,'#2b2b44',0,1.65,1.0)),
 shades:()=>G(sph(.3,'#1b1b2f',-.34,1.62,.96,{s:[1,.8,.35]}),sph(.3,'#1b1b2f',.34,1.62,.96,{s:[1,.8,.35]}),bx(.2,.05,.05,'#1b1b2f',0,1.66,1.0)),
 scarf:(c)=>G(tr(.86,.2,c,0,.78,.05,{r:[Math.PI/2,0,0]}),bx(.3,.8,.12,c,.55,.35,.95,{r:[0,0,.12]})),
 bowtie:(c)=>G(cn(.22,.4,c,-.28,.82,.95,{r:[0,0,1.57]}),cn(.22,.4,c,.28,.82,.95,{r:[0,0,-1.57]}),sph(.1,c,0,.82,.97)),
 phones:(c)=>G(tr(1.0,.07,c,0,1.55,0,{},Math.PI),cyl(.2,.2,.18,c,-1.0,1.5,0,{r:[0,0,Math.PI/2]}),cyl(.2,.2,.18,c,1.0,1.5,0,{r:[0,0,Math.PI/2]})),
 bag:(c)=>G(bx(1.0,1.2,.4,c,0,1.0,-.95),bx(.8,.4,.1,'#ffffff',0,.8,-.72)),
 apron:(c)=>G(bx(1.0,1.05,.08,c,0,.85,.98),bx(.5,.4,.08,c,0,1.55,.9)),
 flowers:()=>{const g=G();for(let i=0;i<7;i++){const a=-1.2+i*.4;g.add(sph(.14,['#ff8fab','#ffd43b','#ffffff'][i%3],Math.sin(a)*.85,1.95+Math.cos(a)*.35,.35))}return g},
 medal:()=>G(cyl(.2,.2,.06,'#ffc233',0,.75,1.0,{r:[Math.PI/2,0,0]}),bx(.08,.5,.03,'#ff5470',0,1.0,.97))
};
function dress(ch,o){
  o=o||{};const P=ch.P,set=(arr,c)=>arr.forEach(m=>m.material.color.set(c));
  set(ch.parts.body,o.body||P.body);set(ch.parts.belly,o.belly||P.belly);set(ch.parts.feet,o.feet||P.feet);
  while(ch.acc.children.length){const k=ch.acc.children.pop();disposeTree(k)}
  (o.acc||[]).forEach(a=>{const f=ACC[a[0]];if(f)ch.acc.add(f(a[1]||'#ff5470'))});
}
function setHeld(ch,key){if(ch.heldKey===key)return;ch.heldKey=key;if(ch.held){ch.hold.remove(ch.held);disposeTree(ch.held);ch.held=null}if(key){const o=makeObj(key,{},.9);ch.hold.add(o);ch.held=o}}
function zzz(){const g=new THREE.Group();for(let i=0;i<3;i++){const t=textTex('Z',64,64,'#00000000','#fff');const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.font='800 52px '+FONT_D;x.fillStyle='#ffffff';x.strokeStyle='#3d6bff';x.lineWidth=6;x.textAlign='center';x.textBaseline='middle';x.strokeText('Z',32,34);x.fillText('Z',32,34);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));sp.userData.i=i;g.add(sp)}return g}
function charUpdate(ch,T,dt,st){
  const r=ch.rig;let jump=0,spin=0,lean=0,sy=1,rz=0,px=0;const act=st.act,ph=ch.ph;
  let aLx=0,aRx=0,aLz=-.35+Math.sin(T*2+ph)*.04,aRz=.35-Math.sin(T*2+ph)*.04,fLz=.38,fRz=.38,eyeS=1,mouthOpen=.38,holdY=1.0;
  const bob=Math.sin(T*2.2+ph)*.035;
  if(act==='wave'){aRz=2.45+Math.sin(T*9)*.35;jump=Math.abs(Math.sin(T*3))*.05}
  else if(act==='run'){const s=Math.sin(T*9);jump=Math.abs(s)*.3;aLx=s*.95;aRx=-s*.95;fLz=.38+s*.35;fRz=.38-s*.35;lean=.18}
  else if(act==='jump'){const s=Math.abs(Math.sin(T*3.2));jump=s*1.35;sy=1+(s>.9?.0:0)+(1-s)*-.06;aLz=-2.3;aRz=2.3}
  else if(act==='dance'){const s=Math.sin(T*6);spin=Math.sin(T*3)*.7;jump=Math.abs(s)*.22;aRz=1.9+s*.6;aLz=-1.9+s*.6;rz=Math.sin(T*3)*.08}
  else if(act==='sleep'){rz=-1.3;px=.95;jump=-.02;eyeS=.06;mouthOpen=.3+Math.sin(T*1.6)*.1;aLz=-.2;aRz=.2}
  else if(act==='read'){aLx=-1.0;aRx=-1.0;aLz=-.25;aRz=.25;lean=.08;holdY=1.0}
  else if(act==='eat'){const s=Math.abs(Math.sin(T*2.4));aRx=-1.3;aRz=.2;holdY=1.0+s*.55;mouthOpen=.3+Math.abs(Math.sin(T*8))*.4}
  else if(act==='point'){aRz=1.15+Math.sin(T*3)*.06;aRx=-.5;lean=.05;rz=-.04}
  else if(act==='think'){aLx=-1.7;aLz=.05;rz=.1;eyeS=1}
  else if(act==='clap'){const s=Math.sin(T*12);aLx=-1.1;aRx=-1.1;aLz=.35+s*.3;aRz=-.35-s*.3;jump=Math.abs(Math.sin(T*6))*.1}
  else if(act==='explain'){const s=Math.sin(T*2.6);aRz=.9+s*.35;aLz=-.5-s*.2;aRx=-.4;rz=s*.03}
  else if(act==='nod'){jump=Math.abs(Math.sin(T*4))*.07;lean=.1+Math.sin(T*4)*.08;aRz=.5}
  else if(act==='cheer'){const s=Math.abs(Math.sin(T*5));jump=s*.5;aLz=-2.6;aRz=2.6}
  if(st.talk&&act!=='eat')mouthOpen=.3+Math.abs(Math.sin(T*13+ph))*.85;
  r.position.set(px,jump+bob,0);r.rotation.z=rz;r.rotation.x=lean;
  r.rotation.y+=((spin+st.look)-r.rotation.y)*Math.min(1,dt*6);r.scale.set(1,sy,1);
  ch.aL.rotation.set(aLx,0,aLz);ch.aR.rotation.set(aRx,0,aRz);ch.fL.position.z=fLz;ch.fR.position.z=fRz;
  const gz=st.gx!=null?st.gx:0;ch.gc+=(gz-ch.gc)*Math.min(1,dt*6);
  [ch.eL,ch.eR].forEach(e=>{const pu=e.children[1];if(pu){pu.position.x=ch.gc*.085;pu.position.y=Math.sin(T*.9+ph)*.012+.012}});
  const bl=((T*.7+ph)%4.2)<.12?.1:1;ch.eL.scale.y=ch.eR.scale.y=Math.min(bl,eyeS);
  ch.mouth.scale.y=mouthOpen;ch.hold.position.y=holdY;ch.hold.rotation.x=act==='read'?-.35:0;
  if(act==='sleep'){if(!ch.zs){ch.zs=zzz();ch.root.add(ch.zs)}ch.zs.visible=true;ch.zs.children.forEach(s=>{const p=((T*.5+s.userData.i*.33)%1);s.position.set(1.4+p*.9,2+p*1.6,0);s.scale.setScalar(.5+p*.7);s.material.opacity=1-p})}else if(ch.zs)ch.zs.visible=false;
}

/* ============ Engine ============ */
const Eng=(function(){
  const comp=document.createElement('canvas');comp.id='stage';comp.className='land';const cx=comp.getContext('2d');
  let CW=1280,CH=720,ok=true,renderer,scene,camera,L={},T=0,last=0,cur=null,props=[],tilesOn=false,bgG=null,themeName='',charsTalk=null,leoOn=false;
  const LOW=(()=>{try{const ua=navigator.userAgent||'';const mob=/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<900);return mob||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4}catch(e){return false}})();
  let scaleNow=1,lastDraw=0;
  const out={low:LOW,frames:0,comp:comp,sp:null,cardS:null,rec:false,recProg:0,wm:'',showChip:true,subMode:'both',lessonTitle:'',partTitle:'',onPop:null,ready:false,fmt:'16:9'};
  const mimi=makeCharSafe({body:'#4f7cff',belly:'#dbe7ff',feet:'#2f55d4',antenna:true});
  const leo=makeCharSafe({body:'#ffb84d',belly:'#fff1cc',feet:'#e0902b',ears:true});
  function makeCharSafe(p){try{return makeChar(p)}catch(e){return null}}
  try{
    renderer=new THREE.WebGLRenderer({antialias:!LOW,preserveDrawingBuffer:true,powerPreference:'default'});
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=LOW?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(35,16/9,.1,200);
    const hemi=new THREE.HemisphereLight(0xffffff,0x8ea0c8,.95);scene.add(hemi);
    const sun=new THREE.DirectionalLight(0xffffff,.85);sun.position.set(5,10,8);sun.castShadow=true;sun.shadow.mapSize.set(LOW?512:1024,LOW?512:1024);
    const sc=sun.shadow.camera;sc.left=-12;sc.right=12;sc.top=10;sc.bottom=-6;sc.near=1;sc.far=40;sun.shadow.bias=-.0006;sun.shadow.normalBias=.03;scene.add(sun);
    mimi.root.position.set(-3.6,0,0);leo.root.position.set(3.6,0,0);scene.add(mimi.root,leo.root);leo.root.visible=false;
  }catch(e){ok=false}
  function gradTex(a,b){const c=document.createElement('canvas');c.width=2;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,2,256);return new THREE.CanvasTexture(c)}
  const THEMES={
    meadow:{sky:['#6ec6ff','#eaf8ff'],ground:'#79d457',plat:'#a4e57f'},
    beach:{sky:['#52c4ee','#fff1c4'],ground:'#f4d98d',plat:'#ffe9a8'},
    room:{sky:['#ffcfbf','#fff0e2'],ground:'#d99f66',plat:'#eebb82'},
    city:{sky:['#ff9a8b','#ffe3bc'],ground:'#5a6688',plat:'#7885a8'},
    space:{sky:['#080c36','#3a2d96'],ground:'#6f69cf',plat:'#8f89ee'}
  };
  function setTheme(n){
    if(!ok||themeName===n)return;themeName=n;const t=THEMES[n]||THEMES.meadow;
    if(bgG){scene.remove(bgG);disposeTree(bgG)}
    scene.background=gradTex(t.sky[0],t.sky[1]);
    const g=new THREE.Group();bgG=g;
    const gr=new THREE.Mesh(new THREE.CircleGeometry(40,48),new THREE.MeshStandardMaterial({color:t.ground,roughness:.9}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;g.add(gr);
    const pl=new THREE.Mesh(new THREE.CylinderGeometry(9,9.3,.3,64),new THREE.MeshStandardMaterial({color:t.plat,roughness:.8}));pl.position.y=-.15;pl.receiveShadow=true;g.add(pl);
    const upd=[];
    if(n==='meadow'||n==='beach'){
      [[-14,-14,6],[0,-18,8],[16,-15,7]].forEach(h=>{const s=sph(h[2],n==='beach'?'#4dc3e0':'#5cc24a',h[0],-h[2]*.35,h[1],{s:[1.4,1,1]});s.castShadow=false;g.add(s)});
      for(let i=0;i<5;i++){const c=cloudG('#ffffff');c.position.set(-18+i*9,9+(i%2)*2,-16);c.scale.setScalar(1.4+(i%3)*.3);c.userData.sp=.25+i*.05;g.add(c);upd.push(c)}
      if(n==='meadow')[[-9,-6],[8,-7],[11,-3],[-11,-2]].forEach((p,i)=>{const f=makeObj(i%2?'tree':'flower',{},i%2?5:2);f.position.set(p[0],i%2?2.5:1,p[1]);g.add(f)});
      if(n==='beach'){const sea=new THREE.Mesh(new THREE.PlaneGeometry(90,16),new THREE.MeshStandardMaterial({color:'#2aa9d8',roughness:.3}));sea.position.set(0,.02,-16);sea.rotation.x=-Math.PI/2;g.add(sea);const sn=sph(2,'#ffd43b',12,10,-24,{m:{emissive:'#ffb000',emissiveIntensity:.8}});g.add(sn)}
    }else if(n==='room'){
      const wall=new THREE.Mesh(new THREE.PlaneGeometry(60,24),new THREE.MeshStandardMaterial({color:'#ffe3d3',roughness:1}));wall.position.set(0,10,-9);g.add(wall);
      const win=bx(5,4,.2,'#ffffff',-9,5.5,-8.8);win.castShadow=false;g.add(win);g.add(bx(4.4,3.4,.22,'#a5d8ff',-9,5.5,-8.7));
      g.add(bx(2.2,2.8,.2,'#ffffff',8,6,-8.8),bx(1.8,2.4,.22,'#ffd6a5',8,6,-8.7),bx(3,1.8,.2,'#ffffff',1,6.8,-8.8),bx(2.6,1.4,.22,'#c5f6fa',1,6.8,-8.7));
      const rug=new THREE.Mesh(new THREE.CircleGeometry(6,48),new THREE.MeshStandardMaterial({color:'#ff8fa3',roughness:1}));rug.rotation.x=-Math.PI/2;rug.position.y=.02;g.add(rug);
    }else if(n==='city'){
      for(let i=0;i<14;i++){const h=3+((i*37)%9),w=2+(i%3);const b=bx(w,h,2,i%2?'#3b4468':'#4a5580',-24+i*3.6,h/2,-13-(i%3)*2);b.castShadow=false;g.add(b);
        for(let j=0;j<Math.floor(h/1.4);j++)if((i+j)%2===0)g.add(bx(.45,.55,.05,'#ffe08a',b.position.x+((j%2)?.5:-.5),1+j*1.3,b.position.z+1.03,{m:{emissive:'#ffcc33',emissiveIntensity:.7}}))}
      g.add(sph(2.4,'#fff6d6',14,11,-30,{m:{emissive:'#fff0b0',emissiveIntensity:.6}}));
    }else if(n==='space'){
      const pts=[];for(let i=0;i<420;i++){const a=Math.random()*Math.PI*2,e=Math.random()*1.2-.2,r=45;pts.push(Math.cos(a)*r*Math.cos(e),Math.sin(e)*r+6,-Math.abs(Math.sin(a))*r-8)}
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:1.1})));
      const pn=sph(4,'#ff8fab',-16,9,-30);pn.castShadow=false;g.add(pn);g.add(tr(6,.25,'#ffd6e0',-16,9,-30,{r:[1.2,.3,0]}));g.add(sph(1.6,'#74c0fc',17,13,-34));
    }
    scene.add(g);bgG.userData.upd=upd;
  }
  function computeLayout(){
    const asp=CW/CH,z=asp>=1.4?10.5:(asp>=.9?12.5:14.5),visH=2*z*Math.tan(35/2*Math.PI/180),frac=asp>=1.4?.25:(asp>=.9?.27:.29);
    const bottom=-frac*visH,ty=bottom+visH/2,halfW=visH/2*asp;
    camera.aspect=asp;camera.fov=35;camera.position.set(0,ty+.9,z);camera.lookAt(0,ty,0);camera.updateProjectionMatrix();
    if(asp>=1.4)L={z:z,ty:ty,halfW:halfW,visH:visH,mimiX:-halfW*.62,leoX:halfW*.45,mimiDX:-halfW*.45,objX:halfW*.34,objY:1.75,objS:1,objW:halfW*.95,tileX:halfW*.25,tileW:halfW*1.25,tileY1:4.7,tileY0:3.1,tileS:1,top:bottom+visH,port:false};
    else if(asp>=.9)L={z:z,ty:ty,halfW:halfW,visH:visH,mimiX:-halfW*.55,leoX:halfW*.5,mimiDX:-halfW*.5,objX:halfW*.28,objY:2.5,objS:1,objW:halfW*1.2,tileX:0,tileW:halfW*1.8,tileY1:5.9,tileY0:4.1,tileS:.9,top:bottom+visH,port:false};
    else L={z:z,ty:ty,halfW:halfW,visH:visH,mimiX:-halfW*.45,leoX:halfW*.45,mimiDX:-halfW*.5,objX:halfW*.12,objY:3.7,objS:.95,objW:halfW*1.7,tileX:0,tileW:halfW*1.8,tileY1:5.5,tileY0:4.2,tileS:.72,top:bottom+visH,port:true};
  }
  let side=1;
  function mirror(){if(side<0){L.mimiX=-L.mimiX;L.leoX=-L.leoX;L.mimiDX=-L.mimiDX;L.objX=-L.objX;L.tileX=-L.tileX}L.sd=side}
  function setFormat(f){
    out.fmt=f;const d={'16:9':[1280,720],'9:16':[720,1280],'1:1':[900,900]}[f]||[1280,720];CW=d[0];CH=d[1];comp.width=CW;comp.height=CH;comp.className=f==='16:9'?'land':'';
    if(ok){renderer.setSize(Math.round(CW*scaleNow),Math.round(CH*scaleNow),false);computeLayout();mirror();if(cur)show(cur,true)}
  }
  const ease=t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)};
  function clearProps(){props.forEach(p=>{p.out=true;p.tout=T});}
  function addProp(g,x,y,z,s,delay,mode,o){g.position.set(x,y,z);g.scale.setScalar(.001);scene.add(g);props.push(Object.assign({g:g,x:x,y:y,z:z,s:s,t0:T+(delay||0),mode:mode||'pop',out:false,ph:Math.random()*6},o||{}))}
  const ROLE={s:'#3b82f6',v:'#ef4444',o:'#10b981',a:'#f59e0b',x:'#8b5cf6'};
  function shade(h,k){const c=new THREE.Color(h);c.multiplyScalar(k||.6);return '#'+c.getHexString()}
  function tileMesh(text,role){
    const col=ROLE[role]||ROLE.x,px=128,c=document.createElement('canvas'),x=c.getContext('2d');x.font='800 74px '+FONT_D;const tw=Math.ceil(x.measureText(text).width)+72;c.width=tw;c.height=px;
    x.fillStyle=col;x.fillRect(0,0,tw,px);x.fillStyle='rgba(255,255,255,.16)';x.fillRect(0,0,tw,px*.45);x.fillStyle='#ffffff';x.font='800 74px '+FONT_D;x.textAlign='center';x.textBaseline='middle';x.fillText(text,tw/2,px/2+5);
    const w=tw/px*.95,side=M(shade(col,.62)),mats=[side,side,side,side,new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:.5}),side];
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,.95,.38),mats);m.castShadow=true;m.userData.w=w;return m;
  }
  function parseTiles(s){return s.split(' ').filter(Boolean).map(t=>{const i=t.lastIndexOf(':');return i>0?[t.slice(0,i).replace(/_/g,' '),t.slice(i+1)]:[t,'x']})}
  let prepBall=null,prepKind=null;
  function showPrep(prep,instant){
    const x=L.objX,s=L.objS;let kind=prep==='in'?'crate':'table';
    const holder=new THREE.Group();let g;
    if(kind==='crate'){g=OBJ.box({});g.scale.setScalar(1.05)}else{g=OBJ.table({});g.scale.setScalar(.95)}
    holder.add(g);
    addProp(holder,x,0,0,s,0,'pop',{base:true});
    const r=.5;let t;
    const tops=kind==='table'?1.5*.95+.125*.95:0;
    if(prep==='on')t=[0,tops+r,0];else if(prep==='under')t=[0,r,.1];else if(prep==='next to')t=[2.6*s,r,.5];else t=[0,.9,0];
    const ball=sph(r,'#ff5d6c',0,0,0);ball.add(tr(r*1.005,.025,'#ffffff',0,0,0,{}));ball.castShadow=true;
    const from=(prepBall&&prepBall.alive)?prepBall.pos:[x,t[1]+3.2,0];
    addProp(ball,from[0],from[1],from[2],1,.2,'ball',{tx:x+t[0],ty:t[1],tz:t[2],keep:true});
    prepBall={alive:true,pos:[x+t[0],t[1],t[2]]};
    return kind;
  }
  function show(step,silent){
    if(!ok)return;cur=step;clearProps();const had=prepBall;if(!step.prep)prepBall=null;
    const who=step.k==='d'?step.who:'A';
    leoOn=step.k==='d';leo.root.visible=leoOn;
    const talker=step.k==='d'?(step.who==='B'?'B':'A'):'A';
    out.actor=talker;out.act=step.act||null;
    const sd=L.sd||1;
    if(leoOn){mimi.tx=L.mimiDX;leo.tx=L.leoX;mimi.look=.42*sd;leo.look=-.42*sd;mimi.gx=.85*sd;leo.gx=-.85*sd;
      if(!step.act&&talker){const q=/\?\s*$/.test(step.en||'');out.act=q?'think':(Math.random()<.5?'explain':'nod');out.actor=q?(talker==='A'?'B':'A'):talker}}
    else{mimi.tx=L.mimiX;mimi.look=.5*sd;mimi.gx=.9*sd;leo.tx=L.leoX;
      if(!step.act){out.act=step.k==='v'?'point':(step.k==='s'?'nod':(step.k==='n'?'explain':null));if(step.k==='v'&&!step.obj)out.act='nod'}}
    if(!leo.root.visible)leo.root.position.x=L.leoX+3;
    setHeld(mimi,step.act==='read'?'book':(step.act==='eat'?'apple':null));setHeld(leo,null);
    const hasObj=!!(step.obj);
    if(step.obj){
      const n=step.n||1,o=Object.assign({tint:step.tint},step.opt||{});
      const OX=leoOn?0:L.objX,OY=leoOn?L.objY+.6:L.objY;
      if(n<=1){addProp(makeObj(step.obj,o),OX,OY,0,L.objS,.15,'pop')}
      else{const size=(n<=5?1.15:(n<=8?.95:.82))*L.objS,maxC=Math.max(2,Math.floor(L.objW/(size*1.12))),rows=Math.ceil(n/maxC),cols=Math.ceil(n/rows);
        for(let i=0;i<n;i++){const rr=Math.floor(i/cols),cc=i%cols,inRow=Math.min(cols,n-rr*cols);const px=OX+(cc-(inRow-1)/2)*size*1.15,py=OY+((rows-1)/2-rr)*size*1.2;
          addProp(makeObj(step.obj,o,size*1.1),px,py,0,1,.15+i*.28,'pop',{idx:i})}}
    }
    if(step.prep){showPrep(step.prep)}
    if(step.tiles){
      const tl=parseTiles(step.tiles),ms=tl.map(t=>tileMesh(t[0],t[1])),withObj=hasObj||!!step.prep;
      const rowsFor=k=>{const gp=.2*k,rw=[[]];let ws=0;ms.forEach(m=>{const w=m.userData.w*k;if(ws+w>L.tileW&&rw[rw.length-1].length){rw.push([]);ws=0}rw[rw.length-1].push(m);ws+=w+gp});return rw};
      let ts=L.tileS,rowsArr=rowsFor(ts);
      if(rowsArr.length>1&&withObj){ts=L.tileS*.72;rowsArr=rowsFor(ts)}
      const gap=.2*ts,want=withObj?L.tileY1:L.tileY0,y0=Math.min(want,L.top-.95*ts-.5);let di=0;
      rowsArr.forEach((row,ri)=>{const total=row.reduce((a,m)=>a+m.userData.w*ts+gap,0)-gap;let x=L.tileX-total/2;
        row.forEach(m=>{const w=m.userData.w*ts;m.rotation.y=0;addProp(m,x+w/2,y0-ri*1.1*ts,0,ts,.25+di*.35,'drop',{idx:di});x+=w+gap;di++})});
    }
    if(step.act==='sleep'&&!leoOn){}
  }
  function stepRecolorHeld(){}
  function setTalk(who){charsTalk=who}
  function project(x,y,z){const v=new THREE.Vector3(x,y,z).project(camera);return [(v.x*.5+.5)*CW,(-v.y*.5+.5)*CH]}
  function update(dt){
    if(!ok)return;
    if(bgG&&bgG.userData.upd)bgG.userData.upd.forEach(c=>{c.position.x+=dt*c.userData.sp;if(c.position.x>26)c.position.x=-26});
    const k=Math.min(1,dt*5);
    [mimi,leo].forEach(ch=>{ch.root.position.x+=(ch.tx-ch.root.position.x)*k});
    const actM=out.actor==='A'||!leoOn,actL=leoOn&&out.actor==='B';
    charUpdate(mimi,T,dt,{act:actM?out.act:null,talk:charsTalk==='A'&&true,look:mimi.look,gx:mimi.gx});
    charUpdate(leo,T,dt,{act:actL?out.act:null,talk:charsTalk==='B',look:leo.look,gx:leo.gx});
    for(let i=props.length-1;i>=0;i--){
      const p=props[i],g=p.g;
      if(p.out){const t=(T-p.tout)/.25;if(t>=1){scene.remove(g);disposeTree(g);props.splice(i,1);continue}g.scale.setScalar(Math.max(.001,p.s*(g.userData.k||1)*(1-t)));continue}
      const t=(T-p.t0)/.5;
      if(t<0){g.scale.setScalar(.001);continue}
      if(!p.sfx){p.sfx=true;if(out.onPop)out.onPop(p.idx||0)}
      if(p.mode==='drop'){const tt=Math.min(1,t);let b=tt;const n1=7.5625,d1=2.75;if(b<1/d1)b=n1*b*b;else if(b<2/d1){b-=1.5/d1;b=n1*b*b+.75}else if(b<2.5/d1){b-=2.25/d1;b=n1*b*b+.9375}else{b-=2.625/d1;b=n1*b*b+.984375}
        g.scale.setScalar(p.s*(g.userData.k||1));g.position.set(p.x,p.y+(1-b)*4+Math.sin(T*1.8+p.idx)*.04*Math.min(1,t),p.z)}
      else if(p.mode==='ball'){g.scale.setScalar(p.s);const kk=Math.min(1,dt*5);g.position.x+=(p.tx-g.position.x)*kk;g.position.y+=(p.ty-g.position.y)*kk;g.position.z+=(p.tz-g.position.z)*kk;if(prepBall)prepBall.pos=[g.position.x,g.position.y,g.position.z];g.rotation.y+=dt*2}
      else{const s=p.s*(g.userData.k||1)*Math.max(.001,ease(Math.min(1,t)));g.scale.setScalar(s);if(!p.base){g.position.y=p.y+Math.sin(T*1.6+p.ph)*.08;g.rotation.y=Math.sin(T*.9+p.ph)*.8}}
      if(g.userData.update)g.userData.update(dt,T);
    }
  }
  /* ---------- 2D overlay ---------- */
  function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
  function wrap(text,maxW){const words=text.split(' '),lines=[];let line=[],w=0;const sp=cx.measureText(' ').width;words.forEach(wd=>{const ww=cx.measureText(wd).width;if(line.length&&w+sp+ww>maxW){lines.push(line);line=[];w=0}w+=(line.length?sp:0)+ww;line.push(wd)});if(line.length)lines.push(line);return lines}
  function drawSub(u){
    const sp=out.sp;if(!sp||out.subMode==='off')return;
    const W=CW,H=CH,maxW=W*.88,fs=Math.round(36*u),vs=Math.round(24*u);
    const dlg=cur&&cur.k==='d'&&out.subMode==='both'&&sp.sub;
    cx.font='800 '+fs+'px '+FONT_D;const lines=dlg?[]:wrap(sp.en,maxW);
    cx.font='700 '+vs+'px '+FONT_B;const vl=(out.subMode==='both'&&sp.sub)?wrap(sp.sub,maxW):[];
    const lh=fs*1.2,vh=vs*1.3,padX=26*u,padY=16*u,boxH=lines.length*lh+vl.length*vh+padY*2+(vl.length?8*u:0);
    let boxW=0;cx.font='800 '+fs+'px '+FONT_D;lines.forEach(l=>{boxW=Math.max(boxW,cx.measureText(l.join(' ')).width)});cx.font='700 '+vs+'px '+FONT_B;vl.forEach(l=>{boxW=Math.max(boxW,cx.measureText(l.join(' ')).width)});boxW+=padX*2;
    const bx0=(W-boxW)/2,by0=H-boxH-(out.rec?36*u:22*u);
    cx.fillStyle='rgba(8,12,40,.72)';rr(bx0,by0,boxW,boxH,22*u);cx.fill();
    const ci=sp.hl?(sp.ci!=null?sp.ci:Math.min(1,Math.max(0,(performance.now()-sp.t0)/sp.dur))*sp.en.length):-1;let pos=0;
    cx.textBaseline='alphabetic';cx.font='800 '+fs+'px '+FONT_D;
    let y=by0+padY+fs*.95;const spw=cx.measureText(' ').width;
    lines.forEach(line=>{const lw=line.reduce((a,w)=>a+cx.measureText(w).width,0)+spw*(line.length-1);let x=(W-lw)/2;
      line.forEach(w=>{const wl=w.length;const hl=sp.hl&&ci>=pos&&ci<pos+wl+1;const fut=sp.hl&&ci<pos;cx.fillStyle=hl?'#ffd43b':(fut?'rgba(255,255,255,.62)':'#ffffff');cx.fillText(w,x,y);x+=cx.measureText(w).width+spw;pos+=wl+1});y+=lh});
    if(vl.length){y+=4*u;cx.font='700 '+vs+'px '+FONT_B;cx.fillStyle='#cfd8ff';vl.forEach(l=>{const t=l.join(' ');cx.fillText(t,(W-cx.measureText(t).width)/2,y);y+=vh})}
  }
  function bubble(text,x,y,u,maxW,tailDir){
    const fs=Math.round(30*u);cx.font='800 '+fs+'px '+FONT_D;const lines=wrap(text,maxW).map(l=>l.join(' '));let bw=0;lines.forEach(l=>bw=Math.max(bw,cx.measureText(l).width));bw+=36*u;const bh=lines.length*fs*1.2+26*u;
    let bx0=Math.max(10*u,Math.min(CW-bw-10*u,x-bw/2)),by0=Math.max(10*u,y-bh-24*u);
    cx.fillStyle='#ffffff';rr(bx0,by0,bw,bh,22*u);cx.fill();cx.beginPath();cx.moveTo(x-14*u,by0+bh-2);cx.lineTo(x,by0+bh+22*u);cx.lineTo(x+14*u,by0+bh-2);cx.closePath();cx.fill();
    cx.fillStyle='#151a3b';cx.textBaseline='alphabetic';lines.forEach((l,i)=>cx.fillText(l,bx0+18*u,by0+13*u+fs*.95+i*fs*1.2));
  }
  function drawCards(u){
    const c=out.cardS;if(!c)return;const now=performance.now(),t=(now-c.t0)/c.dur;if(t>=1){out.cardS=null;return}
    const a=Math.min(1,t*8,(1-t)*8);cx.globalAlpha=Math.max(0,a);
    const g=cx.createLinearGradient(0,0,CW,CH);g.addColorStop(0,c.c1||'#3d6bff');g.addColorStop(1,c.c2||'#7b3fe4');cx.fillStyle=g;cx.fillRect(0,0,CW,CH);
    cx.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<6;i++){cx.beginPath();cx.arc(CW*(.1+i*.18),CH*(.15+((i*37)%5)*.18),40*u+i*9*u,0,7);cx.fill()}
    cx.fillStyle='#fff';cx.textAlign='center';cx.textBaseline='middle';const sc=.9+.1*Math.min(1,t*5);
    cx.font='800 '+Math.round(80*u*sc)+'px '+FONT_D;const tl=wrap(c.title,CW*.84);tl.forEach((l,i)=>cx.fillText(l.join(' '),CW/2,CH/2-(tl.length-1)*45*u+i*92*u-(c.sub?20*u:0)));
    if(c.sub){cx.font='700 '+Math.round(32*u)+'px '+FONT_B;cx.fillStyle='rgba(255,255,255,.92)';const sl=wrap(c.sub,CW*.8);sl.forEach((l,i)=>cx.fillText(l.join(' '),CW/2,CH/2+(tl.length)*55*u+i*40*u))}
    cx.textAlign='left';cx.globalAlpha=1;
  }
  function drawOverlay(){
    const u=CW>=CH?CW/1280:CW/720;cx.textAlign='left';
    const st=cur;
    if(out.showChip&&out.lessonTitle){cx.font='800 '+Math.round(20*u)+'px '+FONT_D;let fs=20;const maxW=CW-32*u-34*u;while(fs>12&&(cx.font='800 '+Math.round(fs*u)+'px '+FONT_D,cx.measureText(out.lessonTitle).width>maxW))fs--;const t=out.lessonTitle,w=Math.max(cx.measureText(t).width,out.partTitle?cx.measureText(out.partTitle).width*.75:0)+34*u,h=(out.partTitle?62:40)*u;cx.fillStyle='rgba(8,12,40,.55)';rr(16*u,16*u,w,h,20*u);cx.fill();cx.fillStyle='#fff';cx.textBaseline='middle';cx.fillText(t,33*u,37*u);if(out.partTitle){cx.font='700 '+Math.round(fs*.75*u)+'px '+FONT_B;cx.fillStyle='#ffd43b';cx.fillText(out.partTitle,33*u,60*u)}}
    if(st&&!out.cardS){
      if(st.w&&st.k==='v'&&!st.prep){
        const hasO=!!st.obj,ax=hasO||st.prep?L.objX:L.tileX,ay=st.prep?3.3:(hasO?L.objY-1.3:1.7);const p=project(ax,ay,0);
        const fs=Math.round(46*u);cx.font='800 '+fs+'px '+FONT_D;const w1=cx.measureText(st.w).width;cx.font='700 '+Math.round(22*u)+'px '+FONT_B;const w2=cx.measureText(st.vi||'').width;
        const bw=Math.max(w1,w2)+44*u,bh=(st.vi?fs+30*u:fs+14*u);let x0=Math.max(8*u,Math.min(CW-bw-8*u,p[0]-bw/2));let y0=p[1]+(st.prep?-bh/2:6*u);
        cx.fillStyle='rgba(255,255,255,.95)';rr(x0,y0,bw,bh,20*u);cx.fill();
        if(st.tint){cx.fillStyle=st.tint;cx.beginPath();cx.arc(x0+22*u,y0+bh/2,10*u,0,7);cx.fill()}
        cx.fillStyle='#151a3b';cx.textBaseline='alphabetic';cx.font='800 '+fs+'px '+FONT_D;cx.fillText(st.w,x0+(bw-w1)/2+(st.tint?8*u:0),y0+fs*.9+6*u);
        if(st.vi){cx.font='700 '+Math.round(22*u)+'px '+FONT_B;cx.fillStyle='#5b6390';cx.fillText(st.vi,x0+(bw-w2)/2,y0+bh-10*u)}
      }
      if(st.big){const s=130*u,x0=CW-s-26*u,y0=70*u;cx.fillStyle='rgba(8,12,40,.18)';rr(x0+4*u,y0+8*u,s,s,26*u);cx.fill();cx.fillStyle='#ffc233';rr(x0,y0,s,s,26*u);cx.fill();cx.fillStyle='#3a2a00';cx.font='800 '+Math.round(String(st.big).length>2?58*u:88*u)+'px '+FONT_D;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(st.big,x0+s/2,y0+s/2+6*u);cx.textAlign='left'}
      if(st.card){const fs=Math.round(88*u);cx.font='800 '+fs+'px '+FONT_D;const w=cx.measureText(st.card).width+70*u,h=fs*1.4,x0=(CW>=CH?CW*.6:CW/2)-w/2,y0=CH*.2;
        const px=Math.max(10*u,Math.min(CW-w-10*u,x0));cx.fillStyle='rgba(8,12,40,.2)';rr(px+5*u,y0+9*u,w,h,34*u);cx.fill();cx.fillStyle='#ffffff';rr(px,y0,w,h,34*u);cx.fill();cx.fillStyle='#3d6bff';cx.textBaseline='middle';cx.fillText(st.card,px+35*u,y0+h/2+6*u)}
      if(st.k==='d'&&st.en){const ch=st.who==='B'?leo:mimi;const p=project(ch.root.position.x,2.95,0);bubble(st.en,p[0],p[1],u,CW*(CW>=CH?.34:.6))}
    }
    drawSub(u);
    if(out.wm&&out.rec){cx.font='800 '+Math.round(22*u)+'px '+FONT_D;const w=cx.measureText(out.wm).width+30*u;cx.fillStyle='rgba(8,12,40,.55)';rr(CW-w-16*u,16*u,w,38*u,19*u);cx.fill();cx.fillStyle='#fff';cx.textBaseline='middle';cx.fillText(out.wm,CW-w-1*u,35*u)}
    if(out.rec){cx.fillStyle='rgba(255,255,255,.25)';cx.fillRect(0,CH-8*u,CW,8*u);cx.fillStyle='#ff3b57';cx.fillRect(0,CH-8*u,CW*out.recProg,8*u)}
    drawCards(u);
  }
  function frame(now){
    requestAnimationFrame(frame);
    if(!ok){cx.fillStyle='#0a0f2b';cx.fillRect(0,0,CW,CH);return}
    if(document.hidden||!comp.isConnected)return;               /* ẩn tab hoặc chưa gắn vào trang: không vẽ */
    if((LOW||out.rec)&&now-lastDraw<30)return;                    /* máy yếu hoặc điện thoại: tối đa khoảng 30 khung/giây */
    lastDraw=now;const dt=Math.min(.05,(now-last)/1000||.016);last=now;T+=dt;
    const want=(LOW&&!out.rec)?.75:1;                            /* khi không quay: vẽ 3D nhỏ hơn rồi phóng lên, khi quay: đủ độ phân giải */
    if(want!==scaleNow){scaleNow=want;renderer.setSize(Math.round(CW*want),Math.round(CH*want),false)}
    update(dt);renderer.render(scene,camera);cx.drawImage(renderer.domElement,0,0,CW,CH);drawOverlay();out.frames++;
  }
  /* thumbnails */
  let tr_,ts,tc,cache={};
  function thumb(spec,px){
    px=px||240;const key=JSON.stringify(spec)+px;if(cache[key])return cache[key];if(!ok)return '';
    if(!tr_){tr_=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});ts=new THREE.Scene();tc=new THREE.PerspectiveCamera(30,1,.1,100);
      ts.add(new THREE.HemisphereLight(0xffffff,0x8ea0c8,1.0));const d=new THREE.DirectionalLight(0xffffff,.8);d.position.set(4,8,8);ts.add(d)}
    tr_.setSize(px,px,false);tr_.setClearColor(0x000000,0);
    const g=new THREE.Group();
    if(spec.prep){const kind=spec.prep==='in'?'crate':'table';const base=kind==='crate'?OBJ.box({}):OBJ.table({});base.scale.setScalar(kind==='crate'?1.05:.95);g.add(base);const tops=kind==='table'?1.5*.95+.125*.95:0,r=.5;
      const t=spec.prep==='on'?[0,tops+r,0]:spec.prep==='under'?[0,r,.1]:spec.prep==='next to'?[2.6,r,.5]:[0,.9,0];const b=sph(r,'#ff5d6c',t[0],t[1],t[2]);b.add(tr(r*1.005,.025,'#ffffff',0,0,0,{}));g.add(b);
      const f=fit(g,2.2);f.rotation.y=.25;ts.add(f);tc.position.set(0,1.6,7.2);tc.lookAt(0,0,0);tr_.render(ts,tc);ts.remove(f);disposeTree(f)}
    else{const n=spec.n||1,o=Object.assign({tint:spec.tint},spec.opt||{});
      if(n<=1){const f=makeObj(spec.obj,o,2.2);f.rotation.y=.35;ts.add(f);tc.position.set(0,1.2,7);tc.lookAt(0,0,0);tr_.render(ts,tc);ts.remove(f);disposeTree(f)}
      else{const cols=Math.min(n,n>6?5:4),rows=Math.ceil(n/cols),sz=Math.min(1.5,4.2/cols),grp=new THREE.Group();for(let i=0;i<n;i++){const rrw=Math.floor(i/cols),cc=i%cols,inRow=Math.min(cols,n-rrw*cols);const f=makeObj(spec.obj,o,sz);f.position.set((cc-(inRow-1)/2)*sz*1.2,((rows-1)/2-rrw)*sz*1.2,0);grp.add(f)}
        ts.add(grp);tc.position.set(0,0,7.6);tc.lookAt(0,0,0);tr_.render(ts,tc);ts.remove(grp);disposeTree(grp)}}
    const url=tr_.domElement.toDataURL('image/png');cache[key]=url;return url;
  }
  setFormat('16:9');
  if(ok){setTheme('meadow');requestAnimationFrame(frame)}else{cx.fillStyle='#0a0f2b';cx.fillRect(0,0,CW,CH)}
  out.setSide=function(sv){side=sv<0?-1:1;if(ok){computeLayout();mirror();if(cur)show(cur,true);else{mimi.root.position.x=L.mimiX}}};
  out.dress=function(o){if(!ok)return;dress(mimi,o&&o.mimi);dress(leo,o&&o.leo)};
  out.sim=function(sec){for(let t=0;t<sec;t+=.05){T+=.05;update(.05)}};out.ok=ok;out.show=show;out.setTalk=setTalk;out.setTheme=setTheme;out.setFormat=setFormat;out.thumb=thumb;out.mount=function(el){el.appendChild(comp)};out.isOK=()=>ok;
  out.resetCur=function(){cur=null;clearProps();prepBall=null;out.sp=null;out.act=null;if(ok){leoOn=false;leo.root.visible=false;mimi.tx=L.mimiX;mimi.look=.5*(L.sd||1);mimi.gx=.9*(L.sd||1);setHeld(mimi,null)}};
  return out;
})();
