
import React, { useState } from 'react';
import { GroupSchedule, Message, View } from '../types';
import { CalendarIcon, FileIcon } from './icons';

interface ScheduleManagerViewProps {
  groupSchedules: GroupSchedule | null;
  handleUploadSchedule: (scheduleFile: File) => void;
  loading: boolean;
  setMessage: (message: Message | null) => void;
  setView: (view: View) => void;
}

export const ScheduleManagerView: React.FC<ScheduleManagerViewProps> = ({ groupSchedules, handleUploadSchedule, loading, setMessage, setView }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            handleUploadSchedule(selectedFile);
            setSelectedFile(null); // Clear the input after submission
        } else {
            setMessage({ type: 'error', text: 'Please select a file to upload.' });
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="w-8 h-8 mr-2 text-purple-600"/> Group Schedule Manager
            </h2>
            <p className="text-gray-600 mb-6">
                Share important SACCO group schedules (meetings, contribution dates, etc.) by uploading a Word or Excel document.
            </p>

            <div className="bg-purple-50 p-4 rounded-xl shadow-inner mb-6 border-l-4 border-purple-400">
                <h3 className="text-lg font-bold text-purple-800 mb-2">Current Group Schedule File</h3>
                {groupSchedules?.fileName ? (
                    <div>
                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                            <FileIcon className="w-6 h-6 mr-3 text-purple-600 shrink-0" />
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800 truncate">{groupSchedules.fileName}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(groupSchedules.fileSize)}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Last Updated: {new Date(groupSchedules.uploadedAt).toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">No group schedule file has been uploaded yet.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-t pt-4">Upload New Schedule</h3>
                <div>
                    <label htmlFor="scheduleFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Word or Excel file:
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="scheduleFile" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                    <span>Upload a file</span>
                                    <input 
                                        id="scheduleFile" 
                                        name="scheduleFile" 
                                        type="file" 
                                        className="sr-only" 
                                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        onChange={handleFileChange} 
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">DOC, DOCX, XLS, XLSX up to 10MB</p>
                        </div>
                    </div>
                    {selectedFile && (
                        <div className="mt-3 text-sm text-center font-medium text-green-700">
                            Selected: {selectedFile.name}
                        </div>
                    )}
                </div>
                
                <button
                    type="submit"
                    disabled={loading || !selectedFile}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full shadow-lg transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Uploading...' : 'Upload Schedule File'}
                </button>
                <button 
                    type="button"
                    onClick={() => setView('dashboard')}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-800 mt-3"
                >
                    Back to Dashboard
                </button>
            </form>
        </div>
    );
}