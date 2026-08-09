import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Search,
  DollarSign,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  X,
  Building2,
  AlertCircle
} from "lucide-react";
import { fetchSubscriptionsData, updateSubscriptionPlan } from "../../services/subscriptionService";
import { useToast } from "../../context/ToastContext";
import styles from "./SubscriptionsManager.module.css";

// Tier Preset Configuration
const TIER_PRESETS = {
  starter: {
    planTier: "starter",
    mrrAmount: 299,
    concurrentSlots: 15,
    monthlyMinutesQuota: 15000,
    slaGuarantee: "99.5%",
  },
  growth: {
    planTier: "growth",
    mrrAmount: 899,
    concurrentSlots: 50,
    monthlyMinutesQuota: 50000,
    slaGuarantee: "99.9%",
  },
  enterprise: {
    planTier: "enterprise",
    mrrAmount: 2499,
    concurrentSlots: 100,
    monthlyMinutesQuota: 250000,
    slaGuarantee: "99.99%",
  },
  custom: {
    planTier: "custom",
    mrrAmount: 3500,
    concurrentSlots: 150,
    monthlyMinutesQuota: 500000,
    slaGuarantee: "99.99%",
  },
};

export default function SubscriptionsManager() {
  const toast = useToast();

  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalMrr: 0,
    activeSubscriptionsCount: 0,
    starterCount: 0,
    growthCount: 0,
    enterpriseCount: 0,
    customCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Management State
  const [selectedSub, setSelectedSub] = useState(null);
  const [manageForm, setManageForm] = useState({
    planTier: "growth",
    mrrAmount: 899,
    concurrentSlots: 50,
    monthlyMinutesQuota: 50000,
    slaGuarantee: "99.9%",
  });
  const [submitting, setSubmitting] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Subscriptions Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSubscriptionsData({
        page,
        limit,
        search: debouncedSearch,
        tier: tierFilter,
      });

      setSubscriptions(res.data);
      setTotalPages(res.totalPages);
      setMetrics(res.metrics);
    } catch (err) {
      toast.error("Failed to load subscription plans: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, tierFilter, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Manage Modal with initial target values
  const handleOpenManageModal = (sub) => {
    setSelectedSub(sub);
    setManageForm({
      planTier: sub.planTier,
      mrrAmount: sub.mrrAmount,
      concurrentSlots: sub.concurrentSlots,
      monthlyMinutesQuota: sub.monthlyMinutesQuota,
      slaGuarantee: sub.slaGuarantee,
    });
  };

  // Apply Tier Preset helper
  const handleSelectPreset = (presetKey) => {
    const preset = TIER_PRESETS[presetKey];
    if (preset) {
      setManageForm({ ...preset });
    }
  };

  // Save Subscription Override
  const handleSubmitOverride = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      setSubmitting(true);
      await updateSubscriptionPlan({
        subscriptionId: selectedSub.id,
        organizationId: selectedSub.organizationId,
        ...manageForm,
      });

      toast.success(
        `Subscription updated for "${selectedSub.organizationName}"`,
        `Plan set to ${manageForm.planTier.toUpperCase()}`
      );
      setSelectedSub(null);
      loadData();
    } catch (err) {
      toast.error("Failed to update subscription: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Subscription Plans & Custom Contract Overrides</h1>
          <p className={styles.pageSubtitle}>
            Manage pricing tiers, custom enterprise contracts, SLAs, and compute quotas across tenants.
          </p>
        </div>
      </div>

      {/* 2. REAL-TIME METRICS CARDS */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statIconViolet}><DollarSign size={22} /></div>
          <div>
            <span className={styles.statLabel}>Total Contracted MRR</span>
            <h2 className={styles.statValue}>${metrics.totalMrr.toLocaleString()} / mo</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconGreen}><CheckCircle2 size={22} /></div>
          <div>
            <span className={styles.statLabel}>Active Subscriptions</span>
            <h2 className={styles.statValue}>{metrics.activeSubscriptionsCount} Tenants</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconCyan}><Zap size={22} /></div>
          <div>
            <span className={styles.statLabel}>Tier Breakdown</span>
            <div className={styles.tierBreakdownRow}>
              <span className={styles.tierPillSlate}>Starter: {metrics.starterCount}</span>
              <span className={styles.tierPillCyan}>Growth: {metrics.growthCount}</span>
              <span className={styles.tierPillViolet}>Ent: {metrics.enterpriseCount + metrics.customCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & TIER FILTER TOOLBAR */}
      <div className={styles.glassToolbarCard}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Tenant Name, Admin Email, or Org ID..."
            className={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} className={styles.btnClearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterPillsRow}>
          <span className={styles.filterLabel}>Plan Tier:</span>
          {["ALL", "STARTER", "GROWTH", "ENTERPRISE", "CUSTOM"].map((t) => (
            <button
              key={t}
              onClick={() => { setTierFilter(t); setPage(1); }}
              className={`${styles.filterPill} ${tierFilter === t ? styles.filterPillActive : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PAGINATED SUBSCRIPTIONS DIRECTORY TABLE */}
      <div className={styles.glassTableWrapper}>
        <table className={styles.glassTable}>
          <thead>
            <tr>
              <th>Tenant Organization</th>
              <th>Plan Tier</th>
              <th>Monthly MRR</th>
              <th>Concurrent Slots</th>
              <th>Monthly Minutes</th>
              <th>SLA Guarantee</th>
              <th>Status</th>
              <th className={styles.alignRight}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={styles.loadingTd}>Loading subscription directory...</td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyTd}>No subscriptions found matching search filter.</td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.orgCell}>
                      <div className={styles.orgAvatar}>{sub.organizationName[0]?.toUpperCase()}</div>
                      <div className={styles.orgMeta}>
                        <span className={styles.orgName}>{sub.organizationName}</span>
                        <span className={styles.orgAdminEmail}>{sub.adminEmail}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`${styles.planBadge} ${styles[`plan_${sub.planTier}`]}`}>
                      {sub.planTier.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span className={styles.mrrVal}>${sub.mrrAmount.toLocaleString()} / mo</span>
                  </td>

                  <td>
                    <div className={styles.slotsCell}>
                      <Zap size={14} className={styles.iconViolet} />
                      <span>{sub.concurrentSlots} Slots</span>
                    </div>
                  </td>

                  <td>
                    <span className={styles.minsVal}>{sub.monthlyMinutesQuota.toLocaleString()} mins</span>
                  </td>

                  <td>
                    <span className={styles.slaBadge}>{sub.slaGuarantee}</span>
                  </td>

                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status_${sub.status}`]}`}>
                      {sub.status}
                    </span>
                  </td>

                  <td className={styles.alignRight}>
                    <button
                      onClick={() => handleOpenManageModal(sub)}
                      className={styles.btnManagePlan}
                    >
                      <Sliders size={14} /> Manage Plan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION BAR */}
        <div className={styles.paginationBar}>
          <div className={styles.paginationInfo}>
            <span>Showing page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
          </div>

          <div className={styles.paginationButtons}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={styles.btnPage}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={styles.btnPage}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. PLAN OVERRIDE & MODAL DRAWER */}
      {selectedSub && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <Building2 size={20} className={styles.modalIcon} />
                <div>
                  <h3>Manage Subscription Plan</h3>
                  <p className={styles.modalSub}>Tenant: {selectedSub.organizationName} ({selectedSub.organizationId})</p>
                </div>
              </div>
              <button onClick={() => setSelectedSub(null)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitOverride} className={styles.modalForm}>
              {/* PRE-CONFIGURED PRESETS SELECTION */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Plan Tier Presets</label>
                <div className={styles.presetButtonsRow}>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("starter")}
                    className={`${styles.presetBtn} ${manageForm.planTier === "starter" ? styles.presetActive : ""}`}
                  >
                    Starter ($299/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("growth")}
                    className={`${styles.presetBtn} ${manageForm.planTier === "growth" ? styles.presetActive : ""}`}
                  >
                    Growth ($899/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("enterprise")}
                    className={`${styles.presetBtn} ${manageForm.planTier === "enterprise" ? styles.presetActive : ""}`}
                  >
                    Enterprise ($2,499/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("custom")}
                    className={`${styles.presetBtn} ${manageForm.planTier === "custom" ? styles.presetActive : ""}`}
                  >
                    Custom Override
                  </button>
                </div>
              </div>

              {/* MRR AMOUNT & CONCURRENT SLOTS */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Contracted MRR ($ / mo)</label>
                  <input
                    type="number"
                    min={0}
                    value={manageForm.mrrAmount}
                    onChange={(e) => setManageForm({ ...manageForm, mrrAmount: e.target.value })}
                    className={styles.glassInput}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Max Concurrent Agent Slots</label>
                  <input
                    type="number"
                    min={1}
                    value={manageForm.concurrentSlots}
                    onChange={(e) => setManageForm({ ...manageForm, concurrentSlots: e.target.value })}
                    className={styles.glassInput}
                  />
                </div>
              </div>

              {/* MONTHLY MINUTES & SLA GUARANTEE */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Monthly Execution Minutes</label>
                  <input
                    type="number"
                    min={1000}
                    step={5000}
                    value={manageForm.monthlyMinutesQuota}
                    onChange={(e) => setManageForm({ ...manageForm, monthlyMinutesQuota: e.target.value })}
                    className={styles.glassInput}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>SLA Guarantee</label>
                  <select
                    value={manageForm.slaGuarantee}
                    onChange={(e) => setManageForm({ ...manageForm, slaGuarantee: e.target.value })}
                    className={styles.glassSelect}
                  >
                    <option value="99.5%">99.5% Standard SLA</option>
                    <option value="99.9%">99.9% Production SLA</option>
                    <option value="99.99%">99.99% Enterprise SLA</option>
                    <option value="99.999%">99.999% Mission Critical SLA</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className={styles.btnCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.btnSubmit}
                >
                  {submitting ? "Saving..." : "Save Plan Override"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
