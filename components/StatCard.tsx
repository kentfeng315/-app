import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: ReactNode;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, icon, trend }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
        {subValue && <p className="text-sm text-gray-600 mt-1 font-medium">{subValue}</p>}
        {trend && (
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{trend}</span>
          </p>
        )}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
        {icon}
      </div>
    </div>
  );
};
