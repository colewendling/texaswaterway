import React from 'react';
import { notFound } from 'next/navigation';
import { lakes, Lake } from '@/lib/data/lakes';

import FishCard from '@/components/FishCard';
import { fishData } from '@/lib/data/fish';
import AnglingOpportunities from '@/components/AnglingOpportunities';
import FishingLimits from '@/components/FishingLimits';

interface LakeFishPageProps {
  params: { lake: string };
}

const LakeFishPage = async ({ params }: LakeFishPageProps) => {
  // Await the params Promise to unwrap it
  const resolvedParams = await params;
  const lakeId = resolvedParams.lake;

  // Find the lake based on the ID
  const lake: Lake | undefined = lakes.find((l) => l.id === lakeId);

  // If lake not found, render 404 page
  if (!lake) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold">
        Fishing Information for {lake.name}
      </h2>
      <h2 className="text-xl font-semibold pt-8 pb-3 text-primary">
        Angling Opportunities
      </h2>
      <AnglingOpportunities lake={lake} />
      <h2 className="text-xl font-semibold pt-8 pb-3 text-primary">
        {lake.name} Fish Species
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lake.fish.map((fishName) => {
          const fish = fishData[fishName];
          if (!fish) return null; // Handle missing fish data
          return <FishCard key={fish.name} fish={fish} />;
        })}
      </div>
      {/* Fishing Limits Section */}
      <FishingLimits />
    </div>
  );
};

export default LakeFishPage;
