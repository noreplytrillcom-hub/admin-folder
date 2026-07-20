-- ==========================================
-- BILLING SYSTEM TEST DATA
-- ==========================================


-- ==========================================
-- 1. CREATE TEST COMPANIES
-- ==========================================


INSERT INTO companies
(
    id,
    name
)

VALUES

(
    '11111111-1111-1111-1111-111111111111',
    'Test Company One'
),


(
    '22222222-2222-2222-2222-222222222222',
    'Test Company Two'
)

ON CONFLICT DO NOTHING;



-- ==========================================
-- 2. CREATE TEST USERS
-- ==========================================

-- These UUIDs represent Supabase auth.users ids


INSERT INTO user_companies
(
    user_id,
    company_id
)

VALUES


(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111'
),


(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222'
)

ON CONFLICT DO NOTHING;





-- ==========================================
-- 3. USER ROLES
-- ==========================================


INSERT INTO user_roles
(
    user_id,
    company_id,
    role
)

VALUES


(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'company_admin'
),


(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'company_admin'
)

ON CONFLICT DO NOTHING;





-- ==========================================
-- 4. BILLING PROFILES
-- ==========================================


INSERT INTO billing_profiles
(
    company_id,
    company_name,
    billing_email,
    phone,
    address,
    city,
    state,
    country,
    gst_number
)

VALUES


(
'11111111-1111-1111-1111-111111111111',
'Test Company One',
'billing@testcompanyone.com',
'9999999999',
'MG Road',
'Pune',
'Maharashtra',
'India',
'GST123456'
),


(
'22222222-2222-2222-2222-222222222222',
'Test Company Two',
'billing@testcompanytwo.com',
'8888888888',
'Park Street',
'Mumbai',
'Maharashtra',
'India',
'GST789456'
);





-- ==========================================
-- 5. TEST SUBSCRIPTIONS
-- ==========================================


INSERT INTO subscriptions
(
company_id,
plan_id,
status,
billing_cycle,
auto_renew,
start_date,
end_date,
next_invoice_date
)


SELECT

'11111111-1111-1111-1111-111111111111',

id,

'active',

'monthly',

true,

NOW(),

NOW() + INTERVAL '30 days',

NOW() + INTERVAL '30 days'


FROM plans

WHERE name='Starter';





INSERT INTO subscriptions
(
company_id,
plan_id,
status,
billing_cycle,
auto_renew,
start_date,
end_date,
next_invoice_date
)


SELECT

'22222222-2222-2222-2222-222222222222',

id,

'active',

'monthly',

true,

NOW(),

NOW() + INTERVAL '30 days',

NOW() + INTERVAL '30 days'


FROM plans

WHERE name='Business';





-- ==========================================
-- 6. PAYMENT METHODS
-- ==========================================


INSERT INTO payment_methods
(
company_id,
provider,
type,
last_four,
is_default
)

VALUES


(
'11111111-1111-1111-1111-111111111111',
'Razorpay',
'upi',
'7890',
true
),


(
'22222222-2222-2222-2222-222222222222',
'Stripe',
'card',
'4242',
true
);





-- ==========================================
-- 7. TEST INVOICES
-- ==========================================


INSERT INTO invoices
(
company_id,
subscription_id,
status,
subtotal,
tax,
total,
due_date
)


SELECT

s.company_id,

s.id,

'paid',

999,

179.82,

1178.82,

NOW() + INTERVAL '7 days'


FROM subscriptions s


WHERE s.company_id =
'11111111-1111-1111-1111-111111111111';





INSERT INTO invoices
(
company_id,
subscription_id,
status,
subtotal,
tax,
total,
due_date
)


SELECT

s.company_id,

s.id,

'open',

2999,

539.82,

3538.82,

NOW() + INTERVAL '7 days'


FROM subscriptions s


WHERE s.company_id =
'22222222-2222-2222-2222-222222222222';






-- ==========================================
-- 8. INVOICE ITEMS
-- ==========================================


INSERT INTO invoice_items
(
invoice_id,
description,
quantity,
unit_price,
amount
)


SELECT

id,

'Starter Monthly Subscription',

1,

999,

999


FROM invoices

WHERE company_id =
'11111111-111111-1111-1111-111111111111';





INSERT INTO invoice_items
(
invoice_id,
description,
quantity,
unit_price,
amount
)


SELECT

id,

'Business Monthly Subscription',

1,

2999,

2999


FROM invoices

WHERE company_id =
'22222222-2222-2222-2222-222222222222';







-- ==========================================
-- 9. BILLING EVENTS
-- ==========================================


INSERT INTO billing_events
(
company_id,
event_type,
payload
)

VALUES


(
'11111111-1111-1111-1111-111111111111',
'subscription.created',
'{
"plan":"Starter",
"status":"active"
}'
),


(
'22222222-2222-2222-2222-222222222222',
'invoice.created',
'{
"amount":3538.82
}'
);







-- ==========================================
-- 10. VERIFY DATA
-- ==========================================


SELECT
*
FROM companies;


SELECT
*
FROM subscriptions;


SELECT
*
FROM invoices;


SELECT
*
FROM billing_events;