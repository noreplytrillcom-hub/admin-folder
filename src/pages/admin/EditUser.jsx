import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, Input, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormSelect from "../../components/common/FormSelect";
import { supabase } from "../../lib/supabaseClient";
import styles from "./EditUser.module.css";

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
    is_active: "Yes",
    designation: "",
    meeting_url: "",
    contract_reviewer: false,
    contract_approver: false,
    profile_picture: "",
  });

  // Dropdown options
  const departmentOptions = [
    { label: "Customer Service", value: "Customer Service" },
    { label: "Executive", value: "Executive" },
    { label: "Sales", value: "Sales" },
    { label: "Tech", value: "Tech" },
    { label: "Marketing", value: "Marketing" },
    { label: "Implementation", value: "Implementation" },
  ];

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
  ];

  const activeOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  async function fetchUserDetails() {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      message.error("Failed to load user details");
      navigate("/admin/users");
    } else if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        contact_number: data.contact_number || "",
        department: data.department || "Marketing",
        user_role: data.user_role || "User",
        is_active: data.is_active ? "Yes" : "No",
        designation: data.designation || "",
        meeting_url: data.meeting_url || "",
        contract_reviewer: data.contract_reviewer || false,
        contract_approver: data.contract_approver || false,
        profile_picture: data.profile_picture || "",
      });
    }
    setLoading(false);
  }

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
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact_number: formData.contact_number,
        department: formData.department,
        user_role: formData.user_role,
        is_active: formData.is_active === "Yes",
        designation: formData.designation,
        meeting_url: formData.meeting_url,
        contract_reviewer: formData.contract_reviewer,
        contract_approver: formData.contract_approver,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      message.error("Error updating user: " + error.message);
    } else {
      message.success("User updated successfully");
      navigate("/admin/users");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" tip="Loading user profile..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/admin/users">Testo User's List</Link> /{" "}
        <span>Edit User</span>
      </div>

      <h2 className={styles.pageTitle}>Edit User</h2>

      <form onSubmit={handleSubmit} className={styles.formLayout}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarPlaceholder}>
            {formData.profile_picture ? (
              <img src={formData.profile_picture} alt="Profile" />
            ) : (
              <Avatar size={80} icon={<UserOutlined />} />
            )}
          </div>
          <span className={styles.fileHint}>Maximum size: 2MB</span>
        </div>

        {/* Form Fields Section */}
        <div className={styles.fieldsContainer}>
          {/* Row 1 */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>First Name</label>
              <Input
                size="large"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Last Name</label>
              <Input
                size="large"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <Input
                size="large"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Contact Number</label>
              <Input
                size="large"
                value={formData.contact_number}
                onChange={(e) =>
                  handleInputChange("contact_number", e.target.value)
                }
              />
            </div>

            {/* Department Dropdown */}
            <div className={styles.field}>
              <FormSelect
                label="Department"
                value={formData.department}
                options={departmentOptions}
                onChange={(value) => handleInputChange("department", value)}
              />
            </div>

            {/* User Role Dropdown */}
            <div className={styles.field}>
              <FormSelect
                label="User Role"
                value={formData.user_role}
                options={roleOptions}
                onChange={(value) => handleInputChange("user_role", value)}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className={styles.row}>
            {/* Active Status Dropdown */}
            <div className={styles.field}>
              <FormSelect
                label="Active"
                value={formData.is_active}
                options={activeOptions}
                onChange={(value) => handleInputChange("is_active", value)}
              />
            </div>

            <div className={styles.field}>
              <label>Designation</label>
              <Input
                size="large"
                value={formData.designation}
                onChange={(e) =>
                  handleInputChange("designation", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Meeting Url</label>
              <Input
                size="large"
                value={formData.meeting_url}
                onChange={(e) =>
                  handleInputChange("meeting_url", e.target.value)
                }
              />
            </div>
          </div>

          {/* Checkboxes Row */}
          <div className={styles.checkboxRow}>
            <Checkbox
              checked={formData.contract_reviewer}
              onChange={(e) =>
                handleInputChange("contract_reviewer", e.target.checked)
              }
            >
              Contract Reviewer
            </Checkbox>
            <Checkbox
              checked={formData.contract_approver}
              onChange={(e) =>
                handleInputChange("contract_approver", e.target.checked)
              }
            >
              Contract Approver
            </Checkbox>
          </div>

          {/* Buttons */}
          <div className={styles.actions}>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
              style={{
                backgroundColor: "#000",
                borderColor: "#000",
                borderRadius: "8px",
              }}
            >
              Save
            </Button>
            <Button
              size="large"
              onClick={() => navigate("/admin/users")}
              style={{ borderRadius: "8px" }}
            >
              Back
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
