// Operational Dashboard Mock Data & State Filters
// Grounded in TestoAI branding and exact reference data structures

export const DEPARTMENTS = [
  "Department 1",
  "Department 2",
  "Customer Support",
  "Operations & Sales",
  "Engineering",
];

export const DATE_RANGES = [
  "Today",
  "This Week",
  "This Month",
  "February 2025",
];

export const VIEWS = [
  "View Dashboard",
  "View Custom1",
  "View Executive",
  "View Ops Queue",
];

export const getFilteredDashboardData = (dateRange = "Today", department = "Department 1") => {
  let multiplier = 1.0;
  if (dateRange === "This Week") multiplier = 1.2;
  if (dateRange === "This Month" || dateRange === "February 2025") multiplier = 1.5;
  if (dateRange === "Today") multiplier = 1.0;

  let deptMult = department === "Department 1" ? 1.0 : 0.85;

  const contactVal = Math.round(324 * multiplier * deptMult);
  const ticketVal = Math.round(132 * multiplier * deptMult);
  const internalVal = Math.round(102 * multiplier * deptMult);
  const externalVal = Math.round(80 * multiplier * deptMult);

  const surveyTotal = Math.round(34402 * multiplier * deptMult);
  const ticketDuration = Math.round(321 * multiplier * deptMult);
  const categoryTotal = Math.round(430 * multiplier * deptMult);

  const callFaq = Math.round(600 * multiplier * deptMult);
  const callMedical = Math.round(200 * multiplier * deptMult);
  const callComplaint = Math.round(300 * multiplier * deptMult);
  const callAppointment = Math.round(200 * multiplier * deptMult);
  const callBooking = Math.round(400 * multiplier * deptMult);

  return {
    kpis: {
      contact: {
        id: "contact",
        title: "Contact",
        value: contactVal.toLocaleString(),
        subtext: "Last Update : Yesterday",
        change: "+12.4%",
        isPositive: true,
      },
      ticket: {
        id: "ticket",
        title: "Ticket",
        value: ticketVal.toLocaleString(),
        subtext: "Last Update : Yesterday",
        change: "+8.1%",
        isPositive: true,
      },
      internal: {
        id: "internal",
        title: "Internal",
        value: internalVal.toLocaleString(),
        subtext: "Compare of last month",
        change: "+4.3%",
        isPositive: true,
      },
      external: {
        id: "external",
        title: "External",
        value: externalVal.toLocaleString(),
        subtext: "Compare of last month",
        change: "-2.1%",
        isPositive: false,
      },
    },

    // Row 2 Left: Survey Statistic Bar Chart Data
    surveyChart: {
      total: surveyTotal.toLocaleString(),
      period: "/month",
      avgBenchmark: 550,
      activeDataPoint: {
        date: "14 Feb",
        value: "760 Survey",
        rawVal: 760,
      },
      bars: [
        { name: "01-07", bar1: 420, bar2: 610, bar3: 350, bar4: 580, bar5: 410 },
        { name: "07-15", bar1: 590, bar2: 650, bar3: 880, bar4: 760, isPeak: true },
        { name: "15-22", bar1: 620, bar2: 950, bar3: 540, bar4: 810 },
        { name: "22-28", bar1: 590, bar2: 600, bar3: 890, bar4: 920 },
      ],
      dailyBars: [
        { day: "01", val: 420 },
        { day: "02", val: 510 },
        { day: "03", val: 380 },
        { day: "04", val: 620 },
        { day: "05", val: 450 },
        { day: "06", val: 580 },
        { day: "07", val: 490 },
        { day: "08", val: 670 },
        { day: "09", val: 710 },
        { day: "10", val: 530 },
        { day: "11", val: 820 },
        { day: "12", val: 640 },
        { day: "13", val: 880 },
        { day: "14", val: 760, dateStr: "14 Feb", isHighlighted: true },
        { day: "15", val: 590 },
        { day: "16", val: 630 },
        { day: "17", val: 740 },
        { day: "18", val: 920 },
        { day: "19", val: 480 },
        { day: "20", val: 810 },
        { day: "21", val: 690 },
        { day: "22", val: 550 },
        { day: "23", val: 610 },
        { day: "24", val: 580 },
        { day: "25", val: 730 },
        { day: "26", val: 440 },
        { day: "27", val: 890 },
        { day: "28", val: 910 },
      ],
    },

    // Row 2 Right: Ticket By Stage Data
    ticketStage: {
      totalDuration: ticketDuration.toLocaleString(),
      suffix: "/Customer",
      passedPct: 80,
      otherPct: 20,
      alert: {
        title: "Never Give Up",
        message: "You can move conversations with other admins to optimize complaints or discussions from customers",
        actionText: "Assign to other",
      },
    },

    // Row 3 Left: Ticket by Category Stacked Bar Data
    ticketCategory: {
      totalInteraction: categoryTotal.toLocaleString(),
      suffix: "Client",
      items: [
        { name: "Payment", count: Math.round(102 * multiplier * deptMult), color: "#10B981", pct: 40 },
        { name: "Document", count: Math.round(80 * multiplier * deptMult), color: "#F59E0B", pct: 28 },
        { name: "Notification", count: Math.round(70 * multiplier * deptMult), color: "#0EA5E9", pct: 20 },
        { name: "Escalations", count: Math.round(50 * multiplier * deptMult), color: "#EF4444", pct: 12 },
      ],
    },

    // Row 3 Right: Call Details Semi-Arc Gauge & Legend Data
    callDetails: {
      totalChats: "1800",
      items: [
        { name: "FAQ", count: callFaq, color: "#10B981" },
        { name: "Medical", count: callMedical, color: "#8B5CF6" },
        { name: "Complaint", count: callComplaint, color: "#0066FF" },
        { name: "Appointment", count: callAppointment, color: "#EF4444" },
        { name: "New Booking", count: callBooking, color: "#F59E0B" },
      ],
    },

    // Notifications for Bell dropdown
    notifications: [
      { id: "n1", title: "Urgent SLA Alert", text: "Customer ticket #TK-8891 requires immediate dispatch", time: "2m ago", unread: true, type: "urgent" },
      { id: "n2", title: "New Survey Response", text: "Received 5-star rating for Support Department 1", time: "14m ago", unread: true, type: "lead" },
      { id: "n3", title: "Daily Target Met", text: "760 Surveys logged for 14 Feb peak window", time: "1h ago", unread: true, type: "info" },
    ],
  };
};
