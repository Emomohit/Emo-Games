import React, { useEffect, useRef, useState } from 'react';

export default function SpaceInvaders({ setScore }) {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = 600);
    const height = (canvas.height = 400);

    let animationFrameId;
    let score = 0;
    let isRunning = true;

    // Player Ship
    const player = {
      x: width / 2 - 20,
      y: height - 35,
      w: 40,
      h: 18,
      speed: 6,
      dx: 0,
    };

    // Bullets & Aliens & Particles
    let bullets = [];
    let alienBullets = [];
    let aliens = [];
    let particles = [];

    // Create Alien Grid
    const rows = 4;
    const cols = 8;
    const alienW = 32;
    const alienH = 22;
    const padding = 15;
    const offsetTop = 40;
    const offsetLeft = 45;

    let alienSpeed = 1.2;
    let alienDirection = 1;

    function initAliens() {
      aliens = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          aliens.push({
            x: offsetLeft + c * (alienW + padding),
            y: offsetTop + r * (alienH + padding),
            w: alienW,
            h: alienH,
            alive: true,
            type: r === 0 ? 'boss' : r < 2 ? 'medium' : 'regular',
          });
        }
      }
    }

    initAliens();

    function createExplosion(x, y, color) {
      for (let i = 0; i < 12; i++) {
        particles.push({
          x,
          y,
          dx: (Math.random() - 0.5) * 5,
          dy: (Math.random() - 0.5) * 5,
          radius: Math.random() * 3 + 1,
          color,
          alpha: 1,
        });
      }
    }

    // Key handlers
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
      if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10, speed: 7 });
      }
    }

    function handleKeyUp(e) {
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'ArrowRight' ||
        e.key === 'd'
      ) {
        player.dx = 0;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Main Game Loop
    function update() {
      if (!isRunning) return;

      // Move Player
      player.x += player.dx;
      if (player.x < 0) player.x = 0;
      if (player.x + player.w > width) player.x = width - player.w;

      // Update Bullets
      bullets.forEach((b, index) => {
        b.y -= b.speed;
        if (b.y < 0) bullets.splice(index, 1);
      });

      // Update Aliens
      let shiftDown = false;
      let aliveCount = 0;

      aliens.forEach((a) => {
        if (!a.alive) return;
        aliveCount++;
        a.x += alienSpeed * alienDirection;
        if (a.x + a.w >= width - 20 || a.x <= 20) {
          shiftDown = true;
        }

        // Alien reaches bottom
        if (a.y + a.h >= player.y) {
          isRunning = false;
          setGameOver(true);
        }
      });

      if (shiftDown) {
        alienDirection *= -1;
        aliens.forEach((a) => (a.y += 12));
      }

      // Respawn aliens if all destroyed
      if (aliveCount === 0) {
        alienSpeed += 0.5;
        initAliens();
      }

      // Bullet-Alien Collisions
      bullets.forEach((b, bIdx) => {
        aliens.forEach((a) => {
          if (
            a.alive &&
            b.x > a.x &&
            b.x < a.x + a.w &&
            b.y > a.y &&
            b.y < a.y + a.h
          ) {
            a.alive = false;
            bullets.splice(bIdx, 1);
            score += 100;
            setCurrentScore(score);
            if (setScore) setScore(`Score: ${score} PTS`);
            createExplosion(a.x + a.w / 2, a.y + a.h / 2, '#FF5500');
          }
        });
      });

      // Update Particles
      particles.forEach((p, pIdx) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) particles.splice(pIdx, 1);
      });

      // Draw Screen
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Draw Player Ship
      ctx.fillStyle = '#FF5500';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillRect(player.x + 14, player.y - 6, 12, 6);

      // Draw Bullets
      ctx.fillStyle = '#00F0FF';
      bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Draw Aliens
      aliens.forEach((a) => {
        if (!a.alive) return;
        ctx.fillStyle =
          a.type === 'boss' ? '#A855F7' : a.type === 'medium' ? '#FF1E27' : '#00F0FF';
        ctx.fillRect(a.x, a.y, a.w, a.h);
      });

      // Draw Particles
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(`SCORE: ${score}`, 15, 25);

      if (isRunning) {
        animationFrameId = requestAnimationFrame(update);
      }
    }

    update();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid rgba(255,85,0,0.5)',
          borderRadius: '12px',
          boxShadow: '0 0 25px rgba(255,85,0,0.25)',
          maxWidth: '100%',
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
          <p>Final Score: {currentScore} PTS</p>
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
