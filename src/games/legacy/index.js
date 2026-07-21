const GAME_MODULES = {};

import rps from './rps.js';
GAME_MODULES.rps = rps;

import wordscramble from './wordscramble.js';
GAME_MODULES.wordscramble = wordscramble;

import simon from './simon.js';
GAME_MODULES.simon = simon;

import clicker from './clicker.js';
GAME_MODULES.clicker = clicker;

import mathquiz from './mathquiz.js';
GAME_MODULES.mathquiz = mathquiz;

import colormatch from './colormatch.js';
GAME_MODULES.colormatch = colormatch;

import reaction from './reaction.js';
GAME_MODULES.reaction = reaction;

import minesweeper from './minesweeper.js';
GAME_MODULES.minesweeper = minesweeper;

import breakout from './breakout.js';
GAME_MODULES.breakout = breakout;

import flappy from './flappy.js';
GAME_MODULES.flappy = flappy;

export default GAME_MODULES;
