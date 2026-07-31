import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function EditClient() {
  const { id } = useParams(); // Get client ID from URL route (/admin/users/edit/:id)
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partners, setPartners] = useState([]);
  const [dbRecord, setDbRecord] = useState(null);

  // Dynamically watch active switch state for dynamic button styling
  const isActive = Form.useWatch("is_active", form);

  useEffect(() => {
    fetchPartners();
    fetchClientDetails();
  }, [id]);

  // Fetch all available partner companies for the dropdown
  async function fetchPartners() {
    const { data, error } = await supabase
      .from("partners")
      .select("id, company_name")
      .order("company_name", { ascending: true });

    if (!error && data) {
      setPartners(data);
    }
  }

  // Fetch client details from database
  async function fetchClientDetails() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching client details:", error);
      message.error("Failed to fetch client details");
      navigate("/admin/clients");
    } else if (data) {
      setDbRecord(data);

      // Format 6-digit numeric System User ID if legacy UUID exists
      const displayId =
        typeof data.id === "number"
          ? data.id
          : Math.abs(
              data.id
                .toString()
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0) * 12345,
            )
              .toString()
              .slice(0, 6);

      // Set form values safely
      form.setFieldsValue({
        system_id: displayId,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        user_type: data.user_type || "Client",
        partner_id: data.partner_id ? data.partner_id : null,
        is_active: data.is_active ?? true,
      });
    }

    setLoading(false);
  }

  // Handle Form Submission / Database Update
  const handleSubmit = async (values) => {
    setSaving(true);

    // Build payload explicitly with strictly typed fields
    const updatedData = {
      first_name: values.first_name ? values.first_name.trim() : "",
      last_name: values.last_name ? values.last_name.trim() : "",
      email: values.email ? values.email.trim() : "",
      user_type: values.user_type || "Client",
      partner_id: values.partner_id ? values.partner_id : null,
      is_active: Boolean(values.is_active),
    };

    const targetId = dbRecord?.id || id;

    console.log("Submitting payload to Supabase:", updatedData);

    const { data, error } = await supabase
      .from("clients")
      .update(updatedData)
      .eq("id", targetId)
      .select();

    if (error) {
      console.error("Supabase Error Details:", error);
      message.error(error.message || "Failed to update client details");
    } else if (!data || data.length === 0) {
      message.error("Update failed: No record updated. Check RLS policies.");
    } else {
      message.success("Client details updated successfully!");
      navigate("/admin/clients");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" description="Loading client data..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      {/* Header & Back Button */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/clients")}
          >
            Back to Clients
          </Button>
          <h2 style={{ margin: 0 }}>Edit Client</h2>
        </Space>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* Read-Only System User ID Display */}
          <Form.Item label="System User ID" name="system_id">
            <Input
              disabled
              style={{
                fontWeight: 600,
                color: "#374151",
                backgroundColor: "#f3f4f6",
                maxWidth: "200px",
              }}
            />
          </Form.Item>

          <Divider style={{ margin: "16px 0" }} />

          {/* First Name & Last Name */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="John" size="large" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Doe" size="large" />
            </Form.Item>
          </div>

          {/* Email Address */}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="john.doe@example.com" size="large" />
          </Form.Item>

          {/* User Type & Partner Company Selection */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item label="User Type" name="user_type">
              <Select size="large">
                <Select.Option value="Client">Client</Select.Option>
                <Select.Option value="Admin">Admin</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Partner / Company"
              name="partner_id"
              extra="Select a company or leave unassigned as Individual User"
            >
              <Select size="large" allowClear placeholder="Individual User">
                {partners.map((partner) => (
                  <Select.Option key={partner.id} value={partner.id}>
                    {partner.company_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Active Status Switch */}
          <Form.Item
            label="Account Status"
            name="is_active"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              style={{
                backgroundColor: isActive ? "#16a34a" : undefined,
              }}
            />
          </Form.Item>

          <Divider style={{ margin: "20px 0" }} />

          {/* Submit / Cancel Buttons */}
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <Button size="large" onClick={() => navigate("/admin/clients")}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={saving}
              icon={<SaveOutlined />}
              style={{
                backgroundColor: "#000",
                borderColor: "#000",
                borderRadius: "6px",
              }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
