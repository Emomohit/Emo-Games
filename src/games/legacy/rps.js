// Legacy rps module
export default function(container, api){
  const div = document.createElement('div'); div.style="text-align:center; color:white;";
  let score = 0;
  let h2 = document.createElement('h2'); h2.textContent = "Choose your weapon";
  let box = document.createElement('div'); box.style="display:flex; gap:10px; justify-content:center;";
  const choices = ['🪨','📄','✂️'];
  
  choices.forEach((c,i)=>{
    let b = document.createElement('button'); b.textContent = c; b.style="font-size:40px; cursor:pointer; background:#333; border:none; border-radius:10px;";
    b.onclick = ()=>{
      let comp = Math.floor(Math.random()*3);
      if(i === comp) h2.textContent = `Tie! Both picked ${c}`;
      else if((i===0 && comp===2) || (i===1 && comp===0) || (i===2 && comp===1)){ score++; h2.textContent = `Win! ${c} beats ${choices[comp]}`; }
      else { score=0; h2.textContent = `Lose! ${choices[comp]} beats ${c}`; }
      api.setScore('Streak: '+score);
    };
    box.appendChild(b);
  });
  
  div.appendChild(h2); div.appendChild(box); container.appendChild(div);
  return { restart(){ score=0; h2.textContent="Choose your weapon"; api.setScore('Streak 0'); }, destroy(){} };

