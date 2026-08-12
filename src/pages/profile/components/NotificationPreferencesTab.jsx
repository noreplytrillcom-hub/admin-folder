import React from "react";
import { Bell, Mail, ShieldAlert, Sparkles, Loader2, Save } from "lucide-react";

export default function NotificationPreferencesTab({
  preferences,
  setPreferences,
  handleSavePreferences,
  isSavingPreferences,
}) {
  const ToggleRow = ({ id, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-[#ECECF5] last:border-b-0">
      <div>
        <label htmlFor={id} className="text-xs sm:text-sm font-bold text-[#18112B] cursor-pointer select-none block">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? "bg-[#6D4AFF]" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-[18px] border border-[#ECECF5] p-7 shadow-[0_8px_30px_rgba(40,30,80,0.06)] space-y-6 select-none">
      <div className="border-b border-[#ECECF5] pb-4">
        <h2 className="text-lg font-bold text-[#18112B] flex items-center gap-2">
          <Bell size={18} className="text-[#6D4AFF]" />
          <span>Notification & Alert Preferences</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Customize how and when you receive critical system alerts, email digests, and security notices
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* EMAIL NOTIFICATIONS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF] flex items-center gap-2">
            <Mail size={14} />
            <span>Email Notifications</span>
          </h3>

          <div className="bg-[#F8F8FC] border border-[#ECECF5] rounded-xl px-5 divide-y divide-[#ECECF5]">
            <ToggleRow
              id="pref-security"
              label="Security & Account Alerts"
              description="Critical login alerts, password changes, and 2FA notifications"
              checked={preferences.emailSecurityAlerts}
              onChange={(val) => setPreferences((prev) => ({ ...prev, emailSecurityAlerts: val }))}
            />
            <ToggleRow
              id="pref-updates"
              label="Product & Platform Updates"
              description="Announcements regarding new features, schema updates, and API upgrades"
              checked={preferences.emailProductUpdates}
              onChange={(val) => setPreferences((prev) => ({ ...prev, emailProductUpdates: val }))}
            />
            <ToggleRow
              id="pref-digest"
              label="Weekly Infrastructure Digest"
              description="Weekly breakdown of tenant metrics, node health, and queue stats"
              checked={preferences.emailWeeklyDigest}
              onChange={(val) => setPreferences((prev) => ({ ...prev, emailWeeklyDigest: val }))}
            />
          </div>
        </div>

        {/* SECURITY & PUSH NOTIFICATIONS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF] flex items-center gap-2">
            <ShieldAlert size={14} />
            <span>Security & System Alerts</span>
          </h3>

          <div className="bg-[#F8F8FC] border border-[#ECECF5] rounded-xl px-5 divide-y divide-[#ECECF5]">
            <ToggleRow
              id="pref-push-dm"
              label="Direct System Messages & Ticket Alerts"
              description="Instant popover notifications for high-priority support tickets"
              checked={preferences.pushDirectMessages}
              onChange={(val) => setPreferences((prev) => ({ ...prev, pushDirectMessages: val }))}
            />
            <ToggleRow
              id="pref-push-health"
              label="Worker Node Infrastructure Alerts"
              description="Real-time alerts for elevated CPU load or queue latency spikes"
              checked={preferences.pushSystemHealth}
              onChange={(val) => setPreferences((prev) => ({ ...prev, pushSystemHealth: val }))}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#ECECF5] flex items-center justify-end">
          <button
            type="submit"
            disabled={isSavingPreferences}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6D4AFF] to-[#7C3AED] hover:opacity-95 shadow-md shadow-purple-500/20 transition cursor-pointer active:scale-95 disabled:opacity-75"
          >
            {isSavingPreferences ? (
              <>
                <Loader2 size={15} className="animate-spin text-white" />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
