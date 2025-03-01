import { useState, useEffect, useContext } from 'react';
import { Account } from '../types';
import BitcoinAddress from './BitcoinAddress';
import SbtcBalance from './SbtcBalance';
import SendSbtc from './SendSbtc';
import { fetchSbtcBalance } from '../utils/sbtc/sbtcUtils';
import { AppContext } from '../AppContainer';

interface UserDashboardProps {
  stacksAccount: Account;
  instanceId: string;
  onDisconnect: () => void;
}

const UserDashboard = ({ stacksAccount, instanceId, onDisconnect }: UserDashboardProps) => {
  const [sbtcBalance, setSbtcBalance] = useState<string>('0');
  const { refreshTrigger } = useContext(AppContext);

  // Fetch sBTC balance when component mounts or refreshTrigger changes
  useEffect(() => {
    const getBalance = async () => {
      if (stacksAccount) {
        try {
          const result = await fetchSbtcBalance(stacksAccount.address);
          setSbtcBalance(result.balance);
        } catch (error) {
          console.error('Error fetching sBTC balance:', error);
        }
      }
    };

    getBalance();
  }, [stacksAccount, refreshTrigger]);

  return (
    <div className="p-8">
      <BitcoinAddress stacksAccount={stacksAccount} />
      
      <SbtcBalance 
        stacksAccount={stacksAccount} 
        instanceId={instanceId} 
      />
      
      <SendSbtc 
        stacksAccount={stacksAccount} 
        sbtcBalance={sbtcBalance} 
      />

      <div className="flex justify-center mt-5">
        <button 
          onClick={onDisconnect}
          className="bg-transparent text-gray-500 border border-[#ddd] py-2 px-4 rounded text-sm cursor-pointer transition-all hover:bg-[#f0f0f0] hover:text-gray-700"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default UserDashboard; 