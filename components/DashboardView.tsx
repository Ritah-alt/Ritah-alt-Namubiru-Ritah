import React from 'react';
import { UserProduct, View, Message } from '../types';
import { BotIcon, UsersIcon, UserPlusIcon } from './icons';
import { ProductCard } from './ProductCard';
import { ClaimHistory } from './ClaimHistory';

interface DashboardViewProps {
  userId: string | null;
  activeProducts: UserProduct[];
  allProducts: UserProduct[];
  setView: (view: View) => void;
  setIsAdviceModalOpen: (isOpen: boolean) => void;
  setProductToClaim: (product: UserProduct | null) => void;
  isSaccoMember: boolean;
  setIsSaccoMember: (isMember: boolean) => void;
  setMessage: (message: Message | null) => void;
}

const FinancialAdvisorCard: React.FC<{ setIsAdviceModalOpen: (isOpen: boolean) => void }> = ({ setIsAdviceModalOpen }) => (
    <div 
        onClick={() => setIsAdviceModalOpen(true)}
        className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-blue-500 mb-4 cursor-pointer hover:shadow-xl transition duration-300"
    >
        <div className="flex items-center">
            <BotIcon className="w-8 h-8 text-blue-600 mr-3 shrink-0" />
            <div>
                <h3 className="text-xl font-bold text-gray-800">SACCO Financial Advisor ✨</h3>
                <p className="text-sm text-gray-600 mt-1">Get instant, grounded advice on savings and loans.</p>
            </div>
        </div>
        <p className="text-right text-xs text-blue-500 font-semibold mt-3">Tap to Chat</p>
    </div>
);

const MembershipStatusCard: React.FC<{ isSaccoMember: boolean; setIsSaccoMember: (isMember: boolean) => void; setMessage: (message: Message | null) => void; }> = ({ isSaccoMember, setIsSaccoMember, setMessage }) => {
    
    const handleJoinClick = () => {
        setMessage({
            type: 'info',
            text: 'Joining a SACCO is easy! Contact your local community leader or Mikozi agent to find a SACCO near you and start enjoying exclusive benefits.'
        });
    };

    if (isSaccoMember) {
        return (
            <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl shadow-md mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-green-800 flex items-center">
                            <UsersIcon className="w-5 h-5 mr-2 text-green-600" /> Verified SACCO Member
                        </h4>
                        <p className="text-xs text-green-700 mt-1">You have access to all exclusive products and benefits.</p>
                    </div>
                    <button onClick={() => setIsSaccoMember(false)} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-green-600" title="Switch to non-member view">
                        <span className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform translate-x-6" />
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-3 text-center">Toggle to preview products available to non-members.</p>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-blue-800 flex items-center">
                        <UsersIcon className="w-5 h-5 mr-2 text-blue-600" /> Individual Member
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">You are viewing products available to all customers.</p>
                </div>
                 <button onClick={() => setIsSaccoMember(true)} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-300" title="Switch to member view">
                    <span className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform translate-x-1" />
                </button>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-100">
                <p className="text-sm text-center text-blue-800 mb-2">Unlock exclusive benefits by joining a SACCO!</p>
                <button 
                    onClick={handleJoinClick}
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition"
                >
                    <UserPlusIcon className="w-5 h-5 mr-2"/>
                    Learn How to Join
                </button>
            </div>
        </div>
    );
};


export const DashboardView: React.FC<DashboardViewProps> = ({ userId, activeProducts, allProducts, setView, setIsAdviceModalOpen, setProductToClaim, isSaccoMember, setIsSaccoMember, setMessage }) => {
  return (
    <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">My Mikozi Services</h2>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-xl mb-6 shadow-inner">
            <p className="font-semibold text-yellow-800">Your User ID (for support):</p>
            <p className="text-sm break-all mt-1 text-yellow-700">{userId || 'Loading...'}</p>
        </div>
        
        <MembershipStatusCard 
            isSaccoMember={isSaccoMember} 
            setIsSaccoMember={setIsSaccoMember}
            setMessage={setMessage}
        />

        <FinancialAdvisorCard setIsAdviceModalOpen={setIsAdviceModalOpen} />

        {activeProducts.length > 0 ? (
            activeProducts.map(p => <ProductCard key={p.id} product={p} setView={setView} setProductToClaim={setProductToClaim} />)
        ) : (
            <div className="p-6 bg-white border-2 border-dashed border-blue-200 rounded-xl mb-6 text-center">
                <p className="text-lg font-semibold text-blue-700">No Active Mikozi Services</p>
                <p className="text-sm text-blue-600 mt-2">Access affordable Life, Non-Life, and Financial Services today!</p>
                <button 
                    onClick={() => setView('buy')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
                >
                    Explore Services
                </button>
            </div>
        )}

        {allProducts.length > 0 && <ClaimHistory products={allProducts} />}
    </div>
  );
};