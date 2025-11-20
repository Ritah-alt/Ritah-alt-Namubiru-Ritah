
import React from 'react';
import { Message } from '../types';
import { AlertTriangleIcon, CheckCircleIcon } from './icons';

interface MessageBannerProps {
  message: Message | null;
  setMessage: (message: Message | null) => void;
}

export const MessageBanner: React.FC<MessageBannerProps> = ({ message, setMessage }) => {
    if (!message) return null;

    const colorClasses = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
    };
    
    return (
        <div className={`p-3 rounded-xl mb-4 flex items-center shadow ${colorClasses[message.type]}`}>
            {message.type === 'error' ? <AlertTriangleIcon className="w-5 h-5 mr-2 shrink-0" /> : <CheckCircleIcon className="w-5 h-5 mr-2 shrink-0" />}
            <p className="text-sm font-medium flex-grow">{message.text}</p>
            <button onClick={() => setMessage(null)} className="ml-4 font-bold text-lg leading-none">&times;</button>
        </div>
    );
};
