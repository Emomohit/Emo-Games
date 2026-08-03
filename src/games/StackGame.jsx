import React, { useEffect, useRef, useState } from 'react';

export default function StackGame({ setScore }) {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScoreVal] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 500;

    let stack = [{ x: 100, w: 200, y: 460, color: '#FF5500' }];
    let currentBlock = { x: 0, w: 200, y: 430, dx: 3, color: '#00F0FF' };
    let scoreCount = 0;
    let isRunning = true;

    function handleClick() {
      if (!isRunning) return;

      const prev = stack[stack.length - 1];
      const diff = currentBlock.x - prev.x;

      if (Math.abs(diff) >= currentBlock.w) {
        isRunning = false;
        setGameOver(true);
        return;
      }

      // Chop block
      const newWidth = currentBlock.w - Math.abs(diff);
      const newX = diff > 0 ? currentBlock.x : prev.x;

      stack.push({ x: newX, w: newWidth, y: currentBlock.y, color: currentBlock.color });
      scoreCount++;
      setScoreVal(scoreCount);
      if (setScore) setScore(`Stacked: ${scoreCount}`);

      // Next block
      const colors = ['#FF5500', '#00F0FF', '#A855F7', '#FF1E27', '#22C55E'];
      currentBlock = {
        x: 0,
        w: newWidth,
        y: currentBlock.y - 30,
        dx: 3 + scoreCount * 0.2,
        color: colors[scoreCount % colors.length],
      };
    }

    canvas.addEventListener('click', handleClick);

    const interval = setInterval(() => {
      if (!isRunning) return;

      currentBlock.x += currentBlock.dx;
      if (currentBlock.x <= 0 || currentBlock.x + currentBlock.w >= canvas.width) {
        currentBlock.dx *= -1;
      }

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Stack
      stack.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, 28);
      });

      // Draw Moving Block
      ctx.fillStyle = currentBlock.color;
      ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.w, 28);

    }, 1000 / 60);

    return () => {
      clearInterval(interval);
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
          <h2 style={{ color: '#FF1E27', margin: 0 }}>TOWER FELL!</h2>
          <p>Height Reached: {score} Blocks</p>
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
            STACK AGAIN 🏗️
          </button>
        </div>
      )}
    </div>
  );
}
