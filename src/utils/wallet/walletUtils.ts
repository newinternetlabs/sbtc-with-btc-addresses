import { request } from "@stacks/connect";
import { Account } from '../../types';

// Importing the correct type from @stacks/connect
interface WalletAddressEntry {
  address: string;
  publicKey: string;
  symbol?: string;
  purpose?: string;
}

// Function to connect to wallet and get Stacks account
export const connectWallet = async (instanceId: string): Promise<{ stacksAccount: Account | null; connectionError: string }> => {
  try {
    // New request call to get addresses
    const response = await request('stx_getAddresses');
    if (response && response.addresses && response.addresses.length > 0) {
      console.log(`Instance ${instanceId} connected:`, response);

      // Find the STX address in the response
      let stacksAccount = response.addresses.find((account: WalletAddressEntry) => account.symbol === 'STX');
      if (!stacksAccount) { // xverse
        stacksAccount = response.addresses.find((account: WalletAddressEntry) => account.purpose === 'stacks');
      }
      if (stacksAccount && stacksAccount.address && stacksAccount.publicKey) {
        console.log(`Instance ${instanceId} Stacks account:`, stacksAccount);
        return {
          stacksAccount: {
            address: stacksAccount.address,
            publicKey: stacksAccount.publicKey,
            symbol: 'STX'
          },
          connectionError: ''
        };
      } else {
        console.error(`Instance ${instanceId} no valid STX account found in response`);
        return {
          stacksAccount: null,
          connectionError: 'No valid Stacks account found. Please ensure you have a Stacks account in your wallet.'
        };
      }
    } else {
      console.error(`Instance ${instanceId} failed to connect:`, response);
      return {
        stacksAccount: null,
        connectionError: 'Failed to connect wallet. Please try again.'
      };
    }
  } catch (error) {
    console.error(`Instance ${instanceId} connection error:`, error);
    return {
      stacksAccount: null,
      connectionError: 'Error connecting to wallet. Please check your wallet extension.'
    };
  }
};

// Function to copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
}; 