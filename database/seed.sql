-- ==========================================
-- BILLING SYSTEM SEED DATA
-- Supabase PostgreSQL
-- ==========================================


-- ==========================================
-- DEFAULT PLANS
-- ==========================================


INSERT INTO plans
(
    name,
    description,
    price,
    currency,
    billing_cycle,
    features,
    is_active
)

VALUES


(
    'Free',
    'Free plan for small teams testing the platform',
    0,
    'INR',
    'monthly',

    '{
        "users": 5,
        "storage_gb": 1,
        "projects": 3,
        "support": "community"
    }',

    true
),



(
    'Starter',
    'Starter plan for growing companies',
    999,
    'INR',
    'monthly',

    '{
        "users": 25,
        "storage_gb": 20,
        "projects": 20,
        "support": "email",
        "analytics": true
    }',

    true
),



(
    'Business',
    'Business plan for established companies',
    2999,
    'INR',
    'monthly',

    '{
        "users": 100,
        "storage_gb": 100,
        "projects": 100,
        "support": "priority",
        "analytics": true,
        "api_access": true
    }',

    true
),



(
    'Enterprise',
    'Custom enterprise solution',
    9999,
    'INR',
    'monthly',

    '{
        "users": "unlimited",
        "storage_gb": "unlimited",
        "projects": "unlimited",
        "support": "dedicated",
        "analytics": true,
        "api_access": true,
        "sso": true
    }',

    true
);



-- ==========================================
-- BILLING SETTINGS TEMPLATE
-- ==========================================

-- Example:
-- These will normally be created when a company signs up

/*
INSERT INTO billing_settings
(
company_id,
auto_invoice,
invoice_prefix,
payment_grace_period
)

VALUES
(
'COMPANY_UUID',
true,
'INV',
7
);
*/


-- ==========================================
-- VERIFY PLANS
-- ==========================================

SELECT
    id,
    name,
    price,
    billing_cycle,
    features
FROM plans
ORDER BY price;