// Legacy colormatch module
export default function(container, api){
  const div = document.createElement('div');
  div.style = "text-align:center; color:white;";
  let score = 0, colors = ['Red','Blue','Green','Yellow'], over = false;
  let wordEl = document.createElement('h1'); wordEl.style="font-size:48px; margin-bottom:30px;";
  let btnBox = document.createElement('div'); btnBox.style="display:flex; gap:10px; justify-content:center;";
  let tId, correct;
  
  function next(){
    if(over) return;
    let txt = colors[Math.floor(Math.random()*4)], col = colors[Math.floor(Math.random()*4)];
    correct = col; wordEl.textContent = txt; wordEl.style.color = col.toLowerCase();
    tId = setTimeout(()=>{ over=true; api.setScore('Too slow! Score: '+score); }, 2000 - Math.min(score*50, 1500));
  }
  
  colors.forEach(c => {
    let b = document.createElement('button'); b.textContent=c; b.style="padding:15px; font-size:16px; font-weight:bold; cursor:pointer;";
    b.onclick = ()=>{ if(over)return; clearTimeout(tId); if(c===correct){ score++; api.setScore('Score '+score); next(); } else { over=true; api.setScore('Wrong! Final Score: '+score); }};
    btnBox.appendChild(b);
  });
  
  function reset(){ clearTimeout(tId); score=0; over=false; api.setScore('Match the color, not the word!'); next(); }
  div.appendChild(wordEl); div.appendChild(btnBox); container.appendChild(div); reset();
  return { restart: reset, destroy(){ clearTimeout(tId); } };

