import React from 'react';
import App from '../../App';

interface WalletInstanceProps {
  title: string;
  instanceKey: string;
}

/**
 * Component that renders a single wallet instance
 */
const WalletInstance: React.FC<WalletInstanceProps> = ({ title, instanceKey }) => {
  return (
    <div className="flex-1 border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden flex flex-col min-h-[600px]">
      <div className="py-3 px-4 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-center">
        {title}
      </div>
      <div className="flex-1 overflow-auto p-0">
        <App key={instanceKey} />
      </div>
    </div>
  );
};

export default WalletInstance; 