/**
 * Combined effects utility - connects sound and visual effects
 */

import { playCashRegisterSound } from './soundEffects';
import { showLightningFlash, cleanupLightningFlash } from './visualEffects';

/**
 * Play the cash register sound effect with lightning flash
 * @param numLightningFlashes - Number of lightning flashes to show (default: 3)
 */
export const playCashEffect = (numLightningFlashes = 3): void => {
  try {
    console.log('🎉 Playing cash effect with sound and lightning!');
    
    // Play the cash register sound
    playCashRegisterSound();
    
    // Add a small delay before showing the lightning to ensure DOM is ready
    setTimeout(() => {
      try {
        // Show the lightning flash
        showLightningFlash(numLightningFlashes);
      } catch (visualError) {
        console.error("Error showing lightning flash:", visualError);
      }
    }, 50);
  } catch (error) {
    console.error("Error playing cash effect:", error);
  }
};

/**
 * Cleanup all effects when no longer needed
 */
export const cleanupEffects = (): void => {
  try {
    cleanupLightningFlash();
    console.log('Effects cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up effects:', error);
  }
};

// Re-export original functions for direct access if needed
export { playCashRegisterSound } from './soundEffects';
export { showLightningFlash, cleanupLightningFlash } from './visualEffects'; 