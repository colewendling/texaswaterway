// components/AnglingOpportunities.tsx

import React from 'react';
import { Lake, OpportunityLevel } from '@/lib/data/lakes';
import { fishData } from '@/lib/data/fish';
import Image from 'next/image';

interface AnglingOpportunitiesProps {
  lake: Lake;
}

const AnglingOpportunities: React.FC<AnglingOpportunitiesProps> = ({
  lake,
}) => {
  const opportunityLevels: OpportunityLevel[] = [
    'poor',
    'fair',
    'good',
    'excellent',
  ];

  // Helper function to determine background color based on opportunity level
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
        return '';
    }
  };

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-black bg-blue-300">
                Species
              </th>
              {opportunityLevels.map((level) => (
                <th
                  key={level}
                  className="px-4 py-2 border border-black bg-blue-300 capitalize"
                >
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lake.fish.map((fishName) => {
              const opportunity = lake.anglingOpportunities[fishName];
              const fish = fishData[fishName];
              if (!fish) return null; // Handle missing fish data

              return (
                <tr key={fishName}>
                  <td className="px-4 py-2 border border-black font-semibold">
                    {fish.name}
                  </td>
                  {opportunityLevels.map((level) => (
                    <td
                      key={level}
                      className={`px-4 py-2 border border-black text-center ${getBackgroundColor(
                        opportunity === level ? level : undefined,
                      )}`}
                    >
                      {opportunity === level ? (
                        <Image
                          src={fish.image}
                          alt={level}
                          width={60}
                          height={24}
                          className="mx-auto"
                        />
                      ) : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnglingOpportunities;
