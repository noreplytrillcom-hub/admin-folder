import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Shield,
  Bell,
  Camera,
  Check,
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  Key,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Lock,
  Globe,
  Clock,
  Laptop,
  Info,
  Loader2,
  Briefcase
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

export default function MyProfileDashboard() {
  const { user } = useAuth();

  // Active Tab state: 'personal' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState("personal");

  // Initial user state
  const defaultUserData = {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@enterprise.io",
    phone: "+1 (555) 234-5678",
    bio: "Lead Systems Architect & Technical Director. Passionate about scalable cloud infrastructure, developer experience, and modern web applications.",
    role: "Super Admin",
    department: "Chief Executive Officer",
    title: "Principal Infrastructure Lead",
    location: "San Francisco, CA",
    timezone: "Pacific Time (US & Canada) UTC-8",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    accountStatus: "Verified Active",
    memberSince: "March 2022"
  };

  const [userData, setUserData] = useState(() => ({
    ...defaultUserData,
    firstName: user?.full_name?.split(" ")[0] || defaultUserData.firstName,
    lastName: user?.full_name?.split(" ").slice(1).join(" ") || defaultUserData.lastName,
    email: user?.email || defaultUserData.email,
    avatarUrl: user?.avatar_url || defaultUserData.avatarUrl,
    role: user?.role || defaultUserData.role
  }));

  const [savedUserData, setSavedUserData] = useState(() => ({ ...userData }));

  // Validation & Error States
  const [fieldErrors, setFieldErrors] = useState({});
  const [securityErrors, setSecurityErrors] = useState({});

  // Loading States
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Toast / Alert Notice State (#EAE8FA bg & #7952F5 text)
  const [toast, setToast] = useState(null);

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences State
  const [preferences, setPreferences] = useState({
    emailSecurityAlerts: true,
    emailProductUpdates: true,
    emailWeeklyDigest: false,
    emailTeamInvites: true,
    pushDirectMessages: true,
    pushSystemHealth: true,
    pushMarketing: false,
    smsCriticalAlerts: true,
    smsTwoFactor: true,
    digestFrequency: "daily"
  });
  const [savedPreferences, setSavedPreferences] = useState({ ...preferences });

  const fileInputRef = useRef(null);

  // Detect Unsaved Changes
  const hasUnsavedGeneralChanges =
    JSON.stringify(userData) !== JSON.stringify(savedUserData);
  const hasUnsavedPreferences =
    JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  // Auto-dismiss Toast Notice
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Validation Functions
  const validateEmail = (email) => {
    if (!email || !email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email format (e.g. user@domain.com).";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone || !phone.trim()) return "";
    const phoneRegex = /^[\d\+\-\(\)\s]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Please enter a valid phone number format (e.g. +1 (555) 234-5678).";
    }
    return "";
  };

  const handleFieldBlur = (fieldName, value) => {
    let error = "";
    if (fieldName === "email") error = validateEmail(value);
    if (fieldName === "phone") error = validatePhone(value);
    if (fieldName === "firstName" && (!value || !value.trim())) error = "First name is required.";
    if (fieldName === "lastName" && (!value || !value.trim())) error = "Last name is required.";

    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToast({
        type: "error",
        text: "File size exceeds 5MB limit. Please select a smaller photo."
      });
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prev) => ({ ...prev, avatarUrl: reader.result }));
      setIsUploadingPhoto(false);
      setToast({
        type: "success",
        text: "Profile photo updated preview! Click 'Save Changes' to apply."
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUserData((prev) => ({ ...prev, avatarUrl: "" }));
    setToast({
      type: "info",
      text: "Photo removed. Default fallback avatar will be displayed."
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
    if (securityErrors[name]) {
      setSecurityErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: "Empty", color: "bg-gray-200" };
    let score = 0;
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (hasMinLength) score += 20;
    if (hasUppercase) score += 20;
    if (hasLowercase) score += 20;
    if (hasNumber) score += 20;
    if (hasSpecialChar) score += 20;

    if (score <= 20) return { score, label: "Weak", color: "bg-rose-500", hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar };
    if (score <= 60) return { score, label: "Fair", color: "bg-amber-500", hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar };
    if (score <= 80) return { score, label: "Good", color: "bg-blue-500", hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar };
    return { score, label: "Excellent", color: "bg-emerald-500", hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar };
  };

  const pwdStrength = calculatePasswordStrength(securityData.newPassword);

  const handleSaveGeneralInfo = async (e) => {
    if (e) e.preventDefault();

    const emailErr = validateEmail(userData.email);
    const phoneErr = validatePhone(userData.phone);
    const firstNameErr = !userData.firstName?.trim() ? "First name is required." : "";
    const lastNameErr = !userData.lastName?.trim() ? "Last name is required." : "";

    if (emailErr || phoneErr || firstNameErr || lastNameErr) {
      setFieldErrors({
        email: emailErr,
        phone: phoneErr,
        firstName: firstNameErr,
        lastName: lastNameErr
      });
      setToast({
        type: "error",
        text: "Please resolve form validation errors before saving."
      });
      return;
    }

    setIsSavingGeneral(true);
    setToast(null);

    try {
      // Persist to Supabase if logged in
      if (user?.email) {
        const full_name = `${userData.firstName} ${userData.lastName}`.trim();
        await supabase
          .from("allowed_users")
          .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            full_name: full_name,
            contact_number: userData.phone,
            department: userData.department,
            designation: userData.title,
            avatar_url: userData.avatarUrl,
          })
          .ilike("email", user.email.trim());
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedUserData({ ...userData });

      setToast({
        type: "success",
        text: "User profile details saved successfully!"
      });
    } catch (err) {
      setToast({
        type: "error",
        text: "Failed to save profile. Please try again."
      });
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleDiscardGeneralChanges = () => {
    setUserData({ ...savedUserData });
    setFieldErrors({});
    setToast({
      type: "info",
      text: "Reverted unsaved profile changes."
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const secErrors = {};
    if (!securityData.currentPassword) {
      secErrors.currentPassword = "Current password is required.";
    }
    if (!securityData.newPassword || securityData.newPassword.length < 8) {
      secErrors.newPassword = "New password must be at least 8 characters long.";
    } else if (!pwdStrength.hasSpecialChar) {
      secErrors.newPassword = "New password must include at least one special character (!@#$%^&*).";
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      secErrors.confirmPassword = "New password and confirmation do not match.";
    }

    if (Object.keys(secErrors).length > 0) {
      setSecurityErrors(secErrors);
      setToast({
        type: "error",
        text: "Password security requirements not met."
      });
      return;
    }

    setIsUpdatingPassword(true);
    setToast(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSecurityErrors({});

      setToast({
        type: "success",
        text: "Account password updated successfully!"
      });
    } catch (err) {
      setToast({
        type: "error",
        text: "Failed to update password."
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePreferences = async (e) => {
    if (e) e.preventDefault();

    setIsSavingPreferences(true);
    setToast(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedPreferences({ ...preferences });

      setToast({
        type: "success",
        text: "Notification preferences updated successfully!"
      });
    } catch (err) {
      setToast({
        type: "error",
        text: "Failed to update notification preferences."
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // Reusable Custom Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, id, label, description }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-[#EAE8FA] last:border-b-0">
      <div className="pr-4">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-[#18112B] cursor-pointer select-none block"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-[#18112B]/60 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#7952F5] focus:ring-offset-2 ${
          checked ? "bg-[#7952F5]" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  const fullName = `${userData.firstName} ${userData.lastName}`.trim() || "User Profile";

  return (
    <div className="w-full min-h-screen bg-[#F8F8FC] font-sans text-[#18112B]">
      {/* Outer Layout Container: w-full max-w-7xl mx-auto p-6 space-y-6 */}
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">

        {/* TOAST / BANNER ALERT (#EAE8FA bg & #7952F5 text) */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border border-[#D1B9FE] bg-[#EAE8FA] text-[#7952F5] transition-all duration-300 max-w-md">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#7952F5] shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-[#7952F5] shrink-0" />}

            <span className="text-sm font-semibold tracking-tight leading-snug">{toast.text}</span>

            <button
              onClick={() => setToast(null)}
              className="ml-auto text-[#7952F5]/70 hover:text-[#7952F5] transition-colors p-1 cursor-pointer"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* HEADER PROFILE CARD */}
        <div className="bg-[#FFFFFF] border border-[#EAE8FA] rounded-[16px] overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
          {/* Cover Decorative Banner */}
          <div className="h-32 sm:h-44 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 bg-gradient-to-r from-[#18112B] via-[#462e97] to-[#7952F5] relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#EAE8FA_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DDEBFF]" />
                {userData.accountStatus}
              </span>
            </div>
          </div>

          {/* Header Row: Flex layout (flex items-center justify-between w-full) */}
          <div className="flex items-center justify-between w-full flex-wrap sm:flex-nowrap gap-6 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
              {/* User Avatar */}
              <div className="relative group inline-block shrink-0 -mt-16 sm:-mt-20">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-[#EAE8FA] shadow-md overflow-hidden flex items-center justify-center relative">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#7952F5] text-white text-3xl font-bold">
                      {userData.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    title="Upload profile photo"
                    className="absolute inset-0 bg-[#18112B]/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer backdrop-blur-[2px]"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mb-0.5 text-white" />
                        <span className="text-[10px] font-semibold tracking-wide uppercase">Change</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 bg-[#7952F5] hover:bg-[#683FE4] text-white rounded-full shadow-lg border-2 border-white transition-transform active:scale-95 cursor-pointer"
                  title="Upload Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Meta Information */}
              <div className="space-y-1.5 w-full">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-[#18112B] tracking-tight">
                    {fullName}
                  </h1>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Role Badge (#EAE8FA) */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAE8FA] text-[#18112B] border border-[#EAE8FA]">
                      <Shield className="w-3.5 h-3.5 text-[#7952F5]" />
                      {userData.role}
                    </span>

                    {/* Department Badge (#DDEBFF) */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DDEBFF] text-[#18112B] border border-[#DDEBFF]">
                      <Building className="w-3.5 h-3.5 text-[#7952F5]" />
                      {userData.department}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#18112B]/70 flex flex-wrap items-center gap-3 font-medium">
                  <span>{userData.title}</span>
                  {userData.location && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        {userData.location}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Remove Photo Action Button: shrink-0 ml-auto */}
            {userData.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="shrink-0 ml-auto px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION TAB BAR: mt-6 mb-6 flex border-b border-gray-200 pb-3 */}
        <div className="mt-6 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "personal"
                ? "bg-[#7952F5] text-white shadow-md shadow-[#7952F5]/20"
                : "text-[#18112B]/70 hover:text-[#18112B] hover:bg-[#EAE8FA]/60"
            }`}
          >
            <User className="w-4 h-4" />
            <span>General Info</span>
            {hasUnsavedGeneralChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "security"
                ? "bg-[#7952F5] text-white shadow-md shadow-[#7952F5]/20"
                : "text-[#18112B]/70 hover:text-[#18112B] hover:bg-[#EAE8FA]/60"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "preferences"
                ? "bg-[#7952F5] text-white shadow-md shadow-[#7952F5]/20"
                : "text-[#18112B]/70 hover:text-[#18112B] hover:bg-[#EAE8FA]/60"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Preferences</span>
            {hasUnsavedPreferences && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
            )}
          </button>
        </div>

        {/* TAB 1: PERSONAL / GENERAL INFO */}
        {activeTab === "personal" && (
          <div className="bg-[#FFFFFF] border border-[#EAE8FA] rounded-[16px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#EAE8FA] pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#18112B]">
                  Personal Profile Details
                </h2>
                <p className="text-xs text-[#18112B]/60 mt-0.5">
                  Update your contact details, designation, and public biography.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#DDEBFF] text-[#18112B] rounded-full shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#7952F5]" />
                Client Validation Active
              </span>
            </div>

            <form onSubmit={handleSaveGeneralInfo} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name - pl-10 for icon separation & block mb-1 for label */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                      required
                      placeholder="First name"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] placeholder-gray-400 focus:outline-none transition-all ${
                        fieldErrors.firstName
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                      required
                      placeholder="Last name"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] placeholder-gray-400 focus:outline-none transition-all ${
                        fieldErrors.lastName
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.lastName && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7952F5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      onBlur={(e) => handleFieldBlur("email", e.target.value)}
                      required
                      placeholder="user@domain.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] placeholder-gray-400 focus:outline-none transition-all ${
                        fieldErrors.email
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      onBlur={(e) => handleFieldBlur("phone", e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] placeholder-gray-400 focus:outline-none transition-all ${
                        fieldErrors.phone
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Job Title */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Job Title / Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="title"
                      value={userData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Principal Infrastructure Lead"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl text-sm font-medium text-[#18112B] placeholder-gray-400 focus:outline-none focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Timezone */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Timezone
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      name="timezone"
                      value={userData.timezone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl text-sm font-medium text-[#18112B] focus:outline-none focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Pacific Time (US & Canada) UTC-8">Pacific Time (US & Canada) UTC-8</option>
                      <option value="Eastern Time (US & Canada) UTC-5">Eastern Time (US & Canada) UTC-5</option>
                      <option value="Greenwich Mean Time (UTC+0)">Greenwich Mean Time (UTC+0)</option>
                      <option value="Central European Time (UTC+1)">Central European Time (UTC+1)</option>
                      <option value="India Standard Time (UTC+5:30)">India Standard Time (UTC+5:30)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Biography / Professional Summary
                  </label>
                  <span className="text-xs text-[#18112B]/50 font-medium">
                    {userData.bio?.length || 0} / 500 characters
                  </span>
                </div>
                <textarea
                  name="bio"
                  rows={4}
                  maxLength={500}
                  value={userData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a brief professional summary about your role, responsibilities, or background..."
                  className="w-full px-4 py-3 pt-3 pl-4 bg-[#F8F8FC] border border-[#EAE8FA] rounded-xl text-sm font-medium text-[#18112B] placeholder-gray-400 focus:outline-none focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20 transition-all resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAE8FA] flex items-center justify-end gap-3">
                {hasUnsavedGeneralChanges && (
                  <button
                    type="button"
                    onClick={handleDiscardGeneralChanges}
                    disabled={isSavingGeneral}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-[#EAE8FA] hover:bg-[#dcd8f8] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSavingGeneral}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7952F5] hover:bg-[#683FE4] shadow-lg shadow-[#7952F5]/25 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSavingGeneral ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SECURITY & PASSWORD */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#EAE8FA] rounded-[16px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#EAE8FA] pb-4">
                <h2 className="text-lg font-bold text-[#18112B] flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#7952F5]" />
                  Change Password
                </h2>
                <p className="text-xs text-[#18112B]/60 mt-0.5">
                  Update your password with strong security parameters.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
                {/* Current Password */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={securityData.currentPassword}
                      onChange={handleSecurityChange}
                      placeholder="Enter current password"
                      className={`w-full pl-10 pr-10 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] focus:outline-none transition-all ${
                        securityErrors.currentPassword
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#18112B] p-1 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {securityErrors.currentPassword && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {securityErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7952F5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      placeholder="Enter new strong password"
                      className={`w-full pl-10 pr-10 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] focus:outline-none transition-all ${
                        securityErrors.newPassword
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#18112B] p-1 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {securityErrors.newPassword && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {securityErrors.newPassword}
                    </p>
                  )}

                  {securityData.newPassword && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#18112B]">
                        <span>Strength:</span>
                        <span className="capitalize font-bold text-[#7952F5]">{pwdStrength.label}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pwdStrength.color} transition-all duration-300`}
                          style={{ width: `${pwdStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#18112B]/80">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                      placeholder="Re-enter new password"
                      className={`w-full pl-10 pr-10 py-2.5 bg-[#F8F8FC] border rounded-xl text-sm font-medium text-[#18112B] focus:outline-none transition-all ${
                        securityErrors.confirmPassword
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-[#EAE8FA] focus:border-[#7952F5] focus:ring-2 focus:ring-[#7952F5]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#18112B] p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {securityErrors.confirmPassword && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {securityErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Criteria Checklist */}
                <div className="bg-[#EAE8FA]/60 border border-[#D1B9FE] rounded-xl p-4 space-y-2 text-xs text-[#18112B]">
                  <p className="font-bold text-[#18112B] flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#7952F5]" />
                    Password Security Criteria:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                    <li className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${pwdStrength.hasMinLength ? "text-emerald-600 font-bold" : "text-gray-400"}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${pwdStrength.hasSpecialChar ? "text-emerald-600 font-bold" : "text-gray-400"}`} />
                      Special character (!@#$%^&*)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${pwdStrength.hasUppercase && pwdStrength.hasLowercase ? "text-emerald-600 font-bold" : "text-gray-400"}`} />
                      Uppercase & lowercase letters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${pwdStrength.hasNumber ? "text-emerald-600 font-bold" : "text-gray-400"}`} />
                      At least 1 number
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7952F5] hover:bg-[#683FE4] shadow-lg shadow-[#7952F5]/25 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* 2FA & Active Sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FFFFFF] border border-[#EAE8FA] rounded-[16px] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#EAE8FA] rounded-xl text-[#7952F5]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#18112B]">
                      Two-Factor Authentication (2FA)
                    </h3>
                    <p className="text-xs text-[#18112B]/60">
                      Enforce code validation on new device logins.
                    </p>
                  </div>
                </div>

                <ToggleSwitch
                  id="2fa-toggle"
                  checked={twoFactorEnabled}
                  onChange={setTwoFactorEnabled}
                  label={twoFactorEnabled ? "2FA Active & Enforced" : "2FA Disabled"}
                  description="Authenticator app verification required for account changes"
                />
              </div>

              <div className="bg-[#FFFFFF] border border-[#EAE8FA] rounded-[16px] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#DDEBFF] rounded-xl text-[#7952F5]">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#18112B]">
                      Active Login Sessions
                    </h3>
                    <p className="text-xs text-[#18112B]/60">
                      Devices currently authorized for your account.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-[#F8F8FC] rounded-xl border border-[#EAE8FA]">
                    <div>
                      <p className="font-bold text-[#18112B]">Chrome on MacOS (Current)</p>
                      <p className="text-gray-500">San Francisco, CA • 192.168.1.45</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-md">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATION PREFERENCES */}
        {activeTab === "preferences" && (
          <div className="bg-[#FFFFFF] border border-[#EAE8FA] rounded-[16px] p-6 sm:p-8 shadow-sm space-y-8">
            <div className="border-b border-[#EAE8FA] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#18112B] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#7952F5]" />
                  Notification & Alert Preferences
                </h2>
                <p className="text-xs text-[#18112B]/60 mt-0.5">
                  Customize how and when you receive system alerts, email digests, and notifications.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-8">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7952F5] flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Notifications
                </h3>

                <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-2xl px-5 py-2 divide-y divide-[#EAE8FA]">
                  <ToggleSwitch
                    id="pref-email-security"
                    checked={preferences.emailSecurityAlerts}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, emailSecurityAlerts: val }))
                    }
                    label="Security & Account Alerts"
                    description="Get immediate email alerts for unusual logins or password changes."
                  />

                  <ToggleSwitch
                    id="pref-email-product"
                    checked={preferences.emailProductUpdates}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, emailProductUpdates: val }))
                    }
                    label="Product & Feature Announcements"
                    description="Receive highlights about new features and platform upgrades."
                  />

                  <ToggleSwitch
                    id="pref-email-team"
                    checked={preferences.emailTeamInvites}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, emailTeamInvites: val }))
                    }
                    label="Team & Collaboration Invites"
                    description="Notifications when you are mentioned or assigned to workspace projects."
                  />

                  <ToggleSwitch
                    id="pref-email-digest"
                    checked={preferences.emailWeeklyDigest}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, emailWeeklyDigest: val }))
                    }
                    label="Weekly Summary Digest"
                    description="Consolidated breakdown of system activity and performance stats."
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7952F5] flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4" />
                  In-App Push Alerts
                </h3>

                <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-2xl px-5 py-2 divide-y divide-[#EAE8FA]">
                  <ToggleSwitch
                    id="pref-push-dm"
                    checked={preferences.pushDirectMessages}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, pushDirectMessages: val }))
                    }
                    label="Direct Messages & Support Escalations"
                    description="Instant browser notifications for incoming urgent tickets and team chats."
                  />

                  <ToggleSwitch
                    id="pref-push-system"
                    checked={preferences.pushSystemHealth}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, pushSystemHealth: val }))
                    }
                    label="System Infrastructure Warnings"
                    description="Real-time alerts for API rate-limiting or high compute workload events."
                  />
                </div>
              </div>

              {/* SMS Alerts */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7952F5] flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4" />
                  SMS & Mobile Verification
                </h3>

                <div className="bg-[#F8F8FC] border border-[#EAE8FA] rounded-2xl px-5 py-2 divide-y divide-[#EAE8FA]">
                  <ToggleSwitch
                    id="pref-sms-critical"
                    checked={preferences.smsCriticalAlerts}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, smsCriticalAlerts: val }))
                    }
                    label="Critical Outage & Incident Alerts"
                    description="Direct SMS alerts to your phone for emergency system outages."
                  />

                  <ToggleSwitch
                    id="pref-sms-2fa"
                    checked={preferences.smsTwoFactor}
                    onChange={(val) =>
                      setPreferences((prev) => ({ ...prev, smsTwoFactor: val }))
                    }
                    label="Two-Factor Security Passcodes"
                    description="Send security passcodes via SMS when logging in from unknown devices."
                  />
                </div>
              </div>

              {/* Save Preferences Action */}
              <div className="pt-4 border-t border-[#EAE8FA] flex items-center justify-between">
                <p className="text-xs text-[#18112B]/60">
                  {hasUnsavedPreferences ? (
                    <span className="text-amber-600 font-semibold">Unsaved preference changes pending.</span>
                  ) : (
                    "All preferences are up to date."
                  )}
                </p>

                <button
                  type="submit"
                  disabled={isSavingPreferences}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7952F5] hover:bg-[#683FE4] shadow-lg shadow-[#7952F5]/25 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSavingPreferences ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Preferences...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
