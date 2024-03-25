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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl bg-white rounded-3xl lg:rounded-xl shadow-lg p-6 mx-auto mt-10 mb-10 max-h-screen overflow-y-auto no-scrollbar"
        style={{
          minHeight: '20rem',
        }}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center bg-red-500 rounded-full shadow-lg"
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
