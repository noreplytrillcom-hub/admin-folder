import {
  DownloadOutlined,
  InfoCircleOutlined,
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
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileCode,
  Globe,
  Info,
  ShieldAlert,
  Terminal,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../supabase/client";
import styles from "./Logs.module.css";

const { Option } = Select;

// Rich Dummy Error Logs Fallback
const DUMMY_ERROR_LOGS = [
  {
    id: "ERR-9401",
    user_id: "usr_882910",
    error_message:
      "500 Internal Server Error: Supabase DB connection pool exhausted",
    request_url: "/api/v1/partners/sync-contracts",
    request_method: "POST",
    status_code: 500,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    client_ip: "192.168.1.104",
    stack_trace: `Error: Supabase DB connection pool exhausted
    at Pool.connect (/app/node_modules/@supabase/pg-pool/index.js:42:15)
    at async syncAuthUsersToAllowed (/app/sync.js:21:28)
    at async Router.handle (/app/routes/api.js:104:9)
    at Process.processTicksAndRejections (node:internal/process/task_queues:95:5)`,
  },
  {
    id: "ERR-9402",
    user_id: "usr_491029",
    error_message:
      "401 Unauthorized: Invalid JWT signature or expired auth session",
    request_url: "/api/v1/auth/verify-session",
    request_method: "GET",
    status_code: 401,
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
    client_ip: "86.142.90.12",
    stack_trace: `JsonWebTokenError: invalid signature
    at verify (/app/node_modules/jsonwebtoken/verify.js:133:19)
    at authMiddleware (/app/middleware/auth.js:28:12)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)`,
  },
  {
    id: "ERR-9403",
    user_id: "usr_102948",
    error_message:
      "404 Not Found: Endpoint /api/v2/clients/export-pdf does not exist",
    request_url: "/api/v2/clients/export-pdf",
    request_method: "GET",
    status_code: 404,
    created_at: new Date(Date.now() - 42 * 60000).toISOString(),
    client_ip: "172.16.0.45",
    stack_trace: `NotFoundError: Cannot GET /api/v2/clients/export-pdf
    at app.use (/app/server.js:88:14)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)`,
  },
  {
    id: "ERR-9404",
    user_id: "usr_391024",
    error_message:
      "503 Service Unavailable: Stripe Payment Gateway handshake timeout",
    request_url: "/api/v1/billing/checkout-stripe",
    request_method: "POST",
    status_code: 503,
    created_at: new Date(Date.now() - 110 * 60000).toISOString(),
    client_ip: "198.51.100.77",
    stack_trace: `FetchError: network timeout at https://api.stripe.com/v1/payment_intents
    at Timeout._onTimeout (/app/node_modules/node-fetch/index.js:84:13)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7)`,
  },
  {
    id: "ERR-9405",
    user_id: "usr_771029",
    error_message:
      "422 Unprocessable Entity: Invalid partner VAT registration schema",
    request_url: "/api/v1/partners/register",
    request_method: "PUT",
    status_code: 422,
    created_at: new Date(Date.now() - 240 * 60000).toISOString(),
    client_ip: "203.0.113.19",
    stack_trace: `ValidationError: "vat_number" fails pattern matching /^GB[0-9]{9}$/
    at Object.validate (/app/validators/partner.js:45:11)
    at registerPartner (/app/controllers/partners.js:62:9)`,
  },
  {
    id: "ERR-9406",
    user_id: "usr_551928",
    error_message:
      "502 Bad Gateway: Upstream AWS Lambda service execution failed",
    request_url: "/api/v1/reports/monthly-pdf",
    request_method: "POST",
    status_code: 502,
    created_at: new Date(Date.now() - 360 * 60000).toISOString(),
    client_ip: "192.0.2.14",
    stack_trace: `BadGatewayError: Lambda function returned 502 Task Timed Out
    at AWS.Request.<anonymous> (/app/services/aws.js:94:18)
    at Request.callListeners (/app/node_modules/aws-sdk/lib/sequential_executor.js:106:20)`,
  },
];

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Exception Inspector Drawer
  const [selectedError, setSelectedError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchErrorLogs();
  }, []);

  // Fetch error logs from Supabase with fallback to rich dummy data
  const fetchErrorLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ErrorLogs")
        .select("*")
        .order("CreatedAt", { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        setLogs(DUMMY_ERROR_LOGS);
      } else {
        const formattedData = data.map((item) => ({
          id: item.Id || item.id || `ERR-${Math.floor(Math.random() * 9000 + 1000)}`,
          user_id: item.UserId || item.user_id || "usr_guest",
          error_message: item.ErrorMessage || item.error_message || "Unknown Exception",
          request_url: item.RequestUrl || item.request_url || "/api/unknown",
          request_method: item.RequestMethod || item.request_method || "POST",
          status_code: item.StatusCode || item.status_code || 500,
          created_at: item.CreatedAt || item.created_at || new Date().toISOString(),
          client_ip: item.ClientIp || item.client_ip || "127.0.0.1",
          stack_trace: item.StackTrace || item.stack_trace || `Error: ${item.ErrorMessage || "System exception"}\n    at processHandler (/app/server.js:45:10)`,
        }));
        setLogs(formattedData);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs(DUMMY_ERROR_LOGS);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    const searchStr = `
      ${log.id || ""} 
      ${log.user_id || ""} 
      ${log.error_message || ""} 
      ${log.request_url || ""} 
      ${log.status_code || ""}
    `.toLowerCase();

    const matchesSearch = searchStr.includes(search.toLowerCase());
    const matchesMethod =
      methodFilter === "ALL" || log.request_method === methodFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "500" && log.status_code >= 500) ||
      (statusFilter === "400" && log.status_code >= 400 && log.status_code < 500);

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Handle Open Exception Inspector Drawer
  const handleOpenInspector = (record) => {
    setSelectedError(record);
    setDrawerOpen(true);
  };

  // Copy Stack Trace to Clipboard
  const handleCopyStackTrace = () => {
    if (selectedError?.stack_trace) {
      navigator.clipboard.writeText(selectedError.stack_trace);
      message.success("Exception stack trace copied to clipboard!");
    }
  };

  // Excel Export Handler
  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      message.warning("No error logs available to export");
      return;
    }

    const exportData = filteredLogs.map((l, idx) => ({
      "#": idx + 1,
      "Log ID": l.id,
      "User ID": l.user_id,
      "Error Message": l.error_message,
      Method: l.request_method,
      "Status Code": l.status_code,
      "Request URL": l.request_url,
      "Client IP": l.client_ip,
      Timestamp: l.created_at ? new Date(l.created_at).toLocaleString() : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Error Logs");
    XLSX.writeFile(
      workbook,
      `Error_Logs_Export_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    message.success("Excel report downloaded successfully!");
  };

  // Table Columns Definition
  const columns = [
    {
      title: "Log ID",
      dataIndex: "id",
      key: "id",
      width: 120,
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
      title: "User / IP",
      key: "user_id",
      width: 140,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
            {record.user_id || "Guest"}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            {record.client_ip || "127.0.0.1"}
          </div>
        </div>
      ),
    },
    {
      title: "Error Message",
      dataIndex: "error_message",
      key: "error_message",
      render: (text) => (
        <span className={styles.errorMessage} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: "Request URL",
      dataIndex: "request_url",
      key: "request_url",
      render: (url) => (
        <span style={{ fontSize: 13, color: "#475569", fontFamily: "monospace" }}>
          {url || "-"}
        </span>
      ),
    },
    {
      title: "Method",
      dataIndex: "request_method",
      key: "request_method",
      width: 100,
      render: (method) => {
        let tagColor = "blue";
        if (method === "GET") tagColor = "cyan";
        else if (method === "POST") tagColor = "green";
        else if (method === "PUT") tagColor = "gold";
        else if (method === "DELETE") tagColor = "red";

        return (
          <Tag color={tagColor} style={{ fontWeight: 700 }}>
            {method || "GET"}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status_code",
      key: "status_code",
      width: 90,
      render: (code) => (
        <Tag
          color={code >= 500 ? "error" : "warning"}
          style={{ fontWeight: 700 }}
        >
          {code || 500}
        </Tag>
      ),
    },
    {
      title: "Timestamp",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
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
        <Tooltip title="Click (i) to view full exception stack trace">
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
  const serverErrorCount = logs.filter((l) => l.status_code >= 500).length;
  const clientErrorCount = logs.filter(
    (l) => l.status_code >= 400 && l.status_code < 500,
  ).length;

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>System Error & Exception Logs</h1>
          <p className={styles.headerSubtitle}>
            Monitor, inspect, and diagnose application exceptions, status codes, and stack traces.
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

      {/* METRICS STAT CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapperRed}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Total Error Logs</span>
            <h2 className={styles.statValue}>{totalCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperAmber}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>500 Server Errors</span>
            <h2 className={styles.statValue}>{serverErrorCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperBlue}>
            <Info size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>4xx Client Errors</span>
            <h2 className={styles.statValue}>{clientErrorCount}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className={styles.toolbarCard}>
        <div className={styles.filterGroup}>
          <Input
            placeholder="Search by log ID, user, URL, or error message..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 340, borderRadius: 6 }}
            size="middle"
          />

          <Select
            value={methodFilter}
            onChange={setMethodFilter}
            style={{ width: 150 }}
          >
            <Option value="ALL">All Methods</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 170 }}
          >
            <Option value="ALL">All Error Types</Option>
            <Option value="500">5xx Server Errors</Option>
            <Option value="400">4xx Client Errors</Option>
          </Select>
        </div>

        <div className={styles.resultsCount}>
          Showing <b>{filteredLogs.length}</b> of <b>{logs.length}</b> error logs
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
                  `${range[0]}-${range[1]} of ${total} logs`,
              }}
            />
          )}
        </div>
      </div>

      {/* FULL EXCEPTION INSPECTOR DRAWER (OPENED BY CLICKING (i) ICON) */}
      <Drawer
        title={
          selectedError ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle color="#ef4444" size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  Exception Details - {selectedError.id}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Status Code {selectedError.status_code} • {selectedError.request_method}
                </div>
              </div>
            </div>
          ) : (
            "Exception Details"
          )
        }
        placement="right"
        width="45%"
        styles={{ header: { flexDirection: "row-reverse" } }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedError && (
          <div>
            {/* Error Banner */}
            <div className={styles.drawerSection}>
              <div className={styles.errorTitleBox}>
                <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>{selectedError.error_message}</div>
              </div>
            </div>

            {/* Request & System Meta */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Globe size={16} color="#7952F5" /> Request Metadata
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>HTTP Method</span>
                  <span className={styles.detailValue}>
                    <Tag color="indigo">{selectedError.request_method}</Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status Code</span>
                  <span className={styles.detailValue}>
                    <Tag color={selectedError.status_code >= 500 ? "error" : "warning"}>
                      {selectedError.status_code}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.detailLabel}>Request URL</span>
                  <span className={styles.detailValue} style={{ fontFamily: "monospace" }}>
                    {selectedError.request_url}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Trigger User ID</span>
                  <span className={styles.detailValue}>{selectedError.user_id}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Client IP Address</span>
                  <span className={styles.detailValue}>{selectedError.client_ip}</span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.detailLabel}>Timestamp</span>
                  <span className={styles.detailValue}>
                    {new Date(selectedError.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Stack Trace Box */}
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
                  <FileCode size={16} color="#7952F5" /> Exception Stack Trace
                </div>
                <Button
                  size="small"
                  icon={<Copy size={13} />}
                  onClick={handleCopyStackTrace}
                  style={{ borderRadius: 6, fontSize: 12 }}
                >
                  Copy Stacktrace
                </Button>
              </div>

              <div className={styles.stackTraceBox}>
                {selectedError.stack_trace}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setDrawerOpen(false)} style={{ borderRadius: 6 }}>
                Close Inspector
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
