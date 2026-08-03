import React from 'react';

export default function SubwayRunner() {
  return (
    <div style={{ width: '100%', height: '550px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255,85,0,0.4)', background: '#000' }}>
      <iframe
        src="/subway-surfers/index.html"
        title="Subway Surfers: Zurich (Real Unity WebGL)"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad"
        allowFullScreen
      />
    </div>
  );
}
