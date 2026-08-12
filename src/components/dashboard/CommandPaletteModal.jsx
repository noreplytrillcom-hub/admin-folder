import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CommandPaletteModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const MOCK_RESULTS = [
    { type: "Ticket", id: "TK-8891", title: "Apex Global SLA Breach Warning (<15m remaining)", category: "Operations", link: "tickets" },
    { type: "Lead", id: "LD-4029", title: "Starlight Systems - $150k Enterprise License Proposal", category: "Sales", link: "pipeline" },
    { type: "Metric", id: "MT-001", title: "Monthly Recurring Revenue Telemetry ($128,450.00)", category: "Analytics", link: "analytics" },
    { type: "Department", id: "DP-002", title: "Customer Support Queue & Resolution Speed", category: "Department", link: "departments" },
    { type: "Audit", id: "AU-991", title: "System Gateway 429 Throttling Protection Log", category: "Audit", link: "audit" },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 flex justify-center"
      onClick={onClose}
    >
      {/* 1. MODAL CONTAINER (WIDTH: 100%, MAX-WIDTH: 640PX, MARGIN-TOP: 10VH, RADIUS: 12PX, SHADOW-2XL) */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          marginTop: "10vh",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          height: "fit-content",
        }}
        className="relative border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 2. SEARCH INPUT HEADER (FIXED HEIGHT: 52PX, NO INNER BORDER, BOTTOM DIVIDER) */}
        <div
          style={{
            height: "52px",
            borderBottom: "1px solid #e2e8f0",
            position: "relative",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Search Icon (left: 16px) */}
          <Search
            className="w-5 h-5 text-slate-400"
            style={{
              position: "absolute",
              left: "16px",
              pointerEvents: "none",
            }}
          />

          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search metrics, work tickets, leads..."
            style={{
              width: "100%",
              height: "52px",
              border: "none",
              outline: "none",
              padding: "0 44px 0 48px",
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#0f172a",
              boxSizing: "border-box",
            }}
            className="placeholder-slate-400 font-sans"
          />

          {/* Close Button (right: 16px) */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: "16px",
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3. RESULT LIST ITEMS LAYOUT (MAX-HEIGHT: 380PX, OVERFLOW-Y: AUTO, PADDING: 8PX) */}
        <div
          style={{
            maxHeight: "380px",
            overflowY: "auto",
            padding: "8px",
          }}
          className="divide-y divide-slate-100/50"
        >
          {MOCK_RESULTS.length > 0 ? (
            MOCK_RESULTS.map((item, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="search-result-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                    backgroundColor: isSelected ? "#EAE8FA" : "transparent",
                  }}
                >
                  {/* Left Circle Badge (32px x 32px, bg: #EAE8FA, text: #7952F5) */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#EAE8FA",
                      color: "#7952F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {item.type[0]}
                  </div>

                  {/* Text Hierarchy */}
                  <div className="flex-1 min-w-0">
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#0f172a",
                        lineHeight: 1.3,
                      }}
                      className="truncate"
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px",
                        lineHeight: 1.2,
                      }}
                    >
                      Category: {item.category} • ID: {item.id}
                    </p>
                  </div>

                  {/* Action Arrow on Far Right */}
                  <ArrowRight
                    className="w-4 h-4 shrink-0"
                    style={{
                      marginLeft: "auto",
                      color: "#94a3b8",
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No operational records matching "{query}"</p>
            </div>
          )}
        </div>

        {/* 4. MODAL FOOTER & KEYBOARD LEGEND */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <div className="search-footer-left flex items-center gap-4 text-xs">
            <span>
              Press{" "}
              <kbd
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  fontSize: "11px",
                  fontFamily: "inherit",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
                  color: "#334155",
                }}
              >
                ESC
              </kbd>{" "}
              to exit
            </span>
            <span>
              Use{" "}
              <kbd
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  fontSize: "11px",
                  fontFamily: "inherit",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
                  color: "#334155",
                }}
              >
                ↑
              </kbd>{" "}
              <kbd
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  fontSize: "11px",
                  fontFamily: "inherit",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
                  color: "#334155",
                }}
              >
                ↓
              </kbd>{" "}
              to navigate
            </span>
          </div>

          <span className="search-footer-right font-semibold text-slate-500 text-xs">
            Operational Search v2
          </span>
        </div>
      </div>
    </div>
  );
}
