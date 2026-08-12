import React from "react";
import { ArrowRight, UserCheck, ShieldCheck, Monitor, Clock } from "lucide-react";

export default function RecentActivitySection() {
  const activities = [
    {
      id: 1,
      title: "Profile information updated",
      timestamp: "Today • 01:42 AM",
      icon: UserCheck,
      iconBg: "bg-[#F1EEFF] text-[#6D4AFF]",
    },
    {
      id: 2,
      title: "Password changed",
      timestamp: "Yesterday • 04:21 PM",
      icon: ShieldCheck,
      iconBg: "bg-emerald-50 text-[#16A34A]",
    },
    {
      id: 3,
      title: "Login from Chrome",
      timestamp: "Yesterday • 09:12 AM",
      icon: Monitor,
      iconBg: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="bg-white rounded-[14px] border border-[#E9E7F0] p-6 shadow-[0_4px_18px_rgba(35,25,70,0.04)] mt-5 mb-8 w-full select-none">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-[#E8E6EF] pb-3 mb-4">
        <div>
          <h3 className="text-[17px] font-bold text-[#18152B]">
            Recent Activity
          </h3>
          <p className="text-[12px] text-[#77748A] font-normal mt-0.5">
            Your recent account activity and updates
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#6D4AFF] hover:text-[#5B3FE0] transition cursor-pointer"
        >
          <span>View All Activity</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 3 EQUAL COLUMNS WITH SUBTLE VERTICAL SEPARATORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F0EEF5]">
        {activities.map((act, index) => {
          const IconComp = act.icon;
          return (
            <div
              key={act.id}
              className={`flex items-center gap-3.5 p-4 ${
                index === 0 ? "md:pl-0" : index === 2 ? "md:pr-0" : ""
              }`}
            >
              {/* 36px Icon Box with 10px Radius (NOT a pill) */}
              <div className={`w-[36px] h-[36px] rounded-[10px] shrink-0 flex items-center justify-center ${act.iconBg}`}>
                <IconComp size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#18152B] truncate">
                  {act.title}
                </p>
                <p className="text-[12px] font-normal text-[#8A8798] flex items-center gap-1 mt-0.5">
                  <Clock size={12} className="shrink-0 text-[#8A8798]" />
                  <span>{act.timestamp}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
