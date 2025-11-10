
import React from 'react';
import type { Status } from '../types';

interface LoaderProps {
  status: Status;
  progress: { current: number; total: number };
}

export const Loader: React.FC<LoaderProps> = ({ status, progress }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'generatingPlan':
        return 'Crafting your personalized lesson plan...';
      case 'generatingImages':
        return `Generating drawing ${progress.current} of ${progress.total}...`;
      default:
        return 'Loading...';
    }
  };

  const percentage = status === 'generatingImages' ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/60 rounded-lg min-h-[400px]">
      <div className="w-16 h-16 border-4 border-t-indigo-400 border-r-indigo-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <p className="mt-6 text-xl font-semibold text-gray-200">{getStatusMessage()}</p>
      {status === 'generatingImages' && (
        <div className="w-full max-w-md mt-4 bg-gray-700 rounded-full h-2.5">
          <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      )}
      <p className="mt-2 text-gray-400">This may take a minute, please wait.</p>
    </div>
  );
};
