import React from 'react';

export default function LoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="metrics-grid">
        <div className="skeleton" style={{ height: '140px', borderRadius: '14px' }}></div>
        <div className="skeleton" style={{ height: '140px', borderRadius: '14px' }}></div>
        <div className="skeleton" style={{ height: '140px', borderRadius: '14px' }}></div>
        <div className="skeleton" style={{ height: '140px', borderRadius: '14px' }}></div>
        <div className="skeleton" style={{ height: '140px', borderRadius: '14px' }}></div>
      </div>

      <div className="skeleton" style={{ height: '60px', borderRadius: '14px' }}></div>
      <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }}></div>
    </div>
  );
}
