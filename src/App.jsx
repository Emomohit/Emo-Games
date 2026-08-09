import React, { useState } from 'react';
import { CATEGORIES, GAMES, getBgClass } from './utils/constants.js';
import LegacyGameAdapter from './components/LegacyGameAdapter.jsx';
import PingPong from './games/PingPong.jsx';
import SpaceInvaders from './games/SpaceInvaders.jsx';
import TicTacToe from './games/TicTacToe.jsx';
import Snake from './games/Snake.jsx';
import MemoryMatch from './games/MemoryMatch.jsx';
import Game2048 from './games/Game2048.jsx';
import SubwayRunner from './games/SubwayRunner.jsx';
import StackGame from './games/StackGame.jsx';
import BugPop from './games/BugPop.jsx';
import Tetris from './games/Tetris.jsx';
import FlappyBird from './games/FlappyBird.jsx';
import PacMan from './games/PacMan.jsx';
import AirHockey from './games/AirHockey.jsx';
import Asteroids from './games/Asteroids.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import GameGrid from './components/GameGrid.jsx';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGameId, setActiveGameId] = useState(null);
  const [scoreText, setScoreText] = useState('');

  const activeGameDef = GAMES.find((g) => g.id === activeGameId);

  // Filter games based on search and category
  const filteredGames = GAMES.filter((g) => {
    if (searchQuery) return g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return activeCategory === 'all' || g.category === activeCategory;
  });

  const getSidebarTitle = () => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    return cat?.id === 'all' ? 'Online Games (Ad-Free)' : `${cat?.title} Games`;
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

  const renderGameContent = () => {
    switch (activeGameId) {
      case 'asteroids':
        return <Asteroids setScore={setScoreText} />;
      case 'airhockey':
        return <AirHockey setScore={setScoreText} />;
      case 'pacman':
        return <PacMan setScore={setScoreText} />;
      case 'tetris':
        return <Tetris setScore={setScoreText} />;
      case 'flappybird':
        return <FlappyBird setScore={setScoreText} />;
      case 'spaceinvaders':
        return <SpaceInvaders setScore={setScoreText} />;
      case 'pingpong':
        return <PingPong setScore={setScoreText} />;
      case 'tictactoe':
        return <TicTacToe setScore={setScoreText} />;
      case 'snake':
        return <Snake setScore={setScoreText} />;
      case 'memory':
        return <MemoryMatch setScore={setScoreText} />;
      case '2048':
        return <Game2048 setScore={setScoreText} />;
      case 'subway':
        return <SubwayRunner setScore={setScoreText} />;
      case 'stack':
        return <StackGame setScore={setScoreText} />;
      case 'bugpop':
        return <BugPop setScore={setScoreText} />;
      default:
        return <LegacyGameAdapter gameId={activeGameId} setScore={setScoreText} />;
    }
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
          <GameGrid
            title={getSidebarTitle()}
            games={filteredGames}
            onOpenGame={handleOpenGame}
          />
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

                <div className="game-container">{renderGameContent()}</div>

                <div className="game-score-bar">
                  <span>{scoreText}</span>
                  <span>100% Ad-Free 🛡️</span>
                </div>
              </div>

              {/* Related Sidebar */}
              <div className="player-sidebar">
                {GAMES.filter((g) => g.id !== activeGameId)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 4)
                  .map((g) => (
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
