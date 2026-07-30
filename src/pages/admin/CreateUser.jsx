import { Button, Checkbox, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormSelect from "../../components/common/FormSelect";
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

  // Dropdown options
  const departmentOptions = [
    { label: "Customer Service", value: "Customer Service" },
    { label: "Executive", value: "Executive" },
    { label: "Sales", value: "Sales" },
    { label: "Tech", value: "Tech" },
    { label: "Marketing", value: "Marketing" },
  ];

  const roleOptions = [
    { label: "User", value: "User" },
    { label: "Admin", value: "Admin" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      message.error("Error creating user: " + error.message);
    } else {
      message.success("User created successfully!");
      navigate("/admin/users");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Row 1 */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>First Name</label>
            <Input
              size="large"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
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
            <FormSelect
              label="Department"
              value={formData.department}
              options={departmentOptions}
              onChange={(value) => handleInputChange("department", value)}
            />
          </div>
          <div className={styles.field}>
            <FormSelect
              label="User Role"
              value={formData.user_role}
              options={roleOptions}
              onChange={(value) => handleInputChange("user_role", value)}
            />
          </div>
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
        </div>

        {/* Row 3 */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Designation</label>
            <Input
              size="large"
              value={formData.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Meeting Url</label>
            <Input
              size="large"
              value={formData.meeting_url}
              onChange={(e) => handleInputChange("meeting_url", e.target.value)}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className={styles.checkboxGroup}>
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

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{
              backgroundColor: "#000",
              borderColor: "#000",
              borderRadius: "8px",
            }}
          >
            Create
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/admin/users")}
            style={{ borderRadius: "8px" }}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
