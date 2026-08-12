import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Mail,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Clients.module.css";

const { Option } = Select;

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // View Details Drawer
  const [selectedClient, setSelectedClient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch all clients joined with partner company details
  async function fetchClients() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select(
          `
          *,
          partners (
            id,
            company_name
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      message.error(err.message || "Failed to load client records");
    } finally {
      setLoading(false);
    }
  }

  // Filter Logic
  const filteredClients = clients.filter((u) => {
    const partnerName = u.partners?.company_name || "Individual User";

    // Format 6-digit numeric System User ID for search matching
    const numericId =
      typeof u.id === "number"
        ? u.id
        : Math.abs(
            u.id
              .toString()
              .split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0) * 12345,
          )
            .toString()
            .slice(0, 6);

    const searchString = `
      ${numericId} 
      ${u.id || ""} 
      ${u.first_name || ""} 
      ${u.last_name || ""} 
      ${u.email || ""} 
      ${u.user_type || ""} 
      ${partnerName}
    `.toLowerCase();

    const matchesSearch = searchString.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.is_active) ||
      (statusFilter === "INACTIVE" && !u.is_active);

    const matchesCategory =
      categoryFilter === "ALL" ||
      (categoryFilter === "PARTNER" && Boolean(u.partners?.company_name)) ||
      (categoryFilter === "INDIVIDUAL" && !u.partners?.company_name);

    const matchesRole =
      roleFilter === "ALL" || (u.user_type || "Client") === roleFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesRole;
  });

  // Helper function to copy full System-generated ID
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    message.success("System User ID copied to clipboard!");
  };

  // Toggle Active / Inactive Status or Delete Client
  const handleDeleteClient = async (id) => {
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;

      message.success("Client record deleted successfully");
      fetchClients();
    } catch (err) {
      console.error("Error deleting client:", err);
      message.error(err.message || "Failed to delete client");
    }
  };

  // Excel Export Handler
  const handleExportExcel = () => {
    if (filteredClients.length === 0) {
      message.warning("No client data available to export");
      return;
    }

    const exportData = filteredClients.map((u, idx) => ({
      "#": idx + 1,
      "System User ID": u.id,
      Name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "-",
      Email: u.email || "-",
      "User Type": u.user_type || "Client",
      "Partner / Company": u.partners?.company_name || "Individual User",
      "Active Status": u.is_active ? "Active" : "Inactive",
      "Created Date": u.created_at
        ? new Date(u.created_at).toLocaleDateString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Database Clients");
    XLSX.writeFile(
      workbook,
      `Database_Clients_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    message.success("Excel downloaded successfully!");
  };

  // Open Details Drawer
  const handleViewDetails = (record) => {
    setSelectedClient(record);
    setDrawerOpen(true);
  };

  // Table Columns Definition
  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (id) => {
        const numericId =
          typeof id === "number"
            ? id
            : Math.abs(
                id
                  .toString()
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0) * 12345,
              )
                .toString()
                .slice(0, 6);

        return (
          <Space size="small">
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
              #{numericId}
            </code>
            <Tooltip title="Copy ID">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined style={{ color: "#94a3b8" }} />}
                onClick={() => handleCopyId(numericId)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Client Name",
      key: "name",
      sorter: (a, b) =>
        `${a.first_name || ""} ${a.last_name || ""}`.localeCompare(
          `${b.first_name || ""} ${b.last_name || ""}`,
        ),
      render: (_, record) => {
        const name = `${record.first_name || ""} ${record.last_name || ""}`.trim() || "Unnamed User";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <Link
              to={`/admin/users/edit/${record.id}`}
              style={{
                color: "#7952F5",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {name}
            </Link>
          </div>
        );
      },
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span style={{ fontSize: 13, color: "#475569" }}>{email || "-"}</span>
      ),
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (type) => (
        <Tag
          color={type === "Admin" ? "purple" : "blue"}
          style={{ fontWeight: 600 }}
        >
          {type || "Client"}
        </Tag>
      ),
    },
    {
      title: "Partner / Company",
      key: "partner_name",
      render: (_, record) => {
        const companyName = record.partners?.company_name;
        return companyName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Building2 size={14} color="#7952F5" />
            <span style={{ fontWeight: 500, color: "#1e293b" }}>
              {companyName}
            </span>
          </div>
        ) : (
          <Tag color="orange" style={{ fontWeight: 500 }}>
            Individual User
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag
          color={isActive ? "green" : "red"}
          style={{ fontWeight: 600 }}
        >
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>
          {date ? new Date(date).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Client Details">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#7952F5" }} />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Client">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#7952F5" }} />}
              onClick={() => navigate(`/admin/users/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete Client">
            <Popconfirm
              title="Delete Client Record?"
              description="Are you sure you want to delete this client record?"
              onConfirm={() => handleDeleteClient(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ color: "#ef4444" }} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Stats Counters
  const totalCount = clients.length;
  const activeCount = clients.filter((c) => c.is_active).length;
  const partnerCount = clients.filter((c) => Boolean(c.partners?.company_name)).length;
  const individualCount = totalCount - partnerCount;

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Clients Management</h1>
          <p className={styles.headerSubtitle}>
            View, manage, filter, and export database client accounts and company assignments.
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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/users/create")}
            style={{
              backgroundColor: "#0f172a",
              borderColor: "#0f172a",
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            Add Client
          </Button>
        </div>
      </div>

      {/* METRIC / KPI CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapperBlue}>
            <Users color="#7952F5" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Total Clients</span>
            <h2 className={styles.statValue}>{totalCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperGreen}>
            <UserCheck color="#10b981" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Active Accounts</span>
            <h2 className={styles.statValue}>{activeCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperIndigo}>
            <Building2 color="#7952F5" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Partner Companies</span>
            <h2 className={styles.statValue}>{partnerCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperOrange}>
            <UserPlus color="#f97316" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Individual Users</span>
            <h2 className={styles.statValue}>{individualCount}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className={styles.toolbarCard}>
        <div className={styles.filterGroup}>
          <Input
            placeholder="Search by ID, name, email, partner company..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 320, borderRadius: 6 }}
            size="middle"
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="ACTIVE">Active Only</Option>
            <Option value="INACTIVE">Inactive Only</Option>
          </Select>

          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 180 }}
          >
            <Option value="ALL">All Categories</Option>
            <Option value="PARTNER">Partner Assigned</Option>
            <Option value="INDIVIDUAL">Individual User</Option>
          </Select>

          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 150 }}
          >
            <Option value="ALL">All Roles</Option>
            <Option value="Client">Client</Option>
            <Option value="Admin">Admin</Option>
          </Select>
        </div>

        <div className={styles.resultsCount}>
          Showing <b>{filteredClients.length}</b> of <b>{clients.length}</b> clients
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 24, background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <Skeleton active avatar paragraph={{ rows: 7 }} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredClients}
            rowKey={(record) => record.id}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} clients`,
            }}
          />
        )}
      </div>

      {/* VIEW DETAILS DRAWER */}
      <Drawer
        title={
          selectedClient ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Users color="#7952F5" size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {`${selectedClient.first_name || ""} ${selectedClient.last_name || ""}`.trim() || "Client Details"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {selectedClient.user_type || "Client"} • {selectedClient.email}
                </div>
              </div>
            </div>
          ) : (
            "Client Details"
          )
        }
        placement="right"
        width="45%"
        styles={{ header: { flexDirection: "row-reverse" } }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedClient && (
          <div>
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <ShieldCheck size={16} color="#7952F5" /> Account Overview
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>First Name</span>
                  <span className={styles.detailValue}>
                    {selectedClient.first_name || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Name</span>
                  <span className={styles.detailValue}>
                    {selectedClient.last_name || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email Address</span>
                  <span className={styles.detailValue}>
                    {selectedClient.email || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>User Role</span>
                  <span className={styles.detailValue}>
                    <Tag color={selectedClient.user_type === "Admin" ? "purple" : "blue"}>
                      {selectedClient.user_type || "Client"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Account Status</span>
                  <span className={styles.detailValue}>
                    <Tag color={selectedClient.is_active ? "green" : "red"}>
                      {selectedClient.is_active ? "Active" : "Inactive"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created Date</span>
                  <span className={styles.detailValue}>
                    {selectedClient.created_at
                      ? new Date(selectedClient.created_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Building2 size={16} color="#7952F5" /> Organization Assignment
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.detailLabel}>Partner / Company</span>
                  <span className={styles.detailValue}>
                    {selectedClient.partners?.company_name ? (
                      <Tag color="indigo" style={{ fontSize: 13, padding: "4px 10px" }}>
                        {selectedClient.partners.company_name}
                      </Tag>
                    ) : (
                      <Tag color="orange">Individual User (No Partner)</Tag>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setDrawerOpen(false);
                  navigate(`/admin/users/edit/${selectedClient.id}`);
                }}
                style={{ backgroundColor: "#7952F5", borderRadius: 6 }}
              >
                Edit Client Profile
              </Button>
              <Button
                onClick={() => setDrawerOpen(false)}
                style={{ borderRadius: 6 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
