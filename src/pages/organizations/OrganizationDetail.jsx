import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  Zap,
  Clock,
  Users,
  Key,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Sliders,
  Activity,
  X,
  Sparkles,
  Lock
} from "lucide-react";
import {
  fetchOrganizationById,
  updateOrganizationQuotas,
  regenerateApiKey,
  toggleOrganizationStatus
} from "../../services/organizationService";
import { useToast } from "../../context/ToastContext";
import styles from "./OrganizationDetail.module.css";

export default function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quotas Form State
  const [concurrentSlots, setConcurrentSlots] = useState(50);
  const [monthlyMinutesQuota, setMonthlyMinutesQuota] = useState(50000);
  const [savingQuotas, setSavingQuotas] = useState(false);

  // API Key State
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState(false);

  // Suspend Modal State
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  const loadOrg = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchOrganizationById(id);
      setOrg(data);
      setConcurrentSlots(data.concurrentSlots);
      setMonthlyMinutesQuota(data.monthlyMinutesQuota);
    } catch (err) {
      toast.error("Failed to load organization details: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadOrg();
  }, [loadOrg]);

  // Quota Adjustment Handler
  const handleSaveQuotas = async (e) => {
    e.preventDefault();
    try {
      setSavingQuotas(true);
      await updateOrganizationQuotas(id, { concurrentSlots, monthlyMinutesQuota });
      setOrg((prev) => ({ ...prev, concurrentSlots: Number(concurrentSlots), monthlyMinutesQuota: Number(monthlyMinutesQuota) }));
      toast.success("Compute quotas updated optimistically", "Quotas Saved");
    } catch (err) {
      toast.error("Failed to save quotas: " + err.message);
    } finally {
      setSavingQuotas(false);
    }
  };

  // API Key Regenerate Handler
  const handleRegenerateKey = async () => {
    try {
      setRegeneratingKey(true);
      const newKey = await regenerateApiKey(id);
      setOrg((prev) => ({ ...prev, apiKey: newKey }));
      setIsRegenModalOpen(false);
      toast.success("New live API key generated and active", "API Key Regenerated");
    } catch (err) {
      toast.error("Failed to regenerate API key: " + err.message);
    } finally {
      setRegeneratingKey(false);
    }
  };

  // Copy API Key to Clipboard
  const handleCopyKey = () => {
    if (!org?.apiKey) return;
    navigator.clipboard.writeText(org.apiKey);
    toast.info("API Key copied to clipboard", "Copied");
  };

  // Toggle Suspend Status Handler
  const handleToggleSuspend = async () => {
    try {
      const updated = await toggleOrganizationStatus(id);
      setOrg((prev) => ({ ...prev, status: updated.status }));
      setIsSuspendModalOpen(false);
      toast.success(
        `Organization status changed to ${updated.status}`,
        updated.status === "Active" ? "Tenant Reactivated" : "Tenant Suspended"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading || !org) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonGrid} />
      </div>
    );
  }

  const usagePct = Math.min(
    100,
    Math.round((org.monthlyMinutesUsed / org.monthlyMinutesQuota) * 100)
  );

  return (
    <div className={styles.container}>
      {/* BACK BUTTON */}
      <div>
        <Link to="/organizations" className={styles.btnBackLink}>
          <ChevronLeft size={16} /> Back to Organizations
        </Link>
      </div>

      {/* 1. TOP HERO HEADER CARD */}
      <div className={styles.glassHeaderCard}>
        <div className={styles.headerLeft}>
          <div className={styles.orgAvatarBig}>
            {org.name[0]?.toUpperCase()}
          </div>
          <div className={styles.headerMeta}>
            <div className={styles.titleRow}>
              <h1 className={styles.orgTitle}>{org.name}</h1>
              <span className={styles.idTag}>{org.id}</span>
              <span className={`${styles.planBadge} ${styles[`plan_${org.plan}`]}`}>
                {org.plan} Plan Tier
              </span>
              <span className={`${styles.statusBadge} ${styles[`status_${org.status}`]}`}>
                <span className={org.status === "Active" ? styles.dotGreen : styles.dotRose} />
                {org.status}
              </span>
            </div>
            <p className={styles.subtextMeta}>
              Admin: <strong>{org.adminEmail}</strong> • Registered on: {org.createdAt}
            </p>
          </div>
        </div>

        <div className={styles.headerRightActions}>
          <button
            onClick={() => setIsRegenModalOpen(true)}
            className={styles.btnRegenKeyHeader}
          >
            <Key size={15} /> Regenerate API Key
          </button>

          <button
            onClick={() => setIsSuspendModalOpen(true)}
            className={org.status === "Active" ? styles.btnSuspendHeader : styles.btnReactivateHeader}
          >
            {org.status === "Active" ? (
              <>
                <AlertCircle size={15} /> Suspend Tenant
              </>
            ) : (
              <>
                <CheckCircle2 size={15} /> Reactivate Tenant
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW KPI CARDS GRID (4 CARDS) */}
      <div className={styles.kpiGrid}>
        <div className={styles.glassKpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Concurrent Agent Slots</span>
            <div className={styles.iconBoxViolet}><Zap size={18} /></div>
          </div>
          <h2 className={styles.kpiValue}>{org.concurrentSlots} Slots</h2>
          <p className={styles.kpiSub}>Parallel execution capacity limit</p>
        </div>

        <div className={styles.glassKpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Monthly Compute Usage</span>
            <div className={styles.iconBoxCyan}><Clock size={18} /></div>
          </div>
          <h2 className={styles.kpiValue}>{org.monthlyMinutesUsed.toLocaleString()} mins</h2>
          <div className={styles.usageTrack}>
            <div
              className={usagePct > 90 ? styles.fillRose : styles.fillCyan}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className={styles.kpiSub}>{usagePct}% of {org.monthlyMinutesQuota.toLocaleString()} mins quota</p>
        </div>

        <div className={styles.glassKpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active User Seats</span>
            <div className={styles.iconBoxIndigo}><Users size={18} /></div>
          </div>
          <h2 className={styles.kpiValue}>{org.activeSeats} / {org.maxSeats} Seats</h2>
          <p className={styles.kpiSub}>Tenant admin & operator seats</p>
        </div>

        <div className={styles.glassKpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>API Key Security</span>
            <div className={styles.iconBoxBlue}><Key size={18} /></div>
          </div>
          <div className={styles.keyPreviewBox}>
            <code>{showApiKey ? org.apiKey : `${org.apiKey.substring(0, 12)}••••••••••••`}</code>
          </div>
          <div className={styles.keyBtnRow}>
            <button onClick={() => setShowApiKey(!showApiKey)} className={styles.btnToggleKey}>
              {showApiKey ? "Hide Key" : "Show Key"}
            </button>
            <button onClick={handleCopyKey} className={styles.btnCopyKey}>
              <Copy size={13} /> Copy Key
            </button>
          </div>
        </div>
      </div>

      {/* 3. SPLIT SECTION: QUOTA ADJUSTMENT FORM & SECURITY CARD */}
      <div className={styles.splitGrid}>
        {/* INTERACTIVE QUOTA ADJUSTMENT FORM */}
        <div className={styles.glassPanelCard}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <Sliders size={20} className={styles.panelIcon} />
              <div>
                <h3 className={styles.panelTitle}>Compute Quota & Slot Adjustments</h3>
                <p className={styles.panelSubtitle}>
                  Dynamically scale concurrent agent slots and monthly execution minute limits.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveQuotas} className={styles.quotaForm}>
            {/* CONCURRENT SLOTS CONTROL */}
            <div className={styles.sliderControlGroup}>
              <div className={styles.sliderLabelRow}>
                <label className={styles.inputLabel}>Concurrent Agent Slots</label>
                <span className={styles.sliderValueBadge}>{concurrentSlots} Slots</span>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={concurrentSlots}
                onChange={(e) => setConcurrentSlots(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <div className={styles.rangeLabels}>
                <span>5 Slots (Min)</span>
                <span>250 Slots</span>
                <span>500 Slots (Max)</span>
              </div>
            </div>

            {/* MONTHLY MINUTES QUOTA CONTROL */}
            <div className={styles.sliderControlGroup}>
              <div className={styles.sliderLabelRow}>
                <label className={styles.inputLabel}>Monthly Execution Minutes Quota</label>
                <span className={styles.sliderValueBadge}>{monthlyMinutesQuota.toLocaleString()} mins</span>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={monthlyMinutesQuota}
                onChange={(e) => setMonthlyMinutesQuota(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <div className={styles.rangeLabels}>
                <span>5,000 mins</span>
                <span>250,000 mins</span>
                <span>500,000 mins</span>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button
                type="submit"
                disabled={savingQuotas}
                className={styles.btnSaveQuotas}
              >
                {savingQuotas ? "Saving Changes..." : "Save Quota Adjustments"}
              </button>
            </div>
          </form>
        </div>

        {/* TENANT AUDIT TIMELINE STREAM */}
        <div className={styles.glassPanelCard}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <Activity size={20} className={styles.panelIcon} />
              <div>
                <h3 className={styles.panelTitle}>Tenant Audit & Event Log</h3>
                <p className={styles.panelSubtitle}>Recent configuration changes and system security events.</p>
              </div>
            </div>
          </div>

          <div className={styles.activityTimeline}>
            {org.recentActivity.map((act) => (
              <div key={act.id} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineEvent}>{act.event}</p>
                  <span className={styles.timelineTime}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REGENERATE API KEY MODAL */}
      {isRegenModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <Key size={20} className={styles.modalIconRose} />
                <h3>Regenerate Live API Key</h3>
              </div>
              <button onClick={() => setIsRegenModalOpen(false)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.warningDesc}>
                Warning: Regenerating the API Key will immediately invalidate the existing key for{" "}
                <strong>{org.name}</strong>. Any live production integrations using the old key will stop working until updated.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setIsRegenModalOpen(false)} className={styles.btnCancel}>
                Cancel
              </button>
              <button
                onClick={handleRegenerateKey}
                disabled={regeneratingKey}
                className={styles.btnConfirmRose}
              >
                {regeneratingKey ? "Regenerating..." : "Confirm & Regenerate Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND / REACTIVATE CONFIRMATION MODAL */}
      {isSuspendModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <AlertCircle size={20} className={styles.modalIconRose} />
                <h3>
                  {org.status === "Active" ? "Suspend Organization" : "Reactivate Organization"}
                </h3>
              </div>
              <button onClick={() => setIsSuspendModalOpen(false)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.warningDesc}>
                Are you sure you want to {org.status === "Active" ? "suspend" : "reactivate"}{" "}
                <strong>{org.name}</strong>?
                {org.status === "Active" &&
                  " Suspended organizations will have all active execution agents paused and API authentication blocked."}
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setIsSuspendModalOpen(false)} className={styles.btnCancel}>
                Cancel
              </button>
              <button
                onClick={handleToggleSuspend}
                className={org.status === "Active" ? styles.btnConfirmRose : styles.btnConfirmGreen}
              >
                Confirm {org.status === "Active" ? "Suspension" : "Reactivation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
