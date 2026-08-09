export type AgentType = 'test_creator' | 'script_compiler' | 'self_healing' | 'dom_parser';
export type LLMProviderType = 'openai' | 'anthropic' | 'google_gemini' | 'local_ollama';

export interface AIUsageMetrics {
  totalLlmSpendUsd: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  grandTotalTokens: number;
  avgLlmLatencyMs: number;
  topCostDriver: string;
}

export interface AgentCostBreakdown {
  agentType: AgentType;
  agentName: string;
  totalCalls: number;
  totalTokens: number;
  totalSpendUsd: number;
  avgLatencyMs: number;
}

export interface TenantAISpend {
  organizationId: string;
  organizationName: string;
  totalAgentCalls: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  primaryLlmModel: string;
  primaryProvider: LLMProviderType;
}
