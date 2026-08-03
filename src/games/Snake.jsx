import React, { useEffect, useRef, useState } from 'react';

export default function Snake({ setScore }) {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScoreVal] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    let snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = -1;
    let currentScore = 0;
    let isRunning = true;

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };
    }

    function handleKeyDown(e) {
      if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
      }
      if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
      }
      if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
      }
      if (e.key === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      if (!isRunning) return;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
      ) {
        isRunning = false;
        setGameOver(true);
        return;
      }

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          isRunning = false;
          setGameOver(true);
          return;
        }
      }

      snake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScoreVal(currentScore);
        if (setScore) setScore(`Snake Score: ${currentScore} PTS`);
        placeFood();
      } else {
        snake.pop();
      }

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Food
      ctx.fillStyle = '#FF1E27';
      ctx.beginPath();
      ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake
      snake.forEach((part, idx) => {
        ctx.fillStyle = idx === 0 ? '#FF5500' : '#00F0FF';
        ctx.fillRect(
          part.x * gridSize + 1,
          part.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2
        );
      });
    }, 100);

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
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
