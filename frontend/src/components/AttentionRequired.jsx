import React from 'react';
import { AlertOctagon, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AttentionRequired({ findings = [], onSelectFinding }) {
  const failedFindings = findings.filter(f => f.status === 'FAIL');

  return (
    <section className="dashboard-section">
      <div className="section-header-row">
        <div className="section-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3>Attention Required</h3>
            {failedFindings.length > 0 && (
              <span className="nav-badge fail-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {failedFindings.length} {failedFindings.length === 1 ? 'finding' : 'findings'} require review
              </span>
            )}
          </div>
          <p style={{ marginTop: '2px' }}>Surfaced security checks that evaluated to FAIL status in the latest scan</p>
        </div>
      </div>

      {failedFindings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {failedFindings.map((finding, idx) => (
            <div 
              key={`${finding.check_id}-${finding.resource}-${idx}`}
              className="metric-card"
              style={{ 
                borderLeft: '3px solid var(--color-fail)', 
                padding: '12px 16px', 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer'
              }}
              onClick={() => onSelectFinding(finding)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
                  <span className="status-tag fail">
                    <AlertOctagon size={13} />
                    <span>FAIL</span>
                  </span>

                  <span className="check-id-badge">{finding.check_id}</span>

                  <span className="resource-code" style={{ maxWidth: '280px' }}>
                    {finding.resource}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {finding.message}
                </div>
              </div>

              <button 
                className="scan-btn" 
                style={{ 
                  backgroundColor: 'var(--bg-elevated)', 
                  color: 'var(--text-primary)',
                  boxShadow: 'none',
                  fontSize: '11px',
                  padding: '5px 10px',
                  whiteSpace: 'nowrap',
                  gap: '4px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFinding(finding);
                }}
              >
                <span>View Finding</span>
                <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-card" style={{ padding: '20px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--color-pass)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
              No failed checks detected in the latest scan.
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              All evaluated resource configurations returned PASS status.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
