'use client';
import React from 'react';
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
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1050] bg-black bg-opacity-50 overflow-y-auto overscroll-contain
      flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl bg-white rounded-3xl lg:rounded-xl shadow-lg p-10 mx-auto mt-10 mb-10 overflow-y-auto no-scrollbar flex flex-col justify-center max-h-[90vh]"
        style={{
          minHeight: '20rem',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
