import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  DollarSign,
  Cpu,
  Clock,
  Search,
  Bot,
  Zap,
  Building2,
  PieChart,
  RefreshCw,
  X
} from "lucide-react";
import { fetchAIUsageAnalytics } from "../../services/aiUsageService";
import { useToast } from "../../context/ToastContext";
import styles from "./AiUsageMetrics.module.css";

export default function AiUsageMetrics() {
  const toast = useToast();

  const [ledger, setLedger] = useState([]);
  const [agents, setAgents] = useState([]);
  const [metrics, setMetrics] = useState({
    totalLlmSpendUsd: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    grandTotalTokens: 0,
    avgLlmLatencyMs: 0,
    topCostDriver: "",
  });

  const [timeframe, setTimeframe] = useState("30d");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAIUsageAnalytics({ timeframe, search });
      setLedger(res.tenantLedger);
      setAgents(res.agentBreakdown);
      setMetrics(res.metrics);
    } catch (err) {
      toast.error("Failed to load AI usage metrics: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [timeframe, search, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className={styles.container}>
      {/* 1. HEADER TOOLBAR */}
      <div className={styles.headerToolbar}>
        <div>
          <h1 className={styles.pageTitle}>LLM Token Consumption & AI Cost Analytics</h1>
          <p className={styles.pageSubtitle}>
            Monitor LLM API cost consumption (OpenAI, Anthropic, Gemini, Ollama) per tenant and agent type.
          </p>
        </div>

        <div className={styles.timeframeGroup}>
          <span className={styles.timeframeLabel}>Timeframe:</span>
          {["7d", "30d", "90d"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`${styles.btnTimeframe} ${timeframe === tf ? styles.timeframeActive : ""}`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REAL-TIME AI COST KPI CARDS */}
      <div className={styles.metricsGrid}>
        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total LLM Compute Spend</span>
            <div className={styles.iconBoxViolet}><DollarSign size={20} /></div>
          </div>
          <h2 className={styles.statValue}>${metrics.totalLlmSpendUsd.toLocaleString()} USD</h2>
          <p className={styles.statSub}>Across all tenant AI agent executions</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Tokens Consumed</span>
            <div className={styles.iconBoxCyan}><Sparkles size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{(metrics.grandTotalTokens / 1000000).toFixed(1)}M Tokens</h2>
          <div className={styles.tokenBar}>
            <div className={styles.promptFill} style={{ width: "81%" }} title="81% Prompt Tokens" />
            <div className={styles.completionFill} style={{ width: "19%" }} title="19% Completion Tokens" />
          </div>
          <p className={styles.statSub}>
            Prompt: {(metrics.totalPromptTokens / 1000000).toFixed(1)}M • Completion: {(metrics.totalCompletionTokens / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Avg LLM Inference Latency</span>
            <div className={styles.iconBoxBlue}><Clock size={20} /></div>
          </div>
          <h2 className={styles.statValue}>{metrics.avgLlmLatencyMs} ms</h2>
          <p className={styles.statSub}>Target SLA: &lt; 1,200 ms</p>
        </div>

        <div className={styles.glassStatCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Top LLM Cost Driver</span>
            <div className={styles.iconBoxRose}><Bot size={20} /></div>
          </div>
          <h2 className={styles.statValueDriver}>{metrics.topCostDriver}</h2>
          <p className={styles.statSub}>46.8% of total AI compute budget</p>
        </div>
      </div>

      {/* 3. AGENT COST BREAKDOWN GRID */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleGroup}>
            <PieChart size={18} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>AI Agent Type Cost Distribution</h3>
          </div>
        </div>

        <div className={styles.agentGrid}>
          {agents.map((agent) => (
            <div key={agent.agentType} className={styles.glassAgentCard}>
              <div className={styles.agentHeader}>
                <h4 className={styles.agentName}>{agent.agentName}</h4>
                <span className={styles.agentTypeTag}>{agent.agentType}</span>
              </div>
              <div className={styles.agentSpend}>${agent.totalSpendUsd.toLocaleString()} USD</div>
              <div className={styles.agentMeta}>
                <span>Calls: <strong>{agent.totalCalls.toLocaleString()}</strong></span>
                <span>Tokens: <strong>{(agent.totalTokens / 1000000).toFixed(1)}M</strong></span>
                <span>Latency: <strong>{agent.avgLatencyMs}ms</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PER-TENANT LLM USAGE LEDGER TABLE */}
      <div className={styles.sectionCard}>
        <div className={styles.tableHeaderToolbar}>
          <div className={styles.titleGroup}>
            <Building2 size={18} className={styles.sectionIcon} />
            <div>
              <h3 className={styles.sectionTitle}>Per-Tenant LLM Usage Ledger</h3>
              <p className={styles.sectionSub}>Breakdown of LLM API cost consumption per tenant organization.</p>
            </div>
          </div>

          <div className={styles.searchBox}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenant or model..."
              className={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch("")} className={styles.btnClearSearch}><X size={14} /></button>
            )}
          </div>
        </div>

        <div className={styles.glassTableWrapper}>
          <table className={styles.glassTable}>
            <thead>
              <tr>
                <th>Tenant Organization</th>
                <th>Primary Model</th>
                <th>Agent Calls</th>
                <th>Prompt Tokens</th>
                <th>Completion Tokens</th>
                <th>Total Tokens</th>
                <th className={styles.alignRight}>Total AI Cost</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className={styles.loadingTd}>Loading AI usage ledger...</td></tr>
              ) : ledger.length === 0 ? (
                <tr><td colSpan={7} className={styles.emptyTd}>No tenant LLM usage data found.</td></tr>
              ) : (
                ledger.map((tenant) => (
                  <tr key={tenant.organizationId} className={styles.tableRow}>
                    <td>
                      <div className={styles.tenantCell}>
                        <span className={styles.tenantName}>{tenant.organizationName}</span>
                        <span className={styles.tenantIdTag}>{tenant.organizationId}</span>
                      </div>
                    </td>

                    <td>
                      <span className={styles.modelBadge}>{tenant.primaryLlmModel}</span>
                    </td>

                    <td><span className={styles.valText}>{tenant.totalAgentCalls.toLocaleString()} calls</span></td>
                    <td><span className={styles.valMuted}>{(tenant.promptTokens / 1000000).toFixed(2)}M</span></td>
                    <td><span className={styles.valMuted}>{(tenant.completionTokens / 1000000).toFixed(2)}M</span></td>
                    <td><span className={styles.valBold}>{(tenant.totalTokens / 1000000).toFixed(2)}M</span></td>
                    <td className={styles.alignRight}><span className={styles.costVal}>${tenant.totalCostUsd.toLocaleString()} USD</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
