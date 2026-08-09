// Mock API & Accounting Service Layer for Page 10 Invoicing Directory

const INITIAL_INVOICES = [
  {
    id: "inv-1001",
    invoiceNumber: "INV-2026-001",
    organizationId: "org-101",
    organizationName: "Apex Cognitive Systems",
    adminEmail: "admin@apexcognitive.com",
    subtotalUsd: 2499.00,
    taxUsd: 0.00,
    discountUsd: 0.00,
    totalUsd: 2499.00,
    status: "paid",
    stripeInvoiceId: "in_1N823719231a",
    dueDate: "2026-08-01",
    paidAt: "2026-08-01T14:20:00Z",
    createdAt: "2026-07-25",
  },
  {
    id: "inv-1002",
    invoiceNumber: "INV-2026-002",
    organizationId: "org-102",
    organizationName: "Acme Cloud Solutions",
    adminEmail: "contact@acmecloud.io",
    subtotalUsd: 899.00,
    taxUsd: 0.00,
    discountUsd: 0.00,
    totalUsd: 899.00,
    status: "paid",
    stripeInvoiceId: "in_1N991823711b",
    dueDate: "2026-08-05",
    paidAt: "2026-08-04T09:15:00Z",
    createdAt: "2026-07-28",
  },
  {
    id: "inv-1003",
    invoiceNumber: "INV-2026-003",
    organizationId: "org-103",
    organizationName: "Vortex Data Labs",
    adminEmail: "billing@vortexdatalabs.com",
    subtotalUsd: 299.00,
    taxUsd: 0.00,
    discountUsd: 50.00,
    totalUsd: 249.00,
    status: "pending",
    stripeInvoiceId: "in_1N112837192c",
    dueDate: "2026-08-15",
    paidAt: null,
    createdAt: "2026-08-01",
  },
  {
    id: "inv-1004",
    invoiceNumber: "INV-2026-004",
    organizationId: "org-105",
    organizationName: "Synthetix Dynamics",
    adminEmail: "lead@synthetix.io",
    subtotalUsd: 899.00,
    taxUsd: 0.00,
    discountUsd: 0.00,
    totalUsd: 899.00,
    status: "overdue",
    stripeInvoiceId: "in_1N441209381d",
    dueDate: "2026-08-03",
    paidAt: null,
    createdAt: "2026-07-20",
  },
  {
    id: "inv-1005",
    invoiceNumber: "INV-2026-005",
    organizationId: "org-104",
    organizationName: "Hyperion AI Networks",
    adminEmail: "ops@hyperionai.tech",
    subtotalUsd: 4500.00,
    taxUsd: 0.00,
    discountUsd: 0.00,
    totalUsd: 4500.00,
    status: "failed",
    stripeInvoiceId: "in_1N881237491e",
    dueDate: "2026-08-08",
    paidAt: null,
    createdAt: "2026-07-28",
  },
];

export const fetchInvoicesData = async ({
  page = 1,
  limit = 10,
  search = "",
  statusFilter = "ALL",
}) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  let filtered = [...INITIAL_INVOICES];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.organizationName.toLowerCase().includes(q) ||
        inv.adminEmail.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== "ALL") {
    filtered = filtered.filter((inv) => inv.status === statusFilter.toLowerCase());
  }

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  // Compute accounting financial metrics
  const totalCollectedUsd = INITIAL_INVOICES.filter((i) => i.status === "paid").reduce(
    (acc, i) => acc + i.totalUsd,
    0
  );
  const pendingReceivablesUsd = INITIAL_INVOICES.filter((i) => i.status === "pending").reduce(
    (acc, i) => acc + i.totalUsd,
    0
  );
  const overdueReceivablesUsd = INITIAL_INVOICES.filter((i) => i.status === "overdue").reduce(
    (acc, i) => acc + i.totalUsd,
    0
  );
  const overdueInvoiceCount = INITIAL_INVOICES.filter((i) => i.status === "overdue").length;
  const failedChargeRetriesCount = INITIAL_INVOICES.filter((i) => i.status === "failed").length;

  return {
    data,
    totalRecords,
    totalPages,
    currentPage: page,
    metrics: {
      totalCollectedUsd,
      pendingReceivablesUsd,
      overdueReceivablesUsd,
      overdueInvoiceCount,
      failedChargeRetriesCount,
    },
  };
};

export const recordManualPayment = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const inv = INITIAL_INVOICES.find((i) => i.id === payload.invoiceId);
  if (inv) {
    inv.status = "paid";
    inv.paidAt = new Date().toISOString();
  }

  return inv;
};
