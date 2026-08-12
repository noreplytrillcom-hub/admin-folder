import React from "react";
import { User, Shield, Bell } from "lucide-react";

export default function ProfileTabs({ activeTab, setActiveTab, hasUnsavedGeneral, hasUnsavedPrefs }) {
  return (
    <div className="flex items-center gap-6 border-b border-[#ECECF5] px-2 my-6 overflow-x-auto w-full select-none">
      {/* Tab 1: Personal Details */}
      <button
        type="button"
        onClick={() => setActiveTab("personal")}
        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
          activeTab === "personal"
            ? "text-[#6D4AFF] border-b-2 border-[#6D4AFF]"
            : "text-slate-500 hover:text-[#18112B]"
        }`}
      >
        <User size={16} className={activeTab === "personal" ? "text-[#6D4AFF]" : "text-slate-400"} />
        <span>Personal Details</span>
        {hasUnsavedGeneral && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
        )}
      </button>

      {/* Tab 2: Security & Password */}
      <button
        type="button"
        onClick={() => setActiveTab("security")}
        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
          activeTab === "security"
            ? "text-[#6D4AFF] border-b-2 border-[#6D4AFF]"
            : "text-slate-500 hover:text-[#18112B]"
        }`}
      >
        <Shield size={16} className={activeTab === "security" ? "text-[#6D4AFF]" : "text-slate-400"} />
        <span>Security & Password</span>
      </button>

      {/* Tab 3: Notification Preferences */}
      <button
        type="button"
        onClick={() => setActiveTab("preferences")}
        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
          activeTab === "preferences"
            ? "text-[#6D4AFF] border-b-2 border-[#6D4AFF]"
            : "text-slate-500 hover:text-[#18112B]"
        }`}
      >
        <Bell size={16} className={activeTab === "preferences" ? "text-[#6D4AFF]" : "text-slate-400"} />
        <span>Notification Preferences</span>
        {hasUnsavedPrefs && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
        )}
      </button>
    </div>
  );
}
