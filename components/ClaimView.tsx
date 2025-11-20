
import React, { useState } from 'react';
import { UserProduct, Message, View } from '../types';
import { draftClaimDescription } from '../services/geminiService';
import { ClockIcon, PenToolIcon } from './icons';

interface ClaimViewProps {
  productToClaim: UserProduct | null;
  handleFileClaim: (productId: string, claimDetails: { claimType: string; description: string }) => void;
  loading: boolean;
  setMessage: (message: Message | null) => void;
  setView: (view: View) => void;
}

export const ClaimView: React.FC<ClaimViewProps> = ({ productToClaim, handleFileClaim, loading, setMessage, setView }) => {
    const [claimType, setClaimType] = useState('');
    const [description, setDescription] = useState('');
    const [draftingInput, setDraftingInput] = useState('');
    const [isDrafting, setIsDrafting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (productToClaim && claimType && description) {
            handleFileClaim(productToClaim.id, { claimType, description });
        } else {
            setMessage({ type: 'error', text: 'Please fill out all claim details.' });
        }
    };

    const handleDraftClaimDescription = async () => {
        if (!draftingInput || !claimType) return;
        setIsDrafting(true);
        setMessage(null);

        try {
            const response = await draftClaimDescription(claimType, draftingInput);
            setDescription(response);
            setDraftingInput('');
            setMessage({ type: 'success', text: 'Drafting complete! Review and submit your claim.' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setMessage({ type: 'error', text: `AI Draft failed: ${errorMessage}` });
        } finally {
            setIsDrafting(false);
        }
    };

    if (!productToClaim || !productToClaim.isClaimable) {
        return (
            <div className="p-5 bg-red-100 rounded-xl text-red-800">
                <p>Selected service is not claimable. Please return to the dashboard to select an active insurance product.</p>
                <button onClick={() => setView('dashboard')} className="mt-2 text-sm underline font-semibold">Go to Dashboard</button>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">File an Insurance Claim</h2>
            <p className="text-lg text-green-600 font-semibold mb-3">Service: {productToClaim.productName}</p>
            <p className="text-sm text-gray-600 mb-3">Insured by: <strong>{productToClaim.insurer || 'N/A'}</strong></p>
            
            <div className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg mb-6">
                <p className="font-bold text-blue-800 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2" /> Mikozi 48-Hour Guarantee
                </p>
                <p className="text-sm text-blue-700 mt-1">Your payout will be processed within 48 hours of approval.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="claimType" className="block text-sm font-medium text-gray-700">Type of Event/Loss</label>
                    <select
                        id="claimType"
                        value={claimType}
                        onChange={(e) => setClaimType(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg shadow-sm"
                        required
                        disabled={isDrafting}
                    >
                        <option value="">Select Event Type</option>
                        {productToClaim.type === 'Non-Life' && (
                            <>
                                <option value="Drought/Crop Failure">Drought/Crop Failure</option>
                                <option value="Pest Infestation">Pest Infestation</option>
                                <option value="Livestock Illness">Livestock Illness</option>
                            </>
                        )}
                        {productToClaim.type === 'Life' && (
                            <>
                                <option value="Family Member Passing">Family Member Passing</option>
                                <option value="Critical Illness">Critical Illness</option>
                            </>
                        )}
                    </select>
                </div>
                
                <div className="border border-dashed border-green-300 p-4 rounded-xl bg-green-50">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center">
                        <PenToolIcon className='w-4 h-4 mr-1' /> AI Claim Drafting Assistant ✨
                    </h4>
                    <p className="text-xs text-green-700 mb-2">Use keywords to automatically generate a formal description.</p>
                    
                    <textarea
                        rows={2}
                        value={draftingInput}
                        onChange={(e) => setDraftingInput(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., goat died, sickness started 2 days ago, vet confirms cause was disease, need funeral money."
                        disabled={isDrafting || !claimType}
                    ></textarea>
                    <button
                        type="button"
                        onClick={handleDraftClaimDescription}
                        disabled={isDrafting || !draftingInput || !claimType}
                        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-full text-sm transition duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                        {isDrafting ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Drafting...</>
                        ) : 'Generate Description'}
                    </button>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description of Event (Manual or AI-Drafted)</label>
                    <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                        placeholder="Explain what happened, where, and when..."
                        required
                        disabled={isDrafting}
                    ></textarea>
                </div>
                
                <button
                    type="submit"
                    disabled={loading || isDrafting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full shadow-xl transition duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
                <button 
                    type="button"
                    onClick={() => setView('dashboard')}
                    className="w-full text-sm text-center text-gray-600 hover:text-gray-800 mt-3"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
