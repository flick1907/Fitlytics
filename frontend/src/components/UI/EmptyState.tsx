import React from 'react';
import { HiOutlineChartBar } from 'react-icons/hi';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title = "No Data Available", 
  message = "Start logging workouts to see your analytics.",
  icon = <HiOutlineChartBar className="w-12 h-12 text-gray-600" />
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[250px] p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
      <div className="mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-300 mb-2">{title}</h4>
      <p className="text-sm text-gray-500 max-w-[200px]">
        {message}
      </p>
    </div>
  );
}
