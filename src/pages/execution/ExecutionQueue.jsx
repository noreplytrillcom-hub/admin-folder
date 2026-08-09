import { useState, useEffect, useCallback } from "react";
import {
  ListTree,
  Play,
  Pause,
  AlertOctagon,
  Clock,
  Timer,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Building2,
  Cpu
} from "lucide-react";
import {
  fetchExecutionQueueTelemetry,
  toggleDispatcherPauseState,
  cancelQueueItem
} from "../../services/executionQueueService";
import { useToast } from "../../context/ToastContext";
import styles from "./ExecutionQueue.module.css";

export default function ExecutionQueue() {
  const toast = useToast();

  const [queueItems, setQueueItems] = useState([]);
  const [metrics, setMetrics] = useState({
    totalActiveQueueDepth: 0,
    pendingQueuedCount: 0,
    p0CriticalBacklogCount: 0,
    avgQueueWaitSeconds: 0,
    estBacklogClearMinutes: 0,
    dispatcherPaused: false,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      const res = await fetchExecutionQueueTelemetry({
        statusFilter,
        priorityFilter,
      });

      setQueueItems(res.queueItems);
      setMetrics(res.metrics);
      if (forceRefresh) {
        toast.success("Execution queue refreshed", "Live Stream Updated");
      }
    } catch (err) {
      toast.error("Failed to load execution queue: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, priorityFilter, toast]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(false), 5000); // 5s live polling
    return () => clearInterval(interval);
  }, [loadData]);

  // Toggle Global Dispatcher State
  const handleToggleDispatcher = async () => {
    try {
      const paused = await toggleDispatcherPauseState();
      if (paused) {
        toast.warning("Global Job Dispatcher PAUSED", "Dispatching Suspended");
      } else {
        toast.success("Global Job Dispatcher RESUMED", "Dispatching Active");
      }
      loadData(true);
    } catch (err) {
      toast.error("Failed to toggle dispatcher: " + err.message);
    }
  };

  // Cancel Queued Job
  const handleCancelJob = async (item) => {
    try {
      await cancelQueueItem(item.id);
      toast.info(`Job "${item.testSuiteName}" cancelled`, "Queue Item Removed");
      loadData(true);
    } catch (err) {
      toast.error("Failed to cancel job: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Global Live Execution Queue & Worker Stream</h1>
          <p className={styles.pageSubtitle}>
            Streaming active test runs across all client sandboxes with emergency queue control.
          </p>
        </div>

        <div className={styles.actionButtonGroup}>
          {/* Dispatcher Pause Control */}
          <button
            onClick={handleToggleDispatcher}
            className={metrics.dispatcherPaused ? styles.btnDispatcherPaused : styles.btnDispatcherActive}
          >
            {metrics.dispatcherPaused ? (
              <>
                <Play size={15} /> <span>Resume Dispatcher</span>
              </>
            ) : (
              <>
                <Pause size={15} /> <span>Pause Dispatcher</span>
              </>
            )}
          </button>

          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className={styles.btnGlassRefresh}
          >
            <RefreshCw size={15} className={refreshing ? styles.spinIcon : ""} />
            <span>Sync Queue</span>
          </button>
        </div>
      </div>

      {/* DISPATCHER PAUSED WARNING BANNER */}
      {metrics.dispatcherPaused && (
        <div className={styles.pausedBanner}>
          <AlertOctagon size={20} className={styles.bannerIcon} />
          <div>
            <strong>GLOBAL JOB DISPATCHER PAUSED</strong> — Worker node allocation is suspended. Enqueued jobs will hold in queue until resumed.
          </div>
        </div>
      )}

      {/* 2. REAL-TIME QUEUE TELEMETRY METRICS */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Queue Depth</span>
            <div className={styles.iconBoxViolet}><ListTree size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.totalActiveQueueDepth} Total Jobs</h2>
          <p className={styles.statSub}>{metrics.pendingQueuedCount} Pending in Queue</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>P0 Critical Backlog</span>
            <div className={styles.iconBoxRose}><AlertOctagon size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.p0CriticalBacklogCount} SLA Jobs</h2>
          <p className={styles.statSub}>Priority dispatch allocation</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Avg Queue Wait Time</span>
            <div className={styles.iconBoxCyan}><Clock size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.avgQueueWaitSeconds}s Avg Wait</h2>
          <p className={styles.statSub}>Target SLA: &lt; 30 seconds</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Est. Backlog Clear Duration</span>
            <div className={styles.iconBoxIndigo}><Timer size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.estBacklogClearMinutes} Mins Clear</h2>
          <p className={styles.statSub}>At current worker capacity</p>
        </div>
      </div>

      {/* 3. CONTROLS & FILTER TOOLBAR */}
      <div className={styles.glassToolbarCard}>
        <div className={styles.filterGroup}>
          <SlidersHorizontal size={15} className={styles.filterIcon} />
          <span className={styles.filterLabel}>Status:</span>
          {["ALL", "QUEUED", "DISPATCHED", "EXECUTING"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`${styles.filterPill} ${statusFilter === s ? styles.filterPillActive : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Priority:</span>
          {["ALL", "P0_CRITICAL", "P1_HIGH", "P2_STANDARD", "P3_BACKGROUND"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`${styles.filterPill} ${priorityFilter === p ? styles.filterPillActive : ""}`}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 4. LIVE STREAMING QUEUE TABLE */}
      <div className={styles.sectionCard}>
        <div className={styles.glassTableWrapper}>
          <table className={styles.glassTable}>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Test Suite & Tenant</th>
                <th>Status</th>
                <th>Assigned Worker Node</th>
                <th>Wait / Duration</th>
                <th className={styles.alignRight}>Queue Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={styles.loadingTd}>Loading execution queue stream...</td></tr>
              ) : queueItems.length === 0 ? (
                <tr><td colSpan={6} className={styles.emptyTd}>No queue items match current filter criteria.</td></tr>
              ) : (
                queueItems.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td>
                      <span className={`${styles.priorityBadge} ${styles[`priority_${item.priority}`]}`}>
                        {item.priority.replace("_", " ").toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className={styles.suiteCell}>
                        <span className={styles.suiteTitle}>{item.testSuiteName}</span>
                        <div className={styles.tenantMeta}>
                          <Building2 size={12} />
                          <span>{item.organizationName}</span>
                          <span className={styles.tenantIdTag}>({item.organizationId})</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className={styles.statusCell}>
                        <span className={`${styles.statusDot} ${styles[`dot_${item.status}`]}`} />
                        <span className={styles.statusText}>{item.status.toUpperCase()}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.workerCell}>
                        <Cpu size={13} className={styles.iconWorker} />
                        <span>{item.workerNodeName || "Unassigned (Pending)"}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.durationCell}>
                        <span>Wait: <strong>{item.waitTimeSeconds}s</strong></span>
                        <span className={styles.estDuration}>Est: {item.estimatedDurationSeconds}s</span>
                      </div>
                    </td>

                    <td className={styles.alignRight}>
                      {item.status === "queued" && (
                        <button
                          onClick={() => handleCancelJob(item)}
                          className={styles.btnCancelJob}
                          title="Cancel Queued Job"
                        >
                          <XCircle size={14} /> Cancel Job
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
