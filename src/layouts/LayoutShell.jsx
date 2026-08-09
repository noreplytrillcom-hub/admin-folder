import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Users,
  CreditCard,
  Cpu,
  ListTree,
  Sparkles,
  Receipt,
  Tag,
  Server,
  ToggleRight,
  FileCheck2,
  ShieldCheck,
  HeartPulse,
  Ticket,
  Settings,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  ChevronDown,
  Command,
  Layers,
  Lock,
  Activity
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import styles from "./LayoutShell.module.css";

// Complete 18-Page Navigation Map Grouped into 6 Operational Categories
const NAV_SECTIONS = [
  {
    header: "EXECUTIVE & OVERVIEW",
    items: [
      { text: "Business Overview", path: "/dashboard", icon: <LayoutDashboard size={17} /> },
      { text: "Deep-Dive Analytics", path: "/analytics", icon: <TrendingUp size={17} /> },
    ],
  },
  {
    header: "TENANT & CLIENT MANAGEMENT",
    items: [
      { text: "Organizations Directory", path: "/organizations", icon: <Building2 size={17} />, badge: "Multi-tenant" },
      { text: "Tenant User Accounts", path: "/users", icon: <Users size={17} /> },
      { text: "Subscription Contracts", path: "/subscriptions", icon: <CreditCard size={17} /> },
    ],
  },
  {
    header: "COMPUTE & AI INFRASTRUCTURE",
    items: [
      { text: "Worker Node Pool", path: "/compute", icon: <Cpu size={17} /> },
      { text: "Live Execution Queue", path: "/execution-queue", icon: <ListTree size={17} /> },
      { text: "LLM Token & AI Usage", path: "/ai-usage", icon: <Sparkles size={17} /> },
    ],
  },
  {
    header: "BILLING & REVENUE",
    items: [
      { text: "Invoices & Ledger", path: "/billing/invoices", icon: <Receipt size={17} /> },
      { text: "Credits & Coupons", path: "/billing/discounts", icon: <Tag size={17} /> },
    ],
  },
  {
    header: "OPERATIONAL CONTROL",
    items: [
      { text: "API Gateway Control", path: "/gateway", icon: <Server size={17} /> },
      { text: "Feature Flags", path: "/feature-flags", icon: <ToggleRight size={17} /> },
      { text: "Audit Logs & Diff", path: "/audit-logs", icon: <FileCheck2 size={17} /> },
      { text: "Security & MFA", path: "/security", icon: <Lock size={17} /> },
    ],
  },
  {
    header: "SUPPORT & DIAGNOSTICS",
    items: [
      { text: "System & Cluster Health", path: "/system-health", icon: <HeartPulse size={17} /> },
      { text: "Support & Test Runs", path: "/support/tickets", icon: <Ticket size={17} /> },
      { text: "Admin Settings", path: "/settings", icon: <Settings size={17} /> },
    ],
  },
];

