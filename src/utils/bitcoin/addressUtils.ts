import { hex } from '@scure/base';
import { bech32 } from "bech32";
import { c32checkEncode } from 'c32check';
import * as btc from '@scure/btc-signer';
import { AddressValidationResult } from '../../types';

// Function to validate a Bitcoin address and determine its type
export const validateBitcoinAddress = (address: string): AddressValidationResult => {
  try {
    // For this demo, we're only focusing on native SegWit addresses (bc1q)
    if (address.startsWith('bc1q')) {
      // Native Segwit address (P2WPKH)
      try {
        // Attempt to decode the bc1q address to validate it
        bech32.decode(address);
        return { isValid: true, addressType: 'p2wpkh' };
      } catch (e) {
        console.error('Invalid bech32 address:', e);
        return { isValid: false };
      }
    }
    
    // For legacy and other address formats, inform the user we're focusing on bc1q
    if (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1p')) {
      return { 
        isValid: false, 
        addressType: address.startsWith('1') ? 'p2pkh' : 
                    address.startsWith('3') ? 'p2sh' : 'p2tr'
      };
    }
    
    return { isValid: false };
  } catch (error) {
    console.error('Error validating Bitcoin address:', error);
    return { isValid: false };
  }
};

// Function to extract hash160 from a Bitcoin address
export const extractHash160FromBitcoinAddress = (address: string, addressType: string): string | null => {
  try {
    // Only try to decode bc1q addresses (native SegWit)
    if (addressType === 'p2wpkh' && address.startsWith('bc1q')) {
      try {
        const decoded = bech32.decode(address);
        console.log('Decoded bech32 address:', decoded);
        
        // The first byte (0) is the witness version
        // The rest encodes the 20-byte hash160
        if (decoded && decoded.words && decoded.words.length > 0) {
          // Convert 5-bit words to 8-bit bytes (removing the witness version byte)
          const witnessProgram = bech32.fromWords(decoded.words.slice(1));
          
          // For P2WPKH, the witness program should be 20 bytes (hash160)
          if (witnessProgram.length === 20) {
            // Convert bytes to hex string
            const hash160 = witnessProgram.reduce((str, byte) => {
              const hex = byte.toString(16).padStart(2, '0');
              return str + hex;
            }, '');
            
            console.log(`Extracted hash160 from bc1q address: ${hash160}`);
            return hash160;
          } else {
            console.error('Invalid witness program length for P2WPKH:', witnessProgram.length);
          }
        }
      } catch (error) {
        console.error('Error decoding bech32 address:', error);
      }
    }
    
    // For non-bc1q addresses or if decoding failed, return a placeholder
    console.log(`Skipping detailed decoding for ${addressType} address: ${address}`);
    return null; 
  } catch (error) {
    console.error('Error extracting hash160 from Bitcoin address:', error);
    return null;
  }
};

// Function to convert hash160 to a Stacks address
export const convertHash160ToStacksAddress = (hash160: string): string => {
  try {
    // Using c32check to create a Stacks address
    // Version 22 for mainnet stacks
    const version = 22;
    return c32checkEncode(version, hash160);
  } catch (error) {
    console.error('Error converting hash160 to Stacks address:', error);
    return '';
  }
};

// Function to generate a Bitcoin address from a Stacks public key
export const generateBitcoinAddressFromPublicKey = (publicKey: string): string => {
  try {
    if (typeof publicKey === 'string' && publicKey.length > 0) {
      // Decode the hex public key
      const pubKeyBytes = hex.decode(publicKey);
      
      // Generate P2WPKH (native SegWit) address
      const p2wpkhOutput = btc.p2wpkh(pubKeyBytes);
      
      if (p2wpkhOutput.address && typeof p2wpkhOutput.address === 'string') {
        console.log(`Generated Bitcoin address: ${p2wpkhOutput.address}`);
        return p2wpkhOutput.address;
      }
    }
    
    console.warn('No valid public key available to generate Bitcoin address');
    return '';
  } catch (error) {
    console.error('Error generating Bitcoin address:', error);
    return '';
  }
}; 