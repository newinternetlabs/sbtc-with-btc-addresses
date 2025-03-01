import { useEffect, useState, useContext, useRef } from 'react';
import { Account } from '../types';
import { fetchSbtcBalance } from '../utils/sbtc/sbtcUtils';
import { AppContext } from '../AppContainer';
import { playCashEffect } from '../utils/effects';

interface SbtcBalanceProps {
  stacksAccount: Account;
  instanceId: string;
}

const SbtcBalance = ({ stacksAccount, instanceId }: SbtcBalanceProps) => {
  const { refreshTrigger, notifyBalanceUpdated } = useContext(AppContext);
  const [sbtcBalance, setSbtcBalance] = useState<string>('');
  
  // Keep track of previous balance to detect changes
  const previousBalanceRef = useRef<string>('');

  useEffect(() => {
    const updateSbtcBalance = async () => {
      if (stacksAccount) {
        try {
          const result = await fetchSbtcBalance(stacksAccount.address);
          
          // Check if the balance has changed
          if (previousBalanceRef.current !== '' && 
              previousBalanceRef.current !== result.balance) {
            console.log(`Instance ${instanceId}: Balance changed from ${previousBalanceRef.current} to ${result.balance}`);
            
            // Check if balance has increased (received funds)
            if (result.balance !== '0' && 
                (previousBalanceRef.current === '0' || 
                 BigInt(result.balance.replace(/,/g, '')) > 
                 BigInt(previousBalanceRef.current.replace(/,/g, '')))) {
              // Play cash effect (sound + lightning)
              console.log(`Instance ${instanceId}: Balance increased - playing cash effect!`);
              playCashEffect();
            }
            
            // Notify the container that a balance has changed
            notifyBalanceUpdated();
          }
          
          // Update previous balance ref
          previousBalanceRef.current = result.balance;
          
          // Set the new balance
          setSbtcBalance(result.balance);
        } catch (error) {
          console.error('Error fetching sBTC SIP-10 token balance:', error);
          setSbtcBalance('0');
        }
      }
    };

    updateSbtcBalance();
  }, [stacksAccount, refreshTrigger, notifyBalanceUpdated, instanceId]);

  return (
    <div className="bg-[#f8f9fa] rounded-lg py-4 px-5 my-5 mx-auto max-w-[400px] shadow-md text-center border-l-4 border-l-[#F7931A]">
      <h3 className="mt-0 text-gray-800 text-xl mb-3">sBTC Balance</h3>
      <p className="text-[1.8rem] font-bold text-[#1E1F36] my-2">
        {`${sbtcBalance} sats`}
      </p>
    </div>
  );
};

export default SbtcBalance; 