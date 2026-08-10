import React, { useState, useEffect } from "react";
import OperationalHeader from "../dashboard/OperationalHeader";
import OperationalSidebar from "../dashboard/OperationalSidebar";
import NewTicketModal from "./NewTicketModal";
import CommandPaletteModal from "../dashboard/CommandPaletteModal";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Search,
  FileSpreadsheet,
  Plus,
  X,
  AlertCircle,
  Info,
  Send,
  Lock,
  User,
} from "lucide-react";

// Initial Mock Ticket Data
const INITIAL_TICKETS = [
  {
    id: "TK-8891",
    title: "Apex Global SLA Breach Warning - API Gateway 429 Throttling on Node #4",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@apexglobal.io",
    customerPlan: "Enterprise",
    totalSpent: "$150,000",
    ticketHistoryCount: 14,
    category: "Escalations",
    priority: "Critical",
    status: "Open",
    agent: "Kai Genet",
    agentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    sla: "14m remaining",
    timestamp: "10 mins ago",
    pinned: true,
    messages: [
      {
        id: "msg-1",
        senderType: "customer",
        senderName: "Sarah Jenkins",
        time: "10 mins ago",
        text: "We are seeing severe 429 rate limit exceptions on our production API endpoints during peak load tests. Requesting emergency SLA override.",
      },
      {
        id: "msg-2",
        senderType: "internal",
        senderName: "Internal Note (System Sentinel)",
        time: "7 mins ago",
        text: "Inspected cluster node #4. Redis token bucket memory allocation reached 98% threshold. Escalated to Infrastructure team.",
      },
      {
        id: "msg-3",
        senderType: "agent",
        senderName: "Kai Genet (Super Admin)",
        time: "4 mins ago",
        text: "Hello Sarah, our infrastructure team is currently scaling node #4 token bucket capacity. We have temporarily raised your rate limit ceiling.",
      },
    ],
  },
  {
    id: "TK-8890",
    title: "Billing Discrepancy on Q3 Enterprise License Renewal Invoice #INV-9021",
    customerName: "Michael Vance",
    customerEmail: "m.vance@starlight.com",
    customerPlan: "Enterprise",
    totalSpent: "$85,000",
    ticketHistoryCount: 6,
    category: "Payment",
    priority: "High",
    status: "In Progress",
    agent: "Elena Rostova",
    agentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    sla: "1h 45m remaining",
    timestamp: "32 mins ago",
    pinned: false,
    messages: [
      {
        id: "msg-10",
        senderType: "customer",
        senderName: "Michael Vance",
        time: "32 mins ago",
        text: "Our invoice #INV-9021 shows an extra seat allocation fee that was supposed to be discounted under contract #SC-4409.",
      },
      {
        id: "msg-11",
        senderType: "agent",
        senderName: "Elena Rostova",
        time: "15 mins ago",
        text: "Hi Michael, I am reviewing invoice #INV-9021 against your signed contract #SC-4409 with our Finance team.",
      },
    ],
  },
  {
    id: "TK-8889",
    title: "Custom Webhook Web Security Signature Verification Failure",
    customerName: "David Kim",
    customerEmail: "dkim@quantum.tech",
    customerPlan: "Pro",
    totalSpent: "$24,000",
    ticketHistoryCount: 3,
    category: "Technical",
    priority: "Medium",
    status: "Pending",
    agent: "Unassigned",
    agentAvatar: null,
    sla: "4h 12m remaining",
    timestamp: "1 hour ago",
    pinned: false,
    messages: [
      {
        id: "msg-20",
        senderType: "customer",
        senderName: "David Kim",
        time: "1 hour ago",
        text: "HMAC SHA256 signatures generated on payload event webhooks are failing HMAC verification on our receiver endpoint.",
      },
    ],
  },
  {
    id: "TK-8888",
    title: "SSO SAML 2.0 Okta Integration Identity Provider Cert Expiration",
    customerName: "Rachel Adams",
    customerEmail: "rachel@nexuscorp.com",
    customerPlan: "Enterprise",
    totalSpent: "$210,000",
    ticketHistoryCount: 28,
    category: "Document",
    priority: "Low",
    status: "Resolved",
    agent: "Alex Rivera",
    agentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    sla: "Resolved",
    timestamp: "3 hours ago",
    pinned: false,
    messages: [
      {
        id: "msg-30",
        senderType: "customer",
        senderName: "Rachel Adams",
        time: "3 hours ago",
        text: "We updated our Okta X.509 signing certificate. Please update the IdP metadata URL on our tenant configuration.",
      },
      {
        id: "msg-31",
        senderType: "agent",
        senderName: "Alex Rivera",
        time: "2 hours ago",
        text: "Certificate successfully rotated and validated against TestoAI IdP metadata endpoints.",
      },
    ],
  },
  {
    id: "TK-8887",
    title: "Automated PDF Report Generator Formatting Glitch on Dark Theme",
    customerName: "Marcus Thorne",
    customerEmail: "m.thorne@hyperion.io",
    customerPlan: "Pro",
    totalSpent: "$18,500",
    ticketHistoryCount: 4,
    category: "Notification",
    priority: "Low",
    status: "Open",
    agent: "Unassigned",
    agentAvatar: null,
    sla: "6h 30m remaining",
    timestamp: "4 hours ago",
    pinned: false,
    messages: [
      {
        id: "msg-40",
        senderType: "customer",
        senderName: "Marcus Thorne",
        time: "4 hours ago",
        text: "PDF exports rendered in dark mode show transparent table borders on the executive summary page.",
      },
    ],
  },
];

