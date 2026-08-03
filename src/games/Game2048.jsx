import React from 'react';

export default function Game2048() {
  return (
    <div style={{ width: '100%', height: '550px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255,85,0,0.4)', background: '#000' }}>
      <iframe
        src="/2048-game/index.html"
        title="2048 Original Game"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allowFullScreen
      />
    </div>
  );
}
