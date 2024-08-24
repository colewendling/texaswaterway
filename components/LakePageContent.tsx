'use client';

import { useState } from 'react';
import LeftNavBar from './LeftNavBar';

const LakePageContent = ({ lake }: { lake: { id: string; name: string } }) => {
  const [activeTab, setActiveTab] = useState<
    'Data' | 'Map' | 'Events' | 'Fishing'
  >('Data');

  const contentMap = {
    Data: <div className="p-4">📊 Lake Data for {lake.name}</div>,
    Map: <div className="p-4">🗺️ Map View for {lake.name}</div>,
    Events: <div className="p-4">📅 Events happening at {lake.name}</div>,
    Fishing: <div className="p-4">🎣 Fishing Information for {lake.name}</div>,
  };

  return (
    <>
      <div className="flex min-h-screen relative dev-1">
        {/* Left Navigation Bar */}
        <LeftNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 p-4 bg-white shadow-md dev-2">
          {contentMap[activeTab]}
        </div>
      </div>
    </>
  );
};

export default LakePageContent;
