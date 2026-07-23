import { AlertCircle, CheckCircle2, Pencil, Upload, X } from "lucide-react";
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
          text: "File size exceeds the 1MB limit. Please select a smaller file.",
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
      setMessage({ type: "error", text: "Failed to load image." });
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
        text: `Failed to save profile details: ${error.message}`,
      });
    } else {
      setMessage({
        type: "success",
        text: "Profile updated successfully! Refreshing view...",
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
    `${formData.first_name} ${formData.last_name}`.trim() || "User Name";

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Profile</h1>

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

      <form onSubmit={handleSubmit} className={styles.sectionsWrapper}>
        {/* CARD 1: USER SUMMARY HEADER */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.profileHeaderLeft}>
              <div className={styles.avatarWrapper}>
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Profile Avatar"
                    className={styles.avatarImg}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {formData.first_name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                {isEditing && (
                  <label className={styles.uploadOverlay}>
                    <Upload size={18} />
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

              <div className={styles.profileMeta}>
                <h2 className={styles.displayName}>{fullName}</h2>
                <p className={styles.displaySub}>
                  {formData.designation || "Designation"}
                  {formData.department ? ` • ${formData.department}` : ""}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={styles.editBtn}
            >
              {isEditing ? (
                <>
                  <X size={15} /> Cancel
                </>
              ) : (
                <>
                  Edit <Pencil size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 2: PERSONAL INFORMATION */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={styles.editBtn}
              >
                Edit <Pencil size={14} />
              </button>
            )}
          </div>

          <div className={styles.grid}>
            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              ) : (
                <p className={styles.fieldValue}>
                  {formData.first_name || "-"}
                </p>
              )}
            </div>

            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              ) : (
                <p className={styles.fieldValue}>{formData.last_name || "-"}</p>
              )}
            </div>

            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>Email Address</label>
              <p className={styles.fieldValue}>{formData.email || "-"}</p>
            </div>

            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>
                Phone / Contact Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Contact Number"
                />
              ) : (
                <p className={styles.fieldValue}>
                  {formData.contact_number || "-"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CARD 3: WORK DETAILS */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.sectionTitle}>Work Details</h3>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={styles.editBtn}
              >
                Edit <Pencil size={14} />
              </button>
            )}
          </div>

          <div className={styles.grid}>
            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>Department</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                />
              ) : (
                <p className={styles.fieldValue}>
                  {formData.department || "-"}
                </p>
              )}
            </div>

            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                />
              ) : (
                <p className={styles.fieldValue}>
                  {formData.designation || "-"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SAVE BUTTON (Visible during edit mode) */}
        {isEditing && (
          <div className={styles.actionRow}>
            <button
              type="submit"
              disabled={saving || uploading}
              className={styles.submitBtn}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
