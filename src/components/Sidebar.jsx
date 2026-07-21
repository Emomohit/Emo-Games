import React from 'react';
import { CATEGORIES } from '../utils/constants.js';

const Sidebar = ({ activeCategory, setActiveCategory, setSearchQuery, onHome }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={onHome}>P</div>
      <div>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            title={cat.title}
            onClick={() => {
              setActiveCategory(cat.id);
              setSearchQuery('');
              onHome();
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
