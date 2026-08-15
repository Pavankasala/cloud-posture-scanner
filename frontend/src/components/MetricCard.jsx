import React from 'react';

export default function MetricCard({ label, value, icon: Icon, subtext, type }) {
  let valueColor = 'var(--text-primary)';
  
  if (type === 'pass') {
    valueColor = 'var(--color-pass)';
  } else if (type === 'fail') {
    valueColor = 'var(--color-fail)';
  }

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className="metric-icon">
            <Icon size={15} />
          </div>
        )}
      </div>

      <div className="metric-number" style={{ color: valueColor }}>
        {value}
      </div>

      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  );
}
