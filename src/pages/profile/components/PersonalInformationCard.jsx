import React from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Sparkles,
  RotateCcw,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function PersonalInformationCard({
  userData,
  handleInputChange,
  handleFieldBlur,
  fieldErrors,
  handleSaveGeneralInfo,
  handleDiscardGeneralChanges,
  hasUnsavedGeneralChanges,
  isSavingGeneral,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE8FA] p-6 shadow-sm space-y-6 select-none">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE8FA]">
        <div>
          <h3 className="text-base font-bold text-[#18112B]">Personal Information</h3>
          <p className="text-xs text-gray-400">Update your contact details and public biography</p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-[#EAE8FA] text-[#7952F5] rounded-full border border-[#D1B9FE]/40">
          <Sparkles size={13} className="text-[#7952F5]" />
          <span>Client Validation Active</span>
        </span>
      </div>

      <form onSubmit={handleSaveGeneralInfo} className="space-y-6">
        {/* 2-COLUMN INPUT CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. FIRST NAME */}
          <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              First Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-0 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                required
                placeholder="First name"
                className="w-full pl-7 bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none"
              />
            </div>
            {fieldErrors.firstName && (
              <p className="text-[10px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          {/* 2. LAST NAME */}
          <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-0 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                required
                placeholder="Last name"
                className="w-full pl-7 bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none"
              />
            </div>
            {fieldErrors.lastName && (
              <p className="text-[10px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          {/* 3. EMAIL ADDRESS */}
          <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-0 text-[#7952F5] pointer-events-none" />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                onBlur={(e) => handleFieldBlur("email", e.target.value)}
                required
                placeholder="user@domain.com"
                className="w-full pl-7 bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[10px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* 4. PHONE NUMBER */}
          <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone size={16} className="absolute left-0 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                onBlur={(e) => handleFieldBlur("phone", e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full pl-7 bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none"
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[10px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* 5. JOB TITLE */}
          <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Job Title / Designation
            </label>
            <div className="relative flex items-center">
              <Briefcase size={16} className="absolute left-0 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="title"
                value={userData.title}
                onChange={handleInputChange}
                placeholder="e.g. Principal Infrastructure Lead"
                className="w-full pl-7 bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none"
              />
            </div>
          </div>

          {/* 6. TIMEZONE */}
          <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Timezone
            </label>
            <div className="relative flex items-center">
              <Globe size={16} className="absolute left-0 text-gray-400 pointer-events-none" />
              <select
                name="timezone"
                value={userData.timezone}
                onChange={handleInputChange}
                className="w-full pl-7 bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Pacific Time (US & Canada) UTC-8">Pacific Time (US & Canada) UTC-8</option>
                <option value="Eastern Time (US & Canada) UTC-5">Eastern Time (US & Canada) UTC-5</option>
                <option value="Greenwich Mean Time (UTC+0)">Greenwich Mean Time (UTC+0)</option>
                <option value="Central European Time (UTC+1)">Central European Time (UTC+1)</option>
                <option value="India Standard Time (UTC+5:30)">India Standard Time (UTC+5:30)</option>
              </select>
            </div>
          </div>

          {/* BIOGRAPHY CARD CONTAINER */}
          <div className="md:col-span-2 bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl p-3 relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Biography / Professional Summary
            </label>
            <textarea
              name="bio"
              rows={3}
              maxLength={500}
              value={userData.bio}
              onChange={handleInputChange}
              placeholder="Write a brief professional summary..."
              className="w-full bg-transparent text-sm font-semibold text-[#18112B] focus:outline-none leading-relaxed resize-none"
            />
            <div className="text-right text-[10px] text-gray-400 mt-1">
              {userData.bio?.length || 0} / 500 characters
            </div>
          </div>
        </div>

        {/* FORM FOOTER AREA */}
        <div className="pt-4 border-t border-[#EAE8FA] flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-400">
            Changes are saved securely to the account.
          </p>

          <div className="flex items-center gap-2.5">
            {hasUnsavedGeneralChanges && (
              <button
                type="button"
                onClick={handleDiscardGeneralChanges}
                disabled={isSavingGeneral}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isSavingGeneral}
              className="px-6 py-2 text-xs font-semibold text-white bg-[#7952F5] rounded-xl hover:bg-opacity-90 transition shadow-sm cursor-pointer disabled:opacity-75 inline-flex items-center gap-1.5"
            >
              {isSavingGeneral ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
