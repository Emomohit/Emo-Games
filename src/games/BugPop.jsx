import React, { useState, useEffect } from 'react';

export default function BugPop({ setScore }) {
  const [bugs, setBugs] = useState([]);
  const [score, setScoreVal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const bugSpawner = setInterval(() => {
      if (timeLeft > 0) {
        const id = Math.random();
        const bugTypes = ['🐛', '🕷️', '🦟', '🪲'];
        const emoji = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        const x = Math.floor(Math.random() * 80) + 10;
        const y = Math.floor(Math.random() * 70) + 15;

        setBugs((prev) => [...prev.slice(-8), { id, emoji, x, y }]);
      }
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(bugSpawner);
    };
  }, [timeLeft]);

  function handleSquash(id) {
    if (timeLeft <= 0) return;
    setBugs((prev) => prev.filter((b) => b.id !== id));
    setScoreVal((s) => {
      const newScore = s + 1;
      if (setScore) setScore(`Bugs Squashed: ${newScore}`);
      return newScore;
    });
  }

  return (
    <div
      style={{
        textAlign: 'center',
        color: '#fff',
        padding: '20px',
        position: 'relative',
        minHeight: '400px',
        background: '#0a0a0f',
        borderRadius: '16px',
        border: '2px solid rgba(255,85,0,0.5)',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Squashed: {score} 🐛</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: timeLeft < 10 ? '#FF1E27' : '#00F0FF' }}>
          Time: {timeLeft}s ⏱️
        </span>
      </div>

      {timeLeft > 0 ? (
        bugs.map((b) => (
          <div
            key={b.id}
            onClick={() => handleSquash(b.id)}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              fontSize: '36px',
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
              transition: 'transform 0.1s',
            }}
          >
            {b.emoji}
          </div>
        ))
      ) : (
        <div style={{ paddingTop: '80px' }}>
          <h2 style={{ color: '#FF5500', fontSize: '32px', margin: 0 }}>TIME'S UP!</h2>
          <p style={{ fontSize: '20px' }}>Total Bugs Squashed: {score}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#FF5500',
              color: '#000',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            SQUASH AGAIN 🐛
          </button>
        </div>
      )}
    </div>
  );
}
