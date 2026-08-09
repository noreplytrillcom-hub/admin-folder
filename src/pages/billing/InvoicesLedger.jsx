import { useState, useEffect, useCallback } from "react";
import {
  Receipt,
  DollarSign,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  X,
  Send
} from "lucide-react";
import { fetchInvoicesData, recordManualPayment } from "../../services/invoicingService";
import { useToast } from "../../context/ToastContext";
import styles from "./InvoicesLedger.module.css";

export default function InvoicesLedger() {
  const toast = useToast();

  const [invoices, setInvoices] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCollectedUsd: 0,
    pendingReceivablesUsd: 0,
    overdueReceivablesUsd: 0,
    overdueInvoiceCount: 0,
    failedChargeRetriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filter & Pagination State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Payment Recording Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "ach_wire",
    transactionReference: "",
    notes: "",
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

  // Fetch Invoices
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchInvoicesData({
        page,
        limit,
        search: debouncedSearch,
        statusFilter,
      });

      setInvoices(res.data);
      setTotalPages(res.totalPages);
      setMetrics(res.metrics);
    } catch (err) {
      toast.error("Failed to load invoice directory: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Record Payment Modal
  const handleOpenPaymentModal = (inv) => {
    setSelectedInvoice(inv);
    setPaymentForm({
      paymentMethod: "ach_wire",
      transactionReference: `WIRE-${Date.now().toString().slice(-6)}`,
      notes: "Manual settlement recorded by Super-Admin finance operator.",
    });
  };

  // Submit Payment Settlement
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      setSubmitting(true);
      await recordManualPayment({
        invoiceId: selectedInvoice.id,
        organizationId: selectedInvoice.organizationId,
        amountUsd: selectedInvoice.totalUsd,
        ...paymentForm,
      });

      toast.success(
        `Invoice ${selectedInvoice.invoiceNumber} marked as PAID`,
        `Payment reference: ${paymentForm.transactionReference}`
      );
      setSelectedInvoice(null);
      loadData();
    } catch (err) {
      toast.error("Failed to record payment: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>Invoicing Directory & Payments Ledger</h1>
          <p className={styles.pageSubtitle}>
            Track tenant billing invoices, wire payments, overdue aging, and manual settlement transactions.
          </p>
        </div>
      </div>

      {/* 2. REAL-TIME FINANCIAL SUMMARY CARDS */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Revenue Settled</span>
            <div className={styles.iconBoxGreen}><DollarSign size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.totalCollectedUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>Paid across active SaaS contracts</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Pending Receivables</span>
            <div className={styles.iconBoxCyan}><Clock size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.pendingReceivablesUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>Awaiting scheduled payout</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Overdue Receivables</span>
            <div className={styles.iconBoxRose}><AlertTriangle size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.overdueReceivablesUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>{metrics.overdueInvoiceCount} Overdue Invoices Aging</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Failed Charge Retries</span>
            <div className={styles.iconBoxIndigo}><CreditCard size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.failedChargeRetriesCount} Retries</h2>
          <p className={styles.statSub}>Payment gateway retries queued</p>
        </div>
      </div>

      {/* 3. SEARCH & STATUS FILTER TOOLBAR */}
      <div className={styles.glassToolbarCard}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Invoice #, Tenant Name, or Email..."
            className={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} className={styles.btnClearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterPillsRow}>
          <span className={styles.filterLabel}>Payment Status:</span>
          {["ALL", "PAID", "PENDING", "OVERDUE", "FAILED"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`${styles.filterPill} ${statusFilter === s ? styles.filterPillActive : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PAGINATED INVOICING DIRECTORY TABLE */}
      <div className={styles.glassTableWrapper}>
        <table className={styles.glassTable}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Tenant Organization</th>
              <th>Total USD</th>
              <th>Payment Status</th>
              <th>Due Date</th>
              <th>Paid Timestamp</th>
              <th className={styles.alignRight}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className={styles.loadingTd}>Loading invoices ledger...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={7} className={styles.emptyTd}>No invoices match current search filter.</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.invNumberCell}>
                      <code>{inv.invoiceNumber}</code>
                      {inv.stripeInvoiceId && <span className={styles.stripeTag}>{inv.stripeInvoiceId}</span>}
                    </div>
                  </td>

                  <td>
                    <div className={styles.tenantCell}>
                      <span className={styles.tenantName}>{inv.organizationName}</span>
                      <span className={styles.tenantEmail}>{inv.adminEmail}</span>
                    </div>
                  </td>

                  <td>
                    <span className={styles.amountVal}>${inv.totalUsd.toLocaleString()} USD</span>
                  </td>

                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status_${inv.status}`]}`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span className={styles.dateVal}>{inv.dueDate}</span>
                  </td>

                  <td>
                    <span className={styles.dateVal}>{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "—"}</span>
                  </td>

                  <td className={styles.alignRight}>
                    {inv.status !== "paid" && (
                      <button
                        onClick={() => handleOpenPaymentModal(inv)}
                        className={styles.btnRecordPayment}
                      >
                        <Receipt size={14} /> Record Payment
                      </button>
                    )}
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

      {/* 5. RECORD MANUAL PAYMENT MODAL */}
      {selectedInvoice && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalGlassCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <Receipt size={20} className={styles.modalIcon} />
                <div>
                  <h3>Record Offline Manual Payment</h3>
                  <p className={styles.modalSub}>Invoice: {selectedInvoice.invoiceNumber} • Tenant: {selectedInvoice.organizationName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className={styles.btnCloseModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitPayment} className={styles.modalForm}>
              <div className={styles.amountBanner}>
                <span>Settlement Amount:</span>
                <strong>${selectedInvoice.totalUsd.toLocaleString()} USD</strong>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Payment Channel / Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className={styles.glassSelect}
                >
                  <option value="ach_wire">ACH / Wire Transfer</option>
                  <option value="stripe_cc">Stripe Credit Card Manual Charge</option>
                  <option value="manual_credit">Goodwill Credit Override</option>
                  <option value="wire_transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Transaction Reference # / Bank Wire ID</label>
                <input
                  type="text"
                  required
                  value={paymentForm.transactionReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
                  className={styles.glassInput}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Internal Audit Notes</label>
                <textarea
                  rows={3}
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className={styles.glassTextarea}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setSelectedInvoice(null)} className={styles.btnCancel}>Cancel</button>
                <button type="submit" disabled={submitting} className={styles.btnSubmit}>
                  {submitting ? "Settling..." : "Settle Invoice Paid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
