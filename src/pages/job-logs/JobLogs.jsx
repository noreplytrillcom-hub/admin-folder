import {
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Input,
  message,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  Activity,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  FileText,
  Info,
  Play,
  Terminal,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../supabase/client";
import styles from "../exceptions/Logs.module.css";

const { Option } = Select;

// Rich Dummy Job Logs Fallback
const DUMMY_JOB_LOGS = [
  {
    id: "JOB-7701",
    job_name: "SYNC_AUTH_USERS_CRON",
    status: "Success",
    execution_time: 1420,
    details:
      "Successfully synced 48 users from auth.users to allowed_users table",
    executed_at: new Date(Date.now() - 10 * 60000).toISOString(),
    memory_used: "42.8 MB",
    trigger_source: "Cloudflare Cron Trigger",
    output_log: `[04:10:01] Starting cron job: SYNC_AUTH_USERS_CRON
[04:10:02] Fetching authenticated users from Supabase auth.users...
[04:10:02] Fetched 48 user records.
[04:10:03] Upserting 48 records into allowed_users table...
[04:10:03] Upsert successful. 48 rows modified.
[04:10:03] Job completed in 1420 ms with exit code 0.`,
  },
  {
    id: "JOB-7702",
    job_name: "STRIPE_WEBHOOK_RETRY_QUEUE",
    status: "Failed",
    execution_time: 5120,
    details:
      "Failed to process webhook event evt_3N88a91x: Connection Timeout",
    executed_at: new Date(Date.now() - 35 * 60000).toISOString(),
    memory_used: "68.2 MB",
    trigger_source: "Redis Queue Worker",
    output_log: `[03:45:00] Worker starting task: STRIPE_WEBHOOK_RETRY_QUEUE (Attempt 3/3)
[03:45:01] Processing event evt_3N88a91x for partner_id: ptr_99182...
[03:45:05] Connection timed out after 5000 ms contacting payment endpoint.
[03:45:05] ERROR: Max retry limit reached (3 attempts). Moving event to dead-letter queue.
[03:45:05] Job failed in 5120 ms with exit code 1.`,
  },
  {
    id: "JOB-7703",
    job_name: "DAILY_ANALYTICS_AGGREGATOR",
    status: "Success",
    execution_time: 3240,
    details:
      "Calculated daily active users, retention metrics, and partner billings",
    executed_at: new Date(Date.now() - 90 * 60000).toISOString(),
    memory_used: "112.4 MB",
    trigger_source: "System Scheduler",
    output_log: `[02:50:00] Initializing DAILY_ANALYTICS_AGGREGATOR
[02:50:01] Aggregating active sessions for date: 2026-08-05
[02:50:02] Computed DAU: 1,842 users. Calculated revenue: $14,290.00
[02:50:03] Saved aggregated records to analytics_summary table.
[02:50:03] Job completed in 3240 ms with exit code 0.`,
  },
  {
    id: "JOB-7704",
    job_name: "DATABASE_BACKUP_SNAPSHOT",
    status: "Success",
    execution_time: 8910,
    details: "Database WAL snapshot created and uploaded to GCS bucket",
    executed_at: new Date(Date.now() - 180 * 60000).toISOString(),
    memory_used: "184.6 MB",
    trigger_source: "Automated Maintenance Worker",
    output_log: `[01:20:00] Starting WAL snapshot backup...
[01:20:03] Exporting PostgreSQL schema and tables...
[01:20:07] Compressed payload size: 148.5 MB.
[01:20:08] Uploaded snapshot to gs://admin-db-backups/2026-08-06-snapshot.tar.gz
[01:20:08] Job completed in 8910 ms with exit code 0.`,
  },
  {
    id: "JOB-7705",
    job_name: "EMAIL_REPORT_DISPATCHER",
    status: "Failed",
    execution_time: 2150,
    details: "SendGrid API Error 403: Invalid Sender Domain Authorization",
    executed_at: new Date(Date.now() - 310 * 60000).toISOString(),
    memory_used: "34.1 MB",
    trigger_source: "Email Worker Daemon",
    output_log: `[23:10:00] Dispatching weekly executive PDF summary reports...
[23:10:01] Preparing email template for 14 enterprise partner recipients.
[23:10:02] SendGrid API returned status 403 Forbidden: Sender domain not authorized.
[23:10:02] ERROR: Dispatch failed.
[23:10:02] Job failed in 2150 ms with exit code 1.`,
  },
];

export default function JobLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Job Inspector Drawer
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchJobLogs();
  }, []);

  // Fetch Job Logs from Supabase with fallback to rich dummy data
  const fetchJobLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("JobLogs")
        .select("*")
        .order("ExecutedAt", { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        setLogs(DUMMY_JOB_LOGS);
      } else {
        const formattedData = data.map((item) => ({
          id: item.Id || item.id || `JOB-${Math.floor(Math.random() * 9000 + 1000)}`,
          job_name: item.JobName || item.job_name || "SYSTEM_JOB",
          status: item.Status || item.status || "Success",
          execution_time: item.ExecutionTime || item.execution_time || 1200,
          details: item.Details || item.details || "Execution completed",
          executed_at: item.ExecutedAt || item.executed_at || new Date().toISOString(),
          memory_used: item.MemoryUsed || item.memory_used || "45.0 MB",
          trigger_source: item.TriggerSource || item.trigger_source || "Cron Scheduler",
          output_log: item.OutputLog || item.output_log || `[Log] Executing ${item.JobName || "Job"}\n[Log] Process completed successfully.`,
        }));
        setLogs(formattedData);
      }
    } catch (err) {
      console.error("Error fetching job logs:", err);
      setLogs(DUMMY_JOB_LOGS);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredLogs = logs.filter((job) => {
    const searchStr = `
      ${job.id || ""} 
      ${job.job_name || ""} 
      ${job.details || ""} 
      ${job.status || ""}
    `.toLowerCase();

    const matchesSearch = searchStr.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "SUCCESS" &&
        job.status?.toLowerCase() === "success") ||
      (statusFilter === "FAILED" && job.status?.toLowerCase() === "failed");

    return matchesSearch && matchesStatus;
  });

  // Open Job Inspector Drawer
  const handleOpenInspector = (record) => {
    setSelectedJob(record);
    setDrawerOpen(true);
  };

  // Copy Terminal Logs to Clipboard
  const handleCopyLogs = () => {
    if (selectedJob?.output_log) {
      navigator.clipboard.writeText(selectedJob.output_log);
      message.success("Job execution logs copied to clipboard!");
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      message.warning("No job logs available to export");
      return;
    }

    const exportData = filteredLogs.map((j, idx) => ({
      "#": idx + 1,
      "Job ID": j.id,
      "Job Name": j.job_name,
      Status: j.status,
      "Execution Time (ms)": j.execution_time,
      "Memory Used": j.memory_used || "-",
      "Trigger Source": j.trigger_source || "-",
      Details: j.details,
      "Executed At": j.executed_at
        ? new Date(j.executed_at).toLocaleString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Logs");
    XLSX.writeFile(
      workbook,
      `Job_Logs_Export_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    message.success("Excel report downloaded successfully!");
  };

  // Table Columns Definition
  const columns = [
    {
      title: "Job ID",
      dataIndex: "id",
      key: "id",
      width: 125,
      render: (id) => (
        <code
          style={{
            backgroundColor: "#f1f5f9",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#334155",
          }}
        >
          {id}
        </code>
      ),
    },
    {
      title: "Job Name",
      dataIndex: "job_name",
      key: "job_name",
      sorter: (a, b) => (a.job_name || "").localeCompare(b.job_name || ""),
      render: (name) => (
        <span style={{ color: "#2563eb", fontWeight: 600, fontSize: 13.5 }}>
          {name}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        const isSuccess = status?.toLowerCase() === "success";
        return (
          <Tag
            icon={isSuccess ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            color={isSuccess ? "success" : "error"}
            style={{ fontWeight: 700 }}
          >
            {status || "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Execution Time",
      dataIndex: "execution_time",
      key: "execution_time",
      sorter: (a, b) => (a.execution_time || 0) - (b.execution_time || 0),
      render: (time) => (
        <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>
          {time || 0} ms
        </span>
      ),
    },
    {
      title: "Details & Target",
      dataIndex: "details",
      key: "details",
      render: (details) => (
        <span
          style={{
            fontSize: 13,
            color: "#64748b",
            display: "inline-block",
            maxWidth: 340,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={details}
        >
          {details || "-"}
        </span>
      ),
    },
    {
      title: "Executed At",
      dataIndex: "executed_at",
      key: "executed_at",
      sorter: (a, b) => new Date(a.executed_at) - new Date(b.executed_at),
      render: (date) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>
          {date ? new Date(date).toLocaleString() : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Tooltip title="Click (i) to view full job execution log & terminal trace">
          <button
            onClick={() => handleOpenInspector(record)}
            className={styles.infoBtn}
          >
            <Info size={16} />
          </button>
        </Tooltip>
      ),
    },
  ];

  // Stats Counters
  const totalCount = logs.length;
  const successCount = logs.filter(
    (j) => j.status?.toLowerCase() === "success",
  ).length;
  const failedCount = totalCount - successCount;

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>System Job & Worker Logs</h1>
          <p className={styles.headerSubtitle}>
            Track background cron tasks, queue workers, data pipelines, and execution performance.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            style={{ borderRadius: 6, fontWeight: 500 }}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapperBlue}>
            <Activity size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Total Job Runs</span>
            <h2 className={styles.statValue}>{totalCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperGreen}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Successful Jobs</span>
            <h2 className={styles.statValue}>{successCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperRed}>
            <XCircle size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Failed Jobs</span>
            <h2 className={styles.statValue}>{failedCount}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className={styles.toolbarCard}>
        <div className={styles.filterGroup}>
          <Input
            placeholder="Search by job ID, job name, or execution details..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 340, borderRadius: 6 }}
            size="middle"
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="SUCCESS">Success Only</Option>
            <Option value="FAILED">Failed Only</Option>
          </Select>
        </div>

        <div className={styles.resultsCount}>
          Showing <b>{filteredLogs.length}</b> of <b>{logs.length}</b> job logs
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className={styles.card}>
        <div className={styles.tableContainer}>
          {loading ? (
            <div style={{ padding: 24, background: "#ffffff", borderRadius: 12 }}>
              <Skeleton active avatar paragraph={{ rows: 7 }} />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredLogs}
              rowKey={(record) => record.id}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} jobs`,
              }}
            />
          )}
        </div>
      </div>

      {/* FULL JOB INSPECTOR DRAWER (OPENED BY CLICKING (i) ICON) */}
      <Drawer
        title={
          selectedJob ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Activity color="#2563eb" size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  Job Trace - {selectedJob.job_name}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {selectedJob.id} • {selectedJob.execution_time} ms
                </div>
              </div>
            </div>
          ) : (
            "Job Execution Details"
          )
        }
        placement="right"
        width="45%"
        styles={{ header: { flexDirection: "row-reverse" } }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedJob && (
          <div>
            {/* Overview Grid */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Cpu size={16} color="#6366f1" /> Execution Profile
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Job Status</span>
                  <span className={styles.detailValue}>
                    <Tag
                      color={
                        selectedJob.status?.toLowerCase() === "success"
                          ? "success"
                          : "error"
                      }
                      style={{ fontWeight: 700 }}
                    >
                      {selectedJob.status}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Execution Duration</span>
                  <span className={styles.detailValue}>
                    {selectedJob.execution_time} ms
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Memory Usage</span>
                  <span className={styles.detailValue}>
                    {selectedJob.memory_used || "45 MB"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Trigger Source</span>
                  <span className={styles.detailValue}>
                    {selectedJob.trigger_source || "Cron Scheduler"}
                  </span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.detailLabel}>Details Summary</span>
                  <span className={styles.detailValue}>
                    {selectedJob.details || "-"}
                  </span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.detailLabel}>Executed At</span>
                  <span className={styles.detailValue}>
                    {new Date(selectedJob.executed_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal Output Log */}
            <div className={styles.drawerSection}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div className={styles.drawerSectionTitle} style={{ margin: 0 }}>
                  <Terminal size={16} color="#6366f1" /> Worker Output Terminal Trace
                </div>
                <Button
                  size="small"
                  icon={<Copy size={13} />}
                  onClick={handleCopyLogs}
                  style={{ borderRadius: 6, fontSize: 12 }}
                >
                  Copy Logs
                </Button>
              </div>

              <div className={styles.terminalBox}>
                {selectedJob.output_log}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setDrawerOpen(false)} style={{ borderRadius: 6 }}>
                Close Trace
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
