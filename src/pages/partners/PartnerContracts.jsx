import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Download,
  Edit3,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  HeartHandshake,
  HelpCircle,
  Key,
  Layers,
  Mail,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  UserCheck,
  Users,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./PartnerContracts.module.css";

// Initial Mock Partner Contracts Data
const INITIAL_CONTRACTS = [
  {
    id: "CNT-2026-001",
    partnerName: "Acme Cloud Solutions",
    partnerId: "PTR-1001",
    contactPerson: "Sarah Jenkins",
    contactEmail: "sarah.j@acmecloud.io",
    contactPhone: "+1 (555) 234-5678",
    contractTitle: "Master Services & SLA Agreement v3.1",
    contractType: "Master Services Agreement (MSA)",
    contractValue: "$120,000 / yr",
    rawNumericValue: 120000,
    status: "Active",
    startDate: "2026-01-15",
    endDate: "2027-01-14",
    slaTier: "99.99% Platinum SLA",
    paymentTerms: "Annual Prepaid",
    partnerSigned: true,
    adminSigned: true,
    signedDate: "2026-01-14",
    docName: "Acme_MSA_Executed_v3.1.pdf",
    termsNotes: "Includes dedicated GPU inference cluster and 15-minute emergency response SLA."
  },
  {
    id: "CNT-2026-002",
    partnerName: "Apex Cognitive Systems",
    partnerId: "PTR-1002",
    contactPerson: "Dr. Elena Vance",
    contactEmail: "e.vance@apexcognitive.ai",
    contactPhone: "+1 (555) 890-1234",
    contractTitle: "Enterprise AI Partner Agreement & Custom SLA",
    contractType: "Enterprise Partner License",
    contractValue: "$240,000 / yr",
    rawNumericValue: 240000,
    status: "Pending Signature",
    startDate: "2026-08-01",
    endDate: "2028-07-31",
    slaTier: "99.99% Platinum SLA",
    paymentTerms: "Net 30",
    partnerSigned: true,
    adminSigned: false,
    signedDate: "Awaiting Admin E-Sign",
    docName: "Apex_Enterprise_Agreement_Draft.pdf",
    termsNotes: "Requires custom PII redaction guardrails and 100M monthly token cap."
  },
  {
    id: "CNT-2026-003",
    partnerName: "Nexus Cybernetics",
    partnerId: "PTR-1003",
    contactPerson: "Marcus Brody",
    contactEmail: "m.brody@nexuscyber.com",
    contactPhone: "+44 20 7946 0912",
    contractTitle: "Data Processing & Security Addendum (DPA)",
    contractType: "Data Processing Agreement (DPA)",
    contractValue: "$85,000 / yr",
    rawNumericValue: 85000,
    status: "Active",
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    slaTier: "99.9% Gold SLA",
    paymentTerms: "Quarterly Invoice",
    partnerSigned: true,
    adminSigned: true,
    signedDate: "2026-02-28",
    docName: "Nexus_Security_DPA_2026.pdf",
    termsNotes: "EU GDPR compliance framework with zero data retention clause."
  },
  {
    id: "CNT-2026-004",
    partnerName: "Vortex Data Labs",
    partnerId: "PTR-1004",
    contactPerson: "Rachel Qi",
    contactEmail: "rachel@vortexlabs.dev",
    contactPhone: "+1 (555) 432-8765",
    contractTitle: "AI Testing Suite Channel Partner Contract",
    contractType: "Channel Reseller Agreement",
    contractValue: "$150,000 / yr",
    rawNumericValue: 150000,
    status: "In Review",
    startDate: "2026-09-01",
    endDate: "2027-08-31",
    slaTier: "Standard 99.5% SLA",
    paymentTerms: "Net 60",
    partnerSigned: false,
    adminSigned: false,
    signedDate: "Legal Reviewing",
    docName: "Vortex_Reseller_Draft_v1.2.pdf",
    termsNotes: "White-label telemetry integration add-on under legal review."
  },
  {
    id: "CNT-2026-005",
    partnerName: "Synapse Dynamics",
    partnerId: "PTR-1005",
    contactPerson: "Liam O'Connor",
    contactEmail: "liam@synapse.ie",
    contactPhone: "+353 1 496 0123",
    contractTitle: "Plumm Core Licensing & Maintenance SLA",
    contractType: "Software License Agreement",
    contractValue: "$64,000 / yr",
    rawNumericValue: 64000,
    status: "Active",
    startDate: "2025-10-01",
    endDate: "2026-09-30",
    slaTier: "99.9% Gold SLA",
    paymentTerms: "Monthly Direct Debit",
    partnerSigned: true,
    adminSigned: true,
    signedDate: "2025-09-29",
    docName: "Synapse_Core_License_Signed.pdf",
    termsNotes: "Auto-renewable annual contract with 30-day notice window."
  }
];

