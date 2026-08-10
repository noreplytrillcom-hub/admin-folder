import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Layout Shell
import LayoutShell from "./layouts/LayoutShell";

// Category 1 & 2 Pages
import Login from "./pages/auth/Login";
import DashboardHome from "./pages/dashboard/DashboardHome";
import TicketsPage from "./pages/tickets/TicketsPage";
import AnalyticsHome from "./pages/analytics/AnalyticsHome";
import OrganizationsList from "./pages/organizations/OrganizationsList";
import OrganizationDetail from "./pages/organizations/OrganizationDetail";
import UsersDirectory from "./pages/users/UsersDirectory";
import SubscriptionsManager from "./pages/subscriptions/SubscriptionsManager";
import WorkerPoolManager from "./pages/compute/WorkerPoolManager";
import ExecutionQueue from "./pages/execution/ExecutionQueue";
import AiUsageMetrics from "./pages/ai-usage/AiUsageMetrics";
import InvoicesLedger from "./pages/billing/InvoicesLedger";
import DiscountsManager from "./pages/billing/DiscountsManager";
import AuditLogs from "./pages/audit/AuditLogs";
import MyProfile from "./pages/profile/MyProfile";

// Common Placeholder for upcoming phases
import PagePlaceholder from "./pages/common/PagePlaceholder";

// Legacy Pages maintained for backward compatibility
import UserManagement from "./pages/admin/UserManagement";
import CreateUser from "./pages/admin/CreateUser";
import Clients from "./pages/clients/Clients.jsx";
import EditClient from "./pages/clients/EditClient.jsx";
import PartnerList from "./pages/partners/PartnerList.jsx";
import PartnerRegistration from "./pages/partners/PartnerRegistration";
import PartnerContracts from "./pages/partners/PartnerContracts.jsx";
import EmailLogs from "./pages/admin/EmailLogs";
import ErrorLogs from "./pages/exceptions/ErrorLogs";
import JobLogs from "./pages/job-logs/JobLogs";

// Simplified Authentication Guard Component
const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Standalone Routes (Full Screen Pixel-Perfect Operational Dashboard & Tickets Dashboard) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/op-dashboard" element={<DashboardHome />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/support/tickets" element={<TicketsPage />} />

            {/* Application Shell for Secondary Diagnostic Sub-pages */}
            <Route element={<LayoutShell />}>
              {/* CATEGORY 1: EXECUTIVE & OVERVIEW */}
              <Route path="/analytics" element={<AnalyticsHome />} />

              {/* CATEGORY 2: TENANT & CLIENT MANAGEMENT */}
              <Route path="/organizations" element={<OrganizationsList />} />
              <Route path="/organizations/:id" element={<OrganizationDetail />} />
              <Route path="/users" element={<UsersDirectory />} />
              <Route path="/subscriptions" element={<SubscriptionsManager />} />

              {/* CATEGORY 3: COMPUTE, WORKER & AI INFRASTRUCTURE */}
              <Route path="/compute" element={<WorkerPoolManager />} />
              <Route path="/execution-queue" element={<ExecutionQueue />} />
              <Route path="/ai-usage" element={<AiUsageMetrics />} />

              {/* CATEGORY 4: BILLING, INVOICING & REVENUE */}
              <Route path="/billing/invoices" element={<InvoicesLedger />} />
              <Route path="/billing/discounts" element={<DiscountsManager />} />

              {/* CATEGORY 5: OPERATIONAL CONTROL & SECURITY */}
              <Route path="/gateway" element={<PagePlaceholder title="API Gateway Control & Rate-Limiting Monitor" category="OPERATIONAL CONTROL" description="Monitor 429 Rate-Limit hits, API key generation, and endpoint throttling limits." phase="PHASE 4" />} />
              <Route path="/feature-flags" element={<PagePlaceholder title="Feature Flag Management & Beta Rollouts" category="OPERATIONAL CONTROL" description="Target feature rollouts by percentage (0% to 100%) or specific tenant organization IDs." phase="PHASE 4" />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/security" element={<PagePlaceholder title="Admin Session Security & IP Whitelisting" category="OPERATIONAL CONTROL" description="Manage admin IP allowlists, force MFA resets, and inspect active admin sessions." phase="PHASE 4" />} />

              {/* CATEGORY 6: SUPPORT & SYSTEM DIAGNOSTICS */}
              <Route path="/system-health" element={<PagePlaceholder title="Real-Time Service Health & Cluster Status" category="SUPPORT & DIAGNOSTICS" description="Real-time diagnostic grid monitoring DB clusters, Redis queues, and browser workers." phase="PHASE 4" />} />
              <Route path="/support/tickets" element={<PagePlaceholder title="Test Run Diagnostics & Support Escalations" category="SUPPORT & DIAGNOSTICS" description="Workspace for support engineers to inspect crashed client browser sandboxes and raw logs." phase="PHASE 4" />} />
              <Route path="/settings" element={<PagePlaceholder title="Internal Admin Team & Portal Settings" category="SUPPORT & DIAGNOSTICS" description="Internal Admin User management (Super-Admin, Support, Finance roles) and portal configuration." phase="PHASE 4" />} />

              {/* Supplemental Operator Profile */}
              <Route path="/profile" element={<MyProfile />} />

              {/* Legacy Routes */}
              <Route path="/clients" element={<Clients />} />
              <Route path="/partner-registration" element={<PartnerRegistration />} />
              <Route path="/existing-partners" element={<PartnerList />} />
              <Route path="/partner-contracts" element={<PartnerContracts />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/create" element={<CreateUser />} />
              <Route path="/admin/users/edit/:id" element={<EditClient />} />
              <Route path="/admin/email-logs" element={<EmailLogs />} />
              <Route path="/admin/error-logs" element={<ErrorLogs />} />
              <Route path="/admin/job-logs" element={<JobLogs />} />
            </Route>
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
