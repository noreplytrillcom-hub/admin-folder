import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
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
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Mail,
  Package,
  Phone,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "../../supabase/client";
import styles from "./PartnerList.module.css";

const { Option } = Select;

const CURRENCIES = ["GBP", "USD", "EUR", "CAD", "AUD", "INR"];
const APPROVAL_STATUSES = [
  "Approved",
  "Pending Approval",
  "Rejected",
  "Suspended",
];
const PACKAGE_PLANS = ["Enterprise", "Standard", "Custom", "Starter"];
const BILLING_CYCLES = ["Monthly", "Annual", "Quarterly"];

export default function PartnerList() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [renewalFilter, setRenewalFilter] = useState("ALL");

  // Drawers & Modals
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  // Fetch partners from Supabase
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (err) {
      console.error("Error fetching partners:", err);
      message.error(err.message || "Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredPartners = partners.filter((p) => {
    const searchStr = `
      ${p.company_name || ""} 
      ${p.primary_first_name || ""} 
      ${p.primary_last_name || ""} 
      ${p.primary_email || ""} 
      ${p.country || ""} 
      ${p.company_reg_number || ""}
      ${p.vat_number || ""}
    `.toLowerCase();

    const matchesSearch = searchStr.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.approval_status === statusFilter;

    const matchesPlan = planFilter === "ALL" || p.package_plan === planFilter;

    const matchesRenewal =
      renewalFilter === "ALL" ||
      (renewalFilter === "YES" && p.enable_auto_renewal) ||
      (renewalFilter === "NO" && !p.enable_auto_renewal);

    return matchesSearch && matchesStatus && matchesPlan && matchesRenewal;
  });

  // Handle Export to Excel
  const handleExportExcel = () => {
    if (filteredPartners.length === 0) {
      message.warning("No partner records to export");
      return;
    }

    const exportData = filteredPartners.map((p, idx) => ({
      "#": idx + 1,
      "Company Name": p.company_name || "-",
      "Reg Number": p.company_reg_number || "-",
      "VAT Number": p.vat_number || "-",
      Website: p.website || "-",
      Country: p.country || "-",
      "Primary Contact Name":
        `${p.primary_first_name || ""} ${p.primary_last_name || ""}`.trim() ||
        "-",
      "Primary Email": p.primary_email || "-",
      "Primary Phone": p.primary_contact_no || "-",
      "Package Plan": p.package_plan || "Enterprise",
      "Max Users": p.max_users || "-",
      "Billing Cycle": p.billing_cycle || "Monthly",
      Currency: p.base_currency || "GBP",
      "Approval Status": p.approval_status || "Pending Approval",
      "Auto Renewal": p.enable_auto_renewal ? "Yes" : "No",
      "Billing Start": p.billing_start_date || "-",
      "Billing End": p.billing_end_date || "-",
      "Order Number": p.order_number || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Existing Partners");
    XLSX.writeFile(
      workbook,
      `Existing_Partners_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    message.success("Excel report downloaded successfully!");
  };

  // Open View Drawer
  const handleView = (partner) => {
    setSelectedPartner(partner);
    setViewDrawerOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (partner) => {
    setSelectedPartner(partner);
    editForm.setFieldsValue({
      ...partner,
      billing_start_date: partner.billing_start_date
        ? dayjs(partner.billing_start_date)
        : null,
      billing_end_date: partner.billing_end_date
        ? dayjs(partner.billing_end_date)
        : null,
    });
    setEditModalOpen(true);
  };

  // Submit Edit Form
  const handleUpdatePartner = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        billing_start_date: values.billing_start_date
          ? values.billing_start_date.format("YYYY-MM-DD")
          : null,
        billing_end_date: values.billing_end_date
          ? values.billing_end_date.format("YYYY-MM-DD")
          : null,
      };

      const { error } = await supabase
        .from("partners")
        .update(payload)
        .eq("id", selectedPartner.id);

      if (error) throw error;

      message.success("Partner updated successfully!");
      setEditModalOpen(false);
      fetchPartners();
    } catch (err) {
      console.error("Error updating partner:", err);
      message.error(err.message || "Failed to update partner");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Partner
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;

      message.success("Partner record deleted successfully");
      fetchPartners();
    } catch (err) {
      console.error("Error deleting partner:", err);
      message.error(err.message || "Failed to delete partner");
    }
  };

  // Table Columns Definition
  const columns = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      sorter: (a, b) =>
        (a.company_name || "").localeCompare(b.company_name || ""),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#e0e7ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {(text || "P").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
              {text}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {record.company_reg_number
                ? `Reg: ${record.company_reg_number}`
                : record.website || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Primary Contact",
      key: "contact",
      render: (_, record) => {
        const fullName =
          `${record.primary_first_name || ""} ${record.primary_last_name || ""}`.trim();
        return (
          <div>
            <div style={{ fontWeight: 500, color: "#334155" }}>
              {fullName || "-"}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {record.primary_email || "-"}
            </div>
          </div>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "country",
      key: "country",
      render: (country, record) => (
        <span style={{ fontSize: 13, color: "#475569" }}>
          {country
            ? `${country}${record.city ? `, ${record.city}` : ""}`
            : "-"}
        </span>
      ),
    },
    {
      title: "Package & Plan",
      dataIndex: "package_plan",
      key: "package_plan",
      render: (plan, record) => (
        <Space direction="vertical" size={2}>
          <Tag color="indigo" style={{ fontWeight: 600 }}>
            {plan || "Enterprise"}
          </Tag>
          <span style={{ fontSize: 11, color: "#64748b" }}>
            {record.max_users ? `${record.max_users} users` : "Unlimited users"}
          </span>
        </Space>
      ),
    },
    {
      title: "Approval Status",
      dataIndex: "approval_status",
      key: "approval_status",
      filters: APPROVAL_STATUSES.map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.approval_status === value,
      render: (status) => {
        let color = "blue";
        let icon = <SyncOutlined spin={status === "Pending Approval"} />;

        if (status === "Approved") {
          color = "success";
          icon = <CheckCircleOutlined />;
        } else if (status === "Pending Approval") {
          color = "warning";
          icon = <ClockCircleOutlined />;
        } else if (status === "Rejected") {
          color = "error";
          icon = <CloseCircleOutlined />;
        } else if (status === "Suspended") {
          color = "default";
          icon = <CloseCircleOutlined />;
        }

        return (
          <Tag icon={icon} color={color} style={{ fontWeight: 600 }}>
            {status || "Pending Approval"}
          </Tag>
        );
      },
    },
    {
      title: "Auto Renewal",
      dataIndex: "enable_auto_renewal",
      key: "enable_auto_renewal",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>{active ? "Active" : "No"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#6366f1" }} />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Partner">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#2563eb" }} />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Partner">
            <Popconfirm
              title="Delete Partner Record?"
              description="Are you sure you want to delete this partner record?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes, Delete"
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
  const totalCount = partners.length;
  const approvedCount = partners.filter(
    (p) => p.approval_status === "Approved",
  ).length;
  const pendingCount = partners.filter(
    (p) => (p.approval_status || "Pending Approval") === "Pending Approval",
  ).length;
  const autoRenewalCount = partners.filter(
    (p) => p.enable_auto_renewal,
  ).length;

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Existing Partners</h1>
          <p className={styles.headerSubtitle}>
            View, manage, edit, and export active enterprise partner contracts
            and accounts.
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

      {/* METRIC / KPI CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapperIndigo}>
            <Building2 color="#6366f1" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Total Partners</span>
            <h2 className={styles.statValue}>{totalCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperGreen}>
            <UserCheck color="#10b981" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Approved & Active</span>
            <h2 className={styles.statValue}>{approvedCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperAmber}>
            <Clock color="#f59e0b" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Pending Approval</span>
            <h2 className={styles.statValue}>{pendingCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperBlue}>
            <RefreshCw color="#3b82f6" size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Auto Renewal Active</span>
            <h2 className={styles.statValue}>{autoRenewalCount}</h2>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className={styles.toolbarCard}>
        <div className={styles.filterGroup}>
          <Input
            placeholder="Search by company name, contact, email, reg no..."
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
            style={{ width: 170 }}
          >
            <Option value="ALL">All Statuses</Option>
            {APPROVAL_STATUSES.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>

          <Select
            value={planFilter}
            onChange={setPlanFilter}
            style={{ width: 160 }}
          >
            <Option value="ALL">All Plans</Option>
            {PACKAGE_PLANS.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>

          <Select
            value={renewalFilter}
            onChange={setRenewalFilter}
            style={{ width: 160 }}
          >
            <Option value="ALL">All Renewals</Option>
            <Option value="YES">Auto Renewal: Yes</Option>
            <Option value="NO">Auto Renewal: No</Option>
          </Select>
        </div>

        <div className={styles.resultsCount}>
          Showing <b>{filteredPartners.length}</b> of <b>{partners.length}</b>{" "}
          partners
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
            dataSource={filteredPartners}
            rowKey={(record) => record.id}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} partners`,
            }}
          />
        )}
      </div>

      {/* VIEW DETAILS DRAWER */}
      <Drawer
        title={
          selectedPartner ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Building2 color="#6366f1" size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {selectedPartner.company_name}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {selectedPartner.package_plan || "Enterprise"} Partner
                </div>
              </div>
            </div>
          ) : (
            "Partner Details"
          )
        }
        placement="right"
        width="45%"
        styles={{ header: { flexDirection: "row-reverse" } }}
        onClose={() => setViewDrawerOpen(false)}
        open={viewDrawerOpen}
      >
        {selectedPartner && (
          <div>
            {/* Section 1: Company Profile */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Building2 size={16} color="#6366f1" /> Company Details
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Company Name</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.company_name}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Registration No.</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.company_reg_number || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>VAT Number</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.vat_number || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Website</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.website ? (
                      <a
                        href={
                          selectedPartner.website.startsWith("http")
                            ? selectedPartner.website
                            : `https://${selectedPartner.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#2563eb" }}
                      >
                        {selectedPartner.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Address</span>
                  <span className={styles.detailValue}>
                    {[
                      selectedPartner.street_address,
                      selectedPartner.city,
                      selectedPartner.state,
                      selectedPartner.post_code,
                      selectedPartner.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Base Currency</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.base_currency || "GBP"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Contacts */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <Mail size={16} color="#6366f1" /> Contact Persons
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Primary Contact</span>
                  <span className={styles.detailValue}>
                    {`${selectedPartner.primary_first_name || ""} ${selectedPartner.primary_last_name || ""}`.trim() ||
                      "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Primary Email</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.primary_email || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Primary Phone</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.primary_contact_no || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Secondary Contact</span>
                  <span className={styles.detailValue}>
                    {`${selectedPartner.secondary_first_name || ""} ${selectedPartner.secondary_last_name || ""}`.trim() ||
                      "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Secondary Email</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.secondary_email || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Secondary Phone</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.secondary_contact_no || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Package & Billing */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <CreditCard size={16} color="#6366f1" /> Subscription & Billing
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Package Plan</span>
                  <span className={styles.detailValue}>
                    <Tag color="indigo">
                      {selectedPartner.package_plan || "Enterprise"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Max Users</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.max_users || "Unlimited"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Billing Cycle</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.billing_cycle || "Monthly"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Auto Renewal</span>
                  <span className={styles.detailValue}>
                    <Tag
                      color={
                        selectedPartner.enable_auto_renewal ? "green" : "red"
                      }
                    >
                      {selectedPartner.enable_auto_renewal ? "Yes" : "No"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    Billing Start Date
                  </span>
                  <span className={styles.detailValue}>
                    {selectedPartner.billing_start_date || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Billing End Date</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.billing_end_date || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Order Number</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.order_number || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Payment Method</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.payment_method || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Approval Status */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>
                <UserCheck size={16} color="#6366f1" /> Approval Status & Notes
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Approval Status</span>
                  <span className={styles.detailValue}>
                    <Tag
                      color={
                        selectedPartner.approval_status === "Approved"
                          ? "success"
                          : selectedPartner.approval_status ===
                              "Pending Approval"
                            ? "warning"
                            : "error"
                      }
                    >
                      {selectedPartner.approval_status || "Pending Approval"}
                    </Tag>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Approved By</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.approved_by || "-"}
                  </span>
                </div>
                <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                  <span className={styles.detailLabel}>Approval Notes</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.approval_notes || "None"}
                  </span>
                </div>
                <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                  <span className={styles.detailLabel}>General Notes</span>
                  <span className={styles.detailValue}>
                    {selectedPartner.notes || "None"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setViewDrawerOpen(false);
                  handleEdit(selectedPartner);
                }}
                style={{ backgroundColor: "#2563eb", borderRadius: 6 }}
              >
                Edit Partner
              </Button>
              <Button
                onClick={() => setViewDrawerOpen(false)}
                style={{ borderRadius: 6 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* EDIT PARTNER MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EditOutlined style={{ color: "#2563eb" }} />
            <span>Edit Partner - {selectedPartner?.company_name}</span>
          </div>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={720}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdatePartner}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  { required: true, message: "Company name is required" },
                ]}
              >
                <Input placeholder="Company Name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="company_reg_number" label="Registration No.">
                <Input placeholder="Reg No." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="vat_number" label="VAT Number">
                <Input placeholder="VAT No." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="website" label="Website">
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="country" label="Country">
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="base_currency" label="Currency">
                <Select placeholder="Currency">
                  {CURRENCIES.map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="primary_first_name" label="Primary First Name">
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="primary_last_name" label="Primary Last Name">
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="primary_email" label="Primary Email">
                <Input placeholder="email@company.com" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="primary_contact_no" label="Primary Phone">
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="package_plan" label="Package Plan">
                <Select placeholder="Package Plan">
                  {PACKAGE_PLANS.map((p) => (
                    <Option key={p} value={p}>
                      {p}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="max_users" label="Max Users">
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Max Users"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="billing_cycle" label="Billing Cycle">
                <Select placeholder="Billing Cycle">
                  {BILLING_CYCLES.map((b) => (
                    <Option key={b} value={b}>
                      {b}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="approval_status" label="Approval Status">
                <Select placeholder="Approval Status">
                  {APPROVAL_STATUSES.map((s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="billing_start_date" label="Billing Start Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="billing_end_date" label="Billing End Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="enable_auto_renewal"
                valuePropName="checked"
                style={{ marginTop: 30 }}
              >
                <Checkbox>Enable Auto-Renewal</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="approved_by" label="Approved By">
                <Input placeholder="Approver Name / Admin" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="order_number" label="Order Number">
                <Input placeholder="Order Ref / Invoice No." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="approval_notes" label="Approval Notes">
            <Input.TextArea rows={2} placeholder="Approval notes..." />
          </Form.Item>

          <Form.Item name="notes" label="General Notes">
            <Input.TextArea rows={2} placeholder="Additional notes..." />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 16,
            }}
          >
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ backgroundColor: "#2563eb", borderRadius: 6 }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
