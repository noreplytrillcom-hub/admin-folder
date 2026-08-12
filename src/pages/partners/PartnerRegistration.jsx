import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
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
  UploadCloud,
  UserCheck,
  Users,
  X,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import { sendPartnerWelcomeEmail } from "../../services/emailService";
import styles from "./PartnerRegistration.module.css";

// Initial Mock Partner Data
const INITIAL_PARTNERS = [
  {
    id: "PTR-1001",
    partnerName: "Acme Cloud Solutions",
    contactPerson: "Sarah Jenkins",
    email: "sarah.j@acmecloud.io",
    emailCode: "EML-89410",
    phone: "+1 (555) 234-5678",
    openingHeadcount: 150,
    product: "AI Testing Suite",
    registrationStatus: "Completed",
    approvalStage: "Completed / API Keys Active",
    channelPartnerCompany: "Global Tech Syndicate",
    channelPartner: "David Vance",
    paymentMode: "Invoice",
    createdDate: "2026-08-01 14:22 UTC",
    addOns: ["AI Auto-Testing Engine", "Issue Capture & SDK Sync"],
    apiKey: "pk_live_acme_8f92a1b4c90e",
    docs: { regCert: "Acme_Business_Reg.pdf", taxId: "TAX_US_9941.pdf", soc2: "SOC2_Report.pdf" }
  },
  {
    id: "PTR-1002",
    partnerName: "Apex Cognitive Systems",
    contactPerson: "Dr. Elena Vance",
    email: "e.vance@apexcognitive.ai",
    emailCode: "EML-55219",
    phone: "+1 (555) 890-1234",
    openingHeadcount: 450,
    product: "Plumm Core",
    registrationStatus: "Pending",
    approvalStage: "Draft / Awaiting Signature",
    channelPartnerCompany: "Apex Group Inc.",
    channelPartner: "Elena Vance",
    paymentMode: "Bank Transfer",
    createdDate: "2026-08-04 09:15 UTC",
    addOns: ["AI Auto-Testing Engine", "Issue Capture & SDK Sync", "Custom Fine-Tuning API"],
    apiKey: null,
    docs: { regCert: "Apex_Cert.pdf", taxId: "GSTIN_7749.pdf", soc2: null }
  },
  {
    id: "PTR-1003",
    partnerName: "Nexus Cybernetics",
    contactPerson: "Marcus Brody",
    email: "m.brody@nexuscyber.com",
    emailCode: "EML-77104",
    phone: "+44 20 7946 0912",
    openingHeadcount: 85,
    product: "Enterprise Suite",
    registrationStatus: "Completed",
    approvalStage: "Completed / API Keys Active",
    channelPartnerCompany: "EMEA Partner Hub",
    channelPartner: "Claire Redfield",
    paymentMode: "Card",
    createdDate: "2026-07-28 18:40 UTC",
    addOns: ["Issue Capture & SDK Sync"],
    apiKey: "pk_live_nexus_772a091e3b5f",
    docs: { regCert: "Nexus_UK_Reg.pdf", taxId: "VAT_UK_8832.pdf", soc2: "ISO27001_Audit.pdf" }
  },
  {
    id: "PTR-1004",
    partnerName: "Vortex Data Labs",
    contactPerson: "Rachel Qi",
    email: "rachel@vortexlabs.dev",
    emailCode: "EML-30912",
    phone: "+1 (555) 432-8765",
    openingHeadcount: 220,
    product: "AI Testing Suite",
    registrationStatus: "Pending",
    approvalStage: "Security Review",
    channelPartnerCompany: "Vortex Ventures",
    channelPartner: "Michael Chang",
    paymentMode: "Direct Debit",
    createdDate: "2026-08-05 11:05 UTC",
    addOns: ["AI Auto-Testing Engine"],
    apiKey: null,
    docs: { regCert: "Vortex_Inc.pdf", taxId: "TAX_US_1042.pdf", soc2: "SOC2_Type2.pdf" }
  },
  {
    id: "PTR-1005",
    partnerName: "Synapse Dynamics",
    contactPerson: "Liam O'Connor",
    email: "liam@synapse.ie",
    emailCode: "EML-94815",
    phone: "+353 1 496 0123",
    openingHeadcount: 60,
    product: "Plumm Core",
    registrationStatus: "Completed",
    approvalStage: "Completed / API Keys Active",
    channelPartnerCompany: "Global Tech Syndicate",
    channelPartner: "David Vance",
    paymentMode: "Invoice",
    createdDate: "2026-07-15 16:30 UTC",
    addOns: ["AI Auto-Testing Engine", "Issue Capture & SDK Sync"],
    apiKey: "pk_live_synapse_9180fa4c",
    docs: { regCert: "Synapse_EU_Reg.pdf", taxId: "VAT_IE_5541.pdf", soc2: "SOC2_Report.pdf" }
  }
];

