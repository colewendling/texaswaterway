'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

interface AverageMonthlyPercentFullProps {
  lake: {
    id: string;
    name: string;
    coordinates: [number, number];
    fish: string[];
    size: number;
    anglingOpportunities: Record<string, string>;
  };
  lakeFileData: {
    date: string;
    reservoir_storage: number | null;
    percent_full: number;
    conservation_capacity: number;
  }[];
}

interface MonthlyAverage {
  month: string;
  average: number;
}

const AverageMonthlyPercentFull: React.FC<AverageMonthlyPercentFullProps> = ({
  lake,
  lakeFileData,
}) => {
  // Calculate average percent_full per month
  const monthlyAverages: MonthlyAverage[] = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      total: 0,
      count: 0,
    }));

    lakeFileData.forEach((entry) => {
      if (entry.percent_full !== null) {
        const date = new Date(entry.date);
        const monthIndex = date.getMonth();
        months[monthIndex].total += entry.percent_full;
        months[monthIndex].count += 1;
      }
    });

    return months.map((m) => ({
      month: m.month,
      average: m.count > 0 ? parseFloat((m.total / m.count).toFixed(2)) : 0,
    }));
  }, [lakeFileData]);

  // Assign colors based on average values
  const coloredData = useMemo(() => {
    // Sort months by average ascending
    const sorted = [...monthlyAverages].sort((a, b) => a.average - b.average);
    return monthlyAverages.map((item) => {
      const rank = sorted.findIndex((m) => m.month === item.month) + 1;
      let fill = '#bbdefb'; // blue-100

      if (rank >= 1 && rank <= 3) {
        fill = '#bbdefb'; // blue-100
      } else if (rank >= 4 && rank <= 6) {
        fill = '#64b5f6'; // blue-300
      } else if (rank >= 7 && rank <= 9) {
        fill = '#1e88e5'; // blue-600
      } else if (rank >= 10 && rank <= 12) {
        fill = '#1565c0'; // blue-800
      }

      return { ...item, fill };
    });
  }, [monthlyAverages]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={coloredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="average">
            {coloredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AverageMonthlyPercentFull;
