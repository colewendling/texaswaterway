import { redirect } from 'next/navigation';

interface LakePageProps {
  params: { lake: string };
}

// Handles /lake/[lake] and redirects to /lake/[lake]/data
const LakePage: React.FC<LakePageProps> = ({ params }) => {
  redirect(`/lake/${params.lake}/data`);
};

export default LakePage;