export default function PartnerRegistration() {
  // Main Table State
  const [partners, setPartners] = useState(INITIAL_PARTNERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Active Row Action Dropdown Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal / Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPartnerView, setSelectedPartnerView] = useState(null);
  const [activeLogsDrawer, setActiveLogsDrawer] = useState(null);
  const [implUrlModal, setImplUrlModal] = useState(null);
  const [sentEmailModal, setSentEmailModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Add New Partner Form State
  const [formData, setFormData] = useState({
    partnerName: "",
    contactPerson: "",
    email: "",
    emailCode: "",
    phone: "",
    openingHeadcount: "100",
    product: "AI Testing Suite",
    paymentMode: "Invoice",
    channelPartnerCompany: "Global Tech Syndicate",
    channelPartner: "Internal Direct",
    // Add-on capabilities checkboxes
    addOnTestingEngine: true,
    addOnIssueCapture: true,
    addOnFineTuning: false,
    addOnRealtimeTelemetry: false,
    // File uploads
    regCertFile: null,
    taxIdFile: null,
    soc2File: null
  });

  // Filtered Partners
  const filteredPartners = useMemo(() => {
    return partners.filter((item) => {
      const matchesSearch =
        item.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.emailCode && item.emailCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.registrationStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [partners, searchTerm, statusFilter]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredPartners.length / pageSize) || 1;
  const paginatedPartners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPartners.slice(start, start + pageSize);
  }, [filteredPartners, currentPage, pageSize]);

  // Trigger Toast Notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to generate a random unique Email Code
  const generateRandomEmailCode = () => {
    const randomCode = `EML-${Math.floor(10000 + Math.random() * 90000)}`;
    setFormData((prev) => ({ ...prev, emailCode: randomCode }));
    showToast(`Generated Email Code: ${randomCode}`, "info");
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // File Upload Simulator
  const handleFileChange = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file.name }));
      showToast(`Attached file: ${file.name}`, "info");
    }
  };

  // Add Partner Form Submission
  const handleSubmitPartner = (isDraft = false) => {
    if (!formData.partnerName || !formData.contactPerson || !formData.email) {
      alert("Please fill in required fields: Partner Name, Contact Person, and Email.");
      return;
    }

    const finalEmailCode = formData.emailCode.trim() || `EML-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedAddOns = [];
    if (formData.addOnTestingEngine) selectedAddOns.push("AI Auto-Testing Engine");
    if (formData.addOnIssueCapture) selectedAddOns.push("Issue Capture & SDK Sync");
    if (formData.addOnFineTuning) selectedAddOns.push("Custom Fine-Tuning API");
    if (formData.addOnRealtimeTelemetry) selectedAddOns.push("Real-Time Telemetry");

    const newId = `PTR-${1000 + partners.length + 1}`;
    const newPartner = {
      id: newId,
      partnerName: formData.partnerName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      emailCode: finalEmailCode,
      phone: formData.phone || "+1 (555) 019-2831",
      openingHeadcount: parseInt(formData.openingHeadcount, 10) || 50,
      product: formData.product,
      registrationStatus: "Pending",
      approvalStage: isDraft ? "Draft" : "Draft / Awaiting Signature",
      channelPartnerCompany: formData.channelPartnerCompany,
      channelPartner: formData.channelPartner,
      paymentMode: formData.paymentMode,
      createdDate: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      addOns: selectedAddOns,
      apiKey: null,
      docs: {
        regCert: formData.regCertFile || "Business_Reg.pdf",
        taxId: formData.taxIdFile || "Tax_ID.pdf",
        soc2: formData.soc2File || "Security_Cert.pdf"
      }
    };

    setPartners([newPartner, ...partners]);
    setIsAddModalOpen(false);

    // Trigger Email Dispatch to Partner Email
    sendPartnerWelcomeEmail({
      partnerName: formData.partnerName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      emailCode: finalEmailCode,
      product: formData.product,
      openingHeadcount: parseInt(formData.openingHeadcount, 10) || 50,
    })
      .then((res) => {
        setSentEmailModal({
          email: formData.email,
          partnerName: formData.partnerName,
          contactPerson: formData.contactPerson,
          emailCode: finalEmailCode,
          product: formData.product,
          result: res,
        });
      })
      .catch((err) => console.error("Email dispatch failed:", err));

    if (isDraft) {
      showToast(`Partner "${formData.partnerName}" saved as Draft (Email Code: ${finalEmailCode}).`, "info");
    } else {
      showToast(
        `Partner "${formData.partnerName}" registered! Email Code: ${finalEmailCode} emailed to ${formData.email}.`,
        "success"
      );
    }

    // Reset Form
    setFormData({
      partnerName: "",
      contactPerson: "",
      email: "",
      emailCode: "",
      phone: "",
      openingHeadcount: "100",
      product: "AI Testing Suite",
      paymentMode: "Invoice",
      channelPartnerCompany: "Global Tech Syndicate",
      channelPartner: "Internal Direct",
      addOnTestingEngine: true,
      addOnIssueCapture: true,
      addOnFineTuning: false,
      addOnRealtimeTelemetry: false,
      regCertFile: null,
      taxIdFile: null,
      soc2File: null
    });
  };

  // Row Action Menu Handlers
  const handleAction = (actionType, partner) => {
    setActiveMenuId(null);

    switch (actionType) {
      case "VIEW":
        setSelectedPartnerView(partner);
        break;

      case "ONBOARD":
        setPartners((prev) =>
          prev.map((p) =>
            p.id === partner.id
              ? {
                  ...p,
                  registrationStatus: "Completed",
                  approvalStage: "Completed / API Keys Active",
                  apiKey: p.apiKey || `pk_live_${partner.partnerName.toLowerCase().replace(/[^a-z]/g, "")}_${Math.random().toString(36).substring(2, 8)}`
                }
              : p
          )
        );
        showToast(`Partner "${partner.partnerName}" onboarded! API keys generated & activated.`, "success");
        break;

      case "MOVE_PENDING":
        setPartners((prev) =>
          prev.map((p) =>
            p.id === partner.id
              ? { ...p, registrationStatus: "Pending", approvalStage: "Draft / Awaiting Signature" }
              : p
          )
        );
        showToast(`Partner "${partner.partnerName}" moved to Pending status.`, "info");
        break;

      case "VIEW_LOGS":
        setActiveLogsDrawer(partner);
        break;

      case "DOWNLOAD_ORDER_FORM":
        showToast(`Downloading Order Form for ${partner.partnerName} (PDF)...`, "info");
        break;

      case "DOWNLOAD_IMPORT_DATA":
        showToast(`Exporting import dataset CSV for ${partner.partnerName}...`, "info");
        break;

      case "GET_IMPL_URL":
        setImplUrlModal(partner);
        break;

      default:
        break;
    }
  };

  // CSV Export Simulator
  const handleExportAll = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Partner,Contact Person,Email,Email Code,Headcount,Product,Status,Approval Stage,Payment Mode,Created Date\n" +
      partners
        .map(
          (p) =>
            `"${p.partnerName}","${p.contactPerson}","${p.email}","${p.emailCode || ""}","${p.openingHeadcount}","${p.product}","${p.registrationStatus}","${p.approvalStage}","${p.paymentMode}","${p.createdDate}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Partner_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported partner registry dataset CSV.", "success");
  };

  const handleOpenAddModal = () => {
    const initialCode = `EML-${Math.floor(10000 + Math.random() * 90000)}`;
    setFormData((prev) => ({
      ...prev,
      emailCode: initialCode,
    }));
    setIsAddModalOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>New Partner Registration</h1>
          <p className={styles.headerSubtitle}>
            Manage B2B SaaS partner onboarding, contract signatures, email codes, and API provisioning.
          </p>
        </div>

        <div className={styles.headerRight}>
          {/* Search bar */}
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search partner, contact, email code, ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
          </div>

          {/* Export Icon Button */}
          <button
            type="button"
            onClick={handleExportAll}
            className={styles.btnExport}
            title="Export Dataset CSV"
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className={styles.btnAddPartner}
          >
            <Plus size={16} />
            <span>+ Add New Partner</span>
          </button>
        </div>
      </header>


      {/* MAIN CONTENT CARD CONTAINER */}
      <div className={styles.tableCardContainer}>
        
        {/* Table Filters & Stats Bar */}
        <div className={styles.filterStatsBar}>
          <div className={styles.statusTabs}>
            <button
              onClick={() => { setStatusFilter("ALL"); setCurrentPage(1); }}
              className={`${styles.tabBtn} ${statusFilter === "ALL" ? styles.tabActive : ""}`}
            >
              All Partners ({partners.length})
            </button>
            <button
              onClick={() => { setStatusFilter("Completed"); setCurrentPage(1); }}
              className={`${styles.tabBtn} ${statusFilter === "Completed" ? styles.tabActive : ""}`}
            >
              Completed ({partners.filter((p) => p.registrationStatus === "Completed").length})
            </button>
            <button
              onClick={() => { setStatusFilter("Pending"); setCurrentPage(1); }}
              className={`${styles.tabBtn} ${statusFilter === "Pending" ? styles.tabActive : ""}`}
            >
              Pending ({partners.filter((p) => p.registrationStatus === "Pending").length})
            </button>
          </div>

          <div className={styles.quickStatsRow}>
            <span className={styles.statChip}>
              Total Seats: <strong>{partners.reduce((sum, p) => sum + p.openingHeadcount, 0)}</strong>
            </span>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className={styles.tableWrapper}>
          <table className={styles.mainTable}>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Contact Person</th>
                <th>Email Code</th>
                <th>Opening Headcount</th>
                <th>Product</th>
                <th>Registration Status</th>
                <th>Approval Stage</th>
                <th>Channel Partner Company</th>
                <th>Channel Partner</th>
                <th>Payment Mode</th>
                <th>Created Date (UTC)</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPartners.length === 0 ? (
                <tr>
                  <td colSpan={12} className={styles.emptyTd}>
                    <div className={styles.emptyState}>
                      <Building2 size={32} className={styles.emptyIcon} />
                      <p>No partners found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPartners.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    
                    {/* Partner Name & ID */}
                    <td className={styles.tdPartner}>
                      <div className={styles.partnerFlex}>
                        <div className={styles.partnerAvatar}>
                          {item.partnerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.partnerNameText}>{item.partnerName}</div>
                          <div className={styles.partnerIdSub}>{item.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td>
                      <div className={styles.contactName}>{item.contactPerson}</div>
                      <div className={styles.contactEmail}>{item.email}</div>
                    </td>

                    {/* Email Code */}
                    <td>
                      <span
                        className={styles.emailCodeBadge}
                        title="Click to copy Partner Email Code"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigator.clipboard?.writeText(item.emailCode || "EML-GEN1");
                          showToast(`Copied Email Code "${item.emailCode || "EML-GEN1"}" to clipboard!`, "info");
                        }}
                      >
                        <Key size={11} /> {item.emailCode || "EML-GEN1"}
                      </span>
                    </td>

                    {/* Opening Headcount */}
                    <td>
                      <span className={styles.headcountBadge}>
                        <Users size={12} /> {item.openingHeadcount} seats
                      </span>
                    </td>

                    {/* Product */}
                    <td>
                      <span className={styles.productChip}>{item.product}</span>
                    </td>

                    {/* Registration Status Badge */}
                    <td>
                      {item.registrationStatus === "Completed" ? (
                        <span className={styles.badgeStatusCompleted}>
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      ) : (
                        <span className={styles.badgeStatusPending}>
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>

                    {/* Approval Stage */}
                    <td>
                      <span className={styles.stageText}>{item.approvalStage}</span>
                    </td>

                    {/* Channel Partner Company */}
                    <td>
                      <span className={styles.mutedCellText}>{item.channelPartnerCompany}</span>
                    </td>

                    {/* Channel Partner */}
                    <td>
                      <span className={styles.mutedCellText}>{item.channelPartner}</span>
                    </td>

                    {/* Payment Mode */}
                    <td>
                      <span className={styles.paymentBadge}>{item.paymentMode}</span>
                    </td>

                    {/* Created Date (UTC) */}
                    <td>
                      <span className={styles.dateCell}>{item.createdDate}</span>
                    </td>

                    {/* Actions Button & Three-Dots Menu */}
                    <td className={styles.tdActions}>
                      <div className={styles.actionsMenuWrapper}>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === item.id ? null : item.id)
                          }
                          className={styles.btnThreeDots}
                          title="Actions Menu"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Three Dots Dropdown Menu */}
                        {activeMenuId === item.id && (
                          <div className={styles.dropdownMenu}>
                            <button
                              onClick={() => handleAction("VIEW", item)}
                              className={styles.menuItem}
                            >
                              <FileText size={14} /> View Partner
                            </button>

                            <button
                              onClick={() => handleAction("ONBOARD", item)}
                              className={styles.menuItemGreen}
                            >
                              <UserCheck size={14} /> Onboard Partner
                            </button>

                            <button
                              onClick={() => handleAction("MOVE_PENDING", item)}
                              className={styles.menuItem}
                            >
                              <Clock size={14} /> Move To Pending
                            </button>

                            <button
                              onClick={() => handleAction("VIEW_LOGS", item)}
                              className={styles.menuItem}
                            >
                              <Layers size={14} /> View Logs
                            </button>

                            <button
                              onClick={() => handleAction("DOWNLOAD_ORDER_FORM", item)}
                              className={styles.menuItem}
                            >
                              <Download size={14} /> Download Order Form
                            </button>

                            <button
                              onClick={() => handleAction("DOWNLOAD_IMPORT_DATA", item)}
                              className={styles.menuItem}
                            >
                              <FileSpreadsheet size={14} /> Download Import Data
                            </button>

                            <button
                              onClick={() => handleAction("GET_IMPL_URL", item)}
                              className={styles.menuItem}
                            >
                              <Code size={14} /> Get Implementation URL
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


        {/* PAGINATION FOOTER */}
        <div className={styles.paginationFooter}>
          <div className={styles.paginationInfo}>
            Showing{" "}
            <strong>
              {filteredPartners.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, filteredPartners.length)}
            </strong>{" "}
            of <strong>{filteredPartners.length}</strong> partners
          </div>

          <div className={styles.paginationControls}>
            {/* Page Size Selector */}
            <div className={styles.pageSizeWrapper}>
              <span className={styles.pageSizeLabel}>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={styles.pageSizeSelect}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
            </div>

            {/* Page Buttons */}
            <div className={styles.pageButtonsGroup}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={styles.btnPageNav}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span className={styles.pageIndicator}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={styles.btnPageNav}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* 2. "ADD NEW PARTNER" MODAL FORM                                            */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Add New Partner</h2>
                <p className={styles.modalSubtitle}>
                  Register a new partner company, assign email verification code, and upload compliance documents.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={styles.btnCloseModal}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className={styles.modalBodyScroll}>
              
              {/* SECTION 1: Partner Details */}
              <div className={styles.formSection}>
                <div className={styles.secTitleRow}>
                  <Building2 size={16} className={styles.secIcon} />
                  <h3>1. Partner Details</h3>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>Partner Company Name <span className={styles.req}>*</span></label>
                    <input
                      type="text"
                      name="partnerName"
                      value={formData.partnerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Quantum AI Systems"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact Person Name <span className={styles.req}>*</span></label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address <span className={styles.req}>*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      className={styles.textInput}
                    />
                  </div>

                  {/* Email Code Input with Auto-Generate Action */}
                  <div className={styles.formGroup}>
                    <label>Email Code <span className={styles.req}>*</span></label>
                    <div className={styles.inputWithBtnGroup}>
                      <input
                        type="text"
                        name="emailCode"
                        value={formData.emailCode}
                        onChange={handleInputChange}
                        placeholder="e.g. EML-89410"
                        className={styles.textInput}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={generateRandomEmailCode}
                        className={styles.btnAutoGenerate}
                        title="Auto-generate random email code"
                      >
                        <Key size={13} />
                        <span>Auto-Generate</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 019-2831"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Opening Headcount (Seats)</label>
                    <input
                      type="number"
                      name="openingHeadcount"
                      value={formData.openingHeadcount}
                      onChange={handleInputChange}
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Product Suite</label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      className={styles.selectInput}
                    >
                      <option value="Plumm Core">Plumm Core</option>
                      <option value="AI Testing Suite">AI Testing Suite</option>
                      <option value="Enterprise Suite">Enterprise Suite</option>
                      <option value="Neuralix API Gateway">Neuralix API Gateway</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Payment Mode</label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleInputChange}
                      className={styles.selectInput}
                    >
                      <option value="Card">Card</option>
                      <option value="Invoice">Invoice</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Direct Debit">Direct Debit</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Channel Partner Company</label>
                    <input
                      type="text"
                      name="channelPartnerCompany"
                      value={formData.channelPartnerCompany}
                      onChange={handleInputChange}
                      className={styles.textInput}
                    />
                  </div>
                </div>
              </div>


              {/* SECTION 2: Add-On Capabilities */}
              <div className={styles.formSection}>
                <div className={styles.secTitleRow}>
                  <Zap size={16} className={styles.secIcon} />
                  <h3>2. Add-On Capabilities</h3>
                </div>

                <div className={styles.checkboxesGrid}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="addOnTestingEngine"
                      checked={formData.addOnTestingEngine}
                      onChange={handleInputChange}
                      className={styles.checkboxInput}
                    />
                    <div>
                      <span className={styles.cbTitle}>AI Auto-Testing Engine</span>
                      <span className={styles.cbSub}>Automated test suite generation & execution</span>
                    </div>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="addOnIssueCapture"
                      checked={formData.addOnIssueCapture}
                      onChange={handleInputChange}
                      className={styles.checkboxInput}
                    />
                    <div>
                      <span className={styles.cbTitle}>Issue Capture & SDK Sync</span>
                      <span className={styles.cbSub}>Real-time error trace capture and GitHub sync</span>
                    </div>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="addOnFineTuning"
                      checked={formData.addOnFineTuning}
                      onChange={handleInputChange}
                      className={styles.checkboxInput}
                    />
                    <div>
                      <span className={styles.cbTitle}>Custom Fine-Tuning API</span>
                      <span className={styles.cbSub}>Dedicated LLM weights fine-tuning pipeline</span>
                    </div>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="addOnRealtimeTelemetry"
                      checked={formData.addOnRealtimeTelemetry}
                      onChange={handleInputChange}
                      className={styles.checkboxInput}
                    />
                    <div>
                      <span className={styles.cbTitle}>Real-Time Telemetry & Log Audit</span>
                      <span className={styles.cbSub}>High-throughput audit stream export</span>
                    </div>
                  </label>
                </div>
              </div>


              {/* SECTION 3: Document Upload */}
              <div className={styles.formSection}>
                <div className={styles.secTitleRow}>
                  <UploadCloud size={16} className={styles.secIcon} />
                  <h3>3. Document Upload</h3>
                </div>

                <div className={styles.uploadCardsGrid}>
                  
                  {/* Reg Cert */}
                  <div className={styles.fileDropCard}>
                    <span className={styles.fileDropLabel}>Business Registration Certificate</span>
                    <input
                      type="file"
                      id="regCert"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange("regCertFile", e)}
                    />
                    <label htmlFor="regCert" className={styles.btnUploadTrigger}>
                      <UploadCloud size={16} />
                      <span>{formData.regCertFile || "Upload Certificate PDF"}</span>
                    </label>
                  </div>

                  {/* Tax ID */}
                  <div className={styles.fileDropCard}>
                    <span className={styles.fileDropLabel}>Tax ID / GSTIN Document</span>
                    <input
                      type="file"
                      id="taxId"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange("taxIdFile", e)}
                    />
                    <label htmlFor="taxId" className={styles.btnUploadTrigger}>
                      <UploadCloud size={16} />
                      <span>{formData.taxIdFile || "Upload Tax Doc PDF"}</span>
                    </label>
                  </div>

                  {/* SOC2 */}
                  <div className={styles.fileDropCard}>
                    <span className={styles.fileDropLabel}>SOC 2 / Data Security Compliance</span>
                    <input
                      type="file"
                      id="soc2"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange("soc2File", e)}
                    />
                    <label htmlFor="soc2" className={styles.btnUploadTrigger}>
                      <UploadCloud size={16} />
                      <span>{formData.soc2File || "Upload Security Audit PDF"}</span>
                    </label>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => handleSubmitPartner(true)}
                className={styles.btnDraft}
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmitPartner(false)}
                className={styles.btnPrimaryDark}
              >
                <FileCheck size={16} />
                <span>Add Partner & Issue Contract</span>
              </button>
            </div>

          </div>
        </div>
      )}


      {/* VIEW PARTNER DETAILS MODAL */}
      {selectedPartnerView && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCardCompact}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{selectedPartnerView.partnerName}</h3>
                <span className={styles.modalSubtitle}>Ref: {selectedPartnerView.id}</span>
              </div>
              <button onClick={() => setSelectedPartnerView(null)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBodyCompact}>
              <div className={styles.detailRow}>
                <span>Contact Person:</span>
                <strong>{selectedPartnerView.contactPerson} ({selectedPartnerView.email})</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Email Verification Code:</span>
                <code className={styles.apiKeyCode}>{selectedPartnerView.emailCode || "EML-GEN1"}</code>
              </div>
              <div className={styles.detailRow}>
                <span>Product Suite:</span>
                <strong>{selectedPartnerView.product}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Registration Status:</span>
                <strong>{selectedPartnerView.registrationStatus}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Approval Stage:</span>
                <strong>{selectedPartnerView.approvalStage}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>API Key:</span>
                <code className={styles.apiKeyCode}>{selectedPartnerView.apiKey || "Not Issued Yet"}</code>
              </div>
              <div className={styles.detailRow}>
                <span>Active Add-Ons:</span>
                <div>
                  {selectedPartnerView.addOns.map((a, i) => (
                    <span key={i} className={styles.smallPill}>{a}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setSelectedPartnerView(null)} className={styles.btnDraft}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* IMPLEMENTATION URL MODAL */}
      {implUrlModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCardCompact}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Implementation SDK URL</h3>
              <button onClick={() => setImplUrlModal(null)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBodyCompact}>
              <p className={styles.mutedText}>
                SDK Integration Endpoint for <strong>{implUrlModal.partnerName}</strong>:
              </p>
              <div className={styles.codeSnippetBox}>
                <code>https://api.neuralix.io/v1/sdk/init?partnerId={implUrlModal.id}&code={implUrlModal.emailCode || "EML-GEN1"}</code>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://api.neuralix.io/v1/sdk/init?partnerId=${implUrlModal.id}&code=${implUrlModal.emailCode || "EML-GEN1"}`);
                    showToast("Copied Implementation URL with Email Code to clipboard!", "info");
                  }}
                  className={styles.btnCopy}
                  title="Copy URL"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setImplUrlModal(null)} className={styles.btnDraft}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* LOGS DRAWER */}
      {activeLogsDrawer && (
        <div className={styles.modalBackdrop}>
          <div className={styles.drawerCard}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Audit & Workflow Logs</h3>
                <span className={styles.modalSubtitle}>{activeLogsDrawer.partnerName} ({activeLogsDrawer.id})</span>
              </div>
              <button onClick={() => setActiveLogsDrawer(null)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.logsList}>
              <div className={styles.logItem}>
                <span className={styles.logTime}>{activeLogsDrawer.createdDate}</span>
                <p>Partner registration entry initialized by Admin.</p>
              </div>
              <div className={styles.logItem}>
                <span className={styles.logTime}>+0.1s after creation</span>
                <p>Generated Partner Email Code: <strong>{activeLogsDrawer.emailCode || "EML-GEN1"}</strong>.</p>
              </div>
              <div className={styles.logItem}>
                <span className={styles.logTime}>+0.2s after creation</span>
                <p>Automated contract email issued to {activeLogsDrawer.email} with Code {activeLogsDrawer.emailCode || "EML-GEN1"}.</p>
              </div>
              <div className={styles.logItem}>
                <span className={styles.logTime}>+1.5s after creation</span>
                <p>Documents uploaded: {Object.values(activeLogsDrawer.docs).filter(Boolean).join(", ")}.</p>
              </div>
              {activeLogsDrawer.apiKey && (
                <div className={styles.logItemGreen}>
                  <span className={styles.logTime}>Completed</span>
                  <p>E-Signature verified via Email Code. System API Key {activeLogsDrawer.apiKey} activated.</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setActiveLogsDrawer(null)} className={styles.btnDraft}>
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SENT EMAIL DISPATCH CONFIRMATION MODAL */}
      {sentEmailModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCardCompact}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={22} color="#10b981" />
                <div>
                  <h3 className={styles.modalTitle}>Welcome Email Dispatched</h3>
                  <span className={styles.modalSubtitle}>Sent to {sentEmailModal.email}</span>
                </div>
              </div>
              <button onClick={() => setSentEmailModal(null)} className={styles.btnCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBodyCompact}>
              <div className={styles.detailRow}>
                <span>Recipient Email:</span>
                <strong>{sentEmailModal.email}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Contact Person:</span>
                <strong>{sentEmailModal.contactPerson}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Email Verification Code:</span>
                <code className={styles.apiKeyCode}>{sentEmailModal.emailCode}</code>
              </div>
              <div className={styles.detailRow}>
                <span>Subject:</span>
                <strong>Welcome to Testo! Partner Verification Code: {sentEmailModal.emailCode}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Dispatch Provider:</span>
                <strong>{sentEmailModal.result?.provider || "Direct API Relay"}</strong>
              </div>

              <div style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", padding: 12, borderRadius: 10, fontSize: 12, color: "#683fe4", marginTop: 12, lineHeight: "1.5" }}>
                <strong>📬 Delivery Note:</strong> Resend dispatched the email in <strong>&lt; 1 second</strong>! If you don't see it in your Primary Inbox, please check your <strong>Spam / Junk folder</strong> or <strong>Promotions tab</strong> (as testing emails from <code>onboarding@resend.dev</code> are categorized by Gmail).
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(sentEmailModal.emailCode);
                  showToast(`Copied Email Code "${sentEmailModal.emailCode}" to clipboard!`, "info");
                }}
                className={styles.btnDraft}
              >
                Copy Email Code
              </button>
              <button
                type="button"
                onClick={() => setSentEmailModal(null)}
                className={styles.btnPrimaryDark}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
