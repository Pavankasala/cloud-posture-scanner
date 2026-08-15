import React, { useState } from 'react';
import { Server, HardDrive } from 'lucide-react';
import { EC2Table, S3Table } from './ResourceTable';

export default function ResourceSection({ instances = [], buckets = [], activeSubTab = 'all' }) {
  const [tab, setTab] = useState(activeSubTab === 's3' ? 's3' : activeSubTab === 'ec2' ? 'ec2' : 'ec2');

  return (
    <section className="dashboard-section">
      <div className="section-header-row">
        <div className="section-title-group">
          <h3>Discovered Cloud Resources</h3>
          <p>Inventory breakdown of discovered compute and storage resources</p>
        </div>

        <div className="resource-tab-group" style={{ marginBottom: 0 }}>
          <button
            onClick={() => setTab('ec2')}
            className={`resource-tab-btn ${tab === 'ec2' ? 'active' : ''}`}
          >
            <Server size={15} />
            <span>EC2 Instances ({instances.length})</span>
          </button>

          <button
            onClick={() => setTab('s3')}
            className={`resource-tab-btn ${tab === 's3' ? 'active' : ''}`}
          >
            <HardDrive size={15} />
            <span>S3 Buckets ({buckets.length})</span>
          </button>
        </div>
      </div>

      <div className="table-card">
        {tab === 'ec2' ? (
          <EC2Table instances={instances} />
        ) : (
          <S3Table buckets={buckets} />
        )}
      </div>
    </section>
  );
}
