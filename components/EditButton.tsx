'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const EditButton = ({ editMode }: { editMode: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleEdit = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (editMode) {
      newSearchParams.delete('edit');
    } else {
      newSearchParams.set('edit', 'true');
    }
    router.replace(`?${newSearchParams.toString()}`);
  };

  return (
    <button onClick={toggleEdit} className="btn-primary text-20-medium">
      {editMode ? 'Done' : 'Edit'}
    </button>
  );
};

export default EditButton;
