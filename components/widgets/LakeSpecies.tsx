'use client';

import React from 'react';
import Image from 'next/image';
import { fishData } from '@/lib/data/fish';

interface LakeSpeciesProps {
  lake: {
    name: string;
    fish: string[];
    anglingOpportunities: Record<string, string>;
  };
}

type OpportunityLevel = 'poor' | 'fair' | 'good' | 'excellent';

const getBackgroundColor = (level: OpportunityLevel | undefined) => {
  switch (level) {
    case 'poor':
      return 'bg-red-200';
    case 'fair':
      return 'bg-yellow-200';
    case 'good':
      return 'bg-green-200';
    case 'excellent':
      return 'bg-green-400';
    default:
      return 'bg-gray-200';
  }
};

const getTextColor = (level: OpportunityLevel | undefined) => {
  switch (level) {
    case 'poor':
      return 'text-red-600';
    case 'fair':
      return 'text-yellow-600';
    case 'good':
      return 'text-green-600';
    case 'excellent':
      return 'text-green-800';
    default:
      return 'text-gray-600';
  }
};

const LakeSpecies: React.FC<LakeSpeciesProps> = ({ lake }) => {
  const { fish, anglingOpportunities, name } = lake;

  const filteredFishData = fish
    .map((fishName) => ({
      ...fishData[fishName],
      opportunityLevel: anglingOpportunities[fishName],
    }))
    .filter((fish) => fish.name);

  const duplicatedFishData = [...filteredFishData, ...filteredFishData];

  return (
    <div className="relative w-full">
      <div className="relative w-full overflow-x-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {duplicatedFishData.map((fish, idx) => (
            <div
              key={`${fish.name}-${idx}`}
              className="w-[150px] h-[200px] mx-2 flex flex-col items-center justify-between rounded-lg border bg-white p-4"
            >
              {/* Fish Image */}
              <div className="flex-grow flex items-center justify-center h-20 mb-3">
                <Image
                  src={fish.image}
                  alt={fish.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Colored Circle and Opportunity Level */}
              <div className="flex flex-col items-center justify-between w-full mb-2">
                <span className="text-xs text-gray-500 mb-2">{name}:</span>
                <div className=" flex flex-row justify-center items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getBackgroundColor(
                      fish.opportunityLevel as OpportunityLevel,
                    )}`}
                    title={`Angling Opportunity: ${fish.opportunityLevel}`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${getTextColor(
                      fish.opportunityLevel as OpportunityLevel,
                    )}`}
                  >
                    {fish.opportunityLevel}
                  </span>
                </div>
              </div>

              {/* Fish Name */}
              <p className="text-sm font-semibold flex items-center justify-center text-center text-primary h-6 w-[150px]">
                {fish.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LakeSpecies;
