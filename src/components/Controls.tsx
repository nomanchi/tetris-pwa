"use client";

import styled from "styled-components";

const ControlsContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ControlList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ControlItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Key = styled.kbd`
  min-width: 60px;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  font-family: inherit;
`;

const Description = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

export default function Controls() {
  return (
    <ControlsContainer>
      <Title>Controls</Title>
      <ControlList>
        <ControlItem>
          <Key>←  →</Key>
          <Description>Move left/right</Description>
        </ControlItem>
        <ControlItem>
          <Key>↑</Key>
          <Description>Rotate</Description>
        </ControlItem>
        <ControlItem>
          <Key>↓</Key>
          <Description>Soft drop</Description>
        </ControlItem>
        <ControlItem>
          <Key>A</Key>
          <Description>Hard drop</Description>
        </ControlItem>
        <ControlItem>
          <Key>S</Key>
          <Description>Pause/Resume</Description>
        </ControlItem>
        <ControlItem>
          <Key>D</Key>
          <Description>Toggle ghost piece</Description>
        </ControlItem>
      </ControlList>
    </ControlsContainer>
  );
}
