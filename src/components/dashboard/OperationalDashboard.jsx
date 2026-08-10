import React, { useState, useEffect, useRef } from "react";
import OperationalHeader from "./OperationalHeader";
import OperationalSidebar from "./OperationalSidebar";
import Row1KpiCards from "./Row1KpiCards";
import Row2OperationalFunnel from "./Row2OperationalFunnel";
import Row3InsightsCategorization from "./Row3InsightsCategorization";
import CreateNewModal from "./CreateNewModal";
import AssignTaskModal from "./AssignTaskModal";
import CommandPaletteModal from "./CommandPaletteModal";
import { getFilteredDashboardData, VIEWS, DATE_RANGES } from "./dashboardData";
import { CheckCircle2, AlertCircle, Info, ChevronDown, X } from "lucide-react";

export default function OperationalDashboard() {
  // Global Filter State
  const [dateRange, setDateRange] = useState("Today");
  const [department, setDepartment] = useState("Department 1");
  const [activeView, setActiveView] = useState("View Custom1");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dropdown States for Sub-header Toolbar
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);

  const viewRef = useRef(null);
  const dateRef = useRef(null);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(() =>
    getFilteredDashboardData("Today", "Department 1")
  );

  // Modals & Popover State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast Notification Message State
  const [toastMessage, setToastMessage] = useState(null);

  // Trigger data update on filter change
  useEffect(() => {
    const updated = getFilteredDashboardData(dateRange, department);
    setDashboardData(updated);
  }, [dateRange, department]);

  // Handle outside click for sub-header menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (viewRef.current && !viewRef.current.contains(e.target)) setShowViewMenu(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setShowDateMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard listener for Ctrl+K or Cmd+K
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
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Card Contextual Menu Actions
  const handleCardMenuAction = (cardKey, action) => {
    if (action === "audit") {
      showToast("Detailed Audit Log", `Inspecting full log stream for ${cardKey.toUpperCase()}...`, "info");
    } else if (action === "export") {
      showToast("CSV Export Started", `Downloading telemetry dataset for ${cardKey}.csv`, "success");
    } else if (action === "refresh") {
      showToast("Telemetry Refreshed", `Updated live metrics for ${cardKey}`, "success");
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setDashboardData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }));
    showToast("Notifications Cleared", "All alerts marked as read", "info");
  };

  const handleCreateSubmit = (newItem) => {
    showToast(
      "Operational Item Created",
      `Dispatched new ${newItem.type}: "${newItem.title}" to ${newItem.department}`,
      "success"
    );
  };

  const handleAssignTaskSuccess = (engineerName) => {
    showToast(
      "Urgent Task Assigned",
      `Reallocated tickets to ${engineerName} for customer complaint optimization`,
      "success"
    );
  };

  const handleAddChartClick = (type) => {
    showToast(
      "Widget Added",
      `New ${type.toUpperCase()} analytics card added to operational layout`,
      "success"
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-row overflow-x-hidden">
      {/* Fixed 80px Wide Navigation Rail */}
      <OperationalSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          showToast("View Switched", `Navigated to ${tab.toUpperCase()} module`, "info");
        }}
      />

      {/* Main Content Workspace: Offset by exactly 80px to align right beside sidebar */}
      <div
        style={{ marginLeft: "80px" }}
        className="flex-1 min-w-0 min-h-screen flex flex-col transition-all duration-200"
      >
        {/* Top Header Navigation Bar */}
        <OperationalHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          department={department}
          setDepartment={setDepartment}
          activeView={activeView}
          setActiveView={setActiveView}
          notifications={dashboardData.notifications}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onCreateNewClick={() => setIsCreateModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddChartClick={handleAddChartClick}
        />

        {/* Part 2: Filter / View Controller Bar directly above card grid with margin: 16px 0 20px 0 */}
        <div
          style={{
            margin: "16px 0 20px 0",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            fontSize: "14px",
            fontWeight: "500",
          }}
          className="w-full flex-wrap"
        >
          <div className="flex items-center" style={{ gap: "16px" }}>
            <button className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-[8px] font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
              View Dashboard
            </button>

            {/* Custom View Dropdown */}
            <div className="relative" ref={viewRef}>
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-[8px] font-semibold text-[#0066FF] shadow-xs hover:bg-blue-50/50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{activeView}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#0066FF]" />
              </button>

              {showViewMenu && (
                <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1">
                  {VIEWS.map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setActiveView(v);
                        setShowViewMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                        activeView === v ? "bg-blue-50 text-[#0066FF] font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date And Time Selector Dropdown */}
            <div className="relative" ref={dateRef}>
              <button
                onClick={() => setShowDateMenu(!showDateMenu)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-[8px] shadow-xs hover:border-slate-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="text-slate-400 font-medium">Date And Time</span>
                <span className="text-[#0066FF] font-bold flex items-center gap-1">
                  {dateRange}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDateMenu && (
                <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1">
                  {DATE_RANGES.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDateRange(d);
                        setShowDateMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                        dateRange === d ? "bg-blue-50 text-[#0066FF] font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Main Workspace Grid (.dashboard-grid: repeat(12, 1fr), gap 20px, padding 0 24px 24px 24px) */}
        <main
          className="dashboard-grid flex-1 w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "20px",
            padding: "0 24px 24px 24px",
            boxSizing: "border-box",
          }}
        >
          {/* ROW 1: KPI METRIC CARDS (SPAN 3 EACH) */}
          <div style={{ gridColumn: "span 12" }}>
            <Row1KpiCards
              kpis={dashboardData.kpis}
              onCardMenuAction={handleCardMenuAction}
            />
          </div>

          {/* ROW 2: OPERATIONAL DATA & FUNNEL BREAKDOWN (SPAN 8 / SPAN 4) */}
          <div style={{ gridColumn: "span 12" }}>
            <Row2OperationalFunnel
              surveyChart={dashboardData.surveyChart}
              ticketStage={dashboardData.ticketStage}
              onAssignTaskClick={() => setIsAssignModalOpen(true)}
            />
          </div>

          {/* ROW 3: INSIGHTS & PLATFORM CATEGORIZATION (SPAN 6 / SPAN 6) */}
          <div style={{ gridColumn: "span 12" }}>
            <Row3InsightsCategorization
              ticketCategory={dashboardData.ticketCategory}
              callDetails={dashboardData.callDetails}
            />
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <CreateNewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleCreateSubmit}
      />

      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        slaAlert={dashboardData.ticketStage.alert}
        onAssignSuccess={handleAssignTaskSuccess}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectResult={(item) => {
          showToast("Command Executed", `Opened ${item.title}`, "success");
        }}
      />

      {/* Floating Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          ) : toastMessage.type === "info" ? (
            <Info className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
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
