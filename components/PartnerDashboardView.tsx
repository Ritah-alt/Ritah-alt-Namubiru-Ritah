import React from 'react';
import { Customer } from '../types';
import { DownloadIcon, UsersIcon } from './icons';

interface PartnerDashboardViewProps {
  customers: Customer[];
  partnerSacco: string;
  onSelectCustomer: (customer: Customer) => void;
}

export const PartnerDashboardView: React.FC<PartnerDashboardViewProps> = ({ customers, partnerSacco, onSelectCustomer }) => {
    const saccoCustomers = customers.filter(c => c.sacco === partnerSacco);

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "UserID,SACCO,Total Products,Total Claims\n";

        saccoCustomers.forEach(customer => {
            const totalProducts = customer.products.length;
            const totalClaims = customer.products.reduce((acc, p) => acc + p.claims.length, 0);
            csvContent += `${customer.userId},${customer.sacco},${totalProducts},${totalClaims}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sacco_customers_${partnerSacco}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                    <UsersIcon className="w-8 h-8 mr-2 text-blue-600" /> Partner Dashboard
                </h2>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-xl mb-6 shadow-inner">
                <p className="font-semibold text-blue-800">Viewing Customers for:</p>
                <p className="text-lg font-bold mt-1 text-blue-900">{partnerSacco}</p>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                    Found <span className="font-bold text-gray-800">{saccoCustomers.length}</span> members.
                </p>
                <button 
                    onClick={downloadCSV}
                    className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm transition"
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download Report
                </button>
            </div>

            <div className="space-y-3">
                {saccoCustomers.map(customer => (
                    <div 
                        key={customer.userId} 
                        onClick={() => onSelectCustomer(customer)}
                        className="bg-white p-4 rounded-xl shadow-md cursor-pointer transition hover:shadow-lg hover:border-blue-500 border-2 border-transparent"
                    >
                        <p className="font-bold text-blue-700 truncate">{customer.userId}</p>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>Products: <span className="font-semibold">{customer.products.length}</span></span>
                            <span>Claims: <span className="font-semibold">{customer.products.reduce((acc, p) => acc + p.claims.length, 0)}</span></span>
                            <span className="text-blue-500 font-bold">View Details &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
