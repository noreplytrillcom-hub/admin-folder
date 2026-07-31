import {
  CopyOutlined,
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Space, Table, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// EXCEL EXPORT: Import SheetJS for exporting database client records
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabaseClient";
import styles from "./clients.module.css"; // Import CSS module for styling

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch all client records from Supabase joined with partner company details
  async function fetchClients() {
    setLoading(true);

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

    if (error) {
      console.error("Error fetching database clients:", error);
      message.error(error.message || "Failed to load clients");
    } else {
      setClients(data || []); // FIXED: changed setUsers to setClients
    }

    setLoading(false); // Now this line will always run!
  }
  // Filter clients by System ID, Name, Email, User Type, or Partner Company Name
  const filteredClients = clients.filter((u) => {
    const partnerName = u.partners?.company_name || "Individual User";
    const searchString = `
      ${u.id || ""} 
      ${u.first_name || ""} 
      ${u.last_name || ""} 
      ${u.email || ""} 
      ${u.user_type || ""} 
      ${partnerName}
    `.toLowerCase();

    return searchString.includes(search.toLowerCase());
  });

  // Helper function to copy full System-generated ID for debugging
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    message.success("System User ID copied to clipboard!");
  };

  // ==========================================
  // EXCEL EXPORT HANDLER
  // ==========================================
  const handleExportExcel = () => {
    if (filteredClients.length === 0) {
      message.warning("No client data available to export");
      return;
    }

    // Format database records for Excel file columns
    const exportData = filteredClients.map((u) => ({
      "System User ID": u.id,
      Name: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
      Email: u.email || "",
      "User Type": u.user_type || "Client",
      "Partner / Company": u.partners?.company_name || "Individual User",
      Active: u.is_active ? "Yes" : "No",
      "Created Date": u.created_at
        ? new Date(u.created_at).toLocaleDateString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Database Clients");

    XLSX.writeFile(workbook, "Database_Clients_List.xlsx");
    message.success("Excel downloaded successfully!");
  };

  // Table Columns Definition
  const columns = [
    {
      title: " User ID",
      dataIndex: "id",
      key: "id",
      width: 160,
      render: (id) => {
        // If ID is a UUID string, generate a consistent 6-digit number from it
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
                backgroundColor: "#f3f4f6",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {numericId}
            </code>
            <Tooltip title="Copy 6-digit User ID">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined style={{ color: "#6b7280" }} />}
                onClick={() => handleCopyId(numericId)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Name",
      key: "name",
      sorter: (a, b) =>
        `${a.first_name || ""} ${a.last_name || ""}`.localeCompare(
          `${b.first_name || ""} ${b.last_name || ""}`,
        ),
      render: (_, record) => (
        <Link
          to={`/admin/users/edit/${record.id}`}
          style={{
            color: "#2563eb",
            fontWeight: 500,
          }}
        >
          {`${record.first_name || ""} ${record.last_name || ""}`}
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (type) => (
        <Tag color={type === "Admin" ? "purple" : "blue"}>
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
          <span>{companyName}</span>
        ) : (
          <Tag color="orange">Individual User</Tag>
        );
      },
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Clients List</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/users/create")}
          style={{
            backgroundColor: "#000",
            borderColor: "#000",
            borderRadius: "6px",
          }}
        >
          Add Client
        </Button>
      </div>

      {/* Toolbar: Search input & Export Excel Button */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Input
          placeholder="Search by ID, name, email, or company..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: "340px" }}
          size="large"
        />

        {/* EXCEL EXPORT BUTTON */}
        <Button
          size="large"
          icon={<DownloadOutlined />}
          onClick={handleExportExcel}
          style={{
            borderRadius: "8px",
            fontWeight: 500,
          }}
        ></Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={filteredClients}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
            showTotal: false,
            itemRender: (current, type, originalElement) => {
              if (type === "prev") {
                return <a>&lt; Previous</a>;
              }
              if (type === "next") {
                return <a>Next &gt;</a>;
              }
              return originalElement;
            },
          }}
        />
      </div>
    </div>
  );
}
