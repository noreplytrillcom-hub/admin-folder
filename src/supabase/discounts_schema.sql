-- ============================================================================
-- ENTERPRISE SUPER-ADMIN PORTAL: CREDITS & COUPONS DDL SCHEMA & QUERIES
-- ============================================================================

-- 1. CREATE ENUM TYPES
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed_usd');
CREATE TYPE credit_reason_enum AS ENUM ('sla_breach_compensation', 'goodwill', 'beta_testing_grant', 'overbill_refund', 'promotional');

-- 2. CREATE COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type discount_type_enum NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL,
    max_redemptions INTEGER NOT NULL DEFAULT 100,
    current_redemptions INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE TENANT SERVICE CREDITS TABLE
CREATE TABLE IF NOT EXISTS public.tenant_service_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    amount_usd NUMERIC(10, 2) NOT NULL,
    balance_remaining_usd NUMERIC(10, 2) NOT NULL,
    reason credit_reason_enum NOT NULL DEFAULT 'goodwill',
    notes TEXT,
    issued_by_admin_email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active);
CREATE INDEX idx_credits_org_id ON public.tenant_service_credits(organization_id);
CREATE INDEX idx_credits_reason ON public.tenant_service_credits(reason);

-- 5. QUERY (A): AGGREGATING CREDITS & COUPONS TELEMETRY METRICS
SELECT 
    COUNT(c.id) FILTER (WHERE c.is_active = TRUE) AS active_coupons_count,
    COALESCE(SUM(c.current_redemptions * c.discount_value), 0) AS total_redeemed_savings_usd,
    COALESCE((SELECT SUM(balance_remaining_usd) FROM public.tenant_service_credits), 0) AS tenant_active_credits_balance_usd,
    COALESCE((SELECT SUM(amount_usd) FROM public.tenant_service_credits WHERE created_at >= NOW() - INTERVAL '30 days'), 0) AS credits_issued_last_30d_usd;

-- 6. QUERY (B): LISTING ACTIVE COUPONS AND REDEMPTION PROGRESS
SELECT 
    id,
    code,
    discount_type,
    discount_value,
    current_redemptions,
    max_redemptions,
    expires_at,
    is_active,
    created_at
FROM public.coupons
ORDER BY is_active DESC, created_at DESC;

-- 7. QUERY (C): ATOMIC TRANSACTION TO ISSUE TENANT SERVICE CREDIT & AUDIT LOG
BEGIN;

-- Insert new service credit record
INSERT INTO public.tenant_service_credits (
    organization_id,
    amount_usd,
    balance_remaining_usd,
    reason,
    notes,
    issued_by_admin_email,
    expires_at,
    created_at
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    500.00,
    500.00,
    'sla_breach_compensation',
    'Compensation for 45-min worker node outage on Aug 2',
    'support-lead@testo.com',
    NOW() + INTERVAL '1 year',
    NOW()
);

-- Append entry into immutable audit log
INSERT INTO public.audit_logs (
    admin_email,
    admin_role,
    action_type,
    target_tenant_id,
    payload_before,
    payload_after,
    created_at
) VALUES (
    'support-lead@testo.com',
    'Super-Admin',
    'SERVICE_CREDIT_GRANTED',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"active_credit_balance": 0.00}',
    '{"granted_amount": 500.00, "reason": "sla_breach_compensation"}',
    NOW()
);

COMMIT;
