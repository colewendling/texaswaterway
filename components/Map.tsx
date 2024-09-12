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

  // Define the SVG's viewBox dimensions
  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 500;

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

  // Format legend labels with < and > symbols
  const formattedLegendLabels = [
    `< ${legendValues[1].toFixed(1)}`,
    `${legendValues[1].toFixed(1)} - ${legendValues[2].toFixed(1)}`,
    `${legendValues[2].toFixed(1)} - ${legendValues[3].toFixed(1)}`,
    `> ${legendValues[3].toFixed(1)}`,
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full h-[40vh] lg:h-[60vh] relative">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
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
        {/* Legend */}
        <div
          className="absolute md:-bottom-0 md:left-10  -bottom-10 left-0 p-2 rounded  flex flex-col items-center space-y-0.5 md:space-y-2 sm:p-3 sm:space-y-1 bg-white border shadow-lg shadow-black/20"
          aria-labelledby="lake-size-legend"
        >
          <h2 id="lake-size-legend" className="text-xs font-semibold sm:mb-1">
            Lake Size Legend
          </h2>
          {legendValues.map((value, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 sm:space-x-1"
            >
              <svg
                width={getRadius(value) * 2}
                height={getRadius(value) * 2}
                aria-hidden="true"
              >
                <circle
                  cx={getRadius(value)}
                  cy={getRadius(value)}
                  r={getRadius(value)}
                  className={`${getColorClass(value)}`}
                />
              </svg>
              <span className="text-xs sm:text-[10px]">
                {formattedLegendLabels[index]} mi<sup>2</sup>
              </span>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default Map;
