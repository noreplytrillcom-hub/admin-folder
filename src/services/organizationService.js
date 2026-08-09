// Mock Service Layer for Phase 3 Client Organization & Tenant Management

let INITIAL_ORGANIZATIONS = [
  {
    id: "org-101",
    name: "Apex Cognitive Systems",
    adminEmail: "admin@apexcognitive.com",
    plan: "Enterprise",
    concurrentSlots: 100,
    monthlyMinutesUsed: 84500,
    monthlyMinutesQuota: 100000,
    status: "Active",
    createdAt: "2025-11-15",
    apiKey: "ak_live_apex_9f8e7d6c5b4a3210",
  },
  {
    id: "org-102",
    name: "Acme Cloud Solutions",
    adminEmail: "ops@acmecloud.io",
    plan: "Enterprise",
    concurrentSlots: 75,
    monthlyMinutesUsed: 62100,
    monthlyMinutesQuota: 75000,
    status: "Active",
    createdAt: "2026-01-10",
    apiKey: "ak_live_acme_1a2b3c4d5e6f7890",
  },
  {
    id: "org-103",
    name: "Vortex Data Labs",
    adminEmail: "tech@vortexlabs.ai",
    plan: "Pro",
    concurrentSlots: 50,
    monthlyMinutesUsed: 48900,
    monthlyMinutesQuota: 50000,
    status: "Active",
    createdAt: "2026-02-04",
    apiKey: "ak_live_vort_876543210fedcba9",
  },
  {
    id: "org-104",
    name: "Nexus Cybernetics",
    adminEmail: "security@nexuscyber.com",
    plan: "Enterprise",
    concurrentSlots: 120,
    monthlyMinutesUsed: 98200,
    monthlyMinutesQuota: 120000,
    status: "Active",
    createdAt: "2025-09-22",
    apiKey: "ak_live_nexu_0123456789abcdef",
  },
  {
    id: "org-105",
    name: "Quantum AI Corp",
    adminEmail: "lead@quantumai.org",
    plan: "Starter",
    concurrentSlots: 15,
    monthlyMinutesUsed: 14200,
    monthlyMinutesQuota: 15000,
    status: "Suspended",
    createdAt: "2026-03-12",
    apiKey: "ak_live_quan_abcdef0123456789",
  },
  {
    id: "org-106",
    name: "Hyperion Dynamics",
    adminEmail: "infra@hyperiondyn.com",
    plan: "Pro",
    concurrentSlots: 40,
    monthlyMinutesUsed: 31000,
    monthlyMinutesQuota: 45000,
    status: "Active",
    createdAt: "2026-04-18",
    apiKey: "ak_live_hype_9876543210abcdef",
  },
  {
    id: "org-107",
    name: "Starlight Analytics",
    adminEmail: "data@starlight.io",
    plan: "Starter",
    concurrentSlots: 10,
    monthlyMinutesUsed: 8900,
    monthlyMinutesQuota: 10000,
    status: "Active",
    createdAt: "2026-05-02",
    apiKey: "ak_live_star_fedcba9876543210",
  },
  {
    id: "org-108",
    name: "Nebula Robotics",
    adminEmail: "admin@nebularobotics.ai",
    plan: "Pro",
    concurrentSlots: 60,
    monthlyMinutesUsed: 59400,
    monthlyMinutesQuota: 60000,
    status: "Suspended",
    createdAt: "2026-06-20",
    apiKey: "ak_live_nebu_1234567890abcdef",
  },
];

export const fetchOrganizations = async ({
  page = 1,
  limit = 5,
  search = "",
  status = "ALL",
  plan = "ALL",
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...INITIAL_ORGANIZATIONS];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.adminEmail.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (status !== "ALL") {
    filtered = filtered.filter((o) => o.status === status);
  }

  // Plan filter
  if (plan !== "ALL") {
    filtered = filtered.filter((o) => o.plan === plan);
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate Summary Stats
  const totalOrgs = INITIAL_ORGANIZATIONS.length;
  const activeOrgs = INITIAL_ORGANIZATIONS.filter((o) => o.status === "Active").length;
  const suspendedOrgs = INITIAL_ORGANIZATIONS.filter((o) => o.status === "Suspended").length;
  const totalMinutesUsed = INITIAL_ORGANIZATIONS.reduce((sum, o) => sum + o.monthlyMinutesUsed, 0);

  // Pagination slicing
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filtered.length / limit) || 1;

  return {
    data: paginatedData,
    totalRecords: filtered.length,
    totalPages,
    currentPage: page,
    stats: {
      totalOrgs,
      activeOrgs,
      suspendedOrgs,
      totalMinutesUsed,
    },
  };
};

