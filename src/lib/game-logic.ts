import {
  Tetromino,
  TetrominoType,
  Position,
  GameState,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  INITIAL_DROP_SPEED,
  SPEED_INCREASE_INTERVAL,
  SPEED_MULTIPLIER,
} from "@/types/types";

// Tetromino shapes (rotation 0)
const TETROMINOES: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00f0f0",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#f0f000",
  },
  T: {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    color: "#a000f0",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#00f000",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#f00000",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#0000f0",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#f0a000",
  },
};

// Create empty board
export function createBoard(): (string | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(null)
  );
}

// Get random tetromino
export function getRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];
  const type = types[Math.floor(Math.random() * types.length)];
  const { shape, color } = TETROMINOES[type];
  return { type, shape, color };
}

// Rotate tetromino clockwise
export function rotateTetromino(tetromino: Tetromino): Tetromino {
  // O piece doesn't rotate
  if (tetromino.type === "O") {
    return tetromino;
  }

  const N = tetromino.shape.length;
  const rotated = Array.from({ length: N }, () => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[j][N - 1 - i] = tetromino.shape[i][j];
    }
  }

  return { ...tetromino, shape: rotated };
}

// Check collision
export function checkCollision(
  board: (string | null)[][],
  tetromino: Tetromino,
  position: Position
): boolean {
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col]) {
        const newRow = position.y + row;
        const newCol = position.x + col;

        // Check boundaries
        if (
          newRow < 0 ||
          newRow >= BOARD_HEIGHT ||
          newCol < 0 ||
          newCol >= BOARD_WIDTH
        ) {
          return true;
        }

        // Check if cell is occupied
        if (board[newRow][newCol] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

// Merge piece into board
export function mergePiece(
  board: (string | null)[][],
  tetromino: Tetromino,
  position: Position
): (string | null)[][] {
  const newBoard = board.map((row) => [...row]);

  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col]) {
        const boardRow = position.y + row;
        const boardCol = position.x + col;
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT) {
          newBoard[boardRow][boardCol] = tetromino.color;
        }
      }
    }
  }

  return newBoard;
}

// Clear completed lines and return count
export function clearLines(
  board: (string | null)[][]
): { newBoard: (string | null)[][]; linesCleared: number } {
  const newBoard: (string | null)[][] = [];
  let linesCleared = 0;

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.unshift(board[row]);
    }
  }

  // Add empty rows at top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
}

// Calculate score based on lines cleared
export function calculateLineScore(linesCleared: number, combo: number): number {
  if (linesCleared === 0) return 0;

  let baseScore = 0;
  switch (linesCleared) {
    case 1:
      baseScore = 100;
      break;
    case 2:
      baseScore = 300;
      break;
    case 3:
      baseScore = 500;
      break;
    case 4:
      baseScore = 800;
      break;
  }

  // Add combo bonus
  const comboBonus = combo > 0 ? combo * 50 : 0;
  return baseScore + comboBonus;
}

// Calculate drop speed based on time played
export function calculateDropSpeed(startTime: number): number {
  const elapsedTime = Date.now() - startTime;
  const level = Math.floor(elapsedTime / SPEED_INCREASE_INTERVAL);
  return INITIAL_DROP_SPEED * Math.pow(SPEED_MULTIPLIER, level);
}

// Calculate time score (10 points per second)
export function calculateTimeScore(startTime: number): number {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  return elapsedSeconds * 10;
}

// Get the landing position for hard drop
export function getHardDropPosition(
  board: (string | null)[][],
  tetromino: Tetromino,
  position: Position
): Position {
  let dropPosition = { ...position };

  while (!checkCollision(board, tetromino, { ...dropPosition, y: dropPosition.y + 1 })) {
    dropPosition.y++;
  }

  return dropPosition;
}

// Initialize game state
export function initializeGame(): GameState {
  const board = createBoard();
  const currentPiece = getRandomTetromino();
  const nextPiece = getRandomTetromino();

  return {
    board,
    currentPiece,
    currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    nextPiece,
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    isPaused: false,
    combo: 0,
    startTime: 0,
    showGhost: true,
  };
}
