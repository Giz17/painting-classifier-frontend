import React from "react";
import { Link } from "react-router-dom";

export const InteractiveHoverButton = ({ to, icon, text, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border rounded-md font-medium transition-all duration-200 ${
        isActive
          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
          : "bg-white text-black border-black hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:border-white dark:hover:bg-gray-800"
      }`}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
      <span className="hidden sm:inline text-xs sm:text-sm">{text}</span>
    </Link>
  );
};
