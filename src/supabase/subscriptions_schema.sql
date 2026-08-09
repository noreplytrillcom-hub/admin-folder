-- ============================================================================
-- ENTERPRISE SUPER-ADMIN PORTAL: SUBSCRIPTIONS DDL SCHEMA & PRODUCTION QUERIES
-- ============================================================================

-- 1. CREATE ENUM TYPES
CREATE TYPE plan_tier_enum AS ENUM ('starter', 'growth', 'enterprise', 'custom');
CREATE TYPE billing_cycle_enum AS ENUM ('monthly', 'annual');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'past_due', 'canceled', 'trialing');

-- 2. CREATE SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_tier plan_tier_enum NOT NULL DEFAULT 'starter',
    status subscription_status_enum NOT NULL DEFAULT 'active',
    billing_cycle billing_cycle_enum NOT NULL DEFAULT 'monthly',
    mrr_amount NUMERIC(12, 2) NOT NULL DEFAULT 299.00,
    concurrent_slots INTEGER NOT NULL DEFAULT 15,
    monthly_minutes_quota INTEGER NOT NULL DEFAULT 15000,
    sla_guarantee VARCHAR(50) NOT NULL DEFAULT '99.5%',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
CREATE INDEX idx_subscriptions_org_id ON public.subscriptions(organization_id);
CREATE INDEX idx_subscriptions_plan_tier ON public.subscriptions(plan_tier);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_mrr ON public.subscriptions(mrr_amount DESC);

-- 4. SQL QUERY (A): AGGREGATING SUBSCRIPTION MRR METRICS AND TIER COUNTS
SELECT 
    COALESCE(SUM(mrr_amount), 0) AS total_mrr,
    COUNT(id) FILTER (WHERE status = 'active') AS active_subscriptions_count,
    COUNT(id) FILTER (WHERE plan_tier = 'starter') AS starter_count,
    COUNT(id) FILTER (WHERE plan_tier = 'growth') AS growth_count,
    COUNT(id) FILTER (WHERE plan_tier = 'enterprise') AS enterprise_count,
    COUNT(id) FILTER (WHERE plan_tier = 'custom') AS custom_count
FROM public.subscriptions;

-- 5. SQL QUERY (B): FETCHING PAGINATED SUBSCRIPTIONS FILTERED BY TENANT & TIER
SELECT 
    s.id AS subscription_id,
    o.id AS organization_id,
    o.name AS organization_name,
    o.admin_email,
    s.plan_tier,
    s.status,
    s.billing_cycle,
    s.mrr_amount,
    s.concurrent_slots,
    s.monthly_minutes_quota,
    s.sla_guarantee,
    s.current_period_end,
    s.updated_at
FROM public.subscriptions s
JOIN public.organizations o ON s.organization_id = o.id
WHERE 
    ($1::TEXT IS NULL OR o.name ILIKE '%' || $1 || '%' OR o.admin_email ILIKE '%' || $1 || '%')
    AND ($2::plan_tier_enum IS NULL OR s.plan_tier = $2)
ORDER BY s.mrr_amount DESC, s.updated_at DESC
LIMIT $3 OFFSET $4;

-- 6. SQL QUERY (C): ATOMIC TRANSACTION TO OVERRIDE PLAN TIER, QUOTAS & APPEND AUDIT LOG
BEGIN;

-- Update target subscription record and compute quota defaults
UPDATE public.subscriptions
SET 
    plan_tier = 'custom',
    mrr_amount = 3500.00,
    concurrent_slots = 100,
    monthly_minutes_quota = 500000,
    sla_guarantee = '99.99%',
    updated_at = NOW()
WHERE organization_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Update parent organization active limits
UPDATE public.organizations
SET 
    concurrent_slots = 100,
    monthly_minutes_quota = 500000,
    updated_at = NOW()
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

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
    'admin@testo.com',
    'Super-Admin',
    'SUBSCRIPTION_PLAN_OVERRIDDEN',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"plan_tier": "growth", "mrr_amount": 899.00, "concurrent_slots": 50}',
    '{"plan_tier": "custom", "mrr_amount": 3500.00, "concurrent_slots": 100, "sla": "99.99%"}',
    NOW()
);

COMMIT;
