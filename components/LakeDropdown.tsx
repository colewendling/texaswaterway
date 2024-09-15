'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Lake } from '@/lib/data/lakes';
import { ChevronDown } from 'lucide-react';

interface LakeDropdownProps {
  currentLakeId: string;
  lakes: Lake[];
}

const LakeDropdown: React.FC<LakeDropdownProps> = ({
  currentLakeId,
  lakes,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLakeId = e.target.value;

    // Regular expression to replace the current lake ID in the path
    const newPath = pathname.replace(
      /\/lake\/[^/]+/,
      `/lake/${selectedLakeId}`,
    );
    setIsLoading(true);
    router.push(newPath);
    setTimeout(() => {
      setIsLoading(false); // Set loading back to false after 2 seconds
    }, 2000);
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <h2 className="mb-2 font-semibold text-white">
        {isLoading ? 'Loading...' : 'Current Lake:'}
      </h2>
      <div className="flex relative">
        <select
          id="lake-select"
          value={currentLakeId}
          onChange={handleChange}
          className="w-full sm:w-64 py-2 px-4 border border-gray-300 hover:bg-blue-100 rounded-full text-center font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          {lakes.map((lake) => (
            <option key={lake.id} value={lake.id}>
              {lake.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-2 text-gray-500 hover:text-primary pointer-events-none" />
      </div>
    </div>
  );
};

export default LakeDropdown;
