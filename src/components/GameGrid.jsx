import React from 'react';
import { getBgClass } from '../utils/constants.js';

const GameGrid = ({ title, games, onOpenGame }) => {
  return (
    <div className="view">
      <h1 className="grid-header">{title}</h1>
      <div className="grid">
        {games.map(g => (
          <div 
            key={g.id} 
            className={`tile ${getBgClass(g.id)} ${g.span ? 'tile-span-2' : ''}`}
            onClick={() => onOpenGame(g.id)}
          >
            {g.emoji}
            <div className="overlay">
              <h3 className="tile-title">{g.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
