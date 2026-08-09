import {
  Activity,
  AlertTriangle,
  Bell,
  ChevronDown,
  FileCheck,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Mail,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);

  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User Profile";

  // Clean up OAuth hash fragment
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to map route path to breadcrumb page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard Overview";
    if (path.includes("/profile")) return "My Profile";
    if (path.includes("/clients")) return "Clients Directory";
    if (path.includes("/partner-registration")) return "Partner Registration";
    if (path.includes("/existing-partners")) return "Existing Partners";
    if (path.includes("/partner-contracts")) return "Partner Contracts Management";
    if (path.includes("/admin/users")) return "Testo User Directory";
    if (path.includes("/admin/email-logs")) return "Resend Email & Code Logs";
    if (path.includes("/admin/error-logs")) return "Error & Exception Logs";
    if (path.includes("/admin/job-logs")) return "Job & Worker Logs";
    return "Admin Portal";
  };

  return (
    <div className={styles.container}>
      {/* LEFT SIDEBAR (MIDNIGHT SLATE & GLOWING BRAND) */}
      <aside className={styles.sidebar}>
        {/* BRAND LOGO HEADER */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogoIcon}>T</div>
          <div className={styles.brandMeta}>
            <span className={styles.brandName}>testo</span>
            <span className={styles.brandBadge}>ENTERPRISE PORTAL</span>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION SECTIONS */}
        <div className={styles.navScrollArea}>
          <div className={styles.navSection}>
            <span className={styles.sectionHeader}>OVERVIEW</span>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </div>

          <div className={styles.navSection}>
            <span className={styles.sectionHeader}>CLIENT MANAGEMENT</span>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <Users size={17} /> Clients Directory
            </NavLink>
          </div>

          <div className={styles.navSection}>
            <span className={styles.sectionHeader}>PARTNER MANAGEMENT</span>
            <NavLink
              to="/partner-registration"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <HeartHandshake size={17} /> New Partner Registration
            </NavLink>
            <NavLink
              to="/existing-partners"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <FileText size={17} /> Existing Partners
            </NavLink>
            <NavLink
              to="/partner-contracts"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <FileCheck size={17} /> Partner Contracts
            </NavLink>
          </div>

          <div className={styles.navSection}>
            <span className={styles.sectionHeader}>SYSTEM & AUDIT LOGS</span>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <ShieldCheck size={17} /> Testo User Directory
            </NavLink>
            <NavLink
              to="/admin/email-logs"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <Mail size={17} /> Email Logs
            </NavLink>
            <NavLink
              to="/admin/error-logs"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <AlertTriangle size={17} /> Error Logs
            </NavLink>
            <NavLink
              to="/admin/job-logs"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <Activity size={17} /> Job Logs
            </NavLink>
          </div>
        </div>
      </aside>

      {/* RIGHT WORKSPACE WRAPPER */}
      <div className={styles.mainContentWrapper}>
        {/* STICKY TOP NAVBAR */}
        <header className={styles.topNavbar}>
          <div className={styles.topNavLeft}>
            <h2 className={styles.pageTitleDisplay}>{getPageTitle()}</h2>
          </div>

          <div className={styles.topNavRight}>
            {/* NOTIFICATION BELL */}
            <button
              className={styles.iconActionBtn}
              title="Notifications"
            >
              <Bell size={18} />
              <span className={styles.notificationBadge} />
            </button>

            {/* PROFILE MENU DROPDOWN */}
            <div className={styles.profileSection} ref={dropdownRef}>
              <div
                className={styles.profileHeader}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {user?.avatar_url && !imgError ? (
                  <img
                    src={user.avatar_url}
                    alt={displayName}
                    className={styles.avatar}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}
                <div className={styles.profileDetails}>
                  <span className={styles.profileName}>{displayName}</span>
                  <span className={styles.profileRole}>Administrator</span>
                </div>
                <ChevronDown size={14} color="#64748b" style={{ marginLeft: 2 }} />
              </div>

              {profileOpen && (
                <div className={styles.dropdownMenu}>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `${styles.dropdownItem} ${
                        isActive ? styles.dropdownItemActive : ""
                      }`
                    }
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={15} /> My Profile
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `${styles.dropdownItem} ${
                        isActive ? styles.dropdownItemActive : ""
                      }`
                    }
                    onClick={() => setProfileOpen(false)}
                  >
                    <Users size={15} /> Users Directory
                  </NavLink>

                  <button
                    onClick={signOut}
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT */}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
