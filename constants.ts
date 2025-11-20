import { ProductOffering } from './types';

export const COMMISSION_RATE = 0.10; // 10%

export const availableProductOfferings: ProductOffering[] = [
    // Non-Life (General Insurance)
    { 
        type: 'Non-Life', name: 'Crop Shield Micro', category: 'Agriculture', cover: 500000, 
        premiumWeekly: 1000, durationWeeks: 52, SACCO: 'Mbale Farmers SACCO', 
        isClaimable: true, color: 'border-yellow-500', 
        insurerChoices: ['Allianz', 'Old Mutual Group'],
        commissionRate: COMMISSION_RATE,
        requiresSaccoMembership: true,
    },
    { 
        type: 'Non-Life', name: 'Livestock Care Basic', category: 'Agriculture', cover: 800000, 
        premiumWeekly: 1500, durationWeeks: 26, SACCO: 'Gulu Community SACCO', 
        isClaimable: true, color: 'border-orange-500', 
        insurerChoices: ['Old Mutual Group', 'Allianz'],
        commissionRate: COMMISSION_RATE,
        requiresSaccoMembership: true,
    },
    // Life (Insurance)
    { 
        type: 'Life', name: 'Family Funeral Cover', category: 'Life', cover: 1500000, 
        premiumWeekly: 750, durationWeeks: 52, SACCO: 'URA STAFF SACCO', 
        isClaimable: true, color: 'border-red-500', 
        insurerChoices: ['Old Mutual Group', 'Allianz'],
        commissionRate: COMMISSION_RATE,
        requiresSaccoMembership: true,
    },
    { 
        type: 'Life', name: 'Personal Accident Cover', category: 'Life', cover: 2000000, 
        premiumWeekly: 1000, durationWeeks: 52, SACCO: 'Direct to Customer', 
        isClaimable: true, color: 'border-teal-500', 
        insurerChoices: ['Allianz'],
        commissionRate: COMMISSION_RATE,
        requiresSaccoMembership: false,
    },
    // Financial Services (SACCO & Partner Products)
    { 
        type: 'Financial Service', name: 'Micro Savings Plan', category: 'Savings', cover: 'Variable', 
        premiumWeekly: 500, durationWeeks: null, SACCO: 'Mbale Farmers SACCO', 
        isClaimable: false, color: 'border-blue-500', 
        insurerChoices: ['N/A - SACCO Product'],
        commissionRate: 0,
        requiresSaccoMembership: true,
    },
    { 
        type: 'Financial Service', name: 'Quick Loan Eligibility', category: 'Credit', cover: 'Up to UGX 5M', 
        premiumWeekly: 0, durationWeeks: null, SACCO: 'Gulu Community SACCO', 
        isClaimable: false, color: 'border-green-500', 
        insurerChoices: ['N/A - SACCO Product'],
        commissionRate: 0,
        requiresSaccoMembership: true,
    },
    { 
        type: 'Financial Service', name: 'Growth Mutual Fund', category: 'Investment', cover: 'High Growth Focus', 
        premiumWeekly: 2000, durationWeeks: null, SACCO: 'Mbale Farmers SACCO', 
        isClaimable: false, color: 'border-purple-500', 
        insurerChoices: ['Old Mutual Group'],
        commissionRate: 0,
        requiresSaccoMembership: true,
    },
    { 
        type: 'Financial Service', name: 'Balanced Mutual Fund', category: 'Investment', cover: 'Steady Growth Focus', 
        premiumWeekly: 1500, durationWeeks: null, SACCO: 'Jinja Traders SACCO', 
        isClaimable: false, color: 'border-indigo-500', 
        insurerChoices: ['Jubilee Holdings'],
        commissionRate: 0,
        requiresSaccoMembership: true,
    },
];