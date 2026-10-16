(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],N=5,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const view=$('#view'),world=$('#world'),far=$('#far'),mid=$('#mid'),fore=$('#fore'),dog=$('#dog'),bub=$('#bubble'),sc=$$('.scene'),nextB=$('#next'),prevB=$('#prev');
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,wait=ms=>new Promise(r=>setTimeout(r,RM?10:ms)),W=()=>view.clientWidth,REST=.7,pick=a=>a[Math.random()*a.length|0];
let fast=false;const tween=(d,f)=>new Promise(r=>{d=RM?1:d;const s=performance.now();(function t(n){let k=Math.min(1,(n-s)/d);if(fast)k=1;f(k);k<1?requestAnimationFrame(t):r()})(s)});
let idx=0,cam=0,dogW=0,S='SITTING',busy=false,face=1,faceT=1,last=performance.now(),phase=0,time=0,idleAt=performance.now(),trickAt=performance.now(),hop=0,lastD=0,blink=1,resting=false,readyT=0,bubT=0;
const P={sit:1,hr:-6,tA:10,tS:5,tg:.8,paw:0,ex:3,lie:0},T={...P},base=()=>Object.assign(T,{sit:1,hr:-6,tA:10,tS:5,tg:.8,paw:0,ex:3,lie:0});
const lerpC=(a,b,f)=>{const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const x=p(a),y=p(b);return'rgb('+x.map((v,i)=>v+(y[i]-v)*f|0)+')'};
const SKY=[['#BFE3F2','#FBF1D4'],['#DDECF1','#F7F5E9'],['#D3E8EE','#F3EBD0'],['#E9E4C8','#F7E2B5'],['#5B5F8F','#F2A56B']],H1=['#B9D9B0','#B3D3A8','#B3D3A8','#C9CF9B','#7A6E8F'],H2=['#A9CB98','#A0C48E','#98BD87','#A9B77A','#5F7059'],G=['#8FBA7D','#8FBA7D','#86B375','#9DB26F','#6C8460'];
/* world dressing */
const hills=(el,s)=>{let d='M0 100';for(let x=0;x<=400;x+=8)d+='L'+x+' '+(45+14*Math.sin(x*.05+s)+9*Math.sin(x*.13+s*2));el.innerHTML='<div class="hill"><svg viewBox="0 0 400 100" preserveAspectRatio="none"><path d="'+d+'L400 100Z"/></svg></div>'};hills(far,1);hills(mid,4);
for(let i=0;i<6;i++){const c=document.createElement('div');c.className='cloud';c.style.cssText=`left:${i*28+5}vw;top:${6+i%3*8}vh;width:${12+i%3*5}vw;animation-duration:${80+i*17}s`;far.appendChild(c)}
for(let i=0;i<24;i++){const s=document.createElement('i');s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%`;$('#stars').appendChild(s)}
for(let i=0;i<6;i++){const l=document.createElement('div');l.className='leaf';l.style.cssText=`left:${40+i*10}vw;animation-duration:${14+i*3}s;animation-delay:-${i*4}s`;view.appendChild(l)}
world.insertAdjacentHTML('afterbegin','<div class="ground"></div><div class="path"></div>');
const tree='<svg viewBox="0 0 80 120"><rect x="35" y="60" width="10" height="60" fill="#8a6244"/><circle cx="40" cy="42" r="34" fill="#5f8f56"/><circle cx="27" cy="60" r="21" fill="#79a46a"/><circle cx="56" cy="58" r="19" fill="#79a46a"/></svg>',
fl=c=>`<svg viewBox="0 0 50 30"><path d="M5 30Q8 10 10 4M25 30Q25 12 25 3M44 30Q41 12 38 6" stroke="#4d7a45" stroke-width="3" fill="none"/><circle cx="10" cy="5" r="5" fill="${c}"/><circle cx="25" cy="4" r="5" fill="#F3C979"/><circle cx="38" cy="7" r="5" fill="${c}"/></svg>`,
sign=t=>`<svg viewBox="0 0 120 90"><rect x="56" y="30" width="8" height="60" fill="#6b4528"/><rect x="6" y="6" width="108" height="38" rx="5" fill="#C9955F" stroke="#6b4528" stroke-width="3"/><text x="60" y="30" text-anchor="middle" font-size="12" font-weight="700" fill="#2b1a0d" font-family="sans-serif">${t}</text></svg>`,
bench='<svg viewBox="0 0 140 70"><rect x="8" y="28" width="124" height="10" rx="3" fill="#C9955F"/><rect x="8" y="8" width="124" height="8" rx="3" fill="#C9955F"/><path d="M20 38v28M120 38v28M20 16v14M120 16v14" stroke="#6b4528" stroke-width="6"/></svg>',
lap='<svg viewBox="0 0 90 70"><rect x="14" y="4" width="62" height="42" rx="4" fill="#24372D"/><path d="M24 16h30M24 26h40M24 36h22" stroke="#A9CB98" stroke-width="3"/><path d="M4 52h82l-6 10H10z" fill="#748B6D"/></svg>',
plant='<svg viewBox="0 0 60 80"><path d="M30 50Q10 30 14 8Q30 20 30 50M30 50Q50 32 48 12Q32 24 30 50" fill="#5f8f56"/><path d="M16 50h28l-4 28H20z" fill="#E9845D"/></svg>',
chip='<svg viewBox="0 0 70 70"><rect x="14" y="14" width="42" height="42" rx="5" fill="#24372D"/><path d="M24 8v8M35 8v8M46 8v8M24 54v8M35 54v8M46 54v8M8 24h8M8 35h8M8 46h8M54 24h8M54 35h8M54 46h8" stroke="#748B6D" stroke-width="3"/><circle cx="35" cy="35" r="8" fill="#F3C979"/></svg>',
serv='<svg viewBox="0 0 70 80"><g fill="#24372D"><rect x="8" y="6" width="54" height="20" rx="3"/><rect x="8" y="30" width="54" height="20" rx="3"/><rect x="8" y="54" width="54" height="20" rx="3"/></g><g fill="#A9CB98"><circle cx="18" cy="16" r="3"/><circle cx="18" cy="40" r="3"/><circle cx="18" cy="64" r="3"/></g></svg>',
bench2='<svg viewBox="0 0 200 80"><rect x="6" y="30" width="188" height="12" rx="3" fill="#C9955F"/><path d="M20 42v36M180 42v36" stroke="#6b4528" stroke-width="7"/><rect x="40" y="6" width="34" height="24" fill="#fff" stroke="#748B6D" stroke-width="2"/><path d="M46 14h20M46 22h14" stroke="#748B6D"/><rect x="100" y="14" width="30" height="16" fill="#F3C979"/></svg>';
const add=(h,x,w,c='',g='')=>world.insertAdjacentHTML('beforeend',`<div class="deco ${c}" ${g?`data-g="${g}"`:''} style="left:${x}vw;width:${w}px">${h}</div>`);
for(let i=0;i<N;i++){add(tree,i*100+(86-i*3),120,'sway');add(tree,i*100+22+i*4,90,'sway');[12,48,64,93].forEach((p,j)=>add(fl(['#E9845D','#fff','#F2A9A0'][(i+j)%3]),i*100+p,46,'fl'));}
add(bench,150,150);add(sign('KEEP ASKING'),138,80);add(sign('WORKSHOP'),256,80);add(lap,262,110,'obj','prog');add(plant,275,70,'obj','web');add(chip,284,70,'obj','ai');add(serv,293,66,'obj','db');add(sign('MAKER BENCH'),350,86);add(bench2,380,230);add(sign('FINISH ▸'),480,90);
let fx='';for(let i=0;i<60;i++)fx+=`<i style="left:${i*10}vw"></i>`+(i%3?'':`<b style="left:${i*10+4}vw"></b>`);fore.innerHTML=fx;
/* portrait fallback */
const im=$('.frame img');im.addEventListener('error',()=>{const f=im.parentNode;f.classList.add('mono');f.textContent='S';f.setAttribute('role','img');f.setAttribute('aria-label','Monogram S')});
/* content */
const SK=[['prog','Programming','Java, Python, C++, C, JavaScript, SQL'],['web','Web development','HTML and CSS, React.js, Node.js, Express.js, RESTful APIs'],['ai','AI and machine learning','Python-based ML, computer vision, YOLOv8, model experimentation, speech and language technologies'],['db','Databases and infrastructure','MongoDB, PostgreSQL, Oracle SQL, Docker, Kubernetes, AWS, Terraform, CI/CD and GitOps']];
$('#groups').innerHTML=SK.map(s=>`<button class="grp" data-g="${s[0]}">${s[1]}<span>${s[2]}</span></button>`).join('');
const PJ=[
{n:'💼 Freelance Hub',c:'Full-stack marketplace and bid ranking',d:'A platform concept for connecting clients and freelancers, with ranking logic to compare bids and help surface relevant matches.',f:['Bid ranking using price, rating, completion and reliability signals','Skill and portfolio matching','API-based application architecture'],p:'How can a marketplace rank bids using more than price alone?',a:'A ranking service that considers multiple factors to score and compare bids.',t:'Flask, Python, web APIs, database workflows',l:'Turning vague matching criteria into explicit, tunable scoring logic.',r:'https://github.com/Someesvaar/Freelance_Hub'},
{n:'🚗 Carpooling App',c:'A web application for shared rides',d:'A project focused on helping users coordinate rides and explore a more convenient shared-transport experience.',f:['Ride and user workflows','Web application development','Application logic and data handling'],p:'How can a simple app make it easier to coordinate shared rides?',a:'A web app that brings the core carpooling workflow into one place.',t:'Web development, JavaScript, application logic',l:'Designing a complete user flow rather than isolated screens.',r:'https://github.com/Someesvaar/carpooling-app'},
{n:'🤖 WhatsApp Automation',c:'Browser automation for repetitive tasks',d:'An automation project exploring browser-controlled workflows on WhatsApp Web.',f:['Browser automation','Repeatable web workflows','Automation scripting'],p:'Can browser automation reduce repetitive manual steps?',a:'Automating browser interactions for selected WhatsApp Web workflows.',t:'JavaScript, Playwright, browser automation',l:'Making browser workflows repeatable while accounting for UI changes.',r:'https://github.com/Someesvaar/Whatsapp-Automation'},
{n:'🦺 Industrial Safety Monitor',c:'Edge AI and industrial computer vision',d:'A project exploring computer vision and edge computing to identify potential workplace hazards and support safety monitoring.',f:['YOLOv8-based object detection','PPE non-compliance detection','Fall and zone-intrusion detection concepts','Federated learning experiments','MQTT alerts'],p:'How can computer vision help surface potential hazards in an industrial environment?',a:'A prototype combining object detection, safety-event logic and messaging experiments.',t:'Python, YOLOv8, MQTT, federated learning',l:'Connecting model inference, edge constraints and alert delivery.'},
{n:'🧠 MindTrace Secure',c:'Human-state intelligence and behavioural cyber defence',d:'A project exploring human-state signals and behavioural patterns as context for intelligent, privacy-conscious cybersecurity experiences.',f:['Human-state analysis concepts','HSRS (Human Stress Response Score)','AI-assisted analysis','Interactive web interface'],p:'How might human-state context inform a security experience?',a:'An exploratory system concept combining an interface with AI-assisted analysis.',t:'React, JavaScript, AI-assisted analysis',l:'Thinking carefully about privacy and avoiding unsupported claims.'},
{n:'🎙️ Nila — Local AI Assistant',c:'Local AI and voice interaction',d:'A personal assistant experiment exploring local language models, speech recognition, and spoken responses.',f:['Ollama and local model experiments','Speech-to-text exploration','Tamil-English interaction goals','Text-to-speech experiments'],p:'What would a useful, locally running voice assistant feel like?',a:'Exploring a pipeline connecting local models, speech recognition and speech output.',t:'Python, Ollama, speech-to-text, text-to-speech',l:'Integrating several components into a responsive voice workflow.'}
];
$('#plist').innerHTML=PJ.map((p,i)=>`<button class="pj" data-p="${i}" aria-pressed="false">${p.n}<span>${p.c}</span>${p.r?'<small>GITHUB ↗</small>':'<small>PROJECT NOTES</small>'}</button>`).join('');
$('#plist').innerHTML=PJ.map((p,i)=>`<button class="pj" data-p="${i}" aria-pressed="false">${p.n}<span>${p.c}</span></button>`).join('');
const det=$('#pdet');
/* dog rig */
const g=id=>document.getElementById(id),R={rig:g('rig'),tail:g('tail'),hf:g('hf'),ff:g('ff'),hn:g('hn'),fn:g('fn'),head:g('head'),ear:g('ear'),tg:g('tg'),eye:g('eye'),pup:g('pup')};
const rot=(a,x,y)=>`rotate(${a} ${x} ${y})`,leg=(el,x,a,sit)=>el.setAttribute('transform',`translate(${x} 92) rotate(${a}) scale(1 ${1-sit*.38}) translate(${-x} -92)`);
function frame(n){const dt=Math.min(.05,(n-last)/1000);last=n;time+=dt;
for(const k in T)P[k]+=(T[k]-P[k])*Math.min(1,dt*7);
const sp=Math.abs(dogW-lastD)/Math.max(dt,.001);lastD=dogW;const mv=Math.min(1,sp/120),run=Math.min(1,Math.max(0,(sp-380)/200));
phase+=dt*sp*.05;face+=(faceT-face)*Math.min(1,dt*9);
const amp=(24+run*22)*mv,s=Math.sin(phase),c=-s,sit=P.sit,bob=-Math.abs(Math.cos(phase))*(3+run*6)*mv-hop,pr=-sit*20;
R.rig.setAttribute('transform',`translate(0 ${bob+sit*11+P.lie*8}) ${rot(pr,100,92)}`);
const wv=P.paw*(-62+10*Math.sin(time*14));
leg(R.fn,124,s*amp+sit*20+wv,0);leg(R.ff,131,c*amp+sit*20,0);leg(R.hn,80,c*amp-sit*78,sit);leg(R.hf,63,s*amp-sit*72,sit);
R.tail.setAttribute('transform',rot(-20+Math.sin(time*P.tS)*P.tA*(1+mv*.3),60,76));
R.head.setAttribute('transform',rot(P.hr+Math.sin(time*.7)*2+Math.sin(phase*2)*2*mv,140,76));
R.ear.setAttribute('transform',rot(-4+Math.sin(phase*2)*8*mv+hop*.4,140,46));
const tg=Math.max(0,P.tg*(1+.15*Math.sin(time*12)));R.tg.setAttribute('transform',`translate(176 76) scale(1 ${tg}) translate(-176 -76)`);
R.eye.setAttribute('transform',`translate(160 56) scale(1 ${Math.min(blink,1-P.lie*.9)}) translate(-160 -56)`);R.pup.setAttribute('transform',`translate(${P.ex} 0)`);
dog.style.transform=`translate3d(${dogW-cam}px,0,0)`;dsvg.style.transform=`scaleX(${face})`;
requestAnimationFrame(frame)}
const dsvg=g('dsvg');
function place(){const w=W(),p=cam/w,i=Math.min(N-2,Math.floor(p)),f=Math.min(1,p-i);world.style.transform=`translate3d(${-cam}px,0,0)`;far.style.transform=`translate3d(${-cam*.2}px,0,0)`;mid.style.transform=`translate3d(${-cam*.5}px,0,0)`;fore.style.transform=`translate3d(${-cam*1.25}px,0,0)`;
const st=view.style,m=(a)=>lerpC(a[i],a[i+1],f);st.setProperty('--s1',m(SKY.map(x=>x[0])));st.setProperty('--s2',m(SKY.map(x=>x[1])));st.setProperty('--h1',m(H1));st.setProperty('--h2',m(H2));st.setProperty('--g',m(G));
$('#stars').style.opacity=Math.max(0,Math.min(1,p-3));$('#sun').style.transform=`translateY(${Math.max(0,p-1.5)*9}vh)`;$('#sun').style.background=p>3?lerpC('#F3C979','#E9845D',Math.min(1,p-3)):'#F3C979'}
function size(){view.style.setProperty('--dw',(W()<700?120:180)+'px');cam=idx*W();if(!busy)dogW=idx*W()+REST*W();place()}
/* dog speech + tricks */
function say(t,ms=2600){bub.textContent=t;bub.classList.add('show');clearTimeout(bubT);bubT=setTimeout(()=>bub.classList.remove('show'),ms)}
const poke=()=>{idleAt=performance.now();if(resting){resting=false;base()}},later=(ms,f)=>setTimeout(f,RM?10:ms);
async function doHop(){T.sit=.15;T.tS=14;T.tA=28;await tween(520,k=>hop=26*Math.sin(Math.PI*k));hop=0;base()}
const TR={tilt:()=>{T.hr=16;later(1300,base)},paw:()=>{T.paw=1;later(1700,base)},hop:doHop,sniff:()=>{T.hr=36;T.tg=0;later(1700,base)},watch:()=>{T.hr=-14;T.ex=4;later(2000,base)},wag:()=>{T.tS=15;T.tA=30;later(2000,base)}};
const POOL=[['tilt','wag','sniff','paw'],['tilt','sniff','wag','watch'],['watch','paw','hop','wag'],['hop','tilt','paw','sniff'],['hop','paw','wag','tilt']];
function trick(n){if(busy||S==='TRICK')return;S='TRICK';trickAt=performance.now();TR[n||pick(POOL[idx])]();later(2300,()=>{if(S==='TRICK')S='SITTING'})}
setInterval(()=>{if(busy||document.hidden||S==='INTERACTING')return;const n=performance.now();if(n-idleAt>35000&&!resting){resting=true;Object.assign(T,{lie:1,hr:24,tg:0,tA:3,tS:1.5});say('z z z…',3000)}else if(!resting&&n-trickAt>7000+Math.random()*6000){trick();if(Math.random()<.2)say(pick(['A little break? Woof!','Oh, you found this!']))}},1500);
(function bl(){blink=.1;setTimeout(()=>blink=1,120);setTimeout(bl,2200+Math.random()*3000)})();
/* scenes */
function showScene(i){sc.forEach((s,k)=>s.classList.toggle('on',k===i));$('#count').textContent=`0${i+1} / 05`;$$('#dots button').forEach((b,k)=>b.toggleAttribute('aria-current',k===i)&&0||b.setAttribute('aria-current',k===i));prevB.disabled=i===0;nextB.disabled=i===N-1;nextB.classList.remove('ready');clearTimeout(readyT);if(i<N-1)readyT=setTimeout(()=>{if(!busy){nextB.classList.add('ready');say('Ready for the next chapter?',3200)}},RM?60000:14000)}
$('#dots').innerHTML=Array.from({length:N},(_,i)=>`<button data-jump="${i}" aria-label="Go to chapter ${i+1}"></button>`).join('');
async function travel(dir){const n=idx+dir;if(busy||n<0||n>=N)return;busy=true;fast=false;poke();clearTimeout(readyT);nextB.classList.remove('ready');sc.forEach(s=>s.classList.remove('on'));bub.classList.remove('show');
S='PREPARING_TO_WALK';faceT=dir;Object.assign(T,{hr:-12,tS:16,tA:30,tg:.3,paw:0,ex:5});say(dir>0?'Come on, let\'s explore!':'Let\'s go back!',2400);await wait(dir>0?600:450);T.sit=0;await wait(700);Object.assign(T,{hr:-3,tg:.25,tS:9,tA:18});
const d0=dogW,c0=cam,w=W(),dist=dir*w,de=k=>k*k*(3-2*k),ce=k=>k<.22?0:ease((k-.22)/.78);S='WALKING';
await tween(4800,k=>{dogW=d0+dist*de(k);cam=c0+dist*ce(k);place();S=k<.22?'WALKING':k<.86?'CAMERA_FOLLOW':'ARRIVING'});
idx=n;faceT=1;await wait(350);base();T.hr=-10;S='SITTING';busy=false;fast=false;showScene(idx);poke();trickAt=performance.now();later(600,()=>{T.tS=14;T.tA=28;later(1600,base)});if(idx===N-1){say('Thanks for taking a walk with me!',4000);later(4500,()=>doHop())}}
function jump(n){if(busy){fast=true;return}if(n===idx||n<0||n>=N)return;idx=n;cam=n*W();dogW=cam+REST*W();face=faceT=1;place();base();showScene(n);poke()}
/* input */
const go=d=>busy?(fast=false):travel(d);
nextB.onclick=()=>travel(1);prevB.onclick=()=>travel(-1);$('#skip').onclick=()=>busy?(fast=true):jump(idx+1);
document.addEventListener('click',e=>{const b=e.target.closest('[data-go],[data-jump],.grp,.pj');if(!b)return;poke();
if(b.dataset.go)travel(+b.dataset.go-idx);else if(b.dataset.jump!==undefined)jump(+b.dataset.jump);
else if(b.classList.contains('grp')){const o=$$(`.obj[data-g=${b.dataset.g}]`);o.forEach(x=>x.classList.add('hl'));setTimeout(()=>o.forEach(x=>x.classList.remove('hl')),2200);if(!busy)trick('watch'),later(300,()=>say('Oh, you found this!'))}
else{const p=PJ[+b.dataset.p];$$('.pj').forEach(x=>x.setAttribute('aria-pressed',x===b));det.hidden=false;det.innerHTML=`<h3>${p.n}</h3><p><b>${p.c}.</b> ${p.d}</p><p><b>Problem explored:</b> ${p.p}</p><p><b>Approach:</b> ${p.a}</p><ul>${p.f.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>Technologies:</b> ${p.t}</p><p><b>What I learned:</b> ${p.l}</p><p>${p.r?`<a href="${p.r}" target="_blank" rel="noopener">View repository</a>`:'<em>Public repository: not available yet.</em>'}</p>`;if(!busy){S='INTERACTING';doHop().then(()=>{S='SITTING'});say('Look what I\'ve found!')}}});
addEventListener('keydown',e=>{poke();if(e.key==='ArrowRight')travel(1);else if(e.key==='ArrowLeft')travel(-1);else if((e.key===' '||e.key==='Enter')&&e.target===document.body){e.preventDefault();travel(1)}});
let sx,sy;view.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});view.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>60&&Math.abs(dy)<60&&!e.target.closest('.card'))travel(dx<0?1:-1)},{passive:true});
let wl=0;addEventListener('wheel',e=>{if(e.target.closest('.card')||Date.now()-wl<1200)return;if(Math.abs(e.deltaY)+Math.abs(e.deltaX)>50){wl=Date.now();travel((e.deltaX||e.deltaY)>0?1:-1)}},{passive:true});
addEventListener('resize',size);
/* start: dog walks in from the left */
size();showScene(0);sc[0].classList.remove('on');dogW=-.2*W();face=faceT=1;T.sit=P.sit=0;requestAnimationFrame(frame);
const pre=new Promise(r=>{const i=new Image();i.onload=i.onerror=r;i.src='profile.jpg'});
Promise.all([pre,new Promise(r=>addEventListener('load',r))]).then(async()=>{$('#loader').classList.add('off');busy=true;await wait(500);const d0=dogW,d1=REST*W();Object.assign(T,{tg:.2,tS:6,tA:14});await tween(3200,k=>dogW=d0+(d1-d0)*(1-Math.pow(1-k,2.2)));await wait(250);base();T.hr=-10;busy=false;S='SITTING';showScene(0);idleAt=trickAt=performance.now();say('Hey! Welcome to my world.',3500)});
})();
