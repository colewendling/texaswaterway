import React from 'react';
import { lakes, Lake } from '@/lib/data/lakes';
import { notFound } from 'next/navigation';
import { fetchLakeData } from '@/app/actions/lakeDataActions';
import LakeDashboard from '@/components/LakeDashboard';

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
    <div className="w-full h-full min-h-screen p-4 flex flex-col items-center">
      <LakeDashboard lake={lakeData} lakeFileData={lakeFileData} />
    </div>
  );
};

export default LakeDataPage;
