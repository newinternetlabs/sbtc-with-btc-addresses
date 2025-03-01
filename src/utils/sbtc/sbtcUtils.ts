import { SbtcBalanceResult } from '../../types';
import { request } from "@stacks/connect";
import { Pc, noneCV, principalCV, uintCV, makeUnsignedContractCall, UnsignedContractCallOptions, broadcastTransaction } from "@stacks/transactions";

// sBTC SIP-10 token contract details
export const SBTC_CONTRACT_ADDRESS = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4';
export const SBTC_CONTRACT_NAME = 'sbtc-token';
export const SBTC_CONTRACT = `${SBTC_CONTRACT_ADDRESS}.${SBTC_CONTRACT_NAME}`;

// Fetch sBTC balance for a given Stacks address
export const fetchSbtcBalance = async (stacksAddress: string): Promise<SbtcBalanceResult> => {
  try {
    // Use the Stacks API to fetch the SIP-10 token balance
    const response = await fetch(
      `https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${stacksAddress}/balances`, 
      {
        method: 'GET',
        cache: 'no-store', // Tells browsers not to cache the response
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch token balance');
    
    const data = await response.json();
    console.log('Balances data:', data);
    
    // The API returns token keys in format: "contractAddress::tokenName"
    // We need to find the sBTC token by checking each key
    const tokenKey = Object.keys(data.fungible_tokens || {}).find(key => 
      key.startsWith(SBTC_CONTRACT) && key.includes('::sbtc-token')
    );
    
    if (tokenKey && data.fungible_tokens[tokenKey]) {
      const sbtcData = data.fungible_tokens[tokenKey];
      const balance = sbtcData.balance;
      
      // sBTC token has 8 decimal places like Bitcoin
      return { balance: formatSbtcBalance(balance) };
    }
    
    // Also check for alternate token names like "::sbtc"
    const altTokenKey = Object.keys(data.fungible_tokens || {}).find(key => 
      key.startsWith(SBTC_CONTRACT) && (key.includes('::sbtc') || key.includes('::sBTC'))
    );
    
    if (altTokenKey && data.fungible_tokens[altTokenKey]) {
      const sbtcData = data.fungible_tokens[altTokenKey];
      const balance = sbtcData.balance;
      
      return { balance: formatSbtcBalance(balance) };
    }
    
    return { balance: '0' };
  } catch (error) {
    console.error('Error fetching sBTC token balance:', error);
    return { balance: '0' };
  }
};

// Format the sBTC balance (convert to sats with proper formatting)
export const formatSbtcBalance = (balanceInMicroTokens: string): string => {
  try {
    // Convert the balance to satoshis (no need to divide by 10^8)
    const satsBalance = BigInt(balanceInMicroTokens);
    
    // Format with thousand separators for US English
    return satsBalance.toLocaleString('en-US');
  } catch (error) {
    console.error('Error formatting sBTC balance:', error);
    return '0';
  }
};

// Define a transaction result type
interface TransactionResult {
  success: boolean;
  error?: string;
  transaction?: unknown; // Using unknown instead of any
  txid?: string; // Add the transaction ID property
}

// Send sBTC to a destination address
export const sendSbtc = async (
  amount: number, 
  senderAddress: string, 
  destinationAddress: string, 
  publicKey: string
): Promise<TransactionResult> => {
  try {
    const postConditions = [
      Pc.principal(senderAddress).willSendEq(amount).ft(SBTC_CONTRACT, "sbtc-token")
    ];
    
    const functionArgs = [
      uintCV(amount), 
      principalCV(senderAddress), 
      principalCV(destinationAddress), 
      noneCV()
    ];

    const txOptions: UnsignedContractCallOptions = {
      contractAddress: SBTC_CONTRACT_ADDRESS,
      contractName: SBTC_CONTRACT_NAME,
      functionName: 'transfer',
      functionArgs,
      postConditions,
      postConditionMode: 'deny',
      validateWithAbi: true,
      publicKey: publicKey,
      network: 'mainnet',
    };

    console.log('Transaction options:', txOptions);

    const transaction = await makeUnsignedContractCall(txOptions);
    console.log('Transaction:', transaction);
    
    const signOptions = {
      transaction: transaction.serialize()
    };

    const response = await request('stx_signTransaction', signOptions);
    console.log('Transfer response:', response);
    
    

    let broadcastResponse;
    
    // xverse 0.49.0 unexpectedly broadcasts the transaction 
    // when stx_signTransaction is called
    // but leather does not so we need to broadcast manually
    if (response && response.transaction) {
        const broadcastUrl = 'https://stacks-node-api.mainnet.stacks.co/v2/transactions'
        const fetchResponse = await fetch(broadcastUrl, {
        method: 'POST',
        body: JSON.stringify({tx: response.transaction }),
        headers: {
            'Content-Type': 'application/json'
        }
        });
        console.log('Broadcast fetch response status:', fetchResponse.status);
        
        // Parse the JSON response
        broadcastResponse = await fetchResponse.json();
        console.log('Broadcast response data:', broadcastResponse);
    }
    
    // Check if broadcastResponse contains a txId (transaction ID)
    if (broadcastResponse) {
      return { 
        success: true, 
        transaction: response.transaction,
        txid: broadcastResponse 
      };
    } else {
      return { 
        success: false, 
        error: 'Failed to broadcast transaction or no transaction ID returned' 
      };
    }
  } catch (error) {
    console.error('Error sending sBTC:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}; 