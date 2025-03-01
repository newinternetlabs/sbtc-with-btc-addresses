// Type definitions for the application

// Account type for wallet accounts
export interface Account {
  address: string;
  publicKey: string;
  symbol: string;
}

// AddressEntry type for wallet response
export interface AddressEntry {
  address: string;
  publicKey: string;
  symbol: string;
  // Add purpose for Xverse wallet
  purpose?: string;
}

// Address validation result
export interface AddressValidationResult {
  isValid: boolean;
  addressType?: string;
}

// sbtc balance result
export interface SbtcBalanceResult {
  balance: string;
} 