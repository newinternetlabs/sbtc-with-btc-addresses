import React from 'react';
import WalletInstance from './WalletInstance';

/**
 * Layout component that handles the overall page structure and wallet instances
 */
const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen p-5 bg-[#f9f9fb]">
      <div className="max-w-7xl w-full mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">BTC address sBTC Demo</h1>
          <p className="text-gray-600 text-lg mt-0">Send sBTC to a Bitcoin address.</p>
        </header>
        
        <div className="flex flex-row w-full gap-5 max-w-full overflow-x-hidden mb-8 flex-1 lg:flex-row md:flex-col sm:flex-col">
          <WalletInstance 
            title="Wallet Instance 1"
            instanceKey="app-instance-1"
          />
          
          <WalletInstance 
            title="Wallet Instance 2" 
            instanceKey="app-instance-2"
          />
        </div>
        
        <footer className="mt-auto py-5 text-center text-gray-600 text-sm border-t border-gray-200">
          <p>Copyright &copy; 2025 New Internet Labs Limited</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout; 