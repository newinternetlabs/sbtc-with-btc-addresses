import { useState, ChangeEvent, useContext } from 'react';
import { Account } from '../types';
import { validateBitcoinAddress, extractHash160FromBitcoinAddress, convertHash160ToStacksAddress } from '../utils/bitcoin/addressUtils';
import { sendSbtc } from '../utils/sbtc/sbtcUtils';
import { AppContext } from '../AppContainer';

interface SendSbtcProps {
  stacksAccount: Account;
  sbtcBalance: string;
}

const SendSbtc = ({ stacksAccount, sbtcBalance }: SendSbtcProps) => {
  const { refreshAllBalances, accelerateRefresh } = useContext(AppContext);
  
  const [inputBitcoinAddress, setInputBitcoinAddress] = useState<string>('');
  const [derivedStacksAddress, setDerivedStacksAddress] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  const [isDerivedAddressExpanded, setIsDerivedAddressExpanded] = useState<boolean>(false);
  
  const [inputAmount, setInputAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<string>('');
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  // Handle Bitcoin address input changes
  const handleBitcoinAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setInputBitcoinAddress(address);
    
    if (!address) {
      setDerivedStacksAddress('');
      setAddressError('');
      return;
    }
    
    const validation = validateBitcoinAddress(address);
    
    if (validation.isValid && validation.addressType === 'p2wpkh') {
      setAddressError('');
      const hash160 = extractHash160FromBitcoinAddress(address, validation.addressType);
      
      if (hash160) {
        const stacksAddress = convertHash160ToStacksAddress(hash160);
        setDerivedStacksAddress(stacksAddress);
      } else {
        setDerivedStacksAddress('');
        setAddressError('Could not derive Stacks address from this Bitcoin address');
      }
    } else {
      setDerivedStacksAddress('');
      if (validation.addressType && ['p2pkh', 'p2sh', 'p2tr'].includes(validation.addressType)) {
        setAddressError(`This demo only supports converting bc1q (native SegWit) addresses. ${validation.addressType.toUpperCase()} address format is not supported.`);
      } else {
        setAddressError('Invalid Bitcoin address format. Please enter a valid bc1q address.');
      }
    }
  };

  // Handle amount input changes
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    
    // Only allow numbers and remove any non-numeric characters
    const sanitizedAmount = amount.replace(/[^0-9]/g, '');
    setInputAmount(sanitizedAmount);
    
    // Validate the amount
    validateAmount(sanitizedAmount);
  };
  
  // Validate the amount input
  const validateAmount = (amount: string) => {
    if (!amount) {
      setAmountError('Please enter an amount');
      return false;
    }
    
    // Convert to numbers for comparison
    const amountNum = parseInt(amount, 10);
    const balanceNum = parseInt(sbtcBalance.replace(/,/g, ''), 10);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setAmountError('Please enter a valid amount greater than 0');
      return false;
    }
    
    if (amountNum > balanceNum) {
      setAmountError(`Insufficient balance. You only have ${sbtcBalance} sats available.`);
      return false;
    }
    
    setAmountError('');
    return true;
  };

  // Handle the send button click to transfer sBTC
  const handleSend = async () => {
    if (!stacksAccount || !derivedStacksAddress || !inputAmount || amountError) {
      return;
    }
    
    // Reset states
    setTransferError('');
    setTransferSuccess(false);
    setIsTransferring(true);
    
    try {
      // Get the amount and destination address
      const amount = parseInt(inputAmount, 10);
      const destinationAddress = `S${derivedStacksAddress}`;
      
      const result = await sendSbtc(
        amount, 
        stacksAccount.address, 
        destinationAddress, 
        stacksAccount.publicKey
      );
      
      if (result.success) {
        setTransferSuccess(true);
        
        // Reset input fields
        setInputAmount('');
        setInputBitcoinAddress('');
        setDerivedStacksAddress('');
        
        // Trigger accelerated refresh mode
        accelerateRefresh();
        
        // Immediately refresh balances
        refreshAllBalances();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Error sending sBTC:`, error);
      setTransferError(`Failed to send sBTC: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTransferring(false);
    }
  };

  // Handle clearing the transfer error
  const handleClearError = () => {
    setTransferError('');
  };

  return (
    <div className="mt-6 pt-4 border-t border-t-[#eee]">
      <h3 className="text-xl text-gray-800 mb-3">Send sBTC</h3>
      
      <div className="flex flex-col mb-3 text-left">
        <label className="text-sm text-gray-500 mb-1">Recipient Bitcoin Address</label>
        <input 
          type="text" 
          placeholder="Enter Bitcoin address" 
          className="py-2.5 px-4 rounded border border-[#ddd] flex-grow max-w-[350px] text-sm" 
          value={inputBitcoinAddress}
          onChange={handleBitcoinAddressChange}
        />
        {addressError && <p className="text-red-500 text-left mt-2 text-sm">{addressError}</p>}
        
        {derivedStacksAddress && !addressError && (
          <>
            <div 
              className="cursor-pointer flex items-center mt-2 text-[#5546FF] text-sm select-none"
              onClick={() => setIsDerivedAddressExpanded(!isDerivedAddressExpanded)}
            >
              <span className={`inline-block mr-1.5 transition-transform ${isDerivedAddressExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
              <span>{isDerivedAddressExpanded ? 'Hide Equivalent Stacks Address' : 'Show Equivalent Stacks Address'}</span>
            </div>
            
            <div className={`max-h-0 overflow-hidden transition-all opacity-0 mt-0 bg-[#f8f8f8] rounded-md border-l-[3px] border-l-[#5546FF] ${isDerivedAddressExpanded ? 'max-h-[100px] opacity-100 mt-2.5 p-2.5 px-3' : ''}`}>
              <span className="font-mono break-all text-sm text-[#5546FF]">{`S${derivedStacksAddress}`}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="flex flex-col mb-3 text-left">
        <label className="text-sm text-gray-500 mb-1">Amount (in sats)</label>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Enter amount to send" 
            className="py-2.5 px-4 rounded border border-[#ddd] w-3/5 max-w-[200px] text-sm" 
            value={inputAmount}
            onChange={handleAmountChange}
          />
          <button 
            className="bg-[#F7931A] border-none text-white py-2.5 px-5 rounded cursor-pointer font-semibold transition-colors hover:bg-[#E07D16] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600"
            onClick={handleSend}
            disabled={!inputBitcoinAddress || !!addressError || !inputAmount || !!amountError || isTransferring}
          >
            {isTransferring ? "Sending..." : (inputAmount && !amountError ? `Send ${parseInt(inputAmount).toLocaleString('en-US')} sats` : 'Send')}
          </button>
        </div>
        {amountError && <p className="text-red-500 mt-1 text-sm">{amountError}</p>}
      </div>
      
      {transferError && (
        <p className="bg-[#ffebee] text-[#c62828] py-3 px-4 rounded my-4 text-sm flex items-center justify-between border-l-4 border-l-[#c62828]">
          {transferError}
          <button 
            className="bg-[#c62828] text-white border-none py-1.5 px-3 rounded cursor-pointer text-xs ml-3 whitespace-nowrap hover:bg-[#b71c1c]"
            onClick={handleClearError}
          >
            Dismiss
          </button>
        </p>
      )}
      
      {transferSuccess && (
        <p className="bg-[#e8f5e9] text-[#2e7d32] py-3 px-4 rounded my-4 text-sm text-center border-l-4 border-l-[#2e7d32]">
          Transaction submitted successfully!
          <br />
          Your balance will update shortly.
        </p>
      )}
    </div>
  );
};

export default SendSbtc; 