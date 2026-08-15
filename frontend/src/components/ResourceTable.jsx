import React from 'react';
import { Server, HardDrive, ShieldAlert, ShieldCheck } from 'lucide-react';

export function EC2Table({ instances = [] }) {
  if (!instances || instances.length === 0) {
    return (
      <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Server size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No EC2 instances discovered in active scan.</p>
        <p style={{ fontSize: '11px', marginTop: '2px' }}>Check target region settings or launch instances in ap-south-1.</p>
      </div>
    );
  }

  return (
    <table className="findings-table">
      <thead>
        <tr>
          <th style={{ width: '200px' }}>Instance ID</th>
          <th style={{ width: '140px' }}>Instance Type</th>
          <th style={{ width: '120px' }}>Region</th>
          <th style={{ width: '160px' }}>Public IP</th>
          <th>Security Groups</th>
        </tr>
      </thead>
      <tbody>
        {instances.map((inst, idx) => (
          <tr key={inst.instance_id || idx}>
            <td style={{ width: '200px' }}>
              <span className="resource-code">{inst.instance_id}</span>
            </td>
            <td style={{ width: '140px' }}>
              <span className="check-id-badge" style={{ background: 'var(--bg-elevated)' }}>
                {inst.instance_type || 'N/A'}
              </span>
            </td>
            <td style={{ width: '120px' }}>{inst.region || 'ap-south-1'}</td>
            <td style={{ width: '160px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: inst.public_ip ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {inst.public_ip || 'None (Private)'}
              </span>
            </td>
            <td>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {inst.security_groups && inst.security_groups.length > 0 ? (
                  inst.security_groups.map((sg) => (
                    <span key={sg} className="check-id-badge" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {sg}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function S3Table({ buckets = [] }) {
  if (!buckets || buckets.length === 0) {
    return (
      <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <HardDrive size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No workload S3 buckets discovered in active scan.</p>
        <p style={{ fontSize: '11px', marginTop: '2px' }}>Workload buckets created in AWS account will appear here upon re-scan.</p>
      </div>
    );
  }

  return (
    <table className="findings-table">
      <thead>
        <tr>
          <th style={{ width: '240px' }}>Bucket Name</th>
          <th style={{ width: '140px' }}>Region</th>
          <th style={{ width: '180px' }}>Server Encryption</th>
          <th>Public Access Block Status</th>
        </tr>
      </thead>
      <tbody>
        {buckets.map((bucket, idx) => {
          const isBlocked = bucket.public_access_blocked === true;
          return (
            <tr key={bucket.name || idx}>
              <td style={{ width: '240px' }}>
                <span className="resource-code">{bucket.name}</span>
              </td>
              <td style={{ width: '140px' }}>{bucket.region || 'ap-south-1'}</td>
              <td style={{ width: '180px' }}>
                <span className="check-id-badge" style={{ color: bucket.encryption ? 'var(--color-pass)' : 'var(--color-fail)' }}>
                  {bucket.encryption || 'Disabled'}
                </span>
              </td>
              <td>
                <span className={`status-tag ${isBlocked ? 'pass' : 'fail'}`}>
                  {isBlocked ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                  <span>{isBlocked ? 'Blocked (Private)' : 'Not Blocked (Public)'}</span>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
