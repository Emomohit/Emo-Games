// Legacy wordscramble module
export default function(container, api){
  const div = document.createElement('div'); div.style="text-align:center; color:white;";
  const words = ['JAVASCRIPT','HTML','GITHUB','ARCADE','REACT','VERCEL','CODING'];
  let w, score=0, over=false;
  
  let h1 = document.createElement('h1'); h1.style="letter-spacing:5px;";
  let input = document.createElement('input'); input.style="padding:10px; font-size:18px;";
  input.onkeydown = (e)=>{
    if(e.key==='Enter'){
      if(input.value.toUpperCase() === w){ score++; api.setScore('Score '+score); next(); }
      else { over=true; api.setScore('Wrong! It was '+w+'. Score: '+score); }
    }
  };
  
  function next(){
    if(over) return;
    w = words[Math.floor(Math.random()*words.length)];
    let s = w.split('').sort(()=>Math.random()-0.5).join('');
    h1.textContent = s; input.value = ''; input.focus();
  }
  function reset(){ score=0; over=false; api.setScore('Score 0'); next(); }
  
  div.appendChild(h1); div.appendChild(input); container.appendChild(div); reset();
  return { restart: reset, destroy(){} };

