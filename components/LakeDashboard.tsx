'use client';

import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import LakeLevelChart from './widgets/LakeLevelChart';
import LakeSpecies from './widgets/LakeSpecies';
import LakeGauge from './widgets/LakeGauge';
import LongestDryPeriod from './widgets/LongestDryPeriod';
import AverageMonthlyPercentFull from './widgets/AverageMonthlyPercentFull';
import LakeExtremes from './widgets/LakeExtremes';
import LakeWeather from './widgets/LakeWeather';

interface Lake {
  id: string;
  name: string;
  coordinates: [number, number];
  fish: string[];
  size: number;
  anglingOpportunities: Record<string, string>;
}

interface LakeFileDataEntry {
  date: string;
  reservoir_storage: number | null;
  percent_full: number;
  conservation_capacity: number;
}

interface LakeDashboardProps {
  lake: Lake;
  lakeFileData: LakeFileDataEntry[]; // Data array
}

const LakeDashboard: React.FC<LakeDashboardProps> = ({
  lake,
  lakeFileData,
}) => {
  // Format data for the chart
  const formattedData = lakeFileData.map((entry) => ({
    year: new Date(entry.date).getFullYear(),
    date: entry.date,
    percent_full: entry.percent_full,
  }));

  const chartConfig = {
    percentFull: { label: 'Percent Full', color: '#8884d8' },
  };

  // Get the latest data entry
  const latestData = lakeFileData[lakeFileData.length - 1];
  const latestPercentFull = latestData?.percent_full || 0;
  const latestConservationCapacity = latestData?.conservation_capacity || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full max-w-screen-xl mx-auto my-6">
      {/* Lake Weather */}
      <div className="col-span-4 sm:col-span-2 rounded-lg border-2 border-gray-400 shadow-lg shadow-black/30 h-[300px] p-4">
        <h2 className="text-xl font-semibold text-center">
          {lake.name} Weather
        </h2>
        <LakeWeather lake={lake} />
      </div>

      {/* Lake Gauge */}
      <div className="col-span-4 sm:col-span-2 rounded-lg border-2 border-gray-400 shadow-lg shadow-black/30 h-[300px] p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Current Lake Level
        </h2>
        <LakeGauge
          percentFull={latestPercentFull}
          conservationCapacity={latestConservationCapacity}
        />
      </div>

      {/* Lake Extremes */}
      <div className="col-span-4 rounded-lg h-[600px] sm:h-[300px] grid gap-6">
        <LakeExtremes lakeFileData={lakeFileData} />
      </div>

      {/* Longest Dry Period Widget */}
      <div className="col-span-4 rounded-lg border-2 border-gray-400 shadow-lg shadow-black/30 h-[250px] p-4">
        <h2 className="text-xl font-semibold mb-4 text-center h-[35px]">
          Longest Dry Period Below 50%
        </h2>
        <LongestDryPeriod lakeFileData={lakeFileData} />
      </div>

      {/* Average Monthly Percent Full Widget */}
      <div className="col-span-4 rounded-lg h-[300px] grid gap-4">
        <div className="rounded-lg border-2 border-gray-400 shadow-lg shadow-black/30 p-4 h-[300px]">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Average Monthly Percent Full
          </h2>
          <AverageMonthlyPercentFull lake={lake} lakeFileData={lakeFileData} />
        </div>
      </div>

      {/* Historic Lake Level Chart Section */}
      <div className="col-span-4 rounded-lg border-2 border-gray-400 shadow-lg shadow-black/30 p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Historic Lake Level
        </h2>
        <div className="h-[400px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <LakeLevelChart data={formattedData} />
          </ChartContainer>
        </div>
      </div>

      {/* Fish Species Section */}
      <div className="col-span-4 rounded-lg border-2 border-gray-400 shadow-lg shadow-black/30 py-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Fish Species</h2>
        <LakeSpecies lake={lake} />
      </div>
    </div>
  );
};

export default LakeDashboard;
