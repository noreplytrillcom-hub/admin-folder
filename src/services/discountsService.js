// Mock API Service Layer for Page 11 Credits & Coupons

let INITIAL_COUPONS = [
  {
    id: "coup-101",
    code: "ENTERPRISE2026",
    discountType: "percentage",
    discountValue: 20,
    maxRedemptions: 50,
    currentRedemptions: 18,
    expiresAt: "2026-12-31",
    isActive: true,
    createdAt: "2026-01-01",
  },
  {
    id: "coup-102",
    code: "STARTUP500",
    discountType: "fixed_usd",
    discountValue: 500,
    maxRedemptions: 100,
    currentRedemptions: 42,
    expiresAt: "2026-09-30",
    isActive: true,
    createdAt: "2026-03-15",
  },
  {
    id: "coup-103",
    code: "BETAHERO20",
    discountType: "percentage",
    discountValue: 25,
    maxRedemptions: 200,
    currentRedemptions: 195,
    expiresAt: "2026-08-15",
    isActive: true,
    createdAt: "2026-05-01",
  },
];

let INITIAL_SERVICE_CREDITS = [
  {
    id: "cred-901",
    organizationId: "org-101",
    organizationName: "Apex Cognitive Systems",
    amountUsd: 500.00,
    balanceRemainingUsd: 350.00,
    reason: "sla_breach_compensation",
    notes: "45-min worker pod downtime compensation.",
    issuedByAdminEmail: "support-lead@testo.com",
    expiresAt: "2027-08-01",
    createdAt: "2026-08-02",
  },
  {
    id: "cred-902",
    organizationId: "org-104",
    organizationName: "Hyperion AI Networks",
    amountUsd: 1200.00,
    balanceRemainingUsd: 1200.00,
    reason: "beta_testing_grant",
    notes: "Autonomous AI agent V2 early tester grant.",
    issuedByAdminEmail: "product-vp@testo.com",
    expiresAt: "2027-01-15",
    createdAt: "2026-07-20",
  },
  {
    id: "cred-903",
    organizationId: "org-103",
    organizationName: "Vortex Data Labs",
    amountUsd: 250.00,
    balanceRemainingUsd: 0.00,
    reason: "goodwill",
    notes: "Customer success goodwill extension.",
    issuedByAdminEmail: "csm@testo.com",
    expiresAt: "2026-11-01",
    createdAt: "2026-06-10",
  },
];

export const fetchDiscountsData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const activeCouponsCount = INITIAL_COUPONS.filter((c) => c.isActive).length;
  const totalRedeemedSavingsUsd = INITIAL_COUPONS.reduce(
    (acc, c) => acc + c.currentRedemptions * (c.discountType === "fixed_usd" ? c.discountValue : 150),
    0
  );

  const tenantActiveCreditsBalanceUsd = INITIAL_SERVICE_CREDITS.reduce(
    (acc, c) => acc + c.balanceRemainingUsd,
    0
  );
  const creditsIssuedLast30dUsd = INITIAL_SERVICE_CREDITS.reduce(
    (acc, c) => acc + c.amountUsd,
    0
  );

  return {
    coupons: INITIAL_COUPONS,
    serviceCredits: INITIAL_SERVICE_CREDITS,
    metrics: {
      activeCouponsCount,
      totalRedeemedSavingsUsd,
      tenantActiveCreditsBalanceUsd,
      creditsIssuedLast30dUsd,
    },
  };
};

export const issueServiceCredit = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newCredit = {
    id: `cred-${Date.now().toString().slice(-4)}`,
    organizationId: payload.organizationId,
    organizationName: payload.organizationId === "org-102" ? "Acme Cloud Solutions" : "Tenant Organization",
    amountUsd: Number(payload.amountUsd),
    balanceRemainingUsd: Number(payload.amountUsd),
    reason: payload.reason,
    notes: payload.notes || "Granted by Super-Admin",
    issuedByAdminEmail: "admin@testo.com",
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    createdAt: new Date().toISOString().substring(0, 10),
  };

  INITIAL_SERVICE_CREDITS.unshift(newCredit);
  return newCredit;
};
