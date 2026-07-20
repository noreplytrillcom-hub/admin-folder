-- ==========================================
-- BILLING SYSTEM DATABASE SCHEMA
-- Supabase PostgreSQL
-- ==========================================


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ==========================================
-- PLANS
-- ==========================================

CREATE TABLE IF NOT EXISTS plans (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT NOT NULL,

    description TEXT,

    price NUMERIC(12,2) NOT NULL DEFAULT 0,

    currency TEXT DEFAULT 'INR',

    billing_cycle TEXT NOT NULL
        CHECK(
            billing_cycle IN(
                'monthly',
                'yearly'
            )
        ),

    features JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- BILLING PROFILES
-- ==========================================

CREATE TABLE IF NOT EXISTS billing_profiles (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    company_id UUID NOT NULL,

    company_name TEXT NOT NULL,

    billing_email TEXT,

    phone TEXT,

    address TEXT,

    city TEXT,

    state TEXT,

    country TEXT DEFAULT 'India',

    gst_number TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================


CREATE TABLE IF NOT EXISTS subscriptions (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    company_id UUID NOT NULL,

    plan_id UUID REFERENCES plans(id)
        ON DELETE RESTRICT,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK(
            status IN(
                'trialing',
                'active',
                'past_due',
                'cancelled',
                'expired'
            )
        ),

    billing_cycle TEXT NOT NULL,

    auto_renew BOOLEAN DEFAULT TRUE,


    start_date TIMESTAMPTZ DEFAULT NOW(),

    end_date TIMESTAMPTZ,

    next_invoice_date TIMESTAMPTZ,


    cancelled_at TIMESTAMPTZ,


    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- PAYMENT METHODS
-- ==========================================


CREATE TABLE IF NOT EXISTS payment_methods (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    company_id UUID NOT NULL,


    provider TEXT,

    type TEXT
        CHECK(
            type IN(
                'card',
                'upi',
                'bank'
            )
        ),


    last_four TEXT,


    is_default BOOLEAN DEFAULT FALSE,


    metadata JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- INVOICES
-- ==========================================


CREATE TABLE IF NOT EXISTS invoices (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),


    company_id UUID NOT NULL,


    subscription_id UUID
        REFERENCES subscriptions(id),


    invoice_number TEXT UNIQUE,


    status TEXT DEFAULT 'draft'
        CHECK(
            status IN(
                'draft',
                'open',
                'paid',
                'failed',
                'void'
            )
        ),


    subtotal NUMERIC(12,2) DEFAULT 0,


    tax NUMERIC(12,2) DEFAULT 0,


    total NUMERIC(12,2) DEFAULT 0,


    currency TEXT DEFAULT 'INR',


    due_date TIMESTAMPTZ,


    paid_at TIMESTAMPTZ,


    created_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- INVOICE ITEMS
-- ==========================================


CREATE TABLE IF NOT EXISTS invoice_items (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),


    invoice_id UUID REFERENCES invoices(id)
        ON DELETE CASCADE,


    description TEXT,


    quantity INTEGER DEFAULT 1,


    unit_price NUMERIC(12,2),


    amount NUMERIC(12,2),


    created_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- BILLING EVENTS
-- ==========================================


CREATE TABLE IF NOT EXISTS billing_events (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),


    company_id UUID NOT NULL,


    event_type TEXT NOT NULL,


    payload JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- PLAN HISTORY
-- ==========================================


CREATE TABLE IF NOT EXISTS plan_history (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),


    company_id UUID NOT NULL,


    old_plan UUID REFERENCES plans(id),


    new_plan UUID REFERENCES plans(id),


    changed_by UUID,


    created_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- BILLING SETTINGS
-- ==========================================


CREATE TABLE IF NOT EXISTS billing_settings (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),


    company_id UUID UNIQUE NOT NULL,


    auto_invoice BOOLEAN DEFAULT TRUE,


    invoice_prefix TEXT DEFAULT 'INV',


    payment_grace_period INTEGER DEFAULT 7,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ==========================================
-- INDEXES
-- ==========================================


CREATE INDEX idx_subscription_company
ON subscriptions(company_id);


CREATE INDEX idx_invoice_company
ON invoices(company_id);


CREATE INDEX idx_events_company
ON billing_events(company_id);


CREATE INDEX idx_payment_company
ON payment_methods(company_id);


CREATE INDEX idx_plan_history_company
ON plan_history(company_id);