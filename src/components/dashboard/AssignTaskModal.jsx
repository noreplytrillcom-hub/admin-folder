import React, { useState } from "react";
import {
  X,
  UserPlus,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building,
} from "lucide-react";

export default function AssignTaskModal({ isOpen, onClose, slaAlert, onAssignSuccess }) {
  const [selectedEngineer, setSelectedEngineer] = useState("sarah.chen");
  const [assigning, setAssigning] = useState(false);

  if (!isOpen) return null;

  const TEAM_MEMBERS = [
    { id: "sarah.chen", name: "Sarah Chen", role: "Lead Ops Engineer", status: "Online", load: "2 active tasks" },
    { id: "alex.rivera", name: "Alex Rivera", role: "Senior Systems Admin", status: "Online", load: "1 active task" },
    { id: "marcus.vance", name: "Marcus Vance", role: "Site Reliability Engineer", status: "Busy", load: "4 active tasks" },
    { id: "elena.rostova", name: "Elena Rostova", role: "Customer Tier 3 Support", status: "Online", load: "0 active tasks" },
  ];

  const handleAssign = () => {
    setAssigning(true);
    const engineer = TEAM_MEMBERS.find((m) => m.id === selectedEngineer);
    setTimeout(() => {
      setAssigning(false);
      onAssignSuccess(engineer?.name || "Sarah Chen");
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Urgent Styling */}
        <div className="p-6 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                Assign Urgent SLA Breach Task
              </h2>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Target: {slaAlert?.remainingMinutes || 12} mins remaining before SLA penalty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Affected Target Card */}
          <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-4 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1">
              <span>{slaAlert?.title || "Urgent SLA Warning"}</span>
              <span className="px-2 py-0.5 bg-rose-200 text-rose-900 rounded-md font-mono text-[11px]">
                TK-8891
              </span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed font-medium mb-2">
              {slaAlert?.message || "3 Critical Enterprise Work Tickets exceed SLA response window."}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-rose-700 font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>Affected: Apex Global Corp, Starlight Systems, Nexus Fintech</span>
            </div>
          </div>

          {/* Select Engineer */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Assign On-Call Response Engineer:
            </label>

            <div className="space-y-2">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedEngineer(member.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedEngineer === member.id
                      ? "bg-[#EAE8FA] border-[#7952F5] shadow-xs"
                      : "bg-white border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{member.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 block">{member.load}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={assigning}
              className="bg-[#7952F5] hover:bg-[#683fe4] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {assigning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Assign & Trigger Immediate Escalation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
