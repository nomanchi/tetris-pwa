"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  initializeGame,
  checkCollision,
  mergePiece,
  clearLines,
  calculateLineScore,
  calculateDropSpeed,
  calculateTimeScore,
  getRandomTetromino,
  rotateTetromino,
  getHardDropPosition,
} from "@/lib/game-logic";
import { Position, GameState } from "@/types/types";

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [isPlaying, setIsPlaying] = useState(false);
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastDropTimeRef = useRef<number>(Date.now());

  // Move piece
  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return false;

      const newPosition: Position = {
        x: gameState.currentPosition.x + dx,
        y: gameState.currentPosition.y + dy,
      };

      if (!checkCollision(gameState.board, gameState.currentPiece, newPosition)) {
        setGameState((prev: GameState) => ({
          ...prev,
          currentPosition: newPosition,
        }));
        return true;
      }

      return false;
    },
    [gameState.board, gameState.currentPiece, gameState.currentPosition, gameState.gameOver, gameState.isPaused]
  );

  // Rotate piece
  const rotate = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const rotated = rotateTetromino(gameState.currentPiece);

    // Try basic rotation
    if (!checkCollision(gameState.board, rotated, gameState.currentPosition)) {
      setGameState((prev: GameState) => ({
        ...prev,
        currentPiece: rotated,
      }));
      return;
    }

    // Wall kick: try moving left or right
    const wallKicks = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
    ];

    for (const kick of wallKicks) {
      const newPosition: Position = {
        x: gameState.currentPosition.x + kick.x,
        y: gameState.currentPosition.y + kick.y,
      };

      if (!checkCollision(gameState.board, rotated, newPosition)) {
        setGameState((prev: GameState) => ({
          ...prev,
          currentPiece: rotated,
          currentPosition: newPosition,
        }));
        return;
      }
    }
  }, [gameState.board, gameState.currentPiece, gameState.currentPosition, gameState.gameOver, gameState.isPaused]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const dropPosition = getHardDropPosition(
      gameState.board,
      gameState.currentPiece,
      gameState.currentPosition
    );

    // Merge piece
    const newBoard = mergePiece(gameState.board, gameState.currentPiece, dropPosition);

    // Clear lines
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

    // Calculate score
    const newCombo = linesCleared > 0 ? gameState.combo + 1 : 0;
    const lineScore = calculateLineScore(linesCleared, gameState.combo);
    const timeScore = calculateTimeScore(gameState.startTime);
    const totalScore = lineScore + timeScore;

    // Get next piece
    const nextPiece = gameState.nextPiece || getRandomTetromino();
    const newCurrentPiece = getRandomTetromino();
    const startPosition: Position = { x: Math.floor(10 / 2) - 1, y: 0 };

    // Check game over
    const isGameOver = checkCollision(clearedBoard, nextPiece, startPosition);

    setGameState({
      board: clearedBoard,
      currentPiece: isGameOver ? null : nextPiece,
      currentPosition: startPosition,
      nextPiece: newCurrentPiece,
      score: totalScore,
      lines: gameState.lines + linesCleared,
      level: Math.floor((Date.now() - gameState.startTime) / 30000),
      gameOver: isGameOver,
      isPaused: gameState.isPaused,
      combo: newCombo,
      startTime: gameState.startTime,
      showGhost: gameState.showGhost,
    });
  }, [gameState]);

  // Drop piece one row
  const drop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const canMove = movePiece(0, 1);

    if (!canMove) {
      // Piece has landed, merge it
      const newBoard = mergePiece(
        gameState.board,
        gameState.currentPiece,
        gameState.currentPosition
      );

      // Clear lines
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

      // Calculate score
      const newCombo = linesCleared > 0 ? gameState.combo + 1 : 0;
      const lineScore = calculateLineScore(linesCleared, gameState.combo);
      const timeScore = calculateTimeScore(gameState.startTime);
      const totalScore = lineScore + timeScore;

      // Get next piece
      const nextPiece = gameState.nextPiece || getRandomTetromino();
      const newCurrentPiece = getRandomTetromino();
      const startPosition: Position = { x: Math.floor(10 / 2) - 1, y: 0 };

      // Check game over
      const isGameOver = checkCollision(clearedBoard, nextPiece, startPosition);

      setGameState({
        board: clearedBoard,
        currentPiece: isGameOver ? null : nextPiece,
        currentPosition: startPosition,
        nextPiece: newCurrentPiece,
        score: totalScore,
        lines: gameState.lines + linesCleared,
        level: Math.floor((Date.now() - gameState.startTime) / 30000),
        gameOver: isGameOver,
        isPaused: gameState.isPaused,
        combo: newCombo,
        startTime: gameState.startTime,
        showGhost: gameState.showGhost,
      });

      if (isGameOver) {
        setIsPlaying(false);
      }
    }
  }, [gameState, movePiece]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState((prev: GameState) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, [gameState.gameOver]);

  // Toggle ghost piece
  const toggleGhost = useCallback(() => {
    setGameState((prev: GameState) => ({
      ...prev,
      showGhost: !prev.showGhost,
    }));
  }, []);

  // Restart game
  const restart = () => {
    setGameState(initializeGame());
    setIsPlaying(true);
  };

  // Start game
  const startGame = () => {
    setIsPlaying(true);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameState.gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          movePiece(1, 0);
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case "ArrowDown":
          e.preventDefault();
          movePiece(0, 1);
          break;
        case "a":
        case "A":
          e.preventDefault();
          hardDrop();
          break;
        case "s":
        case "S":
          e.preventDefault();
          togglePause();
          break;
        case "d":
        case "D":
          e.preventDefault();
          toggleGhost();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameState.gameOver, movePiece, rotate, hardDrop, togglePause, toggleGhost]);

  // Game loop - auto drop
  useEffect(() => {
    if (!isPlaying || gameState.gameOver || gameState.isPaused) {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      return;
    }

    const dropSpeed = calculateDropSpeed(gameState.startTime);

    dropTimerRef.current = setInterval(() => {
      drop();
    }, dropSpeed);

    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
    };
  }, [isPlaying, gameState.gameOver, gameState.isPaused, gameState.startTime, drop]);

  return {
    gameState,
    isPlaying,
    startGame,
    restart,
    togglePause,
  };
}
