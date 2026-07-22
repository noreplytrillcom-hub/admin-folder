import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  TestTube,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tests", label: "Test Suites", icon: TestTube },
    { id: "approvals", label: "Approvals", icon: FileCheck },
    { id: "billing", label: "Billing & Usage", icon: CreditCard },
    { id: "partners", label: "Partners", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    {
      title: "Active Tests",
      value: "1,284",
      change: "+12%",
      icon: Activity,
      color: "#818cf8",
    },
    {
      title: "Passed Runs",
      value: "99.4%",
      change: "+0.2%",
      icon: CheckCircle2,
      color: "#34d399",
    },
    {
      title: "Failed Suites",
      value: "12",
      change: "-4%",
      icon: AlertCircle,
      color: "#f87171",
    },
    {
      title: "Avg Execution Time",
      value: "1.2s",
      change: "-18%",
      icon: Clock,
      color: "#fbbf24",
    },
  ];

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${
          collapsed ? styles.sidebarCollapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logoBadge}>T</div>
          {!collapsed && <span className={styles.logoText}>testo</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseBtn}
            title="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className={styles.navGroup}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${styles.navItem} ${
                  isActive ? styles.navItemActive : ""
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userAvatar}>
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.user_metadata?.full_name || "Admin User"}
              </span>
              <span className={styles.userRole}>
                {user?.role || "Administrator"}
              </span>
            </div>
          )}
          <button
            onClick={signOut}
            className={styles.logoutBtn}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search tests, logs, deployments..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>
              <Bell size={18} />
            </button>
            <div className={styles.roleTag}>
              {user?.role?.toUpperCase() || "ADMIN"}
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>
            <p className={styles.pageSubtitle}>
              Welcome back, {user?.email}! Here is your automated test suite
              health.
            </p>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardTitle}>{stat.title}</span>
                    <div
                      className={styles.iconWrapper}
                      style={{
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                      }}
                    >
                      <StatIcon size={20} />
                    </div>
                  </div>
                  <div className={styles.cardBottom}>
                    <span className={styles.cardValue}>{stat.value}</span>
                    <span
                      className={styles.cardChange}
                      style={{
                        color: stat.change.startsWith("+")
                          ? "#34d399"
                          : "#f87171",
                      }}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Recent Test Runs</h3>
            <div className={styles.tablePlaceholder}>
              <div className={styles.tableRowHeader}>
                <span>Suite Name</span>
                <span>Environment</span>
                <span>Status</span>
                <span>Duration</span>
              </div>
              <div className={styles.tableRow}>
                <span>Authentication & SSO Flow</span>
                <span className={styles.badge}>Production</span>
                <span style={{ color: "#34d399", fontWeight: "600" }}>
                  Passed
                </span>
                <span>1.4s</span>
              </div>
              <div className={styles.tableRow}>
                <span>Stripe Payment API Handshake</span>
                <span className={styles.badge}>Staging</span>
                <span style={{ color: "#34d399", fontWeight: "600" }}>
                  Passed
                </span>
                <span>0.8s</span>
              </div>
              <div className={styles.tableRow}>
                <span>E2E Order Confirmation Email</span>
                <span className={styles.badge}>Development</span>
                <span style={{ color: "#fbbf24", fontWeight: "600" }}>
                  Running...
                </span>
                <span>2.1s</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
