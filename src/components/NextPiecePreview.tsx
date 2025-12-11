"use client";

import styled from "styled-components";
import { Tetromino } from "@/types/types";

const PreviewContainer = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 8px;
    border-radius: 8px;
  }
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    margin: 0 0 6px 0;
    font-size: 9px;
    letter-spacing: 0.5px;
  }
`;

const PieceGrid = styled.div<{ $size: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$size}, 20px);
  grid-template-rows: repeat(${(props) => props.$size}, 20px);
  gap: 1px;
  justify-content: center;
  padding: 8px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(${(props) => props.$size}, 12px);
    grid-template-rows: repeat(${(props) => props.$size}, 12px);
    padding: 4px;
  }
`;

const Cell = styled.div<{ $color?: string }>`
  width: 20px;
  height: 20px;
  background: ${(props) => props.$color || "transparent"};
  border: ${(props) => (props.$color ? `1px solid ${props.$color}dd` : "none")};
  border-radius: 2px;
  box-shadow: ${(props) =>
    props.$color ? `inset 0 0 4px ${props.$color}aa, 0 0 3px ${props.$color}44` : "none"};

  ${(props) =>
    props.$color &&
    `
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
      border-radius: 1px;
    }
  `}

  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

interface NextPiecePreviewProps {
  nextPiece: Tetromino | null;
}

export default function NextPiecePreview({ nextPiece }: NextPiecePreviewProps) {
  if (!nextPiece) return null;

  const size = nextPiece.shape.length;

  return (
    <PreviewContainer>
      <Title>Next</Title>
      <PieceGrid $size={size}>
        {nextPiece.shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              $color={cell ? nextPiece.color : undefined}
            />
          ))
        )}
      </PieceGrid>
    </PreviewContainer>
  );
}
