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

  // Configurable radius range
  const MIN_RADIUS = 4;
  const MAX_RADIUS = 8;

  // Define Tailwind color classes from light to dark
  const colorClasses = [
    'fill-blue-400',
    'fill-blue-600',
    'fill-blue-700',
    'fill-blue-800',
  ];
  const legendLabels = ['Small', 'Medium', 'Large', 'Extra Large']; // Adjust based on colorClasses length

  useEffect(() => {
    async function fetchGeoJson() {
      try {
        const response = await fetch('/data/texas.geojson');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const geoJson = await response.json();
        setTexasBorder(geoJson);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    }
    fetchGeoJson();
  }, []);

  if (!texasBorder) return <p className="text-center">Loading map...</p>;

  // Create a projection to fit Texas into an SVG viewport
  const projection = d3.geoAlbersUsa().fitSize([480, 480], texasBorder);
  const pathGenerator = d3.geoPath().projection(projection);

  // Calculate size scaling
  const sizes = lakes.map((lake) => lake.size);

  // Determine the minimum and maximum lake sizes
  const minSize = Math.min(...sizes);
  const maxSize = Math.max(...sizes);

  // Define a simple linear scaling function
  const getRadius = (size: number): number => {
    if (maxSize === minSize) {
      // Avoid division by zero if all lakes have the same size
      return (MIN_RADIUS + MAX_RADIUS) / 2; // Default radius
    }
    // Linear scaling: radius = MIN_RADIUS + ((size - minSize) / (maxSize - minSize)) * (MAX_RADIUS - MIN_RADIUS)
    return (
      MIN_RADIUS +
      ((size - minSize) / (maxSize - minSize)) * (MAX_RADIUS - MIN_RADIUS)
    );
  };

  // Define a simple linear scaling function for color
  const getColorClass = (size: number): string => {
    if (maxSize === minSize) {
      // If all lakes have the same size, assign the middle color
      return colorClasses[Math.floor(colorClasses.length / 2)];
    }
    // Normalize the size between 0 and 1
    const normalized = (size - minSize) / (maxSize - minSize);

    // Determine which color class to use based on normalized value
    // Distribute sizes evenly across color classes
    const index = Math.min(
      Math.floor(normalized * colorClasses.length),
      colorClasses.length - 1,
    );

    return colorClasses[index];
  };

  // Example: Determine radii for legend circles
  const legendValues = [
    minSize,
    minSize + (maxSize - minSize) * 0.33,
    minSize + (maxSize - minSize) * 0.66,
    maxSize,
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex justify-center items-center h-screen relative max-h-[550px]">
        <svg width="500" height="500" className="">
          {/* Render Texas border with padding */}
          <g transform="translate(10, 10)">
            <path
              d={pathGenerator(texasBorder)}
              fill="white"
              stroke="black"
              strokeWidth={2}
            />
            {/* Render lakes */}
            {lakes.map((lake) => {
              const [x, y] = projection(lake.coordinates) || [0, 0]; // Protect against undefined projection
              return (
                <Tooltip key={lake.id}>
                  <TooltipTrigger asChild>
                    <circle
                      cx={x}
                      cy={y}
                      r={getRadius(lake.size)}
                      className={`cursor-pointer ${getColorClass(lake.size)} transform transition-transform duration-200 ease-in-out hover:scale-150 [transform-origin:center] [transform-box:fill-box]`}
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
