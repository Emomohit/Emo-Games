import os
import subprocess

games = [
    {
        "id": "flappy",
        "title": "Flappy Box",
        "emoji": "🐦",
        "category": "arcade",
        "span": "true",
        "js": """GAME_MODULES.flappy = function(container, api){
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
};"""
    },
    {
        "id": "breakout",
        "title": "Brick Breaker",
        "emoji": "🧱",
        "category": "classic",
        "span": "false",
        "js": """GAME_MODULES.breakout = function(container, api){
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
};"""
    },
    {
        "id": "minesweeper",
        "title": "Minesweeper",
        "emoji": "💣",
        "category": "puzzle",
        "span": "false",
        "js": """GAME_MODULES.minesweeper = function(container, api){
  const grid = document.createElement('div');
  grid.style = "display:grid; grid-template-columns:repeat(8, 35px); gap:2px; background:#444; padding:5px; border-radius:8px;";
  let board = [], over = false, won = false, score = 0;
  
  function reset(){
    grid.innerHTML = ''; board = []; over = false; won = false; score = 0;
    for(let r=0;r<8;r++){
      let row = [];
      for(let c=0;c<8;c++){
        let cell = { r, c, mine: Math.random()<0.15, rev: false, flag: false };
        let btn = document.createElement('button');
        btn.style = "width:35px; height:35px; font-weight:bold; background:#777; border:1px solid #555; cursor:pointer;";
        btn.oncontextmenu = (e)=>{ e.preventDefault(); if(over||cell.rev)return; cell.flag=!cell.flag; btn.textContent = cell.flag?'🚩':''; };
        btn.onclick = ()=>{ clickCell(cell, btn); };
        cell.btn = btn; grid.appendChild(btn); row.push(cell);
      }
      board.push(row);
    }
  }
  
  function getAdj(r,c){ let a=[]; for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++) if(board[r+i]&&board[r+i][c+j]) a.push(board[r+i][c+j]); return a; }
  
  function clickCell(cell, btn){
    if(over||won||cell.rev||cell.flag) return;
    cell.rev = true;
    if(cell.mine){ over=true; btn.style.background='red'; btn.textContent='💣'; api.setScore('Game Over!'); return; }
    btn.style.background = '#aaa'; score++; api.setScore('Safe: '+score);
    let m = getAdj(cell.r, cell.c).filter(x=>x.mine).length;
    if(m>0) btn.textContent = m; else getAdj(cell.r, cell.c).forEach(x=>clickCell(x, x.btn));
  }
  
  container.appendChild(grid); reset();
  return { restart: reset, destroy(){} };
};"""
    },
    {
        "id": "reaction",
        "title": "Reaction Test",
        "emoji": "⚡",
        "category": "reflex",
        "span": "false",
        "js": """GAME_MODULES.reaction = function(container, api){
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
};"""
    },
    {
        "id": "colormatch",
        "title": "Color Match",
        "emoji": "🎨",
        "category": "puzzle",
        "span": "false",
        "js": """GAME_MODULES.colormatch = function(container, api){
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
};"""
    },
    {
        "id": "mathquiz",
        "title": "Math Quiz",
        "emoji": "➕",
        "category": "puzzle",
        "span": "false",
        "js": """GAME_MODULES.mathquiz = function(container, api){
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
};"""
    },
    {
        "id": "clicker",
        "title": "Cookie Clicker",
        "emoji": "🍪",
        "category": "strategy",
        "span": "true",
        "js": """GAME_MODULES.clicker = function(container, api){
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
};"""
    },
    {
        "id": "simon",
        "title": "Simon Says",
        "emoji": "🔲",
        "category": "memory",
        "span": "false",
        "js": """GAME_MODULES.simon = function(container, api){
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
};"""
    },
    {
        "id": "wordscramble",
        "title": "Word Scramble",
        "emoji": "📝",
        "category": "puzzle",
        "span": "false",
        "js": """GAME_MODULES.wordscramble = function(container, api){
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
};"""
    },
    {
        "id": "rps",
        "title": "Rock Paper",
        "emoji": "✂️",
        "category": "strategy",
        "span": "false",
        "js": """GAME_MODULES.rps = function(container, api){
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
};"""
    }
]

def add_games():
    for game in games:
        # Read index.html
        with open('index.html', 'r', encoding='utf-8') as f:
            html = f.read()
        
        # 1. Insert into GAMES array
        marker_arr = "];\\n\\n/* ============ Navigation ============ */"
        insert_obj = f"  {{ id:'{game['id']}', title:'{game['title']}', emoji:'{game['emoji']}', category:'{game['category']}', span:{game['span']} }},\\n];\\n\\n/* ============ Navigation ============ */"
        html = html.replace(marker_arr, insert_obj)
        
        # 2. Insert JS module
        marker_js = "const GAME_MODULES = {};"
        insert_js = f"const GAME_MODULES = {{}};\\n\\n{game['js']}"
        html = html.replace(marker_js, insert_js)
        
        # Write back
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        # Git commit
        subprocess.run(["git", "add", "index.html"], check=True)
        subprocess.run(["git", "commit", "-m", f"Add {game['title']} game"], check=True)
        print(f"Committed {game['title']}")

    # Push all
    subprocess.run(["git", "push"], check=True)
    print("All games pushed successfully!")

if __name__ == '__main__':
    # Make sure cwd is right
    os.chdir(r"e:\Emo Games")
    add_games()
