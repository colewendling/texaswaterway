'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';

interface LakeFileDataEntry {
  date: string;
  percent_full: number | null;
}

interface LakeExtremesProps {
  lakeFileData: LakeFileDataEntry[];
}

const LakeExtremes: React.FC<LakeExtremesProps> = ({ lakeFileData }) => {
  // Find the max and min percent full
  const { maxData, minData } = useMemo(() => {
    // Filter out invalid percent_full values and those below 10%
    const validData = lakeFileData.filter(
      (entry): entry is { date: string; percent_full: number } =>
        entry.percent_full !== null &&
        !isNaN(entry.percent_full) &&
        entry.percent_full >= 10,
    );

    if (validData.length === 0) {
      return { maxData: null, minData: null };
    }

    // Reduce to find max and min
    const maxData = validData.reduce((max, entry) =>
      entry.percent_full > max.percent_full ? entry : max,
    );

    const minData = validData.reduce((min, entry) =>
      entry.percent_full < min.percent_full ? entry : min,
    );

    return { maxData, minData };
  }, [lakeFileData]);

  // Helper to format date
  const formatDate = (date: string) => format(new Date(date), 'MMMM d, yyyy');

  // Circle style for percent
  const circleStyle = (percent: number) => ({
    background: `conic-gradient(#2563eb ${percent}%, #e5e7eb 0%)`,
  });

  if (!maxData || !minData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-md text-gray-500">No valid data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col sm:flex-row gap-6 items-center justify-center">
      {/* Max Percent Full */}
      <div className="flex flex-col items-center justify-evenly p-6 border-2 border-gray-400 shadow-lg shadow-black/30 rounded-lg w-full h-[100%]">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Max Percent Full
        </h2>
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-2"
          style={circleStyle(maxData.percent_full)}
        >
          <span className="text-lg font-bold text-blue-100 bg-blue-600 rounded-full border-4 p-1.5">
            {maxData.percent_full.toFixed(1)}%
          </span>
        </div>
        <p className="tracking-widest text-sm font-semibold text-primary p-1">
          {formatDate(maxData.date)}
        </p>
      </div>

      {/* Min Percent Full */}
      <div className="flex flex-col items-center justify-evenly p-6 border-2 border-gray-400 shadow-lg shadow-black/30 rounded-lg w-full h-[100%]">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Min Percent Full
        </h2>
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-2"
          style={circleStyle(minData.percent_full)}
        >
          <span className="text-lg font-bold text-blue-600 bg-white rounded-full border-4 p-1.5 border-blue-600">
            {minData.percent_full.toFixed(1)}%
          </span>
        </div>
        <p className="tracking-widest text-sm font-semibold text-primary p-1">
          {formatDate(minData.date)}
        </p>
      </div>
    </div>
  );
};

export default LakeExtremes;
