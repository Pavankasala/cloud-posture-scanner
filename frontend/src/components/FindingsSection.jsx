import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import FindingRow from './FindingRow';

export default function FindingsSection({ findings = [], onSelectFinding }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      const matchesSearch = 
        f.check_id.toLowerCase().includes(search.toLowerCase()) ||
        f.resource.toLowerCase().includes(search.toLowerCase()) ||
        f.message.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = 
        statusFilter === 'ALL' || f.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [findings, search, statusFilter]);

  const failCount = findings.filter(f => f.status === 'FAIL').length;
  const passCount = findings.filter(f => f.status === 'PASS').length;

  return (
    <section className="dashboard-section">
      <div className="section-header-row">
        <div className="section-title-group">
          <h3>Security Findings</h3>
          <p>Real-time posture evaluations executed across your AWS environment</p>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search check ID, resource, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
          >
            All ({findings.length})
          </button>

          <button
            onClick={() => setStatusFilter('FAIL')}
            className={`filter-tab ${statusFilter === 'FAIL' ? 'active' : ''}`}
            style={{ color: statusFilter === 'FAIL' ? 'var(--color-fail)' : '' }}
          >
            Failed ({failCount})
          </button>

          <button
            onClick={() => setStatusFilter('PASS')}
            className={`filter-tab ${statusFilter === 'PASS' ? 'active' : ''}`}
            style={{ color: statusFilter === 'PASS' ? 'var(--color-pass)' : '' }}
          >
            Passed ({passCount})
          </button>
        </div>
      </div>

      <div className="table-card">
        {filteredFindings.length > 0 ? (
          <table className="findings-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '200px' }}>Check ID</th>
                <th style={{ width: '220px' }}>Resource ID</th>
                <th>Detection Message</th>
                <th style={{ width: '32px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredFindings.map((finding, idx) => (
                <FindingRow
                  key={`${finding.check_id}-${finding.resource}-${idx}`}
                  finding={finding}
                  onSelect={onSelectFinding}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Search size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No findings match your filter criteria.</p>
            <p style={{ fontSize: '11px', marginTop: '2px' }}>Try resetting search or status filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
