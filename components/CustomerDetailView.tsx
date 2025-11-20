import React from 'react';
import { Customer, Message } from '../types';
import { DownloadIcon, HomeIcon } from './icons';
import { ProductCard } from './ProductCard';
import { ClaimHistory } from './ClaimHistory';

interface CustomerDetailViewProps {
  customer: Customer | null;
  onBack: () => void;
  setMessage: (message: Message | null) => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ customer, onBack, setMessage }) => {

    if (!customer) {
        return (
            <div className="p-5 bg-red-100 rounded-xl text-red-800">
                <p>No customer selected. Please return to the partner dashboard.</p>
                <button onClick={onBack} className="mt-2 text-sm underline font-semibold">Go Back</button>
            </div>
        );
    }
    
    const downloadCustomerCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "UserID,ProductName,ProductType,Status,Coverage,PremiumWeekly,ClaimID,ClaimStatus,PayoutAmount\n";

        customer.products.forEach(p => {
            if (p.claims.length > 0) {
                p.claims.forEach(c => {
                    csvContent += `${customer.userId},${p.productName},${p.type},${p.status},"${p.coverageAmount}",${p.premiumWeekly},${c.id},${c.status},${c.payoutAmount || 0}\n`;
                });
            } else {
                csvContent += `${customer.userId},${p.productName},${p.type},${p.status},"${p.coverageAmount}",${p.premiumWeekly},N/A,N/A,0\n`;
            }
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `customer_report_${customer.userId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMessage({ type: 'success', text: `Report for ${customer.userId} downloaded.` });
    };


    return (
        <div>
            <button 
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center mb-4"
            >
                <HomeIcon className="w-4 h-4 mr-1" /> Back to Partner Dashboard
            </button>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Customer Details</h2>
            <div className="bg-gray-100 p-3 rounded-lg mb-6 break-all">
                <p className="text-xs text-gray-600">User ID</p>
                <p className="font-mono font-semibold text-blue-700">{customer.userId}</p>
                <p className="text-xs text-gray-600 mt-1">SACCO</p>
                <p className="font-semibold text-gray-800">{customer.sacco}</p>
            </div>
            
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Active Services</h3>
                {customer.products.length > 0 ? (
                    customer.products.map(p => (
                        <ProductCard 
                            key={p.id} 
                            product={p} 
                            setView={() => {}} 
                            setProductToClaim={() => {}}
                            isPartnerView={true} 
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 bg-white p-4 rounded-lg">No active services for this member.</p>
                )}
            </div>
            
            <div className="mb-8">
                <ClaimHistory products={customer.products} />
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Support Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <button 
                        onClick={downloadCustomerCSV}
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm text-sm transition"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Download Report
                    </button>
                    <button 
                        onClick={() => setMessage({ type: 'info', text: 'Simulated action: A support ticket has been created to contact this member.'})}
                        className="flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm transition"
                    >
                        Contact Member
                    </button>
                    <button 
                        onClick={() => setMessage({ type: 'info', text: 'Simulated action: This member\'s account has been flagged for review.'})}
                        className="flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm transition"
                    >
                        Flag for Review
                    </button>
                </div>
            </div>
        </div>
    );
};
