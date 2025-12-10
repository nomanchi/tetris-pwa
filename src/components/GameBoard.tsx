"use client";

import styled from "styled-components";
import { GameState } from "@/types/types";
import { getHardDropPosition } from "@/lib/game-logic";

const BoardContainer = styled.div`
  display: inline-block;
  padding: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 0 40px rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(10px);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 1px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
`;

const Cell = styled.div<{ $color?: string; $isGhost?: boolean }>`
  width: 24px;
  height: 24px;
  background: ${(props) =>
    props.$isGhost
      ? `${props.$color}40`
      : props.$color || "rgba(10, 10, 31, 0.8)"};
  border: ${(props) =>
    props.$color
      ? `1px solid ${props.$isGhost ? `${props.$color}60` : `${props.$color}dd`}`
      : "none"};
  box-shadow: ${(props) =>
    props.$color && !props.$isGhost
      ? `inset 0 0 6px ${props.$color}aa, 0 0 4px ${props.$color}44`
      : "none"};
  transition: all 0.1s ease;

  ${(props) =>
    props.$color &&
    !props.$isGhost &&
    `
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
      border-radius: 2px;
      pointer-events: none;
    }
  `}
`;

interface GameBoardProps {
  gameState: GameState;
}

export default function GameBoard({ gameState }: GameBoardProps) {
  const { board, currentPiece, currentPosition, showGhost } = gameState;

  // Calculate ghost piece position
  const ghostPosition = currentPiece && showGhost
    ? getHardDropPosition(board, currentPiece, currentPosition)
    : null;

  // Create a display board that includes current piece and ghost
  const displayBoard = board.map((row) => [...row]);

  // Add ghost piece
  if (currentPiece && ghostPosition) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const boardRow = ghostPosition.y + row;
          const boardCol = ghostPosition.x + col;
          if (
            boardRow >= 0 &&
            boardRow < 20 &&
            boardCol >= 0 &&
            boardCol < 10 &&
            !displayBoard[boardRow][boardCol]
          ) {
            displayBoard[boardRow][boardCol] = `ghost:${currentPiece.color}`;
          }
        }
      }
    }
  }

  // Add current piece
  if (currentPiece) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const boardRow = currentPosition.y + row;
          const boardCol = currentPosition.x + col;
          if (boardRow >= 0 && boardRow < 20 && boardCol >= 0 && boardCol < 10) {
            displayBoard[boardRow][boardCol] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <BoardContainer>
      <Grid>
        {displayBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isGhost = typeof cell === "string" && cell.startsWith("ghost:");
            const color = isGhost ? cell.split(":")[1] : cell || undefined;

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                $color={color}
                $isGhost={isGhost}
              />
            );
          })
        )}
      </Grid>
    </BoardContainer>
  );
}
