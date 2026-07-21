import React, { useEffect, useRef, useState } from 'react';
import GAME_MODULES from '../games/legacy/index.js';

const LegacyGameAdapter = ({ gameId, setScore }) => {
  const containerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // Clear container on mount
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    if (!GAME_MODULES[gameId]) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<h2 style="color:white">Game not implemented yet!</h2>';
      }
      return;
    }

    const api = {
      setScore: (text) => setScore(text || ''),
      message: (text) => {
        const p = document.createElement('p');
        p.className = 'screen-msg';
        p.textContent = text;
        if (containerRef.current) containerRef.current.appendChild(p);
      }
    };

    // Initialize the legacy Vanilla JS game
    gameInstanceRef.current = GAME_MODULES[gameId](containerRef.current, api);

    // Cleanup when component unmounts or gameId changes
    return () => {
      if (gameInstanceRef.current && gameInstanceRef.current.destroy) {
        gameInstanceRef.current.destroy();
      }
      gameInstanceRef.current = null;
    };
  }, [gameId, setScore]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;
};

export default LegacyGameAdapter;
