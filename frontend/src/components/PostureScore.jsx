import React from 'react';

export default function PostureScore({ passed = 0, total = 0 }) {
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="score-card">
      <div className="score-card-header">
        <span className="score-title">CHECKS PASSED</span>
      </div>

      <div className="score-value-row">
        <span className="score-number">{passed}</span>
        <span className="score-unit">/ {total}</span>
      </div>

      <div>
        <div className="score-bar-bg">
          <div 
            className="score-bar-fill" 
            style={{ width: `${percent}%`, backgroundColor: 'var(--color-pass)' }}
          />
        </div>
        <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          {percent}% of evaluated checks passed
        </div>
      </div>
    </div>
  );
}
