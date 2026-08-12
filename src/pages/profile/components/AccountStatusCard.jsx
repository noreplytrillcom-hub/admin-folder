import React from "react";
import { ShieldCheck, Building2, Calendar, Clock } from "lucide-react";

export default function AccountStatusCard({ userData }) {
  return (
    <div className="bg-white rounded-[14px] border border-[#E9E7F0] p-6 shadow-[0_4px_18px_rgba(35,25,70,0.04)] select-none">
      {/* CARD HEADER */}
      <div className="border-b border-[#E8E6EF] pb-3 mb-2">
        <h3 className="text-[17px] font-bold text-[#18152B]">
          Account Status
        </h3>
      </div>

      {/* ROWS WITH SUBTLE SEPARATORS */}
      <div className="divide-y divide-[#F0EEF5]">
        {/* 1. Client Validation */}
        <div className="h-[44px] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#6F6B7D] flex items-center gap-[10px]">
            <ShieldCheck size={16} className="text-[#6D4AFF] shrink-0" />
            <span>Client Validation</span>
          </span>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[12px] rounded-[6px] border border-emerald-200/60">
            Active
          </span>
        </div>

        {/* 2. Account Type */}
        <div className="h-[44px] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#6F6B7D] flex items-center gap-[10px]">
            <Building2 size={16} className="text-[#6D4AFF] shrink-0" />
            <span>Account Type</span>
          </span>
          <span className="px-2.5 py-0.5 bg-[#F1EEFF] text-[#6D4AFF] font-semibold text-[12px] rounded-[6px] border border-[#D1B9FE]/40">
            Enterprise
          </span>
        </div>

        {/* 3. Member Since */}
        <div className="h-[44px] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#6F6B7D] flex items-center gap-[10px]">
            <Calendar size={16} className="text-slate-400 shrink-0" />
            <span>Member Since</span>
          </span>
          <span className="text-[13px] font-semibold text-[#18152B]">
            {userData.memberSince || "Jan 15, 2024"}
          </span>
        </div>

        {/* 4. Last Login */}
        <div className="h-[44px] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#6F6B7D] flex items-center gap-[10px]">
            <Clock size={16} className="text-slate-400 shrink-0" />
            <span>Last Login</span>
          </span>
          <span className="text-[13px] font-semibold text-[#18152B]">
            May 20, 2025 01:45 PM
          </span>
        </div>
      </div>
    </div>
  );
}
