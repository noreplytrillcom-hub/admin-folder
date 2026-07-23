import {
  ChevronDown,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MyProfile from "../profile/MyProfile"; // <-- FIXED RELATIVE PATH HERE
import styles from "./Dashboard.module.css";
export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const dropdownRef = useRef(null);

  // Formatted date string matching UI requirement
  const currentFormattedDate = new Date().toUTCString();

  // Determine user name fallback
  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

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
        {/* PROFILE DROPDOWN SECTION */}
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

          {/* DROPDOWN MENU */}
          {profileOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={`${styles.dropdownItem} ${
                  activeTab === "profile" ? styles.dropdownItemActive : ""
                }`}
                onClick={() => {
                  setActiveTab("profile");
                  setProfileOpen(false);
                }}
              >
                <User size={15} /> My Profile
              </button>
              <button
                className={`${styles.dropdownItem} ${
                  activeTab === "users" ? styles.dropdownItemActive : ""
                }`}
                onClick={() => {
                  setActiveTab("users");
                  setProfileOpen(false);
                }}
              >
                <Users size={15} /> Users
              </button>
              <button
                onClick={signOut}
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className={styles.navSection}>
          <button
            className={`${styles.navItem} ${
              activeTab === "dashboard" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
        </nav>

        <div className={styles.navSection}>
          <span className={styles.sectionHeader}>USERS</span>
          <button
            className={`${styles.navItem} ${
              activeTab === "therapists" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("therapists")}
          >
            <Users size={16} /> Therapists
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "clients" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("clients")}
          >
            <Users size={16} /> Clients
          </button>
        </div>

        <div className={styles.navSection}>
          <span className={styles.sectionHeader}>PARTNERS</span>
          <button
            className={`${styles.navItem} ${
              activeTab === "new-partner" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("new-partner")}
          >
            <HeartHandshake size={16} /> New Partner Registration
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "existing-partners" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("existing-partners")}
          >
            <FileText size={16} /> Existing Partners
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        {activeTab === "dashboard" && (
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeText}>
              <h1>Hello {displayName}, Welcome to Testo</h1>
              <p>{currentFormattedDate}</p>
            </div>
            {/* Vector Graphic Illustration */}
            <img
              src="/SEO analytics team.gif"
              alt="Dashboard Illustration"
              className={styles.bannerIllustration}
            />
          </div>
        )}

        {/* RENDER PROFILE VIEW */}
        {activeTab === "profile" && <MyProfile />}
      </main>
    </div>
  );
}
