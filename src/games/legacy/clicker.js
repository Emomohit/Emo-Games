// Legacy clicker module
export default function(container, api){
  const div = document.createElement('div'); div.style="text-align:center; color:white;";
  let count = 0, auto = 0, cost = 10, loopId;
  let cookie = document.createElement('div'); cookie.style="font-size:100px; cursor:pointer; user-select:none; transition:transform 0.1s;";
  cookie.textContent = '🍪';
  cookie.onmousedown = ()=>{ cookie.style.transform='scale(0.9)'; count++; api.setScore('Cookies: '+count); };
  cookie.onmouseup = ()=>{ cookie.style.transform='scale(1)'; };
  
  let shop = document.createElement('button'); shop.style="margin-top:20px; padding:10px; cursor:pointer;";
  shop.onclick = ()=>{ if(count>=cost){ count-=cost; auto++; cost=Math.floor(cost*1.5); api.setScore('Cookies: '+count); shop.textContent=`Buy Auto-Clicker (Cost: ${cost})`; } };
  
  function reset(){ count=0; auto=0; cost=10; shop.textContent=`Buy Auto-Clicker (Cost: ${cost})`; api.setScore('Cookies 0'); }
  div.appendChild(cookie); div.appendChild(shop); container.appendChild(div);
  loopId = setInterval(()=>{ if(auto>0){ count+=auto; api.setScore('Cookies: '+count); } }, 1000);
  reset(); return { restart: reset, destroy(){ clearInterval(loopId); } };

