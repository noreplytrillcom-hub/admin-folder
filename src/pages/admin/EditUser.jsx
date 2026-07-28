import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    department: "",
    user_role: "",
    is_active: "Yes",
    designation: "",
    meeting_url: "",
    contract_reviewer: false,
    contract_approver: false,
    profile_picture: "",
  });

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
      alert("Failed to load user details");
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      alert("Error updating user: " + error.message);
    } else {
      navigate("/admin/users");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>Loading user profile...</div>
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
        <div className={styles.avatarSection}>
          <div className={styles.avatarPlaceholder}>
            {formData.profile_picture ? (
              <img src={formData.profile_picture} alt="Profile" />
            ) : (
              <svg viewBox="0 0 24 24" fill="#94a3b8" width="64" height="64">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
          <span className={styles.fileHint}>Maximum size: 2MB</span>
        </div>

        <div className={styles.fieldsContainer}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Contact Number</label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Customer Service">Customer Service</option>
                <option value="Executive">Executive</option>
                <option value="Sales">Sales</option>
                <option value="Tech">Tech</option>
                <option value="Marketing">Marketing</option>
                <option value="Implementation">Implementation</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>User Role</label>
              <select
                name="user_role"
                value={formData.user_role}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Active</label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Meeting Url</label>
              <input
                type="text"
                name="meeting_url"
                value={formData.meeting_url}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="contract_reviewer"
                checked={formData.contract_reviewer}
                onChange={handleChange}
              />
              Contract Reviewer
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="contract_approver"
                checked={formData.contract_approver}
                onChange={handleChange}
              />
              Contract Approver
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => navigate("/admin/users")}
            >
              Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
