import {
  Activity,
  AlertTriangle,
  ChevronDown,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);

  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

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

  return (
    <div className={styles.container}>
      {/* LEFT SIDEBAR */}
      <aside className={styles.sidebar}>
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
              <span className={styles.profileTrigger}>
                Profile <ChevronDown size={12} />
              </span>
            </div>
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
                <Users size={15} /> Users
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

        <nav className={styles.navSection}>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        </nav>

        <div className={styles.navSection}>
          <span className={styles.sectionHeader}>USERS</span>
          <NavLink
            to="/therapists"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <Users size={16} /> Therapists
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <Users size={16} /> Clients
          </NavLink>
        </div>

        <div className={styles.navSection}>
          <span className={styles.sectionHeader}>PARTNERS</span>
          <NavLink
            to="/partner-registration"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <HeartHandshake size={16} /> New Partner Registration
          </NavLink>
          <NavLink
            to="/existing-partners"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <FileText size={16} /> Existing Partners
          </NavLink>
        </div>

        {/* SYSTEM LOGS SECTION */}
        <div className={styles.navSection}>
          <span className={styles.sectionHeader}>SYSTEM LOGS</span>
          <NavLink
            to="/admin/error-logs"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <AlertTriangle size={16} /> Error Logs
          </NavLink>
          <NavLink
            to="/admin/job-logs"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <Activity size={16} /> Job Logs
          </NavLink>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
