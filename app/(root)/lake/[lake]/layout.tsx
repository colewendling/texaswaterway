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
    <div className="">
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
      <div className="flex flex-row">
        <LakeNav lakeId={lakeData?.id} />
        <main className="flex flex-col w-full items-center justify-center min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LakeLayout;
