'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FishInfo } from '@/lib/data/fish';
import Modal from './Modal'; // Importing the existing Modal component

interface FishCardProps {
  fish: FishInfo;
}

const FishCard: React.FC<FishCardProps> = ({ fish }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const howToCatchButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (howToCatchButtonRef.current) {
      howToCatchButtonRef.current.focus(); // Return focus to the "How to Catch" button
    }
  };

  // Move focus to Close button when modal opens
  useEffect(() => {
    if (isModalOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-water border-2 border-blue-500 rounded-lg shadow-md overflow-hidden p-4">
        {/* Image Container */}
        <div className="relative w-full aspect-square">
          <Image
            src={fish.image}
            alt={fish.name}
            fill
            style={{ objectFit: 'contain' }}
            className="object-contain"
          />
        </div>

        {/* Fish Name and Buttons */}
        <div className="p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 min-h-[50px]">
            {fish.name}
          </h3>{' '}
          {/* Fish Name */}
          <div className="flex space-x-2">
            <button
              onClick={openModal}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
              aria-label={`How to catch ${fish.name}`}
              ref={howToCatchButtonRef}
            >
              How to Catch
            </button>
            <a
              href={fish.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white  flex items-center justify-center text-center px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label={`Get info about ${fish.name}`}
            >
              Get Info
            </a>
          </div>
        </div>
      </div>

      {/* Modal for "How to Catch" */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center p-10 bg-water">
          <div className="relative w-full aspect-square">
            <Image
              src={fish.image}
              alt={fish.name}
              fill
              style={{ objectFit: 'contain' }}
              className="object-contain animate-float"
            />
          </div>
          <h3 className="text-xl font-semibold mb-4">{fish.name}</h3>
          <p className="text-gray-700">{fish.guide}</p>
        </div>
      </Modal>
    </>
  );
};

export default FishCard;
