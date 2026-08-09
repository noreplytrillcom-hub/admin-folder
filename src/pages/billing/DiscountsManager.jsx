import { useState, useEffect, useCallback } from "react";
import {
  Tag,
  DollarSign,
  Gift,
  ShieldCheck,
  Plus,
  Building2,
  Percent,
  Clock,
  Sparkles,
  X,
  FileCheck2
} from "lucide-react";
import { fetchDiscountsData, issueServiceCredit } from "../../services/discountsService";
import { useToast } from "../../context/ToastContext";
import styles from "./DiscountsManager.module.css";

export default function DiscountsManager() {
  const toast = useToast();

  const [coupons, setCoupons] = useState([]);
  const [credits, setCredits] = useState([]);
  const [metrics, setMetrics] = useState({
    activeCouponsCount: 0,
    totalRedeemedSavingsUsd: 0,
    tenantActiveCreditsBalanceUsd: 0,
    creditsIssuedLast30dUsd: 0,
  });

  const [activeTab, setActiveTab] = useState("credits"); // 'credits' | 'coupons'
  const [loading, setLoading] = useState(true);

  // Issue Credit Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [creditForm, setCreditForm] = useState({
    organizationId: "org-102",
    amountUsd: 250,
    reason: "goodwill",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchDiscountsData();
      setCoupons(res.coupons);
      setCredits(res.serviceCredits);
      setMetrics(res.metrics);
    } catch (err) {
      toast.error("Failed to load credits & discounts: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitCredit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await issueServiceCredit(creditForm);
      toast.success(
        `Issued $${creditForm.amountUsd} Service Credit`,
        `Reason: ${creditForm.reason.replace(/_/g, " ").toUpperCase()}`
      );
      setShowIssueModal(false);
      loadData();
    } catch (err) {
      toast.error("Failed to issue service credit: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Service Credits & Promotional Discounts</h1>
          <p className={styles.pageSubtitle}>
            Issue goodwill SLA service credits, manage promo coupon codes, and track redemption progress.
          </p>
        </div>

        <button onClick={() => setShowIssueModal(true)} className={styles.btnIssueCredit}>
          <Plus size={16} /> <span>Issue Service Credit</span>
        </button>
      </div>

      {/* 2. REAL-TIME SUMMARY KPI CARDS */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Promo Coupons</span>
            <div className={styles.iconBoxViolet}><Tag size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.activeCouponsCount} Active Codes</h2>
          <p className={styles.statSub}>Across marketing & enterprise campaigns</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Redeemed Savings</span>
            <div className={styles.iconBoxGreen}><DollarSign size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.totalRedeemedSavingsUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>Granted via coupon redemptions</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Tenant Active Credits Balance</span>
            <div className={styles.iconBoxCyan}><Gift size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.tenantActiveCreditsBalanceUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>Available balance on tenant ledgers</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Credits Issued (Last 30D)</span>
            <div className={styles.iconBoxIndigo}><ShieldCheck size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.creditsIssuedLast30dUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>Goodwill & SLA compensation grants</p>
        </div>
      </div>

      {/* 3. TAB NAVIGATION */}
      <div className={styles.glassTabCard}>
        <div className={styles.tabList}>
          <button
            onClick={() => setActiveTab("credits")}
            className={`${styles.tabBtn} ${activeTab === "credits" ? styles.tabActive : ""}`}
          >
            <Gift size={15} /> Service Credits Ledger
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`${styles.tabBtn} ${activeTab === "coupons" ? styles.tabActive : ""}`}
          >
            <Tag size={15} /> Promotional Coupons
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENT: SERVICE CREDITS LEDGER */}
      {activeTab === "credits" && (
        <div className={styles.sectionCard}>
          <div className={styles.glassTableWrapper}>
            <table className={styles.glassTable}>
              <thead>
                <tr>
                  <th>Tenant Organization</th>
                  <th>Granted Amount</th>
                  <th>Remaining Balance</th>
                  <th>Reason</th>
                  <th>Issued By</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className={styles.loadingTd}>Loading service credits...</td></tr>
                ) : credits.length === 0 ? (
                  <tr><td colSpan={6} className={styles.emptyTd}>No tenant service credits issued.</td></tr>
                ) : (
                  credits.map((cred) => (
                    <tr key={cred.id} className={styles.tableRow}>
                      <td>
                        <div className={styles.tenantCell}>
                          <span className={styles.tenantName}>{cred.organizationName}</span>
                          <span className={styles.tenantIdTag}>{cred.organizationId}</span>
                        </div>
                      </td>

                      <td><span className={styles.valBold}>${cred.amountUsd.toLocaleString()} USD</span></td>

                      <td>
                        <span className={cred.balanceRemainingUsd > 0 ? styles.valGreen : styles.valMuted}>
                          ${cred.balanceRemainingUsd.toLocaleString()} USD
                        </span>
                      </td>

                      <td>
                        <span className={styles.reasonBadge}>
                          {cred.reason.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>

                      <td><span className={styles.valSub}>{cred.issuedByAdminEmail}</span></td>
                      <td><span className={styles.valSub}>{cred.expiresAt}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: PROMOTIONAL COUPONS */}
      {activeTab === "coupons" && (
        <div className={styles.sectionCard}>
          <div className={styles.glassTableWrapper}>
            <table className={styles.glassTable}>
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount Rate</th>
                  <th>Redemption Progress</th>
                  <th>Expiration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className={styles.loadingTd}>Loading promotional coupons...</td></tr>
                ) : coupons.length === 0 ? (
                  <tr><td colSpan={5} className={styles.emptyTd}>No promotional coupons found.</td></tr>
                ) : (
                  coupons.map((c) => {
                    const pct = Math.round((c.currentRedemptions / c.maxRedemptions) * 100);
                    return (
                      <tr key={c.id} className={styles.tableRow}>
                        <td>
                          <code className={styles.couponCode}>{c.code}</code>
                        </td>

                        <td>
                          <span className={styles.discountBadge}>
                            {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} USD OFF`}
                          </span>
                        </td>

                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progressText}>
                              <span>{c.currentRedemptions} / {c.maxRedemptions} redeemed</span>
                              <strong>{pct}%</strong>
                            </div>
                            <div className={styles.progressTrack}>
                              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>

                        <td><span className={styles.valSub}>{c.expiresAt}</span></td>

                        <td>
                          <span className={c.isActive ? styles.statusActive : styles.statusDisabled}>
                            {c.isActive ? "ACTIVE" : "DISABLED"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. ISSUE SERVICE CREDIT MODAL */}
      {showIssueModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <Gift size={20} className={styles.modalIcon} />
                <h3>Issue Tenant Service Credit</h3>
              </div>
              <button onClick={() => setShowIssueModal(false)} className={styles.btnCloseModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitCredit} className={styles.modalForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Target Tenant Organization</label>
                <select
                  value={creditForm.organizationId}
                  onChange={(e) => setCreditForm({ ...creditForm, organizationId: e.target.value })}
                  className={styles.glassSelect}
                >
                  <option value="org-101">Apex Cognitive Systems (org-101)</option>
                  <option value="org-102">Acme Cloud Solutions (org-102)</option>
                  <option value="org-103">Vortex Data Labs (org-103)</option>
                  <option value="org-104">Hyperion AI Networks (org-104)</option>
                  <option value="org-105">Synthetix Dynamics (org-105)</option>
                </select>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Credit Amount ($ USD)</label>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    required
                    value={creditForm.amountUsd}
                    onChange={(e) => setCreditForm({ ...creditForm, amountUsd: e.target.value })}
                    className={styles.glassInput}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Grant Reason Category</label>
                  <select
                    value={creditForm.reason}
                    onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                    className={styles.glassSelect}
                  >
                    <option value="sla_breach_compensation">SLA Breach Compensation</option>
                    <option value="goodwill">Customer Goodwill</option>
                    <option value="beta_testing_grant">Beta Testing Grant</option>
                    <option value="overbill_refund">Overbill Refund</option>
                    <option value="promotional">Promotional Credit</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Internal Audit Notes</label>
                <textarea
                  rows={3}
                  value={creditForm.notes}
                  onChange={(e) => setCreditForm({ ...creditForm, notes: e.target.value })}
                  placeholder="Provide rationale for compliance audit logging..."
                  className={styles.glassTextarea}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowIssueModal(false)} className={styles.btnCancel}>Cancel</button>
                <button type="submit" disabled={submitting} className={styles.btnSubmit}>
                  {submitting ? "Issuing..." : "Confirm & Issue Credit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
