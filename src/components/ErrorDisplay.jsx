import React from 'react';
import { X } from 'lucide-react';

const ErrorDisplay = ({ message, clearError }) => (
  <div className="my-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-700 dark:text-red-300 rounded-lg flex justify-between items-center animate-fade-in">
    <span>{message}</span>
    <button onClick={clearError} className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50">
      <X className="w-5 h-5" />
    </button>
  </div>
);

export default ErrorDisplay;
