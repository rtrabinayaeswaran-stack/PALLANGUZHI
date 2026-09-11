export type Lang = 'en' | 'ta';
export type Mode = 'computer' | 'local';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameSettings = { mode: Mode; difficulty: Difficulty; pits: number; seeds: number; capture: 'classic' | 'generous'; win: 'majority' | 'empty'; };
export type GameState = { pits: number[]; captured: [number, number]; turn: 0 | 1; moves: { player: 0 | 1; pit: number; captured: number }[]; startedAt: number; paused: boolean; settings: GameSettings; finished: boolean; winner: number | null; };

export const defaultSettings: GameSettings = { mode: 'computer', difficulty: 'medium', pits: 7, seeds: 5, capture: 'classic', win: 'empty' };
const KEY = 'pazhakuzhi-game';
const PREFS = 'pazhakuzhi-prefs';
const STATS = 'pazhakuzhi-stats';
export const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREFS) || '{"lang":"en","sound":true}') as { lang: Lang; sound: boolean }; } catch { return { lang: 'en' as Lang, sound: true }; } };
export const savePrefs = (p: { lang: Lang; sound: boolean }) => localStorage.setItem(PREFS, JSON.stringify(p));
export const loadStats = () => { try { return JSON.parse(localStorage.getItem(STATS) || '{"games":0,"wins":0,"best":0,"seeds":0}') as { games: number; wins: number; best: number; seeds: number }; } catch { return { games: 0, wins: 0, best: 0, seeds: 0 }; } };
export const saveStats = (s: { games: number; wins: number; best: number; seeds: number }) => localStorage.setItem(STATS, JSON.stringify(s));
export const loadGame = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') as GameState | null; } catch { return null; } };
export const saveGame = (g: GameState | null) => g ? localStorage.setItem(KEY, JSON.stringify(g)) : localStorage.removeItem(KEY);
export function createGame(settings: GameSettings = defaultSettings): GameState {
  return { pits: Array(settings.pits * 2).fill(settings.seeds), captured: [0, 0], turn: 0, moves: [], startedAt: Date.now(), paused: false, settings, finished: false, winner: null };
}
export function legalPits(game: GameState) { const start = game.turn * game.settings.pits; return game.pits.map((n, i) => n > 0 && i >= start && i < start + game.settings.pits ? i : -1).filter(i => i >= 0); }
export function sow(game: GameState, index: number): GameState {
  if (game.finished || game.paused || !legalPits(game).includes(index)) return game;
  const pits = [...game.pits]; let hand = pits[index]; pits[index] = 0; let cursor = index; let captured = 0;
  while (hand > 0) { cursor = (cursor + 1) % pits.length; if (cursor === index) continue; pits[cursor]++; hand--; }
  if (game.settings.capture === 'classic' && cursor >= game.settings.pits && pits[cursor] === 2) { captured = pits[cursor]; pits[cursor] = 0; }
  const moves = [...game.moves, { player: game.turn, pit: index % game.settings.pits, captured }];
  const nextTurn = game.turn === 0 ? 1 : 0;
  const sideEmpty = pits.slice(nextTurn * game.settings.pits, (nextTurn + 1) * game.settings.pits).every(n => n === 0);
  const finished = game.settings.win === 'empty' ? sideEmpty : moves.length >= game.settings.pits * 4;
  const winner = finished ? ((game.captured[game.turn] + captured) >= game.captured[nextTurn] ? game.turn : nextTurn) : null;
  return { ...game, pits, captured: game.turn === 0 ? [game.captured[0] + captured, game.captured[1]] : [game.captured[0], game.captured[1] + captured], moves, turn: nextTurn, finished, winner };
}
export const formatDuration = (ms: number) => { const total = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`; };