export default function LayoutShell() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

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

  // Keyboard shortcut listener (Ctrl+K or Cmd+K for quick search focus)
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search-input")?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.info("Signed out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to sign out: " + err.message);
    }
  };

  // Helper to generate dynamic breadcrumb trail for all 18 routes
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Super-Admin Portal", path: "/dashboard" }];

    if (pathSegments.length === 0 || pathSegments[0] === "dashboard") {
      crumbs.push({ label: "Executive Operations", path: "/dashboard" });
    } else if (pathSegments[0] === "analytics") {
      crumbs.push({ label: "Deep-Dive Analytics", path: "/analytics" });
    } else if (pathSegments[0] === "organizations") {
      crumbs.push({ label: "Tenant Organizations", path: "/organizations" });
      if (pathSegments[1]) {
        crumbs.push({ label: `Tenant #${pathSegments[1]}`, path: `/organizations/${pathSegments[1]}` });
      }
    } else if (pathSegments[0] === "users") {
      crumbs.push({ label: "Tenant User Accounts", path: "/users" });
    } else if (pathSegments[0] === "subscriptions") {
      crumbs.push({ label: "Subscriptions & Contracts", path: "/subscriptions" });
    } else if (pathSegments[0] === "compute") {
      crumbs.push({ label: "Worker Node Pool", path: "/compute" });
    } else if (pathSegments[0] === "execution-queue") {
      crumbs.push({ label: "Live Execution Queue", path: "/execution-queue" });
    } else if (pathSegments[0] === "ai-usage") {
      crumbs.push({ label: "LLM & AI Usage Metrics", path: "/ai-usage" });
    } else if (pathSegments[0] === "billing") {
      crumbs.push({ label: "Billing", path: "/billing/invoices" });
      if (pathSegments[1] === "invoices") {
        crumbs.push({ label: "Invoices & Ledger", path: "/billing/invoices" });
      } else if (pathSegments[1] === "discounts") {
        crumbs.push({ label: "Credits & Discounts", path: "/billing/discounts" });
      }
    } else if (pathSegments[0] === "gateway") {
      crumbs.push({ label: "API Gateway Control", path: "/gateway" });
    } else if (pathSegments[0] === "feature-flags") {
      crumbs.push({ label: "Feature Flags", path: "/feature-flags" });
    } else if (pathSegments[0] === "audit-logs") {
      crumbs.push({ label: "Audit Logs & Diff", path: "/audit-logs" });
    } else if (pathSegments[0] === "security") {
      crumbs.push({ label: "Security & MFA", path: "/security" });
    } else if (pathSegments[0] === "system-health") {
      crumbs.push({ label: "System Health & Clusters", path: "/system-health" });
    } else if (pathSegments[0] === "support") {
      crumbs.push({ label: "Support & Test Diagnostics", path: "/support/tickets" });
    } else if (pathSegments[0] === "settings") {
      crumbs.push({ label: "Admin Settings", path: "/settings" });
    } else if (pathSegments[0] === "profile") {
      crumbs.push({ label: "Operator Profile", path: "/profile" });
    }

    return crumbs;
  };

  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Admin Operator";

  const userRole = user?.role || "Super-Admin";

  return (
    <div className={styles.appShellContainer}>
      {/* ANIMATED GLOWING MESH GRADIENT BACKGROUND ORBS */}
      <div className="mesh-gradient-bg">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
        <div className="mesh-orb mesh-orb-4" />
      </div>

      {/* FROSTED GLASS SIDEBAR NAVIGATION (18 ROUTES) */}
      <aside className={styles.glassSidebar}>
        {/* BRAND IDENTITY HEADER */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogoIcon}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div className={styles.brandMeta}>
            <span className={styles.brandName}>testo</span>
            <span className={styles.brandBadge}>AI AUTONOMOUS SAAS</span>
          </div>
        </div>

        {/* NAVIGATION SCROLL AREA FOR ALL 18 ROUTES */}
        <div className={styles.navScrollArea}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.header} className={styles.navSection}>
              <span className={styles.sectionHeader}>{section.header}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navText}>{item.text}</span>
                  {item.badge && <span className={styles.navPillBadge}>{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* SIDEBAR FOOTER SYSTEM STATUS CARD */}
        <div className={styles.sidebarFooter}>
          <div className={styles.statusBox}>
            <div className={styles.statusPulseGroup}>
              <span className={styles.pulseDot} />
              <span className={styles.statusText}>99.98% Cluster Health</span>
            </div>
            <span className={styles.statusSubtext}>32 Worker Nodes Active</span>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <div className={styles.workspaceWrapper}>
        {/* GLASS TOP NAVBAR */}
        <header className={styles.glassTopNavbar}>
          {/* BREADCRUMB TRAIL */}
          <div className={styles.topNavLeft}>
            <nav className={styles.breadcrumbsNav} aria-label="Breadcrumbs">
              {getBreadcrumbs().map((crumb, idx, arr) => {
                const isLast = idx === arr.length - 1;
                return (
                  <div key={crumb.path + idx} className={styles.crumbItem}>
                    {idx > 0 && <ChevronRight size={14} className={styles.crumbSep} />}
                    {isLast ? (
                      <span className={styles.crumbActive}>{crumb.label}</span>
                    ) : (
                      <Link to={crumb.path} className={styles.crumbLink}>
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* TOP NAVBAR RIGHT UTILITIES */}
          <div className={styles.topNavRight}>
            {/* LIVE SYSTEM STATUS BADGE */}
            <div className={styles.systemStatusPill} title="All cluster microservices operational">
              <span className={styles.greenDot} />
              <span className={styles.systemStatusText}>Operational</span>
            </div>

            {/* GLOBAL SEARCH INPUT */}
            <div className={styles.globalSearchWrapper}>
              <Search size={15} className={styles.searchIcon} />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search portal (Ctrl+K)..."
                className={styles.globalSearchInput}
              />
              <div className={styles.hotkeyTag} title="Press Ctrl+K to search">
                <Command size={11} /> K
              </div>
            </div>

            {/* NOTIFICATION BELL ACTION */}
            <button
              onClick={() => toast.info("No unread system alerts", "Notifications")}
              className={styles.glassIconButton}
              title="System Alerts"
            >
              <Bell size={18} />
              <span className={styles.notificationDot} />
            </button>

            {/* ADMIN AVATAR & PROFILE MENU */}
            <div className={styles.profileSection} ref={dropdownRef}>
              <div
                className={styles.profileHeaderBtn}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {user?.avatar_url && !imgError ? (
                  <img
                    src={user.avatar_url}
                    alt={displayName}
                    className={styles.avatarImg}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}
                <div className={styles.profileDetails}>
                  <span className={styles.profileName}>{displayName}</span>
                  <span className={styles.profileRoleTag}>{userRole}</span>
                </div>
                <ChevronDown size={14} className={styles.chevronIcon} />
              </div>

              {/* DROPDOWN MENU PANE */}
              {profileOpen && (
                <div className={styles.glassDropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownUserEmail}>{user?.email || "admin@testo.com"}</p>
                    <span className={styles.roleBadge}>{userRole} Access</span>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={15} /> Operator Profile
                  </Link>

                  <Link
                    to="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={15} /> Portal Settings
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button
                    onClick={handleSignOut}
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  >
                    <LogOut size={15} /> Sign Out Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CANVAS OUTLET */}
        <main className={styles.mainCanvas}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
