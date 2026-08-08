import React, { useEffect, useRef, useState } from 'react';

export default function AirHockey({ setScore }) {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = 500);
    const height = (canvas.height = 400);

    let pScore = 0;
    let aScore = 0;
    let isRunning = true;

    // Mallets & Puck
    const player = { x: width / 2, y: height - 40, r: 22, color: '#FF5500' };
    const ai = { x: width / 2, y: 40, r: 22, color: '#00F0FF', speed: 4 };
    const puck = {
      x: width / 2,
      y: height / 2,
      r: 12,
      vx: 3 * (Math.random() > 0.5 ? 1 : -1),
      vy: 4,
      color: '#FFFFFF',
    };

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      player.x = Math.max(player.r, Math.min(width - player.r, mouseX));
      player.y = Math.max(height / 2 + player.r, Math.min(height - player.r, mouseY));
    }

    canvas.addEventListener('mousemove', handleMouseMove);

    function resetPuck(scoringPlayer) {
      puck.x = width / 2;
      puck.y = height / 2;
      puck.vx = 3 * (Math.random() > 0.5 ? 1 : -1);
      puck.vy = scoringPlayer === 'player' ? -4 : 4;
    }

    const interval = setInterval(() => {
      if (!isRunning) return;

      // AI Movement
      const targetX = puck.y < height / 2 ? puck.x : width / 2;
      if (ai.x < targetX - 5) ai.x += ai.speed;
      else if (ai.x > targetX + 5) ai.x -= ai.speed;

      // Update Puck Position
      puck.x += puck.vx;
      puck.y += puck.vy;

      // Wall Bounce (Left / Right)
      if (puck.x - puck.r <= 0 || puck.x + puck.r >= width) {
        puck.vx *= -1;
      }

      // Goal Collision (Top / Bottom)
      const goalWidth = 160;
      const goalLeft = width / 2 - goalWidth / 2;
      const goalRight = width / 2 + goalWidth / 2;

      if (puck.y - puck.r <= 0) {
        if (puck.x >= goalLeft && puck.x <= goalRight) {
          pScore++;
          setPlayerScore(pScore);
          if (setScore) setScore(`Player: ${pScore} | AI: ${aScore}`);
          resetPuck('player');
        } else {
          puck.vy *= -1;
        }
      }

      if (puck.y + puck.r >= height) {
        if (puck.x >= goalLeft && puck.x <= goalRight) {
          aScore++;
          setAiScore(aScore);
          if (setScore) setScore(`Player: ${pScore} | AI: ${aScore}`);
          resetPuck('ai');
        } else {
          puck.vy *= -1;
        }
      }

      // Mallet - Puck Collision helper
      function checkCollision(mallet) {
        const dx = puck.x - mallet.x;
        const dy = puck.y - mallet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mallet.r + puck.r) {
          const angle = Math.atan2(dy, dx);
          const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy) * 1.05;
          puck.vx = Math.cos(angle) * Math.min(speed, 9);
          puck.vy = Math.sin(angle) * Math.min(speed, 9);
        }
      }

      checkCollision(player);
      checkCollision(ai);

      // Render
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Rink Lines
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Goals
      ctx.fillStyle = '#FF5500';
      ctx.fillRect(goalLeft, 0, goalWidth, 6);
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(goalLeft, height - 6, goalWidth, 6);

      // Draw Mallets
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ai.color;
      ctx.beginPath();
      ctx.arc(ai.x, ai.y, ai.r, 0, Math.PI * 2);
      ctx.fill();

      // Draw Puck
      ctx.fillStyle = puck.color;
      ctx.beginPath();
      ctx.arc(puck.x, puck.y, puck.r, 0, Math.PI * 2);
      ctx.fill();

      // HUD Score
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`AI: ${aScore}`, 15, 25);
      ctx.fillText(`YOU: ${pScore}`, 15, height - 15);
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
          cursor: 'none',
        }}
      />
    </div>
  );
}
