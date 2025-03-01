import React, { ReactNode } from 'react';
import { useRefreshManager } from '../hooks/useRefreshManager';
import { AppContext } from '../AppContainer';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application with context values
 */
const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { 
    refreshTrigger,
    refreshAllBalances,
    accelerateRefresh,
    notifyBalanceUpdated
  } = useRefreshManager();

  return (
    <AppContext.Provider
      value={{
        refreshTrigger,
        refreshAllBalances,
        accelerateRefresh,
        notifyBalanceUpdated
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider; 