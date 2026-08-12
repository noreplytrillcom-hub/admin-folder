import React from "react";
import { Lock, Laptop, Download, AlertTriangle, ChevronRight } from "lucide-react";

export default function QuickActionsCard({ onNavigateTab, onExportPdf, onDeactivate }) {
  return (
    <div className="bg-white rounded-[14px] border border-[#E9E7F0] p-6 shadow-[0_4px_18px_rgba(35,25,70,0.04)] select-none">
      {/* CARD HEADER */}
      <div className="border-b border-[#E8E6EF] pb-3 mb-2">
        <h3 className="text-[17px] font-bold text-[#18112B]">
          Quick Actions
        </h3>
      </div>

      {/* ACTION ROWS WITH SUBTLE DIVIDERS */}
      <div className="divide-y divide-[#F0EEF5]">
        {/* 1. Change Password */}
        <button
          type="button"
          onClick={() => onNavigateTab("security")}
          className="w-full h-[46px] px-2 rounded-[8px] hover:bg-[#F8F6FF] transition flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-[13px] font-semibold text-[#18152B] flex items-center gap-[10px]">
            <Lock size={16} className="text-[#6D4AFF] shrink-0" />
            <span>Change Password</span>
          </span>
          <ChevronRight size={15} className="text-[#8A8798] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* 2. Manage Sessions */}
        <button
          type="button"
          onClick={() => onNavigateTab("security")}
          className="w-full h-[46px] px-2 rounded-[8px] hover:bg-[#F8F6FF] transition flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-[13px] font-semibold text-[#18152B] flex items-center gap-[10px]">
            <Laptop size={16} className="text-[#6D4AFF] shrink-0" />
            <span>Manage Sessions</span>
          </span>
          <ChevronRight size={15} className="text-[#8A8798] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* 3. Download My Data */}
        <button
          type="button"
          onClick={onExportPdf}
          className="w-full h-[46px] px-2 rounded-[8px] hover:bg-[#F8F6FF] transition flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-[13px] font-semibold text-[#18152B] flex items-center gap-[10px]">
            <Download size={16} className="text-[#6D4AFF] shrink-0" />
            <span>Download My Data</span>
          </span>
          <ChevronRight size={15} className="text-[#8A8798] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* 4. Deactivate Account (Red Danger Action) */}
        <button
          type="button"
          onClick={onDeactivate}
          className="w-full h-[46px] px-2 rounded-[8px] hover:bg-rose-50 transition flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-[13px] font-semibold text-[#DC2626] flex items-center gap-[10px]">
            <AlertTriangle size={16} className="text-[#DC2626] shrink-0" />
            <span>Deactivate Account</span>
          </span>
          <ChevronRight size={15} className="text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
}
