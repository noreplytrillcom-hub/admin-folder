export type InvoiceStatusType = 'paid' | 'pending' | 'overdue' | 'failed' | 'voided' | 'refunded';
export type PaymentMethodType = 'stripe_cc' | 'ach_wire' | 'manual_credit' | 'wire_transfer';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  subtotalUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  status: InvoiceStatusType;
  stripeInvoiceId?: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface InvoicingMetrics {
  totalCollectedUsd: number;
  pendingReceivablesUsd: number;
  overdueReceivablesUsd: number;
  overdueInvoiceCount: number;
  failedChargeRetriesCount: number;
}

export interface RecordPaymentPayload {
  invoiceId: string;
  organizationId: string;
  amountUsd: number;
  paymentMethod: PaymentMethodType;
  transactionReference: string;
  notes?: string;
}
