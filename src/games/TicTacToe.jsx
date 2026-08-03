import React, { useState } from 'react';

export default function TicTacToe({ setScore }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAI, setVsAI] = useState(true);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  function handleClick(index) {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? '❌' : '⭕';
    setBoard(newBoard);

    if (calculateWinner(newBoard)) {
      const w = isXNext ? 'Player X' : vsAI ? 'AI' : 'Player O';
      if (setScore) setScore(`Winner: ${w}! 🎉`);
      return;
    }

    if (vsAI && isXNext) {
      setIsXNext(false);
      setTimeout(() => makeAIMove(newBoard), 400);
    } else {
      setIsXNext(!isXNext);
    }
  }

  function makeAIMove(currentBoard) {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);

    if (emptyIndices.length === 0 || calculateWinner(currentBoard)) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = '⭕';
    setBoard(newBoard);

    if (calculateWinner(newBoard)) {
      if (setScore) setScore('AI Won! 🤖');
    } else {
      setIsXNext(true);
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    if (setScore) setScore('Game Reset');
  }

  return (
    <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setVsAI(!vsAI)}
          style={{
            background: vsAI ? '#FF5500' : '#333',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            marginRight: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Mode: {vsAI ? 'vs AI 🤖' : '2 Players 👥'}
        </button>
        <button
          onClick={resetGame}
          style={{
            background: '#222',
            color: '#fff',
            border: '1px solid #444',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Reset 🔄
        </button>
      </div>

      <h3 style={{ fontSize: '20px', margin: '10px 0' }}>
        {winner
          ? `Winner: ${winner}`
          : isDraw
          ? "It's a Draw! 🤝"
          : `Turn: ${isXNext ? '❌ (You)' : vsAI ? '⭕ (AI)' : '⭕'}`}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gap: '10px',
          justifyContent: 'center',
          margin: '20px auto',
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            style={{
              width: '100px',
              height: '100px',
              fontSize: '40px',
              background: '#181820',
              border: '2px solid rgba(255,85,0,0.3)',
              borderRadius: '16px',
              cursor: cell || winner ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
