import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  FileText,
  MessageSquare,
  Phone,
  Users,
  BookOpen,
  Settings,
} from "lucide-react";

export default function OperationalSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = useState(null);

  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, hasRedDot: false, badge: null },
    { id: "tickets", label: "Tickets & Support", path: "/tickets", icon: Ticket, hasRedDot: false, badge: null },
    { id: "documents", label: "Documents", path: "/documents", icon: FileText, hasRedDot: false, badge: null },
    { id: "chat", label: "Messages & Chat", path: "/chat", icon: MessageSquare, hasRedDot: true, badge: null },
    { id: "calls", label: "Calls & Voice", path: "/calls", icon: Phone, hasRedDot: false, badge: "3" },
    { id: "contacts", label: "Contacts & Users", path: "/contacts", icon: Users, hasRedDot: false, badge: null },
    { id: "catalog", label: "Catalog & Guide", path: "/catalog", icon: BookOpen, hasRedDot: false, badge: null },
  ];

  const handleNavClick = (item) => {
    if (setActiveTab) {
      setActiveTab(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside
      style={{
        width: "80px",
        minWidth: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        boxSizing: "border-box",
        paddingTop: "16px",
        paddingBottom: "16px",
      }}
      className="fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-200/80 select-none shadow-xs h-screen"
    >
      {/* 1. LOGO HEADER AREA */}
      <div className="w-full flex flex-col items-center">
        <div
          style={{ height: "64px" }}
          className="w-full flex items-center justify-center border-b border-slate-100/80 mb-4"
        >
          {/* TestoAI Brand Logo SVG */}
          <div
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] via-blue-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25 cursor-pointer hover:scale-105 transition-transform shrink-0"
            title="TestoAI Operational Control"
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* 2. NAVIGATION ITEMS & ICON ALIGNMENT */}
        <nav className="sidebar-nav flex flex-col items-center gap-3 w-full px-4">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              activeTab === item.id ||
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <div key={item.id} className="relative group flex items-center justify-center w-full">
                <button
                  onClick={() => handleNavClick(item)}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  title={item.label}
                  aria-label={item.label}
                >
                  <IconComponent className="nav-icon" size={20} />

                  {/* Red Dot Indicator */}
                  {item.hasRedDot && !isActive && (
                    <span
                      style={{
                        position: "absolute",
                        top: "3px",
                        right: "3px",
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#ef4444",
                        borderRadius: "9999px",
                        border: "2px solid #ffffff",
                        lineHeight: 1,
                      }}
                    />
                  )}

                  {/* Notification Badge Overlay */}
                  {item.badge && (
                    <span className="nav-badge">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Floating Hover Tooltip */}
                {hoveredNav === item.id && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl z-50 whitespace-nowrap pointer-events-none flex items-center gap-2 animate-in fade-in duration-100">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 bg-[#ef4444] text-white text-[10px] rounded-md font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* 3. BOTTOM ANCHORED ACTIONS */}
      <div
        style={{ marginTop: "auto", paddingBottom: "16px" }}
        className="mt-auto flex flex-col items-center gap-3 w-full px-4"
      >
        {/* Settings Gear Icon */}
        <div className="relative group flex items-center justify-center w-full">
          <button
            onClick={() => navigate("/settings")}
            onMouseEnter={() => setHoveredNav("settings")}
            onMouseLeave={() => setHoveredNav(null)}
            className={`nav-item ${
              activeTab === "settings" || location.pathname === "/settings" ? "active" : ""
            }`}
            title="Settings"
          >
            <Settings className="nav-icon" size={20} />
          </button>

          {hoveredNav === "settings" && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl z-50 whitespace-nowrap pointer-events-none">
              Settings
            </div>
          )}
        </div>

        {/* Bottom Status Indicator / Profile Avatar */}
        <div
          onClick={() => navigate("/profile")}
          className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 via-purple-500 to-[#0066FF] p-0.5 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          title="TestoAI Engine v2.4 • Online"
        >
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-emerald-200" />
          </div>
        </div>
      </div>
    </aside>
  );
}
