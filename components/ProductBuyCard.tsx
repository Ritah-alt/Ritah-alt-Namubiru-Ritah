import React, { useState } from 'react';
import { ProductOffering, UserProduct } from '../types';

interface ProductBuyCardProps {
    product: ProductOffering;
    handleBuyProduct: (product: ProductOffering, insurer: string, agentCode: string) => void;
    activeProducts: UserProduct[];
    loading: boolean;
    isSaccoMember: boolean;
}

const formatCurrency = (amount: number | string) => {
    if (typeof amount === 'number' && amount > 0) {
        return `UGX ${amount.toLocaleString('en-US')}`;
    }
    if (amount === 0) {
        return 'FREE';
    }
    return amount;
};

export const ProductBuyCard: React.FC<ProductBuyCardProps> = ({ product, handleBuyProduct, activeProducts, loading, isSaccoMember }) => {
    const isActive = activeProducts.some(p => p.productName === product.name);
    const isPurchasable = product.requiresSaccoMembership ? isSaccoMember : true;
    
    const isChoiceAvailable = product.isClaimable && product.insurerChoices && product.insurerChoices.length > 1;
    const defaultInsurer = product.insurerChoices ? product.insurerChoices[0] : 'N/A';
    const [selectedInsurer, setSelectedInsurer] = useState<string>(defaultInsurer);
    const [agentCode, setAgentCode] = useState('');

    const getPremiumLabel = () => {
        if (product.category === 'Investment') return 'Min. Weekly Investment';
        if (product.category === 'Savings') return 'Min. Weekly Deposit';
        if (product.premiumWeekly > 0) return 'Weekly Premium';
        return 'Access Benefit';
    };

    const getCoverLabel = () => {
        if (product.isClaimable) return 'Max Cover';
        if (product.category === 'Credit') return 'Potential Loan';
        if (product.category === 'Investment') return 'Fund Focus';
        if (product.category === 'Savings') return 'Savings Target';
        return 'Target';
    };
    
    const containerClasses = `bg-white p-5 rounded-xl shadow-lg border-2 transition duration-300 ${!isPurchasable ? 'border-gray-200 opacity-60' : 'border-gray-100 hover:border-green-400'}`;

    return (
        <div className={containerClasses}>
            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
                {product.requiresSaccoMembership ? 'Partner' : 'Provider Network'}: <span className="font-semibold text-green-600">{product.SACCO}</span>
            </p>

            {product.category === 'Investment' && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700">
                        Fund Provider: <span className="font-bold text-purple-700">{product.insurerChoices[0]}</span>
                    </p>
                </div>
            )}
            
            {product.isClaimable && (
                <div className="mt-3">
                    <label htmlFor={`insurer-select-${product.name}`} className="block text-xs font-medium text-gray-700 mb-1">
                        {isChoiceAvailable ? 'Choose Insurance Provider:' : 'Insurance Provider:'}
                    </label>
                    <select
                        id={`insurer-select-${product.name}`}
                        value={selectedInsurer}
                        onChange={(e) => setSelectedInsurer(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                        disabled={!isChoiceAvailable || isActive || !isPurchasable}
                    >
                        {product.insurerChoices.map(insurer => (
                            <option key={insurer} value={insurer}>{insurer}</option>
                        ))}
                    </select>
                </div>
            )}
            
            {product.isClaimable && (
                <div className="mt-3">
                    <label htmlFor={`agent-code-${product.name}`} className="block text-xs font-medium text-gray-700 mb-1">
                        Agent Code / Name (Required for commission):
                    </label>
                    <input
                        id={`agent-code-${product.name}`}
                        type="text"
                        value={agentCode}
                        onChange={(e) => setAgentCode(e.target.value)}
                        placeholder="Enter Agent Code (e.g., KLA-A47)"
                        className="block w-full pl-3 pr-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-lg shadow-sm"
                        disabled={isActive || !isPurchasable}
                        required
                    />
                    <p className='text-xs text-purple-600 mt-1 font-medium'>
                        Commission Rate: {product.commissionRate * 100}% of annual premium.
                    </p>
                </div>
            )}

            <div className="flex justify-between items-end mt-3 border-t pt-3 border-dashed border-gray-100">
                <div>
                    <p className="text-sm text-gray-600">
                        {getPremiumLabel()}
                    </p>
                    <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(product.premiumWeekly)}</p>
                </div>
                <div className='text-right'>
                    <p className="text-sm text-gray-600">
                        {getCoverLabel()}
                    </p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(product.cover)}</p>
                </div>
            </div>
            
            {!isPurchasable && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded-lg text-center font-medium">
                    This service is exclusive to SACCO members.
                </div>
            )}
            
            <button 
                onClick={() => handleBuyProduct(product, selectedInsurer, agentCode)}
                disabled={loading || isActive || !isPurchasable || (product.isClaimable && !agentCode) || (isChoiceAvailable && !selectedInsurer)}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isActive ? 'Active Now' : `Enroll Now ${product.premiumWeekly > 0 ? `(${formatCurrency(product.premiumWeekly)})` : ''}`}
            </button>
        </div>
    );
};