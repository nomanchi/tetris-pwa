"use client";

import styled from "styled-components";
import { useGameLogic } from "@/hooks/useGameLogic";
import GameBoard from "@/components/GameBoard";
import NextPiecePreview from "@/components/NextPiecePreview";
import ScorePanel from "@/components/ScorePanel";
import Controls from "@/components/Controls";
import MobileControls from "@/components/MobileControls";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-bottom: 200px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 8px 8px 180px 8px;
    justify-content: flex-start;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(99, 102, 241, 0.1) 0%,
      transparent 50%
    );
    animation: pulse 8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 0;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 4px;
    display: block;
  }
`;

const GameContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
    max-width: 100%;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: auto;
    gap: 4px;

    &:last-child {
      display: none;
    }
  }
`;

const MobileGameControls = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const MobileButton = styled.button`
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  white-space: nowrap;

  &:active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.6) 100%);
    transform: scale(0.95);
  }
`;

const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: ${(props) => (props.$show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #1a1a4a 0%, #12123a 100%);
  border: 2px solid rgba(99, 102, 241, 0.5);
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.3);
`;

const ModalTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModalText = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: inherit;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(99, 102, 241, 0.6);
    }

    &:active {
      transform: translateY(0);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const PauseIndicator = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  padding: 24px 48px;
  border-radius: 16px;
  border: 2px solid var(--primary);
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
  font-size: 32px;
  font-weight: 700;
  color: white;
  pointer-events: none;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 100;
`;

export default function Home() {
  const { gameState, isPlaying, startGame, restart, togglePause, movePiece, rotate, hardDrop, toggleGhost } = useGameLogic();

  return (
    <Container>
      <Header>
        <Title>TETRIS</Title>
        <Subtitle>By JES with AntiGravity</Subtitle>
      </Header>

      <GameContainer>
        <SidePanel>
          <ScorePanel gameState={gameState} />
          <NextPiecePreview nextPiece={gameState.nextPiece} />
          <MobileGameControls>
            <MobileButton onClick={togglePause}>
              {gameState.isPaused ? '▶ Resume' : '⏸ Pause'}
            </MobileButton>
            <MobileButton onClick={toggleGhost}>
              {gameState.showGhost ? '👻 Ghost ON' : '👁 Ghost OFF'}
            </MobileButton>
          </MobileGameControls>
        </SidePanel>

        <div style={{ position: "relative" }}>
          <GameBoard gameState={gameState} />
          <PauseIndicator $show={gameState.isPaused && !gameState.gameOver}>
            PAUSED
          </PauseIndicator>
        </div>

        <SidePanel>
          <Controls />
        </SidePanel>
      </GameContainer>

      {/* Start Game Modal */}
      <Overlay $show={!isPlaying && !gameState.gameOver}>
        <Modal>
          <ModalTitle>Welcome to Tetris!</ModalTitle>
          <ModalText>
            Stack falling blocks to clear lines and score points. The game gets
            faster as you play. Good luck!
          </ModalText>
          <Button $variant="primary" onClick={startGame}>
            Start Game
          </Button>
        </Modal>
      </Overlay>

      {/* Game Over Modal */}
      <Overlay $show={gameState.gameOver}>
        <Modal>
          <ModalTitle>Game Over!</ModalTitle>
          <ModalText>
            Your Score: <strong>{gameState.score.toLocaleString()}</strong>
            <br />
            Lines Cleared: <strong>{gameState.lines}</strong>
            <br />
            Level Reached: <strong>{gameState.level + 1}</strong>
          </ModalText>
          <ButtonGroup>
            <Button $variant="primary" onClick={restart}>
              Play Again
            </Button>
          </ButtonGroup>
        </Modal>
      </Overlay>

      {/* Mobile Controls */}
      <MobileControls
        onMoveLeft={() => movePiece(-1, 0)}
        onMoveRight={() => movePiece(1, 0)}
        onMoveDown={() => movePiece(0, 1)}
        onRotate={rotate}
        onHardDrop={hardDrop}
      />
    </Container>
  );
}
