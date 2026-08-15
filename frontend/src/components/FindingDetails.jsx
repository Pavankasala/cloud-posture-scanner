import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

export default function FindingDetails({ finding, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!finding) return null;

  const isPass = finding.status === 'PASS';

  const getWhyItMatters = (checkId) => {
    switch (checkId) {
      case 'S3_ENCRYPTION':
        return 'Server-side encryption protects objects stored in the S3 bucket from being stored as plaintext at rest.';
      case 'S3_PUBLIC_ACCESS':
        return 'Public access block settings reduce the possibility of unintended public access to the bucket or its objects.';
      case 'EC2_SSH_RDP_EXPOSURE':
        return 'Public exposure of administrative remote-management ports allows network connections from internet-reachable sources.';
      case 'IAM_MFA':
        return "MFA adds an additional authentication factor for the AWS account's root user.";
      case 'CLOUDTRAIL_ENABLED':
        return 'CloudTrail provides an audit record of AWS API activity and management events.';
      default:
        return null;
    }
  };

  const whyItMatters = getWhyItMatters(finding.check_id);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-area">
            <span className={`status-tag ${isPass ? 'pass' : 'fail'}`}>
              {isPass ? <CheckCircle2 size={14} /> : <AlertOctagon size={14} />}
              <span>{finding.status}</span>
            </span>
            <h3>{finding.check_id}</h3>
          </div>

          <button onClick={onClose} className="close-btn" aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          <div className="detail-group">
            <div className="detail-label">Affected Resource</div>
            <div className="detail-box" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {finding.resource}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">Detection</div>
            <div className="detail-box">
              {finding.message}
            </div>
          </div>

          {whyItMatters && (
            <div className="detail-group">
              <div className="detail-label">Why This Matters</div>
              <div className="detail-box" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Info size={16} style={{ color: 'var(--accent-blue)', marginTop: '2px', flexShrink: 0 }} />
                <span>{whyItMatters}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
