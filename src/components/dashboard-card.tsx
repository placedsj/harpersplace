// src/components/dashboard-card.tsx

import React from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  className = '', 
  children 
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700/50 ${className}`}
    >
      <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase font-sans tracking-wider">{title}</h3>
      <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 uppercase font-headline tracking-wider">{description}</p>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
