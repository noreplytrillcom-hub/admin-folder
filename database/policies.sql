-- ==========================================
-- BILLING SYSTEM RLS POLICIES
-- Supabase Row Level Security
-- ==========================================



-- ==========================================
-- ENABLE RLS
-- ==========================================


ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

ALTER TABLE billing_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE plan_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;





-- ==========================================
-- HELPER FUNCTION
-- CHECK USER COMPANY ACCESS
-- ==========================================


CREATE OR REPLACE FUNCTION user_has_company_access(
    company UUID
)

RETURNS BOOLEAN

AS $$

BEGIN

RETURN EXISTS
(
    SELECT 1

    FROM user_companies

    WHERE user_id = auth.uid()

    AND company_id = company
);

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;





-- ==========================================
-- PLANS
-- Everyone can view active plans
-- ==========================================


CREATE POLICY "view active plans"

ON plans

FOR SELECT

USING
(
    is_active = true
);





-- ==========================================
-- COMPANY ISOLATION
-- BILLING PROFILES
-- ==========================================


CREATE POLICY "company billing profiles"

ON billing_profiles

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================


CREATE POLICY "company subscriptions"

ON subscriptions

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- PAYMENT METHODS
-- ==========================================


CREATE POLICY "company payment methods"

ON payment_methods

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- INVOICES
-- ==========================================


CREATE POLICY "company invoices"

ON invoices

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- INVOICE ITEMS
-- ==========================================


CREATE POLICY "invoice items access"

ON invoice_items

FOR ALL

USING
(
    EXISTS
    (

        SELECT 1

        FROM invoices

        WHERE invoices.id = invoice_items.invoice_id

        AND user_has_company_access(
            invoices.company_id
        )

    )
);





-- ==========================================
-- BILLING EVENTS
-- ==========================================


CREATE POLICY "company billing events"

ON billing_events

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- PLAN HISTORY
-- ==========================================


CREATE POLICY "company plan history"

ON plan_history

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- BILLING SETTINGS
-- ==========================================


CREATE POLICY "company billing settings"

ON billing_settings

FOR ALL

USING
(
    user_has_company_access(company_id)
);





-- ==========================================
-- COMPANIES
-- ==========================================


CREATE POLICY "company access"

ON companies

FOR SELECT

USING
(
    user_has_company_access(id)
);





-- ==========================================
-- USER COMPANY MAPPING
-- ==========================================


CREATE POLICY "users see own companies"

ON user_companies

FOR SELECT

USING
(
    user_id = auth.uid()
);





-- ==========================================
-- USER ROLES
-- ==========================================


CREATE POLICY "users see own roles"

ON user_roles

FOR SELECT

USING
(
    user_id = auth.uid()
);





-- ==========================================
-- ADMIN WRITE ACCESS
-- ==========================================


CREATE OR REPLACE FUNCTION is_company_admin(
    company UUID
)

RETURNS BOOLEAN

AS $$

BEGIN

RETURN EXISTS
(

SELECT 1

FROM user_roles

WHERE user_id = auth.uid()

AND company_id = company

AND role IN
(
'company_admin',
'super_admin'
)

);

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;