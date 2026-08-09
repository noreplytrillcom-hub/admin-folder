import { useState, useEffect, useCallback } from "react";
import {
  Cpu,
  Server,
  Activity,
  Zap,
  Clock,
  Trash2,
  AlertTriangle,
  RefreshCw,
  XCircle,
  HardDrive,
  Globe,
  Terminal,
  ShieldAlert,
  X
} from "lucide-react";
import { fetchComputePoolTelemetry, killSandboxContainer } from "../../services/computeService";
import { useToast } from "../../context/ToastContext";
import styles from "./WorkerPoolManager.module.css";

export default function WorkerPoolManager() {
  const toast = useToast();

  const [nodes, setNodes] = useState([]);
  const [sandboxes, setSandboxes] = useState([]);
  const [metrics, setMetrics] = useState({
    totalNodesCount: 0,
    busyNodesCount: 0,
    drainingNodesCount: 0,
    avgClusterCpuPct: 0,
    avgClusterRamPct: 0,
    activeSandboxesRunning: 0,
    totalClusterCapacity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Kill Sandbox Confirmation State
  const [selectedKillSandbox, setSelectedKillSandbox] = useState(null);
  const [killing, setKilling] = useState(false);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      const res = await fetchComputePoolTelemetry();
      setNodes(res.workerNodes);
      setSandboxes(res.activeSandboxes);
      setMetrics(res.metrics);
      if (forceRefresh) {
        toast.success("Compute cluster telemetry updated", "Telemetry Refreshed");
      }
    } catch (err) {
      toast.error("Failed to fetch compute telemetry: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(false), 15000); // 15s auto-refresh
    return () => clearInterval(interval);
  }, [loadData]);

  // Execute Emergency Kill Switch
  const handleConfirmKill = async () => {
    if (!selectedKillSandbox) return;
    try {
      setKilling(true);
      await killSandboxContainer(selectedKillSandbox.id);
      toast.warning(
        `Container ${selectedKillSandbox.containerDockerId} terminated`,
        "Sandbox Aborted"
      );
      setSelectedKillSandbox(null);
      loadData(true);
    } catch (err) {
      toast.error("Failed to kill container: " + err.message);
    } finally {
      setKilling(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonGrid} />
      </div>
    );
  }

  const capacityPct = Math.round(
    (metrics.activeSandboxesRunning / (metrics.totalClusterCapacity || 1)) * 100
  );

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Worker Sandbox Pool & Container Infrastructure</h1>
          <p className={styles.pageSubtitle}>
            Real-time Kubernetes worker pods, Playwright/Chromium sandbox allocations, and emergency kill controls.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className={styles.btnGlassRefresh}
        >
          <RefreshCw size={15} className={refreshing ? styles.spinIcon : ""} />
          <span>Sync Infrastructure</span>
        </button>
      </div>

      {/* 2. TOP CLUSTER TELEMETRY METRICS (4 CARDS WITH PROGRESS BARS) */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Worker Nodes</span>
            <div className={styles.iconBoxViolet}><Server size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.totalNodesCount} Active Hosts</h2>
          <p className={styles.statSub}>
            {metrics.busyNodesCount} Busy • {metrics.drainingNodesCount} Draining
          </p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Sandboxes vs Capacity</span>
            <div className={styles.iconBoxCyan}><Zap size={20} /></div>
          </div>
          <h2 className={styles.statValue}>
            {metrics.activeSandboxesRunning} / {metrics.totalClusterCapacity} Containers
          </h2>
          <div className={styles.progressTrack}>
            <div
              className={capacityPct > 85 ? styles.fillRose : styles.fillCyan}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
          <p className={styles.statSub}>{capacityPct}% cluster slot utilization</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Avg Cluster CPU Load</span>
            <div className={styles.iconBoxIndigo}><Cpu size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.avgClusterCpuPct}% CPU</h2>
          <div className={styles.progressTrack}>
            <div
              className={metrics.avgClusterCpuPct > 80 ? styles.fillRose : styles.fillViolet}
              style={{ width: `${metrics.avgClusterCpuPct}%` }}
            />
          </div>
          <p className={styles.statSub}>Across all active worker pods</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Avg Cluster RAM Load</span>
            <div className={styles.iconBoxBlue}><HardDrive size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.avgClusterRamPct}% RAM</h2>
          <div className={styles.progressTrack}>
            <div
              className={metrics.avgClusterRamPct > 80 ? styles.fillRose : styles.fillBlue}
              style={{ width: `${metrics.avgClusterRamPct}%` }}
            />
          </div>
          <p className={styles.statSub}>Total allocated container memory</p>
        </div>
      </div>

      {/* 3. WORKER NODE HOST GRID */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleGroup}>
            <Server size={18} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Worker Node Pool Hosts</h3>
          </div>
        </div>

        <div className={styles.nodeGrid}>
          {nodes.map((node) => (
            <div key={node.id} className={styles.glassNodeCard}>
              <div className={styles.nodeCardHeader}>
                <div>
                  <h4 className={styles.nodeName}>{node.nodeName}</h4>
                  <span className={styles.nodeIp}>IP: {node.hostIp}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${node.status}`]}`}>
                  {node.status.toUpperCase()}
                </span>
              </div>

              <div className={styles.nodeRegionRow}>
                <Globe size={13} className={styles.globeIcon} />
                <span>{node.region}</span>
              </div>

              <div className={styles.nodeMetricsBlock}>
                {/* CPU Bar */}
                <div className={styles.barGroup}>
                  <div className={styles.barLabelRow}>
                    <span>CPU Utilization</span>
                    <strong>{node.cpuUtilizationPct}%</strong>
                  </div>
                  <div className={styles.miniTrack}>
                    <div
                      className={node.cpuUtilizationPct > 80 ? styles.fillRose : styles.fillViolet}
                      style={{ width: `${node.cpuUtilizationPct}%` }}
                    />
                  </div>
                </div>

                {/* RAM Bar */}
                <div className={styles.barGroup}>
                  <div className={styles.barLabelRow}>
                    <span>RAM Utilization</span>
                    <strong>{node.ramUtilizationPct}%</strong>
                  </div>
                  <div className={styles.miniTrack}>
                    <div
                      className={node.ramUtilizationPct > 80 ? styles.fillRose : styles.fillCyan}
                      style={{ width: `${node.ramUtilizationPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.nodeFooter}>
                <span>Active Containers: <strong>{node.activeContainersCount} / {node.maxContainerCapacity}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LIVE CONTAINER SANDBOXES DATA TABLE */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleGroup}>
            <Terminal size={18} className={styles.sectionIcon} />
            <div>
              <h3 className={styles.sectionTitle}>Live Playwright Container Sandboxes</h3>
              <p className={styles.sectionSub}>Active browser sandboxes running client test automation suites.</p>
            </div>
          </div>
        </div>

        <div className={styles.glassTableWrapper}>
          <table className={styles.glassTable}>
            <thead>
              <tr>
                <th>Container ID & Suite Name</th>
                <th>Tenant Organization</th>
                <th>Host Worker Node</th>
                <th>CPU / RAM Allocated</th>
                <th>Duration</th>
                <th className={styles.alignRight}>Emergency Kill</th>
              </tr>
            </thead>
            <tbody>
              {sandboxes.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyTd}>No active browser sandboxes running.</td>
                </tr>
              ) : (
                sandboxes.map((sbx) => (
                  <tr key={sbx.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.containerCell}>
                        <code>{sbx.containerDockerId}</code>
                        <span className={styles.suiteName}>{sbx.testSuiteName}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.tenantCell}>
                        <span className={styles.tenantName}>{sbx.organizationName}</span>
                        <span className={styles.tenantIdTag}>{sbx.organizationId}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.nodeCell}>
                        <span className={styles.nodeText}>{sbx.workerNodeName}</span>
                      </div>
                    </td>

                    <td>
                      <span className={styles.allocVal}>
                        {sbx.cpuCoresAllocated} vCPU • {sbx.ramMbAllocated} MB
                      </span>
                    </td>

                    <td>
                      <div className={styles.durationCell}>
                        <Clock size={13} className={styles.clockIcon} />
                        <span>{sbx.durationSeconds}s</span>
                      </div>
                    </td>

                    <td className={styles.alignRight}>
                      <button
                        onClick={() => setSelectedKillSandbox(sbx)}
                        className={styles.btnKillContainer}
                        title="Emergency Kill Sandbox"
                      >
                        <XCircle size={15} /> Kill Sandbox
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. EMERGENCY KILL CONFIRMATION MODAL */}
      {selectedKillSandbox && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <AlertTriangle size={20} className={styles.modalIconRose} />
                <h3>Terminate Container Sandbox</h3>
              </div>
              <button onClick={() => setSelectedKillSandbox(null)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.warningDesc}>
                Warning: You are performing an emergency kill-switch termination on container{" "}
                <code>{selectedKillSandbox.containerDockerId}</code> running for tenant{" "}
                <strong>{selectedKillSandbox.organizationName}</strong>.
              </p>
              <div className={styles.metaBox}>
                <div><strong>Test Suite:</strong> {selectedKillSandbox.testSuiteName}</div>
                <div><strong>Host Node:</strong> {selectedKillSandbox.workerNodeName}</div>
                <div><strong>Duration:</strong> {selectedKillSandbox.durationSeconds}s</div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setSelectedKillSandbox(null)} className={styles.btnCancel}>
                Cancel
              </button>
              <button
                onClick={handleConfirmKill}
                disabled={killing}
                className={styles.btnConfirmKill}
              >
                {killing ? "Terminating..." : "Confirm Emergency Kill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
