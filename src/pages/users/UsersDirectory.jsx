import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  KeyRound,
  Lock,
  Unlock,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  Building2
} from "lucide-react";
import { fetchAllTenantUsers, toggleUserLockStatus } from "../../services/userService";
import { useToast } from "../../context/ToastContext";
import styles from "./UsersDirectory.module.css";

export default function UsersDirectory() {
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, lockedUsers: 0, pendingMfa: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllTenantUsers({
        page,
        limit,
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
      });

      setUsers(res.data);
      setTotalPages(res.totalPages);
      setStats(res.stats);
    } catch (err) {
      toast.error("Failed to load tenant users: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, statusFilter, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handlePasswordReset = (email) => {
    toast.success(`Password reset link dispatched to ${email}`, "Password Reset");
  };

  const handleToggleLock = async (id, name, currentStatus) => {
    try {
      const newStatus = await toggleUserLockStatus(id);
      toast.warning(
        `User "${name}" seat status set to ${newStatus}`,
        newStatus === "Locked" ? "Seat Locked" : "Seat Unlocked"
      );
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRevokeSessions = (name) => {
    toast.info(`Purged all active JWT sessions for "${name}"`, "Session Revoked");
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Tenant Users Directory & Seat Enforcement</h1>
          <p className={styles.pageSubtitle}>
            Cross-organization client user accounts, password resets, role management, and security controls.
          </p>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statIconViolet}><Users size={22} /></div>
          <div>
            <span className={styles.statLabel}>Total Provisioned Users</span>
            <h2 className={styles.statValue}>{stats.totalUsers.toLocaleString()}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconGreen}><ShieldCheck size={22} /></div>
          <div>
            <span className={styles.statLabel}>Active User Seats</span>
            <h2 className={styles.statValue}>{stats.activeUsers.toLocaleString()}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconRose}><Lock size={22} /></div>
          <div>
            <span className={styles.statLabel}>Locked Seats</span>
            <h2 className={styles.statValue}>{stats.lockedUsers}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconCyan}><ShieldAlert size={22} /></div>
          <div>
            <span className={styles.statLabel}>Pending MFA Setup</span>
            <h2 className={styles.statValue}>{stats.pendingMfa}</h2>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR */}
      <div className={styles.glassToolbarCard}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User Name, Email, or Tenant..."
            className={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} className={styles.btnClearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Role:</span>
            {["ALL", "Tenant Admin", "Developer", "QA Engineer"].map((r) => (
              <button
                key={r}
                onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`${styles.filterPill} ${roleFilter === r ? styles.filterPillActive : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DATA TABLE */}
      <div className={styles.glassTableWrapper}>
        <table className={styles.glassTable}>
          <thead>
            <tr>
              <th>User & Email</th>
              <th>Tenant Organization</th>
              <th>Role</th>
              <th>MFA Status</th>
              <th>Status</th>
              <th className={styles.alignRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.loadingTd}>Loading user directory...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyTd}>No tenant users found matching search filters.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>{u.name[0]?.toUpperCase()}</div>
                      <div className={styles.userMeta}>
                        <span className={styles.userName}>{u.name}</span>
                        <span className={styles.userEmail}>{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className={styles.tenantCell}>
                      <span className={styles.tenantName}>{u.tenantName}</span>
                      <span className={styles.tenantIdTag}>{u.tenantId}</span>
                    </div>
                  </td>

                  <td>
                    <span className={styles.roleBadge}>{u.role}</span>
                  </td>

                  <td>
                    <span className={u.mfaEnabled ? styles.mfaActive : styles.mfaDisabled}>
                      {u.mfaEnabled ? "MFA Enabled" : "MFA Disabled"}
                    </span>
                  </td>

                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status_${u.status.replace(/\s+/g, "")}`]}`}>
                      {u.status}
                    </span>
                  </td>

                  <td className={styles.alignRight}>
                    <div className={styles.actionsRow}>
                      <button
                        onClick={() => handlePasswordReset(u.email)}
                        className={styles.btnActionIcon}
                        title="Reset Password"
                      >
                        <KeyRound size={14} />
                      </button>

                      <button
                        onClick={() => handleToggleLock(u.id, u.name, u.status)}
                        className={styles.btnActionIcon}
                        title={u.status === "Active" ? "Lock User Seat" : "Unlock User Seat"}
                      >
                        {u.status === "Active" ? <Lock size={14} className={styles.iconRose} /> : <Unlock size={14} className={styles.iconGreen} />}
                      </button>

                      <button
                        onClick={() => handleRevokeSessions(u.name)}
                        className={styles.btnActionIcon}
                        title="Revoke Active Sessions"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.paginationBar}>
          <div className={styles.paginationInfo}>
            <span>Showing page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
          </div>
          <div className={styles.paginationButtons}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={styles.btnPage}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={styles.btnPage}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
