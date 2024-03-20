import React, { Suspense } from 'react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import UserEvents from '@/components/UserEvents';
import { EventCardSkeleton } from '@/components/EventCard';
import EditButton from '@/components/EditButton';

export const experimental_ppr = true;

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<{ edit?: string }>;
}) => {
  const id = (await params).id;
  const session = await getServerSession(authOptions);

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  const editMode = (await searchParams).edit === 'true';

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>
          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />
          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <div className="flex items-center justify-between">
            <p className="text-30-bold">
              {session?.id === id ? 'Your' : 'All'} Events
            </p>
            {session?.id === id && <EditButton editMode={editMode} />}
          </div>
          <ul className="card_grid-sm">
            <Suspense fallback={<EventCardSkeleton />}>
              <UserEvents id={id} editMode={editMode} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
