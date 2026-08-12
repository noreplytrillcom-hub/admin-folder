import {
  DownloadOutlined,
  SendOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Select,
  Skeleton,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  FileCode,
  Globe,
  Info,
  Key,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { sendPartnerWelcomeEmail } from "../../services/emailService";
import { getEmailLogs } from "../../services/emailLogsService";
import styles from "../exceptions/Logs.module.css";

const { Option } = Select;

export default function EmailLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [providerFilter, setProviderFilter] = useState("ALL");

  // Drawer & Modal State
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Form for Test Email
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getEmailLogs();
      setLogs(data);
      setLoading(false);
    }, 150);
  };

  // Helper to generate new Email Code
  const generateEmailCode = () => {
    const randomCode = `EML-${Math.floor(10000 + Math.random() * 90000)}`;
    form.setFieldsValue({ emailCode: randomCode });
  };

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    const searchStr = `
      ${log.id || ""} 
      ${log.resend_id || ""} 
      ${log.recipient_email || ""} 
      ${log.partner_name || ""} 
      ${log.contact_person || ""} 
      ${log.email_code || ""}
      ${log.subject || ""}
    `.toLowerCase();

    const matchesSearch = searchStr.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    const matchesProvider =
      providerFilter === "ALL" ||
      (log.provider && log.provider.toLowerCase().includes(providerFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesProvider;
  });

  // Open Drawer
  const handleOpenInspector = (record) => {
    setSelectedLog(record);
    setDrawerOpen(true);
  };

  // Copy Email Code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    message.success(`Copied Email Code "${code}" to clipboard!`);
  };

  // Open Send Test Email Modal
  const handleOpenTestModal = () => {
    form.setFieldsValue({
      toEmail: "zaid@yourtesto.site",
      partnerName: "Apex Testing Suite",
      contactPerson: "Zaid Admin",
      emailCode: `EML-${Math.floor(10000 + Math.random() * 90000)}`,
      product: "AI Testing Engine",
    });
    setTestModalOpen(true);
  };

  // Dispatch Test Email
  const handleSendTestEmail = async (values) => {
    setSendingTest(true);
    message.loading({ content: `Dispatching email via Resend to ${values.toEmail}...`, key: "testEmailKey" });

    try {
      const res = await sendPartnerWelcomeEmail({
        partnerName: values.partnerName,
        contactPerson: values.contactPerson,
        email: values.toEmail,
        emailCode: values.emailCode,
        product: values.product || "AI Testing Engine",
      });

      if (res.success) {
        if (res.resendNote) {
          message.warning({
            content: `Email Dispatched! Note: ${res.resendNote}`,
            key: "testEmailKey",
            duration: 6,
          });
        } else {
          message.success({
            content: `✅ Email dispatched via Resend to ${res.deliveredTo}! (Message ID: ${res.messageId || 'OK'})`,
            key: "testEmailKey",
            duration: 5,
          });
        }
        setTestModalOpen(false);
        fetchLogs();
      } else {
        message.error({
          content: `Failed to send email: ${res.error || "Unknown Error"}`,
          key: "testEmailKey",
          duration: 5,
        });
      }
    } catch (err) {
      message.error({
        content: `Error dispatching email: ${err.message}`,
        key: "testEmailKey",
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Resend Email for a Row Record
  const handleQuickResend = async (record) => {
    message.loading({ content: `Resending email to ${record.recipient_email}...`, key: "resendKey" });
    try {
      const res = await sendPartnerWelcomeEmail({
        partnerName: record.partner_name,
        contactPerson: record.contact_person,
        email: record.recipient_email,
        emailCode: record.email_code,
      });

      if (res.success) {
        message.success({ content: `✅ Resent email to ${res.deliveredTo}!`, key: "resendKey" });
        fetchLogs();
      } else {
        message.error({ content: `Resend failed: ${res.error}`, key: "resendKey" });
      }
    } catch (err) {
      message.error({ content: `Error: ${err.message}`, key: "resendKey" });
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      message.warning("No email log records to export");
      return;
    }

    const exportData = filteredLogs.map((l, idx) => ({
      "#": idx + 1,
      "Log ID": l.id,
      "Resend ID": l.resend_id,
      "Recipient Email": l.recipient_email,
      "Partner Name": l.partner_name,
      "Contact Person": l.contact_person,
      "Email Code": l.email_code,
      Subject: l.subject,
      Status: l.status,
      "Open Count": l.open_count,
      "Last Opened": l.last_opened_at ? new Date(l.last_opened_at).toLocaleString() : "-",
      Provider: l.provider,
      "Sent At": l.sent_at ? new Date(l.sent_at).toLocaleString() : "-",
      "Delivery Details": l.delivery_details,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Email Logs");
    XLSX.writeFile(
      workbook,
      `Email_Dispatch_Logs_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    message.success("Downloaded Email Logs Excel report!");
  };

  // Table Columns
  const columns = [
    {
      title: "Log ID / Resend ID",
      key: "id",
      width: 160,
      render: (_, record) => (
        <div>
          <code
            style={{
              backgroundColor: "#f1f5f9",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            {record.id}
          </code>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginTop: 2 }}>
            {record.resend_id.substring(0, 16)}...
          </div>
        </div>
      ),
    },
    {
      title: "Recipient / Partner",
      key: "recipient",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>
            {record.recipient_email}
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            {record.partner_name} ({record.contact_person})
          </div>
        </div>
      ),
    },
    {
      title: "Email Code",
      dataIndex: "email_code",
      key: "email_code",
      width: 140,
      render: (code) => (
        <span
          onClick={() => handleCopyCode(code)}
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 700,
            color: "#683fe4",
            backgroundColor: "#e0e7ff",
            border: "1px solid #c7d2fe",
            padding: "3px 8px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
          title="Click to copy Email Code"
        >
          <Key size={11} /> {code}
        </span>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <span className={styles.errorMessage} title={subject} style={{ color: "#334155" }}>
          {subject}
        </span>
      ),
    },
    {
      title: "Delivery Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      filters: [
        { text: "Delivered", value: "Delivered" },
        { text: "Opened", value: "Opened" },
        { text: "Testing Reroute", value: "Testing Reroute" },
        { text: "Bounced", value: "Bounced" },
      ],
      onFilter: (val, record) => record.status === val,
      render: (status) => {
        let color = "success";
        let icon = <CheckCircle2 size={12} />;

        if (status === "Opened") {
          color = "processing";
          icon = <Eye size={12} />;
        } else if (status === "Testing Reroute") {
          color = "warning";
          icon = <RefreshCw size={12} />;
        } else if (status === "Bounced") {
          color = "error";
          icon = <AlertTriangle size={12} />;
        }

        return (
          <Tag color={color} style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
            {icon} {status}
          </Tag>
        );
      },
    },
    {
      title: "Opens",
      dataIndex: "open_count",
      key: "open_count",
      width: 80,
      render: (count) => (
        <span style={{ fontSize: 13, fontWeight: 600, color: count > 0 ? "#10b981" : "#94a3b8" }}>
          {count > 0 ? `👁️ ${count}` : "0"}
        </span>
      ),
    },
    {
      title: "Timestamp",
      dataIndex: "sent_at",
      key: "sent_at",
      sorter: (a, b) => new Date(a.sent_at) - new Date(b.sent_at),
      render: (date) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>
          {date ? new Date(date).toLocaleString() : "-"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
          <Tooltip title="Resend email to recipient">
            <Button
              size="small"
              icon={<SendOutlined />}
              onClick={() => handleQuickResend(record)}
              style={{ borderRadius: 6, fontSize: 12 }}
            >
              Resend
            </Button>
          </Tooltip>

          <Tooltip title="View full email preview & Resend API telemetry">
            <button onClick={() => handleOpenInspector(record)} className={styles.infoBtn}>
              <Info size={16} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Stats Counters
  const totalSent = logs.length;
  const deliveredCount = logs.filter((l) => l.status === "Delivered" || l.status === "Opened").length;
  const openedCount = logs.filter((l) => l.status === "Opened" || l.open_count > 0).length;
  const bouncedCount = logs.filter((l) => l.status === "Bounced").length;
  const testingRerouteCount = logs.filter((l) => l.status === "Testing Reroute").length;

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Resend Email & Verification Code Logs</h1>
          <p className={styles.headerSubtitle}>
            Track real-time partner welcome email dispatches, verification codes, open rates, and test email sending.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleOpenTestModal}
            style={{ borderRadius: 6, fontWeight: 600, background: "linear-gradient(135deg, #7952F5, #683fe4)" }}
          >
            Send Test Email
          </Button>

          <Button
            icon={<SyncOutlined />}
            onClick={fetchLogs}
            style={{ borderRadius: 6, fontWeight: 500 }}
          >
            Refresh
          </Button>

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
          <div className={styles.iconWrapperIndigo}>
            <Mail size={20} color="#7952F5" />
          </div>
          <div>
            <span className={styles.statLabel}>Total Dispatched Emails</span>
            <h2 className={styles.statValue}>{totalSent}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperGreen}>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div>
            <span className={styles.statLabel}>Delivered Rate</span>
            <h2 className={styles.statValue}>
              {totalSent > 0 ? Math.round((deliveredCount / totalSent) * 100) : 100}%
            </h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperBlue}>
            <Eye size={20} color="#9B7BFA" />
          </div>
          <div>
            <span className={styles.statLabel}>Opened Emails</span>
            <h2 className={styles.statValue}>{openedCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperAmber}>
            <RefreshCw size={20} color="#f59e0b" />
          </div>
          <div>
            <span className={styles.statLabel}>Testing Mode Reroutes</span>
            <h2 className={styles.statValue}>{testingRerouteCount}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className={styles.toolbarCard}>
        <div className={styles.filterGroup}>
          <Input
            placeholder="Search email, partner, email code, Resend ID..."
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
            style={{ width: 170 }}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Opened">Opened</Option>
            <Option value="Testing Reroute">Testing Reroute</Option>
            <Option value="Bounced">Bounced</Option>
          </Select>
        </div>

        <div className={styles.resultsCount}>
          Showing <b>{filteredLogs.length}</b> of <b>{logs.length}</b> email records
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
                  `${range[0]}-${range[1]} of ${total} email logs`,
              }}
            />
          )}
        </div>
      </div>

      {/* SEND TEST EMAIL MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 700 }}>
            <Mail size={20} color="#7952F5" /> Send Test Welcome & Verification Email
          </div>
        }
        open={testModalOpen}
        onCancel={() => setTestModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendTestEmail}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="To Email Address (Recipient)"
            name="toEmail"
            rules={[{ required: true, message: "Please enter destination email" }]}
            extra="In Resend testing mode (onboarding@resend.dev), emails to zaid@yourtesto.site are delivered immediately to your inbox."
          >
            <Input prefix={<Mail size={15} color="#94a3b8" />} placeholder="zaid@yourtesto.site" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item
              label="Partner Company Name"
              name="partnerName"
              rules={[{ required: true, message: "Please enter partner name" }]}
            >
              <Input placeholder="Acme Cloud Systems" />
            </Form.Item>

            <Form.Item
              label="Contact Person Name"
              name="contactPerson"
              rules={[{ required: true, message: "Please enter contact person" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </div>

          <Form.Item label="Partner Email Verification Code" name="emailCode">
            <Input
              addonAfter={
                <Button size="small" type="link" onClick={generateEmailCode}>
                  Auto Generate
                </Button>
              }
              placeholder="EML-89410"
            />
          </Form.Item>

          <Form.Item label="Product Suite" name="product">
            <Input placeholder="AI Testing Engine & Quality Portal" />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <Button onClick={() => setTestModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={sendingTest}
              icon={<SendOutlined />}
              style={{ background: "linear-gradient(135deg, #7952F5, #683fe4)" }}
            >
              Send Test Email Now
            </Button>
          </div>
        </Form>
      </Modal>

      {/* EMAIL INSPECTOR DRAWER */}
      <Drawer
        title={
          selectedLog ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mail color="#7952F5" size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  Email Dispatch - {selectedLog.id}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  To {selectedLog.recipient_email} • Code {selectedLog.email_code}
                </div>
              </div>
            </div>
          ) : (
            "Email Details"
          )
        }
        placement="right"
        width="48%"
        styles={{ header: { flexDirection: "row-reverse" } }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedLog && (
          <div>
            {/* Delivery Banner */}
            <div className={styles.drawerSection}>
              <div
                style={{
                  backgroundColor:
                    selectedLog.status === "Bounced"
                      ? "rgba(239, 68, 68, 0.1)"
                      : selectedLog.status === "Testing Reroute"
                      ? "rgba(245, 158, 11, 0.1)"
                      : "rgba(16, 185, 129, 0.1)",
                  border: `1px solid ${
                    selectedLog.status === "Bounced"
                      ? "rgba(239, 68, 68, 0.3)"
                      : selectedLog.status === "Testing Reroute"
                      ? "rgba(245, 158, 11, 0.3)"
                      : "rgba(16, 185, 129, 0.3)"
                  }`,
                  color:
                    selectedLog.status === "Bounced"
                      ? "#dc2626"
                      : selectedLog.status === "Testing Reroute"
                      ? "#d97706"
                      : "#059669",
                  padding: "14px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {selectedLog.status === "Bounced" ? (
                  <AlertTriangle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <div>
                  <div>Status: {selectedLog.status}</div>
                  <div style={{ fontSize: 12, fontWeight: 400, marginTop: 2 }}>
                    {selectedLog.delivery_details}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Metadata */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Globe size={16} color="#7952F5" /> Resend Telemetry & Header Info
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Recipient Email</span>
                  <span className={styles.detailValue}>
                    <strong>{selectedLog.recipient_email}</strong>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Partner Company</span>
                  <span className={styles.detailValue}>{selectedLog.partner_name}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Verification Code</span>
                  <span className={styles.detailValue}>
                    <code className={styles.apiKeyCode}>{selectedLog.email_code}</code>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Resend Message ID</span>
                  <span className={styles.detailValue} style={{ fontFamily: "monospace", fontSize: 11 }}>
                    {selectedLog.resend_id}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dispatch Provider</span>
                  <span className={styles.detailValue}>
                    <Tag color="purple">{selectedLog.provider}</Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Sent Timestamp</span>
                  <span className={styles.detailValue}>
                    {new Date(selectedLog.sent_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject & HTML Template Preview Box */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <FileCode size={16} color="#7952F5" /> Email Template Preview
              </div>
              <div
                style={{
                  background: "#0f172a",
                  color: "#f8fafc",
                  padding: 16,
                  borderRadius: 12,
                  fontFamily: "sans-serif",
                  fontSize: 13,
                  border: "1px solid #1e293b",
                }}
              >
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, borderBottom: "1px solid #334155", paddingBottom: 6 }}>
                  <strong>Subject:</strong> {selectedLog.subject}
                </div>
                <div style={{ background: "#1e293b", padding: 16, borderRadius: 8, marginTop: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#D1B9FE", marginBottom: 6 }}>
                    Welcome to Testo Partner Network!
                  </div>
                  <p style={{ margin: "4px 0 12px 0", color: "#cbd5e1" }}>
                    Dear {selectedLog.contact_person}, your partner account for <strong>{selectedLog.partner_name}</strong> has been registered.
                  </p>
                  <div style={{ background: "rgba(99,102,241,0.2)", padding: 12, borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#D1B9FE", textTransform: "uppercase", fontWeight: 700 }}>
                      Partner Email Verification Code
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#38bdf8", fontFamily: "monospace" }}>
                      {selectedLog.email_code}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button
                icon={<SendOutlined />}
                onClick={() => handleQuickResend(selectedLog)}
              >
                Resend This Email
              </Button>
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
