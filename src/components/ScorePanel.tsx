"use client";

import styled from "styled-components";
import { GameState } from "@/types/types";
import { calculateTimeScore } from "@/lib/game-logic";
import { useEffect, useState } from "react";

const PanelContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  min-width: 200px;

  @media (max-width: 768px) {
    padding: 8px;
    min-width: 100px;
    border-radius: 8px;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 6px;
  }
`;

const StatLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 9px;
    letter-spacing: 0.3px;
  }
`;

const StatValue = styled.div<{ $highlight?: boolean }>`
  font-size: ${(props) => (props.$highlight ? "24px" : "18px")};
  font-weight: 700;
  color: ${(props) => (props.$highlight ? "#fff" : "var(--text-primary)")};
  text-shadow: ${(props) =>
    props.$highlight ? "0 0 10px var(--primary-glow)" : "none"};
  font-variant-numeric: tabular-nums;

  @media (max-width: 768px) {
    font-size: ${(props) => (props.$highlight ? "14px" : "12px")};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  margin: 16px 0;

  @media (max-width: 768px) {
    margin: 6px 0;
  }
`;

const ComboIndicator = styled.div<{ $active: boolean }>`
  padding: 6px 12px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
      : "rgba(255, 255, 255, 0.05)"};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => (props.$active ? "#fff" : "var(--text-secondary)")};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$active ? "0 0 20px rgba(245, 158, 11, 0.5)" : "none"};

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 8px;
    border-radius: 6px;
  }
`;

interface ScorePanelProps {
  gameState: GameState;
}

export default function ScorePanel({ gameState }: ScorePanelProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameState.startTime) / 1000));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.startTime, gameState.gameOver, gameState.isPaused]);

  // Update score display
  useEffect(() => {
    const timeScore = calculateTimeScore(gameState.startTime);
    setDisplayScore(gameState.score + timeScore);
  }, [gameState.score, gameState.startTime, elapsedTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PanelContainer>
      <StatRow>
        <StatLabel>Score</StatLabel>
        <StatValue $highlight>{displayScore.toLocaleString()}</StatValue>
      </StatRow>

      <Divider />

      <StatRow>
        <StatLabel>Lines</StatLabel>
        <StatValue>{gameState.lines}</StatValue>
      </StatRow>

      <StatRow>
        <StatLabel>Level</StatLabel>
        <StatValue>{gameState.level + 1}</StatValue>
      </StatRow>

      <StatRow>
        <StatLabel>Time</StatLabel>
        <StatValue>{formatTime(elapsedTime)}</StatValue>
      </StatRow>

      <Divider />

      <ComboIndicator $active={gameState.combo > 0}>
        {gameState.combo > 0 ? `Combo x${gameState.combo}` : "No Combo"}
      </ComboIndicator>
    </PanelContainer>
  );
}
