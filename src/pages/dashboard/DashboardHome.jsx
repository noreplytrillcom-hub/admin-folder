import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Compass,
  Cpu,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  HardDrive,
  HeartHandshake,
  Image as ImageIcon,
  Layers,
  Lock,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Terminal,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./DashboardHome.module.css";

const DEFAULT_BANNER_IMAGE = "/SEO analytics team.gif";

// Mock AI Testing & Usage Metrics Data
const INITIAL_TEST_METRICS = [
  {
    id: "tst-1",
    title: "Multimodal LLM Edge-Case Test Suite",
    partner: "Apex Cognitive Systems",
    quota: "100M Tokens",
    progress: 85,
    category: "Active Testers",
    status: "Active",
    rateLimit: "500 QPS"
  },
  {
    id: "tst-2",
    title: "PII Redaction & Guardrails Suite",
    partner: "Acme Cloud Solutions",
    quota: "50M Tokens",
    progress: 100,
    category: "Captured Solutions",
    status: "Completed",
    rateLimit: "250 QPS"
  },
  {
    id: "tst-3",
    title: "Fine-Tuning Safety Benchmark v2",
    partner: "Vortex Data Labs",
    quota: "250M Tokens",
    progress: 40,
    category: "Resellers",
    status: "Active",
    rateLimit: "1,000 QPS"
  },
  {
    id: "tst-4",
    title: "Zero-Data Retention Latency Audit",
    partner: "Nexus Cybernetics",
    quota: "75M Tokens",
    progress: 10,
    category: "Active Testers",
    status: "Enrolled",
    rateLimit: "300 QPS"
  }
];

