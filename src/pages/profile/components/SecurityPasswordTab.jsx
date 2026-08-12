import React from "react";
import {
  Key,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ShieldCheck,
  Smartphone,
  Laptop,
  Loader2,
} from "lucide-react";

export default function SecurityPasswordTab({
  securityData,
  handleSecurityChange,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  securityErrors,
  pwdStrength,
  handleUpdatePassword,
  isUpdatingPassword,
  twoFactorEnabled,
  setTwoFactorEnabled,
}) {
  return (
    <div className="space-y-6 select-none">
      {/* 1. PASSWORD CHANGE CARD */}
      <div className="bg-white rounded-[18px] border border-[#ECECF5] p-7 shadow-[0_8px_30px_rgba(40,30,80,0.06)] space-y-6">
        <div className="border-b border-[#ECECF5] pb-4">
          <h2 className="text-lg font-bold text-[#18112B] flex items-center gap-2">
            <Key size={18} className="text-[#6D4AFF]" />
            <span>Change Password</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Update your account password with strong security requirements
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6 w-full">
          {/* CURRENT PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-[#18112B] uppercase tracking-wider mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={securityData.currentPassword}
                onChange={handleSecurityChange}
                placeholder="Enter current password"
                className={`w-full h-[54px] pl-12 pr-10 bg-[#F8F8FC] border rounded-xl focus:outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 text-sm font-semibold text-[#18112B] transition ${
                  securityErrors.currentPassword ? "border-rose-500" : "border-[#ECECF5]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18112B] p-1 cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {securityErrors.currentPassword && (
              <p className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={13} className="shrink-0" />
                {securityErrors.currentPassword}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-[#18112B] uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6D4AFF] pointer-events-none" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={securityData.newPassword}
                onChange={handleSecurityChange}
                placeholder="Enter new strong password"
                className={`w-full h-[54px] pl-12 pr-10 bg-[#F8F8FC] border rounded-xl focus:outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 text-sm font-semibold text-[#18112B] transition ${
                  securityErrors.newPassword ? "border-rose-500" : "border-[#ECECF5]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18112B] p-1 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {securityErrors.newPassword && (
              <p className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={13} className="shrink-0" />
                {securityErrors.newPassword}
              </p>
            )}

            {/* PASSWORD STRENGTH SCORE METER */}
            {securityData.newPassword && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#18112B]">
                  <span>Password Strength:</span>
                  <span className="capitalize text-[#6D4AFF]">{pwdStrength.label}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pwdStrength.color} transition-all duration-300`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-[#18112B] uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={securityData.confirmPassword}
                onChange={handleSecurityChange}
                placeholder="Re-enter new password"
                className={`w-full h-[54px] pl-12 pr-10 bg-[#F8F8FC] border rounded-xl focus:outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 text-sm font-semibold text-[#18112B] transition ${
                  securityErrors.confirmPassword ? "border-rose-500" : "border-[#ECECF5]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18112B] p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {securityErrors.confirmPassword && (
              <p className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={13} className="shrink-0" />
                {securityErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* PASSWORD REQUIREMENTS CHECKLIST */}
          <div className="bg-[#EAE8FA]/60 border border-[#D1B9FE]/60 rounded-xl p-4 space-y-2 text-xs font-semibold text-[#18112B]">
            <p className="font-extrabold flex items-center gap-1.5 mb-2 text-[#6D4AFF]">
              <ShieldCheck size={16} />
              Password Security Requirements:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li className="flex items-center gap-1.5">
                <Check size={14} className={pwdStrength.hasMinLength ? "text-emerald-600 font-bold" : "text-slate-300"} />
                At least 8 characters
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className={pwdStrength.hasSpecialChar ? "text-emerald-600 font-bold" : "text-slate-300"} />
                Special character (!@#$%^&*)
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className={pwdStrength.hasUppercase && pwdStrength.hasLowercase ? "text-emerald-600 font-bold" : "text-slate-300"} />
                Uppercase & lowercase
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className={pwdStrength.hasNumber ? "text-emerald-600 font-bold" : "text-slate-300"} />
                At least 1 number
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6D4AFF] to-[#7C3AED] hover:opacity-95 shadow-md shadow-purple-500/20 transition cursor-pointer active:scale-95 disabled:opacity-75"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. 2FA & ACTIVE SESSIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TWO-FACTOR AUTHENTICATION */}
        <div className="bg-white border border-[#ECECF5] rounded-[18px] p-6 shadow-[0_8px_30px_rgba(40,30,80,0.06)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EAE8FA] rounded-xl text-[#6D4AFF]">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#18112B]">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Enforce authenticator app validation on logins
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#ECECF5]">
            <span className="text-xs font-bold text-[#18112B]">
              {twoFactorEnabled ? "2FA Active & Enforced" : "2FA Disabled"}
            </span>
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                twoFactorEnabled ? "bg-[#6D4AFF]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ACTIVE SESSIONS */}
        <div className="bg-white border border-[#ECECF5] rounded-[18px] p-6 shadow-[0_8px_30px_rgba(40,30,80,0.06)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#DDEBFF] rounded-xl text-[#6D4AFF]">
              <Laptop size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#18112B]">
                Active Login Sessions
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Devices currently authorized for account access
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F8F8FC] rounded-xl border border-[#ECECF5] text-xs font-semibold">
            <div>
              <p className="font-bold text-[#18112B]">Chrome on MacOS (Current)</p>
              <p className="text-slate-400">San Francisco, CA • 192.168.1.45</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-md">
              Active Now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
