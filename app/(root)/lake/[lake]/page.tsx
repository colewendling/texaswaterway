import { redirect } from 'next/navigation';

interface LakePageProps {
  params: { lake: string };
}

const LakePage = ({ params }: LakePageProps) => {
  redirect(`/lake/${params.lake}/data`);
  return null; // Optionally, return null as redirect halts further rendering
};

export default LakePage;
