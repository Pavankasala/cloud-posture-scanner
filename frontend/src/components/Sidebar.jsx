import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  AlertTriangle, 
  Server, 
  HardDrive, 
  Users, 
  Activity, 
  Settings
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, failedCount = 0 }) {
  const renderNavItem = (id, label, Icon, badge = null, isFailBadge = false) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="nav-item-left">
          <Icon size={17} className="nav-icon" />
          <span>{label}</span>
        </div>
        {badge !== null && badge !== undefined && (
          <span className={`nav-badge ${isFailBadge ? 'fail-badge' : ''}`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Shield size={18} />
        </div>
        <div className="brand-text">
          <h1>Cloud Posture</h1>
          <p>AWS Security Posture</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {renderNavItem('overview', 'Overview', LayoutDashboard)}

        <div className="nav-section-title">Security</div>
        {renderNavItem('findings', 'Findings', AlertTriangle, failedCount > 0 ? failedCount : null, failedCount > 0)}
        {renderNavItem('iam', 'IAM Posture', Users)}
        {renderNavItem('cloudtrail', 'CloudTrail', Activity)}

        <div className="nav-section-title">Resources</div>
        {renderNavItem('ec2', 'EC2 Instances', Server)}
        {renderNavItem('s3', 'S3 Buckets', HardDrive)}

        <div className="nav-section-title">System</div>
        {renderNavItem('settings', 'Settings', Settings)}
      </nav>

      <div className="sidebar-footer">
        <div className="env-card">
          <div className="env-header">
            <span className="env-dot"></span>
            <span className="env-region">ap-south-1</span>
          </div>
          <div className="env-account">
            <span className="env-label">Account:</span>
            <span className="env-id">640168430986</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