export default function PartnerContracts() {
  // Main Contracts List State
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Active Menu / Modal States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [viewingContract, setViewingContract] = useState(null);
  const [toast, setToast] = useState(null);

  // New / Edit Form State
  const [formData, setFormData] = useState({
    partnerName: "",
    partnerId: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    contractTitle: "",
    contractType: "Master Services Agreement (MSA)",
    contractValue: "",
    startDate: "2026-08-15",
    endDate: "2027-08-14",
    slaTier: "99.99% Platinum SLA",
    paymentTerms: "Net 30",
    status: "Pending Signature",
    termsNotes: "",
    attachedFile: null
  });

  // Filtered Contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch =
        c.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  // Aggregate Stats
  const totalARR = useMemo(() => {
    return contracts.reduce((sum, c) => sum + (c.rawNumericValue || 0), 0);
  }, [contracts]);

  const activeCount = useMemo(() => {
    return contracts.filter((c) => c.status === "Active").length;
  }, [contracts]);

  const pendingCount = useMemo(() => {
    return contracts.filter((c) => c.status === "Pending Signature" || c.status === "In Review").length;
  }, [contracts]);

  // Trigger Toast Notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      partnerName: "",
      partnerId: `PTR-${1000 + contracts.length + 1}`,
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      contractTitle: "Master Services & SLA Agreement 2026",
      contractType: "Master Services Agreement (MSA)",
      contractValue: "120000",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: "2027-08-15",
      slaTier: "99.99% Platinum SLA",
      paymentTerms: "Net 30",
      status: "Pending Signature",
      termsNotes: "Standard enterprise terms with 24/7 SLA and zero data retention compliance.",
      attachedFile: null
    });
    setEditingContract(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal with Pre-populated Data
  const handleOpenEditModal = (contract) => {
    setActiveMenuId(null);
    setEditingContract(contract);
    setFormData({
      partnerName: contract.partnerName,
      partnerId: contract.partnerId,
      contactPerson: contract.contactPerson,
      contactEmail: contract.contactEmail,
      contactPhone: contract.contactPhone,
      contractTitle: contract.contractTitle,
      contractType: contract.contractType,
      contractValue: contract.rawNumericValue.toString(),
      startDate: contract.startDate,
      endDate: contract.endDate,
      slaTier: contract.slaTier,
      paymentTerms: contract.paymentTerms,
      status: contract.status,
      termsNotes: contract.termsNotes || "",
      attachedFile: null
    });
    setIsCreateModalOpen(true);
  };

  // Submit Form (Create or Edit)
  const handleSubmitContract = (e) => {
    e.preventDefault();
    if (!formData.partnerName || !formData.contactPerson || !formData.contactEmail) {
      alert("Please fill in required fields: Partner Name, Contact Person, and Email.");
      return;
    }

    const numericVal = parseInt(formData.contractValue, 10) || 50000;
    const formattedVal = `$${numericVal.toLocaleString()} / yr`;

    if (editingContract) {
      // Update existing contract
      setContracts((prev) =>
        prev.map((c) =>
          c.id === editingContract.id
            ? {
                ...c,
                partnerName: formData.partnerName,
                contactPerson: formData.contactPerson,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                contractTitle: formData.contractTitle,
                contractType: formData.contractType,
                contractValue: formattedVal,
                rawNumericValue: numericVal,
                startDate: formData.startDate,
                endDate: formData.endDate,
                slaTier: formData.slaTier,
                paymentTerms: formData.paymentTerms,
                status: formData.status,
                termsNotes: formData.termsNotes
              }
            : c
        )
      );
      showToast(`Contract ${editingContract.id} updated successfully!`, "success");
    } else {
      // Create new contract
      const newId = `CNT-2026-${String(contracts.length + 1).padStart(3, "0")}`;
      const newContract = {
        id: newId,
        partnerName: formData.partnerName,
        partnerId: formData.partnerId || "PTR-9999",
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || "+1 (555) 019-2831",
        contractTitle: formData.contractTitle,
        contractType: formData.contractType,
        contractValue: formattedVal,
        rawNumericValue: numericVal,
        status: formData.status || "Pending Signature",
        startDate: formData.startDate,
        endDate: formData.endDate,
        slaTier: formData.slaTier,
        paymentTerms: formData.paymentTerms,
        partnerSigned: false,
        adminSigned: true,
        signedDate: "E-Signature Dispatched",
        docName: formData.attachedFile?.name || `${formData.partnerName.replace(/\s+/g, "_")}_Contract.pdf`,
        termsNotes: formData.termsNotes
      };
      setContracts([newContract, ...contracts]);
      showToast(`New contract ${newId} created & dispatched to ${formData.contactEmail}!`, "success");
    }

    setIsCreateModalOpen(false);
    setEditingContract(null);
  };

  // Toggle Signature / Status
  const handleToggleSign = (contract) => {
    setActiveMenuId(null);
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contract.id
          ? {
              ...c,
              status: "Active",
              partnerSigned: true,
              adminSigned: true,
              signedDate: new Date().toISOString().substring(0, 10)
            }
          : c
      )
    );
    showToast(`Contract ${contract.id} fully executed & signed!`, "success");
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Contract ID,Partner Name,Contact Person,Email,Contract Type,Value,Status,Start Date,End Date\n" +
      contracts
        .map(
          (c) =>
            `"${c.id}","${c.partnerName}","${c.contactPerson}","${c.contactEmail}","${c.contractType}","${c.contractValue}","${c.status}","${c.startDate}","${c.endDate}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Partner_Contracts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported partner contracts CSV.", "success");
  };

  return (
    <div className={styles.container}>
      
      {/* Toast Banner */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP PAGE HEADER */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Partner Contracts Management</h1>
          <p className={styles.headerSubtitle}>
            Manage, edit, renew, and issue enterprise partner agreements, SLAs, and digital signatures.
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search partner, contact, contract ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button onClick={handleExportCSV} className={styles.btnExport}>
            <Download size={16} /> Export CSV
          </button>

          <button onClick={handleOpenCreateModal} className={styles.btnCreate}>
            <Plus size={16} /> + New Contract
          </button>
        </div>
      </header>


      {/* OVERVIEW STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconBoxCyan}>
            <FileText size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>TOTAL CONTRACT VALUE (ARR)</span>
            <h3 className={styles.statValue}>${totalARR.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBoxGreen}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>ACTIVE EXECUTED CONTRACTS</span>
            <h3 className={styles.statValue}>{activeCount} <span className={styles.statSubText}>Active</span></h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBoxAmber}>
            <Clock size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>PENDING E-SIGNATURES</span>
            <h3 className={styles.statValue}>{pendingCount} <span className={styles.statSubText}>Pending</span></h3>
          </div>
        </div>
      </div>


      {/* MAIN DATA TABLE CONTAINER */}
      <div className={styles.tableCard}>
        
        {/* Status Filter Tabs */}
        <div className={styles.tabsRow}>
          <div className={styles.tabsGroup}>
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`${styles.tabBtn} ${statusFilter === "ALL" ? styles.tabActive : ""}`}
            >
              All Contracts ({contracts.length})
            </button>
            <button
              onClick={() => setStatusFilter("Active")}
              className={`${styles.tabBtn} ${statusFilter === "Active" ? styles.tabActive : ""}`}
            >
              Active ({contracts.filter((c) => c.status === "Active").length})
            </button>
            <button
              onClick={() => setStatusFilter("Pending Signature")}
              className={`${styles.tabBtn} ${statusFilter === "Pending Signature" ? styles.tabActive : ""}`}
            >
              Pending Signature ({contracts.filter((c) => c.status === "Pending Signature").length})
            </button>
            <button
              onClick={() => setStatusFilter("In Review")}
              className={`${styles.tabBtn} ${statusFilter === "In Review" ? styles.tabActive : ""}`}
            >
              In Review ({contracts.filter((c) => c.status === "In Review").length})
            </button>
          </div>

          <span className={styles.recordCountText}>
            Showing {filteredContracts.length} of {contracts.length} records
          </span>
        </div>


        {/* MAIN DATA TABLE */}
        <div className={styles.tableWrapper}>
          <table className={styles.mainTable}>
            <thead>
              <tr>
                <th>Contract & Partner</th>
                <th>Primary Contact</th>
                <th>Contract Type</th>
                <th>Contract Value (ARR)</th>
                <th>Status</th>
                <th>Effective Dates</th>
                <th>E-Sign Status</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyTd}>
                    <div className={styles.emptyBox}>
                      <FileText size={32} />
                      <p>No contracts found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    
                    {/* Contract Title & Partner */}
                    <td>
                      <div className={styles.partnerFlex}>
                        <div className={styles.avatarBox}>
                          {item.partnerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.contractTitleText}>{item.contractTitle}</div>
                          <div className={styles.partnerNameSub}>
                            <strong>{item.partnerName}</strong> ({item.id})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Primary Contact */}
                    <td>
                      <div className={styles.contactName}>{item.contactPerson}</div>
                      <div className={styles.contactEmail}>{item.contactEmail}</div>
                      <div className={styles.contactPhone}>{item.contactPhone}</div>
                    </td>

                    {/* Contract Type */}
                    <td>
                      <span className={styles.typeChip}>{item.contractType}</span>
                    </td>

                    {/* Value ARR */}
                    <td>
                      <span className={styles.valueText}>{item.contractValue}</span>
                      <div className={styles.paymentSub}>{item.paymentTerms}</div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      {item.status === "Active" ? (
                        <span className={styles.badgeActive}>
                          <CheckCircle2 size={12} /> Active / Signed
                        </span>
                      ) : item.status === "Pending Signature" ? (
                        <span className={styles.badgePending}>
                          <Clock size={12} /> Pending Signature
                        </span>
                      ) : (
                        <span className={styles.badgeReview}>
                          <AlertCircle size={12} /> In Review
                        </span>
                      )}
                    </td>

                    {/* Dates */}
                    <td>
                      <div className={styles.dateRangeText}>
                        {item.startDate} → {item.endDate}
                      </div>
                      <div className={styles.slaSubText}>{item.slaTier}</div>
                    </td>

                    {/* Signatures */}
                    <td>
                      <div className={styles.signFlex}>
                        <span className={item.partnerSigned ? styles.signYes : styles.signNo}>
                          Partner: {item.partnerSigned ? "✓ Signed" : "⏳ Pending"}
                        </span>
                        <span className={item.adminSigned ? styles.signYes : styles.signNo}>
                          Admin: {item.adminSigned ? "✓ Signed" : "⏳ Pending"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className={styles.tdRight}>
                      <div className={styles.actionsMenuWrap}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className={styles.btnMenuDots}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuId === item.id && (
                          <div className={styles.dropdownMenu}>
                            <button
                              onClick={() => { setActiveMenuId(null); setViewingContract(item); }}
                              className={styles.menuItem}
                            >
                              <Eye size={14} /> View Contract & PDF
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className={styles.menuItemBlue}
                            >
                              <Edit3 size={14} /> Edit Contract
                            </button>

                            {!item.partnerSigned || !item.adminSigned ? (
                              <button
                                onClick={() => handleToggleSign(item)}
                                className={styles.menuItemGreen}
                              >
                                <CheckCircle2 size={14} /> Approve & Sign Contract
                              </button>
                            ) : null}

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                showToast(`Downloading ${item.docName}...`, "info");
                              }}
                              className={styles.menuItem}
                            >
                              <Download size={14} /> Download PDF
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                showToast(`Contract renewal link dispatched to ${item.contactEmail}`, "success");
                              }}
                              className={styles.menuItem}
                            >
                              <RefreshCw size={14} /> Send Renewal Request
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* MODAL: CREATE OR EDIT CONTRACT                                           */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>
                  {editingContract ? `Edit Contract — ${editingContract.id}` : "Create New Partner Contract"}
                </h2>
                <p className={styles.modalSubtitle}>
                  {editingContract
                    ? "Update contract terms, contact person, SLA tier, or duration."
                    : "Issue a new enterprise partner agreement and send DocuSign e-signature link."}
                </p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className={styles.btnClose}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitContract} className={styles.modalBodyScroll}>
              
              <div className={styles.formSection}>
                <h4 className={styles.formSecTitle}>1. Partner & Contact Information</h4>
                <div className={styles.formGrid2}>
                  
                  <div className={styles.formGroup}>
                    <label>Partner Company Name <span className={styles.req}>*</span></label>
                    <input
                      type="text"
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                      placeholder="e.g. Apex Cognitive Systems"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Partner ID / Reference</label>
                    <input
                      type="text"
                      value={formData.partnerId}
                      onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                      placeholder="PTR-1002"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact Person Name <span className={styles.req}>*</span></label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Dr. Elena Vance"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact Email Address <span className={styles.req}>*</span></label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="e.vance@company.ai"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact Phone Number</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+1 (555) 890-1234"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contract Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={styles.select}
                    >
                      <option value="Pending Signature">Pending Signature</option>
                      <option value="Active">Active / Signed</option>
                      <option value="In Review">In Review</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                </div>
              </div>


              <div className={styles.formSection}>
                <h4 className={styles.formSecTitle}>2. Contract Details & Commercial Terms</h4>
                <div className={styles.formGrid2}>

                  <div className={styles.formGroup}>
                    <label>Contract Title <span className={styles.req}>*</span></label>
                    <input
                      type="text"
                      value={formData.contractTitle}
                      onChange={(e) => setFormData({ ...formData, contractTitle: e.target.value })}
                      placeholder="Master Services & SLA Agreement v3.1"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contract Type</label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                      className={styles.select}
                    >
                      <option value="Master Services Agreement (MSA)">Master Services Agreement (MSA)</option>
                      <option value="Enterprise Partner License">Enterprise Partner License</option>
                      <option value="Data Processing Agreement (DPA)">Data Processing Agreement (DPA)</option>
                      <option value="Channel Reseller Agreement">Channel Reseller Agreement</option>
                      <option value="Software License Agreement">Software License Agreement</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contract Value / ARR ($ USD) <span className={styles.req}>*</span></label>
                    <input
                      type="number"
                      value={formData.contractValue}
                      onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                      placeholder="120000"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Payment Terms</label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className={styles.select}
                    >
                      <option value="Annual Prepaid">Annual Prepaid</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Quarterly Invoice">Quarterly Invoice</option>
                      <option value="Monthly Direct Debit">Monthly Direct Debit</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Expiration / End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>SLA Tier Commitment</label>
                    <select
                      value={formData.slaTier}
                      onChange={(e) => setFormData({ ...formData, slaTier: e.target.value })}
                      className={styles.select}
                    >
                      <option value="99.99% Platinum SLA">99.99% Platinum SLA (15 min emergency response)</option>
                      <option value="99.9% Gold SLA">99.9% Gold SLA (1 hr response)</option>
                      <option value="Standard 99.5% SLA">Standard 99.5% SLA (4 hr response)</option>
                    </select>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Special Terms & Custom Clauses</label>
                    <textarea
                      rows={3}
                      value={formData.termsNotes}
                      onChange={(e) => setFormData({ ...formData, termsNotes: e.target.value })}
                      placeholder="Specify zero data retention policy, custom guardrail configurations, or volume rebate thresholds..."
                      className={styles.textarea}
                    ></textarea>
                  </div>

                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={styles.btnCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnSave}>
                  <FileCheck size={16} />
                  <span>{editingContract ? "Save Changes" : "Create & Issue Contract"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL: VIEW CONTRACT DETAILS & PDF PREVIEW                                */}
      {/* ========================================================================= */}
      {viewingContract && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCardLarge}>
            
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{viewingContract.contractTitle}</h3>
                <span className={styles.modalSubtitle}>Ref: {viewingContract.id} • {viewingContract.partnerName}</span>
              </div>
              <button onClick={() => setViewingContract(null)} className={styles.btnClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.viewBodyGrid}>
              
              {/* Left Meta Specs */}
              <div className={styles.viewMetaSide}>
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>PARTNER COMPANY</span>
                  <strong className={styles.metaVal}>{viewingContract.partnerName}</strong>
                  <span className={styles.metaSub}>ID: {viewingContract.partnerId}</span>
                </div>

                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>PRIMARY CONTACT</span>
                  <strong className={styles.metaVal}>{viewingContract.contactPerson}</strong>
                  <span className={styles.metaSub}>{viewingContract.contactEmail}</span>
                  <span className={styles.metaSub}>{viewingContract.contactPhone}</span>
                </div>

                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>CONTRACT VALUE (ARR)</span>
                  <strong className={styles.metaValGreen}>{viewingContract.contractValue}</strong>
                  <span className={styles.metaSub}>{viewingContract.paymentTerms}</span>
                </div>

                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>STATUS & DATES</span>
                  <span className={styles.badgeActiveSmall}>{viewingContract.status}</span>
                  <span className={styles.metaSub} style={{ marginTop: 4 }}>
                    {viewingContract.startDate} → {viewingContract.endDate}
                  </span>
                </div>

                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>E-SIGNATURE AUDIT</span>
                  <span className={styles.metaSub}>Partner: {viewingContract.partnerSigned ? "✓ Signed" : "Pending"}</span>
                  <span className={styles.metaSub}>Admin: {viewingContract.adminSigned ? "✓ Signed" : "Pending"}</span>
                  <span className={styles.metaSub}>Hash: SHA256-88a91c0e4f2b</span>
                </div>
              </div>

              {/* Right PDF Sheet Preview */}
              <div className={styles.viewPdfSide}>
                <div className={styles.pdfPaperHeader}>
                  <div className={styles.pdfBrand}>NEURALIX AI PLATFORM</div>
                  <h4 className={styles.pdfTitle}>{viewingContract.contractTitle}</h4>
                  <span className={styles.pdfDocRef}>Attachment: {viewingContract.docName}</span>
                </div>

                <div className={styles.pdfPaperBody}>
                  <p>
                    <strong>1. MASTER SERVICE TERMS:</strong> This Agreement is entered into between Neuralix Systems and
                    <strong> {viewingContract.partnerName}</strong> for enterprise AI gateway integration under the 
                    <strong> {viewingContract.slaTier}</strong> standard.
                  </p>

                  <p>
                    <strong>2. COMMERCIAL CONSIDERATION:</strong> Partner agrees to pay an annual recurring contract value of 
                    <strong> {viewingContract.contractValue}</strong> governed by <strong>{viewingContract.paymentTerms}</strong> terms.
                  </p>

                  <p className={styles.pdfHighlight}>
                    <strong>3. SPECIAL CONDITIONS & NOTES:</strong> {viewingContract.termsNotes || "No custom amendments."}
                  </p>

                  <div className={styles.pdfSignRow}>
                    <div>
                      <div className={styles.sigLine}>{viewingContract.contactPerson}</div>
                      <span className={styles.sigSub}>Partner Signatory ({viewingContract.partnerSigned ? "Signed" : "Pending"})</span>
                    </div>
                    <div>
                      <div className={styles.sigLine}>Marcus Thorne (VP Legal)</div>
                      <span className={styles.sigSub}>Neuralix Signatory ({viewingContract.adminSigned ? "Signed" : "Pending"})</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => {
                  const contract = viewingContract;
                  setViewingContract(null);
                  handleOpenEditModal(contract);
                }}
                className={styles.btnEditModal}
              >
                <Edit3 size={15} /> Edit This Contract
              </button>

              <button
                onClick={() => {
                  showToast(`Downloading ${viewingContract.docName}...`, "info");
                }}
                className={styles.btnSave}
              >
                <Download size={15} /> Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
