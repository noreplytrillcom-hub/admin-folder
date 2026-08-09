export type DiscountType = 'percentage' | 'fixed_usd';
export type CreditReasonType = 'sla_breach_compensation' | 'goodwill' | 'beta_testing_grant' | 'overbill_refund' | 'promotional';

export interface CouponItem {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxRedemptions: number;
  currentRedemptions: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceCreditItem {
  id: string;
  organizationId: string;
  organizationName: string;
  amountUsd: number;
  balanceRemainingUsd: number;
  reason: CreditReasonType;
  notes?: string;
  issuedByAdminEmail: string;
  expiresAt: string;
  createdAt: string;
}

export interface DiscountsMetrics {
  activeCouponsCount: number;
  totalRedeemedSavingsUsd: number;
  tenantActiveCreditsBalanceUsd: number;
  creditsIssuedLast30dUsd: number;
}

export interface IssueCreditPayload {
  organizationId: string;
  amountUsd: number;
  reason: CreditReasonType;
  notes?: string;
}
