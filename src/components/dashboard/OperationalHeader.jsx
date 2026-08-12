import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Bell,
  Plus,
  HelpCircle,
  Pencil,
  FileOutput,
  CheckCircle2,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import { DEPARTMENTS } from "./dashboardData";

export default function OperationalHeader({
  department,
  setDepartment,
  notifications,
  onMarkAllNotificationsRead,
  onCreateNewClick,
  onOpenCommandPalette,
  searchQuery,
  setSearchQuery,
  onAddChartClick,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false);
  const [showAddChartMenu, setShowAddChartMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const deptRef = useRef(null);
  const chartRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (deptRef.current && !deptRef.current.contains(e.target)) setShowDepartmentMenu(false);
      if (chartRef.current && !chartRef.current.contains(e.target)) setShowAddChartMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="top-header sticky top-0 z-30 select-none"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        padding: "0 24px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT SECTION: LOGO, TITLE, DEPARTMENT TAG */}
      <div
        className="header-left"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Brand Logo */}
        <div className="brand-logo flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7952F5] via-[#9B7BFA] to-[#D1B9FE] text-white shrink-0 shadow-xs">
          <svg
            className="w-4 h-4 text-white"
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

        {/* Page Title */}
        <h1
          className="page-title"
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#18112B",
            margin: "0",
            lineHeight: "1",
          }}
        >
          Dashboard
        </h1>

        {/* Department Selector */}
        <div className="department-dropdown-wrapper relative" ref={deptRef}>
          <button
            onClick={() => setShowDepartmentMenu(!showDepartmentMenu)}
            className="department-selector-trigger"
          >
            <span className="label">Department</span>
            <span className="dot" />
            <span className="value">{department}</span>
            <ChevronDown size={14} className="chevron" />
          </button>

          {showDepartmentMenu && (
            <div className="department-dropdown-menu animate-in fade-in duration-100">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  className={`department-item ${department === dept ? "active" : ""}`}
                  onClick={() => {
                    setDepartment(dept);
                    setShowDepartmentMenu(false);
                  }}
                >
                  <span>{dept}</span>
                  {department === dept && <CheckCircle2 size={14} className="text-[#7952F5]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: SEARCH, CONTROLS, PROFILE */}
      <div
        className="header-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Search Box */}
        <div
          className="search-box relative flex items-center shrink-0"
          style={{ width: "240px", height: "36px" }}
        >
          <div
            className="absolute left-0 pl-3 flex items-center pointer-events-none text-slate-400"
            style={{ height: "100%", display: "flex", alignItems: "center" }}
          >
            <Search className="w-4 h-4 text-slate-400" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={onOpenCommandPalette}
            placeholder="Search..."
            style={{
              width: "100%",
              height: "36px",
              padding: "0 36px 0 36px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            className="text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7952F5] transition-all cursor-pointer font-sans"
          />

          <div
            style={{
              position: "absolute",
              right: "8px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              fontSize: "11px",
              padding: "2px 5px",
              color: "#64748b",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
            }}
          >
            K
          </div>
        </div>

        {/* Quick + Icon Button */}
        <button
          onClick={onCreateNewClick}
          className="btn-icon bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-[8px] flex items-center justify-center cursor-pointer transition-colors"
          style={{
            backgroundColor: "#ffffff",
            color: "#334155",
            border: "1px solid #e2e8f0",
            padding: "8px 12px",
            borderRadius: "8px",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "36px",
          }}
          title="Create New"
        >
          <Plus className="w-4 h-4 text-slate-600" />
        </button>

        {/* Edit Button */}
        <button
          className="btn-secondary"
          style={{
            backgroundColor: "#ffffff",
            color: "#334155",
            border: "1px solid #e2e8f0",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Pencil className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Edit</span>
        </button>

        {/* Export Button */}
        <button
          className="btn-secondary"
          style={{
            backgroundColor: "#ffffff",
            color: "#334155",
            border: "1px solid #e2e8f0",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <FileOutput className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Export</span>
        </button>

        {/* Primary Action Button: Add Chart */}
        <div className="relative shrink-0" ref={chartRef}>
          <button
            onClick={() => setShowAddChartMenu(!showAddChartMenu)}
            className="btn-primary shadow-sm shadow-purple-500/20"
            style={{
              backgroundColor: "#7952F5",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#ffffff" }}>Add Chart</span>
            <ChevronDown className="w-3.5 h-3.5 text-white shrink-0" />
          </button>

          {showAddChartMenu && (
            <div className="add-chart-dropdown animate-in fade-in duration-100">
              <button
                onClick={() => {
                  onAddChartClick("bar");
                  setShowAddChartMenu(false);
                }}
                className="add-chart-item"
              >
                <span className="icon-plus">+</span>
                <span>Add Bar Chart Widget</span>
              </button>
              <button
                onClick={() => {
                  onAddChartClick("pie");
                  setShowAddChartMenu(false);
                }}
                className="add-chart-item"
              >
                <span className="icon-plus">+</span>
                <span>Add Gauge Chart Widget</span>
              </button>
              <button
                onClick={() => {
                  onAddChartClick("kpi");
                  setShowAddChartMenu(false);
                }}
                className="add-chart-item"
              >
                <span className="icon-plus">+</span>
                <span>Add Custom Metric Card</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 text-slate-600 bg-[#f8fafc] border border-[#e2e8f0] hover:bg-slate-100 rounded-[8px] transition-colors cursor-pointer flex items-center justify-center relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] text-[#7952F5] font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 text-xs hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[11px]">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile relative shrink-0" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="profile-dropdown-trigger group"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Kai Genet Avatar"
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              className="object-cover ring-2 ring-blue-100 shrink-0"
            />
            <div className="profile-info hidden sm:flex">
              <span className="profile-name">Kai Genet</span>
              <span className="profile-role">Super Admin</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {showUserMenu && (
            <div className="profile-menu-dropdown animate-in fade-in duration-100">
              <div className="menu-user-header">
                <p className="user-display-name">Kai Genet</p>
                <p className="user-email">kai.genet@testo.ai</p>
              </div>

              <div className="flex flex-col gap-0.5">
                <button className="menu-item">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>My Profile</span>
                </button>
                <button className="menu-item">
                  <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Admin Controls</span>
                </button>
                <button className="menu-item logout">
                  <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
