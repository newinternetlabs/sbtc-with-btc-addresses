import { useState, useEffect } from 'react';

export interface UseRefreshManagerReturn {
  refreshTrigger: number;
  refreshAllBalances: () => void;
  accelerateRefresh: () => void;
  notifyBalanceUpdated: () => void;
  waitingForBalanceUpdate: boolean;
}

/**
 * Custom hook to manage balance refresh logic
 */
export const useRefreshManager = (): UseRefreshManagerReturn => {
  // Refresh state
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [refreshInterval, setRefreshInterval] = useState<number>(60000); // Default: 1 minute
  const [acceleratedTimeout, setAcceleratedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [waitingForBalanceUpdate, setWaitingForBalanceUpdate] = useState<boolean>(false);
  const [balanceUpdateTimeout, setBalanceUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  // Function to refresh balances
  const refreshAllBalances = () => {
    // Increment the trigger to force a refresh
    setRefreshTrigger(prev => prev + 1);
  };

  // Function called when a balance has been updated after a transaction
  const notifyBalanceUpdated = () => {
    if (waitingForBalanceUpdate) {
      console.log('Balance updated detected, stopping accelerated refresh in 5 seconds');
      setWaitingForBalanceUpdate(false);
      
      // Clear any existing balance update timeout
      if (balanceUpdateTimeout) {
        clearTimeout(balanceUpdateTimeout);
      }
      
      // Set a timeout to revert back to default after 5 seconds
      const timeoutId = setTimeout(() => {
        console.log('Reverting to normal refresh rate after balance update');
        setRefreshInterval(60000); // Revert to 1 minute
        
        // Clear the accelerated timeout since we're handling it here
        if (acceleratedTimeout) {
          clearTimeout(acceleratedTimeout);
          setAcceleratedTimeout(null);
        }
      }, 5000);
      
      setBalanceUpdateTimeout(timeoutId);
    }
  };

  // Function to accelerate the refresh rate (used after transactions)
  const accelerateRefresh = () => {
    console.log('Accelerating refresh rate for balance updates');
    
    // Set the waiting flag
    setWaitingForBalanceUpdate(true);
    
    // Set to 5 second refresh rate
    setRefreshInterval(5000);
    
    // Clear any existing accelerated timeout
    if (acceleratedTimeout) {
      clearTimeout(acceleratedTimeout);
    }
    
    // If no balance update is detected within 60 seconds, revert to normal refresh
    const timeoutId = setTimeout(() => {
      console.log('No balance update detected within timeout, reverting to normal refresh rate');
      setWaitingForBalanceUpdate(false);
      setRefreshInterval(60000); // Revert to 1 minute
    }, 60000);
    
    setAcceleratedTimeout(timeoutId);
    
    // Immediately trigger a refresh
    refreshAllBalances();
  };

  // Set up interval timer for automatic refreshes
  useEffect(() => {
    console.log(`Setting up refresh timer with interval: ${refreshInterval}ms`);
    
    // Set an interval to refresh balances periodically
    const intervalId = setInterval(() => {
      refreshAllBalances();
    }, refreshInterval);
    
    // Clean up on unmount or when interval changes
    return () => {
      clearInterval(intervalId);
      
      // Also clear any timeout that might be active
      if (acceleratedTimeout) {
        clearTimeout(acceleratedTimeout);
      }
      
      if (balanceUpdateTimeout) {
        clearTimeout(balanceUpdateTimeout);
      }
    };
  }, [refreshInterval]);

  return {
    refreshTrigger,
    refreshAllBalances,
    accelerateRefresh,
    notifyBalanceUpdated,
    waitingForBalanceUpdate
  };
}; 