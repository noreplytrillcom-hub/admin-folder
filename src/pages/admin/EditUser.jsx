import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Link as LinkIcon,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import { Button, Checkbox, Input, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./EditUser.module.css";

const { Option } = Select;

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    department: "Marketing",
    user_role: "User",
    is_active: true,
    designation: "",
    meeting_url: "",
    contract_reviewer: false,
    contract_approver: false,
  });

  const departmentOptions = [
    "Customer Service",
    "Executive",
    "Sales",
    "Tech",
    "Marketing",
  ];

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      message.error("Failed to load user details: " + error.message);
    } else if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        contact_number: data.contact_number || "",
        department: data.department || "Marketing",
        user_role: data.user_role || "User",
        is_active: data.is_active ?? true,
        designation: data.designation || "",
        meeting_url: data.meeting_url || "",
        contract_reviewer: data.contract_reviewer || false,
        contract_approver: data.contract_approver || false,
      });
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("admin_users")
      .update({
        ...formData,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      message.error("Error updating user: " + error.message);
    } else {
      message.success("User profile updated successfully!");
      navigate("/admin/users");
    }
  };

  const previewInitials =
    `${formData.first_name[0] || ""}${formData.last_name[0] || ""}`.toUpperCase() ||
    "U";

  const previewFullName =
    `${formData.first_name} ${formData.last_name}`.trim() || "User Profile";

  if (loading) {
    return (
      <div className={styles.container} style={{ alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Loading User Profile..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* EXECUTIVE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link to="/dashboard" style={{ color: "#94a3b8" }}>
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <Link to="/admin/users" style={{ color: "#94a3b8" }}>
              Testo Users Directory
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: "#ffffff", fontWeight: 600 }}>Edit User Details</span>
          </div>

          <h1 className={styles.heroTitle}>
            <UserCheck size={24} color="#D1B9FE" /> Edit User - {previewFullName}
          </h1>
          <p className={styles.heroSubtitle}>
            Update account information, department assignment, and access authorization level.
          </p>
        </div>

        <Button
          icon={<ArrowLeft size={15} />}
          onClick={() => navigate("/admin/users")}
          style={{
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "#ffffff",
          }}
        >
          Back to Directory
        </Button>
      </div>

      {/* FORM CARD CONTAINER */}
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* SECTION 1: PERSONAL PROFILE IDENTITY */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <User size={18} color="#7952F5" /> Personal Identity & Contact
            </h3>

            {/* LIVE AVATAR PREVIEW CARD */}
            <div className={styles.previewBox}>
              <div className={styles.avatarBadge}>{previewInitials}</div>
              <div className={styles.previewMeta}>
                <span className={styles.previewName}>{previewFullName}</span>
                <span className={styles.previewSub}>
                  {formData.email || "email@example.com"} • {formData.user_role} ({formData.department})
                </span>
              </div>
            </div>

            <div className={styles.gridRow}>
              <div className={styles.field}>
                <label className={styles.label}>First Name *</label>
                <Input
                  size="large"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                <Input
                  size="large"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.gridRow}>
              <div className={styles.field}>
                <label className={styles.label}>Email Address *</label>
                <Input
                  size="large"
                  type="email"
                  prefix={<Mail size={15} color="#94a3b8" />}
                  placeholder="user@organization.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Contact Phone Number</label>
                <Input
                  size="large"
                  prefix={<Phone size={15} color="#94a3b8" />}
                  placeholder="+1 (555) 000-0000"
                  value={formData.contact_number}
                  onChange={(e) => handleInputChange("contact_number", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DEPARTMENT & ROLE ASSIGNMENT */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <Building2 size={18} color="#7952F5" /> Organization & Access Roles
            </h3>

            <div className={styles.gridRow}>
              <div className={styles.field}>
                <label className={styles.label}>Department</label>
                <Select
                  size="large"
                  value={formData.department}
                  onChange={(val) => handleInputChange("department", val)}
                >
                  {departmentOptions.map((dept) => (
                    <Option key={dept} value={dept}>
                      {dept}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>User Role</label>
                <Select
                  size="large"
                  value={formData.user_role}
                  onChange={(val) => handleInputChange("user_role", val)}
                >
                  <Option value="User">Standard User</Option>
                  <Option value="Admin">System Administrator</Option>
                </Select>
              </div>
            </div>

            <div className={styles.gridRow}>
              <div className={styles.field}>
                <label className={styles.label}>Account Status</label>
                <Select
                  size="large"
                  value={formData.is_active ? "Active" : "Inactive"}
                  onChange={(val) => handleInputChange("is_active", val === "Active")}
                >
                  <Option value="Active">Active Account</Option>
                  <Option value="Inactive">Inactive / Suspended</Option>
                </Select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Designation / Job Title</label>
                <Input
                  size="large"
                  placeholder="e.g. Senior Support Lead"
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Meeting URL</label>
              <Input
                size="large"
                prefix={<LinkIcon size={15} color="#94a3b8" />}
                placeholder="https://meet.google.com/abc-defg-hij"
                value={formData.meeting_url}
                onChange={(e) => handleInputChange("meeting_url", e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 3: CONTRACT PERMISSIONS & AUTHORIZATION */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <ShieldCheck size={18} color="#7e22ce" /> Contract Authorizations
            </h3>

            <div className={styles.permissionGrid}>
              <div
                className={`${styles.permissionCard} ${
                  formData.contract_reviewer ? styles.permissionCardActive : ""
                }`}
                onClick={() =>
                  handleInputChange(
                    "contract_reviewer",
                    !formData.contract_reviewer
                  )
                }
              >
                <Checkbox
                  checked={formData.contract_reviewer}
                  onChange={(e) =>
                    handleInputChange("contract_reviewer", e.target.checked)
                  }
                />
                <div className={styles.permissionMeta}>
                  <span className={styles.permissionTitle}>Contract Reviewer</span>
                  <span className={styles.permissionDesc}>
                    Authorized to review draft partner agreements and client documents.
                  </span>
                </div>
              </div>

              <div
                className={`${styles.permissionCard} ${
                  formData.contract_approver ? styles.permissionCardActive : ""
                }`}
                onClick={() =>
                  handleInputChange(
                    "contract_approver",
                    !formData.contract_approver
                  )
                }
              >
                <Checkbox
                  checked={formData.contract_approver}
                  onChange={(e) =>
                    handleInputChange("contract_approver", e.target.checked)
                  }
                />
                <div className={styles.permissionMeta}>
                  <span className={styles.permissionTitle}>Contract Approver</span>
                  <span className={styles.permissionDesc}>
                    Authorized to grant final legal approval and digital signatures on contracts.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS BAR */}
          <div className={styles.actionsBar}>
            <Button
              size="large"
              onClick={() => navigate("/admin/users")}
              style={{ borderRadius: 8 }}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
              icon={<CheckCircle2 size={16} />}
              style={{
                background: "linear-gradient(135deg, #7952F5 0%, #9B7BFA 100%)",
                borderColor: "#7952F5",
                borderRadius: 8,
                fontWeight: 600,
                padding: "0 28px",
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
