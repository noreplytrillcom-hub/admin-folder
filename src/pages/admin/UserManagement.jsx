import {
  AppstoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Drawer,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  AppWindow,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Grid,
  ListFilter,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabaseClient";
import styles from "./UserManagement.module.css";

const { Option } = Select;

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & View Mode
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // View Details Drawer
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch admin_users records from Supabase
  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      message.error(err.message || "Failed to load system users");
    } finally {
      setLoading(false);
    }
  }

  // Get unique departments for filter dropdown
  const departmentsList = Array.from(
    new Set(users.map((u) => u.department).filter(Boolean)),
  );

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const searchString = `
      ${u.first_name || ""} 
      ${u.last_name || ""} 
      ${u.email || ""} 
      ${u.department || ""} 
      ${u.designation || ""}
    `.toLowerCase();

    const matchesSearch = searchString.includes(search.toLowerCase());
    const matchesDept = deptFilter === "ALL" || u.department === deptFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.is_active) ||
      (statusFilter === "INACTIVE" && !u.is_active);

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Handle Export to Excel
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      message.warning("No user records available to export");
      return;
    }

    const exportData = filteredUsers.map((u, index) => ({
      "#": index + 1,
      Name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "-",
      Email: u.email || "-",
      Department: u.department || "-",
      Designation: u.designation || "-",
      "Active Status": u.is_active ? "Active" : "Inactive",
      "Created Date": u.created_at
        ? new Date(u.created_at).toLocaleDateString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Testo Users");
    XLSX.writeFile(
      workbook,
      `Testo_Users_Directory_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    message.success("Excel report downloaded successfully!");
  };

  // Delete User Action
  const handleDeleteUser = async (id) => {
    try {
      const { error } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      message.success("User record deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      message.error(err.message || "Failed to delete user");
    }
  };

  // Open Details Drawer
  const handleViewUser = (record) => {
    setSelectedUser(record);
    setDrawerOpen(true);
  };

  // Ant Design Table Columns
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => (
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "User Profile",
      key: "name",
      sorter: (a, b) =>
        `${a.first_name || ""} ${a.last_name || ""}`.localeCompare(
          `${b.first_name || ""} ${b.last_name || ""}`,
        ),
      render: (_, record) => {
        const fullName =
          `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
          "User";

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7952F5 0%, #683fe4 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)",
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <Link
                to={`/admin/users/edit/${record.id}`}
                style={{
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {fullName}
              </Link>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {record.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (dept) =>
        dept ? (
          <Tag color="indigo" style={{ fontWeight: 600, borderRadius: 4 }}>
            {dept}
          </Tag>
        ) : (
          <span style={{ color: "#94a3b8" }}>-</span>
        ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (desig) => (
        <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>
          {desig || "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag
          color={isActive ? "green" : "red"}
          style={{ fontWeight: 600, borderRadius: 4 }}
        >
          {isActive ? "Active Staff" : "Inactive"}
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
          <Tooltip title="View User Profile">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#7952F5" }} />}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#7952F5" }} />}
              onClick={() => navigate(`/admin/users/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Delete User Account?"
              description="Are you sure you want to delete this system user?"
              onConfirm={() => handleDeleteUser(record.id)}
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
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.is_active).length;
  const totalDepts = departmentsList.length;

  return (
    <div className={styles.container}>
      {/* UNIQUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroBannerPattern} />

        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            <Users size={24} /> Testo User Directory
          </h1>
          <p className={styles.heroSubtitle}>
            System administration team members, department staff, and access management.
          </p>
        </div>

        <div className={styles.heroActions}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            style={{
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.25)",
            }}
          >
            Export Excel
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/users/create")}
            style={{
              backgroundColor: "#7952F5",
              borderColor: "#7952F5",
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
            }}
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* METRIC / KPI STAT CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapperIndigo}>
            <Users size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Total System Users</span>
            <h2 className={styles.statValue}>{totalCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperGreen}>
            <UserCheck size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Active Team Staff</span>
            <h2 className={styles.statValue}>{activeCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperPurple}>
            <Building size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Departments</span>
            <h2 className={styles.statValue}>{totalDepts}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR, FILTERS & VIEW MODE SWITCHER */}
      <div className={styles.toolbarCard}>
        <div className={styles.filterGroup}>
          <Input
            placeholder="Search by name, email, department, designation..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 340, borderRadius: 8 }}
            size="middle"
          />

          <Select
            value={deptFilter}
            onChange={setDeptFilter}
            style={{ width: 180 }}
          >
            <Option value="ALL">All Departments</Option>
            {departmentsList.map((d) => (
              <Option key={d} value={d}>
                {d}
              </Option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="ACTIVE">Active Staff</Option>
            <Option value="INACTIVE">Inactive Staff</Option>
          </Select>
        </div>

        {/* VIEW MODE TOGGLE (TABLE / CARDS GRID) */}
        <div className={styles.viewModeGroup}>
          <button
            onClick={() => setViewMode("table")}
            className={`${styles.viewModeBtn} ${
              viewMode === "table" ? styles.viewModeBtnActive : ""
            }`}
          >
            <ListFilter size={15} /> Table View
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`${styles.viewModeBtn} ${
              viewMode === "grid" ? styles.viewModeBtnActive : ""
            }`}
          >
            <Grid size={15} /> Team Cards View
          </button>
        </div>
      </div>

      {/* DUAL VIEW RENDERING: TABLE VS TEAM CARDS */}
      {loading ? (
        <div style={{ padding: 24, background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <Skeleton active avatar paragraph={{ rows: 7 }} />
        </div>
      ) : viewMode === "table" ? (
        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey={(record) => record.id}
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
          />
        </div>
      ) : (
        <div className={styles.userCardsGrid}>
          {filteredUsers.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: 40,
                color: "#94a3b8",
                backgroundColor: "#ffffff",
                borderRadius: 12,
              }}
            >
              No user records match your search criteria.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const fullName =
                `${u.first_name || ""} ${u.last_name || ""}`.trim() || "User";
              return (
                <div key={u.id} className={styles.userCard}>
                  <div className={styles.userCardHeader}>
                    <div className={styles.userAvatar}>
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={styles.userName}>{fullName}</h3>
                      <p className={styles.userEmail}>{u.email || "-"}</p>
                    </div>
                  </div>

                  <div className={styles.userCardMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Department:</span>
                      <span className={styles.metaValue}>
                        {u.department || "-"}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Designation:</span>
                      <span className={styles.metaValue}>
                        {u.designation || "-"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.userCardFooter}>
                    <Tag color={u.is_active ? "green" : "red"}>
                      {u.is_active ? "Active Staff" : "Inactive"}
                    </Tag>

                    <Space size="small">
                      <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined style={{ color: "#7952F5" }} />}
                        onClick={() => handleViewUser(u)}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined style={{ color: "#7952F5" }} />}
                        onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                      />
                    </Space>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW DETAILS DRAWER */}
      <Drawer
        title={
          selectedUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Users color="#7952F5" size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {`${selectedUser.first_name || ""} ${selectedUser.last_name || ""}`.trim() || "User Details"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {selectedUser.email}
                </div>
              </div>
            </div>
          ) : (
            "User Profile Details"
          )
        }
        placement="right"
        width="45%"
        styles={{ header: { flexDirection: "row-reverse" } }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedUser && (
          <div>
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <ShieldCheck size={16} color="#7952F5" /> Account Overview
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>First Name</span>
                  <span className={styles.detailValue}>
                    {selectedUser.first_name || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Name</span>
                  <span className={styles.detailValue}>
                    {selectedUser.last_name || "-"}
                  </span>
                </div>
                <div
                  className={styles.detailItem}
                  style={{ gridColumn: "span 2" }}
                >
                  <span className={styles.detailLabel}>Email Address</span>
                  <span className={styles.detailValue}>
                    {selectedUser.email || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Account Status</span>
                  <span className={styles.detailValue}>
                    <Tag color={selectedUser.is_active ? "green" : "red"}>
                      {selectedUser.is_active ? "Active Staff" : "Inactive"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created Date</span>
                  <span className={styles.detailValue}>
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Briefcase size={16} color="#7952F5" /> Organization Info
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Department</span>
                  <span className={styles.detailValue}>
                    <Tag color="indigo">
                      {selectedUser.department || "General"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Designation</span>
                  <span className={styles.detailValue}>
                    {selectedUser.designation || "-"}
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
                  navigate(`/admin/users/edit/${selectedUser.id}`);
                }}
                style={{ backgroundColor: "#7952F5", borderRadius: 6 }}
              >
                Edit User Profile
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
