-- ============================================================================
-- ENTERPRISE SUPER-ADMIN PORTAL: LLM TOKEN & AI USAGE DDL SCHEMA & QUERIES
-- ============================================================================

-- 1. CREATE ENUM TYPES
CREATE TYPE ai_agent_type_enum AS ENUM ('test_creator', 'script_compiler', 'self_healing', 'dom_parser');
CREATE TYPE llm_provider_enum AS ENUM ('openai', 'anthropic', 'google_gemini', 'local_ollama');

-- 2. CREATE LLM MODEL PRICING RATE CARDS TABLE
CREATE TABLE IF NOT EXISTS public.llm_model_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL UNIQUE,
    provider llm_provider_enum NOT NULL,
    prompt_usd_per_1k_tokens NUMERIC(10, 6) NOT NULL,
    completion_usd_per_1k_tokens NUMERIC(10, 6) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE LLM USAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.llm_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    agent_type ai_agent_type_enum NOT NULL,
    model_name VARCHAR(100) NOT NULL REFERENCES public.llm_model_pricing(model_name),
    provider llm_provider_enum NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER GENERATED ALWAYS AS (prompt_tokens + completion_tokens) STORED,
    cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0.000000,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES FOR FAST TELEMETRY AGGREGATION
CREATE INDEX idx_llm_logs_org_date ON public.llm_usage_logs(organization_id, created_at DESC);
CREATE INDEX idx_llm_logs_agent_type ON public.llm_usage_logs(agent_type);
CREATE INDEX idx_llm_logs_provider ON public.llm_usage_logs(provider);

-- 5. QUERY (A): AGGREGATE PLATFORM-WIDE LLM TELEMETRY METRICS
SELECT 
    COALESCE(SUM(cost_usd), 0) AS total_llm_spend_usd,
    COALESCE(SUM(prompt_tokens), 0) AS total_prompt_tokens,
    COALESCE(SUM(completion_tokens), 0) AS total_completion_tokens,
    COALESCE(SUM(total_tokens), 0) AS grand_total_tokens,
    COALESCE(AVG(latency_ms), 0) AS avg_llm_latency_ms
FROM public.llm_usage_logs
WHERE created_at >= NOW() - INTERVAL '30 days';

-- 6. QUERY (B): PER-TENANT TOKEN & AI COST RANKING QUERY
SELECT 
    o.id AS organization_id,
    o.name AS organization_name,
    COUNT(l.id) AS total_agent_calls,
    SUM(l.prompt_tokens) AS prompt_tokens,
    SUM(l.completion_tokens) AS completion_tokens,
    SUM(l.total_tokens) AS total_tokens,
    SUM(l.cost_usd) AS total_cost_usd,
    MODE() WITHIN GROUP (ORDER BY l.model_name) AS primary_llm_model
FROM public.llm_usage_logs l
JOIN public.organizations o ON l.organization_id = o.id
WHERE l.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.id, o.name
ORDER BY total_cost_usd DESC;

-- 7. QUERY (C): AGENT TYPE COST BREAKDOWN QUERY
SELECT 
    l.agent_type,
    COUNT(l.id) AS total_calls,
    SUM(l.total_tokens) AS total_tokens,
    SUM(l.cost_usd) AS total_spend_usd,
    AVG(l.latency_ms) AS avg_latency_ms
FROM public.llm_usage_logs l
WHERE l.created_at >= NOW() - INTERVAL '30 days'
GROUP BY l.agent_type
ORDER BY total_spend_usd DESC;
