// Legacy mathquiz module
export default function(container, api){
  const div = document.createElement('div'); div.style="text-align:center;";
  let qEl = document.createElement('h2'); qEl.style="font-size:40px; color:white;";
  let ansEl = document.createElement('div'); ansEl.style="display:flex; gap:10px; justify-content:center;";
  let score = 0, ans, over=false, tId;
  
  function next(){
    if(over) return;
    let a=Math.floor(Math.random()*20)+1, b=Math.floor(Math.random()*20)+1; ans = a+b;
    qEl.textContent = `${a} + ${b} = ?`; ansEl.innerHTML = '';
    let opts = [ans, ans+Math.floor(Math.random()*5)+1, ans-Math.floor(Math.random()*5)-1].sort(()=>Math.random()-0.5);
    opts.forEach(o=>{
      let btn = document.createElement('button'); btn.textContent=o; btn.style="padding:15px 25px; font-size:20px; cursor:pointer;";
      btn.onclick = ()=>{ if(over)return; clearTimeout(tId); if(o===ans){ score++; api.setScore('Score '+score); next(); } else { over=true; api.setScore('Wrong! Score '+score); } };
      ansEl.appendChild(btn);
    });
    tId = setTimeout(()=>{ over=true; api.setScore('Time up! Score '+score); }, 3000);
  }
  function reset(){ clearTimeout(tId); score=0; over=false; api.setScore('Score 0'); next(); }
  div.appendChild(qEl); div.appendChild(ansEl); container.appendChild(div); reset();
  return { restart: reset, destroy(){ clearTimeout(tId); } };

