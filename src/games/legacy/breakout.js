// Legacy breakout module
export default function(container, api){
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 300;
  canvas.style = "background:#111; border-radius:12px; touch-action:none; z-index:5; width:100%; max-width:400px;";
  const ctx = canvas.getContext('2d');
  
  let ball = {x:200,y:200,dx:3,dy:-3,r:6};
  let pad = {x:150,w:80,h:10};
  let bricks = [];
  let score=0, over=false, won=false, loopId;

  function reset(){
    ball={x:200,y:200,dx:3,dy:-3,r:6}; pad.x=150; score=0; over=false; won=false; bricks=[];
    for(let r=0;r<4;r++) for(let c=0;c<6;c++) bricks.push({x:c*60+25,y:r*25+30,w:50,h:15,a:true});
  }

  function draw(){
    ctx.clearRect(0,0,400,300);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3498db'; ctx.fillRect(pad.x,280,pad.w,pad.h);
    bricks.forEach((b,i) => { if(b.a){ ctx.fillStyle=`hsl(${i*15},80%,60%)`; ctx.fillRect(b.x,b.y,b.w,b.h); }});
    if(over||won){ ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,400,300); ctx.fillStyle='#fff'; ctx.font='24px sans-serif'; ctx.fillText(won?'You Win!':'Game Over', 150, 150); }
  }

  function tick(){
    if(over||won) return;
    ball.x+=ball.dx; ball.y+=ball.dy;
    if(ball.x+ball.r>400 || ball.x-ball.r<0) ball.dx*=-1;
    if(ball.y-ball.r<0) ball.dy*=-1;
    if(ball.y+ball.r>300) over=true;
    if(ball.y+ball.r>280 && ball.x>pad.x && ball.x<pad.x+pad.w){ ball.dy=-Math.abs(ball.dy); ball.dx=((ball.x-(pad.x+pad.w/2))/(pad.w/2))*4; }
    bricks.forEach(b=>{ if(b.a && ball.x>b.x && ball.x<b.x+b.w && ball.y-ball.r<b.y+b.h && ball.y+ball.r>b.y){ ball.dy*=-1; b.a=false; score++; api.setScore('Score '+score); }});
    if(bricks.every(b=>!b.a)) won=true;
    draw();
  }

  const move = (e)=>{ let rect=canvas.getBoundingClientRect(); let x = (e.clientX||e.touches[0].clientX)-rect.left; pad.x = (x*(400/rect.width))-pad.w/2; };
  canvas.addEventListener('mousemove', move); canvas.addEventListener('touchmove', e=>{e.preventDefault(); move(e);}, {passive:false});

  container.appendChild(canvas); reset(); loopId = setInterval(tick, 16);
  return { restart: reset, destroy(){ clearInterval(loopId); }};

