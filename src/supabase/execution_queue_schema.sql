-- ============================================================================
-- ENTERPRISE SUPER-ADMIN PORTAL: EXECUTION QUEUE DDL SCHEMA & QUERIES
-- ============================================================================

-- 1. CREATE ENUM TYPES
CREATE TYPE queue_status_enum AS ENUM ('queued', 'dispatched', 'executing', 'completed', 'failed', 'cancelled', 'timeout');
CREATE TYPE queue_priority_enum AS ENUM ('p0_critical', 'p1_high', 'p2_standard', 'p3_background');

-- 2. CREATE EXECUTION QUEUE TABLE
CREATE TABLE IF NOT EXISTS public.execution_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    test_suite_id UUID,
    test_suite_name VARCHAR(150) NOT NULL,
    priority queue_priority_enum NOT NULL DEFAULT 'p2_standard',
    status queue_status_enum NOT NULL DEFAULT 'queued',
    worker_node_id UUID REFERENCES public.worker_nodes(id) ON DELETE SET NULL,
    estimated_duration_seconds INTEGER NOT NULL DEFAULT 120,
    wait_time_seconds INTEGER NOT NULL DEFAULT 0,
    retry_count INTEGER NOT NULL DEFAULT 0,
    enqueued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dispatched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 3. PERFORMANCE INDEXES FOR QUEUE POLLING & DISPATCHING
CREATE INDEX idx_queue_poll_order ON public.execution_queue(priority ASC, enqueued_at ASC) WHERE status = 'queued';
CREATE INDEX idx_queue_status ON public.execution_queue(status);
CREATE INDEX idx_queue_org_id ON public.execution_queue(organization_id);

-- 4. QUERY (A): AGGREGATING REAL-TIME QUEUE TELEMETRY METRICS
SELECT 
    COUNT(q.id) FILTER (WHERE q.status IN ('queued', 'dispatched', 'executing')) AS total_active_queue_depth,
    COUNT(q.id) FILTER (WHERE q.status = 'queued') AS pending_queued_count,
    COUNT(q.id) FILTER (WHERE q.status = 'queued' AND q.priority = 'p0_critical') AS p0_critical_backlog_count,
    COALESCE(AVG(q.wait_time_seconds) FILTER (WHERE q.status = 'queued'), 0) AS avg_queue_wait_seconds,
    COALESCE(SUM(q.estimated_duration_seconds) FILTER (WHERE q.status = 'queued'), 0) / 60 AS est_backlog_clear_minutes
FROM public.execution_queue q;

-- 5. QUERY (B): FETCHING PRIORITY-ORDERED LIVE QUEUE STREAM
SELECT 
    q.id AS queue_item_id,
    q.test_suite_name,
    q.priority,
    q.status,
    q.wait_time_seconds,
    q.estimated_duration_seconds,
    q.enqueued_at,
    o.name AS organization_name,
    w.node_name AS assigned_worker_node
FROM public.execution_queue q
JOIN public.organizations o ON q.organization_id = o.id
LEFT JOIN public.worker_nodes w ON q.worker_node_id = w.id
WHERE 
    ($1::queue_status_enum IS NULL OR q.status = $1)
    AND ($2::queue_priority_enum IS NULL OR q.priority = $2)
ORDER BY 
    CASE q.priority 
        WHEN 'p0_critical' THEN 1 
        WHEN 'p1_high' THEN 2 
        WHEN 'p2_standard' THEN 3 
        ELSE 4 
    END,
    q.enqueued_at ASC
LIMIT $3 OFFSET $4;

-- 6. QUERY (C): ATOMIC EMERGENCY TRANSACTION TO FLUSH TENANT QUEUE & AUDIT LOG
BEGIN;

-- Cancel all queued items for target tenant
UPDATE public.execution_queue
SET 
    status = 'cancelled',
    completed_at = NOW()
WHERE organization_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  AND status = 'queued';

-- Append entry to immutable audit log
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
    'EXECUTION_QUEUE_FLUSHED',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"status": "queued"}',
    '{"status": "cancelled", "flushed_by": "admin@testo.com", "reason": "Emergency tenant queue flush"}',
    NOW()
);

COMMIT;
