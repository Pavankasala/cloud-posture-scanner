import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PostureScore from './PostureScore';
import MetricCard from './MetricCard';
import AttentionRequired from './AttentionRequired';
import FindingsSection from './FindingsSection';
import ResourceSection from './ResourceSection';
import FindingDetails from './FindingDetails';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import AmbientBackground from './AmbientBackground';
import { EC2Table, S3Table } from './ResourceTable';

import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Layers,
  RefreshCw,
  Users,
  Activity,
} from 'lucide-react';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState('overview');
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchScan = async (isManualTrigger = false) => {
    if (isManualTrigger) {
      setScanning(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await fetch(`${API_URL}/scan`);

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const data = await response.json();

      setScanData(data);

      const now = new Date();

      setLastScanTime(
        `Last scan: ${now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}`
      );
    } catch (err) {
      console.error('Failed to fetch scan data:', err);
      setError(err.message || 'Failed to connect to backend scanner API.');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchScan();
  }, []);

  const summary = scanData?.summary || {
    total: 0,
    passed: 0,
    failed: 0,
  };

  const instances = scanData?.instances || [];
  const buckets = scanData?.buckets || [];
  const findings = scanData?.findings || [];
  const storage = scanData?.storage || null;

  const totalResources = instances.length + buckets.length;

  const passPercent =
    summary.total > 0
      ? Math.round((summary.passed / summary.total) * 100)
      : 0;

  const failPercent =
    summary.total > 0
      ? 100 - passPercent
      : 0;

  let scanState = 'idle';

  if (scanning) {
    scanState = 'scanning';
  } else if (summary.failed > 0) {
    scanState = 'has-failures';
  } else if (summary.total > 0) {
    scanState = 'no-failures';
  }

  return (
    <div className="app-shell">
      <AmbientBackground scanState={scanState} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        failedCount={summary.failed}
      />

      <div className="main-content">
        <Header
          onScan={() => fetchScan(true)}
          loading={scanning}
          lastScanTime={lastScanTime}
          activeTab={activeTab}
        />

        <main className="dashboard-container">
          {scanning && (
            <div
              className="table-card"
              style={{
                padding: '12px 18px',
                marginBottom: '20px',
                backgroundColor: 'var(--accent-blue-bg)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <RefreshCw
                size={15}
                className="spin-icon"
                style={{ color: 'var(--accent-blue)' }}
              />

              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                <strong>
                  Security posture audit in progress for ap-south-1...
                </strong>{' '}
                Evaluating EC2 instances, S3 buckets, IAM root MFA, and
                CloudTrail logging.
              </div>
            </div>
          )}

          {error && (
            <ErrorState
              error={error}
              onRetry={() => fetchScan(false)}
            />
          )}

          {loading ? (
            <LoadingState />
          ) : (
            <div key={activeTab} className="tab-content-anim">

              {/* TOP METRICS */}
              {(activeTab === 'overview' ||
                activeTab === 'findings' ||
                activeTab === 'resources') && (
                  <div className="metrics-grid">
                    <PostureScore
                      passed={summary.passed}
                      total={summary.total}
                    />

                    <MetricCard
                      label="Total Checks"
                      value={summary.total}
                      icon={Layers}
                      subtext="Evaluated Checks"
                    />

                    <MetricCard
                      label="Passed Checks"
                      value={summary.passed}
                      icon={CheckCircle2}
                      type="pass"
                      subtext="Passed Checks"
                    />

                    <MetricCard
                      label="Failed Checks"
                      value={summary.failed}
                      icon={AlertTriangle}
                      type="fail"
                      subtext="Failed Checks"
                    />

                    <MetricCard
                      label="Resources Scanned"
                      value={totalResources}
                      icon={Cloud}
                      subtext={`${instances.length} EC2 · ${buckets.length} S3`}
                    />
                  </div>
                )}

              {/* SCAN RESULTS */}
              {activeTab === 'overview' && (
                <div className="distribution-card">
                  <div className="distribution-header">
                    <span className="distribution-title">
                      Scan Results
                    </span>

                    <div className="distribution-legend">
                      <div className="legend-item">
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: 'var(--color-pass)',
                          }}
                        />

                        <span>{summary.passed} Passed</span>
                      </div>

                      <div className="legend-item">
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: 'var(--color-fail)',
                          }}
                        />

                        <span>{summary.failed} Failed</span>
                      </div>
                    </div>
                  </div>

                  <div className="stacked-bar">
                    <div
                      className="bar-segment-pass"
                      style={{
                        width: `${passPercent}%`,
                      }}
                    />

                    <div
                      className="bar-segment-fail"
                      style={{
                        width: `${failPercent}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ATTENTION REQUIRED */}
              {activeTab === 'overview' && (
                <AttentionRequired
                  findings={findings}
                  onSelectFinding={(finding) =>
                    setSelectedFinding(finding)
                  }
                />
              )}

              {/* FINDINGS */}
              {(activeTab === 'overview' ||
                activeTab === 'findings') && (
                  <FindingsSection
                    findings={findings}
                    onSelectFinding={(finding) =>
                      setSelectedFinding(finding)
                    }
                  />
                )}

              {/* RESOURCES */}
              {(activeTab === 'overview' ||
                activeTab === 'resources') && (
                  <ResourceSection
                    instances={instances}
                    buckets={buckets}
                  />
                )}

              {/* EC2 */}
              {activeTab === 'ec2' && (
                <section className="dashboard-section">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <h3>EC2 Workload Inventory</h3>
                      <p>
                        Discovered compute instances in ap-south-1
                      </p>
                    </div>
                  </div>

                  <div className="table-card">
                    <EC2Table instances={instances} />
                  </div>
                </section>
              )}

              {/* S3 */}
              {activeTab === 's3' && (
                <section className="dashboard-section">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <h3>S3 Storage Inventory</h3>
                      <p>Discovered S3 storage buckets</p>
                    </div>
                  </div>

                  <div className="table-card">
                    <S3Table buckets={buckets} />
                  </div>
                </section>
              )}

              {/* IAM */}
              {activeTab === 'iam' && (
                <div>
                  <div
                    className="table-card"
                    style={{
                      padding: '20px 24px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <Users
                      size={24}
                      style={{
                        color: 'var(--accent-blue)',
                        flexShrink: 0,
                      }}
                    />

                    <div>
                      <h3
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        IAM & Account Privileged Access Posture
                      </h3>

                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                        }}
                      >
                        Evaluates root user Multi-Factor Authentication
                        (MFA) enforcement for AWS Account{' '}
                        <code>640168430986</code>.
                      </p>
                    </div>
                  </div>

                  <FindingsSection
                    findings={findings.filter(
                      (finding) => finding.check_id === 'IAM_MFA'
                    )}
                    onSelectFinding={(finding) =>
                      setSelectedFinding(finding)
                    }
                  />
                </div>
              )}

              {/* CLOUDTRAIL */}
              {activeTab === 'cloudtrail' && (
                <div>
                  <div
                    className="table-card"
                    style={{
                      padding: '20px 24px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <Activity
                      size={24}
                      style={{
                        color: 'var(--accent-blue)',
                        flexShrink: 0,
                      }}
                    />

                    <div>
                      <h3
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        CloudTrail Security & Audit Trail Posture
                      </h3>

                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                        }}
                      >
                        Evaluates regional CloudTrail management logging
                        state across AWS region <code>ap-south-1</code>.
                      </p>
                    </div>
                  </div>

                  <FindingsSection
                    findings={findings.filter(
                      (finding) =>
                        finding.check_id === 'CLOUDTRAIL_ENABLED'
                    )}
                    onSelectFinding={(finding) =>
                      setSelectedFinding(finding)
                    }
                  />
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <section className="dashboard-section">
                  <div className="section-header-row">
                    <div className="section-title-group">
                      <h3>
                        Scanner Configuration & System Status
                      </h3>
                      <p>
                        System settings, environment parameters, and S3
                        persistence status
                      </p>
                    </div>
                  </div>

                  <div
                    className="table-card"
                    style={{ padding: '24px' }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                      }}
                    >
                      <div className="detail-group">
                        <div className="detail-label">
                          Backend API URL
                        </div>

                        <div
                          className="detail-box"
                          style={{
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {API_URL || 'Not configured'}
                        </div>
                      </div>

                      <div className="detail-group">
                        <div className="detail-label">
                          AWS Target Region
                        </div>

                        <div
                          className="detail-box"
                          style={{
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          ap-south-1
                        </div>
                      </div>

                      <div className="detail-group">
                        <div className="detail-label">
                          S3 Scan Persistence
                        </div>

                        <div className="detail-box">
                          {storage?.stored ? (
                            <span
                              style={{
                                color: 'var(--color-pass)',
                                fontWeight: 600,
                              }}
                            >
                              Enabled (Bucket: {storage.bucket})
                            </span>
                          ) : (
                            <span
                              style={{
                                color: 'var(--text-muted)',
                              }}
                            >
                              Local Memory Mode
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="detail-group">
                        <div className="detail-label">
                          Evaluation Engine
                        </div>

                        <div className="detail-box">
                          AWS Posture Scanner Core
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FINDING DETAILS DRAWER */}
      {selectedFinding && (
        <FindingDetails
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      )}
    </div>
  );
}