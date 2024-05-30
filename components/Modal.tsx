'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable background scroll
    } else {
      document.body.style.overflow = ''; // Re-enable background scroll
    }

    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div onClick={onClose} className="modal-container">
      <div onClick={(e) => e.stopPropagation()} className="modal">
        <button onClick={onClose} className="modal-button-close">
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
