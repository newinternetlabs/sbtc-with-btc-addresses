import { useState, useEffect } from 'react';
import { Account } from '../types';
import { generateBitcoinAddressFromPublicKey } from '../utils/bitcoin/addressUtils';
import { copyToClipboard } from '../utils/wallet/walletUtils';

interface BitcoinAddressProps {
  stacksAccount: Account;
}

const BitcoinAddress = ({ stacksAccount }: BitcoinAddressProps) => {
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');
  const [isStacksAddressExpanded, setIsStacksAddressExpanded] = useState<boolean>(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState<boolean>(false);

  // Generate Bitcoin address whenever stacksAccount changes
  useEffect(() => {
    if (!stacksAccount) return;
    
    const address = generateBitcoinAddressFromPublicKey(stacksAccount.publicKey);
    setBitcoinAddress(address);
  }, [stacksAccount]);

  // Handle copy to clipboard
  const handleCopyToClipboard = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // Show success message
      setShowCopiedMessage(true);
      // Hide message after 2 seconds
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
    }
  };

  return (
    <div className="mx-auto mb-5 max-w-[90%] text-left bg-[#f4f6f8] rounded-md p-3 shadow-sm">
      <div className="flex flex-col mb-2.5">
        <span className="text-sm text-gray-500 mb-1">Bitcoin Address:</span>
        <div className="flex items-center relative">
          <span className="font-mono bg-[#f0f0f0] py-1.5 px-2 rounded text-sm break-all border border-[#e0e0e0] text-[#F7931A]">
            {bitcoinAddress || "Generating..."}
          </span>
          {bitcoinAddress && (
            <>
              <button 
                className="bg-transparent border-none text-gray-500 cursor-pointer py-1 px-2 ml-2 rounded transition-colors hover:bg-[#e0e0e0] hover:text-gray-700 inline-flex items-center justify-center" 
                onClick={() => handleCopyToClipboard(bitcoinAddress)}
                aria-label="Copy Bitcoin address to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <span className={`absolute right-0 top-[-25px] bg-[#5546FF] text-white text-xs py-1 px-2 rounded opacity-0 translate-y-2.5 transition-all pointer-events-none ${showCopiedMessage ? 'opacity-100 translate-y-0' : ''}`}>
                Copied!
              </span>
            </>
          )}
        </div>
      </div>
      
      <div 
        className="cursor-pointer flex items-center mt-2 text-[#5546FF] text-sm select-none"
        onClick={() => setIsStacksAddressExpanded(!isStacksAddressExpanded)}
      >
        <span className={`inline-block mr-1.5 transition-transform ${isStacksAddressExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
        <span>{isStacksAddressExpanded ? 'Hide Stacks Address' : 'Show Stacks Address'}</span>
      </div>
      
      <div className={`max-h-0 overflow-hidden transition-all opacity-0 mt-0 bg-[#f8f8f8] rounded-md border-l-[3px] border-l-[#5546FF] ${isStacksAddressExpanded ? 'max-h-[100px] opacity-100 mt-2.5 p-2.5 px-3' : ''}`}>
        <span className="font-mono break-all text-sm text-[#5546FF]">{stacksAccount.address}</span>
      </div>
    </div>
  );
};

export default BitcoinAddress; 