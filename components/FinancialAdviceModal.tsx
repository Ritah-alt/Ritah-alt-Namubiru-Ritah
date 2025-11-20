
import React, { useState } from 'react';
import { Message, Source } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { BotIcon } from './icons';

interface FinancialAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMessage: (message: Message | null) => void;
}

export const FinancialAdviceModal: React.FC<FinancialAdviceModalProps> = ({ isOpen, onClose, setMessage }) => {
    const [adviceQuery, setAdviceQuery] = useState('');
    const [adviceResponse, setAdviceResponse] = useState<{text: string, sources: Source[]} | null>(null);
    const [isAdviceLoading, setIsAdviceLoading] = useState(false);

    const handleAskQuestion = async () => {
        if (!adviceQuery) return;
        setIsAdviceLoading(true);
        setAdviceResponse(null);

        try {
            const response = await getFinancialAdvice(adviceQuery);
            setAdviceResponse(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setMessage({ type: 'error', text: `Advisor failed: ${errorMessage}` });
        } finally {
            setIsAdviceLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
                <header className="p-4 bg-green-600 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <BotIcon className="w-6 h-6 mr-2" /> SACCO Financial Advisor ✨
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 font-bold text-2xl leading-none">&times;</button>
                </header>
                
                <main className="p-4 flex-grow overflow-y-auto space-y-4 bg-gray-50">
                    <div className="p-3 bg-green-100 rounded-lg shadow-sm text-sm text-green-800">
                        Ask me anything about savings, loans, or managing your SACCO funds! I can use real-time information to guide you.
                    </div>

                    {adviceResponse && (
                        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h4 className="font-bold text-gray-800 flex items-center"><BotIcon className='w-4 h-4 mr-1 text-green-500' /> Advice:</h4>
                            <p className="text-sm mt-1 whitespace-pre-wrap">{adviceResponse.text}</p>
                            {adviceResponse.sources.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                    <p className="font-semibold">Sources:</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        {adviceResponse.sources.map((s, index) => (
                                            <li key={index} className='truncate'>
                                                <a href={s.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{s.title}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {isAdviceLoading && (
                        <div className="flex justify-center items-center py-4">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-3 text-sm text-gray-600">Thinking...</p>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={adviceQuery}
                            onChange={(e) => setAdviceQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                            placeholder="e.g., How do I start a budget?"
                            className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm"
                            disabled={isAdviceLoading}
                        />
                        <button
                            onClick={handleAskQuestion}
                            disabled={isAdviceLoading || !adviceQuery}
                            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-bold transition duration-200 disabled:opacity-50"
                        >
                            Ask
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
