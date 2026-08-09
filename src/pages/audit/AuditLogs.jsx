import { useState, useEffect, useCallback } from "react";
import {
  FileCheck2,
  Search,
  Download,
  Shield,
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Code,
  Copy,
  X,
  Clock,
  Terminal,
  User,
  Globe
} from "lucide-react";
import { fetchAuditLogs, exportAuditLogsData } from "../../services/auditLogService";
import { useToast } from "../../context/ToastContext";
import styles from "./AuditLogs.module.css";

export default function AuditLogs() {
  const toast = useToast();

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, securityEvents: 0, quotaMutations: 0, criticalWarnings: 0 });
  const [loading, setLoading] = useState(true);

  // Filter & Pagination State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Inspector Drawer State
  const [selectedLog, setSelectedLog] = useState(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAuditLogs({
        page,
        limit,
        search: debouncedSearch,
        actionType: actionTypeFilter,
      });

      setLogs(res.data);
      setTotalPages(res.totalPages);
      setStats(res.stats);
    } catch (err) {
      toast.error("Failed to load audit logs: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, actionTypeFilter, toast]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Export handlers
  const handleExportCSV = () => {
    exportAuditLogsData("csv", logs);
    toast.success("Generated Audit_Logs_Export.csv download", "Export Complete");
  };

  const handleExportJSON = () => {
    exportAuditLogsData("json", logs);
    toast.success("Generated Audit_Logs_Export.json download", "Export Complete");
  };

  const handleCopyPayload = () => {
    if (!selectedLog) return;
    const payloadStr = JSON.stringify(
      { before: selectedLog.payloadBefore, after: selectedLog.payloadAfter },
      null,
      2
    );
    navigator.clipboard.writeText(payloadStr);
    toast.info("JSON payload copied to clipboard", "Copied");
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Audit Logging & System Diagnostics</h1>
          <p className={styles.pageSubtitle}>
            High-volume administrative event stream, security audits, and JSON payload diff inspection.
          </p>
        </div>

        <div className={styles.headerExportGroup}>
          <button onClick={handleExportCSV} className={styles.btnGlassExport}>
            <Download size={15} /> Export CSV
          </button>
          <button onClick={handleExportJSON} className={styles.btnGlassExport}>
            <Code size={15} /> Export JSON
          </button>
        </div>
      </div>

      {/* 2. DIAGNOSTIC SUMMARY STATS CARDS (4 CARDS) */}
      <div className={styles.statsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statIconViolet}><FileCheck2 size={22} /></div>
          <div>
            <span className={styles.statLabel}>Total Audit Events</span>
            <h2 className={styles.statValue}>{stats.totalEvents.toLocaleString()}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconGreen}><Shield size={22} /></div>
          <div>
            <span className={styles.statLabel}>Security & Auth Events</span>
            <h2 className={styles.statValue}>{stats.securityEvents.toLocaleString()}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconCyan}><Activity size={22} /></div>
          <div>
            <span className={styles.statLabel}>Quota & Billing Mutations</span>
            <h2 className={styles.statValue}>{stats.quotaMutations.toLocaleString()}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconRose}><AlertTriangle size={22} /></div>
          <div>
            <span className={styles.statLabel}>Critical Warnings</span>
            <h2 className={styles.statValue}>{stats.criticalWarnings}</h2>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & ACTION FILTER TOOLBAR */}
      <div className={styles.glassToolbarCard}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Admin Email, Tenant Name, IP, or Action..."
            className={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} className={styles.btnClearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterPillsRow}>
          <span className={styles.filterLabel}>Action Type:</span>
          {["ALL", "TENANT_PROVISIONED", "QUOTA_ADJUSTED", "API_KEY_REGENERATED", "TENANT_SUSPENDED"].map((act) => (
            <button
              key={act}
              onClick={() => { setActionTypeFilter(act); setPage(1); }}
              className={`${styles.filterPill} ${actionTypeFilter === act ? styles.filterPillActive : ""}`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* 4. HIGH-VOLUME GLASS DATA TABLE */}
      <div className={styles.glassTableWrapper}>
        <table className={styles.glassTable}>
          <thead>
            <tr>
              <th>Timestamp & Log ID</th>
              <th>Admin Operator</th>
              <th>Action Type</th>
              <th>Target Tenant</th>
              <th>IP Address & Location</th>
              <th className={styles.alignRight}>Payload Inspector</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.loadingTd}>Loading system audit logs stream...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyTd}>No audit log events found matching search filters.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.timeCell}>
                      <span className={styles.timestamp}>{log.timestamp}</span>
                      <span className={styles.logIdTag}>{log.id}</span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.adminCell}>
                      <div className={styles.adminAvatar}>{log.adminId[0]?.toUpperCase()}</div>
                      <div className={styles.adminMeta}>
                        <span className={styles.adminEmail}>{log.adminId}</span>
                        <span className={styles.adminRole}>{log.adminRole}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`${styles.actionBadge} ${styles[`act_${log.actionType}`]}`}>
                      {log.actionType}
                    </span>
                  </td>

                  <td>
                    <div className={styles.tenantCell}>
                      <span className={styles.tenantName}>{log.targetTenant}</span>
                      <span className={styles.tenantId}>{log.targetTenantId}</span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.locationCell}>
                      <code>{log.ipAddress}</code>
                      <span className={styles.locationRegion}>{log.location}</span>
                    </div>
                  </td>

                  <td className={styles.alignRight}>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className={styles.btnInspectPayload}
                    >
                      <Code size={14} /> Inspect JSON Payload
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION BAR */}
        <div className={styles.paginationBar}>
          <div className={styles.paginationInfo}>
            <span>Showing page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className={styles.limitSelect}
            >
              <option value={5}>5 rows per page</option>
              <option value={10}>10 rows per page</option>
              <option value={20}>20 rows per page</option>
            </select>
          </div>

          <div className={styles.paginationButtons}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={styles.btnPage}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={styles.btnPage}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. COLLAPSIBLE GLASS JSON PAYLOAD INSPECTOR DRAWER / MODAL */}
      {selectedLog && (
        <div className={styles.modalBackdrop}>
          <div className={styles.drawerGlassCard}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitleWrap}>
                <Terminal size={20} className={styles.drawerIcon} />
                <div>
                  <h3>JSON Payload Inspector</h3>
                  <p className={styles.drawerSub}>Log ID: {selectedLog.id} • Action: {selectedLog.actionType}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLog(null)} className={styles.btnCloseDrawer}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* META ROW */}
              <div className={styles.metaBoxGrid}>
                <div><strong>Admin Operator:</strong> {selectedLog.adminId} ({selectedLog.adminRole})</div>
                <div><strong>Target Tenant:</strong> {selectedLog.targetTenant} ({selectedLog.targetTenantId})</div>
                <div><strong>Timestamp:</strong> {selectedLog.timestamp}</div>
                <div><strong>IP & Region:</strong> {selectedLog.ipAddress} ({selectedLog.location})</div>
              </div>

              {/* PAYLOAD BEFORE */}
              <div className={styles.codeBlockGroup}>
                <h4 className={styles.codeTitle}>payload_before</h4>
                <div className={styles.codePreWrapper}>
                  <pre>{selectedLog.payloadBefore ? JSON.stringify(selectedLog.payloadBefore, null, 2) : "// null (Initial Creation Event)"}</pre>
                </div>
              </div>

              {/* PAYLOAD AFTER */}
              <div className={styles.codeBlockGroup}>
                <h4 className={styles.codeTitle}>payload_after</h4>
                <div className={styles.codePreWrapper}>
                  <pre>{JSON.stringify(selectedLog.payloadAfter, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button onClick={handleCopyPayload} className={styles.btnCopyPayload}>
                <Copy size={14} /> Copy Full JSON Payload
              </button>
              <button onClick={() => setSelectedLog(null)} className={styles.btnClosePayload}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
