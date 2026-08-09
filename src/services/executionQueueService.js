// Mock API & Queue Stream Service Layer for Page 8

let INITIAL_QUEUE_ITEMS = [
  {
    id: "q-1001",
    organizationId: "org-101",
    organizationName: "Apex Cognitive Systems",
    testSuiteName: "Payment Gateway Playwright Regression",
    priority: "p0_critical",
    status: "executing",
    workerNodeName: "k8s-worker-us-east-01",
    estimatedDurationSeconds: 180,
    waitTimeSeconds: 4,
    retryCount: 0,
    enqueuedAt: "2 mins ago",
  },
  {
    id: "q-1002",
    organizationId: "org-104",
    organizationName: "Hyperion AI Networks",
    testSuiteName: "Autonomous LLM Prompt Benchmark",
    priority: "p0_critical",
    status: "queued",
    workerNodeName: null,
    estimatedDurationSeconds: 240,
    waitTimeSeconds: 18,
    retryCount: 0,
    enqueuedAt: "1 min ago",
  },
  {
    id: "q-1003",
    organizationId: "org-102",
    organizationName: "Acme Cloud Solutions",
    testSuiteName: "User Onboarding E2E Flow",
    priority: "p1_high",
    status: "dispatched",
    workerNodeName: "k8s-worker-us-east-02",
    estimatedDurationSeconds: 90,
    waitTimeSeconds: 12,
    retryCount: 0,
    enqueuedAt: "1 min ago",
  },
  {
    id: "q-1004",
    organizationId: "org-105",
    organizationName: "Synthetix Dynamics",
    testSuiteName: "Mobile Viewport Visual Diff Suite",
    priority: "p2_standard",
    status: "queued",
    workerNodeName: null,
    estimatedDurationSeconds: 120,
    waitTimeSeconds: 35,
    retryCount: 1,
    enqueuedAt: "3 mins ago",
  },
  {
    id: "q-1005",
    organizationId: "org-103",
    organizationName: "Vortex Data Labs",
    testSuiteName: "Nightly Security Vulnerability Scan",
    priority: "p3_background",
    status: "queued",
    workerNodeName: null,
    estimatedDurationSeconds: 600,
    waitTimeSeconds: 120,
    retryCount: 0,
    enqueuedAt: "10 mins ago",
  },
];

let isDispatcherPaused = false;

export const fetchExecutionQueueTelemetry = async ({
  statusFilter = "ALL",
  priorityFilter = "ALL",
}) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  let filtered = [...INITIAL_QUEUE_ITEMS];

  if (statusFilter !== "ALL") {
    filtered = filtered.filter((i) => i.status === statusFilter.toLowerCase());
  }

  if (priorityFilter !== "ALL") {
    filtered = filtered.filter((i) => i.priority === priorityFilter.toLowerCase());
  }

  const totalActiveQueueDepth = INITIAL_QUEUE_ITEMS.length;
  const pendingQueuedCount = INITIAL_QUEUE_ITEMS.filter((i) => i.status === "queued").length;
  const p0CriticalBacklogCount = INITIAL_QUEUE_ITEMS.filter(
    (i) => i.status === "queued" && i.priority === "p0_critical"
  ).length;

  const queuedWaitSum = INITIAL_QUEUE_ITEMS.filter((i) => i.status === "queued").reduce(
    (acc, i) => acc + i.waitTimeSeconds,
    0
  );
  const avgQueueWaitSeconds = pendingQueuedCount ? Math.round(queuedWaitSum / pendingQueuedCount) : 0;

  const estBacklogClearMinutes = Math.round(
    INITIAL_QUEUE_ITEMS.filter((i) => i.status === "queued").reduce(
      (acc, i) => acc + i.estimatedDurationSeconds,
      0
    ) / 60
  );

  return {
    queueItems: filtered,
    metrics: {
      totalActiveQueueDepth,
      pendingQueuedCount,
      p0CriticalBacklogCount,
      avgQueueWaitSeconds,
      estBacklogClearMinutes,
      dispatcherPaused: isDispatcherPaused,
    },
  };
};

export const toggleDispatcherPauseState = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  isDispatcherPaused = !isDispatcherPaused;
  return isDispatcherPaused;
};

export const cancelQueueItem = async (queueItemId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  INITIAL_QUEUE_ITEMS = INITIAL_QUEUE_ITEMS.filter((i) => i.id !== queueItemId);
  return true;
};
