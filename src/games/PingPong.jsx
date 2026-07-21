import React, { useEffect, useRef, useState } from 'react';

const PingPong = ({ setScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('playing'); // playing, gameover

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    
    const paddle = { width: 10, height: 60, x: 10, y: 150, color: '#3498db', score: 0 };
    const comp = { width: 10, height: 60, x: 580, y: 150, color: '#e74c3c', score: 0 };
    const ball = { x: 300, y: 200, radius: 8, speed: 5, velocityX: 5, velocityY: 5, color: '#fff' };
    
    // User Input
    let userY = 150;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      userY = e.clientY - rect.top - paddle.height / 2;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    function drawRect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

    function drawCircle(x, y, r, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }

    function drawText(text, x, y, color) {
      ctx.fillStyle = color;
      ctx.font = "40px 'Nunito', sans-serif";
      ctx.fillText(text, x, y);
    }

    function collision(b, p) {
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;

      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;

      return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
    }

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.velocityX = -ball.velocityX;
      ball.speed = 5;
    }

    function update() {
      paddle.y = userY;
      
      // Simple AI for computer
      comp.y += ((ball.y - (comp.y + comp.height / 2))) * 0.1;

      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      // Top and bottom collision
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
      }

      // Determine whose paddle the ball is hitting
      let player = (ball.x < canvas.width / 2) ? paddle : comp;

      if (collision(ball, player)) {
        // Where did the ball hit the paddle?
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        
        let angleRad = collidePoint * (Math.PI / 4); // 45 degrees
        
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Speed up the ball
        ball.speed += 0.5;
      }

      // Update scores
      if (ball.x - ball.radius < 0) {
        comp.score++;
        resetBall();
        setScore(`Player: ${paddle.score} - Comp: ${comp.score}`);
      } else if (ball.x + ball.radius > canvas.width) {
        paddle.score++;
        resetBall();
        setScore(`Player: ${paddle.score} - Comp: ${comp.score}`);
      }
    }

    function render() {
      // Clear canvas
      drawRect(0, 0, canvas.width, canvas.height, '#111');
      
      // Draw net
      for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#fff');
      }

      drawText(paddle.score, canvas.width / 4, 50, '#fff');
      drawText(comp.score, 3 * canvas.width / 4, 50, '#fff');

      drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
      drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);
      drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }

    function gameLoop() {
      update();
      render();
      animationFrameId = window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
    setScore('Player: 0 - Comp: 0');

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setScore]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        style={{ borderRadius: '12px', border: '2px solid #333', cursor: 'none' }}
      />
    </div>
  );
};

export default PingPong;
