export type QueuePriority = 'p0_critical' | 'p1_high' | 'p2_standard' | 'p3_background';
export type QueueStatus = 'queued' | 'dispatched' | 'executing' | 'completed' | 'failed' | 'cancelled' | 'timeout';

export interface QueueItem {
  id: string;
  organizationId: string;
  organizationName: string;
  testSuiteName: string;
  priority: QueuePriority;
  status: QueueStatus;
  workerNodeName?: string;
  estimatedDurationSeconds: number;
  waitTimeSeconds: number;
  retryCount: number;
  enqueuedAt: string;
}

export interface QueueMetrics {
  totalActiveQueueDepth: number;
  pendingQueuedCount: number;
  p0CriticalBacklogCount: number;
  avgQueueWaitSeconds: number;
  estBacklogClearMinutes: number;
  dispatcherPaused: boolean;
}
