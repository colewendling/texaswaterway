import React, { Suspense } from 'react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { client } from '@/sanity/lib/client';
import { USER_BY_USERNAME_QUERY } from '@/sanity/lib/queries/userQueries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import UserEvents from '@/components/UserEvents';
import { EventCardSkeleton } from '@/components/EventCard';
import EditButton from '@/components/EditButton';
import FriendList from '@/components/FriendList';

export const experimental_ppr = true;

const Page = async ({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: Promise<{ edit?: string }>;
}) => {
  const username = (await params).username;
  const session = await getServerSession(authOptions);

  const user = await client.fetch(USER_BY_USERNAME_QUERY, { username });
  if (!user) return notFound();

  const editMode = (await searchParams).edit === 'true';

  const isOwnProfile = session?.id === user._id;

  const isFriend = user?.friends?.some(
    (friend: { _id: string }) => friend._id === session?.id,
  );

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>
          <div className="relative w-[220px] h-[220px] rounded-full overflow-hidden shadow-md">
            <Image
              src={user.image}
              alt={user.name}
              fill
              sizes="220px"
              className="profile_image"
            />
          </div>
          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
          <div className="profile_friendlist">
            <FriendList
              friends={user?.friends}
              sessionId={session?.id || null}
              userId={user._id}
              isOwnProfile={isOwnProfile}
              isFriend={isFriend}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <div className="flex items-center justify-between">
            <p className="text-30-bold">
              {session?.id === user._id ? 'Your' : 'All'} Events
            </p>
            {session?.id === user._id && <EditButton editMode={editMode} />}
          </div>
          <ul className="card-grid-sm">
            <Suspense fallback={<EventCardSkeleton />}>
              <UserEvents id={user._id} editMode={editMode} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
