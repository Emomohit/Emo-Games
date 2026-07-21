import React from 'react';

const Topbar = ({ searchQuery, setSearchQuery, onHome }) => {
  return (
    <header className="topbar">
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Search for games..." 
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onHome();
        }}
      />
    </header>
  );
};

export default Topbar;
