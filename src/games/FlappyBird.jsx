import React, { useEffect, useRef, useState } from 'react';

export default function FlappyBird({ setScore }) {
  const canvasRef = useRef(null);
  const [score, setScoreVal] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 500;

    let birdY = 200;
    let velocity = 0;
    const gravity = 0.5;
    const jump = -8.5;

    let pipes = [];
    let frame = 0;
    let scoreCount = 0;
    let isRunning = true;

    function handleKeyDown(e) {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        velocity = jump;
      }
    }

    function handleClick() {
      velocity = jump;
    }

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleClick);

    const interval = setInterval(() => {
      if (!isRunning) return;

      frame++;

      // Velocity & Gravity
      velocity += gravity;
      birdY += velocity;

      // Spawn Pipes
      if (frame % 80 === 0) {
        const gap = 120;
        const topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 30;
        pipes.push({
          x: canvas.width,
          top: topHeight,
          bottom: topHeight + gap,
          passed: false,
        });
      }

      // Update Pipes
      pipes.forEach((p, idx) => {
        p.x -= 3;
        if (p.x < -60) pipes.splice(idx, 1);

        // Score
        if (!p.passed && p.x < 100) {
          p.passed = true;
          scoreCount++;
          setScoreVal(scoreCount);
          if (setScore) setScore(`Score: ${scoreCount}`);
        }

        // Collision Check
        if (
          100 + 20 > p.x &&
          100 < p.x + 50 &&
          (birdY < p.top || birdY + 20 > p.bottom)
        ) {
          isRunning = false;
          setGameOver(true);
        }
      });

      // Ground or Ceiling Collision
      if (birdY < 0 || birdY + 20 >= canvas.height) {
        isRunning = false;
        setGameOver(true);
      }

      // Draw
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Pipes
      ctx.fillStyle = '#22C55E';
      pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, 50, p.top);
        ctx.fillRect(p.x, p.bottom, 50, canvas.height - p.bottom);
      });

      // Draw Bird
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.arc(110, birdY + 10, 12, 0, Math.PI * 2);
      ctx.fill();

    }, 1000 / 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handleClick);
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
          cursor: 'pointer',
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
          <h2 style={{ color: '#FF1E27', margin: 0 }}>CRASHED!</h2>
          <p>Final Score: {score} Pipes</p>
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
            FLY AGAIN 🐦
          </button>
        </div>
      )}
    </div>
  );
}
