'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Fish, Grid2x2Check } from 'lucide-react';

interface LakeNavProps {
  lakeId: string;
}

const LakeNav: React.FC<LakeNavProps> = ({ lakeId }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-slate-700 text-white flex justify-center space-x-4 py-2">
      {/* Data */}
      <Link
        href={`/lake/${lakeId}/data`}
        className={`flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-slate-600 ${
          isActive(`/lake/${lakeId}/data`) ? 'font-bold text-primary' : ''
        }`}
      >
        <Grid2x2Check size={20} />
        <span>Data</span>
      </Link>

      {/* Events */}
      <Link
        href={`/lake/${lakeId}/events`}
        className={`flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-slate-600 ${
          isActive(`/lake/${lakeId}/events`) ? 'font-bold text-primary' : ''
        }`}
      >
        <Calendar size={20} />
        <span>Events</span>
      </Link>

      {/* Fish */}
      <Link
        href={`/lake/${lakeId}/fish`}
        className={`flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-slate-600 ${
          isActive(`/lake/${lakeId}/fish`) ? 'font-bold text-primary' : ''
        }`}
      >
        <Fish size={20} />
        <span>Fish</span>
      </Link>
    </nav>
  );
};

export default LakeNav;
