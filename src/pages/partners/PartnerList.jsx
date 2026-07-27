export default function PartnerList() {
  return (
    <div
      style={{
        padding: "24px 32px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "22px",
          fontWeight: "700",
          margin: "0 0 4px 0",
          color: "#0f172a",
        }}
      >
        Existing Partners
      </h1>
      <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 20px 0" }}>
        View and manage existing active partner contracts.
      </p>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        Existing partner records view.
      </div>
    </div>
  );
}
