import React, { useState, useEffect } from 'react';

export default function Game2048({ setScore }) {
  const [grid, setGrid] = useState(getInitialGrid());
  const [score, setScoreVal] = useState(0);

  function getInitialGrid() {
    let board = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandom(board);
    addRandom(board);
    return board;
  }

  function addRandom(board) {
    let empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length > 0) {
      let spot = empty[Math.floor(Math.random() * empty.length)];
      board[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function handleKeyDown(e) {
    let key = e.key;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

    let newGrid = grid.map((row) => [...row]);
    let moved = false;
    let addedScore = 0;

    function slide(row) {
      let arr = row.filter((val) => val !== 0);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          addedScore += arr[i];
          arr.splice(i + 1, 1);
        }
      }
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    if (key === 'ArrowLeft') {
      for (let r = 0; r < 4; r++) {
        let res = slide(newGrid[r]);
        if (JSON.stringify(res) !== JSON.stringify(newGrid[r])) moved = true;
        newGrid[r] = res;
      }
    } else if (key === 'ArrowRight') {
      for (let r = 0; r < 4; r++) {
        let reversed = [...newGrid[r]].reverse();
        let res = slide(reversed).reverse();
        if (JSON.stringify(res) !== JSON.stringify(newGrid[r])) moved = true;
        newGrid[r] = res;
      }
    } else if (key === 'ArrowUp') {
      for (let c = 0; c < 4; c++) {
        let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        let res = slide(col);
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== res[r]) moved = true;
          newGrid[r][c] = res[r];
        }
      }
    } else if (key === 'ArrowDown') {
      for (let c = 0; c < 4; c++) {
        let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]].reverse();
        let res = slide(col).reverse();
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== res[r]) moved = true;
          newGrid[r][c] = res[r];
        }
      }
    }

    if (moved) {
      addRandom(newGrid);
      setGrid(newGrid);
      const newScore = score + addedScore;
      setScoreVal(newScore);
      if (setScore) setScore(`2048 Score: ${newScore}`);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, score]);

  return (
    <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>
          Score: {score}
        </span>
        <button
          onClick={() => {
            setGrid(getInitialGrid());
            setScoreVal(0);
          }}
          style={{
            background: '#FF5500',
            color: '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          New Game 🔄
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 75px)',
          gap: '10px',
          justifyContent: 'center',
          background: '#181820',
          padding: '12px',
          borderRadius: '16px',
          margin: '0 auto',
          width: 'fit-content',
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: '75px',
                height: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                borderRadius: '10px',
                background: val === 0 ? '#262633' : val === 2048 ? '#00F0FF' : val > 128 ? '#FF5500' : '#38384d',
                color: val > 4 ? '#fff' : '#ddd',
              }}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
