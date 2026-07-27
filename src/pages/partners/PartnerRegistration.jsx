import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Package,
  Plus,
  RefreshCw,
  Send,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import styles from "./PartnerRegistration.module.css";

const CURRENCIES = [
  { code: "GBP", label: "GBP (£)" },
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "CAD", label: "CAD ($)" },
  { code: "AUD", label: "AUD ($)" },
  { code: "INR", label: "INR (₹)" },
];

export default function PartnerRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State including Package, Approval Flow, and Billing Details
  const [formData, setFormData] = useState({
    // Partner Details
    company_name: "",
    street_address: "",
    city: "",
    state: "",
    country: "",
    post_code: "",
    website: "",
    company_reg_number: "",
    vat_number: "",
    base_currency: "GBP",

    // Contact Details
    primary_first_name: "",
    primary_last_name: "",
    primary_contact_no: "",
    primary_email: "",
    secondary_first_name: "",
    secondary_last_name: "",
    secondary_contact_no: "",
    secondary_email: "",

    // Package Details
    package_plan: "Enterprise",
    max_users: "",
    billing_cycle: "Monthly",

    // Billing Details
    billing_first_name: "",
    billing_last_name: "",
    billing_email: "",
    order_number: "",
    payment_method: "CC/DD",
    billing_start_date: "",
    billing_end_date: "",
    enable_auto_renewal: false,

    // Approval Flow Details
    approval_status: "Pending Approval",
    approved_by: "",
    approval_notes: "",

    // Additional Notes
    notes: "",
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase.from("partners").select("*");
      if (error) throw error;
      setPartners(data || []);
    } catch (err) {
      console.error("Error fetching partners:", err.message);
    }
  };

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

    try {
      const { error } = await supabase.from("partners").insert([formData]);
      if (error) throw error;

      alert("Partner registered successfully!");
      setShowForm(false);
      fetchPartners();
    } catch (err) {
      alert("Error registering partner: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            {showForm ? "New Partner Registration" : "New Partner Registration"}
          </h1>
          <p className={styles.headerSubtitle}>
            {showForm
              ? "Create and onboard a new enterprise partner account"
              : "Manage and view registered enterprise partner accounts"}
          </p>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className={styles.btnPrimary}
          >
            <Plus size={16} /> Register New Partner
          </button>
        ) : (
          <button
            onClick={() => setShowForm(false)}
            className={styles.btnSecondary}
          >
            <ArrowLeft size={16} /> Back to Overview
          </button>
        )}
      </div>

      {/* OVERVIEW TABLE & CARDS */}
      {!showForm ? (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.iconWrapperIndigo}>
                <Building2 color="#6366f1" size={20} />
              </div>
              <div>
                <span className={styles.statLabel}>Total Partners</span>
                <h2 className={styles.statValue}>{partners.length}</h2>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.iconWrapperGreen}>
                <RefreshCw color="#10b981" size={20} />
              </div>
              <div>
                <span className={styles.statLabel}>Auto-Renewal Active</span>
                <h2 className={styles.statValue}>
                  {partners.filter((p) => p.enable_auto_renewal).length}
                </h2>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.iconWrapperRed}>
                <XCircle color="#ef4444" size={20} />
              </div>
              <div>
                <span className={styles.statLabel}>Manual Renewal</span>
                <h2 className={styles.statValue}>
                  {partners.filter((p) => !p.enable_auto_renewal).length}
                </h2>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.th}>COMPANY NAME</th>
                  <th className={styles.th}>PRIMARY CONTACT</th>
                  <th className={styles.th}>CURRENCY</th>
                  <th className={styles.th}>PACKAGE</th>
                  <th className={styles.th}>APPROVAL STATUS</th>
                  <th className={styles.th}>AUTO-RENEWAL</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.emptyCell}>
                      No partner records found.
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p.id} className={styles.tableRow}>
                      <td className={styles.td}>{p.company_name}</td>
                      <td className={styles.td}>{p.primary_email || "-"}</td>
                      <td className={styles.td}>{p.base_currency || "GBP"}</td>
                      <td className={styles.td}>
                        {p.package_plan || "Enterprise"}
                      </td>
                      <td className={styles.td}>
                        {p.approval_status || "Pending Approval"}
                      </td>
                      <td className={styles.td}>
                        {p.enable_auto_renewal ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* SECTION 1: PARTNER DETAILS */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <Building2 size={18} color="#6366f1" />
              <h2 className={styles.cardTitle}>Partner Details</h2>
            </div>
            <div className={styles.grid4}>
              <input
                required
                type="text"
                name="company_name"
                placeholder="Company Name *"
                value={formData.company_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="street_address"
                placeholder="Street Address"
                value={formData.street_address}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="state"
                placeholder="State / Region"
                value={formData.state}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="post_code"
                placeholder="Post Code"
                value={formData.post_code}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="url"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="company_reg_number"
                placeholder="Company Reg No."
                value={formData.company_reg_number}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="vat_number"
                placeholder="VAT Number"
                value={formData.vat_number}
                onChange={handleChange}
                className={styles.input}
              />
              <select
                name="base_currency"
                value={formData.base_currency}
                onChange={handleChange}
                className={styles.select}
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 2: CONTACT DETAILS */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <UserCheck size={18} color="#6366f1" />
              <h2 className={styles.cardTitle}>Contact Details</h2>
            </div>
            <p className={styles.sectionLabel}>Primary Contact</p>
            <div className={styles.grid4}>
              <input
                type="text"
                name="primary_first_name"
                placeholder="First Name"
                value={formData.primary_first_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="primary_last_name"
                placeholder="Last Name"
                value={formData.primary_last_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="primary_contact_no"
                placeholder="Contact No"
                value={formData.primary_contact_no}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="email"
                name="primary_email"
                placeholder="Email Address"
                value={formData.primary_email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.divider} />

            <p className={styles.sectionLabel}>Secondary Contact (Optional)</p>
            <div className={styles.grid4}>
              <input
                type="text"
                name="secondary_first_name"
                placeholder="First Name"
                value={formData.secondary_first_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="secondary_last_name"
                placeholder="Last Name"
                value={formData.secondary_last_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="secondary_contact_no"
                placeholder="Contact No"
                value={formData.secondary_contact_no}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="email"
                name="secondary_email"
                placeholder="Email Address"
                value={formData.secondary_email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* SECTION 3: PACKAGE DETAILS */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <Package size={18} color="#6366f1" />
              <h2 className={styles.cardTitle}>Package Details</h2>
            </div>
            <div className={styles.grid4}>
              <select
                name="package_plan"
                value={formData.package_plan}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Starter">Starter Plan</option>
                <option value="Professional">Professional Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
                <option value="Custom">Custom Tier</option>
              </select>
              <input
                type="number"
                name="max_users"
                placeholder="Max Seats / Users"
                value={formData.max_users}
                onChange={handleChange}
                className={styles.input}
              />
              <select
                name="billing_cycle"
                value={formData.billing_cycle}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Monthly">Monthly Billing</option>
                <option value="Quarterly">Quarterly Billing</option>
                <option value="Annually">Annual Billing</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: BILLING DETAILS */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <CreditCard size={18} color="#6366f1" />
              <h2 className={styles.cardTitle}>Billing Details</h2>
            </div>
            <p className={styles.sectionLabel}>Billing Contact Information</p>
            <div className={styles.grid4}>
              <input
                type="text"
                name="billing_first_name"
                placeholder="Billing First Name"
                value={formData.billing_first_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="billing_last_name"
                placeholder="Billing Last Name"
                value={formData.billing_last_name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="email"
                name="billing_email"
                placeholder="Billing Email"
                value={formData.billing_email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.divider} />

            <p className={styles.sectionLabel}>Contract & Payment Terms</p>
            <div className={styles.grid4}>
              <input
                type="text"
                name="order_number"
                placeholder="Order / PO Number"
                value={formData.order_number}
                onChange={handleChange}
                className={styles.input}
              />
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="CC/DD">Credit Card / Direct Debit</option>
                <option value="Invoice">Invoice (Net 30)</option>
                <option value="Wire Transfer">Bank Wire Transfer</option>
              </select>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Start Date
                </span>
                <input
                  type="date"
                  name="billing_start_date"
                  value={formData.billing_start_date}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  End Date
                </span>
                <input
                  type="date"
                  name="billing_end_date"
                  value={formData.billing_end_date}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="enable_auto_renewal"
                  checked={formData.enable_auto_renewal}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                Enable Automatic Contract Renewal
              </label>
            </div>
          </div>

          {/* SECTION 5: APPROVAL FLOW */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <CheckCircle2 size={18} color="#6366f1" />
              <h2 className={styles.cardTitle}>Approval Flow</h2>
            </div>
            <div className={styles.grid4}>
              <select
                name="approval_status"
                value={formData.approval_status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="text"
                name="approved_by"
                placeholder="Approver Name / Manager ID"
                value={formData.approved_by}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div style={{ marginTop: "12px" }}>
              <input
                type="text"
                name="approval_notes"
                placeholder="Approval or Rejection Remarks"
                value={formData.approval_notes}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* SECTION 6: NOTES */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <FileText size={18} color="#6366f1" />
              <h2 className={styles.cardTitle}>Additional Notes</h2>
            </div>
            <textarea
              name="notes"
              placeholder="Enter special contract notes or onboard instructions..."
              value={formData.notes}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          {/* SUBMIT BUTTONS */}
          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={loading}
              className={styles.btnPrimary}
            >
              <Send size={15} />{" "}
              {loading ? "Registering..." : "Register Partner"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={styles.btnSecondary}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
