import { useState } from 'react';
import { connectWallet } from '../utils/wallet/walletUtils';
import { Account } from '../types';

interface WalletConnectionProps {
  onConnect: (account: Account) => void;
  instanceId: string;
}

const WalletConnection = ({ onConnect, instanceId }: WalletConnectionProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>('');

  const handleConnect = async () => {
    try {
      setConnectionError('');
      setIsLoading(true);
      
      const result = await connectWallet(instanceId);
      
      if (result.stacksAccount) {
        onConnect(result.stacksAccount);
      } else {
        setConnectionError(result.connectionError);
      }
    } catch (error) {
      console.error(`Instance ${instanceId} connection error:`, error);
      setConnectionError('Error connecting to wallet. Please check your wallet extension.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full">
      <button 
        onClick={() => handleConnect()}
        disabled={isLoading}
        className={isLoading ? 
          "bg-bitcoin-orange-light text-white border-none py-3 px-5 rounded-lg font-semibold cursor-pointer text-base transition-all animate-pulse" : 
          "bg-bitcoin-orange text-white border-none py-3 px-5 rounded-lg font-semibold cursor-pointer text-base transition-all hover:bg-bitcoin-orange-dark hover:transform hover:-translate-y-0.5 hover:shadow-md"
        }
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
      {connectionError && <p className="text-red-500 my-2 text-sm">{connectionError}</p>}
    </div>
  );
};

export default WalletConnection; 