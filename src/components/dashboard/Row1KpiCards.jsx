import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, FileSpreadsheet, RefreshCw, ExternalLink } from "lucide-react";

export default function Row1KpiCards({ kpis, onCardMenuAction }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cardList = [
    { key: "contact", data: kpis.contact },
    { key: "ticket", data: kpis.ticket },
    { key: "internal", data: kpis.internal },
    { key: "external", data: kpis.external },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 mb-6">
      {cardList.map(({ key, data }) => (
        <div
          key={key}
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            boxSizing: "border-box",
          }}
          className="col-span-12 md:col-span-6 lg:col-span-3 border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative group"
        >
          {/* Card Top Row: Label Title + Menu Button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 font-sans tracking-wide">
              {data.title}
            </span>

            {/* Ellipsis Contextual Menu Button */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Popover Action Menu */}
              {activeMenu === key && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 text-left animate-in fade-in duration-100"
                >
                  <button
                    onClick={() => {
                      setActiveMenu(null);
                      onCardMenuAction(key, "audit");
                    }}
                    className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu(null);
                      onCardMenuAction(key, "export");
                    }}
                    className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu(null);
                      onCardMenuAction(key, "refresh");
                    }}
                    className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    Refresh Metric
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Large Bold Metric Number */}
          <div className="mb-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {data.value}
            </h2>
          </div>

          {/* Sub-text Comparison Line */}
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <span>{data.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
