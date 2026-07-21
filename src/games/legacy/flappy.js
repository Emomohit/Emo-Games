// Legacy flappy module
export default function(container, api){
  const canvas = document.createElement('canvas');
  canvas.width = 300; canvas.height = 400;
  canvas.style = "background:#71c5cf; border-radius:12px; touch-action:none; z-index:5;";
  const ctx = canvas.getContext('2d');
  
  let box = {y:200, v:0, g:0.6, j:-8};
  let pipes = [];
  let score = 0, over = false, frame = 0, loopId;

  function reset(){ box.y=200; box.v=0; pipes=[]; score=0; over=false; frame=0; }

  function draw(){
    ctx.clearRect(0,0,300,400);
    ctx.fillStyle = '#f1c40f'; ctx.fillRect(50, box.y, 20, 20);
    ctx.fillStyle = '#2ecc71';
    pipes.forEach(p => { ctx.fillRect(p.x, 0, 40, p.top); ctx.fillRect(p.x, p.bottom, 40, 400 - p.bottom); });
    if(over){ ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,300,400); ctx.fillStyle='#fff'; ctx.font='20px sans-serif'; ctx.fillText('Game Over', 100, 200); }
  }

  function tick(){
    if(over) return;
    box.v += box.g; box.y += box.v;
    if(frame % 90 === 0){ const t = Math.random()*220 + 20; pipes.push({x:300, top:t, bottom:t+100}); }
    pipes.forEach(p => { p.x -= 3; if(p.x === 50){ score++; api.setScore('Score '+score); } if(50 < p.x+40 && 70 > p.x && (box.y < p.top || box.y+20 > p.bottom)) over=true; });
    if(box.y > 400 || box.y < 0) over = true;
    pipes = pipes.filter(p => p.x > -50);
    frame++; draw();
    if(over) api.setScore('Game Over - Score: ' + score);
  }

  function jump(){ if(!over) box.v = box.j; }
  const keyH = (e) => { if(e.key===' '||e.key==='ArrowUp'){e.preventDefault(); jump();} };
  document.addEventListener('keydown', keyH);
  canvas.addEventListener('mousedown', jump);
  canvas.addEventListener('touchstart', (e)=>{e.preventDefault(); jump();}, {passive:false});

  container.appendChild(canvas);
  reset(); api.setScore('Score 0'); loopId = setInterval(tick, 20);
  return { restart: reset, destroy(){ clearInterval(loopId); document.removeEventListener('keydown', keyH); }};

