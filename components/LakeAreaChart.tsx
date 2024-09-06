'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

interface ChartData {
  year: number;
  date: string;
  percent_full: number;
}

interface LakeAreaChartProps {
  data: ChartData[];
}

const LakeAreaChart: React.FC<LakeAreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPercentFull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3e30ff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#18deb0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" />
        <YAxis domain={[0, 100]} unit="%" />
        <Tooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, props) => {
                const date = new Date(props.payload.date).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  },
                );
                return (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    <div>{`Date: ${date}`}</div>
                    <div>{`Percent Full: ${value}%`}</div>
                  </div>
                );
              }}
            />
          }
        />
        <Area
          type="natural"
          dataKey="percent_full"
          stroke="#18e2d1"
          strokeWidth={1.5}
          fill="url(#colorPercentFull)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LakeAreaChart;
