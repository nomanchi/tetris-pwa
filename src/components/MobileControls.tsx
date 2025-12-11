"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";

const ControlsContainer = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 8px;
  background: linear-gradient(180deg, transparent 0%, rgba(10, 10, 31, 0.95) 20%);
  backdrop-filter: blur(10px);
  z-index: 100;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
  align-items: center;
`;

const SideButton = styled.button`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 32px;
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
`;

const CenterButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
`;

const CenterButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  height: 70px;
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
      : "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)"};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.$primary ? "0 4px 20px rgba(99, 102, 241, 0.4)" : "none"};

  &:active {
    transform: scale(0.98);
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
}

export default function MobileControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
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

  // Separate handlers to prevent double-firing
  const handleTouch = (callback: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  const handleMouse = (callback: () => void) => (e: React.MouseEvent) => {
    // Only respond to mouse events if there's no touch support
    if ('ontouchstart' in window) return;
    e.preventDefault();
    callback();
  };

  return (
    <ControlsContainer>
      <ControlsGrid>
        {/* Left: Move Left */}
        <SideButton
          onTouchStart={handleTouch(onMoveLeft)}
          onMouseDown={handleMouse(onMoveLeft)}
        >
          ←
        </SideButton>

        {/* Center: Rotate, Down, Drop */}
        <CenterButtons>
          <CenterButton
            onTouchStart={handleTouch(onRotate)}
            onMouseDown={handleMouse(onRotate)}
          >
            ↻
          </CenterButton>
          <CenterButton
            onTouchStart={handleTouch(onMoveDown)}
            onMouseDown={handleMouse(onMoveDown)}
          >
            ↓
          </CenterButton>
          <CenterButton
            $primary
            onTouchStart={handleTouch(onHardDrop)}
            onMouseDown={handleMouse(onHardDrop)}
          >
            ⬇
          </CenterButton>
        </CenterButtons>

        {/* Right: Move Right */}
        <SideButton
          onTouchStart={handleTouch(onMoveRight)}
          onMouseDown={handleMouse(onMoveRight)}
        >
          →
        </SideButton>
      </ControlsGrid>
    </ControlsContainer>
  );
}
