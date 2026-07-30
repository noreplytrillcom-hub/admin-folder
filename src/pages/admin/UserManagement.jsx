import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// EXCEL EXPORT: Import the SheetJS (xlsx) library for converting JSON to Excel files
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabaseClient";
import styles from "./UserManagement.module.css";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }

  // Filter users based on search query
  const filteredUsers = users.filter((u) => {
    const searchString =
      `${u.first_name || ""} ${u.last_name || ""} ${u.email || ""} ${u.department || ""} ${u.designation || ""}`.toLowerCase();
    return searchString.includes(search.toLowerCase());
  });

  // ==========================================
  // EXCEL EXPORT HANDLER
  // ==========================================
  const handleExportExcel = () => {
    // 1. Guard check: prevent downloading if the list is empty
    if (filteredUsers.length === 0) {
      message.warning("No data available to export");
      return;
    }

    // 2. Format the user list data specifically for the Excel file columns
    const exportData = filteredUsers.map((u, index) => ({
      ID: index + 1,
      Name: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
      Email: u.email || "",
      Department: u.department || "-",
      Designation: u.designation || "-",
      Active: u.is_active ? "Yes" : "No",
      "Created Date": u.created_at
        ? new Date(u.created_at).toLocaleDateString()
        : "-",
    }));

    // 3. Convert formatted JSON array into an Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 4. Create a new workbook and attach the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // 5. Trigger download of the formatted .xlsx file
    XLSX.writeFile(workbook, "User_List.xlsx");
    message.success("Excel downloaded successfully");
  };

  // Ant Design Table Columns
  const columns = [
    {
      title: "ID",
      key: "index",
      width: 70,
      render: (_, __, index) => index + 1,
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
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => text || "-",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (text) => text || "-",
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
        <h2>Testo User's List</h2>
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
          Add User
        </Button>
      </div>

      {/* Toolbar Container: Search bar & Download Excel Button */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Input
          placeholder="Search by name, email, or department..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: "320px" }}
          size="large"
        />

        {/* EXCEL EXPORT BUTTON: Trigger the export function */}
        <Button
          size="large"
          icon={<DownloadOutlined />}
          onClick={handleExportExcel}
          style={{
            // borderColor: "#2563eb",
            // color: "#2563eb",
            borderRadius: "8px",
            fontWeight: 500,
          }}
        ></Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
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
