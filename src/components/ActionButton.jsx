import React from 'react';

const ActionButton = ({ onClick, icon, text, primary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
        ${primary
          ? 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }
      `}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default ActionButton;
