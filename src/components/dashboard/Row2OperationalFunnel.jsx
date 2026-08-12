import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  MoreHorizontal,
  Home,
} from "lucide-react";

// Custom Tooltip reproducing floating badge
const CustomSurveyTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white text-slate-900 border border-slate-200/90 p-2 px-3 rounded-xl shadow-lg text-xs font-bold text-center animate-in fade-in duration-100">
        <p className="text-[10px] text-slate-400 font-medium">{data.dateStr || "14 Feb"}</p>
        <p className="text-slate-900 font-extrabold text-sm">{data.val || 760} Survey</p>
      </div>
    );
  }
  return null;
};

export default function Row2OperationalFunnel({
  surveyChart,
  ticketStage,
  onAssignTaskClick,
}) {
  const [selectedMonth, setSelectedMonth] = useState("February 2025");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-5 mb-6">
      {/* ---------------- LEFT CARD: SURVEY STATISTIC BAR CHART (8/12 grid span) ---------------- */}
      <div className="dashboard-card col-span-12 lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between overflow-hidden box-border">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
              Survey Statistic
            </h3>

            <div className="flex items-center gap-2">
              {/* Date Selector Dropdown Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{selectedMonth}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {showMonthDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 text-xs">
                    <button
                      onClick={() => {
                        setSelectedMonth("February 2025");
                        setShowMonthDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 font-semibold text-[#7952F5] bg-[#EAE8FA]"
                    >
                      February 2025
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMonth("January 2025");
                        setShowMonthDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                    >
                      January 2025
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMonth("December 2024");
                        setShowMonthDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                    >
                      December 2024
                    </button>
                  </div>
                )}
              </div>

              {/* Menu Ellipsis Button */}
              <button
                className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Inside Card */}
          <div className="mb-4">
            <p className="text-xs text-slate-400 font-medium">Total of Survey</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {surveyChart.total}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{surveyChart.period}</span>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="w-full h-64 relative pt-6 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surveyChart.dailyBars} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
                  ticks={["01", "07", "15", "22", "28"]}
                  tickFormatter={(val) => {
                    if (val === "01") return "01-07";
                    if (val === "07") return "07-15";
                    if (val === "15") return "15-22";
                    if (val === "22") return "22-28";
                    return "";
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  domain={[0, 1000]}
                  ticks={[0, 250, 500, 750, 1000]}
                />
                <Tooltip content={<CustomSurveyTooltip />} cursor={{ fill: "transparent" }} />

                {/* Dotted Average Benchmark Line */}
                <ReferenceLine
                  y={550}
                  stroke="#475569"
                  strokeDasharray="2 2"
                  strokeWidth={1.5}
                />

                {/* Bars */}
                <Bar dataKey="val" radius={[3, 3, 0, 0]} maxBarSize={14}>
                  {surveyChart.dailyBars.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isHighlighted ? "#7952F5" : "#D1B9FE"}
                      className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Static Floating Active Badge over 14 Feb Bar */}
            <div className="absolute top-[8%] left-[49%] -translate-x-1/2 pointer-events-none hidden sm:flex flex-col items-center">
              <div className="bg-white border border-slate-200/90 shadow-md rounded-xl p-1.5 px-3 text-center">
                <span className="block text-[9px] text-slate-400 font-semibold leading-none">14 Feb</span>
                <span className="block text-xs font-extrabold text-slate-900 leading-tight">760 Survey</span>
              </div>
              <div className="w-2 h-2 bg-white border-b border-r border-slate-200 transform rotate-45 -mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT CARD: TICKET BY STAGE (4/12 grid span) ---------------- */}
      <div
        style={{ gridColumn: "span 4" }}
        className="dashboard-card col-span-12 lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between overflow-hidden box-border"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
              Ticket By Stage
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
            <p className="text-xs text-slate-400 font-medium">Total of Durations</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {ticketStage.totalDuration}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{ticketStage.suffix}</span>
            </div>
          </div>

          {/* Flex Header for Stage Labels Above Progress Bar */}
          <div className="stage-labels flex items-center justify-between text-xs font-semibold mb-2">
            <span className="label-passed text-[#7952F5] font-bold">Passed Stage ({ticketStage.passedPct}%)</span>
            <span className="label-other text-slate-500 font-medium">Other ({ticketStage.otherPct}%)</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-8 bg-[#EAE8FA]/60 rounded-xl p-1 flex gap-1 box-border mb-6">
            <div
              style={{ width: `${ticketStage.passedPct}%` }}
              className="h-full bg-[#7952F5] rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-xs transition-all"
            >
              {ticketStage.passedPct}%
            </div>
            <div
              style={{ width: `${ticketStage.otherPct}%` }}
              className="h-full bg-[#DDEBFF] rounded-lg flex items-center justify-center text-[#7952F5] text-[11px] font-bold transition-all"
            >
              {ticketStage.otherPct}%
            </div>
          </div>
        </div>

        {/* Never Give Up / Banner Box */}
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "12px",
            backgroundColor: "#DDEBFF",
            border: "1px solid #bcdcff",
            padding: "16px",
          }}
          className="text-center space-y-2 mt-auto"
        >
          <div className="flex items-center justify-center gap-1.5 text-indigo-900 font-bold text-xs">
            <Home className="w-4 h-4 text-[#7952F5] shrink-0" />
            <span className="text-[#18112B] font-extrabold">{ticketStage.alert.title}</span>
          </div>

          <p className="text-xs text-[#18112B]/80 font-medium leading-relaxed">
            {ticketStage.alert.message}
          </p>

          <button
            onClick={onAssignTaskClick}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[8px] text-xs font-bold text-slate-700 hover:text-[#7952F5] hover:border-purple-200 shadow-xs flex items-center justify-center gap-1.5 mx-auto transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Assign to other</span>
          </button>
        </div>
      </div>
    </div>
  );
}
