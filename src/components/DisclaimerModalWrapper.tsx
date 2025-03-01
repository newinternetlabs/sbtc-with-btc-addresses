import React, { useEffect, useState } from 'react';
import DisclaimerModal from './DisclaimerModal';
import { useDisclaimer } from './DisclaimerContext';

const DisclaimerModalWrapper: React.FC = () => {
  const { hasAgreed, setHasAgreed } = useDisclaimer();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show the modal if the user hasn't agreed yet
    if (!hasAgreed) {
      setShowModal(true);
    }
  }, [hasAgreed]);

  const handleClose = () => {
    setHasAgreed(true);
    setShowModal(false);
  };

  return (
    <DisclaimerModal isOpen={showModal} onClose={handleClose} />
  );
};

export default DisclaimerModalWrapper; 