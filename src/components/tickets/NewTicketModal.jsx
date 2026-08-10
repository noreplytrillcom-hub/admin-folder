import React, { useState } from "react";
import { X, Paperclip, CheckCircle2 } from "lucide-react";
import { DEPARTMENTS } from "../dashboard/dashboardData";

export default function NewTicketModal({ isOpen, onClose, onSubmitSuccess }) {
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("Customer Support");
  const [priority, setPriority] = useState("High");
  const [category, setCategory] = useState("Technical");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files.map((f) => f.name)]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerEmail.trim() || !subject.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmitSuccess({
        id: `TK-${Math.floor(8800 + Math.random() * 200)}`,
        title: subject,
        customerName: customerEmail.split("@")[0].replace(".", " "),
        customerEmail,
        department,
        priority,
        category,
        description,
        attachments,
        status: "Open",
        agent: "Kai Genet",
        timestamp: "Just now",
        sla: "15m remaining",
      });
      setCustomerEmail("");
      setSubject("");
      setDescription("");
      setAttachments([]);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
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
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Create New Support Ticket</h2>
            <p className="text-xs text-slate-500 mt-1">
              Dispatch a new ticket directly to the TestoAI support & engineering queue.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Email & Subject Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Customer Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. client@enterprise.com"
                className="w-full h-10 px-3 text-xs md:text-sm bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                <option value="Escalations">🔥 Escalations</option>
                <option value="Payment">💳 Payment & Billing</option>
                <option value="Technical">⚙️ Technical Bug</option>
                <option value="Document">📄 Document & SSO</option>
                <option value="Notification">🔔 Notifications</option>
              </select>
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject Line / Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue or support request..."
              className="w-full h-10 px-3 text-xs md:text-sm bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          {/* Department & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                <option value="Critical">🔴 Critical (SLA &lt; 15m)</option>
                <option value="High">🟠 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Detailed Description & Logs
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details, error messages, stack traces, or customer steps..."
              className="w-full p-3 text-xs md:text-sm bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
            />
          </div>

          {/* Attachments Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attachments (Screenshots, Log files, Har files)
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span>Upload Files</span>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              {attachments.length > 0 && (
                <span className="text-xs text-emerald-600 font-semibold">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#2563eb] hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Creating Ticket...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