export const provisionOrganization = async (formData) => {
  await new Promise((resolve) => setTimeout(resolve, 450));

  // Form Validation Checks
  if (!formData.name || formData.name.trim().length < 2) {
    throw new Error("Company Name must be at least 2 characters.");
  }
  if (!formData.adminEmail || !formData.adminEmail.includes("@")) {
    throw new Error("Please provide a valid Admin Email address.");
  }

  const newId = `org-${100 + INITIAL_ORGANIZATIONS.length + 1}`;
  const apiKey = `ak_live_${formData.name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 4)}_${Math.random().toString(36).substring(2, 14)}`;

  const newOrg = {
    id: newId,
    name: formData.name.trim(),
    adminEmail: formData.adminEmail.trim().toLowerCase(),
    plan: formData.plan || "Pro",
    concurrentSlots: Number(formData.concurrentSlots) || 25,
    monthlyMinutesUsed: 0,
    monthlyMinutesQuota: Number(formData.monthlyMinutesQuota) || 30000,
    status: "Active",
    createdAt: new Date().toISOString().split("T")[0],
    apiKey,
  };

  INITIAL_ORGANIZATIONS.unshift(newOrg);
  return newOrg;
};

export const toggleOrganizationStatus = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const org = INITIAL_ORGANIZATIONS.find((o) => o.id === id);
  if (!org) throw new Error("Organization not found.");

  org.status = org.status === "Active" ? "Suspended" : "Active";
  return { ...org };
};

export const deleteOrganization = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  INITIAL_ORGANIZATIONS = INITIAL_ORGANIZATIONS.filter((o) => o.id !== id);
  return true;
};

export const fetchOrganizationById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const org = INITIAL_ORGANIZATIONS.find((o) => o.id === id);
  if (!org) {
    // Fallback default organization if ID is missing or dynamic
    return {
      id: id || "org-101",
      name: "Apex Cognitive Systems",
      adminEmail: "admin@apexcognitive.com",
      plan: "Enterprise",
      concurrentSlots: 100,
      monthlyMinutesUsed: 84500,
      monthlyMinutesQuota: 100000,
      status: "Active",
      createdAt: "2025-11-15",
      apiKey: "ak_live_apex_9f8e7d6c5b4a3210",
      activeSeats: 24,
      maxSeats: 50,
      recentActivity: [
        { id: "act-1", event: "API Key Regenerated by Super-Admin", time: "2 hours ago" },
        { id: "act-2", event: "Concurrent Slots expanded from 75 to 100", time: "1 day ago" },
        { id: "act-3", event: "Monthly Compute Quota limit reset", time: "3 days ago" },
      ],
    };
  }

  return {
    ...org,
    activeSeats: org.plan === "Enterprise" ? 24 : org.plan === "Pro" ? 12 : 4,
    maxSeats: org.plan === "Enterprise" ? 50 : org.plan === "Pro" ? 20 : 5,
    recentActivity: [
      { id: "act-1", event: "Tenant compute workload health check passed", time: "30 mins ago" },
      { id: "act-2", event: "Quota telemetry usage logged", time: "3 hours ago" },
      { id: "act-3", event: "Organization configuration saved", time: "1 day ago" },
    ],
  };
};

export const updateOrganizationQuotas = async (id, { concurrentSlots, monthlyMinutesQuota }) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const org = INITIAL_ORGANIZATIONS.find((o) => o.id === id);
  if (org) {
    org.concurrentSlots = Number(concurrentSlots);
    org.monthlyMinutesQuota = Number(monthlyMinutesQuota);
  }

  return { concurrentSlots, monthlyMinutesQuota };
};

export const regenerateApiKey = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const org = INITIAL_ORGANIZATIONS.find((o) => o.id === id);
  const newKey = `ak_live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;

  if (org) {
    org.apiKey = newKey;
  }

  return newKey;
};
