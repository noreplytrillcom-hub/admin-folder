import { Activity, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import styles from "../exceptions/Logs.module.css";

export default function JobLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobLogs();
  }, []);

  const fetchJobLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("JobLogs")
      .select("*")
      .order("ExecutedAt", { ascending: false })
      .limit(100);

    if (error) console.error("Error fetching job logs:", error);
    else setLogs(data || []);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Job Logs</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Job Name</th>
                <th>Status</th>
                <th>Execution Time</th>
                <th>Details</th>
                <th>Executed At</th>
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
                        style={{ width: "140px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "70px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <div
                        className={styles.skeleton}
                        style={{ width: "180px" }}
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
                    <Activity size={24} style={{ margin: "0 auto 8px" }} />
                    <p>No job logs found.</p>
                  </td>
                </tr>
              ) : (
                logs.map((job) => {
                  const isSuccess =
                    (job.Status || job.status)?.toLowerCase() === "success";
                  return (
                    <tr key={job.Id || job.id}>
                      <td>{job.Id || job.id}</td>
                      <td style={{ color: "#2563eb", fontWeight: 500 }}>
                        {job.JobName || job.job_name}
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${isSuccess ? styles.statusSuccess : styles.statusFailed}`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {job.Status || job.status || "Unknown"}
                        </span>
                      </td>
                      <td>
                        {job.ExecutionTime || job.execution_time || "—"} ms
                      </td>
                      <td style={{ color: "#6b7280" }}>
                        {job.Details || job.details || "—"}
                      </td>
                      <td>
                        {job.ExecutedAt || job.executed_at
                          ? new Date(
                              job.ExecutedAt || job.executed_at,
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
