import React, { useEffect, useRef, useState } from 'react';

const Breakout = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('breakout_highscore')) || 0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Game Constants
    const PADDLE_HEIGHT = 14;
    let paddleWidth = 110;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let balls = [{ x: canvas.width / 2, y: canvas.height - 40, dx: 4, dy: -4, radius: 8 }];
    let particles = [];
    let powerups = [];

    // Brick Grid Setup
    const BRICK_ROWS = 6;
    const BRICK_COLS = 8;
    const BRICK_PADDING = 8;
    const BRICK_OFFSET_TOP = 60;
    const BRICK_OFFSET_LEFT = 35;
    const BRICK_WIDTH = (canvas.width - BRICK_OFFSET_LEFT * 2 - BRICK_PADDING * (BRICK_COLS - 1)) / BRICK_COLS;
    const BRICK_HEIGHT = 22;

    const COLORS = ['#ff0055', '#ff9900', '#ffcc00', '#33cc33', '#00ccff', '#9933ff'];

    let bricks = [];
    const initBricks = () => {
      bricks = [];
      for (let r = 0; r < BRICK_ROWS; r++) {
        bricks[r] = [];
        for (let c = 0; c < BRICK_COLS; c++) {
          const isSteel = r === 0 && Math.random() < 0.25;
          const isTNT = !isSteel && Math.random() < 0.15;
          const hp = isSteel ? Infinity : (r < 2 ? 2 : 1);
          bricks[r][c] = {
            x: 0,
            y: 0,
            status: hp,
            maxHp: hp,
            isSteel,
            isTNT,
            color: COLORS[r % COLORS.length]
          };
        }
      }
    };
    initBricks();

    // Mouse & Touch Controls
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') paddleX = Math.max(0, paddleX - 25);
      if (e.key === 'ArrowRight') paddleX = Math.min(canvas.width - paddleWidth, paddleX + 25);
      if (e.key === ' ') setGameStarted(true);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    // Particle Explosion
    const createExplosion = (x, y, color, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
          x, y,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 1,
          color,
          alpha: 1
        });
      }
    };

    // Powerup Spawner
    const maybeSpawnPowerup = (x, y) => {
      if (Math.random() < 0.25) {
        const types = ['EXPAND', 'MULTIBALL', 'SLOW'];
        const type = types[Math.floor(Math.random() * types.length)];
        powerups.push({ x, y, dy: 2, type });
      }
    };

    // Main Game Loop
    const draw = () => {
      ctx.fillStyle = '#0f0f1b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines (Arcade Retro Effect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw Bricks
      let activeBricks = 0;
      for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          const b = bricks[r][c];
          if (b.status > 0) {
            if (!b.isSteel) activeBricks++;
            const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
            b.x = brickX;
            b.y = brickY;

            ctx.beginPath();
            ctx.roundRect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT, 4);
            if (b.isSteel) {
              ctx.fillStyle = '#666688';
            } else if (b.isTNT) {
              ctx.fillStyle = '#ff2222';
            } else {
              ctx.fillStyle = b.status === 2 ? '#ffffff' : b.color;
            }
            ctx.fill();

            // Glow Border
            ctx.shadowBlur = b.isTNT ? 15 : 8;
            ctx.shadowColor = b.color;
            ctx.strokeStyle = '#ffffff44';
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Check Level Clear
      if (activeBricks === 0 && gameStarted) {
        setGameWon(true);
        return;
      }

      // Draw Paddle
      ctx.beginPath();
      ctx.roundRect(paddleX, canvas.height - PADDLE_HEIGHT - 10, paddleWidth, PADDLE_HEIGHT, 7);
      const paddleGrad = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
      paddleGrad.addColorStop(0, '#00f2fe');
      paddleGrad.addColorStop(1, '#4facfe');
      ctx.fillStyle = paddleGrad;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw & Move Balls
      balls.forEach((ball, bIdx) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        if (!gameStarted) {
          ball.x = paddleX + paddleWidth / 2;
          ball.y = canvas.height - PADDLE_HEIGHT - 20;
          return;
        }

        // Ball Movement
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall Collisions
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
          ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ball.radius) {
          ball.dy = -ball.dy;
        } else if (ball.y + ball.radius >= canvas.height - PADDLE_HEIGHT - 10) {
          // Paddle Bounce
          if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
            let hitPoint = (ball.x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            ball.dx = hitPoint * 6;
            ball.dy = -Math.abs(ball.dy);
          } else if (ball.y > canvas.height) {
            // Ball Lost
            balls.splice(bIdx, 1);
            if (balls.length === 0) {
              setLives((prev) => {
                const nextLives = prev - 1;
                if (nextLives <= 0) {
                  setGameOver(true);
                } else {
                  balls = [{ x: canvas.width / 2, y: canvas.height - 40, dx: 4, dy: -4, radius: 8 }];
                  setGameStarted(false);
                }
                return nextLives;
              });
            }
          }
        }

        // Brick Collision Detection
        for (let r = 0; r < BRICK_ROWS; r++) {
          for (let c = 0; c < BRICK_COLS; c++) {
            const b = bricks[r][c];
            if (b.status > 0) {
              if (
                ball.x > b.x &&
                ball.x < b.x + BRICK_WIDTH &&
                ball.y > b.y &&
                ball.y < b.y + BRICK_HEIGHT
              ) {
                ball.dy = -ball.dy;
                if (!b.isSteel) {
                  b.status -= 1;
                  if (b.status === 0) {
                    setScore((s) => {
                      const newScore = s + 100;
                      if (newScore > highScore) {
                        setHighScore(newScore);
                        localStorage.setItem('breakout_highscore', newScore);
                      }
                      return newScore;
                    });
                    createExplosion(b.x + BRICK_WIDTH / 2, b.y + BRICK_HEIGHT / 2, b.color);
                    maybeSpawnPowerup(b.x + BRICK_WIDTH / 2, b.y + BRICK_HEIGHT / 2);
                  }
                } else {
                  createExplosion(b.x + BRICK_WIDTH / 2, b.y + BRICK_HEIGHT / 2, '#aaaaaa', 5);
                }
              }
            }
          }
        }
      });

      // Update Powerups
      powerups.forEach((p, pIdx) => {
        p.y += p.dy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = p.type === 'EXPAND' ? '#00ffcc' : p.type === 'MULTIBALL' ? '#ff00ff' : '#yellow';
        ctx.fill();

        // Powerup Catch
        if (
          p.y + 10 >= canvas.height - PADDLE_HEIGHT - 10 &&
          p.x > paddleX &&
          p.x < paddleX + paddleWidth
        ) {
          if (p.type === 'EXPAND') paddleWidth = Math.min(180, paddleWidth + 30);
          if (p.type === 'MULTIBALL') {
            balls.push({ x: paddleX + paddleWidth / 2, y: canvas.height - 50, dx: -4, dy: -4, radius: 8 });
          }
          powerups.splice(pIdx, 1);
        }
      });

      // Update Particles
      particles.forEach((pt, ptIdx) => {
        pt.x += pt.dx;
        pt.y += pt.dy;
        pt.alpha -= 0.025;
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.fill();
        ctx.restore();
        if (pt.alpha <= 0) particles.splice(ptIdx, 1);
      });

      if (!gameOver && !gameWon) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, gameWon]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#090912', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '2px', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
        DX-BALL ARCADE
      </h1>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>
        <div>SCORE: <span style={{ color: '#00f2fe' }}>{score}</span></div>
        <div>HIGH SCORE: <span style={{ color: '#ffcc00' }}>{highScore}</span></div>
        <div>LIVES: <span style={{ color: '#ff0055' }}>{'❤️'.repeat(lives)}</span></div>
      </div>

      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={800} height={550} style={{ border: '3px solid rgba(255,255,255,0.15)', borderRadius: '16px', boxShadow: '0 0 40px rgba(0,242,254,0.2)', backgroundColor: '#0f0f1b' }} />

        {!gameStarted && !gameOver && !gameWon && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>MOVE MOUSE / KEYS TO CONTROL</h2>
            <p style={{ fontSize: '1rem', color: '#aaa', marginBottom: '20px' }}>Press Spacebar or Click to Launch Ball</p>
            <button onClick={() => setGameStarted(true)} style={{ padding: '12px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px', border: 'none', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#000', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,242,254,0.5)' }}>
              START GAME
            </button>
          </div>
        )}

        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#ff0055', marginBottom: '10px' }}>GAME OVER</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Final Score: {score}</p>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px', border: 'none', background: '#00f2fe', color: '#000', cursor: 'pointer' }}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breakout;
