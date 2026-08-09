export type PlanTierType = 'starter' | 'growth' | 'enterprise' | 'custom';
export type BillingCycleType = 'monthly' | 'annual';
export type SubscriptionStatusType = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface SubscriptionItem {
  id: string;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  planTier: PlanTierType;
  status: SubscriptionStatusType;
  billingCycle: BillingCycleType;
  mrrAmount: number;
  concurrentSlots: number;
  monthlyMinutesQuota: number;
  slaGuarantee: string;
  currentPeriodEnd: string;
  updatedAt: string;
}

export interface SubscriptionMetrics {
  totalMrr: number;
  activeSubscriptionsCount: number;
  starterCount: number;
  growthCount: number;
  enterpriseCount: number;
  customCount: number;
}

export interface UpdateSubscriptionPayload {
  subscriptionId: string;
  organizationId: string;
  planTier: PlanTierType;
  mrrAmount: number;
  concurrentSlots: number;
  monthlyMinutesQuota: number;
  slaGuarantee: string;
  reason?: string;
}
