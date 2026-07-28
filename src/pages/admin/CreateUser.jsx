import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./CreateUser.module.css";

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "Customer Service",
    user_role: "User",
    contact_number: "",
    designation: "",
    meeting_url: "",
    contract_reviewer: false,
    contract_approver: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("admin_users").insert([
      {
        ...formData,
        is_active: true,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error creating user: " + error.message);
    } else {
      navigate("/admin/users");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
            </select>
          </div>
          <div className={styles.field}>
            <label>User Role</label>
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.row}>
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

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              name="contract_reviewer"
              checked={formData.contract_reviewer}
              onChange={handleChange}
            />
            Contract Reviewer
          </label>
          <label>
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
          <button type="submit" className={styles.createBtn} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/admin/users")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}