import { useState, useEffect, useCallback, useRef } from "react";
import {
  TrendingUp,
  DollarSign,
  Building2,
  Cpu,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import {
  fetchExecutiveMetrics,
  fetchRevenueVsComputeChartData,
  fetchRecentTenantActivities
} from "../../services/dashboardService";
import { useToast } from "../../context/ToastContext";
import styles from "./DashboardHome.module.css";

// High-Performance Interactive SVG Glass Chart Component (React 19 & Vite native)
function SvgGlassAreaChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);

  if (!data || data.length === 0) return null;

  const width = 800;
  const height = 300;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxMRR = Math.max(...data.map((d) => d.MRR)) * 1.15;
  const maxCompute = Math.max(...data.map((d) => d.ComputeHours)) * 1.15;

  const getX = (index) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getMrrY = (val) => height - paddingBottom - (val / maxMRR) * chartHeight;
  const getComputeY = (val) => height - paddingBottom - (val / maxCompute) * chartHeight;

  // Generate smooth cubic bezier SVG path strings
  const generateAreaPath = (getYFn, key) => {
    let path = `M ${getX(0)} ${height - paddingBottom} `;
    path += `L ${getX(0)} ${getYFn(data[0][key])} `;

    for (let i = 0; i < data.length - 1; i++) {
      const x0 = getX(i);
      const y0 = getYFn(data[i][key]);
      const x1 = getX(i + 1);
      const y1 = getYFn(data[i + 1][key]);
      const mx = (x0 + x1) / 2;
      path += `C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1} `;
    }

    path += `L ${getX(data.length - 1)} ${height - paddingBottom} Z`;
    return path;
  };

  const generateLinePath = (getYFn, key) => {
    let path = `M ${getX(0)} ${getYFn(data[0][key])} `;
    for (let i = 0; i < data.length - 1; i++) {
      const x0 = getX(i);
      const y0 = getYFn(data[i][key]);
      const x1 = getX(i + 1);
      const y1 = getYFn(data[i + 1][key]);
      const mx = (x0 + x1) / 2;
      path += `C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1} `;
    }
    return path;
  };

  const mrrAreaPath = generateAreaPath(getMrrY, "MRR");
  const mrrLinePath = generateLinePath(getMrrY, "MRR");
  const computeAreaPath = generateAreaPath(getComputeY, "ComputeHours");
  const computeLinePath = generateLinePath(getComputeY, "ComputeHours");

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pct = (mouseX - paddingLeft) / chartWidth;
    const rawIdx = Math.round(pct * (data.length - 1));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, rawIdx));
    setHoverIndex(clampedIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activeData = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      className={styles.svgChartContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChartElement}>
        <defs>
          <linearGradient id="glassMrrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="glassComputeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - paddingBottom - pct * chartHeight;
          const val = Math.round(pct * maxMRR);
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                fontFamily="inherit"
              >
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - 12}
            fill={hoverIndex === i ? "#ffffff" : "#64748b"}
            fontSize="11"
            fontWeight={hoverIndex === i ? "700" : "500"}
            textAnchor="middle"
            fontFamily="inherit"
          >
            {d.month}
          </text>
        ))}

        {/* Area Gradients */}
        <path d={mrrAreaPath} fill="url(#glassMrrGrad)" />
        <path d={computeAreaPath} fill="url(#glassComputeGrad)" />

        {/* Smooth Lines */}
        <path d={mrrLinePath} fill="none" stroke="#8b5cf6" strokeWidth="3" />
        <path d={computeLinePath} fill="none" stroke="#06b6d4" strokeWidth="3" />

        {/* Hover Highlight Vertical Line & Dots */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={paddingTop}
              x2={getX(hoverIndex)}
              y2={height - paddingBottom}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeDasharray="3 3"
            />
            {/* MRR Dot */}
            <circle
              cx={getX(hoverIndex)}
              cy={getMrrY(data[hoverIndex].MRR)}
              r="6"
              fill="#8b5cf6"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Compute Dot */}
            <circle
              cx={getX(hoverIndex)}
              cy={getComputeY(data[hoverIndex].ComputeHours)}
              r="6"
              fill="#06b6d4"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Frosted Glass Floating Tooltip Overlay */}
      {activeData && (
        <div
          className={styles.glassTooltip}
          style={{
            left: `${(getX(hoverIndex) / width) * 100}%`,
            transform: hoverIndex > data.length / 2 ? "translate(-105%, -50%)" : "translate(10%, -50%)",
            top: "40%",
          }}
        >
          <p className={styles.tooltipMonth}>{activeData.month} Telemetry Summary</p>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>
              <span className={styles.dotViolet} /> MRR Revenue:
            </span>
            <span className={styles.tooltipValue}>${activeData.MRR.toLocaleString()}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>
              <span className={styles.dotCyan} /> Compute Hours:
            </span>
            <span className={styles.tooltipValue}>{activeData.ComputeHours.toLocaleString()} hrs</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>
              <span className={styles.dotBlue} /> Active Tenants:
            </span>
            <span className={styles.tooltipValue}>{activeData.ActiveOrgs} Orgs</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const toast = useToast();

  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshRate, setAutoRefreshRate] = useState("30s");

  const loadDashboardData = useCallback(
    async (forceRefresh = false) => {
      try {
        if (forceRefresh) setRefreshing(true);
        const [mRes, cRes, aRes] = await Promise.all([
          fetchExecutiveMetrics(forceRefresh),
          fetchRevenueVsComputeChartData(),
          fetchRecentTenantActivities(),
        ]);

        setMetrics(mRes);
        setChartData(cRes);
        setActivities(aRes);

        if (forceRefresh) {
          toast.success("Executive telemetry metrics updated live", "Refreshed");
        }
      } catch (err) {
        toast.error("Failed to load metrics: " + err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (autoRefreshRate === "off") return;
    const intervalMs = autoRefreshRate === "30s" ? 30000 : 60000;
    const timer = setInterval(() => {
      loadDashboardData(true);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoRefreshRate, loadDashboardData]);

  if (loading || !metrics) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* 1. HEADER CONTROL TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div className={styles.headerTitleWrap}>
          <h1 className={styles.pageTitle}>Executive Revenue & Analytics</h1>
          <p className={styles.pageSubtitle}>
            Real-time multi-tenant MRR growth, active organizations, and compute telemetry.
          </p>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.cacheBadge}>
            <span className={metrics.fromCache ? styles.cacheDotOrange : styles.cacheDotGreen} />
            <span>{metrics.fromCache ? "Cached Telemetry" : "Live Stream"}</span>
          </div>

          <div className={styles.autoRefreshSelector}>
            <Clock size={14} className={styles.clockIcon} />
            <select
              value={autoRefreshRate}
              onChange={(e) => {
                setAutoRefreshRate(e.target.value);
                toast.info(`Auto-refresh set to ${e.target.value}`);
              }}
              className={styles.refreshSelect}
            >
              <option value="30s">Auto-refresh: 30s</option>
              <option value="1m">Auto-refresh: 1m</option>
              <option value="off">Auto-refresh: Off</option>
            </select>
          </div>

          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className={styles.btnGlassRefresh}
          >
            <RefreshCw size={15} className={refreshing ? styles.spinIcon : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. METRICS & KPI CARDS GRID */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassKpiCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardLabel}>Monthly Recurring Revenue</span>
            <div className={styles.iconBoxViolet}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <h2 className={styles.kpiValue}>{metrics.mrr.formatted}</h2>
            <span className={styles.trendPillGreen}>
              <ArrowUpRight size={14} /> {metrics.mrr.change}
            </span>
          </div>
          <p className={styles.cardPeriodNote}>{metrics.mrr.period}</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFillViolet} style={{ width: `${metrics.mrr.targetPct}%` }} />
          </div>
        </div>

        <div className={styles.glassKpiCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardLabel}>Annual Run Rate (ARR)</span>
            <div className={styles.iconBoxCyan}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <h2 className={styles.kpiValue}>{metrics.arr.formatted}</h2>
            <span className={styles.trendPillGreen}>
              <ArrowUpRight size={14} /> {metrics.arr.change}
            </span>
          </div>
          <p className={styles.cardPeriodNote}>{metrics.arr.period}</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFillCyan} style={{ width: `${metrics.arr.targetPct}%` }} />
          </div>
        </div>

        <div className={styles.glassKpiCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardLabel}>Active Organizations</span>
            <div className={styles.iconBoxIndigo}>
              <Building2 size={20} />
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <h2 className={styles.kpiValue}>{metrics.activeOrgs.formatted}</h2>
            <span className={styles.trendPillGreen}>
              <ArrowUpRight size={14} /> {metrics.activeOrgs.change}
            </span>
          </div>
          <p className={styles.cardPeriodNote}>{metrics.activeOrgs.period}</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFillIndigo} style={{ width: `${metrics.activeOrgs.targetPct}%` }} />
          </div>
        </div>

        <div className={styles.glassKpiCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardLabel}>Compute Execution Hours</span>
            <div className={styles.iconBoxBlue}>
              <Cpu size={20} />
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <h2 className={styles.kpiValue}>{metrics.executionHours.formatted}</h2>
            <span className={styles.trendPillGreen}>
              <ArrowUpRight size={14} /> {metrics.executionHours.change}
            </span>
          </div>
          <p className={styles.cardPeriodNote}>{metrics.executionHours.period}</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFillBlue} style={{ width: `${metrics.executionHours.targetPct}%` }} />
          </div>
        </div>
      </div>

      {/* 3. CHART & ACTIVITY STREAM SPLIT SECTION */}
      <div className={styles.chartAndActivityGrid}>
        <div className={styles.glassChartCard}>
          <div className={styles.chartCardHeader}>
            <div>
              <h3 className={styles.chartTitle}>Revenue Growth vs. Compute Usage</h3>
              <p className={styles.chartSubtitle}>
                Monthly MRR trajectories aligned with tenant execution compute workloads.
              </p>
            </div>
            <div className={styles.chartLegendGroup}>
              <div className={styles.legendItem}>
                <span className={styles.legendDotViolet} /> MRR Growth ($)
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDotCyan} /> Compute Workload (hrs)
              </div>
            </div>
          </div>

          <div className={styles.chartWrapper}>
            <SvgGlassAreaChart data={chartData} />
          </div>
        </div>

        <div className={styles.glassActivityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Live Tenant Stream</h3>
            <span className={styles.liveBadge}>Real-time</span>
          </div>

          <div className={styles.activityList}>
            {activities.map((act) => (
              <div key={act.id} className={styles.activityItem}>
                <div className={styles.activityLeft}>
                  <div className={styles.actDotWrapper}>
                    <Activity size={14} />
                  </div>
                  <div className={styles.actMeta}>
                    <h4 className={styles.actOrg}>{act.org}</h4>
                    <p className={styles.actDesc}>{act.action}</p>
                    <span className={styles.actTime}>{act.time}</span>
                  </div>
                </div>
                <div className={styles.activityRight}>
                  <span className={styles.actAmount}>{act.amount}</span>
                  <span className={`${styles.actBadge} ${styles[`badge_${act.badgeType}`]}`}>
                    {act.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. EMERGENCY SYSTEM CONTROLS CARD */}
      <div className={styles.glassEmergencyCard}>
        <div className={styles.emergencyHeader}>
          <div className={styles.emergencyTitleWrap}>
            <Sparkles size={20} className={styles.emergencyIcon} />
            <div>
              <h3 className={styles.emergencyTitle}>Emergency System Controls & Global Overrides</h3>
              <p className={styles.emergencySub}>
                Instant kill-switches and rate limit protection toggles for operational safety.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.emergencyGrid}>
          <div className={styles.toggleItem}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Emergency Maintenance Mode</span>
              <span className={styles.toggleSub}>Blocks non-admin API execution traffic globally</span>
            </div>
            <button
              onClick={() => toast.warning("Maintenance Mode Toggle updated", "System Overrides")}
              className={styles.glassToggleBtn}
            >
              OFF
            </button>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Global API Rate Limit Shield</span>
              <span className={styles.toggleSub}>Strict 100 req/min throttling on all endpoints</span>
            </div>
            <button
              onClick={() => toast.success("Rate Limit Shield Active", "Security Guard")}
              className={styles.glassToggleBtnActive}
            >
              ACTIVE
            </button>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Worker Autoscale Guard</span>
              <span className={styles.toggleSub}>Cap maximum active cloud containers to 150 nodes</span>
            </div>
            <button
              onClick={() => toast.success("Autoscale Guard Enforced", "Worker Pool")}
              className={styles.glassToggleBtnActive}
            >
              ACTIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
