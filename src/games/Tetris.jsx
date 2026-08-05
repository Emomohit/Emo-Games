import React, { useEffect, useRef, useState } from 'react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

const COLORS = {
  I: '#00F0FF',
  J: '#3B82F6',
  L: '#FF5500',
  O: '#EAB308',
  S: '#22C55E',
  T: '#A855F7',
  Z: '#EF4444',
};

export default function Tetris({ setScore }) {
  const canvasRef = useRef(null);
  const [score, setScoreVal] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;

    let board = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0));

    let scoreCount = 0;
    let totalLines = 0;
    let isRunning = true;

    let currentPiece = getRandomPiece();

    function getRandomPiece() {
      const keys = Object.keys(SHAPES);
      const type = keys[Math.floor(Math.random() * keys.length)];
      return {
        type,
        shape: SHAPES[type],
        color: COLORS[type],
        x: Math.floor(COLS / 2) - 1,
        y: 0,
      };
    }

    function collide(pX, pY, shape) {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const newX = pX + c;
            const newY = pY + r;
            if (
              newX < 0 ||
              newX >= COLS ||
              newY >= ROWS ||
              (newY >= 0 && board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    }

    function lockPiece() {
      const { shape, color, x, y } = currentPiece;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            if (y + r < 0) {
              isRunning = false;
              setGameOver(true);
              return;
            }
            board[y + r][x + c] = color;
          }
        }
      }

      // Check lines
      let lines = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every((cell) => cell !== 0)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(0));
          lines++;
          r++;
        }
      }

      if (lines > 0) {
        totalLines += lines;
        scoreCount += lines * 100 * lines;
        setScoreVal(scoreCount);
        setLinesCleared(totalLines);
        if (setScore) setScore(`Score: ${scoreCount} | Lines: ${totalLines}`);
      }

      currentPiece = getRandomPiece();
      if (collide(currentPiece.x, currentPiece.y, currentPiece.shape)) {
        isRunning = false;
        setGameOver(true);
      }
    }

    function moveLeft() {
      if (!collide(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x--;
      }
    }

    function moveRight() {
      if (!collide(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x++;
      }
    }

    function moveDown() {
      if (!collide(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
      } else {
        lockPiece();
      }
    }

    function rotate() {
      const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map((row) => row[i]).reverse()
      );
      if (!collide(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
      }
    }

    function handleKeyDown(e) {
      if (!isRunning) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
      if (e.key === 'ArrowDown' || e.key === 's') moveDown();
      if (e.key === 'ArrowUp' || e.key === 'w') rotate();
      if (e.key === ' ') {
        while (!collide(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
          currentPiece.y++;
        }
        lockPiece();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    let dropCounter = 0;
    const interval = setInterval(() => {
      if (!isRunning) return;
      dropCounter++;
      if (dropCounter % 4 === 0) {
        moveDown();
      }

      // Draw
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = '#181820';
      ctx.lineWidth = 1;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          if (board[r][c]) {
            ctx.fillStyle = board[r][c];
            ctx.fillRect(
              c * BLOCK_SIZE + 1,
              r * BLOCK_SIZE + 1,
              BLOCK_SIZE - 2,
              BLOCK_SIZE - 2
            );
          }
        }
      }

      // Draw Current Piece
      ctx.fillStyle = currentPiece.color;
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            ctx.fillRect(
              (currentPiece.x + c) * BLOCK_SIZE + 1,
              (currentPiece.y + r) * BLOCK_SIZE + 1,
              BLOCK_SIZE - 2,
              BLOCK_SIZE - 2
            );
          }
        }
      }
    }, 1000 / 30);

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
          <p>Lines Cleared: {linesCleared}</p>
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
            PLAY AGAIN 🧱
          </button>
        </div>
      )}
    </div>
  );
}
