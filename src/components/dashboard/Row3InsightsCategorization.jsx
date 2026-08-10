import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

export default function Row3InsightsCategorization({ ticketCategory, callDetails }) {
  return (
    <div className="grid grid-cols-12 gap-5 mb-6">
      {/* ---------------- LEFT CARD: TICKET BY CATEGORY (span 6) ---------------- */}
      <div
        style={{ gridColumn: "span 6" }}
        className="dashboard-card col-span-12 lg:col-span-6 bg-white border border-slate-200/80 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between overflow-hidden box-border"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
              Ticket by Category
            </h3>
            <button
              className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader Inside Card */}
          <div className="mb-4">
            <p className="text-xs text-slate-400 font-medium">Total interaction</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {ticketCategory.totalInteraction}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{ticketCategory.suffix}</span>
            </div>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex mb-4 p-0.5 border border-slate-200/60 box-border">
            {ticketCategory.items.map((cat, idx) => (
              <div
                key={cat.name}
                style={{
                  width: `${cat.pct}%`,
                  backgroundColor: cat.color,
                }}
                className={`h-full transition-all ${idx === 0 ? "rounded-l-full" : ""} ${
                  idx === ticketCategory.items.length - 1 ? "rounded-r-full" : ""
                }`}
                title={`${cat.name}: ${cat.count}`}
              />
            ))}
          </div>

          {/* Itemized Legend List Below: Flex Category-Row layout */}
          <div className="space-y-3 pt-1 w-full">
            {ticketCategory.items.map((cat) => (
              <div
                key={cat.name}
                className="category-row flex items-center justify-between mt-3 text-xs w-full"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-md shrink-0 shadow-xs"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-slate-700 truncate">{cat.name}</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm text-right font-mono">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT CARD: CALL DETAILS (span 6) ---------------- */}
      <div
        style={{ gridColumn: "span 6" }}
        className="dashboard-card col-span-12 lg:col-span-6 bg-white border border-slate-200/80 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between overflow-hidden box-border"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
              Call Details
            </h3>
            <button
              className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Gauge & Legend Split Container */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-4">
            {/* Left Half: Centered Gauge SVG Chart */}
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              className="sm:col-span-6 relative h-48 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={callDetails.items}
                    cx="50%"
                    cy="72%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={72}
                    outerRadius={96}
                    paddingAngle={3}
                    dataKey="count"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {callDetails.items.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Readout Overlay */}
              <div className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full px-2">
                <span className="text-[10px] font-medium text-slate-400 block tracking-tight leading-tight">
                  Total Chats Per Platform
                </span>
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans block mt-0.5 leading-none font-mono">
                  {callDetails.totalChats}
                </span>
              </div>
            </div>

            {/* Right Half: Vertical Itemized Legend List with gap: 8px */}
            <div className="sm:col-span-6 space-y-3.5 pl-0 sm:pl-4">
              {callDetails.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs py-0.5 w-full"
                >
                  <div className="flex items-center gap-2 min-w-0" style={{ gap: "8px" }}>
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700 truncate">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm text-right font-mono">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
