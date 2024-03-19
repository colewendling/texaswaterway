'use client';

import React from 'react';
import { X } from 'lucide-react';


const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center bg-primary border-2 border-black rounded-full shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-black" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
