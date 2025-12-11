"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";

const ControlsContainer = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(180deg, transparent 0%, rgba(10, 10, 31, 0.95) 20%);
  backdrop-filter: blur(10px);
  z-index: 100;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
`;

const DPadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DPad = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  display: grid;
  grid-template-areas:
    ". up ."
    "left center right"
    ". down .";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 4px;
`;

const DPadButton = styled.button<{ $area: string }>`
  grid-area: ${(props) => props.$area};
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.6) 100%);
    transform: scale(0.95);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
  }

  ${(props) => props.$area === "center" && `
    background: transparent;
    border: none;
    cursor: default;
    pointer-events: none;
  `}
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ActionButton = styled.button<{ $primary?: boolean; $size?: string }>`
  min-width: ${(props) => props.$size === "large" ? "140px" : "60px"};
  height: ${(props) => props.$size === "large" ? "60px" : "48px"};
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
      : "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)"};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: ${(props) => props.$size === "large" ? "16px" : "13px"};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: ${(props) =>
    props.$primary ? "0 4px 20px rgba(99, 102, 241, 0.4)" : "none"};

  &:active {
    transform: scale(0.95);
    box-shadow: ${(props) =>
      props.$primary
        ? "0 6px 28px rgba(99, 102, 241, 0.6)"
        : "0 0 20px rgba(99, 102, 241, 0.4)"};
  }
`;

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  onToggleGhost: () => void;
}

export default function MobileControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
  onToggleGhost,
}: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  const handleTouchStart = (callback: () => void) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    callback();
  };

  return (
    <ControlsContainer>
      <ControlsGrid>
        <DPadContainer>
          <DPad>
            <DPadButton
              $area="up"
              onTouchStart={handleTouchStart(onRotate)}
              onMouseDown={handleTouchStart(onRotate)}
            >
              ↑
            </DPadButton>
            <DPadButton
              $area="left"
              onTouchStart={handleTouchStart(onMoveLeft)}
              onMouseDown={handleTouchStart(onMoveLeft)}
            >
              ←
            </DPadButton>
            <DPadButton $area="center" />
            <DPadButton
              $area="right"
              onTouchStart={handleTouchStart(onMoveRight)}
              onMouseDown={handleTouchStart(onMoveRight)}
            >
              →
            </DPadButton>
            <DPadButton
              $area="down"
              onTouchStart={handleTouchStart(onMoveDown)}
              onMouseDown={handleTouchStart(onMoveDown)}
            >
              ↓
            </DPadButton>
          </DPad>
        </DPadContainer>

        <ActionsContainer>
          <ActionRow>
            <ActionButton
              $primary
              $size="large"
              onTouchStart={handleTouchStart(onHardDrop)}
              onMouseDown={handleTouchStart(onHardDrop)}
            >
              DROP
            </ActionButton>
          </ActionRow>
          <ActionRow>
            <ActionButton
              onTouchStart={handleTouchStart(onPause)}
              onMouseDown={handleTouchStart(onPause)}
            >
              ⏸
            </ActionButton>
            <ActionButton
              onTouchStart={handleTouchStart(onToggleGhost)}
              onMouseDown={handleTouchStart(onToggleGhost)}
            >
              👻
            </ActionButton>
          </ActionRow>
        </ActionsContainer>
      </ControlsGrid>
    </ControlsContainer>
  );
}
