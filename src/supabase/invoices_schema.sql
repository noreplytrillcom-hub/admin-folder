-- ============================================================================
-- ENTERPRISE SUPER-ADMIN PORTAL: INVOICING & PAYMENT LEDGER DDL & QUERIES
-- ============================================================================

-- 1. CREATE ENUM TYPES
CREATE TYPE invoice_status_enum AS ENUM ('paid', 'pending', 'overdue', 'failed', 'voided', 'refunded');
CREATE TYPE payment_method_enum AS ENUM ('stripe_cc', 'ach_wire', 'manual_credit', 'wire_transfer');

-- 2. CREATE INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    subtotal_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status invoice_status_enum NOT NULL DEFAULT 'pending',
    stripe_invoice_id VARCHAR(100),
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE PAYMENT TRANSACTIONS AUDIT LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    amount_usd NUMERIC(12, 2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    transaction_reference VARCHAR(150) NOT NULL,
    notes TEXT,
    processed_by_admin_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES FOR FAST INVOICE LOOKUPS
CREATE INDEX idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_org_id ON public.invoices(organization_id);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);

-- 5. QUERY (A): AGGREGATING PLATFORM FINANCIAL METRICS
SELECT 
    COALESCE(SUM(total_usd) FILTER (WHERE status = 'paid'), 0) AS total_collected_usd,
    COALESCE(SUM(total_usd) FILTER (WHERE status = 'pending'), 0) AS pending_receivables_usd,
    COALESCE(SUM(total_usd) FILTER (WHERE status = 'overdue'), 0) AS overdue_receivables_usd,
    COUNT(id) FILTER (WHERE status = 'overdue') AS overdue_invoice_count,
    COUNT(id) FILTER (WHERE status = 'failed') AS failed_charge_retries_count
FROM public.invoices;

-- 6. QUERY (B): PAGINATED INVOICE SEARCH QUERY
SELECT 
    i.id AS invoice_id,
    i.invoice_number,
    i.organization_id,
    o.name AS organization_name,
    o.admin_email,
    i.total_usd,
    i.status,
    i.due_date,
    i.paid_at,
    i.created_at
FROM public.invoices i
JOIN public.organizations o ON i.organization_id = o.id
WHERE 
    ($1::TEXT IS NULL OR i.invoice_number ILIKE '%' || $1 || '%' OR o.name ILIKE '%' || $1 || '%')
    AND ($2::invoice_status_enum IS NULL OR i.status = $2)
ORDER BY i.created_at DESC
LIMIT $3 OFFSET $4;

-- 7. QUERY (C): ATOMIC TRANSACTION TO RECORD MANUAL PAYMENT & APPEND AUDIT LOG
BEGIN;

-- Update target invoice status to paid
UPDATE public.invoices
SET 
    status = 'paid',
    paid_at = NOW(),
    updated_at = NOW()
WHERE id = 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
RETURNING organization_id, total_usd, invoice_number;

-- Record payment transaction ledger entry
INSERT INTO public.payment_transactions (
    invoice_id,
    organization_id,
    amount_usd,
    payment_method,
    transaction_reference,
    notes,
    processed_by_admin_email,
    created_at
) VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    2499.00,
    'wire_transfer',
    'WIRE-2026-9812401',
    'Manual ACH Wire settled by finance team',
    'finance-admin@testo.com',
    NOW()
);

-- Append entry to audit logs
INSERT INTO public.audit_logs (
    admin_email,
    admin_role,
    action_type,
    target_tenant_id,
    payload_before,
    payload_after,
    created_at
) VALUES (
    'finance-admin@testo.com',
    'Super-Admin',
    'INVOICE_MANUALLY_SETTLED',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"status": "overdue", "invoice_number": "INV-2026-004"}',
    '{"status": "paid", "payment_method": "wire_transfer", "reference": "WIRE-2026-9812401"}',
    NOW()
);

COMMIT;
