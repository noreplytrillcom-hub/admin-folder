// Client-side Caching & Mock API Layer for Phase 2 Executive Revenue & Analytics Dashboard

const METRICS_CACHE = {
  data: null,
  timestamp: 0,
  ttlMs: 30000, // 30 second default cache TTL
};

export const fetchExecutiveMetrics = async (forceRefresh = false) => {
  const now = Date.now();

  // Return cached metrics if within TTL and not forced
  if (!forceRefresh && METRICS_CACHE.data && now - METRICS_CACHE.timestamp < METRICS_CACHE.ttlMs) {
    return { ...METRICS_CACHE.data, fromCache: true };
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  const freshData = {
    mrr: {
      value: 248500,
      formatted: "$248,500",
      change: "+14.8%",
      isPositive: true,
      period: "vs. last month",
      targetPct: 92,
    },
    arr: {
      value: 2982000,
      formatted: "$2.98M",
      change: "+18.2%",
      isPositive: true,
      period: "YoY growth",
      targetPct: 95,
    },
    activeOrgs: {
      value: 142,
      formatted: "142",
      change: "+8.4%",
      isPositive: true,
      period: "12 new this month",
      targetPct: 88,
    },
    executionHours: {
      value: 18450,
      formatted: "18,450 hrs",
      change: "+24.5%",
      isPositive: true,
      period: "Compute quota used",
      targetPct: 78,
    },
    lastUpdated: new Date().toLocaleTimeString(),
  };

  METRICS_CACHE.data = freshData;
  METRICS_CACHE.timestamp = now;

  return { ...freshData, fromCache: false };
};

export const fetchRevenueVsComputeChartData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return [
    { month: "Jan", MRR: 145000, ARR: 1740000, ComputeHours: 8200, ActiveOrgs: 88 },
    { month: "Feb", MRR: 158000, ARR: 1896000, ComputeHours: 9400, ActiveOrgs: 94 },
    { month: "Mar", MRR: 172000, ARR: 2064000, ComputeHours: 10800, ActiveOrgs: 102 },
    { month: "Apr", MRR: 186000, ARR: 2232000, ComputeHours: 11900, ActiveOrgs: 110 },
    { month: "May", MRR: 198000, ARR: 2376000, ComputeHours: 13200, ActiveOrgs: 118 },
    { month: "Jun", MRR: 210000, ARR: 2520000, ComputeHours: 14500, ActiveOrgs: 125 },
    { month: "Jul", MRR: 224000, ARR: 2688000, ComputeHours: 15800, ActiveOrgs: 131 },
    { month: "Aug", MRR: 235000, ARR: 2820000, ComputeHours: 16900, ActiveOrgs: 136 },
    { month: "Sep", MRR: 248500, ARR: 2982000, ComputeHours: 18450, ActiveOrgs: 142 },
    { month: "Oct (Proj)", MRR: 262000, ARR: 3144000, ComputeHours: 19800, ActiveOrgs: 148 },
    { month: "Nov (Proj)", MRR: 278000, ARR: 3336000, ComputeHours: 21200, ActiveOrgs: 155 },
    { month: "Dec (Proj)", MRR: 295000, ARR: 3540000, ComputeHours: 23000, ActiveOrgs: 162 },
  ];
};

export const fetchRecentTenantActivities = async () => {
  return [
    {
      id: "act-1",
      org: "Apex Cognitive Systems",
      action: "Upgraded subscription plan from Pro to Enterprise Tier",
      time: "12 mins ago",
      badge: "Upgrade",
      badgeType: "success",
      amount: "+$4,500/mo",
    },
    {
      id: "act-2",
      org: "Vortex Data Labs",
      action: "Expanded compute capacity by +25 concurrent agent slots",
      time: "45 mins ago",
      badge: "Quota Increase",
      badgeType: "info",
      amount: "+$1,200/mo",
    },
    {
      id: "act-3",
      org: "Acme Cloud Solutions",
      action: "Executed annual enterprise renewal contract",
      time: "2 hours ago",
      badge: "Renewal",
      badgeType: "success",
      amount: "$84,000/yr",
    },
    {
      id: "act-4",
      org: "Nexus Cybernetics",
      action: "Reached 85% of monthly compute execution quota limit",
      time: "4 hours ago",
      badge: "Quota Warning",
      badgeType: "warning",
      amount: "15,800 hrs",
    },
    {
      id: "act-5",
      org: "Quantum AI Corp",
      action: "Provisioned new organization workspace and tenant admin key",
      time: "6 hours ago",
      badge: "New Tenant",
      badgeType: "success",
      amount: "Standard Tier",
    },
  ];
};
