import { redirect } from 'next/navigation';

// Handles /lake and redirects to /map
const LakePage = async () => {
  redirect('/map');
};

export default LakePage;
