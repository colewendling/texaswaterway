'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { getWeather } from '@/app/actions/weatherActions';
import { Skeleton } from '../ui/skeleton';

interface WeatherWidgetProps {
  lake: {
    name: string;
    coordinates: [number, number];
  };
}

interface Forecast {
  time: string;
  temp: number;
  condition: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lake }) => {
  const [weather, setWeather] = useState<{
    currentTemp: number;
    high: number;
    low: number;
    forecast: Forecast[];
  } | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      const [lon, lat] = lake.coordinates;
      const data = await getWeather(lat, lon);
      setWeather(data);
    }
    fetchWeather();
  }, [lake]);

  const renderIcon = (condition: string) => {
    switch (condition) {
      case 'Clear':
        return <Sun size={24} />;
      case 'Clouds':
        return <Cloud size={24} />;
      case 'Rain':
        return <CloudRain size={24} />;
      case 'Snow':
        return <Snowflake size={24} />;
      default:
        return <Cloud size={24} />;
    }
  };

  if (!weather)
    return (
      <Skeleton className="flex items-center justify-center py-2 border-2 w-full h-[80%] rounded-lg bg-slate-200 animate-pulse shadow-md shadow-slate-500/50 !important">
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </Skeleton>
    );

  return (
    <div className="flex flex-col justify-center items-center h-[80%] w-full">
      {/* Compact View */}
      <div className="block sm:hidden text-center">
        <p className="text-4xl font-bold text-primary">
          {weather.currentTemp}°
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-sm">L:{weather.low}°</span>
          <span className="text-sm">H:{weather.high}°</span>
        </div>
        <div className="flex justify-center mt-4 text-primary">
          {renderIcon(weather.forecast[0]?.condition)}
        </div>
      </div>

      {/* Expanded View */}
      <div className="hidden sm:flex flex-col flex-1 justify-center items-center">
        <p className="text-3xl font-bold my-4 text-primary text-center">
          {weather.currentTemp}°
        </p>
        <div className="flex justify-between items-center text-sm w-full mb-4">
          <span>
            Low:{' '}
            <span className="text-primary font-semibold">{weather.low}°</span>
          </span>
          <span>
            High:{' '}
            <span className="text-primary font-semibold">{weather.high}°</span>
          </span>
        </div>
        <div className="flex gap-6 md:gap-8 justify-between items-end">
          {weather.forecast.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <p className="text-gray-500 text-sm mb-2">{item.time}</p>
              <div className="text-primary">{renderIcon(item.condition)}</div>
              <p>{item.temp}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
