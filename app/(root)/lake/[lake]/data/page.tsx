import React from 'react';
import { lakes, Lake } from '@/lib/data/lakes';
import { notFound } from 'next/navigation';
import { fetchLakeData } from '@/app/actions/lakeDataActions';
import LakeDataDashboard from '@/components/LakeDataDashboard';

interface DataPageProps {
  params: { lake: string };
}

const LakeDataPage = async ({ params }: DataPageProps) => {
  const { lake } = await Promise.resolve(params);
  const lakeData: Lake | undefined = lakes.find((l) => l.id === lake);

  if (!lakeData) {
    notFound();
  }

  const lakeFileData = await fetchLakeData(lakeData.id);

  return (
    <div className="w-full h-full min-h-screen px-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold">{lakeData.name} Dashboard</h2>
      <LakeDataDashboard lakeData={lakeFileData} />
    </div>
  );
};

export default LakeDataPage;
