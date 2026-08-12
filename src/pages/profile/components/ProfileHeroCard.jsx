import React, { useRef } from "react";
import {
  Camera,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function ProfileHeroCard({
  userData,
  fullName,
  isUploadingPhoto,
  onPhotoUpload,
  onRemovePhoto,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#ECECF5] overflow-hidden shadow-[0_8px_30px_rgba(40,30,80,0.06)] mb-6 select-none">
      {/* 1. TOP PURPLE GRADIENT BANNER (Strictly 84px height) */}
      <div
        className="h-[84px] w-full relative px-6 py-3 flex justify-end items-start overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6D4AFF 0%, #8B2BE2 45%, #1F123D 100%)",
        }}
      >
        {/* Wavy Dot Matrix Decoration */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:18px_18px] pointer-events-none" />

        {/* VERIFIED STATUS BADGE IN TOP RIGHT */}
        <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-emerald-700 shadow-xs border border-emerald-200/80">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span>Verified Active</span>
        </div>
      </div>

      {/* 2. LOWER WHITE SECTION WITH OVERLAPPING AVATAR */}
      <div className="px-6 sm:px-8 pb-5 pt-0 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-12 relative z-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 w-full">
          {/* OVERLAPPING AVATAR (115px) */}
          <div className="relative group shrink-0">
            <div className="w-[115px] h-[115px] rounded-full border-4 border-white bg-[#EAE8FA] shadow-md overflow-hidden flex items-center justify-center relative">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6D4AFF] to-[#7C3AED] text-white text-2xl font-extrabold">
                  {userData.firstName?.[0]?.toUpperCase() || "A"}
                  {userData.lastName?.[0]?.toUpperCase() || "M"}
                </div>
              )}

              {/* Hover Overlay Camera Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute inset-0 bg-[#18112B]/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer backdrop-blur-[2px]"
                title="Change Photo"
              >
                <Camera size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Upload</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onPhotoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Corner Camera Edit Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-[#6D4AFF] hover:bg-[#5b3ceb] text-white rounded-full shadow-md border-2 border-white transition-transform active:scale-95 cursor-pointer"
              title="Upload Photo"
            >
              <Camera size={13} />
            </button>
          </div>

          {/* NAME, ROLE PILLS & CONTACT METADATA */}
          <div className="space-y-1.5 w-full pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#18112B] tracking-tight">
                {fullName}
              </h2>

              {/* Role Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAE8FA] text-[#6D4AFF] border border-[#D1B9FE]/50">
                  {userData.role || "Senior Admin"}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DDEBFF] text-[#18112B]">
                  {userData.department || "Chief Executive Officer"}
                </span>
              </div>
            </div>

            {/* Subtitle / Job Title */}
            <p className="text-xs font-semibold text-slate-500">
              {userData.title} • {userData.location}
            </p>

            {/* Contact Metadata Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} className="text-[#6D4AFF]" />
                <span>{userData.email}</span>
              </span>

              <span className="text-slate-300">•</span>

              <span className="inline-flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                <span>{userData.phone}</span>
              </span>

              <span className="text-slate-300">•</span>

              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span>{userData.timezone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Remove Photo Action */}
        {userData.avatarUrl && (
          <button
            type="button"
            onClick={onRemovePhoto}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer shrink-0 self-end md:self-center pb-1"
          >
            Remove Photo
          </button>
        )}
      </div>
    </div>
  );
}
