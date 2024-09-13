'use client';

import React, { useState, useEffect } from 'react';
import GaugeComponent from 'react-gauge-component';
import { Skeleton } from '../ui/skeleton';

interface LakeGaugeProps {
  percentFull: number; // Most up-to-date percent full value
  conservationCapacity: number; // Total conservation capacity of the lake
}

// Helper function to format large numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

const LakeGauge: React.FC<LakeGaugeProps> = ({
  percentFull,
  conservationCapacity,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (percentFull !== null && conservationCapacity !== null) {
      setIsLoading(false);
    }
  }, [percentFull, conservationCapacity]);

  // Clamp percentFull between 0 and 100
  const clampedPercent = Math.min(100, Math.max(0, percentFull || 0));

  // Round the percentFull value for display
  const roundedPercent = Math.round(clampedPercent);

  // Calculate the current water amount
  const currentWater = conservationCapacity
    ? (clampedPercent / 100) * conservationCapacity
    : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full h-[80%]">
      {isLoading && (
        <Skeleton className="flex items-center justify-center py-2 border-2 w-full h-[100%] rounded-lg bg-slate-200 animate-pulse shadow-md shadow-slate-500/50 !important">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </Skeleton>
      )}
      {!isLoading && (
        <div className="flex flex-col items-center w-full">
          <GaugeComponent
            className="w-58"
            type="semicircle"
            labels={{
              tickLabels: {
                type: 'outer',
                ticks: [
                  { value: 20 },
                  { value: 40 },
                  { value: 60 },
                  { value: 80 },
                  { value: 100 },
                ],
              },
              valueLabel: { hide: true },
            }}
            arc={{
              padding: 0.02,
              colorArray: ['#fca5a5', '#86efac'],
              subArcs: [{ limit: 40 }, { limit: 60 }, { limit: 70 }],
            }}
            pointer={{
              elastic: true,
              animate: true,
              animationDelay: 0,
              length: 0.7,
              width: 10,
            }}
            value={clampedPercent}
            minValue={0}
            maxValue={100}
          />
          <h2 className="text-xs font-light text-gray-500 text-center flex flex-col">
            <span className="text-lg font-bold text-primary">{`${roundedPercent}%`}</span>
            <span className="text-sm tracking-widest font-normal text-gray-500 p-1">{`${formatNumber(currentWater)} Acre-Feet`}</span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default LakeGauge;
