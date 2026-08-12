import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Layers,
  Sparkles,
  BarChart3
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import styles from "./AnalyticsHome.module.css";

// Native SVG Glass Revenue vs Churn Dual Trend Chart
function RevenueVsChurnSvgChart() {
  const data = [
    { month: "Jan", Revenue: 185, ChurnPct: 2.1 },
    { month: "Feb", Revenue: 198, ChurnPct: 1.9 },
    { month: "Mar", Revenue: 210, ChurnPct: 1.6 },
    { month: "Apr", Revenue: 224, ChurnPct: 1.4 },
    { month: "May", Revenue: 236, ChurnPct: 1.3 },
    { month: "Jun", Revenue: 248, ChurnPct: 1.2 },
  ];

  const width = 750;
  const height = 260;
  const padL = 50;
  const padR = 40;
  const padT = 20;
  const padB = 40;

  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const maxRev = 300;
  const maxChurn = 3.0;

  const getX = (i) => padL + (i / (data.length - 1)) * chartW;
  const getRevY = (val) => height - padB - (val / maxRev) * chartH;
  const getChurnY = (val) => height - padB - (val / maxChurn) * chartH;

  const revPath = data.reduce((acc, d, i) => `${acc} ${i === 0 ? "M" : "L"} ${getX(i)} ${getRevY(d.Revenue)}`, "");
  const churnPath = data.reduce((acc, d, i) => `${acc} ${i === 0 ? "M" : "L"} ${getX(i)} ${getChurnY(d.ChurnPct)}`, "");

  return (
    <div className={styles.svgChartWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgElement}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B7BFA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9B7BFA" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = height - padB - pct * chartH;
          return (
            <line key={idx} x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
          );
        })}

        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={i} x={getX(i)} y={height - 12} fill="#64748b" fontSize="11" textAnchor="middle">{d.month}</text>
        ))}

        {/* Lines */}
        <path d={revPath} fill="none" stroke="#9B7BFA" strokeWidth="3" />
        <path d={churnPath} fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 5" />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getRevY(d.Revenue)} r="5" fill="#9B7BFA" stroke="#ffffff" strokeWidth="2" />
            <circle cx={getX(i)} cy={getChurnY(d.ChurnPct)} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// Native SVG Glass Peak Compute Demand Chart (24h Load Curve)
function PeakComputeSvgChart() {
  const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"];
  const loads = [42, 35, 78, 95, 88, 64, 48]; // % capacity

  const width = 750;
  const height = 260;
  const padL = 50;
  const padR = 40;
  const padT = 20;
  const padB = 40;

  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const getX = (i) => padL + (i / (hours.length - 1)) * chartW;
  const getY = (val) => height - padB - (val / 100) * chartH;

  const areaPath = `M ${getX(0)} ${height - padB} ` +
    loads.map((val, i) => `L ${getX(i)} ${getY(val)}`).join(" ") +
    ` L ${getX(hours.length - 1)} ${height - padB} Z`;

  const linePath = loads.map((val, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(val)}`).join(" ");

  return (
    <div className={styles.svgChartWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgElement}>
        <defs>
          <linearGradient id="computePeakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - padB - pct * chartH;
          return (
            <line key={idx} x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
          );
        })}

        {/* X axis labels */}
        {hours.map((h, i) => (
          <text key={i} x={getX(i)} y={height - 12} fill="#64748b" fontSize="11" textAnchor="middle">{h}</text>
        ))}

        <path d={areaPath} fill="url(#computePeakGrad)" />
        <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="3" />

        {loads.map((val, i) => (
          <circle key={i} cx={getX(i)} cy={getY(val)} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

export default function AnalyticsHome() {
  const toast = useToast();

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Revenue & Compute Utilization Analytics</h1>
          <p className={styles.pageSubtitle}>
            Deep-dive financial cohorts, net expansion revenue, and global browser sandbox compute curves.
          </p>
        </div>

        <button
          onClick={() => toast.success("Analytics data synchronized", "Live Refreshed")}
          className={styles.btnRefreshGlass}
        >
          <Sparkles size={16} /> Sync Telemetry
        </button>
      </div>

      {/* 2. DEEP-DIVE KPI CARDS */}
      <div className={styles.kpiGrid}>
        <div className={styles.glassKpiCard}>
          <span className={styles.kpiLabel}>Customer Lifetime Value (LTV)</span>
          <div className={styles.kpiValRow}>
            <h2 className={styles.kpiValue}>$42,500</h2>
            <span className={styles.trendGreen}><ArrowUpRight size={14} /> +14.2%</span>
          </div>
          <p className={styles.kpiSub}>Avg contract length: 18 months</p>
        </div>

        <div className={styles.glassKpiCard}>
          <span className={styles.kpiLabel}>LTV to CAC Ratio</span>
          <div className={styles.kpiValRow}>
            <h2 className={styles.kpiValue}>3.8x</h2>
            <span className={styles.trendGreen}><ArrowUpRight size={14} /> Healthy</span>
          </div>
          <p className={styles.kpiSub}>Target threshold: &gt; 3.0x</p>
        </div>

        <div className={styles.glassKpiCard}>
          <span className={styles.kpiLabel}>Net Revenue Retention (NRR)</span>
          <div className={styles.kpiValRow}>
            <h2 className={styles.kpiValue}>124.5%</h2>
            <span className={styles.trendGreen}><ArrowUpRight size={14} /> +6.1%</span>
          </div>
          <p className={styles.kpiSub}>Expansion driven by compute slots</p>
        </div>

        <div className={styles.glassKpiCard}>
          <span className={styles.kpiLabel}>Avg Execution Latency</span>
          <div className={styles.kpiValRow}>
            <h2 className={styles.kpiValue}>420ms</h2>
            <span className={styles.trendGreen}><ArrowDownRight size={14} /> -35ms</span>
          </div>
          <p className={styles.kpiSub}>Browser sandbox spin-up time</p>
        </div>
      </div>

      {/* 3. CHARTS GRID */}
      <div className={styles.chartsGrid}>
        <div className={styles.glassChartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Revenue Trajectory vs. Monthly Churn Rate</h3>
              <p className={styles.chartSub}>MRR growth ($k) vs. Net organization churn percentage (%)</p>
            </div>
            <div className={styles.legendRow}>
              <span className={styles.legViolet} /> MRR Revenue ($k)
              <span className={styles.legRose} /> Churn Rate (%)
            </div>
          </div>
          <RevenueVsChurnSvgChart />
        </div>

        <div className={styles.glassChartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Peak Compute Execution Demand (24h Load Curve)</h3>
              <p className={styles.chartSub}>Aggregate container capacity utilization across worker pools (%)</p>
            </div>
            <div className={styles.legendRow}>
              <span className={styles.legCyan} /> Capacity Utilization (%)
            </div>
          </div>
          <PeakComputeSvgChart />
        </div>
      </div>
    </div>
  );
}
