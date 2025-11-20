
import React from 'react';
import { UserProduct } from '../types';

interface ClaimHistoryProps {
  products: UserProduct[];
}

const formatCurrency = (amount: number | string) => {
    if (typeof amount === 'number') {
        return `UGX ${amount.toLocaleString('en-US')}`;
    }
    return amount;
};

export const ClaimHistory: React.FC<ClaimHistoryProps> = ({ products }) => {
    const allClaims = products
        .flatMap(p => p.claims ? p.claims.map(c => ({
            ...c,
            productName: p.productName,
        })) : [])
        .sort((a, b) => new Date(b.dateFiled).getTime() - new Date(a.dateFiled).getTime());

    if (allClaims.length === 0) return (
        <p className="text-center text-sm text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg">No past claims recorded for insurance products.</p>
    );

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Insurance Claim History</h3>
            <div className="space-y-3">
                {allClaims.slice(0, 5).map(claim => (
                    <div key={claim.id} className="p-4 bg-white rounded-xl shadow transition duration-150 hover:shadow-md">
                        <div className="flex justify-between items-center">
                            <span className={`font-semibold text-sm ${claim.status === 'Paid' ? 'text-green-600' : claim.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                                {claim.status} - {claim.id}
                            </span>
                            <span className="text-xs text-gray-500">{new Date(claim.dateFiled).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-1">{claim.productName}: {claim.type}</p>
                        {claim.status === 'Paid' && <p className="text-sm text-green-700 font-bold mt-1">Payout: {formatCurrency(claim.payoutAmount || 0)}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};
