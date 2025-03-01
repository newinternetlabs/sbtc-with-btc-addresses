/**
 * Sound effects utility using Web Audio API
 */

// Create and cache AudioContext
let audioContext: AudioContext | null = null;

/**
 * Play a cash register "ka-ching" sound
 */
export const playCashRegisterSound = (): void => {
  try {
    // Initialize AudioContext if not already created
    if (!audioContext) {
      // Handle cross-browser support
      const AudioContextClass = window.AudioContext || 
        // Need to cast to unknown first to avoid TypeScript error
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioContextClass();
    }
    
    // Make sure audio context is running (needed due to autoplay policies)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Create oscillator for the "ka" sound (metallic click)
    const kaOscillator = audioContext.createOscillator();
    kaOscillator.type = 'triangle';
    kaOscillator.frequency.setValueAtTime(2500, audioContext.currentTime);
    kaOscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1);
    
    // Create gain node for the "ka" sound envelope
    const kaGain = audioContext.createGain();
    kaGain.gain.setValueAtTime(0.0, audioContext.currentTime);
    kaGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
    kaGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    // Create oscillator for the "ching" sound (bell-like)
    const chingOscillator = audioContext.createOscillator();
    chingOscillator.type = 'sine';
    chingOscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    chingOscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.6);
    
    // Create gain node for the "ching" sound envelope
    const chingGain = audioContext.createGain();
    chingGain.gain.setValueAtTime(0.0, audioContext.currentTime + 0.1);
    chingGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.2);
    chingGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    
    // Connect nodes
    kaOscillator.connect(kaGain);
    kaGain.connect(audioContext.destination);
    
    chingOscillator.connect(chingGain);
    chingGain.connect(audioContext.destination);
    
    // Start oscillators
    kaOscillator.start(audioContext.currentTime);
    kaOscillator.stop(audioContext.currentTime + 0.2);
    
    chingOscillator.start(audioContext.currentTime + 0.1);
    chingOscillator.stop(audioContext.currentTime + 0.9);
    
    console.log("Ka-ching sound played");
    
  } catch (error) {
    console.error("Error playing ka-ching sound:", error);
  }
}; 