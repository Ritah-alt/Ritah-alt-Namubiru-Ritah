export type View = 'dashboard' | 'buy' | 'claim' | 'schedule' | 'partnerDashboard' | 'customerDetail';
export type AppViewMode = 'member' | 'partner';

export interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface Claim {
  id: string;
  type: string;
  description: string;
  dateFiled: string;
  status: 'Pending' | 'Paid' | 'Rejected';
  payoutTarget: number | string;
  payoutAmount?: number;
}

export interface UserProduct {
  id: string;
  productName: string;
  type: 'Non-Life' | 'Life' | 'Financial Service';
  category: string;
  SACCO: string;
  insurer: string;
  premiumWeekly: number;
  coverageAmount: number | string;
  startDate: string;
  endDate: string | null;
  status: 'Active' | 'Expired';
  isClaimable: boolean;
  claims: Claim[];
  lastPayment: string;
  agentCode?: string;
  commissionRate?: number;
  commissionAmount?: number;
  commissionPayoutStatus?: 'Pending' | 'Paid';
  annualPremium?: number;
  color?: string;
}

export interface ProductOffering {
    type: 'Non-Life' | 'Life' | 'Financial Service';
    name: string;
    category: string;
    cover: number | string;
    premiumWeekly: number;
    durationWeeks: number | null;
    SACCO: string;
    isClaimable: boolean;
    color: string;
    insurerChoices: string[];
    commissionRate: number;
    requiresSaccoMembership: boolean;
}

export interface GroupSchedule {
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface Customer {
    userId: string;
    sacco: string;
    products: UserProduct[];
}