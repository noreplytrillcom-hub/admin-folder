export type WorkerStatusType = 'idle' | 'busy' | 'spawning' | 'draining' | 'offline';
export type ExecutionStatusType = 'running' | 'passed' | 'failed' | 'timed_out' | 'aborted';

export interface WorkerNode {
  id: string;
  nodeName: string;
  hostIp: string;
  region: string;
  status: WorkerStatusType;
  cpuUtilizationPct: number;
  ramUtilizationPct: number;
  maxContainerCapacity: number;
  activeContainersCount: number;
  updatedAt: string;
}

export interface ActiveSandbox {
  id: string;
  containerDockerId: string;
  workerNodeId: string;
  workerNodeName: string;
  organizationId: string;
  organizationName: string;
  testSuiteName: string;
  status: ExecutionStatusType;
  cpuCoresAllocated: number;
  ramMbAllocated: number;
  durationSeconds: number;
  startedAt: string;
}

export interface ComputePoolMetrics {
  totalNodesCount: number;
  busyNodesCount: number;
  drainingNodesCount: number;
  avgClusterCpuPct: number;
  avgClusterRamPct: number;
  activeSandboxesRunning: number;
  totalClusterCapacity: number;
}
