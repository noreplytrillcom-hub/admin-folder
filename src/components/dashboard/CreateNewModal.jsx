import React, { useState } from "react";
import {
  X,
  Ticket,
  UserPlus,
  Layers,
} from "lucide-react";
import { DEPARTMENTS } from "./dashboardData";

export default function CreateNewModal({ isOpen, onClose, onSubmitSuccess }) {
  const [activeTab, setActiveTab] = useState("ticket");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Operations");
  const [priority, setPriority] = useState("High");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmitSuccess({
        type: activeTab,
        title,
        department,
        priority,
        notes,
      });
      setTitle("");
      setNotes("");
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 1. MODAL BOX SIZING & PADDING (WIDTH: 100%, MAX-WIDTH: 580PX, PADDING: 24PX, RADIUS: 16PX, SHADOW-2XL) */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          padding: "24px",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        className="relative border border-slate-200 animate-in zoom-in-95 duration-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 2. HEADER & CLOSE BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Create Operational Item
            </h2>
            <p
              style={{
                marginTop: "4px",
                fontSize: "13px",
                color: "#64748b",
                margin: "4px 0 0 0",
              }}
            >
              Add new work tickets, qualified leads, or operational tasks to the live queue.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ cursor: "pointer" }}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. TYPE SEGMENT TABS */}
        <div className="modal-tab-group">
          <button
            type="button"
            onClick={() => setActiveTab("ticket")}
            className={`modal-tab-item ${activeTab === "ticket" ? "active" : ""}`}
          >
            <Ticket size={16} />
            <span>Work Ticket</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("lead")}
            className={`modal-tab-item ${activeTab === "lead" ? "active" : ""}`}
          >
            <UserPlus size={16} />
            <span>Operational Lead</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("task")}
            className={`modal-tab-item ${activeTab === "task" ? "active" : ""}`}
          >
            <Layers size={16} />
            <span>Queue Task</span>
          </button>
        </div>

        {/* 3. FORM CONTROLS & LAYOUT GRID */}
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "6px",
              }}
            >
              {activeTab === "ticket"
                ? "Ticket Summary / Issue Title"
                : activeTab === "lead"
                ? "Prospect / Enterprise Lead Name"
                : "Task Description"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activeTab === "ticket"
                  ? "e.g. API Gateway 429 Rate Limit Breach on Node #4"
                  : activeTab === "lead"
                  ? "e.g. Apex Global Corp - $150k Enterprise License"
                  : "e.g. Execute database indexing for Q3 operational logs"
              }
              style={{
                height: "40px",
                padding: "0 12px",
                fontSize: "14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                color: "#0f172a",
              }}
              className="placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          {/* Dropdown Row (2-column grid: Target Department & Priority Level) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "6px",
                }}
              >
                Target Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  height: "40px",
                  padding: "0 12px",
                  fontSize: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  cursor: "pointer",
                }}
                className="focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "6px",
                }}
              >
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  height: "40px",
                  padding: "0 12px",
                  fontSize: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  cursor: "pointer",
                }}
                className="focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                <option value="Critical">🔴 Critical (SLA &lt; 15m)</option>
                <option value="High">🟠 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Normal">🟢 Normal Queue</option>
              </select>
            </div>
          </div>

          {/* Textarea Field */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "6px",
              }}
            >
              Additional Details & Telemetry Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide context, error codes, client contact info, or SLA specifications..."
              style={{
                minHeight: "100px",
                padding: "10px 12px",
                fontSize: "14px",
                resize: "vertical",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                color: "#0f172a",
              }}
              className="placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          {/* 4. MODAL FOOTER ACTIONS */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
