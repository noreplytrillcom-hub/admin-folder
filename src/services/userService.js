// Mock User Management Service for Page 5

const MOCK_USERS = [
  {
    id: "usr-101",
    name: "Alex Rivera",
    email: "alex.rivera@apexcognitive.com",
    tenantName: "Apex Cognitive Systems",
    tenantId: "org-101",
    role: "Tenant Admin",
    status: "Active",
    mfaEnabled: true,
    lastLogin: "10 mins ago",
    createdAt: "2025-11-15",
  },
  {
    id: "usr-102",
    name: "Elena Rostova",
    email: "elena@acmecloud.io",
    tenantName: "Acme Cloud Solutions",
    tenantId: "org-102",
    role: "QA Engineer",
    status: "Active",
    mfaEnabled: true,
    lastLogin: "2 hours ago",
    createdAt: "2025-12-01",
  },
  {
    id: "usr-103",
    name: "Marcus Vance",
    email: "marcus@vortexdatalabs.com",
    tenantName: "Vortex Data Labs",
    tenantId: "org-103",
    role: "Developer",
    status: "Locked",
    mfaEnabled: false,
    lastLogin: "3 days ago",
    createdAt: "2026-01-10",
  },
  {
    id: "usr-104",
    name: "Sophia Chen",
    email: "sophia.c@hyperionai.tech",
    tenantName: "Hyperion AI Networks",
    tenantId: "org-104",
    role: "Tenant Admin",
    status: "Active",
    mfaEnabled: true,
    lastLogin: "1 day ago",
    createdAt: "2026-01-18",
  },
  {
    id: "usr-105",
    name: "David Kim",
    email: "david@synthetix.io",
    tenantName: "Synthetix Dynamics",
    tenantId: "org-105",
    role: "Read-Only",
    status: "Pending MFA",
    mfaEnabled: false,
    lastLogin: "Never",
    createdAt: "2026-02-04",
  },
];

export const fetchAllTenantUsers = async ({ page = 1, limit = 5, search = "", role = "ALL", status = "ALL" }) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  let filtered = [...MOCK_USERS];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.tenantName.toLowerCase().includes(q) ||
        u.tenantId.toLowerCase().includes(q)
    );
  }

  if (role !== "ALL") {
    filtered = filtered.filter((u) => u.role === role);
  }

  if (status !== "ALL") {
    filtered = filtered.filter((u) => u.status === status);
  }

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  return {
    data,
    totalRecords,
    totalPages,
    currentPage: page,
    stats: {
      totalUsers: 1420,
      activeUsers: 1385,
      lockedUsers: 22,
      pendingMfa: 13,
    },
  };
};

export const toggleUserLockStatus = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const user = MOCK_USERS.find((u) => u.id === id);
  if (user) {
    user.status = user.status === "Active" ? "Locked" : "Active";
    return user.status;
  }
  return "Active";
};
