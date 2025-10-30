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
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.002] border border-gray-100 dark:border-gray-700 ${className}`}
    >
  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 uppercase font-montserrat tracking-widest">{title}</h3>
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase font-montserrat tracking-wide">{description}</p>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
