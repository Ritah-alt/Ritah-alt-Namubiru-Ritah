import React from 'react';
import { UserProduct, View } from '../types';
import { BriefcaseIcon, DollarSignIcon } from './icons';

interface ProductCardProps {
    product: UserProduct;
    setView: (view: View) => void;
    setProductToClaim: (product: UserProduct | null) => void;
    isPartnerView?: boolean;
}

const formatCurrency = (amount: number | string) => {
    if (typeof amount === 'number') {
        return `UGX ${amount.toLocaleString('en-US')}`;
    }
    return amount;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, setView, setProductToClaim, isPartnerView = false }) => {
    const canClaim = product.isClaimable;
    const insurerDisplay = product.insurer || 'N/A';
    const agentDisplay = product.agentCode || 'None Provided';

    const getCoverLabel = () => {
        if (canClaim) return 'Max Coverage';
        if (product.category === 'Credit') return 'Loan Limit';
        if (product.category === 'Investment') return 'Current Value';
        if (product.category === 'Savings') return 'Current Balance';
        return 'Value';
    };

    return (
        <div className={`bg-white p-5 rounded-xl shadow-lg border-t-4 ${product.color || 'border-green-500'} mb-4`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{product.productName}</h3>
                    <p className="text-sm text-green-600 font-semibold mt-1 flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-1" /> Partner: {product.SACCO}
                    </p>
                    {product.isClaimable ? (
                        <>
                            <p className="text-xs text-gray-500 mt-1">
                                Insurer: <span className="font-medium text-blue-700 font-bold">{insurerDisplay}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                Agent: <span className="font-medium text-purple-700">{agentDisplay}</span>
                            </p>
                        </>
                    ) : product.category === 'Investment' && (
                         <p className="text-xs text-gray-500 mt-1">
                            Provider: <span className="font-medium text-purple-700 font-bold">{insurerDisplay}</span>
                         </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Start: {new Date(product.startDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-extrabold text-blue-700">{formatCurrency(product.coverageAmount)}</p>
                    <p className="text-xs text-gray-600">{getCoverLabel()}</p>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className='flex items-center'>
                    <DollarSignIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">
                        {product.premiumWeekly > 0 ? `Cost: ${formatCurrency(product.premiumWeekly)} / week` : 'No Recurring Cost'}
                    </span>
                </div>
                {canClaim ? (
                    <button 
                        onClick={() => { if (!isPartnerView) { setProductToClaim(product); setView('claim'); } }}
                        disabled={isPartnerView}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        File Claim
                    </button>
                ) : (
                    <button 
                        disabled
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md transition duration-200 opacity-70 cursor-not-allowed"
                    >
                        Manage
                    </button>
                )}
            </div>
        </div>
    );
};
