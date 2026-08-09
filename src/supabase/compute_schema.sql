-- ============================================================================
-- ENTERPRISE SUPER-ADMIN PORTAL: COMPUTE INFRASTRUCTURE DDL SCHEMA & QUERIES
-- ============================================================================

-- 1. CREATE ENUM TYPES
CREATE TYPE worker_status_enum AS ENUM ('idle', 'busy', 'spawning', 'draining', 'offline');
CREATE TYPE execution_status_enum AS ENUM ('running', 'passed', 'failed', 'timed_out', 'aborted');

-- 2. CREATE WORKER NODES TABLE (Host VM / K8s Pod)
CREATE TABLE IF NOT EXISTS public.worker_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_name VARCHAR(100) NOT NULL UNIQUE,
    host_ip INET NOT NULL,
    region VARCHAR(50) NOT NULL DEFAULT 'us-east-1',
    status worker_status_enum NOT NULL DEFAULT 'idle',
    cpu_utilization_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    ram_utilization_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    max_container_capacity INTEGER NOT NULL DEFAULT 16,
    active_containers_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE CONTAINER SANDBOXES TABLE (Live Playwright / Chromium Containers)
CREATE TABLE IF NOT EXISTS public.container_sandboxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_docker_id VARCHAR(64) NOT NULL UNIQUE,
    worker_node_id UUID NOT NULL REFERENCES public.worker_nodes(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    test_suite_name VARCHAR(150) NOT NULL,
    status execution_status_enum NOT NULL DEFAULT 'running',
    cpu_cores_allocated NUMERIC(4, 2) NOT NULL DEFAULT 2.00,
    ram_mb_allocated INTEGER NOT NULL DEFAULT 2048,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES FOR REAL-TIME MONITORING
CREATE INDEX idx_worker_nodes_status ON public.worker_nodes(status);
CREATE INDEX idx_worker_nodes_region ON public.worker_nodes(region);
CREATE INDEX idx_sandboxes_node_id ON public.container_sandboxes(worker_node_id);
CREATE INDEX idx_sandboxes_org_id ON public.container_sandboxes(organization_id);
CREATE INDEX idx_sandboxes_status ON public.container_sandboxes(status);

-- 5. SQL QUERY (A): AGGREGATING CLUSTER-WIDE COMPUTE TELEMETRY METRICS
SELECT 
    COUNT(w.id) AS total_nodes_count,
    COUNT(w.id) FILTER (WHERE w.status = 'busy') AS busy_nodes_count,
    COUNT(w.id) FILTER (WHERE w.status = 'draining') AS draining_nodes_count,
    COALESCE(AVG(w.cpu_utilization_pct), 0) AS avg_cluster_cpu_pct,
    COALESCE(AVG(w.ram_utilization_pct), 0) AS avg_cluster_ram_pct,
    COALESCE(SUM(w.active_containers_count), 0) AS active_sandboxes_running,
    COALESCE(SUM(w.max_container_capacity), 0) AS total_cluster_capacity
FROM public.worker_nodes w
WHERE w.status != 'offline';

-- 6. SQL QUERY (B): FETCHING LIVE WORKERS & RUNNING CONTAINER ALLOCATIONS
SELECT 
    c.id AS sandbox_id,
    c.container_docker_id,
    c.test_suite_name,
    c.cpu_cores_allocated,
    c.ram_mb_allocated,
    c.duration_seconds,
    c.started_at,
    o.name AS tenant_organization_name,
    w.node_name AS host_worker_node,
    w.host_ip,
    w.region
FROM public.container_sandboxes c
JOIN public.organizations o ON c.organization_id = o.id
JOIN public.worker_nodes w ON c.worker_node_id = w.id
WHERE c.status = 'running'
ORDER BY c.duration_seconds DESC;

-- 7. SQL QUERY (C): ATOMIC EMERGENCY SANDBOX KILL-SWITCH TRANSACTION
BEGIN;

-- Update container sandbox status to aborted
UPDATE public.container_sandboxes
SET 
    status = 'aborted',
    finished_at = NOW()
WHERE id = 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
RETURNING worker_node_id, organization_id, container_docker_id;

-- Decrement host node container count and adjust load
UPDATE public.worker_nodes
SET 
    active_containers_count = GREATEST(0, active_containers_count - 1),
    status = CASE WHEN active_containers_count - 1 = 0 THEN 'idle'::worker_status_enum ELSE status END,
    updated_at = NOW()
WHERE id = (
    SELECT worker_node_id 
    FROM public.container_sandboxes 
    WHERE id = 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
);

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
    'CONTAINER_SANDBOX_TERMINATED',
    (SELECT organization_id FROM public.container_sandboxes WHERE id = 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'),
    '{"status": "running", "container_id": "doc_99182371a"}',
    '{"status": "aborted", "terminated_by": "admin@testo.com", "reason": "Emergency operator kill-switch"}',
    NOW()
);

COMMIT;
