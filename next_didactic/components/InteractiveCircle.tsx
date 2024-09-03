import React from 'react';

interface CircleConfig {
  name: string;
  cx: number;
  cy: number;
  radius: number;
  fillColor: string;
  activeColor: string;
  text: string;
  link: string;
}

interface InteractiveCircleProps {
  config: CircleConfig;
  isActive: boolean;
  onClick: (name: string) => void;
}

const InteractiveCircle: React.FC<InteractiveCircleProps> = ({ config, isActive, onClick }) => {
  return (
    <circle
      cx={config.cx}
      cy={config.cy}
      r={config.radius}
      fill={isActive ? config.activeColor : config.fillColor}
      style={{
        transition: 'all 300ms ease-in-out',
        transform: isActive ? `scale(1.02)` : 'scale(1)',
        transformOrigin: `${config.cx}px ${config.cy}px`,
        cursor: 'pointer',
      }}
      onClick={() => onClick(config.name)}
    />
  );
};

export default InteractiveCircle;