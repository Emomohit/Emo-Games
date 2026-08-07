import React, { useEffect, useRef, useState } from 'react';

const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 3, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 1, 1],
  [0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 0, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const TILE_SIZE = 24;

export default function PacMan({ setScore }) {
  const canvasRef = useRef(null);
  const [score, setScoreVal] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const grid = MAP.map((row) => [...row]);
    const rows = grid.length;
    const cols = grid[0].length;

    canvas.width = cols * TILE_SIZE;
    canvas.height = rows * TILE_SIZE;

    let pacman = { x: 7, y: 10, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0.2, dir: 0 };
    let ghosts = [
      { x: 6, y: 6, dx: 1, dy: 0, color: '#EF4444' },
      { x: 8, y: 6, dx: -1, dy: 0, color: '#00F0FF' },
      { x: 7, y: 5, dx: 0, dy: -1, color: '#A855F7' },
    ];

    let currentScore = 0;
    let isRunning = true;

    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'a') { pacman.nextDx = -1; pacman.nextDy = 0; }
      if (e.key === 'ArrowRight' || e.key === 'd') { pacman.nextDx = 1; pacman.nextDy = 0; }
      if (e.key === 'ArrowUp' || e.key === 'w') { pacman.nextDx = 0; pacman.nextDy = -1; }
      if (e.key === 'ArrowDown' || e.key === 's') { pacman.nextDx = 0; pacman.nextDy = 1; }
    }

    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      if (!isRunning) return;

      // Try direction change
      if (
        pacman.nextDx !== 0 || pacman.nextDy !== 0
      ) {
        const nextX = pacman.x + pacman.nextDx;
        const nextY = pacman.y + pacman.nextDy;
        if (
          nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows && grid[nextY][nextX] !== 1
        ) {
          pacman.dx = pacman.nextDx;
          pacman.dy = pacman.nextDy;
        }
      }

      // Move Pacman
      const targetX = pacman.x + pacman.dx;
      const targetY = pacman.y + pacman.dy;

      if (
        targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows && grid[targetY][targetX] !== 1
      ) {
        pacman.x = targetX;
        pacman.y = targetY;
      }

      // Dot Collision
      if (grid[pacman.y][pacman.x] === 2) {
        grid[pacman.y][pacman.x] = 0;
        currentScore += 10;
        setScoreVal(currentScore);
        if (setScore) setScore(`Pac-Man Score: ${currentScore} PTS`);
      } else if (grid[pacman.y][pacman.x] === 3) {
        grid[pacman.y][pacman.x] = 0;
        currentScore += 50;
        setScoreVal(currentScore);
        if (setScore) setScore(`Pac-Man Score: ${currentScore} PTS`);
      }

      // Move Ghosts
      ghosts.forEach((g) => {
        const possibleMoves = [];
        const directions = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
        ];

        directions.forEach((d) => {
          const nx = g.x + d.dx;
          const ny = g.y + d.dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny][nx] !== 1) {
            possibleMoves.push(d);
          }
        });

        if (possibleMoves.length > 0) {
          const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          g.x += move.dx;
          g.y += move.dy;
        }

        // Ghost Collision
        if (g.x === pacman.x && g.y === pacman.y) {
          isRunning = false;
          setGameOver(true);
        }
      });

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid (Walls & Dots)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === 1) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1;
            ctx.strokeRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          } else if (grid[r][c] === 2) {
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (grid[r][c] === 3) {
            ctx.fillStyle = '#ff5500';
            ctx.beginPath();
            ctx.arc(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Pacman
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.arc(
        pacman.x * TILE_SIZE + TILE_SIZE / 2,
        pacman.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2 - 2,
        0.2 * Math.PI,
        1.8 * Math.PI
      );
      ctx.lineTo(pacman.x * TILE_SIZE + TILE_SIZE / 2, pacman.y * TILE_SIZE + TILE_SIZE / 2);
      ctx.fill();

      // Draw Ghosts
      ghosts.forEach((g) => {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(
          g.x * TILE_SIZE + TILE_SIZE / 2,
          g.y * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    }, 160);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid rgba(255,85,0,0.5)',
          borderRadius: '12px',
          background: '#0a0a0f',
        }}
      />
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(10,10,15,0.95)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #FF5500',
            color: '#fff',
          }}
        >
          <h2 style={{ color: '#FF1E27', margin: 0 }}>GAME OVER</h2>
          <p>Final Score: {score} PTS</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#FF5500',
              color: '#000',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            PLAY AGAIN 🟡
          </button>
        </div>
      )}
    </div>
  );
}
