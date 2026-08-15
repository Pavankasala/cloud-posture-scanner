import React from 'react';
import { RefreshCw, Globe, Clock, UserCheck } from 'lucide-react';

export default function Header({ onScan, loading, lastScanTime, activeTab }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'findings': return 'Security Findings';
      case 'resources': return 'Resource Inventories';
      case 'ec2': return 'EC2 Workloads';
      case 's3': return 'S3 Bucket Inventories';
      case 'iam': return 'IAM & MFA Posture';
      case 'cloudtrail': return 'CloudTrail Security';
      case 'settings': return 'Scanner Settings';
      default: return 'Security Posture Overview';
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="page-title">
          <h2>{getTabTitle()}</h2>
          <div className="page-breadcrumb">AWS Security Posture</div>
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill">
          <Globe size={13} style={{ color: 'var(--accent-blue)' }} />
          <span>ap-south-1</span>
        </div>

        {lastScanTime && (
          <div className="status-pill" style={{ color: 'var(--text-muted)' }}>
            <Clock size={13} />
            <span>{lastScanTime}</span>
          </div>
        )}

        <button 
          onClick={onScan} 
          disabled={loading} 
          className="scan-btn"
          title="Run full AWS security scan"
        >
          <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
          <span>{loading ? 'Scanning AWS...' : 'Run Scan'}</span>
        </button>

        <div className="status-pill" style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <UserCheck size={16} style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>
    </header>
  );
}
