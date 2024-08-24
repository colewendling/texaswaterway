'use client';

import { useState } from 'react';

type LeftNavBarProps = {
  activeTab: string;
  setActiveTab: (tab: 'Data' | 'Map' | 'Events' | 'Fishing') => void;
};

const LeftNavBar = ({ activeTab, setActiveTab }: LeftNavBarProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className={` dev-1 flex flex-col bg-gray-100 p-4 space-y-4 transition-all duration-300 ${
        isVisible ? 'w-[20%]' : 'w-[5%]'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        {isVisible ? '← Hide' : '→'}
      </button>

      {/* Nav Buttons */}
      {isVisible && (
        <>
          {['Data', 'Map', 'Events', 'Fishing'].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as 'Data' | 'Map' | 'Events' | 'Fishing')
              }
              className={`p-2 rounded text-left ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } hover:bg-blue-400 hover:text-white`}
            >
              {tab}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default LeftNavBar;
