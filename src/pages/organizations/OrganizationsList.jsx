import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpDown,
  Mail,
  Zap,
  Clock,
  X,
  Sparkles,
  Key
} from "lucide-react";
import {
  fetchOrganizations,
  provisionOrganization,
  toggleOrganizationStatus,
  deleteOrganization
} from "../../services/organizationService";
import { useToast } from "../../context/ToastContext";
import styles from "./OrganizationsList.module.css";

export default function OrganizationsList() {
  const toast = useToast();
  const navigate = useNavigate();

  // State
  const [organizations, setOrganizations] = useState([]);
  const [stats, setStats] = useState({ totalOrgs: 0, activeOrgs: 0, suspendedOrgs: 0, totalMinutesUsed: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Provisioning Modal State
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Profile, 2: Plan & Quotas
  const [provisionForm, setProvisionForm] = useState({
    name: "",
    adminEmail: "",
    plan: "Enterprise",
    concurrentSlots: 50,
    monthlyMinutesQuota: 50000,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Load Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchOrganizations({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        plan: planFilter,
        sortBy,
        sortOrder,
      });

      setOrganizations(res.data);
      setTotalPages(res.totalPages);
      setStats(res.stats);
    } catch (err) {
      toast.error("Failed to load organizations: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, planFilter, sortBy, sortOrder, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle Suspend Status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated = await toggleOrganizationStatus(id);
      toast.success(
        `Organization status changed to ${updated.status}`,
        updated.status === "Active" ? "Tenant Reactivated" : "Tenant Suspended"
      );
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete Organization
  const handleDeleteOrg = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete organization "${name}"?`)) return;
    try {
      await deleteOrganization(id);
      toast.warning(`Deleted organization "${name}"`, "Tenant Removed");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Provisioning Modal Form Validation
  const validateFormStep1 = () => {
    const errors = {};
    if (!provisionForm.name || provisionForm.name.trim().length < 2) {
      errors.name = "Company name must be at least 2 characters.";
    }
    if (!provisionForm.adminEmail || !provisionForm.adminEmail.includes("@")) {
      errors.adminEmail = "Please enter a valid email address.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateFormStep1()) {
      setModalStep(2);
    }
  };

  const handleSubmitProvision = async (e) => {
    e.preventDefault();
    if (!validateFormStep1()) return;

    try {
      setSubmitting(true);
      const newOrg = await provisionOrganization(provisionForm);
      toast.success(`Organization "${newOrg.name}" provisioned successfully!`, "Tenant Provisioned");
      setIsProvisionModalOpen(false);
      setProvisionForm({
        name: "",
        adminEmail: "",
        plan: "Enterprise",
        concurrentSlots: 50,
        monthlyMinutesQuota: 50000,
      });
      setModalStep(1);
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Client Organization & Tenant Management</h1>
          <p className={styles.pageSubtitle}>
            Provision, monitor, and manage multi-tenant enterprise organizations and compute quotas.
          </p>
        </div>

        <button
          onClick={() => setIsProvisionModalOpen(true)}
          className={styles.btnProvisionCta}
        >
          <Plus size={16} />
          <span>Provision Tenant Organization</span>
        </button>
      </div>

      {/* 2. SUMMARY STATS CARDS (4 CARDS) */}
      <div className={styles.statsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statIconBoxViolet}>
            <Building2 size={22} />
          </div>
          <div>
            <span className={styles.statLabel}>Total Organizations</span>
            <h2 className={styles.statValue}>{stats.totalOrgs}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconBoxGreen}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className={styles.statLabel}>Active Tenants</span>
            <h2 className={styles.statValue}>{stats.activeOrgs}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconBoxRose}>
            <AlertCircle size={22} />
          </div>
          <div>
            <span className={styles.statLabel}>Suspended Tenants</span>
            <h2 className={styles.statValue}>{stats.suspendedOrgs}</h2>
          </div>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statIconBoxCyan}>
            <Clock size={22} />
          </div>
          <div>
            <span className={styles.statLabel}>Monthly Minutes Consumed</span>
            <h2 className={styles.statValue}>{stats.totalMinutesUsed.toLocaleString()} mins</h2>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className={styles.glassToolbarCard}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by company, email, or tenant ID..."
            className={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} className={styles.btnClearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterControls}>
          {/* Status Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Status:</span>
            {["ALL", "Active", "Suspended"].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`${styles.filterPill} ${statusFilter === st ? styles.filterPillActive : ""}`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Plan Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Plan:</span>
            {["ALL", "Enterprise", "Pro", "Starter"].map((pl) => (
              <button
                key={pl}
                onClick={() => { setPlanFilter(pl); setPage(1); }}
                className={`${styles.filterPill} ${planFilter === pl ? styles.filterPillActive : ""}`}
              >
                {pl}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className={styles.sortSelectWrapper}>
            <ArrowUpDown size={14} className={styles.sortIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="createdAt">Sort: Registration Date</option>
              <option value="name">Sort: Company Name</option>
              <option value="monthlyMinutesUsed">Sort: Minutes Consumed</option>
              <option value="concurrentSlots">Sort: Concurrent Slots</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PAGINATED GLASS DATA TABLE */}
      <div className={styles.glassTableWrapper}>
        <table className={styles.glassTable}>
          <thead>
            <tr>
              <th>Company Name & ID</th>
              <th>Subscription Plan</th>
              <th>Concurrent Slots</th>
              <th>Monthly Minutes Used</th>
              <th>Status</th>
              <th className={styles.alignRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.loadingTd}>
                  <div className={styles.loadingSpinner} /> Loading tenant organization data...
                </td>
              </tr>
            ) : organizations.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyTd}>
                  <Building2 size={36} className={styles.emptyIcon} />
                  <p>No tenant organizations found matching search criteria.</p>
                </td>
              </tr>
            ) : (
              organizations.map((org) => {
                const usagePct = Math.min(
                  100,
                  Math.round((org.monthlyMinutesUsed / org.monthlyMinutesQuota) * 100)
                );

                return (
                  <tr key={org.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.orgCell}>
                        <div className={styles.orgAvatar}>
                          {org.name[0]?.toUpperCase()}
                        </div>
                        <div className={styles.orgMeta}>
                          <div className={styles.orgNameRow}>
                            <span className={styles.orgName}>{org.name}</span>
                            <span className={styles.orgIdTag}>{org.id}</span>
                          </div>
                          <span className={styles.orgAdminEmail}>{org.adminEmail}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`${styles.planBadge} ${styles[`plan_${org.plan}`]}`}>
                        {org.plan} Tier
                      </span>
                    </td>

                    <td>
                      <div className={styles.slotsCell}>
                        <Zap size={14} className={styles.slotsIcon} />
                        <span className={styles.slotsVal}>{org.concurrentSlots} Slots</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.usageCell}>
                        <div className={styles.usageTextRow}>
                          <span className={styles.usageMins}>
                            {org.monthlyMinutesUsed.toLocaleString()} mins
                          </span>
                          <span className={styles.usagePct}>{usagePct}%</span>
                        </div>
                        <div className={styles.usageTrack}>
                          <div
                            className={
                              usagePct > 90
                                ? styles.usageFillRose
                                : usagePct > 75
                                ? styles.usageFillAmber
                                : styles.usageFillCyan
                            }
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${org.status}`]}`}>
                        <span className={org.status === "Active" ? styles.dotGreen : styles.dotRose} />
                        {org.status}
                      </span>
                    </td>

                    <td className={styles.alignRight}>
                      <div className={styles.actionsRow}>
                        <button
                          onClick={() => navigate(`/organizations/${org.id}`)}
                          className={styles.btnActionIcon}
                          title="Inspect Details"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(org.id, org.status)}
                          className={styles.btnActionIcon}
                          title={org.status === "Active" ? "Suspend Organization" : "Reactivate Organization"}
                        >
                          {org.status === "Active" ? (
                            <AlertCircle size={15} className={styles.iconRose} />
                          ) : (
                            <CheckCircle2 size={15} className={styles.iconGreen} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteOrg(org.id, org.name)}
                          className={styles.btnActionIcon}
                          title="Delete Organization"
                        >
                          <Trash2 size={15} className={styles.iconRose} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PAGINATION BAR */}
        <div className={styles.paginationBar}>
          <div className={styles.paginationInfo}>
            <span>Showing page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className={styles.limitSelect}
            >
              <option value={5}>5 rows per page</option>
              <option value={10}>10 rows per page</option>
              <option value={20}>20 rows per page</option>
            </select>
          </div>

          <div className={styles.paginationButtons}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={styles.btnPage}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={styles.btnPage}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. STEP-BY-STEP TENANT PROVISIONING GLASS MODAL */}
      {isProvisionModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <Building2 size={20} className={styles.modalIcon} />
                <h3>Provision New Organization</h3>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className={styles.btnCloseModal}
              >
                <X size={18} />
              </button>
            </div>

            {/* STEP PROGRESS INDICATOR */}
            <div className={styles.stepProgressBar}>
              <div className={`${styles.stepPill} ${modalStep === 1 ? styles.stepActive : styles.stepDone}`}>
                <span>1. Organization Profile</span>
              </div>
              <div className={`${styles.stepPill} ${modalStep === 2 ? styles.stepActive : ""}`}>
                <span>2. Plan Tier & Quotas</span>
              </div>
            </div>

            <form onSubmit={handleSubmitProvision} className={styles.modalForm}>
              {modalStep === 1 && (
                <div className={styles.stepBody}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Company Name *</label>
                    <input
                      type="text"
                      value={provisionForm.name}
                      onChange={(e) => setProvisionForm({ ...provisionForm, name: e.target.value })}
                      placeholder="e.g. Apex Cognitive Systems"
                      className={`${styles.glassInput} ${formErrors.name ? styles.inputError : ""}`}
                    />
                    {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Primary Admin Email *</label>
                    <input
                      type="email"
                      value={provisionForm.adminEmail}
                      onChange={(e) => setProvisionForm({ ...provisionForm, adminEmail: e.target.value })}
                      placeholder="e.g. admin@apexcognitive.com"
                      className={`${styles.glassInput} ${formErrors.adminEmail ? styles.inputError : ""}`}
                    />
                    {formErrors.adminEmail && <span className={styles.errorText}>{formErrors.adminEmail}</span>}
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className={styles.stepBody}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Subscription Plan Tier</label>
                    <select
                      value={provisionForm.plan}
                      onChange={(e) => setProvisionForm({ ...provisionForm, plan: e.target.value })}
                      className={styles.glassSelect}
                    >
                      <option value="Enterprise">Enterprise Tier (Unlimited Slots & Full API)</option>
                      <option value="Pro">Pro Tier (Up to 50 Concurrent Slots)</option>
                      <option value="Starter">Starter Tier (Up to 15 Slots)</option>
                    </select>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Concurrent Slots</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={provisionForm.concurrentSlots}
                        onChange={(e) => setProvisionForm({ ...provisionForm, concurrentSlots: e.target.value })}
                        className={styles.glassInput}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Monthly Minutes Quota</label>
                      <input
                        type="number"
                        min={1000}
                        step={5000}
                        value={provisionForm.monthlyMinutesQuota}
                        onChange={(e) => setProvisionForm({ ...provisionForm, monthlyMinutesQuota: e.target.value })}
                        className={styles.glassInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.modalFooter}>
                {modalStep === 2 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className={styles.btnBack}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={styles.btnSubmit}
                    >
                      {submitting ? "Provisioning..." : "Complete Provisioning"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={styles.btnNext}
                  >
                    Next Step →
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
