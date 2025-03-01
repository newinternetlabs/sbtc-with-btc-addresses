import React, { createContext } from 'react';
import AppProvider from './components/AppProvider';
import Layout from './components/layout/Layout';

// Define the interface for our context
interface AppContextType {
  refreshAllBalances: () => void;
  accelerateRefresh: () => void;
  notifyBalanceUpdated: () => void;
  refreshTrigger: number;
}

// Create a context for refresh functionality
export const AppContext = createContext<AppContextType>({
  refreshAllBalances: () => {},
  accelerateRefresh: () => {},
  notifyBalanceUpdated: () => {},
  refreshTrigger: 0
});

/**
 * AppContainer is the root component that provides context and layout
 */
const AppContainer: React.FC = () => {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
};

export default AppContainer; 