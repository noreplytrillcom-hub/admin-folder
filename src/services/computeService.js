// Mock API & Telemetry Service Layer for Page 7 Worker Pool

const INITIAL_WORKER_NODES = [
  {
    id: "node-101",
    nodeName: "k8s-worker-us-east-01",
    hostIp: "192.168.1.101",
    region: "us-east-1 (N. Virginia)",
    status: "busy",
    cpuUtilizationPct: 78.4,
    ramUtilizationPct: 82.1,
    maxContainerCapacity: 16,
    activeContainersCount: 14,
    updatedAt: "Just now",
  },
  {
    id: "node-102",
    nodeName: "k8s-worker-us-east-02",
    hostIp: "192.168.1.102",
    region: "us-east-1 (N. Virginia)",
    status: "busy",
    cpuUtilizationPct: 65.2,
    ramUtilizationPct: 71.0,
    maxContainerCapacity: 16,
    activeContainersCount: 10,
    updatedAt: "Just now",
  },
  {
    id: "node-103",
    nodeName: "k8s-worker-us-west-01",
    hostIp: "10.0.4.52",
    region: "us-west-2 (Oregon)",
    status: "idle",
    cpuUtilizationPct: 18.5,
    ramUtilizationPct: 24.3,
    maxContainerCapacity: 16,
    activeContainersCount: 3,
    updatedAt: "1 min ago",
  },
  {
    id: "node-104",
    nodeName: "k8s-worker-eu-central-01",
    hostIp: "172.16.0.12",
    region: "eu-central-1 (Frankfurt)",
    status: "draining",
    cpuUtilizationPct: 91.0,
    ramUtilizationPct: 88.6,
    maxContainerCapacity: 16,
    activeContainersCount: 5,
    updatedAt: "30s ago",
  },
];

let INITIAL_ACTIVE_SANDBOXES = [
  {
    id: "sbx-901",
    containerDockerId: "doc_99182371a0f",
    workerNodeId: "node-101",
    workerNodeName: "k8s-worker-us-east-01",
    organizationId: "org-101",
    organizationName: "Apex Cognitive Systems",
    testSuiteName: "Regression Playwright Checkout Suite",
    status: "running",
    cpuCoresAllocated: 2.0,
    ramMbAllocated: 2048,
    durationSeconds: 142,
    startedAt: "2 mins ago",
  },
  {
    id: "sbx-902",
    containerDockerId: "doc_44120892b1c",
    workerNodeId: "node-101",
    workerNodeName: "k8s-worker-us-east-01",
    organizationId: "org-102",
    organizationName: "Acme Cloud Solutions",
    testSuiteName: "E2E Authentication Flow Test",
    status: "running",
    cpuCoresAllocated: 2.0,
    ramMbAllocated: 2048,
    durationSeconds: 88,
    startedAt: "1 min ago",
  },
  {
    id: "sbx-903",
    containerDockerId: "doc_11893412c3d",
    workerNodeId: "node-102",
    workerNodeName: "k8s-worker-us-east-02",
    organizationId: "org-104",
    organizationName: "Hyperion AI Networks",
    testSuiteName: "Chromium Multi-Tab Benchmark",
    status: "running",
    cpuCoresAllocated: 4.0,
    ramMbAllocated: 4096,
    durationSeconds: 312,
    startedAt: "5 mins ago",
  },
  {
    id: "sbx-904",
    containerDockerId: "doc_88172341d4e",
    workerNodeId: "node-104",
    workerNodeName: "k8s-worker-eu-central-01",
    organizationId: "org-103",
    organizationName: "Vortex Data Labs",
    testSuiteName: "API Gateway Load Emulation",
    status: "running",
    cpuCoresAllocated: 2.0,
    ramMbAllocated: 2048,
    durationSeconds: 45,
    startedAt: "45s ago",
  },
];

export const fetchComputePoolTelemetry = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const totalNodesCount = INITIAL_WORKER_NODES.length;
  const busyNodesCount = INITIAL_WORKER_NODES.filter((n) => n.status === "busy").length;
  const drainingNodesCount = INITIAL_WORKER_NODES.filter((n) => n.status === "draining").length;
  const avgClusterCpuPct = Math.round(
    INITIAL_WORKER_NODES.reduce((acc, n) => acc + n.cpuUtilizationPct, 0) / totalNodesCount
  );
  const avgClusterRamPct = Math.round(
    INITIAL_WORKER_NODES.reduce((acc, n) => acc + n.ramUtilizationPct, 0) / totalNodesCount
  );

  const activeSandboxesRunning = INITIAL_ACTIVE_SANDBOXES.length;
  const totalClusterCapacity = INITIAL_WORKER_NODES.reduce((acc, n) => acc + n.maxContainerCapacity, 0);

  return {
    workerNodes: INITIAL_WORKER_NODES,
    activeSandboxes: INITIAL_ACTIVE_SANDBOXES,
    metrics: {
      totalNodesCount,
      busyNodesCount,
      drainingNodesCount,
      avgClusterCpuPct,
      avgClusterRamPct,
      activeSandboxesRunning,
      totalClusterCapacity,
    },
  };
};

export const killSandboxContainer = async (sandboxId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  INITIAL_ACTIVE_SANDBOXES = INITIAL_ACTIVE_SANDBOXES.filter((s) => s.id !== sandboxId);
  return true;
};
