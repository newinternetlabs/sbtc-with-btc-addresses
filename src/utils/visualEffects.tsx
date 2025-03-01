import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Lightning bolt SVG paths (stylized lightning bolts)
const LIGHTNING_PATHS = [
  "M13,3 L5,22 L11,22 L3,42 L21,20 L13,20 L18,3",  // Classic zigzag
  "M15,3 L8,17 L14,17 L5,36 L22,16 L15,16 L20,3",  // Sharper angles
  "M12,2 L7,15 L13,15 L4,33 L19,13 L12,13 L16,2"   // Compact
];

// CSS for the lightning effect overlay
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10000,
    pointerEvents: 'none' as const,
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    opacity: 0,
    transition: 'opacity 0.05s ease-in'
  },
  lightning: {
    width: '30%',
    maxWidth: '300px',
    filter: 'drop-shadow(0 0 20px rgba(255, 230, 0, 0.8))',
    transform: 'translateY(-10%)'
  }
};

// Component for lightning flash
const LightningFlash: React.FC<{ flashCount: number }> = ({ flashCount: initialFlashCount }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [flashCount, setFlashCount] = useState(initialFlashCount);
  const [lightningPath, setLightningPath] = useState(LIGHTNING_PATHS[0]);

  // Effect to show initial flash immediately
  useEffect(() => {
    // Trigger first flash immediately
    setIsVisible(true);
    console.log('Lightning flash initiated with', initialFlashCount, 'flashes');
    
    // Schedule hiding after delay
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next flash after a brief pause
      const nextFlashTimeout = setTimeout(() => {
        if (flashCount > 1) {
          // Update the path for variety
          const randomIndex = Math.floor(Math.random() * LIGHTNING_PATHS.length);
          setLightningPath(LIGHTNING_PATHS[randomIndex]);
          
          // Reduce flash count and continue
          setFlashCount(prevCount => prevCount - 1);
        }
      }, 150);
      
      return () => clearTimeout(nextFlashTimeout);
    }, 120);
    
    return () => clearTimeout(hideTimeout);
  }, [flashCount, initialFlashCount]);

  const overlayStyle = {
    ...styles.overlay,
    opacity: isVisible ? 1 : 0,
    backgroundColor: isVisible ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0)'
  };

  return (
    <div style={overlayStyle}>
      <svg 
        viewBox="0 0 24 48" 
        fill="#FFDD00" 
        stroke="#FFA500"
        strokeWidth="0.8"
        style={styles.lightning}
      >
        <path d={lightningPath} />
      </svg>
    </div>
  );
};

// Container element ID for the lightning effect
const LIGHTNING_CONTAINER_ID = 'lightning-flash-container';

// Create container for lightning effect if it doesn't exist
const ensureLightningContainer = (): HTMLElement => {
  let container = document.getElementById(LIGHTNING_CONTAINER_ID);
  
  if (!container) {
    container = document.createElement('div');
    container.id = LIGHTNING_CONTAINER_ID;
    document.body.appendChild(container);
    console.log('Lightning container created and added to DOM');
  }
  
  return container;
};

// Function to directly show a lightning flash
export const showLightningFlash = (numFlashes = 3) => {
  console.log('Showing lightning flash with', numFlashes, 'flashes');
  
  try {
    // Ensure container exists
    const container = ensureLightningContainer();
    
    // Create a fresh root for this flash
    const root = createRoot(container);
    
    // Render the component with the specified number of flashes
    root.render(<LightningFlash flashCount={numFlashes} />);
    
    // Clean up after all flashes should be done
    setTimeout(() => {
      try {
        root.unmount();
      } catch (e) {
        console.error('Error unmounting lightning flash:', e);
      }
    }, numFlashes * 300 + 500); // Give enough time for all flashes plus some buffer
  } catch (error) {
    console.error('Error showing lightning flash:', error);
  }
};

// Clean up the lightning flash component
export const cleanupLightningFlash = () => {
  const container = document.getElementById(LIGHTNING_CONTAINER_ID);
  if (container) {
    try {
      // Remove the container and all its contents
      container.remove();
      console.log('Lightning flash container cleaned up');
    } catch (e) {
      console.error('Error cleaning up lightning flash:', e);
    }
  }
}; 