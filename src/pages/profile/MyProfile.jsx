import {
  AlertCircle,
  Briefcase,
  Building,
  Camera,
  CheckCircle2,
  Clock,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import styles from "./MyProfile.module.css";

export default function MyProfile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    department: "",
    designation: "",
    avatar_url: "",
    role: "Admin",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Load initial user data from DB
  useEffect(() => {
    async function loadUserProfile() {
      if (!user?.email) return;

      try {
        setLoading(true);
        const { data } = await supabase
          .from("allowed_users")
          .select("*")
          .ilike("email", user.email.trim())
          .maybeSingle();

        if (data) {
          setFormData({
            first_name: data.first_name || user.full_name?.split(" ")[0] || "",
            last_name:
              data.last_name ||
              user.full_name?.split(" ").slice(1).join(" ") ||
              "",
            email: data.email || user.email || "",
            contact_number: data.contact_number || "",
            department: data.department || "",
            designation: data.designation || "",
            avatar_url: data.avatar_url || user.avatar_url || "",
            role: data.role || "Admin User",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [user]);

  // 2. Handle Text Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Profile Picture Upload / Preview (1MB Limit)
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 1 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File size exceeds 1MB limit. Please choose a smaller photo.",
        });
        return;
      }

      setUploading(true);
      setMessage({ type: "", text: "" });

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar_url: reader.result }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to upload image." });
      setUploading(false);
    }
  };

  // 4. Save Changes to Supabase DB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const full_name = `${formData.first_name} ${formData.last_name}`.trim();

    const { error } = await supabase
      .from("allowed_users")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: full_name,
        contact_number: formData.contact_number,
        department: formData.department,
        designation: formData.designation,
        avatar_url: formData.avatar_url,
      })
      .ilike("email", user.email.trim());

    setSaving(false);

    if (error) {
      console.error("Database Save Error:", error);
      setMessage({
        type: "error",
        text: `Failed to update profile: ${error.message}`,
      });
    } else {
      setMessage({
        type: "success",
        text: "Profile updated successfully! Refreshing details...",
      });
      setIsEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  if (loading) {
    return <SkeletonLoader variant="form" />;
  }

  const fullName =
    `${formData.first_name} ${formData.last_name}`.trim() || "User Profile";

  return (
    <div className={styles.container}>
      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Account Profile</h1>
          <p className={styles.pageSubtitle}>
            Manage your personal profile details, organization info, and account
            preferences.
          </p>
        </div>
      </div>

      {/* ALERT FEEDBACK */}
      {message.text && (
        <div
          className={`${styles.alert} ${
            message.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* COVER BANNER & HEADER CARD */}
      <div className={styles.bannerCard}>
        <div className={styles.coverBanner}>
          <div className={styles.coverBannerPattern} />
        </div>

        <div className={styles.bannerContent}>
          <div className={styles.avatarGroup}>
            <div className={styles.avatarWrapper}>
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt={fullName}
                  className={styles.avatarImg}
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {formData.first_name?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {isEditing && (
                <label className={styles.uploadOverlay}>
                  <Camera size={20} />
                  <span>Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    hidden
                  />
                </label>
              )}
            </div>

            <div className={styles.profileHeaderMeta}>
              <h2 className={styles.displayName}>
                {fullName}
                <span className={styles.roleTag}>
                  {formData.role || "Admin"}
                </span>
              </h2>
              <p className={styles.displaySub}>
                <Briefcase size={14} />
                {formData.designation || "Executive"}
                {formData.department ? ` • ${formData.department}` : ""}
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? styles.btnSecondary : styles.btnPrimary}
            >
              {isEditing ? (
                <>
                  <X size={15} /> Cancel Editing
                </>
              ) : (
                <>
                  <Pencil size={15} /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN MAIN LAYOUT */}
      <form onSubmit={handleSubmit}>
        <div className={styles.layoutGrid}>
          {/* LEFT SIDEBAR CARD */}
          <aside className={styles.sideCard}>
            <div>
              <h4 className={styles.sideSectionTitle}>Account Overview</h4>
              <div className={styles.sideList}>
                <div className={styles.sideListItem}>
                  <div className={styles.iconBox}>
                    <ShieldCheck size={18} />
                  </div>
                  <div className={styles.sideItemMeta}>
                    <span className={styles.sideItemLabel}>Account Status</span>
                    <div className={styles.statusBadgeActive}>
                      <span className={styles.statusDot} /> Active Admin
                    </div>
                  </div>
                </div>

                <div className={styles.sideListItem}>
                  <div className={styles.iconBox}>
                    <Mail size={18} />
                  </div>
                  <div className={styles.sideItemMeta}>
                    <span className={styles.sideItemLabel}>Email Status</span>
                    <span className={styles.sideItemValue}>Verified</span>
                  </div>
                </div>

                <div className={styles.sideListItem}>
                  <div className={styles.iconBox}>
                    <Clock size={18} />
                  </div>
                  <div className={styles.sideItemMeta}>
                    <span className={styles.sideItemLabel}>Last Sign In</span>
                    <span className={styles.sideItemValue}>Today</span>
                  </div>
                </div>

                <div className={styles.sideListItem}>
                  <div className={styles.iconBox}>
                    <Sparkles size={18} />
                  </div>
                  <div className={styles.sideItemMeta}>
                    <span className={styles.sideItemLabel}>Access Level</span>
                    <span className={styles.sideItemValue}>Full Control</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN WORKSPACE */}
          <main className={styles.mainContent}>
            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionTitleGroup}>
                  <User size={18} className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Personal Details</h3>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>First Name</label>
                  {isEditing ? (
                    <div className={styles.inputIconWrapper}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        className={styles.input}
                      />
                    </div>
                  ) : (
                    <div className={styles.fieldValueBox}>
                      {formData.first_name || "-"}
                    </div>
                  )}
                </div>

                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>Last Name</label>
                  {isEditing ? (
                    <div className={styles.inputIconWrapper}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        className={styles.input}
                      />
                    </div>
                  ) : (
                    <div className={styles.fieldValueBox}>
                      {formData.last_name || "-"}
                    </div>
                  )}
                </div>

                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>Email Address</label>
                  <div className={styles.fieldValueBox}>
                    <Mail size={16} color="#6366f1" />
                    {formData.email || "-"}
                  </div>
                </div>

                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>
                    Phone / Contact Number
                  </label>
                  {isEditing ? (
                    <div className={styles.inputIconWrapper}>
                      <Phone size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className={styles.input}
                      />
                    </div>
                  ) : (
                    <div className={styles.fieldValueBox}>
                      <Phone size={16} color="#6366f1" />
                      {formData.contact_number || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: WORK DETAILS */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionTitleGroup}>
                  <Briefcase size={18} className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>
                    Work & Organization Details
                  </h3>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>Department</label>
                  {isEditing ? (
                    <div className={styles.inputIconWrapper}>
                      <Building size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Department"
                        className={styles.input}
                      />
                    </div>
                  ) : (
                    <div className={styles.fieldValueBox}>
                      <Building size={16} color="#6366f1" />
                      {formData.department || "-"}
                    </div>
                  )}
                </div>

                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel}>Designation</label>
                  {isEditing ? (
                    <div className={styles.inputIconWrapper}>
                      <Briefcase size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Designation"
                        className={styles.input}
                      />
                    </div>
                  ) : (
                    <div className={styles.fieldValueBox}>
                      <Briefcase size={16} color="#6366f1" />
                      {formData.designation || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM ACTION ROW WHEN EDITING */}
            {isEditing && (
              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className={styles.btnPrimary}
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            )}
          </main>
        </div>
      </form>
    </div>
  );
}