export default function TicketsDashboard() {
  const [department, setDepartment] = useState("Customer Support");
  const [dateRange, setDateRange] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Tickets");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Ticket Data State
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState("TK-8889");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  // Reply Composer State
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedCanned, setSelectedCanned] = useState("");

  // Modals & Notifications
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Global Keyboard listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (title, description, type = "success") => {
    setToastMessage({ title, description, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // Filtering Logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Tickets" ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "All" ||
      ticket.priority.toLowerCase() === priorityFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "All" ||
      ticket.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckboxes(filteredTickets.map((t) => t.id));
    } else {
      setSelectedCheckboxes([]);
    }
  };

  const handleToggleCheckbox = (id) => {
    setSelectedCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderType: isInternalNote ? "internal" : "agent",
      senderName: isInternalNote ? "Internal Note (Kai Genet)" : "Kai Genet (Super Admin)",
      time: "Just now",
      text: replyText,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicketId
          ? {
              ...t,
              status: isInternalNote ? t.status : "In Progress",
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );

    showToast(
      isInternalNote ? "Internal Note Added" : "Reply Sent to Customer",
      `Dispatched message to ${selectedTicket.customerName} for ${selectedTicket.id}`,
      "success"
    );

    setReplyText("");
  };

  const handleResolveTicket = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicketId ? { ...t, status: "Resolved", sla: "Resolved" } : t
      )
    );
    showToast("Ticket Resolved", `Marked ${selectedTicket.id} as Resolved`, "success");
  };

  const handleEscalateTicket = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicketId
          ? { ...t, status: "Escalated", priority: "Critical", sla: "10m remaining" }
          : t
      )
    );
    showToast("Ticket Escalated", `Escalated ${selectedTicket.id} to Critical tier`, "error");
  };

  const handleReassignAgent = (newAgent) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicketId ? { ...t, agent: newAgent } : t))
    );
    showToast("Agent Reassigned", `Assigned ${selectedTicket.id} to ${newAgent}`, "info");
  };

  const handleCreateNewTicketSuccess = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    showToast(
      "Support Ticket Created",
      `Ticket ${newTicket.id} dispatched to ${newTicket.department}`,
      "success"
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-row overflow-x-hidden">
      {/* Sidebar Rail */}
      <OperationalSidebar
        activeTab="tickets"
        setActiveTab={(tab) => {
          if (tab !== "tickets") {
            showToast("Navigating Module", `Switching to ${tab.toUpperCase()} module...`, "info");
          }
        }}
      />

      {/* Main Content Workspace Offset by 80px */}
      <div style={{ marginLeft: "80px" }} className="flex-1 min-w-0 min-h-screen flex flex-col">
        {/* Top Header Navigation Bar */}
        <OperationalHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          department={department}
          setDepartment={setDepartment}
          notifications={[]}
          onMarkAllNotificationsRead={() => {}}
          onCreateNewClick={() => setIsNewTicketModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddChartClick={() => {}}
        />

        {/* PAGE WRAPPER & HEADER ISOLATION */}
        <main style={{ padding: "24px" }} className="flex-1 w-full box-border">
          {/* Header & Title Block */}
          <div className="page-header-container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <span>TestoAI</span>
                  <span>/</span>
                  <span className="text-[#2563eb]">Tickets & Support</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Ticketing & Support Management
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    showToast("CSV Export Started", "Exporting tickets dataset to CSV...", "info");
                  }}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setIsNewTicketModalOpen(true)}
                  className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Ticket</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 1: KPI METRICS GRID */}
          <div className="kpi-grid">
            {/* KPI 1: Total Received */}
            <div className="kpi-card shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Total Tickets Received</span>
                <div className="p-2 rounded-lg bg-blue-50 text-[#2563eb]">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">1,420</h2>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ +12.4%</span>
                  <span className="text-slate-400 font-normal">vs last week</span>
                </p>
              </div>
            </div>

            {/* KPI 2: Unassigned / Open */}
            <div className="kpi-card shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Unassigned / Open Queue</span>
                <div className="p-2 rounded-lg bg-rose-50 text-rose-500">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">42</h2>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                    5 SLA Breach Risk (&lt;15m)
                  </span>
                </div>
              </div>
            </div>

            {/* KPI 3: Avg First Response Time */}
            <div className="kpi-card shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Avg. First Response Time</span>
                <div className="p-2 rounded-lg bg-sky-50 text-sky-500">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">14m 30s</h2>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                  Target: &lt;20m <span className="text-slate-400 font-normal">(Optimal)</span>
                </p>
              </div>
            </div>

            {/* KPI 4: Customer CSAT Score */}
            <div className="kpi-card shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Customer CSAT Rating</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">4.8 / 5.0</h2>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                  96.4% <span className="text-slate-400 font-normal">Satisfaction Rate</span>
                </p>
              </div>
            </div>
          </div>

          {/* ROW 2: FILTER TOOLBAR LAYOUT */}
          <div className="toolbar-container">
            {/* Row 1: Status Filter Tabs */}
            <div className="status-tabs-wrapper">
              {["All Tickets", "Open", "In Progress", "Pending", "Resolved", "Escalated"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`status-tab ${statusFilter === tab ? "active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Row 2: Search Input & Dropdowns */}
            <div className="search-and-selects-row flex-wrap">
              <div className="search-input-wrapper">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ticket ID, title, or customer name..."
                  style={{ height: "36px", paddingLeft: "36px", paddingRight: "16px" }}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div className="dropdown-filters">
                <label>
                  Priority:
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </label>

                <label>
                  Category:
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Escalations">Escalations</option>
                    <option value="Payment">Payment</option>
                    <option value="Technical">Technical</option>
                    <option value="Document">Document</option>
                    <option value="Notification">Notification</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* ROW 3: SPLIT WORKSPACE GRID (5FR 7FR) */}
          <div className="workspace-grid">
            {/* 1. LEFT CARD: TICKET QUEUE LIST REFACTOR (.ticket-queue-card) */}
            <div className="ticket-queue-card shadow-xs">
              {/* Card Header Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f1f5f9",
                  backgroundColor: "#f8fafc",
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredTickets.length > 0 &&
                      selectedCheckboxes.length === filteredTickets.length
                    }
                    className="w-4 h-4 rounded text-[#2563eb] border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                    Ticket Queue ({filteredTickets.length})
                  </span>
                </div>

                {selectedCheckboxes.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">
                      {selectedCheckboxes.length} selected
                    </span>
                    <button
                      onClick={() => {
                        setTickets((prev) =>
                          prev.map((t) =>
                            selectedCheckboxes.includes(t.id) ? { ...t, status: "Resolved" } : t
                          )
                        );
                        setSelectedCheckboxes([]);
                        showToast("Bulk Resolved", "Marked selected tickets as Resolved", "success");
                      }}
                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold"
                    >
                      Resolve Selected
                    </button>
                  </div>
                )}
              </div>

              {/* Ticket Item List Scroll Area (.ticket-list-scroll) */}
              <div className="ticket-list-scroll divide-y divide-slate-100">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const isSelected = ticket.id === selectedTicketId;
                    const isChecked = selectedCheckboxes.includes(ticket.id);

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        style={{
                          padding: "14px 16px",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50/70 border-l-4 border-l-[#2563eb]" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Line 1 (Meta Tags): Checkbox + Ticket ID + Priority Dot + Category Badge + Status Pill */}
                        <div className="ticket-row-header">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleCheckbox(ticket.id);
                            }}
                            className="w-4 h-4 rounded text-[#2563eb] border-slate-300 focus:ring-0 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {ticket.id}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              ticket.priority === "Critical"
                                ? "bg-rose-500"
                                : ticket.priority === "High"
                                ? "bg-amber-500"
                                : ticket.priority === "Medium"
                                ? "bg-yellow-400"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                            {ticket.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ml-auto ${
                              ticket.status === "Open"
                                ? "bg-sky-100 text-sky-700"
                                : ticket.status === "In Progress"
                                ? "bg-amber-100 text-amber-700"
                                : ticket.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>

                        {/* Line 2 (Title): Subject Line */}
                        <h4 className="ticket-title truncate">{ticket.title}</h4>

                        {/* Line 3 (Customer & Assignee Footer): Left Customer & Time, Right Assignee */}
                        <div className="ticket-meta">
                          <span className="truncate">
                            {ticket.customerName} • {ticket.timestamp}
                          </span>
                          <span className="font-semibold text-slate-600 shrink-0 ml-2 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {ticket.agent}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <Ticket className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold">No tickets matching selected filters</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. RIGHT CARD: TICKET DETAIL & CONTEXT PANE REFACTOR (.ticket-detail-pane) */}
            <div className="ticket-detail-pane shadow-xs">
              {selectedTicket ? (
                <>
                  {/* Top Detail Header Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {selectedTicket.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          selectedTicket.priority === "Critical"
                            ? "bg-rose-100 text-rose-700"
                            : selectedTicket.priority === "High"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-[#2563eb]"
                        }`}
                      >
                        {selectedTicket.priority} Priority
                      </span>
                    </div>

                    <span
                      style={{
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                      className="text-[10px]"
                    >
                      SLA: {selectedTicket.sla}
                    </span>
                  </div>

                  {/* Title Block & Customer Info Box */}
                  <div className="border-b border-slate-100">
                    <h3
                      style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: "12px 16px 8px 16px" }}
                      className="leading-snug line-clamp-2"
                    >
                      {selectedTicket.title}
                    </h3>

                    {/* Customer Info Card (.customer-meta-box) */}
                    <div className="customer-meta-box text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "#2563eb",
                            color: "#ffffff",
                            fontWeight: 700,
                            borderRadius: "50%",
                          }}
                          className="flex items-center justify-center shrink-0 text-xs shadow-xs"
                        >
                          {selectedTicket.customerName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {selectedTicket.customerName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {selectedTicket.customerEmail}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-[10px] shrink-0">
                        <span
                          style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                          className="px-2 py-0.5 font-bold rounded"
                        >
                          {selectedTicket.customerPlan}
                        </span>
                        <p className="text-slate-400 mt-1 font-medium">
                          Spent: {selectedTicket.totalSpent}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Conversation Thread Scroll Area (.message-thread-area) */}
                  <div className="message-thread-area bg-[#F8FAFC]">
                    {selectedTicket.messages.map((msg) => {
                      if (msg.senderType === "internal") {
                        return (
                          <div key={msg.id} className="note-bubble space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold">
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-600" />
                                {msg.senderName}
                              </span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="text-amber-950 font-medium text-xs leading-relaxed">
                              {msg.text}
                            </p>
                          </div>
                        );
                      }

                      const isAgent = msg.senderType === "agent";

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                            <span className="font-semibold text-slate-700">{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.time}</span>
                          </div>

                          <div
                            className={
                              isAgent
                                ? "agent-bubble shadow-xs"
                                : "customer-bubble shadow-xs"
                            }
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Reply & Composer Footer Box (.composer-footer) */}
                  <form onSubmit={handleSendReply} className="composer-footer">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsInternalNote((prev) => !prev)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: isInternalNote ? "#fef3c7" : "#f1f5f9",
                          border: `1px solid ${isInternalNote ? "#fde68a" : "#cbd5e1"}`,
                          color: isInternalNote ? "#b45309" : "#475569",
                          cursor: "pointer",
                        }}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isInternalNote ? "Private Note Enabled" : "Private Note"}</span>
                      </button>

                      <select
                        value={selectedCanned}
                        onChange={(e) => {
                          setSelectedCanned(e.target.value);
                          if (e.target.value === "canned1") {
                            setReplyText("Hello! We are currently investigating this issue with our engineering team and will provide an update within 15 minutes.");
                          } else if (e.target.value === "canned2") {
                            setReplyText("Could you please provide raw API request payload logs and response headers so we can trace this event?");
                          }
                        }}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium cursor-pointer focus:outline-none"
                      >
                        <option value="">Canned Responses...</option>
                        <option value="canned1">SLA Delay Notice</option>
                        <option value="canned2">Request Raw Logs</option>
                      </select>
                    </div>

                    {/* Textarea */}
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        isInternalNote
                          ? "Add a private note (visible only to internal support team)..."
                          : "Type public reply to customer..."
                      }
                      style={{
                        width: "100%",
                        minHeight: "72px",
                        padding: "10px 12px",
                        fontSize: "13px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        margin: "10px 0",
                        boxSizing: "border-box",
                      }}
                      className="bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
                    />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleResolveTicket}
                          style={{ color: "#10b981", fontWeight: 700 }}
                          className="hover:underline cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                        <button
                          type="button"
                          onClick={handleEscalateTicket}
                          style={{ color: "#ef4444", fontWeight: 700 }}
                          className="hover:underline cursor-pointer"
                        >
                          Escalate Ticket
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={selectedTicket.agent}
                          onChange={(e) => handleReassignAgent(e.target.value)}
                          className="text-xs bg-slate-100 text-slate-700 font-semibold rounded-lg px-2.5 py-1.5 border-none cursor-pointer"
                        >
                          <option value="Kai Genet">Kai Genet</option>
                          <option value="Elena Rostova">Elena Rostova</option>
                          <option value="Alex Rivera">Alex Rivera</option>
                          <option value="Unassigned">Unassigned</option>
                        </select>

                        <button
                          type="submit"
                          style={{
                            background: "#2563eb",
                            color: "#ffffff",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontWeight: 600,
                          }}
                          className="hover:bg-blue-700 cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400 my-auto">
                  <Ticket className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">Select a ticket from the queue to view details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals & Overlays */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSubmitSuccess={handleCreateNewTicketSuccess}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectResult={(item) => {
          showToast("Command Executed", `Opened record ${item.title}`, "success");
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toastMessage.type === "info" ? (
            <Info className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-100">{toastMessage.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toastMessage.description}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
