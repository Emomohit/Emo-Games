import React, { useState, useEffect } from 'react';

const EMOJIS = ['🎮', '🚀', '⚡', '🧠', '👾', '🔥', '💎', '🏆'];

export default function MemoryMatch({ setScore }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  function initDeck() {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    if (setScore) setScore('Moves: 0 | Matched: 0/8');
  }

  useEffect(() => {
    initDeck();
  }, []);

  function handleCardClick(idx) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        if (setScore) setScore(`Moves: ${moves + 1} | Matched: ${newMatched.length / 2}/8`);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  return (
    <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>
          Moves: {moves} | Matched: {matched.length / 2}/8
        </span>
        <button
          onClick={initDeck}
          style={{
            background: '#FF5500',
            color: '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Reset Deck 🔄
        </button>
      </div>

      {matched.length === 16 && (
        <h2 style={{ color: '#00F0FF', margin: '15px 0' }}>
          🎉 Congratulations! Solved in {moves} moves!
        </h2>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 80px)',
          gap: '12px',
          justifyContent: 'center',
          margin: '20px auto',
        }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              style={{
                width: '80px',
                height: '80px',
                fontSize: isFlipped ? '36px' : '20px',
                background: isFlipped ? '#181820' : '#2a2a35',
                border: isFlipped ? '2px solid #FF5500' : '1px solid #444',
                borderRadius: '14px',
                cursor: isFlipped ? 'default' : 'pointer',
                transition: 'transform 0.2s',
              }}
            >
              {isFlipped ? card.emoji : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
