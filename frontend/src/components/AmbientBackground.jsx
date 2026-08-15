import React from 'react';

export default function AmbientBackground({ scanState = 'idle' }) {
  return (
    <div 
      className="ambient-bg-layer" 
      data-scan-state={scanState}
      aria-hidden="true"
    >
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
    </div>
  );
}
