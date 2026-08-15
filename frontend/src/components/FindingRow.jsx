import React from 'react';
import { CheckCircle2, AlertOctagon, ChevronRight } from 'lucide-react';

export default function FindingRow({ finding, onSelect }) {
  const isPass = finding.status === 'PASS';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(finding);
    }
  };

  return (
    <tr 
      onClick={() => onSelect(finding)} 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="finding-row"
      aria-label={`View finding details for ${finding.check_id} on ${finding.resource}`}
    >
      <td style={{ width: '100px' }}>
        <span className={`status-tag ${isPass ? 'pass' : 'fail'}`}>
          {isPass ? <CheckCircle2 size={13} /> : <AlertOctagon size={13} />}
          <span>{finding.status}</span>
        </span>
      </td>

      <td style={{ width: '200px' }}>
        <span className="check-id-badge">{finding.check_id}</span>
      </td>

      <td style={{ width: '220px' }}>
        <span className="resource-code">{finding.resource}</span>
      </td>

      <td>
        <span style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {finding.message}
        </span>
      </td>

      <td style={{ textAlign: 'right', width: '32px', paddingRight: '12px' }}>
        <ChevronRight size={14} className="row-chevron" style={{ color: 'var(--text-muted)' }} />
      </td>
    </tr>
  );
}
