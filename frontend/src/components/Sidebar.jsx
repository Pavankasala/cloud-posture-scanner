import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  AlertTriangle, 
  Server, 
  HardDrive, 
  Users, 
  Activity, 
  Settings, 
  Cloud 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, failedCount = 0 }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'findings', label: 'Findings', icon: AlertTriangle, badge: failedCount > 0 ? failedCount : null, failBadge: failedCount > 0 },
    { id: 'resources', label: 'Resources', icon: Cloud },
    { id: 'ec2', label: 'EC2 Instances', icon: Server },
    { id: 's3', label: 'S3 Buckets', icon: HardDrive },
    { id: 'iam', label: 'IAM Posture', icon: Users },
    { id: 'cloudtrail', label: 'CloudTrail', icon: Activity },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Shield size={20} />
        </div>
        <div className="brand-text">
          <h1>Cloud Posture</h1>
          <p>AWS Security Posture</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-item-left">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge !== null && (
                <span className={`nav-badge ${item.failBadge ? 'fail-badge' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '16px' }}>System</div>
        <button
          onClick={() => setActiveTab('settings')}
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <div className="nav-item-left">
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="env-indicator">
          <span className="env-dot"></span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>ap-south-1</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AWS Account: 640168430986</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
