import React, { useState } from 'react';
import { CATEGORIES, GAMES, getBgClass } from './utils/constants.js';
import LegacyGameAdapter from './components/LegacyGameAdapter.jsx';
import PingPong from './games/PingPong.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGameId, setActiveGameId] = useState(null);
  const [scoreText, setScoreText] = useState('');

  const activeGameDef = GAMES.find(g => g.id === activeGameId);

  // Filter games based on search and category
  const filteredGames = GAMES.filter(g => {
    if (searchQuery) return g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return activeCategory === 'all' || g.category === activeCategory;
  });

  const getSidebarTitle = () => {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    return cat.id === 'all' ? 'Online Games (Ad-Free)' : `${cat.title} Games`;
  };

  const handleOpenGame = (id) => {
    setActiveGameId(id);
    setScoreText('Initializing...');
  };

  const handleBackToHome = () => {
    setActiveGameId(null);
  };

  const handleHomeAction = () => {
    if (activeGameId) handleBackToHome();
  };

  return (
    <>
      <Sidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        setSearchQuery={setSearchQuery}
        onHome={handleHomeAction}
      />

      {/* Main Content */}
      <main className="main-area">
        <Topbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onHome={handleHomeAction}
        />

        {/* View Router */}
        {!activeGameId ? (
          /* Grid View (Home) */
          <div className="view">
            <h1 className="grid-header">{getSidebarTitle()}</h1>
            <div className="grid">
              {filteredGames.map(g => (
                <div 
                  key={g.id} 
                  className={`tile ${getBgClass(g.id)} ${g.span ? 'tile-span-2' : ''}`}
                  onClick={() => handleOpenGame(g.id)}
                >
                  {g.emoji}
                  <div className="overlay">
                    <h3 className="tile-title">{g.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Player View */
          <div className="view">
            <div className="player-layout">
              {/* Game Stage */}
              <div className="player-main">
                <div className="player-top">
                  <div className="player-title">
                    {activeGameDef?.emoji} {activeGameDef?.title}
                  </div>
                  <button className="btn-back" onClick={handleBackToHome}>
                    ⭠ Back to home
                  </button>
                </div>
                
                <div className="game-container">
                  {/* Native React Game OR Legacy Vanilla JS Game */}
                  {activeGameDef?.isReactNative ? (
                    <PingPong setScore={setScoreText} />
                  ) : (
                    <LegacyGameAdapter gameId={activeGameId} setScore={setScoreText} />
                  )}
                </div>

                <div className="game-score-bar">
                  <span>{scoreText}</span>
                  <span>100% Ad-Free 🛡️</span>
                </div>
              </div>
              
              {/* Related Sidebar */}
              <div className="player-sidebar">
                {GAMES
                  .filter(g => g.id !== activeGameId)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 4)
                  .map(g => (
                    <div 
                      key={`side-${g.id}`} 
                      className={`side-tile ${getBgClass(g.id)}`}
                      onClick={() => handleOpenGame(g.id)}
                    >
                      {g.emoji}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-free-badge">AD-FREE ARCADE</div>
      </main>
    </>
  );
}

export default App;
