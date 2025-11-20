import React, { useMemo } from 'react';
import { ProductOffering, UserProduct, View } from '../types';
import { HomeIcon, ZapIcon, HeartIcon, DollarSignIcon } from './icons';
import { ProductBuyCard } from './ProductBuyCard';

interface BuyPolicyViewProps {
  availableProductOfferings: ProductOffering[];
  activeProducts: UserProduct[];
  handleBuyProduct: (product: ProductOffering, insurer: string, agentCode: string) => void;
  loading: boolean;
  setView: (view: View) => void;
  isSaccoMember: boolean;
}

export const BuyPolicyView: React.FC<BuyPolicyViewProps> = ({ availableProductOfferings, activeProducts, handleBuyProduct, loading, setView, isSaccoMember }) => {
    
    // FIX: Correctly type the `reduce` accumulator and initial value to ensure
    // `productsByCategory` has the correct type (`Record<string, ProductOffering[]>`),
    // preventing downstream errors when `products.map` is called.
    const productsByCategory = useMemo(() => {
        return availableProductOfferings.reduce((acc: Record<string, ProductOffering[]>, product) => {
            const category = product.type;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<string, ProductOffering[]>);
    }, [availableProductOfferings]);

    return (
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Explore Mikozi Services</h2>
            <p className="text-gray-600 mb-6">Choose protection and financial tools. Some services are exclusive to SACCO members.</p>
            
            {Object.entries(productsByCategory).map(([type, products]) => (
                <div key={type} className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        {type === 'Non-Life' ? <ZapIcon className="w-6 h-6 mr-2 text-yellow-600" /> : 
                         type === 'Life' ? <HeartIcon className="w-6 h-6 mr-2 text-red-600" /> : 
                         <DollarSignIcon className="w-6 h-6 mr-2 text-blue-600" />}
                        {type === 'Financial Service' ? 'Financial Services' : `${type} Services`}
                    </h3>
                    <div className="space-y-4">
                        {products.map(product => (
                            <ProductBuyCard 
                                key={product.name} 
                                product={product} 
                                handleBuyProduct={handleBuyProduct} 
                                activeProducts={activeProducts} 
                                loading={loading}
                                isSaccoMember={isSaccoMember}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <button 
                onClick={() => setView('dashboard')}
                className="mt-8 text-sm text-gray-600 hover:text-gray-800 flex items-center mx-auto"
            >
                <HomeIcon className="w-4 h-4 mr-1" /> Back to Dashboard
            </button>
        </div>
    );
};
