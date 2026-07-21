// Legacy simon module
export default function(container, api){
  const grid = document.createElement('div'); grid.style="display:grid; grid-template-columns:100px 100px; gap:10px;";
  let seq = [], step = 0, playing = false, tId;
  const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71'], btns = [];
  
  colors.forEach((c,i)=>{
    let b = document.createElement('div'); b.style=`width:100px;height:100px;background:${c};opacity:0.5;border-radius:10px;cursor:pointer;`;
    b.onclick = ()=>{
      if(playing) return;
      flash(i);
      if(i === seq[step]){ step++; if(step === seq.length) setTimeout(next, 1000); }
      else { api.setScore('Game Over! Score: '+(seq.length-1)); seq=[]; playing=true; }
    };
    btns.push(b); grid.appendChild(b);
  });
  
  function flash(i){ btns[i].style.opacity=1; setTimeout(()=>btns[i].style.opacity=0.5, 300); }
  function playSeq(){
    playing = true; let i=0;
    let loop = setInterval(()=>{ flash(seq[i]); i++; if(i>=seq.length){ clearInterval(loop); playing=false; } }, 600);
  }
  function next(){ seq.push(Math.floor(Math.random()*4)); step=0; api.setScore('Level '+seq.length); playSeq(); }
  function reset(){ seq=[]; next(); }
  
  container.appendChild(grid); reset();
  return { restart: reset, destroy(){} };

