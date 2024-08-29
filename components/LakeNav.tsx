'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Fish,
  Grid2x2Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface LakeNavProps {
  lakeId: string;
}

const LakeNav: React.FC<LakeNavProps> = ({ lakeId }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleNav = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={`border-r border-gray-300 bg-slate-700 text-white pt-2 ${
        isCollapsed ? 'w-[20]' : 'w-40'
      }`}
    >
      <div className="sticky top-2 bg-slate-700 z-10">
        {/* Chevron Toggle */}
        <div
          className="flex items-center justify-end px-2 cursor-pointer"
          onClick={toggleNav}
        >
          {isCollapsed ? (
            <ChevronRight className="text-white size-6" />
          ) : (
            <ChevronLeft className="text-white size-6 " />
          )}
        </div>

        {/* Navigation Links */}
        {!isCollapsed && (
          <ul className="space-y-4 p-4">
            <li
              className={`flex items-center ${
                isActive(`/lake/${lakeId}/data`)
                  ? 'font-bold text-primary'
                  : 'text-white'
              }`}
            >
              <Grid2x2Check className="mr-2" size={20} />
              <Link href={`/lake/${lakeId}/data`}>Data</Link>
            </li>
            <li
              className={`flex items-center ${
                isActive(`/lake/${lakeId}/events`)
                  ? 'font-bold text-primary'
                  : 'text-white'
              }`}
            >
              <Calendar className="mr-2" size={20} />
              <Link href={`/lake/${lakeId}/events`}>Events</Link>
            </li>
            <li
              className={`flex items-center ${
                isActive(`/lake/${lakeId}/fish`)
                  ? 'font-bold text-primary'
                  : 'text-white'
              }`}
            >
              <Fish className="mr-2" size={20} />
              <Link href={`/lake/${lakeId}/fish`}>Fish</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default LakeNav;
