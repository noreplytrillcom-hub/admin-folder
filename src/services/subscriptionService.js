// Mock & API Service Layer for Subscriptions Page 6

const INITIAL_SUBSCRIPTIONS = [
  {
    id: "sub-101",
    organizationId: "org-101",
    organizationName: "Apex Cognitive Systems",
    adminEmail: "admin@apexcognitive.com",
    planTier: "enterprise",
    status: "active",
    billingCycle: "annual",
    mrrAmount: 2499,
    concurrentSlots: 100,
    monthlyMinutesQuota: 500000,
    slaGuarantee: "99.99%",
    currentPeriodEnd: "2026-11-15",
    updatedAt: "2026-08-01",
  },
  {
    id: "sub-102",
    organizationId: "org-102",
    organizationName: "Acme Cloud Solutions",
    adminEmail: "contact@acmecloud.io",
    planTier: "growth",
    status: "active",
    billingCycle: "monthly",
    mrrAmount: 899,
    concurrentSlots: 50,
    monthlyMinutesQuota: 50000,
    slaGuarantee: "99.9%",
    currentPeriodEnd: "2026-09-01",
    updatedAt: "2026-08-05",
  },
  {
    id: "sub-103",
    organizationId: "org-103",
    organizationName: "Vortex Data Labs",
    adminEmail: "billing@vortexdatalabs.com",
    planTier: "starter",
    status: "active",
    billingCycle: "monthly",
    mrrAmount: 299,
    concurrentSlots: 15,
    monthlyMinutesQuota: 15000,
    slaGuarantee: "99.5%",
    currentPeriodEnd: "2026-08-28",
    updatedAt: "2026-07-28",
  },
  {
    id: "sub-104",
    organizationId: "org-104",
    organizationName: "Hyperion AI Networks",
    adminEmail: "ops@hyperionai.tech",
    planTier: "custom",
    status: "active",
    billingCycle: "annual",
    mrrAmount: 4500,
    concurrentSlots: 150,
    monthlyMinutesQuota: 750000,
    slaGuarantee: "99.99%",
    currentPeriodEnd: "2027-01-20",
    updatedAt: "2026-08-08",
  },
  {
    id: "sub-105",
    organizationId: "org-105",
    organizationName: "Synthetix Dynamics",
    adminEmail: "lead@synthetix.io",
    planTier: "growth",
    status: "past_due",
    billingCycle: "monthly",
    mrrAmount: 899,
    concurrentSlots: 50,
    monthlyMinutesQuota: 50000,
    slaGuarantee: "99.9%",
    currentPeriodEnd: "2026-08-05",
    updatedAt: "2026-08-06",
  },
];

export const fetchSubscriptionsData = async ({
  page = 1,
  limit = 5,
  search = "",
  tier = "ALL",
}) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  let filtered = [...INITIAL_SUBSCRIPTIONS];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.organizationName.toLowerCase().includes(q) ||
        s.adminEmail.toLowerCase().includes(q) ||
        s.organizationId.toLowerCase().includes(q)
    );
  }

  if (tier !== "ALL") {
    filtered = filtered.filter((s) => s.planTier === tier.toLowerCase());
  }

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  // Compute aggregate metrics
  const totalMrr = INITIAL_SUBSCRIPTIONS.reduce((acc, curr) => acc + curr.mrrAmount, 0);
  const activeSubscriptionsCount = INITIAL_SUBSCRIPTIONS.filter((s) => s.status === "active").length;
  const starterCount = INITIAL_SUBSCRIPTIONS.filter((s) => s.planTier === "starter").length;
  const growthCount = INITIAL_SUBSCRIPTIONS.filter((s) => s.planTier === "growth").length;
  const enterpriseCount = INITIAL_SUBSCRIPTIONS.filter((s) => s.planTier === "enterprise").length;
  const customCount = INITIAL_SUBSCRIPTIONS.filter((s) => s.planTier === "custom").length;

  return {
    data,
    totalRecords,
    totalPages,
    currentPage: page,
    metrics: {
      totalMrr,
      activeSubscriptionsCount,
      starterCount,
      growthCount,
      enterpriseCount,
      customCount,
    },
  };
};

export const updateSubscriptionPlan = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const sub = INITIAL_SUBSCRIPTIONS.find((s) => s.id === payload.subscriptionId);
  if (sub) {
    sub.planTier = payload.planTier;
    sub.mrrAmount = Number(payload.mrrAmount);
    sub.concurrentSlots = Number(payload.concurrentSlots);
    sub.monthlyMinutesQuota = Number(payload.monthlyMinutesQuota);
    sub.slaGuarantee = payload.slaGuarantee;
    sub.updatedAt = new Date().toISOString().substring(0, 10);
  }

  return sub;
};
