import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import OperationalHeader from "../components/dashboard/OperationalHeader";
import OperationalSidebar from "../components/dashboard/OperationalSidebar";
import CreateNewModal from "../components/dashboard/CreateNewModal";
import AssignTaskModal from "../components/dashboard/AssignTaskModal";
import CommandPaletteModal from "../components/dashboard/CommandPaletteModal";
import { getFilteredDashboardData } from "../components/dashboard/dashboardData";
import { generateDashboardPdfReport } from "../utils/pdfExportGenerator";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function OperationalLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Global Filter State
  const [dateRange, setDateRange] = useState("Today");
  const [department, setDepartment] = useState("Department 1");
  const [activeView, setActiveView] = useState("View Custom1");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Tab indicator synced with route path
  const getTabFromPath = (path) => {
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/organizations")) return "organizations";
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/tickets")) return "tickets";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/compute")) return "compute";
    if (path.startsWith("/subscriptions")) return "subscriptions";
    return "dashboard";
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Dashboard Data & Notifications State
  const [dashboardData, setDashboardData] = useState(() =>
    getFilteredDashboardData("Today", "Department 1")
  );

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const updated = getFilteredDashboardData(dateRange, department);
    setDashboardData(updated);
  }, [dateRange, department]);

  const showToast = (title, description, type = "success") => {
    setToastMessage({ title, description, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleMarkAllNotificationsRead = () => {
    setDashboardData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }));
    showToast("Notifications Cleared", "All alerts marked as read", "info");
  };

  const handleToggleReadNotification = (id) => {
    setDashboardData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, unread: !n.unread } : n
      ),
    }));
  };

  const handleDeleteNotification = (id) => {
    setDashboardData((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
    showToast("Notification Removed", "Alert deleted from feed", "info");
  };

  const handleExportPdfReport = () => {
    try {
      generateDashboardPdfReport({
        dateRange,
        department,
        dashboardData,
      });
      showToast(
        "PDF Report Generated",
        "Downloaded A4 Summary Report featuring Active Tenants, Node Health, Queue Metrics & Subscriptions",
        "success"
      );
    } catch (err) {
      showToast("Export Failed", err.message || "Failed to generate PDF report", "error");
    }
  };

  const handleAddChartClick = (type) => {
    showToast(
      "Widget Added",
      `New ${type.toUpperCase()} analytics card added to operational layout`,
      "success"
    );
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F8F8FC] font-sans text-[#18112B] overflow-x-hidden">
      {/* 1. FIXED 256PX UNTITLED-STYLE SIDEBAR */}
      <aside className="w-64 min-w-[256px] max-w-[256px] flex-shrink-0 bg-white border-r border-[#EAE8FA] h-screen sticky top-0 flex flex-col justify-between p-4 z-30">
        <OperationalSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === "dashboard") navigate("/dashboard");
            else if (tab === "tickets") navigate("/tickets");
            else if (tab === "analytics") navigate("/analytics");
            else if (tab === "organizations") navigate("/organizations");
            else if (tab === "users") navigate("/users");
            else if (tab === "profile") navigate("/profile");
            else if (tab === "compute") navigate("/compute");
            else if (tab === "subscriptions") navigate("/subscriptions");
          }}
        />
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* RENDER TOP HEADER ONLY ONCE HERE */}
        <OperationalHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          department={department}
          setDepartment={setDepartment}
          activeView={activeView}
          setActiveView={setActiveView}
          notifications={dashboardData.notifications}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onToggleReadNotification={handleToggleReadNotification}
          onDeleteNotification={handleDeleteNotification}
          onCreateNewClick={() => setIsCreateModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddChartClick={handleAddChartClick}
          onExportPdfClick={handleExportPdfReport}
        />

        {/* PAGE VIEW BODY */}
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
      </div>

      {/* MODALS & TOAST NOTIFICATIONS */}
      <CreateNewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={(newItem) => {
          showToast(
            "Item Created",
            `Dispatched new ${newItem.type}: "${newItem.title}" to ${newItem.department}`,
            "success"
          );
        }}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectResult={(item) => {
          showToast("Command Executed", `Opened ${item.title}`, "success");
        }}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          ) : toastMessage.type === "info" ? (
            <Info className="w-5 h-5 text-[#7952F5] shrink-0 mt-0.5" />
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