// Mock Live Issue Stream & SDK Logs Data
const INITIAL_ISSUES = [
  {
    id: "iss-101",
    title: "Hallucination in Model v2.4 Payload",
    partner: "Apex Cognitive Systems",
    timeElapsed: "5m ago",
    severity: "High",
    category: "LLM Output",
    logDetails: "Model returned invalid JSON schema on step 3 prompt execution."
  },
  {
    id: "iss-102",
    title: "PII Leakage Trigger in Context Window",
    partner: "Acme Cloud Solutions",
    timeElapsed: "18m ago",
    severity: "Critical",
    category: "Guardrails Filter",
    logDetails: "Custom redactor intercepted un-masked email string in prompt payload."
  },
  {
    id: "iss-103",
    title: "Rate Limit Concurrency Spike (1.2k QPS)",
    partner: "Vortex Data Labs",
    timeElapsed: "42m ago",
    severity: "Moderate",
    category: "API Gateway",
    logDetails: "Partner exceeded 1,000 QPS ceiling. Throttling applied successfully."
  },
  {
    id: "iss-104",
    title: "SDK Stream Disconnect on Token 4096",
    partner: "Nexus Cybernetics",
    timeElapsed: "1h ago",
    severity: "Resolved",
    category: "SDK Sync",
    logDetails: "WebSocket buffer overflow caught and auto-reconnected."
  }
];

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Header Dropdown View Selection
  const [dashboardView, setDashboardView] = useState("User Dashboard v");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  // Banner Customization State
  const [bannerImg, setBannerImg] = useState(() => {
    return localStorage.getItem("dashboard_banner_img") || DEFAULT_BANNER_IMAGE;
  });
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Card 1: Partner Ecosystem Overview State
  const [ecosystemGoals, setEcosystemGoals] = useState(
    "Enable partners to sell, test, and capture AI model edge cases safely. Our platform provides automated guardrails, real-time SDK telemetry, and instant contract execution for enterprise integrations."
  );

  // Card 3: AI Testing Tabs Filter ('All', 'Active Testers', 'Resellers', 'Captured Solutions')
  const [testMetricTab, setTestMetricTab] = useState("All");

  // Log Inspection Modal State
  const [selectedIssueLog, setSelectedIssueLog] = useState(null);
  const [isAllIssuesModalOpen, setIsAllIssuesModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Time-based greeting (e.g. Good evening, Good morning)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentFormattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Administrator";

  // Banner Upload Handler
  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setBannerImg(dataUrl);
      localStorage.setItem("dashboard_banner_img", dataUrl);
      setIsCustomizeModalOpen(false);
      showToast("Aether AI hero banner updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleResetBanner = () => {
    setBannerImg(DEFAULT_BANNER_IMAGE);
    localStorage.removeItem("dashboard_banner_img");
    setIsCustomizeModalOpen(false);
    showToast("Banner reset to default theme.");
  };

  // Filtered Testing Metrics
  const filteredMetrics = INITIAL_TEST_METRICS.filter((item) => {
    if (testMetricTab === "All") return true;
    return item.category === testMetricTab;
  });

  return (
    <div className={styles.container}>
      
      {/* Toast Alert */}
      {toast && (
        <div className={styles.toastBanner}>
          <Sparkles size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. OVERALL PAGE LAYOUT: TOP HEADER BAR (Light Theme) */}
      <div className={styles.headerSection}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.greetingTitle}>{getGreeting()}, {displayName}! 👋</h1>
          <p className={styles.dateSubtext}>{currentFormattedDate} • Aether AI Partner Portal & Testing Platform</p>
        </div>

        {/* Right side: Clean white dropdown menu for switching views */}
        <div className={styles.headerDropdownWrapper}>
          <button
            onClick={() => setIsViewDropdownOpen((prev) => !prev)}
            className={styles.viewDropdownBtn}
          >
            <span>{dashboardView}</span>
            <ChevronDown size={16} />
          </button>

          {isViewDropdownOpen && (
            <div className={styles.viewDropdownMenu}>
              <button
                onClick={() => { setDashboardView("User Dashboard v"); setIsViewDropdownOpen(false); }}
                className={`${styles.viewOption} ${dashboardView === "User Dashboard v" ? styles.viewActive : ""}`}
              >
                User Dashboard v
              </button>
              <button
                onClick={() => { setDashboardView("Admin Overview"); setIsViewDropdownOpen(false); }}
                className={`${styles.viewOption} ${dashboardView === "Admin Overview" ? styles.viewActive : ""}`}
              >
                Admin Overview
              </button>
              <button
                onClick={() => { setDashboardView("Partner Testing Portal"); setIsViewDropdownOpen(false); }}
                className={`${styles.viewOption} ${dashboardView === "Partner Testing Portal" ? styles.viewActive : ""}`}
              >
                Partner Testing Portal
              </button>
              <button
                onClick={() => { setDashboardView("Developer API Console"); setIsViewDropdownOpen(false); }}
                className={`${styles.viewOption} ${dashboardView === "Developer API Console" ? styles.viewActive : ""}`}
              >
                Developer API Console
              </button>
            </div>
          )}
        </div>
      </div>


      {/* 2. TOP MAIN BANNER (CUSTOMIZABLE HERO CARD) */}
      <div className={styles.bannerCard}>
        <div
          className={styles.bannerHeaderBg}
          style={{
            backgroundImage: bannerImg.startsWith("data:") ? `url(${bannerImg})` : undefined
          }}
        >
          <div className={styles.bannerOverlay} />

          <div className={styles.bannerContent}>
            <div className={styles.bannerBrandRow}>
              <div className={styles.bannerLogoBox}>
                <Brain className={styles.bannerLogoIcon} size={24} />
              </div>
              <div className={styles.bannerText}>
                <h2>Aether AI Partner Network</h2>
                <p>Enterprise AI Model Testing, Edge-Case Capture & Contract Management System</p>
              </div>
            </div>

            {/* Customise / Banner Upload Button: Bottom-Right Corner */}
            <div className={styles.bannerBottomRightControls}>
              <button
                onClick={() => setIsCustomizeModalOpen(true)}
                className={styles.btnCustomisePill}
                title="Customise Hero Banner Image"
              >
                <Settings size={14} />
                <span>Customise</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* 3. 4-CARD GRID LAYOUT (2x2 SPLIT GRID) */}
      <div className={styles.fourCardsGrid}>
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN CARDS                                                         */}
        {/* ========================================================================= */}
        <div className={styles.columnGroup}>
          
          {/* CARD 1 (TOP LEFT): "PARTNER ECOSYSTEM OVERVIEW" (Replaces Our Mission) */}
          <div className={styles.dashboardCard}>
            
            {/* Light Blue Header */}
            <div className={styles.cardLightBlueHeader}>
              <div className={styles.headerTitleWrap}>
                <Target size={18} className={styles.headerIcon} />
                <h3 className={styles.cardHeaderTitle}>Partner Ecosystem Overview</h3>
              </div>
              <span className={styles.headerBadge}>Platform Goals</span>
            </div>

            {/* Card Content */}
            <div className={styles.cardBody}>
              
              {/* Clean Vector Icon & Platform Objectives */}
              <div className={styles.overviewGraphicBox}>
                <div className={styles.graphicCircle}>
                  <Compass size={28} className={styles.compassIcon} />
                </div>
                <p className={styles.graphicInstructionLabel}>
                  Enable partners to sell, test, and capture AI model edge cases safely
                </p>
              </div>

              {/* Editable Goals Text Area */}
              <div className={styles.goalsInputGroup}>
                <label className={styles.inputBoxLabel}>Ecosystem Goals & Security Commitments</label>
                <textarea
                  className={styles.goalsTextarea}
                  rows={4}
                  value={ecosystemGoals}
                  onChange={(e) => setEcosystemGoals(e.target.value)}
                />
              </div>

              {/* Quick Action Buttons */}
              <div className={styles.overviewCardFooter}>
                <button
                  onClick={() => showToast("Ecosystem strategic goals updated!")}
                  className={styles.btnSaveGoals}
                >
                  <CheckCircle2 size={15} /> Save Platform Goals
                </button>

                <div className={styles.quickLinksGroup}>
                  <button onClick={() => navigate("/partner-registration")} className={styles.btnQuickLink}>
                    + New Partner
                  </button>
                  <button onClick={() => navigate("/partner-contracts")} className={styles.btnQuickLink}>
                    Contracts
                  </button>
                </div>
              </div>

            </div>
          </div>


          {/* CARD 3 (BOTTOM LEFT): "AI TESTING & USAGE METRICS" (Replaces Courses) */}
          <div className={styles.dashboardCard}>
            
            {/* Light Blue Header */}
            <div className={styles.cardLightBlueHeader}>
              <div className={styles.headerTitleWrap}>
                <Cpu size={18} className={styles.headerIcon} />
                <h3 className={styles.cardHeaderTitle}>AI Testing & Usage Metrics</h3>
              </div>
              <span className={styles.headerBadge}>Inference Analytics</span>
            </div>

            {/* Card Content */}
            <div className={styles.cardBody}>
              
              {/* Tabs: 'All', 'Active Testers', 'Resellers', 'Captured Solutions' */}
              <div className={styles.categoryTabsRow}>
                {["All", "Active Testers", "Resellers", "Captured Solutions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTestMetricTab(tab)}
                    className={`${styles.categoryTabBtn} ${testMetricTab === tab ? styles.categoryTabActive : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Metrics List Items */}
              <div className={styles.metricsList}>
                {filteredMetrics.map((item) => (
                  <div key={item.id} className={styles.metricItemCard}>
                    <div className={styles.metricItemLeft}>
                      <div className={styles.metricThumbBox}>
                        <Zap size={16} className={styles.zapIcon} />
                      </div>

                      <div className={styles.metricMeta}>
                        <h4 className={styles.metricTitle}>{item.title}</h4>
                        <div className={styles.metricSubRow}>
                          <span className={styles.metricPartner}>{item.partner}</span>
                          <span className={styles.dotSep}>•</span>
                          <span className={styles.metricRate}>{item.rateLimit}</span>
                          <span className={styles.dotSep}>•</span>
                          <span className={styles.metricQuotaTag}>{item.quota}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.metricItemRight}>
                      <span className={styles.progressPct}>{item.progress}%</span>
                      <button
                        onClick={() => showToast(`Inspect quota for "${item.title}"`)}
                        className={styles.btnInspectMetric}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Link: View All AI Test Metrics */}
              <div className={styles.cardBottomLinkRow}>
                <button
                  onClick={() => showToast("Redirecting to full AI API analytics console...")}
                  className={styles.btnExploreMetrics}
                >
                  View All AI Test Metrics →
                </button>
              </div>

            </div>
          </div>

        </div>


        {/* ========================================================================= */}
        {/* RIGHT COLUMN CARDS                                                        */}
        {/* ========================================================================= */}
        <div className={styles.columnGroup}>
          
          {/* CARD 2 (TOP RIGHT): "PARTNER APPROVAL QUEUE" (Replaces Team Leave Balance) */}
          <div className={styles.dashboardCard}>
            
            {/* Light Blue Header */}
            <div className={styles.cardLightBlueHeader}>
              <div className={styles.headerTitleWrap}>
                <FileCheck size={18} className={styles.headerIcon} />
                <h3 className={styles.cardHeaderTitle}>Partner Approval Queue</h3>
              </div>
              <span className={styles.headerBadge}>Governance Queue</span>
            </div>

            {/* Card Content */}
            <div className={styles.cardBody}>
              
              {/* Graphic Icon & Text Message */}
              <div className={styles.approvalGraphicBox}>
                <div className={styles.approvalCircleIcon}>
                  <Sun size={28} className={styles.sunIcon} />
                </div>
                <div className={styles.approvalTextAreaBox}>
                  <p className={styles.approvalTextMsg}>
                    Your team's approved partner contracts & pending technical reviews will appear here
                  </p>
                </div>
              </div>

              {/* Summary Status Cards */}
              <div className={styles.queueStatsGrid}>
                
                <div className={styles.queueStatItem}>
                  <div className={styles.queueItemHeader}>
                    <span className={styles.queueLabel}>Pending Technical Review</span>
                    <span className={styles.badgeOrange}>5 Pending</span>
                  </div>
                  <div className={styles.queueCountRow}>
                    <span className={styles.queueNumber}>05</span>
                    <span className={styles.queueSub}>Applications</span>
                  </div>
                  <div className={styles.queueBarTrack}>
                    <div className={styles.queueFillOrange} style={{ width: "65%" }} />
                  </div>
                </div>

                <div className={styles.queueStatItem}>
                  <div className={styles.queueItemHeader}>
                    <span className={styles.queueLabel}>Awaiting Contract E-Sign</span>
                    <span className={styles.badgeBlue}>3 Awaiting</span>
                  </div>
                  <div className={styles.queueCountRow}>
                    <span className={styles.queueNumber}>03</span>
                    <span className={styles.queueSub}>Contracts</span>
                  </div>
                  <div className={styles.queueBarTrack}>
                    <div className={styles.queueFillBlue} style={{ width: "40%" }} />
                  </div>
                </div>

                <div className={styles.queueStatItem}>
                  <div className={styles.queueItemHeader}>
                    <span className={styles.queueLabel}>Provisioned & Active Today</span>
                    <span className={styles.badgeGreen}>8 Active</span>
                  </div>
                  <div className={styles.queueCountRow}>
                    <span className={styles.queueNumber}>08</span>
                    <span className={styles.queueSub}>Partners</span>
                  </div>
                  <div className={styles.queueBarTrack}>
                    <div className={styles.queueFillGreen} style={{ width: "100%" }} />
                  </div>
                </div>

              </div>

              {/* Queue Action Buttons */}
              <div className={styles.queueActionsRow}>
                <button
                  onClick={() => navigate("/partner-registration")}
                  className={styles.btnReviewQueue}
                >
                  <CheckCircle2 size={15} /> Review Pending Queue
                </button>

                <button
                  onClick={() => navigate("/partner-contracts")}
                  className={styles.btnViewContracts}
                >
                  View All Contracts
                </button>
              </div>

            </div>
          </div>


          {/* CARD 4 (BOTTOM RIGHT): "LIVE ISSUE STREAM & SDK LOGS" (Replaces Meditation) */}
          <div className={styles.dashboardCard}>
            
            {/* Light Blue Header */}
            <div className={styles.cardLightBlueHeader}>
              <div className={styles.headerTitleWrap}>
                <Terminal size={18} className={styles.headerIcon} />
                <h3 className={styles.cardHeaderTitle}>Live Issue Stream & SDK Logs</h3>
              </div>
              <span className={styles.headerBadge}>Edge-Case Telemetry</span>
            </div>

            {/* Card Content */}
            <div className={styles.cardBody}>
              
              {/* Vertical List of Captured Model Issues */}
              <div className={styles.issuesList}>
                {INITIAL_ISSUES.map((issue) => (
                  <div key={issue.id} className={styles.issueRowCard}>
                    <div className={styles.issueRowLeft}>
                      <div className={styles.issueThumbIcon}>
                        <AlertTriangle size={18} className={styles.alertIcon} />
                      </div>

                      <div className={styles.issueMeta}>
                        <h4 className={styles.issueTitle}>{issue.title}</h4>
                        <div className={styles.issueSubRow}>
                          <span className={styles.issuePartner}>{issue.partner}</span>
                          <span className={styles.dotSep}>•</span>
                          <span className={styles.issueTime}>{issue.timeElapsed}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.issueRowRight}>
                      <span className={`${styles.severityBadge} ${styles[`sev_${issue.severity}`]}`}>
                        {issue.severity}
                      </span>
                      <button
                        onClick={() => setSelectedIssueLog(issue)}
                        className={styles.btnViewLogs}
                      >
                        View Logs
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Right Link: "View All Issues" */}
              <div className={styles.cardBottomRightLinkRow}>
                <button
                  onClick={() => setIsAllIssuesModalOpen(true)}
                  className={styles.btnViewAllIssues}
                >
                  View All Issues →
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* BANNER CUSTOMIZATION MODAL                                                */}
      {/* ========================================================================= */}
      {isCustomizeModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <Settings size={18} className={styles.modalIcon} />
                <h3>Customise Aether AI Hero Banner</h3>
              </div>
              <button onClick={() => setIsCustomizeModalOpen(false)} className={styles.btnClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>
                Upload a custom header banner image or reset to the default Aether AI theme.
              </p>

              <div className={styles.uploadDropzone}>
                <ImageIcon size={36} className={styles.dropzoneIcon} />
                <h4>Upload New Custom Banner Image</h4>
                <p>Supports PNG, JPG, WEBP, and GIF formats (Max 5MB)</p>

                <label className={styles.btnBrowseBanner}>
                  <span>Browse Image File</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} hidden />
                </label>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={handleResetBanner} className={styles.btnResetBanner}>
                <RotateCcw size={14} /> Reset to Default
              </button>
              <button onClick={() => setIsCustomizeModalOpen(false)} className={styles.btnCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ISSUE LOG DETAILS MODAL */}
      {selectedIssueLog && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <Terminal size={18} className={styles.modalIcon} />
                <h3>{selectedIssueLog.title}</h3>
              </div>
              <button onClick={() => setSelectedIssueLog(null)} className={styles.btnClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.logDetailMeta}>
                <div><strong>Partner:</strong> {selectedIssueLog.partner}</div>
                <div><strong>Reported:</strong> {selectedIssueLog.timeElapsed}</div>
                <div><strong>Category:</strong> {selectedIssueLog.category}</div>
                <div><strong>Severity:</strong> <span className={styles.logSevTag}>{selectedIssueLog.severity}</span></div>
              </div>

              <div className={styles.logCodeBlock}>
                <pre>{`[SDK LOG TRACE #${selectedIssueLog.id}]
Timestamp: ${new Date().toISOString()}
Target Model: Aether-LLM-v2.4-Enterprise
Partner: ${selectedIssueLog.partner}
Diagnostic: ${selectedIssueLog.logDetails}
Action Taken: Captured in telemetry queue for fine-tuning dataset.`}</pre>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setSelectedIssueLog(null)} className={styles.btnCloseModal}>
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ALL ISSUES STREAM MODAL */}
      {isAllIssuesModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <AlertTriangle size={18} className={styles.modalIcon} />
                <h3>Captured Model Edge Cases & SDK Logs</h3>
              </div>
              <button onClick={() => setIsAllIssuesModalOpen(false)} className={styles.btnClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.allIssuesList}>
                {INITIAL_ISSUES.map((issue) => (
                  <div key={issue.id} className={styles.allIssueItem}>
                    <div>
                      <strong>{issue.title}</strong>
                      <div className={styles.allIssueSub}>{issue.partner} • {issue.timeElapsed}</div>
                    </div>
                    <span className={styles.logSevTag}>{issue.severity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setIsAllIssuesModalOpen(false)} className={styles.btnCloseModal}>
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
