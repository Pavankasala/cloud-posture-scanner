import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="error-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertTriangle size={20} />
        <div>
          <strong style={{ color: '#ffffff' }}>Scan API Request Failed</strong>
          <div style={{ fontSize: '13px', marginTop: '2px' }}>{error || 'Unable to connect to backend server at http://127.0.0.1:8000'}</div>
        </div>
      </div>

      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
