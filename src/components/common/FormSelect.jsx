import { Select } from "antd";

/**
 * Custom Reusable Select Component
 * @param {string} label - Field label above dropdown
 * @param {string} value - Selected value
 * @param {function} onChange - Callback when value changes
 * @param {Array} options - Options array e.g. [{ label: 'Admin', value: 'admin' }]
 * @param {string} placeholder - Placeholder text
 * @param {boolean} showSearch - Enables search filter inside dropdown
 * @param {boolean} disabled - Disables select field
 * @param {string} error - Error message display
 */
export default function FormSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  showSearch = false,
  disabled = false,
  error,
  className = "",
  style = {},
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}
      className={className}
    >
      {label && (
        <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
          {label}
        </label>
      )}

      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        showSearch={showSearch}
        disabled={disabled}
        size="large"
        style={{ width: "100%", borderRadius: "8px" }}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        status={error ? "error" : ""}
      />

      {error && (
        <span style={{ fontSize: "12px", color: "#ff4d4f" }}>{error}</span>
      )}
    </div>
  );
}
