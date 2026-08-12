import React from "react";
import { Download, Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePageHeader({ onExportPdf, onAddChart, onEditClick }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full mb-6 select-none">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-[28px] font-bold text-[#18112B] tracking-tight leading-tight">
          Profile
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1">
          <Link to="/dashboard" className="hover:text-[#6D4AFF] transition-colors">
            Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#6D4AFF]">Profile</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#18112B] bg-white border border-[#ECECF5] rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs cursor-pointer active:scale-98"
        >
          <Pencil size={14} className="text-slate-400" />
          <span>Edit Profile</span>
        </button>

        <button
          type="button"
          onClick={onExportPdf}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#18112B] bg-white border border-[#ECECF5] rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs cursor-pointer active:scale-98"
        >
          <Download size={14} className="text-[#6D4AFF]" />
          <span>Export PDF</span>
        </button>

        <button
          type="button"
          onClick={onAddChart}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#6D4AFF] to-[#7C3AED] rounded-xl hover:opacity-95 shadow-xs transition cursor-pointer active:scale-98"
        >
          <Plus size={14} />
          <span>Add Chart</span>
        </button>
      </div>
    </div>
  );
}
