import React, { useEffect, useRef, useState } from 'react';

export default function FruitNinja({ setScore }) {
  const canvasRef = useRef(null);
  const [score, setScoreVal] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = 600);
    const height = (canvas.height = 420);

    let isRunning = true;
    let scoreCount = 0;

    let fruits = [];
    let particles = [];
    let mouseTrail = [];

    const FRUIT_TYPES = [
      { emoji: '🍉', radius: 24, score: 10, type: 'fruit' },
      { emoji: '🍎', radius: 20, score: 10, type: 'fruit' },
      { emoji: '🍊', radius: 20, score: 10, type: 'fruit' },
      { emoji: '🍌', radius: 22, score: 15, type: 'fruit' },
      { emoji: '💣', radius: 22, score: 0, type: 'bomb' },
    ];

    function spawnFruit() {
      if (!isRunning) return;
      const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
      const x = Math.random() * (width - 100) + 50;

      fruits.push({
        ...type,
        x,
        y: height + 30,
        vx: (Math.random() - 0.5) * 4,
        vy: -(Math.random() * 4 + 11),
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.1,
        sliced: false,
      });
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseTrail.push({ x, y, life: 10 });
      if (mouseTrail.length > 15) mouseTrail.shift();

      // Check Slicing
      fruits.forEach((f) => {
        if (!f.sliced) {
          const dist = Math.hypot(f.x - x, f.y - y);
          if (dist < f.radius + 10) {
            f.sliced = true;
            if (f.type === 'bomb') {
              isRunning = false;
              setGameOver(true);
            } else {
              scoreCount += f.score;
              setScoreVal(scoreCount);
              if (setScore) setScore(`Score: ${scoreCount} PTS`);

              // Splatter Particles
              for (let i = 0; i < 8; i++) {
                particles.push({
                  x: f.x,
                  y: f.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  life: 20,
                  color: f.emoji === '🍉' ? '#FF1E27' : '#EAB308',
                });
              }
            }
          }
        }
      });
    }

    canvas.addEventListener('mousemove', handleMouseMove);

    let spawnCounter = 0;
    const interval = setInterval(() => {
      if (!isRunning) return;

      spawnCounter++;
      if (spawnCounter % 45 === 0) spawnFruit();

      // Update Fruits
      fruits.forEach((f, idx) => {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.35; // Gravity
        f.rotation += f.vRot;

        if (f.y > height + 50) fruits.splice(idx, 1);
      });

      // Update Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) particles.splice(idx, 1);
      });

      // Update Trail
      mouseTrail.forEach((t) => t.life--);
      mouseTrail = mouseTrail.filter((t) => t.life > 0);

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Draw Particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Fruits
      fruits.forEach((f) => {
        if (!f.sliced) {
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(f.rotation);
          ctx.font = `${f.radius * 2}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(f.emoji, 0, 0);
          ctx.restore();
        }
      });

      // Draw Blade Trail
      if (mouseTrail.length > 1) {
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(mouseTrail[0].x, mouseTrail[0].y);
        for (let i = 1; i < mouseTrail.length; i++) {
          ctx.lineTo(mouseTrail[i].x, mouseTrail[i].y);
        }
        ctx.stroke();
      }

      // HUD
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`SCORE: ${scoreCount}`, 15, 25);
    }, 1000 / 60);

    return () => {
      clearInterval(interval);
      canvas.removeEventListener('mousemove', handleMouseMove);
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
          cursor: 'crosshair',
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
            border: '1px solid #FF1E27',
            color: '#fff',
          }}
        >
          <h2 style={{ color: '#FF1E27', margin: 0 }}>BOMB EXPLODED!</h2>
          <p>Final Slice Score: {score} PTS</p>
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
            SLICE AGAIN 🍉
          </button>
        </div>
      )}
    </div>
  );
}
