import React from 'react';

export const experimental_ppr = true;

const Page = async ({params}: {params: Promise<{id: string}>}) => {
  const id = (await params).id;

  return (
   <>
   <h1 className='text-3xl'>This is a Event Number: {id}</h1>
   </>
  );
};

export default Page;