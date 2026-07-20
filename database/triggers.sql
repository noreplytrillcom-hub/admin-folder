-- ==========================================
-- BILLING SYSTEM TRIGGERS
-- Supabase PostgreSQL
-- ==========================================


-- ==========================================
-- 1. UPDATED_AT AUTOMATION FUNCTION
-- ==========================================


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
AS $$

BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;

$$ LANGUAGE plpgsql;



-- Apply updated_at trigger


CREATE TRIGGER plans_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();



CREATE TRIGGER billing_profiles_updated_at
BEFORE UPDATE ON billing_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();



CREATE TRIGGER subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();



CREATE TRIGGER billing_settings_updated_at
BEFORE UPDATE ON billing_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();





-- ==========================================
-- 2. INVOICE NUMBER GENERATION
-- ==========================================


CREATE SEQUENCE IF NOT EXISTS invoice_number_sequence
START 1;



CREATE OR REPLACE FUNCTION generate_invoice_number()

RETURNS TRIGGER

AS $$

BEGIN


NEW.invoice_number =

'INV-' ||

EXTRACT(YEAR FROM NOW()) ||

'-' ||

LPAD(
nextval('invoice_number_sequence')::TEXT,
6,
'0'
);


RETURN NEW;


END;

$$ LANGUAGE plpgsql;




CREATE TRIGGER invoice_number_generator

BEFORE INSERT ON invoices

FOR EACH ROW

WHEN (NEW.invoice_number IS NULL)

EXECUTE FUNCTION generate_invoice_number();





-- ==========================================
-- 3. SUBSCRIPTION STATUS AUTOMATION
-- ==========================================


CREATE OR REPLACE FUNCTION check_subscription_expiry()

RETURNS TRIGGER

AS $$

BEGIN


IF NEW.end_date IS NOT NULL

AND NEW.end_date < NOW()

THEN


NEW.status = 'expired';


END IF;


RETURN NEW;


END;


$$ LANGUAGE plpgsql;





CREATE TRIGGER subscription_expiry_check

BEFORE INSERT OR UPDATE

ON subscriptions

FOR EACH ROW

EXECUTE FUNCTION check_subscription_expiry();






-- ==========================================
-- 4. BILLING EVENT CREATION
-- ==========================================


CREATE OR REPLACE FUNCTION create_billing_event()

RETURNS TRIGGER

AS $$


BEGIN



INSERT INTO billing_events

(
company_id,
event_type,
payload
)


VALUES

(
NEW.company_id,
TG_ARGV[0],
row_to_json(NEW)
);



RETURN NEW;


END;


$$ LANGUAGE plpgsql;





-- Subscription Created


CREATE TRIGGER subscription_created_event

AFTER INSERT ON subscriptions

FOR EACH ROW

EXECUTE FUNCTION create_billing_event(
'subscription.created'
);





-- Subscription Updated


CREATE TRIGGER subscription_updated_event

AFTER UPDATE ON subscriptions

FOR EACH ROW

EXECUTE FUNCTION create_billing_event(
'subscription.updated'
);





-- Invoice Created


CREATE TRIGGER invoice_created_event

AFTER INSERT ON invoices

FOR EACH ROW

EXECUTE FUNCTION create_billing_event(
'invoice.created'
);





-- Invoice Paid


CREATE OR REPLACE FUNCTION invoice_paid_event()

RETURNS TRIGGER

AS $$


BEGIN


IF NEW.status='paid'

AND OLD.status <> 'paid'

THEN


INSERT INTO billing_events

(
company_id,
event_type,
payload
)


VALUES

(
NEW.company_id,
'payment.success',
row_to_json(NEW)
);


END IF;



RETURN NEW;


END;


$$ LANGUAGE plpgsql;





CREATE TRIGGER invoice_payment_event

AFTER UPDATE ON invoices

FOR EACH ROW

EXECUTE FUNCTION invoice_paid_event();







-- ==========================================
-- 5. PLAN CHANGE HISTORY
-- ==========================================



CREATE OR REPLACE FUNCTION save_plan_history()

RETURNS TRIGGER

AS $$


BEGIN



IF OLD.plan_id <> NEW.plan_id

THEN


INSERT INTO plan_history

(
company_id,
old_plan,
new_plan
)


VALUES

(
NEW.company_id,
OLD.plan_id,
NEW.plan_id
);


END IF;



RETURN NEW;


END;


$$ LANGUAGE plpgsql;






CREATE TRIGGER subscription_plan_change_history

AFTER UPDATE ON subscriptions

FOR EACH ROW

EXECUTE FUNCTION save_plan_history();






-- ==========================================
-- 6. AUTO CREATE BILLING SETTINGS
-- ==========================================


CREATE OR REPLACE FUNCTION create_default_billing_settings()

RETURNS TRIGGER

AS $$


BEGIN



INSERT INTO billing_settings

(
company_id
)


VALUES

(
NEW.company_id
);



RETURN NEW;



END;


$$ LANGUAGE plpgsql;






CREATE TRIGGER create_company_billing_settings

AFTER INSERT ON subscriptions

FOR EACH ROW

EXECUTE FUNCTION create_default_billing_settings();





-- ==========================================
-- END OF TRIGGERS
-- ==========================================