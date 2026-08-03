import React, { useEffect, useRef, useState } from 'react';

export default function SubwayRunner({ setScore }) {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScoreVal] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 400;

    let lane = 1; // 0: left, 1: center, 2: right
    let isJumping = false;
    let jumpY = 0;
    let jumpVelocity = 0;

    let obstacles = [];
    let currentScore = 0;
    let isRunning = true;

    const lanePositions = [100, 250, 400];

    function handleKeyDown(e) {
      if ((e.key === 'ArrowLeft' || e.key === 'a') && lane > 0) lane--;
      if ((e.key === 'ArrowRight' || e.key === 'd') && lane < 2) lane++;
      if ((e.key === 'ArrowUp' || e.key === ' ') && !isJumping) {
        isJumping = true;
        jumpVelocity = 12;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    function spawnObstacle() {
      if (Math.random() < 0.03) {
        obstacles.push({
          lane: Math.floor(Math.random() * 3),
          y: -50,
          w: 60,
          h: 40,
          speed: 5 + Math.floor(currentScore / 200),
        });
      }
    }

    const interval = setInterval(() => {
      if (!isRunning) return;

      currentScore += 1;
      setScoreVal(currentScore);
      if (setScore) setScore(`Distance: ${currentScore}m`);

      // Jump Physics
      if (isJumping) {
        jumpY += jumpVelocity;
        jumpVelocity -= 0.8;
        if (jumpY <= 0) {
          jumpY = 0;
          isJumping = false;
        }
      }

      spawnObstacle();

      // Update Obstacles
      obstacles.forEach((obs, idx) => {
        obs.y += obs.speed;
        if (obs.y > canvas.height) obstacles.splice(idx, 1);

        // Collision Check
        if (
          obs.lane === lane &&
          obs.y + obs.h >= canvas.height - 80 - jumpY &&
          obs.y <= canvas.height - 40 - jumpY
        ) {
          isRunning = false;
          setGameOver(true);
        }
      });

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Lanes
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(175, 0); ctx.lineTo(175, canvas.height);
      ctx.moveTo(325, 0); ctx.lineTo(325, canvas.height);
      ctx.stroke();

      // Draw Obstacles
      ctx.fillStyle = '#FF1E27';
      obstacles.forEach((obs) => {
        ctx.fillRect(lanePositions[obs.lane] - obs.w / 2, obs.y, obs.w, obs.h);
      });

      // Draw Player (Runner)
      const playerX = lanePositions[lane];
      const playerY = canvas.height - 70 - jumpY;

      ctx.fillStyle = '#FF5500';
      ctx.fillRect(playerX - 20, playerY, 40, 50);

      // Skateboard
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(playerX - 25, playerY + 50, 50, 8);

    }, 1000 / 60);

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
          <h2 style={{ color: '#FF1E27', margin: 0 }}>CRASHED!</h2>
          <p>Distance Traveled: {score}m</p>
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
            RUN AGAIN 🛹
          </button>
        </div>
      )}
    </div>
  );
}
