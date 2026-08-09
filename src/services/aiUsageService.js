// Mock API Service Layer for Page 9 AI Usage Analytics

const INITIAL_TENANT_SPEND = [
  {
    organizationId: "org-101",
    organizationName: "Apex Cognitive Systems",
    totalAgentCalls: 14250,
    promptTokens: 18500000,
    completionTokens: 4200000,
    totalTokens: 22700000,
    totalCostUsd: 1245.80,
    primaryLlmModel: "gpt-4o",
    primaryProvider: "openai",
  },
  {
    organizationId: "org-104",
    organizationName: "Hyperion AI Networks",
    totalAgentCalls: 9800,
    promptTokens: 12100000,
    completionTokens: 3100000,
    totalTokens: 15200000,
    totalCostUsd: 915.20,
    primaryLlmModel: "claude-3-5-sonnet",
    primaryProvider: "anthropic",
  },
  {
    organizationId: "org-102",
    organizationName: "Acme Cloud Solutions",
    totalAgentCalls: 5400,
    promptTokens: 6200000,
    completionTokens: 1400000,
    totalTokens: 7600000,
    totalCostUsd: 412.50,
    primaryLlmModel: "gpt-4o-mini",
    primaryProvider: "openai",
  },
  {
    organizationId: "org-105",
    organizationName: "Synthetix Dynamics",
    totalAgentCalls: 3200,
    promptTokens: 3800000,
    completionTokens: 900000,
    totalTokens: 4700000,
    totalCostUsd: 254.10,
    primaryLlmModel: "claude-3-5-sonnet",
    primaryProvider: "anthropic",
  },
  {
    organizationId: "org-103",
    organizationName: "Vortex Data Labs",
    totalAgentCalls: 1800,
    promptTokens: 1900000,
    completionTokens: 450000,
    totalTokens: 2350000,
    totalCostUsd: 118.40,
    primaryLlmModel: "llama-3-70b-instruct",
    primaryProvider: "local_ollama",
  },
];

const INITIAL_AGENT_BREAKDOWN = [
  {
    agentType: "test_creator",
    agentName: "Autonomous Test Creator",
    totalCalls: 14200,
    totalTokens: 21500000,
    totalSpendUsd: 1380.40,
    avgLatencyMs: 1420,
  },
  {
    agentType: "self_healing",
    agentName: "Self-Healing Selector Repair",
    totalCalls: 11400,
    totalTokens: 15400000,
    totalSpendUsd: 920.10,
    avgLatencyMs: 640,
  },
  {
    agentType: "dom_parser",
    agentName: "DOM Tree Structural Parser",
    totalCalls: 6800,
    totalTokens: 11200000,
    totalSpendUsd: 440.30,
    avgLatencyMs: 380,
  },
  {
    agentType: "script_compiler",
    agentName: "Playwright Code Generator",
    totalCalls: 2050,
    totalTokens: 4450000,
    totalSpendUsd: 205.20,
    avgLatencyMs: 890,
  },
];

export const fetchAIUsageAnalytics = async ({ timeframe = "30d", search = "" }) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  let multiplier = 1.0;
  if (timeframe === "7d") multiplier = 0.25;
  if (timeframe === "90d") multiplier = 2.8;

  let tenantLedger = INITIAL_TENANT_SPEND.map((item) => ({
    ...item,
    totalAgentCalls: Math.round(item.totalAgentCalls * multiplier),
    totalTokens: Math.round(item.totalTokens * multiplier),
    totalCostUsd: Number((item.totalCostUsd * multiplier).toFixed(2)),
  }));

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    tenantLedger = tenantLedger.filter(
      (t) =>
        t.organizationName.toLowerCase().includes(q) ||
        t.organizationId.toLowerCase().includes(q) ||
        t.primaryLlmModel.toLowerCase().includes(q)
    );
  }

  const totalLlmSpendUsd = tenantLedger.reduce((acc, curr) => acc + curr.totalCostUsd, 0);
  const grandTotalTokens = tenantLedger.reduce((acc, curr) => acc + curr.totalTokens, 0);
  const totalPromptTokens = Math.round(grandTotalTokens * 0.81);
  const totalCompletionTokens = grandTotalTokens - totalPromptTokens;

  return {
    tenantLedger,
    agentBreakdown: INITIAL_AGENT_BREAKDOWN.map((a) => ({
      ...a,
      totalSpendUsd: Number((a.totalSpendUsd * multiplier).toFixed(2)),
      totalTokens: Math.round(a.totalTokens * multiplier),
    })),
    metrics: {
      totalLlmSpendUsd: Number(totalLlmSpendUsd.toFixed(2)),
      totalPromptTokens,
      totalCompletionTokens,
      grandTotalTokens,
      avgLlmLatencyMs: 832,
      topCostDriver: "Autonomous Test Creator (gpt-4o)",
    },
  };
};
