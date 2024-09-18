'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';

interface LakeFileDataEntry {
  date: string;
  percent_full: number | null;
}

interface LongestDryPeriodProps {
  lakeFileData: LakeFileDataEntry[];
}

const LongestDryPeriod: React.FC<LongestDryPeriodProps> = ({
  lakeFileData,
}) => {
  // Calculate the longest dry period below 50% full
  const longestDryPeriod = useMemo(() => {
    let maxLength = 0;
    let currentLength = 0;
    let start: string | null = null;
    let end: string | null = null;
    let tempStart: string | null = null;

    lakeFileData.forEach((entry) => {
      if (entry.percent_full !== null && entry.percent_full < 50) {
        if (currentLength === 0) {
          tempStart = entry.date;
        }
        currentLength += 1;
        if (currentLength > maxLength) {
          maxLength = currentLength;
          start = tempStart;
          end = entry.date;
        }
      } else {
        currentLength = 0;
        tempStart = null;
      }
    });

    return {
      startDate: start || '',
      endDate: end || '',
      length: maxLength,
    };
  }, [lakeFileData]);

  // Format dates
  const formattedStartDate = longestDryPeriod.startDate
    ? format(new Date(longestDryPeriod.startDate), 'MMMM d, yyyy')
    : 'N/A';
  const formattedEndDate = longestDryPeriod.endDate
    ? format(new Date(longestDryPeriod.endDate), 'MMMM d, yyyy')
    : 'N/A';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-lg h-6">
        {/* Grey Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2"></div>

        {/* Blue Line */}
        <div className="absolute top-1/2 left-[80px] right-[80px] h-1 bg-blue-500 transform -translate-y-1/2"></div>

        {/* Start Date and Dot */}
        <div className="absolute left-[30px] -top-0.5 transform -translate-y-1/2 flex flex-col items-center">
          <span className="mb-2 text-sm text-gray-700">
            {formattedStartDate}
          </span>
          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
        </div>

        {/* End Date and Dot */}
        <div className="absolute right-[30px] -top-0.5 transform -translate-y-1/2 flex flex-col items-center">
          <span className="mb-2 text-sm text-gray-700">{formattedEndDate}</span>
          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
        </div>
      </div>

      {/* Days Count */}
      <div className="mt-6">
        <span className="tracking-widest text-sm font-semibold text-primary">
          Days: {longestDryPeriod.length}
        </span>
      </div>
    </div>
  );
};

export default LongestDryPeriod;
