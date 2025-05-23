import React from 'react';
import { notFound } from 'next/navigation';
import LakeNav from '@/components/LakeNav';
import { lakes, Lake } from '@/lib/data/lakes';
import LakeDropdown from '@/components/LakeDropdown';

interface LakeLayoutProps {
  children: React.ReactNode;
  params: { lake: string };
}

const LakeLayout = async ({ children, params }: LakeLayoutProps) => {
  const { lake } = await Promise.resolve(params);
  const lakeData: Lake | undefined = lakes.find((l) => l.id === lake);

  if (!lake) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="hero-container">
        <h1 className="heading">{lakeData?.name}</h1>
        <h1 className="font-semibold text-2xl">
          <span className="text-black">Live Data </span>
          <span className="hero-text-highlight text-white">Dashboard</span>
        </h1>
        <LakeDropdown currentLakeId={lakeData?.id || ''} lakes={lakes} />
        <img
          src="/art/lake-left.png"
          alt="Events Left"
          className="hero-art-left"
        />
        <img
          src="/art/lake-right.png"
          alt="Events Right"
          className="hero-art-right"
        />
      </section>
      <LakeNav lakeId={lakeData?.id || ''} />
      <div className="flex flex-col w-full flex-grow min-h-screen items-center justify-center px-8">
        {children}
      </div>
    </div>
  );
};

export default LakeLayout;
