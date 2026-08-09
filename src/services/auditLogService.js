// Mock Audit Logging & System Diagnostics Service for Phase 5

const MOCK_AUDIT_LOGS = [
  {
    id: "log_9f8e7d",
    timestamp: "2026-08-10 01:05:12",
    adminId: "zaid.admin@testo.com",
    adminRole: "Super-Admin",
    actionType: "TENANT_PROVISIONED",
    targetTenant: "Quantum Cognitive Labs",
    targetTenantId: "org-109",
    ipAddress: "192.168.1.105",
    location: "US-East (Virginia)",
    payloadBefore: null,
    payloadAfter: {
      id: "org-109",
      name: "Quantum Cognitive Labs",
      adminEmail: "ops@quantumcognitive.ai",
      plan: "Enterprise",
      concurrentSlots: 75,
      monthlyMinutesQuota: 75000,
      status: "Active",
      apiKeyGenerated: "ak_live_quan_****************",
    },
  },
  {
    id: "log_8a7b6c",
    timestamp: "2026-08-10 00:48:35",
    adminId: "sarah.ops@testo.com",
    adminRole: "Support Engineer",
    actionType: "QUOTA_ADJUSTED",
    targetTenant: "Apex Cognitive Systems",
    targetTenantId: "org-101",
    ipAddress: "10.0.4.52",
    location: "US-West (Oregon)",
    payloadBefore: {
      concurrentSlots: 75,
      monthlyMinutesQuota: 75000,
    },
    payloadAfter: {
      concurrentSlots: 100,
      monthlyMinutesQuota: 100000,
    },
  },
  {
    id: "log_7c6b5a",
    timestamp: "2026-08-09 23:14:02",
    adminId: "zaid.admin@testo.com",
    adminRole: "Super-Admin",
    actionType: "API_KEY_REGENERATED",
    targetTenant: "Acme Cloud Solutions",
    targetTenantId: "org-102",
    ipAddress: "192.168.1.105",
    location: "US-East (Virginia)",
    payloadBefore: {
      apiKey: "ak_live_acme_old_key_8899",
      keyStatus: "active",
    },
    payloadAfter: {
      apiKey: "ak_live_acme_1a2b3c4d5e6f7890",
      keyStatus: "active",
      invalidatedKey: "ak_live_acme_old_key_8899",
    },
  },
  {
    id: "log_6b5a4f",
    timestamp: "2026-08-09 21:05:44",
    adminId: "finance.lead@testo.com",
    adminRole: "Finance Lead",
    actionType: "TENANT_SUSPENDED",
    targetTenant: "Nebula Robotics",
    targetTenantId: "org-108",
    ipAddress: "172.16.0.12",
    location: "EU-Central (Frankfurt)",
    payloadBefore: {
      status: "Active",
      billingStatus: "overdue_30d",
    },
    payloadAfter: {
      status: "Suspended",
      suspensionReason: "Overdue invoice payment threshold exceeded",
    },
  },
  {
    id: "log_5a4f3e",
    timestamp: "2026-08-09 18:30:19",
    adminId: "zaid.admin@testo.com",
    adminRole: "Super-Admin",
    actionType: "ADMIN_ROLE_UPDATED",
    targetTenant: "Internal Portal Access",
    targetTenantId: "sys-access",
    ipAddress: "192.168.1.105",
    location: "US-East (Virginia)",
    payloadBefore: {
      userEmail: "support.engineer@testo.com",
      role: "Support Engineer",
    },
    payloadAfter: {
      userEmail: "support.engineer@testo.com",
      role: "Operations Lead",
    },
  },
  {
    id: "log_4f3e2d",
    timestamp: "2026-08-09 15:12:00",
    adminId: "sarah.ops@testo.com",
    adminRole: "Support Engineer",
    actionType: "EXPLICIT_DATA_EXPORT",
    targetTenant: "Vortex Data Labs",
    targetTenantId: "org-103",
    ipAddress: "10.0.4.52",
    location: "US-West (Oregon)",
    payloadBefore: null,
    payloadAfter: {
      exportFormat: "CSV",
      recordsExported: 489,
      hashDigest: "sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
  },
];

export const fetchAuditLogs = async ({
  page = 1,
  limit = 5,
  search = "",
  actionType = "ALL",
}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...MOCK_AUDIT_LOGS];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (l) =>
        l.adminId.toLowerCase().includes(q) ||
        l.targetTenant.toLowerCase().includes(q) ||
        l.targetTenantId.toLowerCase().includes(q) ||
        l.ipAddress.includes(q) ||
        l.actionType.toLowerCase().includes(q)
    );
  }

  if (actionType !== "ALL") {
    filtered = filtered.filter((l) => l.actionType === actionType);
  }

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    totalRecords,
    totalPages,
    currentPage: page,
    stats: {
      totalEvents: 14850,
      securityEvents: 1240,
      quotaMutations: 3820,
      criticalWarnings: 12,
    },
  };
};

export const exportAuditLogsData = (format = "csv", logs = MOCK_AUDIT_LOGS) => {
  if (format === "json") {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Audit_Logs_Export_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  // Default CSV format
  const headers = ["Log ID", "Timestamp", "Admin Email", "Admin Role", "Action Type", "Target Tenant", "Tenant ID", "IP Address", "Location"];
  const rows = logs.map((l) => [
    l.id,
    l.timestamp,
    l.adminId,
    l.adminRole,
    l.actionType,
    `"${l.targetTenant}"`,
    l.targetTenantId,
    l.ipAddress,
    `"${l.location}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Audit_Logs_Export_${new Date().toISOString().substring(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
