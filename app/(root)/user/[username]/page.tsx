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
      <section className="profile">
        <div className="profile-card">
          <div className="profile-title-container">
            <h3 className="profile-title">{user.name}</h3>
          </div>
          <div className="profile-image-container">
            <Image
              src={user.image}
              alt={user.name}
              fill
              sizes="220px"
              className="profile-image"
            />
          </div>
          <p className="profile-username">@{user?.username}</p>
          <p className="profile-bio">{user?.bio}</p>
          <div className="profile-friendlist">
            <FriendList
              friends={user?.friends}
              sessionId={session?.id || null}
              userId={user._id}
              isOwnProfile={isOwnProfile}
              isFriend={isFriend}
            />
          </div>
        </div>
        <div className="profile-events-container">
          <div className="profile-events-title-container">
            <p className="profile-events-title">
              {session?.id === user._id
                ? 'Your'
                : `${user.name.split(' ')[0]}'s`}{' '}
              Events
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
