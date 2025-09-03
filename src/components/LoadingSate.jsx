import React from 'react';

const LoadingState = ({ message, subMessage }) => (
  <div className="text-center p-16 flex flex-col items-center justify-center animate-fade-in min-h-[calc(100vh-150px)]">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{message}</h2>
    {subMessage && <p className="text-gray-500 dark:text-gray-400 mt-2">{subMessage}</p>}
  </div>
);

export default LoadingState;
