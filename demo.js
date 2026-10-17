import MarqueeDrift from './src/index.js';
const names=['morrow','fieldwork','arcwell','softform','northline','stillroom','kindred','openair'];
const el=document.querySelector('#marquee');
for(let i=0;i<8;i++){const img=new Image(160,48);img.className='logo';img.src=`art/logo-${i+1}.png`;img.alt=names[i];el.append(img);}
let drift;function mount(){drift=new MarqueeDrift(el,{speed:+document.querySelector('#speed').value,gap:+document.querySelector('#gap').value});window.drift=drift;}
mount();
for(const id of ['speed','gap'])document.getElementById(id).addEventListener('input',e=>{document.getElementById(`${id}-value`).textContent=`${e.target.value} ${id==='speed'?'px/s':'px'}`;drift?.destroy();mount();document.getElementById('toggle').textContent='Destroy instance';});
document.getElementById('toggle').onclick=e=>{if(drift){drift.destroy();drift=null;e.target.textContent='Create instance';}else{mount();e.target.textContent='Destroy instance';}};
document.getElementById('theme').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';};
