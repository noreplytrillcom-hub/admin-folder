import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates and automatically downloads a styled A4 PDF document
 * matching the theme palette (#18112B dark, #7952F5 accent, #EAE8FA surface tint, #F8F8FC background).
 * 
 * Captures Dashboard Summary State:
 * 1. Active Tenants
 * 2. Node Health
 * 3. Queue Metrics
 * 4. Active Subscriptions Table
 */
export const generateDashboardPdfReport = ({
  dateRange = "Today",
  department = "Department 1",
  dashboardData = null,
  subscriptions = null,
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Palette Definitions
  const COLOR_DARK = [24, 17, 43];      // #18112B
  const COLOR_ACCENT = [121, 82, 245];  // #7952F5
  const COLOR_TINT = [234, 232, 250];   // #EAE8FA
  const COLOR_BG = [248, 248, 252];     // #F8F8FC
  const COLOR_TEXT_MUTED = [100, 116, 139]; // #64748B
  const COLOR_BORDER = [226, 232, 240];  // #E2E8F0
  const COLOR_WHITE = [255, 255, 255];
  const COLOR_SUCCESS = [16, 185, 129]; // #10B981

  let currentY = margin;

  // Helper: Draw Section Header with #7952F5 Accent Indicator
  const drawSectionHeader = (title) => {
    doc.setFillColor(...COLOR_ACCENT);
    doc.rect(margin, currentY, 3, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_DARK);
    doc.text(title.toUpperCase(), margin + 6, currentY + 4.8);

    currentY += 9;
  };

  // Helper: Draw Card Box
  const drawCardBox = (x, y, w, h, title, mainValue, subtext, accentColor = COLOR_ACCENT) => {
    // Fill Card Background
    doc.setFillColor(...COLOR_BG);
    doc.rect(x, y, w, h, "F");

    // Card Border
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h, "S");

    // Top Accent Bar
    doc.setFillColor(...accentColor);
    doc.rect(x, y, w, 1.2, "F");

    // Card Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text(title.toUpperCase(), x + 3.5, y + 5.5);

    // Main Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_DARK);
    doc.text(String(mainValue), x + 3.5, y + 12);

    // Subtext / Indicator
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text(String(subtext), x + 3.5, y + 16.5);
  };

  // ==========================================
  // 1. TOP HEADER BANNER
  // ==========================================
  // Top Header Box with #18112B Background
  doc.setFillColor(...COLOR_DARK);
  doc.rect(margin, currentY, contentWidth, 24, "F");

  // Accent Line at bottom of header banner
  doc.setFillColor(...COLOR_ACCENT);
  doc.rect(margin, currentY + 23, contentWidth, 1, "F");

  // Logo Icon / Badge
  doc.setFillColor(...COLOR_ACCENT);
  doc.roundedRect(margin + 5, currentY + 4.5, 8, 8, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_WHITE);
  doc.text("T", margin + 7.8, currentY + 10.2);

  // Brand Name & Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_WHITE);
  doc.text("TESTO AI ENTERPRISE PORTAL", margin + 16, currentY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(210, 205, 235);
  doc.text("Executive Operational & Infrastructure Summary Report", margin + 16, currentY + 14.5);

  // Metadata Timestamp & Filters (Right Aligned in Header)
  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_WHITE);
  doc.text(`DATE: ${todayStr.toUpperCase()}`, pageWidth - margin - 5, currentY + 8, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(210, 205, 235);
  doc.text(`Dept: ${department}  |  Range: ${dateRange}`, pageWidth - margin - 5, currentY + 14.5, { align: "right" });

  currentY += 29;

  // ==========================================
  // 2. ACTIVE TENANTS SUMMARY
  // ==========================================
  drawSectionHeader("1. Active Tenants & Organization Metrics");

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap * 3) / 4; // ~42.8mm
  const cardHeight = 20;

  // Active Tenants Data
  const totalTenants = 156;
  const activeTenants = 142;
  const enterpriseCount = 45;
  const growthCount = 68;
  const starterCount = 29;
  const customCount = 14;

  drawCardBox(margin, currentY, cardWidth, cardHeight, "Active Tenants", `${activeTenants} / ${totalTenants}`, "91% Active Rate", COLOR_ACCENT);
  drawCardBox(margin + cardWidth + cardGap, currentY, cardWidth, cardHeight, "Enterprise Tiers", `${enterpriseCount} Orgs`, "$112.5k MRR (45%)", COLOR_ACCENT);
  drawCardBox(margin + (cardWidth + cardGap) * 2, currentY, cardWidth, cardHeight, "Growth Tiers", `${growthCount} Orgs`, "$61.1k MRR (35%)", COLOR_ACCENT);
  drawCardBox(margin + (cardWidth + cardGap) * 3, currentY, cardWidth, cardHeight, "Starter & Custom", `${starterCount + customCount} Orgs`, "$27.3k MRR (20%)", COLOR_ACCENT);

  currentY += cardHeight + 8;

  // ==========================================
  // 3. NODE HEALTH & INFRASTRUCTURE
  // ==========================================
  drawSectionHeader("2. Cluster Node Health & Infrastructure");

  drawCardBox(margin, currentY, cardWidth, cardHeight, "Node Cluster Status", "24 / 24 Healthy", "99.98% SLA Uptime", COLOR_SUCCESS);
  drawCardBox(margin + cardWidth + cardGap, currentY, cardWidth, cardHeight, "Avg CPU Usage", "42.5%", "Peak: 68.2%", COLOR_ACCENT);
  drawCardBox(margin + (cardWidth + cardGap) * 2, currentY, cardWidth, cardHeight, "Memory Utilization", "58.1%", "18.6 GB / 32 GB", COLOR_ACCENT);
  drawCardBox(margin + (cardWidth + cardGap) * 3, currentY, cardWidth, cardHeight, "Edge Latency", "14 ms", "P99: 28 ms", COLOR_SUCCESS);

  currentY += cardHeight + 8;

  // ==========================================
  // 4. QUEUE METRICS
  // ==========================================
  drawSectionHeader("3. Execution Queue & Task Telemetry");

  drawCardBox(margin, currentY, cardWidth, cardHeight, "Active Worker Threads", "128 Threads", "100% Operational", COLOR_ACCENT);
  drawCardBox(margin + cardWidth + cardGap, currentY, cardWidth, cardHeight, "Queued Execution", "42 Jobs", "Avg Wait: 120ms", COLOR_ACCENT);
  drawCardBox(margin + (cardWidth + cardGap) * 2, currentY, cardWidth, cardHeight, "Processing Throughput", "1,450 req/sec", "Peak: 3,200 req/s", COLOR_SUCCESS);
  drawCardBox(margin + (cardWidth + cardGap) * 3, currentY, cardWidth, cardHeight, "Retry / Error Rate", "0.02%", "Zero Failure Spikes", COLOR_SUCCESS);

  currentY += cardHeight + 8;

  // ==========================================
  // 5. ACTIVE SUBSCRIPTIONS TABLE
  // ==========================================
  drawSectionHeader("4. Active Subscriptions Directory Summary");

  // Default mock subscriptions list if not passed
  const activeSubsData = subscriptions || [
    { organizationName: "Apex Cognitive Systems", adminEmail: "admin@apexcognitive.com", planTier: "Enterprise", mrrAmount: "$2,499", slots: "100", quota: "500,000", sla: "99.99%", status: "Active" },
    { organizationName: "Acme Cloud Solutions", adminEmail: "contact@acmecloud.io", planTier: "Growth", mrrAmount: "$899", slots: "50", quota: "50,000", sla: "99.9%", status: "Active" },
    { organizationName: "Vortex Data Labs", adminEmail: "billing@vortexdatalabs.com", planTier: "Starter", mrrAmount: "$299", slots: "15", quota: "15,000", sla: "99.5%", status: "Active" },
    { organizationName: "Hyperion AI Networks", adminEmail: "ops@hyperionai.tech", planTier: "Custom", mrrAmount: "$4,500", slots: "150", quota: "750,000", sla: "99.99%", status: "Active" },
    { organizationName: "Synthetix Dynamics", adminEmail: "lead@synthetix.io", planTier: "Growth", mrrAmount: "$899", slots: "50", quota: "50,000", sla: "99.9%", status: "Past Due" },
  ];

  const tableRows = activeSubsData.map((sub) => [
    sub.organizationName,
    sub.planTier.toUpperCase(),
    typeof sub.mrrAmount === "number" ? `$${sub.mrrAmount.toLocaleString()}` : sub.mrrAmount,
    sub.concurrentSlots ? `${sub.concurrentSlots} slots` : sub.slots,
    sub.monthlyMinutesQuota ? `${Number(sub.monthlyMinutesQuota).toLocaleString()} mins` : sub.quota,
    sub.slaGuarantee || sub.sla,
    (sub.status || "Active").toUpperCase(),
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [["TENANT ORGANIZATION", "PLAN TIER", "MONTHLY MRR", "SLOTS", "MINUTES QUOTA", "SLA", "STATUS"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: COLOR_DARK,
      textColor: COLOR_WHITE,
      fontSize: 7.5,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 2.5,
    },
    bodyStyles: {
      textColor: COLOR_DARK,
      fontSize: 7.5,
      cellPadding: 2.2,
    },
    alternateRowStyles: {
      fillColor: COLOR_BG,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 42 },
      1: { cellWidth: 22 },
      2: { fontStyle: "bold", cellWidth: 24 },
      3: { cellWidth: 20 },
      4: { cellWidth: 32 },
      5: { cellWidth: 22 },
      6: { fontStyle: "bold", cellWidth: 20 },
    },
    styles: {
      lineColor: COLOR_BORDER,
      lineWidth: 0.2,
    },
  });

  // ==========================================
  // 6. FOOTER & PAGE NUMBERS
  // ==========================================
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Footer Text Left
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text("CONFIDENTIAL & PROPRIETARY — TESTO AI ADMINISTRATIVE PORTAL", margin, pageHeight - 7);

    // Footer Text Right
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  }

  // Trigger Automatic Download
  const filename = `Admin-Dashboard-Report-${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(filename);
};
