import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import styles from "./DashboardHome.module.css";

const DEFAULT_BANNER_IMAGE = "/SEO analytics team.gif";

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Banner Image State from localStorage or Default
  const [bannerImg, setBannerImg] = useState(() => {
    return localStorage.getItem("dashboard_banner_img") || DEFAULT_BANNER_IMAGE;
  });

  // Live Database Metrics State
  const [metrics, setMetrics] = useState({
    clientsCount: 0,
    partnersCount: 0,
    adminUsersCount: 0,
    autoRenewalPartners: 0,
  });
  const [loading, setLoading] = useState(true);

  // Recent Database Records
  const [recentClients, setRecentClients] = useState([]);
  const [recentPartners, setRecentPartners] = useState([]);

  const currentFormattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Administrator";

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  // Fetch real-time metrics from Supabase database
  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      // 1. Fetch Clients count & recent records
      const { data: clientsData, count: clientsCount } = await supabase
        .from("clients")
        .select("*, partners(company_name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(4);

      // 2. Fetch Partners count & recent records
      const { data: partnersData, count: partnersCount } = await supabase
        .from("partners")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(4);

      // 3. Fetch Admin Users count
      const { count: adminUsersCount } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });

      setMetrics({
        clientsCount: clientsCount || (clientsData ? clientsData.length : 0),
        partnersCount: partnersCount || (partnersData ? partnersData.length : 0),
        adminUsersCount: adminUsersCount || 0,
        autoRenewalPartners: partnersData
          ? partnersData.filter((p) => p.enable_auto_renewal).length
          : 0,
      });

      setRecentClients(clientsData || []);
      setRecentPartners(partnersData || []);
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Banner Image File Upload
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please select a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setBannerImg(dataUrl);
      localStorage.setItem("dashboard_banner_img", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Reset Banner to Default Image
  const handleResetBanner = () => {
    setBannerImg(DEFAULT_BANNER_IMAGE);
    localStorage.removeItem("dashboard_banner_img");
  };

  return (
    <div className={styles.container}>
      {/* 1. HERO BANNER CARD WITH CUSTOM IMAGE UPLOAD OPTION */}
      <div className={styles.bannerCard}>
        <div
          className={styles.bannerHeaderBg}
          style={{
            backgroundImage: bannerImg.startsWith("data:")
              ? `url(${bannerImg})`
              : undefined,
          }}
        >
          <div className={styles.bannerOverlay} />

          <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              <h1>Welcome back, {displayName}!</h1>
              <p>{currentFormattedDate} • System Executive Overview</p>
            </div>

            <div className={styles.bannerRight}>
              {!bannerImg.startsWith("data:") && (
                <img
                  src={bannerImg}
                  alt="Dashboard Banner Illustration"
                  className={styles.bannerIllustration}
                />
              )}

              <div className={styles.bannerControls}>
                <label className={styles.uploadBannerBtn} title="Upload Custom Banner Image">
                  <Camera size={16} />
                  <span>Change Banner Img</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    hidden
                  />
                </label>

                {bannerImg !== DEFAULT_BANNER_IMAGE && (
                  <button
                    onClick={handleResetBanner}
                    className={styles.resetBannerBtn}
                    title="Reset to Default Image"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME METRIC KPI CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapperBlue}>
            <Users size={22} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statLabel}>Registered Clients</span>
            <h2 className={styles.statValue}>{loading ? "..." : metrics.clientsCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperIndigo}>
            <Building2 size={22} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statLabel}>Active Partners</span>
            <h2 className={styles.statValue}>{loading ? "..." : metrics.partnersCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperPurple}>
            <Shield size={22} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statLabel}>System Admin Users</span>
            <h2 className={styles.statValue}>{loading ? "..." : metrics.adminUsersCount}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapperGreen}>
            <Zap size={22} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statLabel}>System Health</span>
            <h2 className={styles.statValue}>99.9%</h2>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS SHORTCUT BAR */}
      <div className={styles.quickActionsCard}>
        <div className={styles.quickTitle}>
          <Sparkles size={18} color="#6366f1" /> Quick Portal Shortcuts
        </div>

        <div className={styles.actionButtonsGroup}>
          <button
            onClick={() => navigate("/admin/users/create")}
            style={{
              backgroundColor: "#0f172a",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={15} /> Add Client
          </button>

          <button
            onClick={() => navigate("/partner-registration")}
            style={{
              backgroundColor: "#6366f1",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <HeartHandshake size={15} /> Register Partner
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            style={{
              backgroundColor: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Users size={15} /> User Directory
          </button>

          <button
            onClick={() => navigate("/admin/error-logs")}
            style={{
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              border: "1px solid #fecaca",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <AlertTriangle size={15} /> Error Logs
          </button>
        </div>
      </div>

      {/* 4. TWO COLUMN DATA OVERVIEW GRID */}
      <div className={styles.twoColGrid}>
        {/* RECENT PARTNERS LIST */}
        <div className={styles.dashboardSectionCard}>
          <div className={styles.sectionCardHeader}>
            <h3 className={styles.sectionCardTitle}>
              <Building2 size={18} color="#6366f1" /> Recent Enterprise Partners
            </h3>
            <Link
              to="/existing-partners"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.miniList}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : recentPartners.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>
                No recent partner records.
              </div>
            ) : (
              recentPartners.map((p) => (
                <div key={p.id} className={styles.miniListItem}>
                  <div className={styles.itemLeft}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        backgroundColor: "#e0e7ff",
                        color: "#4f46e5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {(p.company_name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={styles.itemTitle}>{p.company_name}</div>
                      <div className={styles.itemSub}>
                        {p.primary_email || p.base_currency || "Enterprise"}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: p.enable_auto_renewal ? "#10b981" : "#f59e0b",
                      backgroundColor: p.enable_auto_renewal ? "#d1fae5" : "#fef3c7",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {p.enable_auto_renewal ? "Auto Renewal" : "Manual"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT CLIENTS LIST */}
        <div className={styles.dashboardSectionCard}>
          <div className={styles.sectionCardHeader}>
            <h3 className={styles.sectionCardTitle}>
              <Users size={18} color="#2563eb" /> Recent Client Registrations
            </h3>
            <Link
              to="/clients"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.miniList}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : recentClients.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>
                No recent client records.
              </div>
            ) : (
              recentClients.map((c) => {
                const name =
                  `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Client User";
                return (
                  <div key={c.id} className={styles.miniListItem}>
                    <div className={styles.itemLeft}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          backgroundColor: "#dbeafe",
                          color: "#1d4ed8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.itemTitle}>{name}</div>
                        <div className={styles.itemSub}>
                          {c.partners?.company_name || "Individual User"}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: c.is_active ? "#10b981" : "#ef4444",
                        backgroundColor: c.is_active ? "#d1fae5" : "#fee2e2",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
