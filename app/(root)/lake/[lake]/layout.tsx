import React from 'react';
import { notFound } from 'next/navigation';
import LakeNav from '@/components/LakeNav';
import { lakes, Lake } from '@/lib/data/lakes';

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

      {/* LakeNav Navigation */}
      <LakeNav lakeId={lakeData?.id || ''} />

      {/* Content */}
      <div className="flex flex-col w-full flex-grow min-h-screen items-center justify-center px-8">
        {children}
      </div>
    </div>
  );
};

export default LakeLayout;
