import { useState, useId, useEffect } from 'react';
import { Account } from './types';
import { cleanupEffects } from './utils/effects';
import WalletConnection from './components/WalletConnection';
import UserDashboard from './components/UserDashboard';

function App() {
  // Generate a unique ID for this component instance
  const instanceId = useId();
  
  const [stacksAccount, setStacksAccount] = useState<Account | null>(null);

  // Handle successful wallet connection
  const handleConnect = (account: Account) => {
    setStacksAccount(account);
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    // Reset all application state
    setStacksAccount(null);
  };

  // Add cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any active effects when component unmounts
      cleanupEffects();
    };
  }, []);

  return (
    <div className="max-w-xl w-full mx-auto px-5 py-8 box-border overflow-x-hidden">
      {stacksAccount == null ? (
        <WalletConnection onConnect={handleConnect} instanceId={instanceId} />
      ) : (
        <UserDashboard 
          stacksAccount={stacksAccount} 
          instanceId={instanceId} 
          onDisconnect={handleDisconnect} 
        />
      )}
    </div>
  );
}

export default App;
