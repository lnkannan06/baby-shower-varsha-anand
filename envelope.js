(() => {
 const stage=document.getElementById('stage'),card=document.getElementById('card'),front=document.getElementById('front'),back=document.getElementById('back'),seal=document.getElementById('open-envelope');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let opened=false,busy=false;
 function activate(face){for(const el of [front,back]){el.hidden=el!==face;el.inert=el!==face;el.setAttribute('aria-hidden',String(el!==face));}}
 function finishOpen(){stage.classList.add('opened');document.getElementById('tap-note').hidden=true;document.getElementById('opening-note').hidden=true;document.getElementById('skip').hidden=true;seal.setAttribute('aria-expanded','true');activate(front);opened=true;busy=false;document.getElementById('see-inside').focus({preventScroll:true});}
 function open(instant=false){if(opened||busy)return;busy=true;seal.disabled=true;stage.classList.add('opening');if(instant||reduced){finishOpen();return;}
 const box=document.getElementById('confetti');for(let i=0;i<14;i++){const bit=document.createElement('span');bit.textContent=['✦','☾','✧','♡'][i%4];bit.style.setProperty('--x',`${Math.cos(i*2.4)*(90+i*9)}px`);bit.style.setProperty('--y',`${-140-(i%5)*45}px`);bit.style.setProperty('--r',`${i*31-160}deg`);bit.style.setProperty('--delay',`${.4+i*.035}s`);box.appendChild(bit);}setTimeout(finishOpen,1800);setTimeout(()=>box.replaceChildren(),3600);}
 function flip(toBack){if(busy||!opened)return;busy=true;const target=toBack?back:front;const focus=()=>{(toBack?document.getElementById('details-title'):document.getElementById('see-inside')).focus({preventScroll:true});card.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});};
 if(reduced){activate(target);busy=false;focus();return;}card.classList.add('turn-out');setTimeout(()=>{activate(target);card.classList.remove('turn-out');card.classList.add('turn-in');focus();setTimeout(()=>{card.classList.remove('turn-in');busy=false;},350);},300);}
 seal.addEventListener('click',()=>open());document.getElementById('see-inside').addEventListener('click',()=>flip(true));document.getElementById('see-front').addEventListener('click',()=>flip(false));document.getElementById('skip').addEventListener('click',()=>{if(busy)return;open(true);flip(true);});
})();
