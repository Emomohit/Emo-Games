// Legacy reaction module
export default function(container, api){
  const btn = document.createElement('button');
  btn.style = "width:250px; height:250px; border-radius:50%; border:none; font-size:24px; font-weight:bold; cursor:pointer; background:#e74c3c; color:white; box-shadow:0 10px 20px rgba(0,0,0,0.3);";
  let state = 'waiting', start, tId;
  
  function reset(){
    clearTimeout(tId); state = 'waiting'; btn.style.background = '#e74c3c'; btn.textContent = 'Wait for Green...';
    tId = setTimeout(()=>{ state = 'ready'; btn.style.background = '#2ecc71'; btn.textContent = 'CLICK NOW!'; start = Date.now(); }, 1000 + Math.random()*3000);
  }
  
  btn.onclick = ()=>{
    if(state === 'waiting'){ clearTimeout(tId); btn.textContent = 'Too early! Click to try again.'; state = 'fail'; }
    else if(state === 'ready'){ let time = Date.now()-start; api.setScore(time+' ms'); btn.textContent = `Time: ${time}ms! Click to replay.`; state = 'fail'; }
    else reset();
  };
  
  container.appendChild(btn); reset();
  return { restart: reset, destroy(){ clearTimeout(tId); } };

