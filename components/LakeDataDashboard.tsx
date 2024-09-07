'use client';

import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import LakeAreaChart from './LakeAreaChart';

interface LakeData {
  date: string;
  percent_full: number;
}

interface LakeDataDashboardProps {
  lakeData: LakeData[];
}

const LakeDataDashboard: React.FC<LakeDataDashboardProps> = ({ lakeData }) => {
  // Format data for the chart
  const formattedData = lakeData.map((entry) => ({
    year: new Date(entry.date).getFullYear(), // For XAxis
    date: entry.date, // Preserve original date
    percent_full: entry.percent_full,
  }));

  const chartConfig = {
    percentFull: { label: 'Percent Full', color: '#8884d8' },
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ChartContainer config={chartConfig} className="min-w-full">
        <LakeAreaChart data={formattedData} />
      </ChartContainer>
    </div>
  );
};

export default LakeDataDashboard;
