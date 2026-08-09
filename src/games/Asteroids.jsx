import React, { useEffect, useRef, useState } from 'react';

export default function Asteroids({ setScore }) {
  const canvasRef = useRef(null);
  const [score, setScoreVal] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = 600);
    const height = (canvas.height = 400);

    let isRunning = true;
    let scoreCount = 0;
    let livesCount = 3;

    // Ship State
    const ship = {
      x: width / 2,
      y: height / 2,
      r: 14,
      angle: 90 * (Math.PI / 180),
      rotation: 0,
      thrusting: false,
      thrust: { x: 0, y: 0 },
    };

    let bullets = [];
    let asteroids = [];

    // Create Asteroids
    function createAsteroids(num) {
      asteroids = [];
      for (let i = 0; i < num; i++) {
        let x, y;
        do {
          x = Math.floor(Math.random() * width);
          y = Math.floor(Math.random() * height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < 100);

        asteroids.push(newAsteroid(x, y, 30));
      }
    }

    function newAsteroid(x, y, r) {
      const lvl = 1;
      const speed = 1.5;
      return {
        x,
        y,
        r,
        xv: (Math.random() * speed * (Math.random() < 0.5 ? 1 : -1)) / lvl,
        yv: (Math.random() * speed * (Math.random() < 0.5 ? 1 : -1)) / lvl,
      };
    }

    function distBetweenPoints(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    createAsteroids(5);

    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'a') ship.rotation = 0.08;
      if (e.key === 'ArrowRight' || e.key === 'd') ship.rotation = -0.08;
      if (e.key === 'ArrowUp' || e.key === 'w') ship.thrusting = true;
      if (e.key === ' ' || e.key === 'Enter') shootLaser();
    }

    function handleKeyUp(e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        ship.rotation = 0;
      }
      if (e.key === 'ArrowUp' || e.key === 'w') ship.thrusting = false;
    }

    function shootLaser() {
      bullets.push({
        x: ship.x + (4 / 3) * ship.r * Math.cos(ship.angle),
        y: ship.y - (4 / 3) * ship.r * Math.sin(ship.angle),
        xv: 6 * Math.cos(ship.angle),
        yv: -6 * Math.sin(ship.angle),
        life: 40,
      });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const interval = setInterval(() => {
      if (!isRunning) return;

      // Rotate Ship
      ship.angle += ship.rotation;

      // Thrust Ship
      if (ship.thrusting) {
        ship.thrust.x += 0.15 * Math.cos(ship.angle);
        ship.thrust.y -= 0.15 * Math.sin(ship.angle);
      } else {
        ship.thrust.x *= 0.97;
        ship.thrust.y *= 0.97;
      }

      ship.x += ship.thrust.x;
      ship.y += ship.thrust.y;

      // Screen Wrap Ship
      if (ship.x < 0 - ship.r) ship.x = width + ship.r;
      if (ship.x > width + ship.r) ship.x = 0 - ship.r;
      if (ship.y < 0 - ship.r) ship.y = height + ship.r;
      if (ship.y > height + ship.r) ship.y = 0 - ship.r;

      // Update Bullets
      bullets.forEach((b, bIdx) => {
        b.x += b.xv;
        b.y += b.yv;
        b.life--;

        // Screen Wrap Bullets
        if (b.x < 0) b.x = width;
        if (b.x > width) b.x = 0;
        if (b.y < 0) b.y = height;
        if (b.y > height) b.y = 0;

        if (b.life <= 0) bullets.splice(bIdx, 1);
      });

      // Update Asteroids
      asteroids.forEach((a, aIdx) => {
        a.x += a.xv;
        a.y += a.yv;

        // Screen Wrap Asteroids
        if (a.x < 0 - a.r) a.x = width + a.r;
        if (a.x > width + a.r) a.x = 0 - a.r;
        if (a.y < 0 - a.r) a.y = height + a.r;
        if (a.y > height + a.r) a.y = 0 - a.r;

        // Bullet-Asteroid Collision
        bullets.forEach((b, bIdx) => {
          if (distBetweenPoints(b.x, b.y, a.x, a.y) < a.r) {
            bullets.splice(bIdx, 1);

            // Split Asteroid
            if (a.r > 15) {
              asteroids.push(newAsteroid(a.x, a.y, a.r / 2));
              asteroids.push(newAsteroid(a.x, a.y, a.r / 2));
            }
            asteroids.splice(aIdx, 1);

            scoreCount += 50;
            setScoreVal(scoreCount);
            if (setScore) setScore(`Score: ${scoreCount} PTS`);

            if (asteroids.length === 0) createAsteroids(6);
          }
        });

        // Ship-Asteroid Collision
        if (distBetweenPoints(ship.x, ship.y, a.x, a.y) < ship.r + a.r) {
          livesCount--;
          setLives(livesCount);
          if (livesCount <= 0) {
            isRunning = false;
            setGameOver(true);
          } else {
            ship.x = width / 2;
            ship.y = height / 2;
            ship.thrust = { x: 0, y: 0 };
          }
        }
      });

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Draw Ship
      ctx.strokeStyle = '#FF5500';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        ship.x + (4 / 3) * ship.r * Math.cos(ship.angle),
        ship.y - (4 / 3) * ship.r * Math.sin(ship.angle)
      );
      ctx.lineTo(
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.angle) + Math.sin(ship.angle)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.angle) - Math.cos(ship.angle))
      );
      ctx.lineTo(
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.angle) - Math.sin(ship.angle)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.angle) + Math.cos(ship.angle))
      );
      ctx.closePath();
      ctx.stroke();

      // Draw Bullets
      ctx.fillStyle = '#00F0FF';
      bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Asteroids
      ctx.strokeStyle = '#A855F7';
      asteroids.forEach((a) => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // HUD
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.fillText(`SCORE: ${scoreCount}`, 15, 25);
      ctx.fillText(`LIVES: ${'❤️ '.repeat(livesCount)}`, width - 110, 25);

    }, 1000 / 60);

    return () => {
      clearInterval(interval);
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
          <h2 style={{ color: '#FF1E27', margin: 0 }}>SHIP DESTROYED!</h2>
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
            RELAUNCH SHIP 🚀
          </button>
        </div>
      )}
    </div>
  );
}
