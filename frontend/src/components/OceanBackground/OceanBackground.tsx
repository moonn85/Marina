import React from 'react';
import './OceanBackground.css';

export const OceanBackground: React.FC = () => {
  return (
    <div className="ocean-background-container">
      <div className="ocean-blob ocean-blob--1" />
      <div className="ocean-blob ocean-blob--2" />
      <div className="ocean-blob ocean-blob--3" />
      <div className="ocean-blob ocean-blob--4" />
    </div>
  );
};

