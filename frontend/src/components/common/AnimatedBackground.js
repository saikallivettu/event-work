import React from 'react';
import '../../assets/styles/animations.css';

const AnimatedBackground = () => {
  const bubbles = Array.from({ length: 15 });

  return (
    <div className="background-container">
      {bubbles.map((_, index) => {
        const size = `${Math.random() * 200 + 50}px`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 15 + 10}s`;
        const animationDelay = `${Math.random() * 5}s`;
        const colors = ['#5352ed', '#f43f5e', '#22d3ee', '#a78bfa'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div
            key={index}
            className="bubble"
            style={{
              width: size,
              height: size,
              left: left,
              bottom: `-${size}`,
              animationDuration: animationDuration,
              animationDelay: animationDelay,
              backgroundColor: color,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default AnimatedBackground;
