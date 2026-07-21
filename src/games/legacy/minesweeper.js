// Legacy minesweeper module
export default function(container, api){
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

