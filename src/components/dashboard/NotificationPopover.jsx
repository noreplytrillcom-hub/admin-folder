import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldCheck,
  X,
  Bell,
  Ticket,
  FileText,
  UserCheck,
  Cpu,
  CheckCircle2,
} from "lucide-react";

/**
 * Category & Permission Mapping Definitions
 */
export const CATEGORY_PERMISSIONS = {
  "Support Tickets": "tickets.manage",
  "Contract Renewals": "contracts.renew",
  "Partner Registrations": "partners.approve",
  "Infrastructure & System": "system.alerts",
};

export const CATEGORY_ICONS = {
  "Support Tickets": Ticket,
  "Contract Renewals": FileText,
  "Partner Registrations": UserCheck,
  "Infrastructure & System": Cpu,
};

export default function NotificationPopover({
  notifications = [],
  userPermissions = ["tickets.manage", "contracts.renew", "partners.approve", "system.alerts"],
  onMarkAllRead,
  onToggleRead,
  onDeleteNotification,
  onClose,
  activePermissionsOverride,
  setActivePermissionsOverride,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Effective permissions array (uses override if set, else userPermissions)
  const activePermissions = activePermissionsOverride || userPermissions;

  // 1. Permission-based Filtering Logic
  const permissionFilteredList = notifications.filter((n) => {
    if (!n.permissionKey) return true;
    return activePermissions.includes(n.permissionKey);
  });

  // 2. Tab & Category Filtering Logic
  const displayList = permissionFilteredList.filter((n) => {
    if (activeTab === "unread") return n.unread;
    if (activeTab === "support") return n.category === "Support Tickets";
    if (activeTab === "contracts") return n.category === "Contract Renewals";
    if (activeTab === "partners") return n.category === "Partner Registrations";
    if (activeTab === "system") return n.category === "Infrastructure & System";
    return true; // "all"
  });

  const unreadCount = permissionFilteredList.filter((n) => n.unread).length;

  const handleCtaClick = (link) => {
    if (link) {
      navigate(link);
      if (onClose) onClose();
    }
  };

  const togglePermission = (permKey) => {
    if (!setActivePermissionsOverride) return;
    if (activePermissions.includes(permKey)) {
      setActivePermissionsOverride(activePermissions.filter((p) => p !== permKey));
    } else {
      setActivePermissionsOverride([...activePermissions, permKey]);
    }
  };

  return (
    <div
      className="absolute right-0 mt-2 w-96 sm:w-[420px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 font-sans"
      style={{
        boxShadow: "0 25px 50px -12px rgba(24, 17, 43, 0.25)",
      }}
    >
      {/* 1. GLASSMORPHISM HEADER BAR */}
      <div className="p-4 bg-[#18112B] text-white flex items-center justify-between rounded-t-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#7952F5]/25 border border-[#7952F5]/50 flex items-center justify-center text-[#7952F5] shrink-0 shadow-xs">
            <Bell className="w-4 h-4 text-[#9B7BFA]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-[#7952F5] text-white rounded-full shadow-xs">
                  {unreadCount} UNREAD
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-300">Permission-filtered alert center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[11px] text-[#9B7BFA] hover:text-white font-bold px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. FLEX WRAPPED PERMISSION PILL BADGES */}
      <div className="p-3 bg-slate-50/90 border-b border-[#EAE8FA]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7952F5]" />
            Active Role Permissions
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Click tag to simulate</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Object.entries(CATEGORY_PERMISSIONS).map(([catName, permKey]) => {
            const isGranted = activePermissions.includes(permKey);
            return (
              <button
                key={permKey}
                onClick={() => togglePermission(permKey)}
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  isGranted
                    ? "bg-[#EAE8FA] text-[#7952F5] border border-[#7952F5]/30 shadow-2xs"
                    : "bg-slate-200 text-slate-400 border border-slate-300 line-through opacity-60 hover:opacity-100"
                }`}
                title={`Toggle permission: ${permKey}`}
              >
                <span>{permKey}</span>
                {isGranted && <CheckCircle2 className="w-2.5 h-2.5 text-[#7952F5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PILL-SHAPED TAB BAR WITH HOVER & ACTIVE INDICATORS */}
      <div className="px-3 py-2 bg-[#F8F8FC] border-b border-[#EAE8FA] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "All", count: permissionFilteredList.length },
          { id: "unread", label: "Unread", count: unreadCount },
          { id: "support", label: "Support", count: permissionFilteredList.filter((n) => n.category === "Support Tickets").length },
          { id: "contracts", label: "Contracts", count: permissionFilteredList.filter((n) => n.category === "Contract Renewals").length },
          { id: "partners", label: "Partners", count: permissionFilteredList.filter((n) => n.category === "Partner Registrations").length },
          { id: "system", label: "System", count: permissionFilteredList.filter((n) => n.category === "Infrastructure & System").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#7952F5] text-white shadow-xs border border-[#7952F5]"
                : "bg-white text-slate-600 hover:bg-[#EAE8FA] hover:text-[#7952F5] border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-bold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. FROSTED GLASS NOTIFICATION CARDS LIST */}
      <div className="p-3 space-y-2.5 max-h-[380px] overflow-y-auto bg-slate-50/40">
        {displayList.length > 0 ? (
          displayList.map((n) => {
            const IconComp = CATEGORY_ICONS[n.category] || Bell;
            return (
              <div
                key={n.id}
                className={`bg-white/60 backdrop-blur-md border rounded-xl p-3.5 shadow-sm hover:bg-white transition-all flex flex-col gap-2 ${
                  n.unread
                    ? "border-[#7952F5]/30 bg-purple-50/30"
                    : "border-[#EAE8FA]"
                }`}
              >
                {/* Header Row: Category Badge + Timestamp */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#EAE8FA] text-[#7952F5] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <IconComp className="w-3 h-3 text-[#7952F5]" />
                      {n.category}
                    </span>

                    {n.unread && (
                      <span className="bg-[#7952F5] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        Unread
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {n.time}
                  </span>
                </div>

                {/* Body Content */}
                <div>
                  <h4
                    className={`text-xs ${
                      n.unread ? "font-bold text-slate-900" : "font-semibold text-slate-800"
                    }`}
                  >
                    {n.title}
                  </h4>
                  <p className="text-slate-600 text-[11.5px] mt-0.5 leading-relaxed">
                    {n.text}
                  </p>
                </div>

                {/* Footer Actions Row: Direct CTA + Read Toggle + Delete */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-0.5">
                  {n.ctaText && n.ctaLink ? (
                    <button
                      onClick={() => handleCtaClick(n.ctaLink)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7952F5] hover:text-purple-800 transition-colors cursor-pointer"
                    >
                      <span>{n.ctaText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleRead(n.id)}
                      className="text-[10px] font-medium text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                      {n.unread ? "Mark read" : "Mark unread"}
                    </button>
                    <button
                      onClick={() => onDeleteNotification(n.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* 5. THEME-AWARE EMPTY STATE WITH INLINE SVG ILLUSTRATION */
          <div className="p-8 text-center flex flex-col items-center justify-center bg-[#F8F8FC] rounded-xl border border-dashed border-[#EAE8FA]">
            {/* Minimal Code / Dashboard SVG Illustration Tinted with #EAE8FA Surface and #7952F5 Accents */}
            <div className="w-16 h-16 rounded-2xl bg-[#EAE8FA] flex items-center justify-center shadow-xs border border-purple-100 mb-3">
              <svg
                className="w-10 h-10 text-[#7952F5]"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="12" width="48" height="40" rx="8" fill="#EAE8FA" stroke="#7952F5" strokeWidth="2.5" />
                <path d="M8 22H56" stroke="#7952F5" strokeWidth="2" />
                <circle cx="15" cy="17" r="1.8" fill="#7952F5" />
                <circle cx="21" cy="17" r="1.8" fill="#7952F5" />
                <circle cx="27" cy="17" r="1.8" fill="#7952F5" />
                <rect x="14" y="28" width="22" height="3" rx="1.5" fill="#7952F5" />
                <rect x="14" y="35" width="34" height="2.5" rx="1.2" fill="#9B7BFA" />
                <rect x="14" y="41" width="16" height="2.5" rx="1.2" fill="#9B7BFA" />
                <circle cx="46" cy="38" r="8" fill="#7952F5" />
                <path d="M42.5 38L45 40.5L49.5 35.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              All caught up! No active notifications.
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              {permissionFilteredList.length === 0
                ? "No alerts match your assigned admin permissions."
                : "No unread alerts in this category view."}
            </p>

            {activeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="mt-3 text-xs font-bold text-[#7952F5] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Reset Tab Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* 6. FOOTER NOTE */}
      <div className="p-2.5 bg-slate-100/80 border-t border-[#EAE8FA] text-center text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-[#7952F5]" />
        <span>Permission-filtered feed ({activePermissions.length} granted keys)</span>
      </div>
    </div>
  );
}
