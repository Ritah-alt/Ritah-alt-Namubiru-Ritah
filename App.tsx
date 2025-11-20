import React, { useState, useEffect, useMemo } from 'react';
import { View, UserProduct, Message, GroupSchedule, ProductOffering, AppViewMode, Customer } from './types';
import { availableProductOfferings } from './constants';
import { generateMockCustomers } from './services/mockData';

import { FinancialAdviceModal } from './components/FinancialAdviceModal';
import { DashboardView } from './components/DashboardView';
import { BuyPolicyView } from './components/BuyPolicyView';
import { ClaimView } from './components/ClaimView';
import { ScheduleManagerView } from './components/ScheduleManagerView';
import { MessageBanner } from './components/MessageBanner';
import { BottomNav } from './components/BottomNav';
import { LogoIcon, UsersIcon } from './components/icons';
import { PartnerDashboardView } from './components/PartnerDashboardView';
import { CustomerDetailView } from './components/CustomerDetailView';


const App: React.FC = () => {
    // Member-specific state
    const [userId, setUserId] = useState<string | null>(null);
    const [products, setProducts] = useState<UserProduct[]>([]);
    const [isSaccoMember, setIsSaccoMember] = useState(true);
    
    // Partner-specific state
    const [mockCustomers, setMockCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const PARTNER_SACCO = "Mbale Farmers SACCO"; // Hardcoded for this demo

    // Shared state
    const [appViewMode, setAppViewMode] = useState<AppViewMode>('member');
    const [groupSchedules, setGroupSchedules] = useState<GroupSchedule | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message | null>(null);
    const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
    const [productToClaim, setProductToClaim] = useState<UserProduct | null>(null);

    useEffect(() => {
        // Simulate authentication and initial data load
        setUserId(`user_${crypto.randomUUID().substring(0, 12)}`);
        setMockCustomers(generateMockCustomers(15)); // Generate mock data for partner view
        setLoading(false);
    }, []);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const activeProducts = useMemo(() => products.filter(p => p.status === 'Active'), [products]);
    const hasClaimableProduct = activeProducts.some(p => p.isClaimable);

    // --- Member-facing Logic ---
    const handleBuyProduct = (product: ProductOffering, selectedInsurer: string, agentCode: string) => {
        // ... (logic remains the same)
    };
    const handleFileClaim = (productId: string, claimDetails: { claimType: string; description: string }) => {
        // ... (logic remains the same)
    };
    const handleUploadSchedule = (scheduleFile: File) => {
        // ... (logic remains the same)
    };
    
    // --- Partner-facing Logic ---
    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setView('customerDetail');
    };
    
    const handleReturnToPartnerDashboard = () => {
        setSelectedCustomer(null);
        setView('partnerDashboard');
    };

    const toggleViewMode = () => {
        setAppViewMode(prev => {
            if (prev === 'member') {
                setView('partnerDashboard');
                return 'partner';
            }
            setView('dashboard');
            return 'member';
        });
    };

    const renderMemberView = () => {
        switch (view) {
            case 'buy':
                return <BuyPolicyView availableProductOfferings={availableProductOfferings} activeProducts={activeProducts} handleBuyProduct={handleBuyProduct} loading={loading} setView={setView} isSaccoMember={isSaccoMember} />;
            case 'claim':
                return <ClaimView productToClaim={productToClaim} handleFileClaim={handleFileClaim} loading={loading} setMessage={setMessage} setView={setView} />;
            case 'schedule':
                return <ScheduleManagerView groupSchedules={groupSchedules} handleUploadSchedule={handleUploadSchedule} loading={loading} setMessage={setMessage} setView={setView} />;
            case 'dashboard':
            default:
                return <DashboardView userId={userId} activeProducts={activeProducts} allProducts={products} setView={setView} setIsAdviceModalOpen={setIsAdviceModalOpen} setProductToClaim={setProductToClaim} isSaccoMember={isSaccoMember} setIsSaccoMember={setIsSaccoMember} setMessage={setMessage} />;
        }
    };

    const renderPartnerView = () => {
        switch (view) {
            case 'customerDetail':
                return <CustomerDetailView customer={selectedCustomer} onBack={handleReturnToPartnerDashboard} setMessage={setMessage} />;
            case 'partnerDashboard':
            default:
                return <PartnerDashboardView customers={mockCustomers} partnerSacco={PARTNER_SACCO} onSelectCustomer={handleSelectCustomer} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Mikozi Shield Portal...</p>
                </div>
            </div>
        );
    }

    const backgroundStyle: React.CSSProperties = {
        backgroundColor: '#f0f4f8',
        backgroundImage: `
            radial-gradient(circle at center, hsla(0, 0%, 0%, 0.04) 1px, transparent 1px),
            radial-gradient(circle at center, hsl(140, 50%, 96%), hsl(200, 50%, 96%))
        `,
        backgroundSize: `20px 20px, 100% 100%`,
    };

    return (
        <div className="min-h-screen" style={backgroundStyle}>
            <div className="max-w-md mx-auto p-4 sm:p-6 pb-24">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <LogoIcon className="w-8 h-8 text-green-600" />
                        <h1 className="text-2xl font-black text-gray-900 ml-2">Mikozi Shield</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full">
                            {appViewMode === 'member' ? 'Community Member' : 'Partner View'}
                        </span>
                        <button onClick={toggleViewMode} title="Toggle View Mode" className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-gray-100 transition">
                            <UsersIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </header>
                
                <MessageBanner message={message} setMessage={setMessage} />
                
                {appViewMode === 'member' ? renderMemberView() : renderPartnerView()}
            </div>

            {appViewMode === 'member' && (
                <>
                    <FinancialAdviceModal 
                        isOpen={isAdviceModalOpen} 
                        onClose={() => setIsAdviceModalOpen(false)} 
                        setMessage={setMessage}
                    />
                    <BottomNav 
                        view={view} 
                        setView={setView} 
                        hasClaimableProduct={hasClaimableProduct}
                        activeProducts={activeProducts}
                        setIsAdviceModalOpen={setIsAdviceModalOpen}
                        setProductToClaim={setProductToClaim}
                        setMessage={setMessage}
                    />
                </>
            )}
        </div>
    );
};

export default App;