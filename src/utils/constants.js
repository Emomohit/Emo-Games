export const CATEGORIES = [
  { id: 'all', label: '🏠', title: 'Home' },
  { id: 'strategy', label: '♟️', title: 'Strategy' },
  { id: 'puzzle', label: '🧩', title: 'Puzzle' },
  { id: 'classic', label: '🕹️', title: 'Classic' },
  { id: 'arcade', label: '🚀', title: 'Arcade' },
  { id: 'reflex', label: '⚡', title: 'Reflex' },
];

export const GAMES = [
  { id: 'pingpong', title: 'Ping Pong (NEW)', emoji: '🏓', category: 'arcade', span: true, isReactNative: true }, // Our newly added feature
  { id: 'subway', title: 'Subway Runner', emoji: '🛹', category: 'arcade', span: true },
  { id: 'stack', title: 'Stack', emoji: '🏗️', category: 'arcade', span: false },
  { id: 'tictactoe', title: 'Tic-Tac-Toe', emoji: '❌⭕', category: 'strategy', span: true },
  { id: 'memory', title: 'Memory Match', emoji: '🧠', category: 'puzzle', span: false },
  { id: '2048', title: '2048', emoji: '🔢', category: 'classic', span: false },
  { id: 'snake', title: 'Snake', emoji: '🐍', category: 'arcade', span: true },
  { id: 'bugpop', title: 'Bug Pop', emoji: '🐛', category: 'reflex', span: false },
  { id: 'flappy', title: 'Flappy Box', emoji: '🐦', category: 'arcade', span: true },
  { id: 'breakout', title: 'Brick Breaker', emoji: '🧱', category: 'classic', span: false },
  { id: 'minesweeper', title: 'Minesweeper', emoji: '💣', category: 'puzzle', span: false },
  { id: 'reaction', title: 'Reaction Test', emoji: '⚡', category: 'reflex', span: false },
  { id: 'colormatch', title: 'Color Match', emoji: '🎨', category: 'puzzle', span: false },
  { id: 'mathquiz', title: 'Math Quiz', emoji: '➕', category: 'puzzle', span: false },
  { id: 'clicker', title: 'Cookie Clicker', emoji: '🍪', category: 'strategy', span: true },
  { id: 'simon', title: 'Simon Says', emoji: '🔲', category: 'memory', span: false },
  { id: 'wordscramble', title: 'Word Scramble', emoji: '📝', category: 'puzzle', span: false },
  { id: 'rps', title: 'Rock Paper', emoji: '✂️', category: 'strategy', span: false },
];

export function getBgClass(id) {
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `bg-${(hash % 7) + 1}`;
}
