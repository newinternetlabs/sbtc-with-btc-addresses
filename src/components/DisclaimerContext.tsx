import React, { createContext, useState, useContext } from 'react';

interface DisclaimerContextType {
  hasAgreed: boolean;
  setHasAgreed: (value: boolean) => void;
}

const DisclaimerContext = createContext<DisclaimerContextType>({
  hasAgreed: false,
  setHasAgreed: () => {},
});

export const useDisclaimer = () => useContext(DisclaimerContext);

export const DisclaimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <DisclaimerContext.Provider value={{ hasAgreed, setHasAgreed }}>
      {children}
    </DisclaimerContext.Provider>
  );
};

export default DisclaimerContext; 