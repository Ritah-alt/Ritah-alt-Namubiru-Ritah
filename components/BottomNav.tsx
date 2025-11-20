
import React from 'react';
import { View, UserProduct, Message } from '../types';
import { HomeIcon, PlusIcon, CalendarIcon, AlertTriangleIcon, MessageCircleIcon } from './icons';

interface NavButtonProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, active, onClick, disabled }) => {
    const color = active ? 'text-green-600' : 'text-gray-500';
    const activeClass = active ? 'bg-green-50' : 'hover:bg-gray-50';
    
    return (
        <button 
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition duration-150 ${activeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} w-1/5`}
            onClick={onClick}
            disabled={disabled}
        >
            <Icon className={`w-6 h-6 ${color}`} />
            <span className={`text-xs mt-1 font-medium ${color}`}>{label}</span>
        </button>
    );
}

interface BottomNavProps {
    view: View;
    setView: (view: View) => void;
    hasClaimableProduct: boolean;
    activeProducts: UserProduct[];
    setIsAdviceModalOpen: (isOpen: boolean) => void;
    setProductToClaim: (product: UserProduct | null) => void;
    setMessage: (message: Message | null) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
    view,
    setView,
    hasClaimableProduct,
    activeProducts,
    setIsAdviceModalOpen,
    setProductToClaim,
    setMessage
}) => {
    const handleClaimClick = () => {
        if (hasClaimableProduct) {
            const claimableProduct = activeProducts.find(p => p.isClaimable);
            if (claimableProduct) {
                setProductToClaim(claimableProduct);
                setView('claim');
            }
        } else {
            setMessage({ type: 'info', text: 'You must have an active insurance product to file a claim.' });
        }
    };
    
    return (
        <nav className="fixed inset-x-0 bottom-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-xl">
            <div className="flex justify-around items-center h-16">
                <NavButton icon={HomeIcon} label="Home" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavButton icon={PlusIcon} label="Explore" active={view === 'buy'} onClick={() => setView('buy')} />
                <NavButton icon={CalendarIcon} label="Schedule" active={view === 'schedule'} onClick={() => setView('schedule')} />
                <NavButton 
                    icon={AlertTriangleIcon} 
                    label="Claim" 
                    active={view === 'claim'} 
                    onClick={handleClaimClick}
                    disabled={!hasClaimableProduct}
                />
                <NavButton 
                    icon={MessageCircleIcon} 
                    label="Advice ✨" 
                    active={false} 
                    onClick={() => setIsAdviceModalOpen(true)} 
                />
            </div>
        </nav>
    );
};
