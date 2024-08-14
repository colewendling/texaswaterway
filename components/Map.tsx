'use client';

import { useEffect, useState } from 'react';
import * as d3 from 'd3-geo';
import { lakes } from '@/lib/data/lakes';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './ui/tooltip';

function Map() {
  const [texasBorder, setTexasBorder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchGeoJson() {
      const response = await fetch('/data/texas.geojson');
      const geoJson = await response.json();
      setTexasBorder(geoJson);
    }
    fetchGeoJson();
  }, []);

  if (!texasBorder) return <p className="text-center">Loading map...</p>;

  // Create a projection to fit Texas into an SVG viewport
  const projection = d3.geoAlbersUsa().fitSize([480, 480], texasBorder);
  const pathGenerator = d3.geoPath().projection(projection);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex justify-center items-center h-screen bg-gray-100 relative">
        <svg width="500" height="500" className="border border-black bg-white">
          {/* Render Texas border with padding */}
          <g transform="translate(10, 10)">
            <path d={pathGenerator(texasBorder)} fill="none" stroke="black" />
            {/* Render lakes */}
            {lakes.map((lake) => {
              const [x, y] = projection(lake.coordinates) || [0, 0]; // Protect against undefined projection
              return (
                <Tooltip key={lake.id}>
                  <TooltipTrigger asChild>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="blue"
                      className="cursor-pointer"
                      onClick={() => router.push(`/lake/${lake.id}`)}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-black text-white p-2 rounded shadow"
                  >
                    {lake.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </g>
        </svg>
      </div>
    </TooltipProvider>
  );
}

export default Map;
