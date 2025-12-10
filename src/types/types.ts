export interface Position {
  x: number;
  y: number;
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
}

export interface GameState {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  currentPosition: Position;
  nextPiece: Tetromino | null;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
  combo: number;
  startTime: number;
  showGhost: boolean;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const INITIAL_DROP_SPEED = 1000; // milliseconds
export const SPEED_INCREASE_INTERVAL = 30000; // 30 seconds
export const SPEED_MULTIPLIER = 0.85; // Each level is 15% faster
