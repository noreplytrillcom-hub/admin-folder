import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import styles from "./Logs.module.css";

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchErrorLogs();
  }, []);

  const fetchErrorLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ErrorLogs")
      .select("*")
      .order("CreatedAt", { ascending: false })
      .limit(100);

    if (error) console.error("Error fetching logs:", error);
    else setLogs(data || []);
    setLoading(false);
  };

  const getMethodStyle = (method) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return styles.methodGet;
      case "POST":
        return styles.methodPost;
      case "PUT":
        return styles.methodPut;
      case "DELETE":
        return styles.methodDelete;
      default:
        return styles.methodGet;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Error Logs</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Error Message</th>
                <th>Request URL</th>
                <th>Method</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // 5 Skeleton Rows for Loading State
                [...Array(5)].map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "40px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "220px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "160px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "90px" }}
                      />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>
                    <AlertCircle size={24} style={{ margin: "0 auto 8px" }} />
                    <p>No error logs found.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.Id || log.id}>
                    <td>{log.Id || log.id}</td>
                    <td>{log.UserId || log.user_id || "—"}</td>
                    <td>
                      <span className={styles.errorMessage}>
                        {log.ErrorMessage ||
                          log.error_message ||
                          "Unknown error"}
                      </span>
                    </td>
                    <td style={{ color: "#6b7280" }}>
                      {log.RequestUrl || log.request_url || "—"}
                    </td>
                    <td>
                      <span
                        className={`${styles.methodBadge} ${getMethodStyle(log.RequestMethod || log.request_method)}`}
                      >
                        {log.RequestMethod || log.request_method || "N/A"}
                      </span>
                    </td>
                    <td>
                      {log.CreatedAt || log.created_at
                        ? new Date(
                            log.CreatedAt || log.created_at,
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
